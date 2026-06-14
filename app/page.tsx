"use client";

import { useEffect, useRef, useState } from "react";

// ─── Shaders ──────────────────────────────────────────────────────────────────

const QUAD_VS = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

// Simulation: advection + diffusion + fade + ink injection
const SIM_FS = `
precision highp float;
uniform sampler2D u_prev;
uniform vec2  u_res;
uniform vec2  u_mouse;
uniform vec2  u_pmouse;
uniform float u_speed;

void main() {
  vec2 uv  = gl_FragCoord.xy / u_res;
  float px = 1.0 / u_res.x;
  float py = 1.0 / u_res.y;

  // Advect: trace backwards along mouse velocity
  vec2 vel = (u_mouse - u_pmouse) * 6.0;
  float adv = texture2D(u_prev, uv - vel).r;

  // 3x3 diffusion kernel (blur spreads ink naturally)
  float s =
    texture2D(u_prev, uv + vec2(-px,-py)).r * 0.0625 +
    texture2D(u_prev, uv + vec2(  0,-py)).r * 0.125  +
    texture2D(u_prev, uv + vec2( px,-py)).r * 0.0625 +
    texture2D(u_prev, uv + vec2(-px,  0)).r * 0.125  +
    texture2D(u_prev, uv               ).r * 0.25   +
    texture2D(u_prev, uv + vec2( px,  0)).r * 0.125  +
    texture2D(u_prev, uv + vec2(-px, py)).r * 0.0625 +
    texture2D(u_prev, uv + vec2(  0, py)).r * 0.125  +
    texture2D(u_prev, uv + vec2( px, py)).r * 0.0625;

  float ink = mix(adv, s, 0.18);

  // Slow fade (ink evaporates)
  ink *= 0.9905;

  // Inject ink at cursor
  float d = length(uv - u_mouse);
  float brush = exp(-d * d * 9000.0) * u_speed * 1.2;
  ink = clamp(ink + brush, 0.0, 1.0);

  gl_FragColor = vec4(ink, 0.0, 0.0, 1.0);
}
`;

// Display: convert simulation density → ink-on-paper look
const DISPLAY_FS = `
precision highp float;
uniform sampler2D u_ink;
uniform vec2 u_res;

// Tiny noise for organic paper grain
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }

void main() {
  vec2 uv  = gl_FragCoord.xy / u_res;
  float ink = texture2D(u_ink, uv).r;

  // Non-linear: concentrated ink is much darker (natural ink behaviour)
  ink = pow(ink, 0.65);

  // Subtle paper grain
  float grain = (hash(uv * 800.0) - 0.5) * 0.012;

  // Warm white paper × dark navy ink
  vec3 paper = vec3(0.982, 0.978, 0.972) + grain;
  vec3 inkCol = vec3(0.07, 0.08, 0.14);

  vec3 col = mix(paper, inkCol, clamp(ink, 0.0, 1.0));
  gl_FragColor = vec4(col, 1.0);
}
`;

// ─── WebGL helpers ────────────────────────────────────────────────────────────
function buildProgram(gl: WebGLRenderingContext, vs: string, fs: string) {
  const compile = (src: string, type: number) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const p = gl.createProgram()!;
  gl.attachShader(p, compile(vs, gl.VERTEX_SHADER));
  gl.attachShader(p, compile(fs, gl.FRAGMENT_SHADER));
  gl.linkProgram(p);
  return p;
}

function makeTexture(gl: WebGLRenderingContext, w: number, h: number) {
  const t = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return t;
}

function makeFBO(gl: WebGLRenderingContext, tex: WebGLTexture) {
  const fb = gl.createFramebuffer()!;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return fb;
}

// ─── Ink Canvas ───────────────────────────────────────────────────────────────
function InkCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    // Simulation runs at fixed size for consistent quality & performance
    const SIM = 512;

    const simProg     = buildProgram(gl, QUAD_VS, SIM_FS);
    const displayProg = buildProgram(gl, QUAD_VS, DISPLAY_FS);

    // Ping-pong textures
    const texA = makeTexture(gl, SIM, SIM);
    const texB = makeTexture(gl, SIM, SIM);
    const fboA = makeFBO(gl, texA);
    const fboB = makeFBO(gl, texB);
    let read = { tex: texA, fbo: fboA };
    let write = { tex: texB, fbo: fboB };

    // Quad buffer (shared)
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    const bindQuad = (prog: WebGLProgram) => {
      gl.useProgram(prog);
      const a = gl.getAttribLocation(prog, "a_pos");
      gl.enableVertexAttribArray(a);
      gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    };

    // Uniform locations – simulation
    bindQuad(simProg);
    const uPrev   = gl.getUniformLocation(simProg, "u_prev");
    const uSimRes = gl.getUniformLocation(simProg, "u_res");
    const uMouse  = gl.getUniformLocation(simProg, "u_mouse");
    const uPMouse = gl.getUniformLocation(simProg, "u_pmouse");
    const uSpeed  = gl.getUniformLocation(simProg, "u_speed");

    // Uniform locations – display
    bindQuad(displayProg);
    const uInk     = gl.getUniformLocation(displayProg, "u_ink");
    const uDispRes = gl.getUniformLocation(displayProg, "u_res");

    const mouse  = { x: 0.5, y: 0.5 };
    const pmouse = { x: 0.5, y: 0.5 };
    let speed = 0;
    let lastX = -1, lastY = -1;
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      canvas.width  = window.innerWidth  * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      pmouse.x = mouse.x;
      pmouse.y = mouse.y;
      mouse.x = e.clientX / window.innerWidth;
      mouse.y = 1 - e.clientY / window.innerHeight;
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      speed = Math.min(Math.sqrt(dx*dx + dy*dy) / 60, 1.0);
      lastX = e.clientX; lastY = e.clientY;
    };
    window.addEventListener("mousemove", onMove);

    const render = () => {
      // ── Simulation pass ──────────────────────────────
      gl.bindFramebuffer(gl.FRAMEBUFFER, write.fbo);
      gl.viewport(0, 0, SIM, SIM);
      bindQuad(simProg);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, read.tex);
      gl.uniform1i(uPrev,   0);
      gl.uniform2f(uSimRes, SIM, SIM);
      gl.uniform2f(uMouse,  mouse.x,  mouse.y);
      gl.uniform2f(uPMouse, pmouse.x, pmouse.y);
      gl.uniform1f(uSpeed,  speed);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      // Swap
      [read, write] = [write, read];
      speed *= 0.82; // dampen

      // ── Display pass ─────────────────────────────────
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      bindQuad(displayProg);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, read.tex);
      gl.uniform1i(uInk,     0);
      gl.uniform2f(uDispRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", zIndex: 0, display: "block" }}
    />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".sr").forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const glass = {
    background: "rgba(255,255,255,0.72)",
    backdropFilter: "blur(28px)",
    WebkitBackdropFilter: "blur(28px)",
    border: "1px solid rgba(255,255,255,0.6)",
    boxShadow: "0 8px 40px rgba(0,0,0,0.05)",
  } as const;

  const glassStrong = {
    background: "rgba(255,255,255,0.88)",
    backdropFilter: "blur(32px)",
    WebkitBackdropFilter: "blur(32px)",
    border: "1px solid rgba(255,255,255,0.7)",
    boxShadow: "0 12px 48px rgba(0,0,0,0.07)",
  } as const;

  return (
    <>
      <InkCanvas />

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ── Nav ─────────────────────────────── */}
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          height: navScrolled ? 60 : 70,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 48px",
          transition: "height 0.3s ease",
          ...glassStrong,
          borderRadius: 0,
          borderTop: "none", borderLeft: "none", borderRight: "none",
        }}>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{ background: "none", border: "none", cursor: "pointer",
              fontSize: 22, fontWeight: 900, color: "#1a1a2e", letterSpacing: "-0.03em" }}>
            80
          </button>

          <div style={{ display: "flex", gap: 36 }}>
            {([["事業内容","business"],["プロダクト","product"],["会社について","about"]] as const).map(([l, id]) => (
              <button key={id} onClick={() => scrollTo(id)}
                style={{ background: "none", border: "none", cursor: "pointer",
                  fontSize: 14, fontWeight: 500, color: "#4a5568", letterSpacing: "0.01em",
                  transition: "color 0.2s", fontFamily: "inherit" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#1a1a2e")}
                onMouseLeave={e => (e.currentTarget.style.color = "#4a5568")}>
                {l}
              </button>
            ))}
          </div>

          <button onClick={() => scrollTo("contact")}
            style={{ padding: "9px 24px", borderRadius: 6,
              border: "1.5px solid #1a1a2e", background: "transparent",
              color: "#1a1a2e", fontSize: 13, fontWeight: 600, cursor: "pointer",
              transition: "all 0.2s", fontFamily: "inherit" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#1a1a2e"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1a1a2e"; }}>
            お問い合わせ
          </button>
        </nav>

        {/* ── Hero ────────────────────────────── */}
        <section style={{ minHeight: "100vh", display: "flex", alignItems: "center",
          justifyContent: "center", padding: "80px 48px 0" }}>
          <div style={{ textAlign: "center", maxWidth: 820 }}>
            <p style={{ fontSize: 12, letterSpacing: "0.22em", color: "#6366f1",
              fontWeight: 700, textTransform: "uppercase", marginBottom: 28,
              animation: "fade-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s both" }}>
              合同会社80
            </p>

            <h1 style={{ fontSize: "clamp(52px, 8.5vw, 100px)", fontWeight: 800,
              color: "#1a1a2e", lineHeight: 1.12, letterSpacing: "-0.04em", marginBottom: 32,
              animation: "fade-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.25s both" }}>
              人の知覚を、<br />
              <span style={{ color: "#6366f1" }}>ソフトウェアで</span><br />
              拡張する。
            </h1>

            <p style={{ fontSize: 17, color: "#475569", lineHeight: 1.85, marginBottom: 52,
              animation: "fade-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.4s both" }}>
              テクノロジーの恩恵を、すべての現場へ。
            </p>

            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap",
              animation: "fade-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.55s both" }}>
              <button className="btn-primary-light" onClick={() => scrollTo("business")}>
                事業内容を見る
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <button className="btn-outline-light" onClick={() => scrollTo("contact")}>
                お問い合わせ
              </button>
            </div>

            <div style={{ marginTop: 80, display: "flex", flexDirection: "column",
              alignItems: "center", gap: 10, color: "#94a3b8", fontSize: 10,
              letterSpacing: "0.22em", textTransform: "uppercase",
              animation: "fade-in 1s ease 1.2s both" }}>
              <span>Scroll</span>
              <div style={{ width: 1, height: 48,
                background: "linear-gradient(to bottom, #94a3b8, transparent)",
                animation: "scroll-line 2.2s ease-in-out infinite" }} />
            </div>
          </div>
        </section>

        {/* ── Business ────────────────────────── */}
        <section id="business" style={{ padding: "120px 48px" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <div className="sr" style={{ marginBottom: 64 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em",
                color: "#6366f1", marginBottom: 16, textTransform: "uppercase" }}>
                Business
              </div>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800,
                letterSpacing: "-0.03em", lineHeight: 1.2, color: "#1a1a2e" }}>
                3つの事業領域
              </h2>
              <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.9, marginTop: 14, maxWidth: 420 }}>
                パッケージ製品・AI受託開発・Webデザインの3軸で、<br />
                クライアントのデジタル変革を支援します。
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {[
                {
                  n: "01", color: "#6366f1", bg: "#eef2ff", label: "SaaS Package",
                  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
                  title: "パッケージ販売", sub: "LENDS AI など",
                  desc: "自社開発のSaaSプロダクトを提供。LENDS AIは組織コンディションをスマホアンケート×AIで可視化し、人事課題の早期発見を支援します。",
                  delay: "0s",
                },
                {
                  n: "02", color: "#8b5cf6", bg: "#f5f3ff", label: "AI Development",
                  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.8"><path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2"/></svg>,
                  title: "AI受託開発", sub: "",
                  desc: "ChatGPT・LLM・RAGを活用した業務効率化ツール、データ分析システム、AIチャットボットなどをオーダーメイドで開発します。",
                  delay: "0.1s",
                },
                {
                  n: "03", color: "#0891b2", bg: "#ecfeff", label: "Web Design",
                  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0891b2" strokeWidth="1.8"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M7 8h2M7 12h2M13 8h4M13 12h4"/></svg>,
                  title: "HP制作デザイン", sub: "",
                  desc: "ブランドの価値を最大化するWebサイト制作。戦略的なUI/UXデザインと高品質な実装で、ビジネスの成果につながるサイトを届けます。",
                  delay: "0.2s",
                },
              ].map((item) => (
                <div key={item.n} className="sr glass-card" style={{ transitionDelay: item.delay }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#c7d2fe", marginBottom: 20, letterSpacing: "0.1em" }}>{item.n}</div>
                  <div style={{ width: 48, height: 48, borderRadius: 12, marginBottom: 24,
                    background: item.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {item.icon}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em",
                    color: item.color, marginBottom: 10, textTransform: "uppercase" }}>{item.label}</div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, lineHeight: 1.35,
                    letterSpacing: "-0.01em", color: "#1a1a2e" }}>
                    {item.title}
                    {item.sub && <><br /><span style={{ fontSize: 13, fontWeight: 400, color: "#94a3b8" }}>{item.sub}</span></>}
                  </h3>
                  <p style={{ fontSize: 14, lineHeight: 1.9, color: "#64748b" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Product ─────────────────────────── */}
        <section id="product" style={{ padding: "120px 48px" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <div className="sr" style={{ marginBottom: 64 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em",
                color: "#6366f1", marginBottom: 16, textTransform: "uppercase" }}>
                Featured Product
              </div>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800,
                letterSpacing: "-0.03em", lineHeight: 1.2, color: "#1a1a2e" }}>LENDS AI</h2>
              <p style={{ fontSize: 16, color: "#64748b", marginTop: 10 }}>組織コンディション可視化プラットフォーム</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
              <div className="sr">
                <h3 style={{ fontSize: "clamp(20px, 2.8vw, 30px)", fontWeight: 700,
                  lineHeight: 1.6, marginBottom: 20, letterSpacing: "-0.02em", color: "#1a1a2e" }}>
                  スマホアンケート × AI分析で、<br />従業員の「今」を見える化する。
                </h3>
                <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.9, marginBottom: 32 }}>
                  LENDS AIは毎月のアンケートをAIが分析し、組織コンディションを8タイプで可視化するSaaSです。人事課題の早期発見から採用・育成まで一気通貫で支援します。
                </p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, marginBottom: 36 }}>
                  {["月次スマホアンケート × AI組織診断","8タイプ組織コンディション可視化","1on1面談記録・アシスト機能","採用AI・採用KPI管理","採用アセスメント（心理・論理・コミュ・敬語）","要面談候補者アラートメール通知"].map(f => (
                    <li key={f} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, color: "#475569" }}>
                      <span style={{ width: 20, height: 20, borderRadius: 6, background: "#eef2ff",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="https://www.lens-ai.jp" target="_blank" rel="noopener noreferrer"
                  className="btn-primary-light" style={{ display: "inline-flex", textDecoration: "none" }}>
                  LENDS AI サイトへ
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6M10 14L21 3"/>
                  </svg>
                </a>
              </div>

              <div className="sr" style={{ transitionDelay: "0.15s" }}>
                <div style={{ ...glassStrong, borderRadius: 20, overflow: "hidden" }}>
                  <div style={{ background: "rgba(248,250,252,0.9)", padding: "14px 20px",
                    display: "flex", gap: 7, alignItems: "center",
                    borderBottom: "1px solid rgba(226,232,240,0.6)" }}>
                    {["#f87171","#fbbf24","#34d399"].map(c => (
                      <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.7 }} />
                    ))}
                    <div style={{ marginLeft: 10, fontSize: 11, color: "#94a3b8" }}>LENDS AI — 組織ダッシュボード</div>
                  </div>
                  <div style={{ padding: 28 }}>
                    <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
                      {[{val:"87",unit:"pt",label:"組織スコア",color:"#6366f1"},{val:"+12",unit:"",label:"先月比",color:"#10b981"},{val:"64",unit:"名",label:"回答者数",color:"#8b5cf6"}].map(s => (
                        <div key={s.label} style={{ flex: 1, background: "rgba(248,250,252,0.8)",
                          borderRadius: 12, padding: "14px 16px", border: "1px solid rgba(226,232,240,0.5)" }}>
                          <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}<span style={{ fontSize: 12 }}>{s.unit}</span></div>
                          <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 10, letterSpacing: "0.08em", textTransform: "uppercase" }}>月別コンディション推移</div>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 80 }}>
                      {[52,68,60,78,72,85,87].map((h, i) => (
                        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, height: "100%" }}>
                          <div style={{ width: "100%", height: `${h}%`,
                            background: i === 6 ? "linear-gradient(to top, #6366f1, #8b5cf6)" : "#e0e7ff",
                            borderRadius: "4px 4px 0 0", marginTop: "auto" }} />
                          <div style={{ fontSize: 9, color: "#cbd5e1" }}>{["7月","8月","9月","10月","11月","12月","1月"][i]}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 18, padding: "11px 14px", background: "rgba(254,242,242,0.8)",
                      borderRadius: 10, border: "1px solid rgba(254,202,202,0.5)",
                      display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", flexShrink: 0 }} />
                      <div style={{ fontSize: 12, color: "#64748b" }}>
                        要面談候補者 <span style={{ color: "#ef4444", fontWeight: 700 }}>3名</span> — 今週アラート送信済み
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── About ───────────────────────────── */}
        <section id="about" style={{ padding: "120px 48px" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <div className="sr" style={{ marginBottom: 64 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em",
                color: "#6366f1", marginBottom: 16, textTransform: "uppercase" }}>Philosophy</div>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800,
                letterSpacing: "-0.03em", lineHeight: 1.2, color: "#1a1a2e" }}>
                私たちが大切に<br />していること
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              {[
                { label: "Mission", title: "人の知覚を、ソフトウェアで拡張する。",
                  desc: "人が本来持つ力を引き出し、テクノロジーで可能性を広げる。私たちはそのためのソフトウェアを、真摯に作り続けます。", delay: "0s" },
                { label: "Vision", title: "テクノロジーの恩恵を、すべての現場へ。",
                  desc: "大企業だけでなく、中小企業や現場の第一線でも最先端のテクノロジーが活きる世界を目指します。", delay: "0.1s" },
              ].map(v => (
                <div key={v.label} className="sr glass-card" style={{ transitionDelay: v.delay }}>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.22em",
                    color: "#6366f1", textTransform: "uppercase", marginBottom: 18 }}>{v.label}</div>
                  <p style={{ fontSize: "clamp(17px, 2vw, 22px)", fontWeight: 700,
                    lineHeight: 1.55, color: "#1a1a2e", marginBottom: 16 }}>{v.title}</p>
                  <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.9 }}>{v.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4 }}>
              {[
                { en: "Integrity", jp: "誠実さ",       desc: "顧客・パートナー・社会に対して、常に誠実に向き合う" },
                { en: "Curiosity", jp: "先端への好奇心", desc: "最新技術への探求を止めず、革新を追求し続ける" },
                { en: "Respect",   jp: "人への敬意",    desc: "関わるすべての人を尊重し、共に成長することを喜びとする" },
                { en: "Speed",     jp: "圧倒的な速さ",  desc: "機会を逃さず、スピードを最大の競争優位にする" },
              ].map((v, i) => (
                <div key={v.en} className="sr glass-card"
                  style={{ transitionDelay: `${i * 0.08}s`, borderTop: "2px solid #6366f1",
                    borderRadius: "0 0 16px 16px" }}>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em",
                    color: "#6366f1", textTransform: "uppercase", marginBottom: 10 }}>{v.en}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1a2e", marginBottom: 10 }}>{v.jp}</div>
                  <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.85 }}>{v.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Contact ─────────────────────────── */}
        <section id="contact" style={{ padding: "120px 48px 140px" }}>
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <div className="sr" style={{ textAlign: "center", marginBottom: 52 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em",
                color: "#6366f1", marginBottom: 18, textTransform: "uppercase" }}>Contact</div>
              <h2 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800,
                color: "#1a1a2e", lineHeight: 1.2, letterSpacing: "-0.03em", marginBottom: 18 }}>
                一緒に、未来を<br />作りませんか。
              </h2>
              <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.9 }}>
                テクノロジーで現場を変えたい企業様、<br />まずはお気軽にご相談ください。
              </p>
            </div>
            <div className="sr" style={{ ...glassStrong, borderRadius: 24, padding: "44px 40px" }}>
              <ContactForm />
            </div>
          </div>
        </section>

        {/* ── Footer ──────────────────────────── */}
        <footer style={{ background: "#1a1a2e", padding: "36px 48px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em" }}>80</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>合同会社80</div>
          </div>
          <div style={{ display: "flex", gap: 28 }}>
            {([["事業内容","business"],["プロダクト","product"],["会社について","about"],["お問い合わせ","contact"]] as const).map(([l, id]) => (
              <button key={id}
                onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
                style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", background: "none",
                  border: "none", cursor: "pointer", padding: 0, transition: "color 0.2s",
                  fontFamily: "inherit" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}>
                {l}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>© 2025 合同会社80. All rights reserved.</div>
        </footer>
      </div>
    </>
  );
}

// ─── Contact Form ─────────────────────────────────────────────────────────────
function ContactForm() {
  const [form, setForm] = useState({ company: "", name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle"|"sending"|"done"|"error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "done" : "error");
    } catch { setStatus("error"); }
  };

  const inp: React.CSSProperties = {
    width: "100%", padding: "12px 14px", borderRadius: 10,
    border: "1.5px solid rgba(226,232,240,0.8)",
    background: "rgba(255,255,255,0.65)", color: "#1a1a2e",
    fontSize: 14, fontFamily: "inherit", outline: "none", transition: "border-color 0.2s",
  };
  const lbl: React.CSSProperties = {
    fontSize: 12, fontWeight: 700, color: "#4a5568",
    display: "block", marginBottom: 7, letterSpacing: "0.04em",
  };

  if (status === "done") return (
    <div style={{ textAlign: "center", padding: "32px 0" }}>
      <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#eef2ff",
        display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
      </div>
      <div style={{ fontSize: 17, fontWeight: 700, color: "#1a1a2e", marginBottom: 8 }}>送信完了しました</div>
      <div style={{ fontSize: 14, color: "#64748b" }}>担当者より折り返しご連絡いたします。</div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {[
          { k:"company", label:"会社名",        ph:"株式会社〇〇",      req:true,  type:"text"  },
          { k:"name",    label:"お名前",        ph:"山田 太郎",          req:true,  type:"text"  },
        ].map(({ k, label, ph, req, type }) => (
          <div key={k}>
            <label style={lbl}>{label}{req && <span style={{ color:"#ef4444", marginLeft:4 }}>*</span>}</label>
            <input required={req} type={type} placeholder={ph}
              value={form[k as keyof typeof form]}
              onChange={e => setForm({ ...form, [k]: e.target.value })}
              style={inp}
              onFocus={e => (e.target.style.borderColor = "#6366f1")}
              onBlur={e => (e.target.style.borderColor = "rgba(226,232,240,0.8)")} />
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {[
          { k:"email", label:"メールアドレス", ph:"your@example.com", req:true,  type:"email" },
          { k:"phone", label:"電話番号",       ph:"090-0000-0000",    req:false, type:"tel"   },
        ].map(({ k, label, ph, req, type }) => (
          <div key={k}>
            <label style={lbl}>{label}{req && <span style={{ color:"#ef4444", marginLeft:4 }}>*</span>}</label>
            <input required={req} type={type} placeholder={ph}
              value={form[k as keyof typeof form]}
              onChange={e => setForm({ ...form, [k]: e.target.value })}
              style={inp}
              onFocus={e => (e.target.style.borderColor = "#6366f1")}
              onBlur={e => (e.target.style.borderColor = "rgba(226,232,240,0.8)")} />
          </div>
        ))}
      </div>
      <div>
        <label style={lbl}>お問い合わせ内容</label>
        <textarea rows={4} placeholder="ご相談内容をご記入ください"
          value={form.message}
          onChange={e => setForm({ ...form, message: e.target.value })}
          style={{ ...inp, resize: "vertical", lineHeight: 1.75 }}
          onFocus={e => (e.target.style.borderColor = "#6366f1")}
          onBlur={e => (e.target.style.borderColor = "rgba(226,232,240,0.8)")} />
      </div>
      <button type="submit" disabled={status === "sending"}
        className="btn-primary-light"
        style={{ width: "100%", justifyContent: "center", marginTop: 4, opacity: status === "sending" ? 0.7 : 1 }}>
        {status === "sending" ? "送信中..." : "送信する"}
      </button>
      {status === "error" && (
        <div style={{ fontSize: 13, color: "#ef4444", textAlign: "center" }}>
          送信に失敗しました。時間をおいて再度お試しください。
        </div>
      )}
    </form>
  );
}
