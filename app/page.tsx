"use client";

import { useEffect, useRef, useState } from "react";

// ─── Dot Grid Canvas ──────────────────────────────────────────────────────────
function DotCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const GAP = 36;
    const mouse = { x: -9999, y: -9999 };
    let W = 0, H = 0, raf = 0, t = 0;

    // dots[row][col] = { bx, by, phase }
    type Dot = { bx: number; by: number; phase: number; r: number };
    let dots: Dot[] = [];

    const init = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      const cols = Math.ceil(W / GAP) + 1;
      const rows = Math.ceil(H / GAP) + 1;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          dots.push({ bx: col * GAP, by: row * GAP, phase: Math.random() * Math.PI * 2, r: 1.5 });
        }
      }
    };

    init();
    const onResize = () => init();
    const onMouse = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      // only react when cursor is over the section
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
      } else {
        mouse.x = -9999; mouse.y = -9999;
      }
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouse);

    const render = () => {
      t += 0.012;
      ctx.clearRect(0, 0, W, H);

      for (const d of dots) {
        // gentle float offset
        const ox = Math.sin(t + d.phase) * 1.2;
        const oy = Math.cos(t * 0.8 + d.phase) * 1.2;
        const x = d.bx + ox;
        const y = d.by + oy;

        // cursor proximity
        const dist = Math.hypot(mouse.x - x, mouse.y - y);
        const HOVER_R = 72;
        const proximity = dist < HOVER_R ? 1 - dist / HOVER_R : 0;

        const radius = 1.5 + proximity * 3.5;
        const alpha = 0.25 + proximity * 0.7;

        if (proximity > 0) {
          ctx.shadowBlur = 8 * proximity;
          ctx.shadowColor = `rgba(99,102,241,${proximity * 0.8})`;
        }
        ctx.globalAlpha = alpha;
        ctx.fillStyle = proximity > 0.3 ? "#6366f1" : "rgba(99,102,241,0.9)";
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

// ─── Particle Text Canvas ─────────────────────────────────────────────────────
function ParticleTextCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    interface P { x:number; y:number; tx:number; ty:number; vx:number; vy:number; sz:number; col:string; }
    let W = 0, H = 0, pts: P[] = [], raf = 0;
    const mouse = { x: -9999, y: -9999 };
    const COLS = ["#1e293b","#1e293b","#3730a3","#4f46e5","#1e293b","#1e293b","#312e81"];

    const build = (): P[] => {
      const off = document.createElement("canvas");
      off.width = W; off.height = H;
      const oc = off.getContext("2d")!;

      // auto-size to fill ~80% width across two lines
      const L1 = "Build what's", L2 = "next.";
      let fs = 10;
      oc.font = `900 ${fs}px -apple-system, BlinkMacSystemFont, sans-serif`;
      while (oc.measureText(L1).width < W * 0.80) {
        fs += 2;
        oc.font = `900 ${fs}px -apple-system, BlinkMacSystemFont, sans-serif`;
      }
      const lh = fs * 1.08;
      const cy = H * 0.40;
      oc.fillStyle = "#000";
      oc.textAlign = "center";
      oc.textBaseline = "alphabetic";
      oc.fillText(L1, W / 2, cy);
      oc.fillText(L2, W / 2, cy + lh);

      const data = oc.getImageData(0, 0, W, H).data;
      const gap = 4, out: P[] = [];
      for (let y = 0; y < H; y += gap) {
        for (let x = 0; x < W; x += gap) {
          if (data[(y * W + x) * 4 + 3] > 128) {
            out.push({
              tx: x, ty: y,
              x: Math.random() * W,
              y: Math.random() * H,
              vx: 0, vy: 0,
              sz: 1.3 + Math.random() * 1.3,
              col: COLS[Math.floor(Math.random() * COLS.length)],
            });
          }
        }
      }
      return out;
    };

    const init = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = build();
    };

    init();
    const onResize = () => init();
    const onMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    const REPEL = 150;
    const render = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < REPEL * REPEL) {
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / REPEL) * 16;
          p.vx -= (dx / d) * f;
          p.vy -= (dy / d) * f;
        }
        // spring back to target
        p.vx += (p.tx - p.x) * 0.052;
        p.vy += (p.ty - p.y) * 0.052;
        // damping
        p.vx *= 0.84; p.vy *= 0.84;
        p.x += p.vx; p.y += p.vy;

        ctx.fillStyle = p.col;
        ctx.globalAlpha = 0.80;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} style={{ position: "fixed", inset: 0, zIndex: 0, display: "block", background: "#f8fafc" }} />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [inHero, setInHero] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      setNavScrolled(window.scrollY > 40);
      setInHero(window.scrollY < window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(
      (e) => e.forEach((en) => { if (en.isIntersecting) en.target.classList.add("visible"); }),
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    document.querySelectorAll(".sr").forEach((el) => io.observe(el));
    return () => { window.removeEventListener("scroll", onScroll); io.disconnect(); };
  }, []);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const card: React.CSSProperties = {
    background: "#fff",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
    borderRadius: 20,
    padding: "40px 36px",
  };

  return (
    <>
      <ParticleTextCanvas />
      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ── Nav ── */}
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          height: navScrolled ? 60 : 70,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 48px",
          background: navScrolled ? "rgba(248,250,252,0.88)" : "transparent",
          backdropFilter: navScrolled ? "blur(20px)" : "none",
          borderBottom: navScrolled ? "1px solid rgba(0,0,0,0.07)" : "none",
          transition: "all 0.3s ease",
        }}>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{ background: "none", border: "none", cursor: "pointer",
              fontSize: 22, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.03em" }}>
            80
          </button>
          <div style={{ display: "flex", gap: 36 }}>
            {([["ビジョン","vision"],["事業内容","business"],["プロダクト","product"]] as const).map(([l, id]) => (
              <button key={id} onClick={() => scrollTo(id)}
                style={{ background: "none", border: "none", cursor: "pointer",
                  fontSize: 14, fontWeight: 500, color: "#475569", transition: "color 0.2s", fontFamily: "inherit" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#0f172a")}
                onMouseLeave={e => (e.currentTarget.style.color = "#475569")}>
                {l}
              </button>
            ))}
          </div>
          <button onClick={() => scrollTo("news")}
            style={{ padding: "9px 24px", borderRadius: 6, border: "1.5px solid #0f172a",
              background: "transparent", color: "#0f172a", fontSize: 13, fontWeight: 600,
              cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit" }}
            onMouseEnter={e => { e.currentTarget.style.background="#0f172a"; e.currentTarget.style.color="#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#0f172a"; }}>
            お問い合わせ
          </button>
        </nav>

        {/* ── Hero ── */}
        <section style={{ minHeight: "100vh", display: "flex", alignItems: "flex-end",
          justifyContent: "center", padding: "0 48px 80px", position: "relative" }}>
          <div style={{ textAlign: "center", maxWidth: 900, width: "100%" }} />
          {/* SCROLL — center bottom */}
          <div style={{ position: "fixed", bottom: 36, left: "50%", transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 10, zIndex: 10,
            animation: "fade-in 1s ease 1.4s both",
            opacity: inHero ? 1 : 0, pointerEvents: inHero ? "auto" : "none",
            transition: "opacity 0.4s ease" }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.35em",
              color: "#94a3b8", textTransform: "uppercase" }}>Scroll</span>
            <div style={{ position: "relative", width: 1, height: 64, overflow: "hidden",
              background: "rgba(99,102,241,0.15)", borderRadius: 2 }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: "100%",
                background: "linear-gradient(to bottom, #6366f1, #a78bfa)",
                borderRadius: 2, animation: "scroll-bar 1.6s cubic-bezier(0.4,0,0.2,1) infinite" }} />
            </div>
          </div>
        </section>

        {/* ── White overlay sections ── */}
        <div style={{ position: "relative" }}>
          {/* Gradient fade from transparent to white */}
          <div style={{ height: 160, background: "linear-gradient(to bottom, transparent, #fff)", pointerEvents: "none" }} />

        {/* ── Vision ── */}
        <section id="vision" style={{ background: "#fff", padding: "120px 64px 140px" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>

            {/* Editorial split layout */}
            <div className="sr" style={{ display: "grid", gridTemplateColumns: "1fr 1.8fr", gap: 80, alignItems: "flex-start", marginBottom: 100 }}>
              {/* Left: label + big English */}
              <div style={{ position: "sticky", top: 120 }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.22em", color: "#6366f1", textTransform: "uppercase", marginBottom: 24 }}>
                  私たちのビジョン
                </div>
                <div style={{ fontSize: "clamp(56px, 7vw, 96px)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.04em", color: "#0f172a" }}>
                  Our<br />Vision
                </div>
              </div>

              {/* Right: Japanese headline + body */}
              <div className="sr" style={{ transitionDelay: "0.1s" }}>
                <h2 style={{ fontSize: "clamp(26px, 3.2vw, 44px)", fontWeight: 800, lineHeight: 1.45, letterSpacing: "-0.02em", color: "#0f172a", marginBottom: 40 }}>
                  人間らしさとテクノロジーが、<br />共存する社会へ。
                </h2>
                <p style={{ fontSize: 16, color: "#475569", lineHeight: 2.0, marginBottom: 28 }}>
                  効率化だけを目的にするのではなく、人が人らしく働き、考え、選択できる社会を目指します。
                </p>
                <p style={{ fontSize: 16, color: "#475569", lineHeight: 2.0 }}>
                  テクノロジーが人に寄り添い、働く人・経営する人・関わるすべての人を自然に支える未来をつくります。
                </p>
              </div>
            </div>

            {/* Values */}
            <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 72 }}>
              <div className="sr" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", color: "#6366f1", textTransform: "uppercase", marginBottom: 40 }}>Values</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 0 }}>
                {[
                  { en:"Human First",  jp:"人間起点",   desc:"技術や機能からではなく、使う人・働く人・悩む人の視点から考えます。" },
                  { en:"Visualize",    jp:"可視化",     desc:"声・違和感・不安・負担など、見えにくいものを判断できる形に変えます。" },
                  { en:"Practical",    jp:"実用設計",   desc:"高機能であることよりも、現場で自然に使われ続けることを大切にします。" },
                  { en:"Coexistence",  jp:"技術共存",   desc:"テクノロジーは人を置き換えるものではなく、人の感覚や判断を支える存在として設計します。" },
                  { en:"Iteration",    jp:"継続改善",   desc:"完璧を待たずに小さく試し、現場の反応を見ながらより良い仕組みに育てます。" },
                ].map((v, i) => (
                  <div key={v.en} className="sr" style={{ padding: "32px 24px", borderLeft: i === 0 ? "none" : "1px solid #e2e8f0", transitionDelay:`${i*0.08}s` }}>
                    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: "#6366f1", textTransform: "uppercase", marginBottom: 14 }}>{v.en}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>{v.jp}</div>
                    <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.85 }}>{v.desc}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── Business ── */}
        <section id="business" style={{ background: "#fff", padding: "120px 64px 140px" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <div className="sr" style={{ textAlign: "center", marginBottom: 72 }}>
              <h2 style={{ fontSize: "clamp(64px, 10vw, 130px)", fontWeight: 900, letterSpacing: "-0.05em", color: "#0f172a", lineHeight: 1 }}>Works</h2>
            </div>
            {/* 2×2 grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>

              {/* 01 — quix */}
              <div className="sr" style={{ borderRadius: 20, overflow: "hidden", cursor: "pointer" }}
                onClick={() => window.open("/quix", "_blank")}
                onMouseEnter={e => { (e.currentTarget.querySelector(".biz-img") as HTMLElement).style.transform = "scale(1.03)"; }}
                onMouseLeave={e => { (e.currentTarget.querySelector(".biz-img") as HTMLElement).style.transform = "scale(1)"; }}>
                <div className="biz-img" style={{ height: 380, overflow: "hidden",
                  transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
                  <img src="/1.jpg" alt="quix" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                <div style={{ padding: "22px 4px" }}>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8, fontWeight: 600 }}>01</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>quix — 社内AIナレッジ検索</div>
                  <div style={{ fontSize: 14, color: "#64748b", marginTop: 6, lineHeight: 1.7 }}>チャット形式で社内のFAQ・規程・マニュアルを瞬時に回答。AIが蓄積された知識を自動整理し、問い合わせ工数を大幅削減します。</div>
                </div>
              </div>

              {/* 02 — LENDS AI */}
              <div className="sr" style={{ borderRadius: 20, overflow: "hidden", cursor: "pointer", transitionDelay: "0.08s" }}
                onClick={() => window.open("https://www.lens-ai.jp", "_blank")}
                onMouseEnter={e => { (e.currentTarget.querySelector(".biz-img") as HTMLElement).style.transform = "scale(1.03)"; }}
                onMouseLeave={e => { (e.currentTarget.querySelector(".biz-img") as HTMLElement).style.transform = "scale(1)"; }}>
                <div className="biz-img" style={{ height: 380, overflow: "hidden",
                  transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
                  <img src="/2.jpg" alt="LENDS AI" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                <div style={{ padding: "22px 4px" }}>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8, fontWeight: 600 }}>02</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>LENDS AI — 組織診断AI</div>
                  <div style={{ fontSize: 14, color: "#64748b", marginTop: 6, lineHeight: 1.7 }}>組織の状態をAIで可視化するSaaSプロダクト。人事課題の早期発見から採用・育成まで一気通貫で支援します。</div>
                </div>
              </div>

              {/* 03 — AI Labs */}
              <div className="sr" style={{ borderRadius: 20, overflow: "hidden", cursor: "pointer", transitionDelay: "0.16s" }}
                onClick={() => window.open("/ai-labs", "_blank")}
                onMouseEnter={e => { (e.currentTarget.querySelector(".biz-img") as HTMLElement).style.transform = "scale(1.03)"; }}
                onMouseLeave={e => { (e.currentTarget.querySelector(".biz-img") as HTMLElement).style.transform = "scale(1)"; }}>
                <div className="biz-img" style={{ height: 380, overflow: "hidden",
                  transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
                  <img src="/3.jpg" alt="AI Labs" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                <div style={{ padding: "22px 4px" }}>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8, fontWeight: 600 }}>03</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>AI Labs — 業務AI受託開発</div>
                  <div style={{ fontSize: 14, color: "#64748b", marginTop: 6, lineHeight: 1.7 }}>LLM・RAG・業務自動化を軸としたAIシステムをオーダーメイドで開発。現場課題を技術で根本から解決します。</div>
                </div>
              </div>

              {/* 04 — jGO */}
              <div className="sr" style={{ borderRadius: 20, overflow: "hidden", cursor: "pointer", transitionDelay: "0.24s" }}
                onMouseEnter={e => { (e.currentTarget.querySelector(".biz-img") as HTMLElement).style.transform = "scale(1.03)"; }}
                onMouseLeave={e => { (e.currentTarget.querySelector(".biz-img") as HTMLElement).style.transform = "scale(1)"; }}>
                <div className="biz-img" style={{ height: 380, overflow: "hidden",
                  transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
                  <img src="/4.jpg" alt="jGO" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                <div style={{ padding: "22px 4px" }}>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8, fontWeight: 600 }}>04</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>jGO — 人材紹介</div>
                  <div style={{ fontSize: 14, color: "#64748b", marginTop: 6, lineHeight: 1.7 }}>グローバル視点で人材と企業をつなぐキャリア支援サービス。テクノロジーと人の知見で最適なマッチングを実現します。（有料職業紹介事業）</div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── AI Capabilities ── */}
        <section id="product" style={{ background: "#fff", padding: "120px 64px 140px" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>

            {/* Header */}
            <div className="sr" style={{ marginBottom: 80 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <div style={{ width: 24, height: 1, background: "#6366f1" }} />
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", color: "#6366f1", textTransform: "uppercase" }}>AI CAPABILITIES</div>
              </div>
              <h2 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, lineHeight: 1.5, color: "#0f172a", maxWidth: 560 }}>
                AIは今、ビジネスの<br />何を変えられるのか。
              </h2>
            </div>

            {/* FOLIO-style: left text + right 2 cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>

              {/* Left: description */}
              <div className="sr">
                <p style={{ fontSize: "clamp(18px, 2vw, 24px)", fontWeight: 700, lineHeight: 1.7, color: "#0f172a", marginBottom: 32 }}>
                  私たちは、AIを使って<br />できることを増やし続けている。
                </p>
                <p style={{ fontSize: 15, color: "#64748b", lineHeight: 2.0, marginBottom: 24 }}>
                  LLM・RAG・機械学習を組み合わせれば、これまで人手に頼っていた業務の多くを、より速く・より正確に処理できます。
                </p>
                <p style={{ fontSize: 15, color: "#64748b", lineHeight: 2.0 }}>
                  業種や規模を問わず、AIの力を現場に届けること。それが合同会社80の使命です。
                </p>

                {/* capability tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 36 }}>
                  {["LLM活用","RAG構築","業務自動化","チャットボット","データ分析","組織診断AI","採用AI","文書生成"].map(t => (
                    <span key={t} style={{ fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 100,
                      border: "1.5px solid #e2e8f0", color: "#475569", letterSpacing: "0.02em" }}>{t}</span>
                  ))}
                </div>
              </div>

              {/* Right: 2 cards stacked */}
              <div className="sr" style={{ display: "flex", flexDirection: "column", gap: 16, transitionDelay: "0.12s" }}>

                {/* Card 1 */}
                <div style={{ borderRadius: 20, overflow: "hidden", background: "linear-gradient(135deg, #0f172a, #1e1b4b)", padding: "40px 36px", position: "relative" }}>
                  <div style={{ position: "absolute", top: -20, right: -20, width: 160, height: 160, borderRadius: "50%", border: "1px solid rgba(99,102,241,0.2)" }} />
                  <div style={{ position: "absolute", top: 10, right: 60, fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", color: "rgba(165,180,252,0.5)", textTransform: "uppercase" }}>LANGUAGE MODEL</div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(165,180,252,0.6)", textTransform: "uppercase", marginBottom: 16 }}>自動化 & 生成</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 14, lineHeight: 1.4 }}>ドキュメント・<br />コミュニケーションをAIで。</div>
                  <div style={{ fontSize: 13, color: "rgba(203,213,225,0.8)", lineHeight: 1.8 }}>
                    報告書・提案書・メールの自動生成。社内FAQへの即答。AIが"書く・答える"を肩代わりします。
                  </div>
                </div>

                {/* Card 2 */}
                <div style={{ borderRadius: 20, overflow: "hidden", background: "linear-gradient(135deg, #1a1025, #312e81)", padding: "40px 36px", position: "relative" }}>
                  <div style={{ position: "absolute", bottom: -30, right: -30, width: 180, height: 180, borderRadius: "50%", border: "1px solid rgba(124,58,237,0.2)" }} />
                  <div style={{ position: "absolute", bottom: 40, right: 36, fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", color: "rgba(196,181,253,0.5)", textTransform: "uppercase" }}>DATA SCIENCE</div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(196,181,253,0.6)", textTransform: "uppercase", marginBottom: 16 }}>分析 & 洞察</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 14, lineHeight: 1.4 }}>データから、<br />意思決定を変える。</div>
                  <div style={{ fontSize: 13, color: "rgba(203,213,225,0.8)", lineHeight: 1.8 }}>
                    売上予測・異常検知・顧客分析。膨大なデータを即座に解釈し、ビジネスの判断を支えます。
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>


        {/* ── Case Studies ── */}
        <section style={{ background: "#f8fafc", padding: "100px 0 120px", position: "relative", overflow: "hidden" }}>
          <DotCanvas />

          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Header */}
            <div style={{ maxWidth: 1160, margin: "0 auto 64px", padding: "0 64px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div>
                <div className="sr" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", color: "#6366f1", textTransform: "uppercase", marginBottom: 16 }}>Case Studies</div>
                <h2 className="sr" style={{ fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.04em", lineHeight: 1.05, transitionDelay: "0.08s" }}>
                  AIを、現場に<br />届けてきた。
                </h2>
              </div>
              <div className="sr" style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500, textAlign: "right", transitionDelay: "0.12s" }}>
                実際の導入実績
              </div>
            </div>

            {/* Ticker — row 1 */}
            <div style={{ overflow: "hidden", marginBottom: 16 }}>
              <div className="ticker-track" style={{ display: "flex", gap: 16, width: "max-content", padding: "0 16px" }}>
                {((cards) => [...cards, ...cards])([
                  { tag: "採用・HR",      title: "入社時テストのAI化",    metric: "−62%", metricLabel: "選考時間", accent: "#6366f1", code: "assess.run()" },
                  { tag: "予約管理",      title: "予約システムのAI化",    metric: "−78%", metricLabel: "対応工数", accent: "#8b5cf6", code: "booking.auto()" },
                  { tag: "バックオフィス", title: "会計ソフトのAI化",     metric: "−50%", metricLabel: "経理負荷", accent: "#0891b2", code: "ledger.ai()" },
                  { tag: "業務効率",      title: "日報管理のAI化",       metric: "+40%", metricLabel: "提出率",   accent: "#059669", code: "report.gen()" },
                ]).map((c, i) => (
                  <div key={i} style={{
                    width: 320, flexShrink: 0, borderRadius: 16,
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
                    padding: "28px 26px 24px",
                    display: "flex", flexDirection: "column", gap: 0,
                    transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s, border-color 0.3s",
                    cursor: "pointer", position: "relative", overflow: "hidden",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 12px 40px ${c.accent}22`; e.currentTarget.style.borderColor = `${c.accent}50`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.05)"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
                  >
                    {/* top accent bar */}
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${c.accent}, ${c.accent}88)`, borderRadius: "16px 16px 0 0" }} />
                    {/* terminal-style code snippet */}
                    <div style={{ fontFamily: "'SF Mono', 'Fira Code', monospace", fontSize: 11, color: c.accent,
                      background: `${c.accent}0e`, border: `1px solid ${c.accent}22`, borderRadius: 6,
                      padding: "5px 10px", marginBottom: 20, display: "inline-block", letterSpacing: "0.02em" }}>
                      $ {c.code}
                    </div>
                    {/* tag + arrow */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: c.accent,
                        textTransform: "uppercase", padding: "3px 10px", borderRadius: 100,
                        background: `${c.accent}12`, border: `1px solid ${c.accent}30` }}>{c.tag}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2">
                        <path d="M7 17L17 7M17 7H7M17 7v10"/>
                      </svg>
                    </div>
                    {/* title */}
                    <div style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", lineHeight: 1.4, marginBottom: 20 }}>{c.title}</div>
                    {/* metric */}
                    <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "baseline", gap: 8 }}>
                      <div style={{ fontSize: 32, fontWeight: 900, color: c.accent, letterSpacing: "-0.03em", lineHeight: 1 }}>{c.metric}</div>
                      <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{c.metricLabel}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ticker — row 2 (reverse) */}
            <div style={{ overflow: "hidden" }}>
              <div style={{ display: "flex", gap: 16, width: "max-content", padding: "0 16px",
                animation: "ticker 44s linear infinite reverse" }}>
                {((cards) => [...cards, ...cards])([
                  { tag: "DX推進",    title: "生成AIの社内導入",       metric: "+55%", metricLabel: "生産性",    accent: "#f59e0b", code: "deploy.ai()" },
                  { tag: "Web",       title: "ホームページへのAI実装", metric: "+38%", metricLabel: "CV率",      accent: "#0ea5e9", code: "chat.embed()" },
                  { tag: "マーケ",    title: "SEO対策のAI化",          metric: "+210%", metricLabel: "オーガニック流入", accent: "#ec4899", code: "seo.optimize()" },
                  { tag: "コンテンツ", title: "自動ブログ更新AI",      metric: "−90%", metricLabel: "運用コスト", accent: "#8b5cf6", code: "content.auto()" },
                ]).map((c, i) => (
                  <div key={i} style={{
                    width: 320, flexShrink: 0, borderRadius: 16,
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
                    padding: "28px 26px 24px",
                    display: "flex", flexDirection: "column", gap: 0,
                    transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s, border-color 0.3s",
                    cursor: "pointer", position: "relative", overflow: "hidden",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 12px 40px ${c.accent}22`; e.currentTarget.style.borderColor = `${c.accent}50`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.05)"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
                  >
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${c.accent}, ${c.accent}88)`, borderRadius: "16px 16px 0 0" }} />
                    <div style={{ fontFamily: "'SF Mono', 'Fira Code', monospace", fontSize: 11, color: c.accent,
                      background: `${c.accent}0e`, border: `1px solid ${c.accent}22`, borderRadius: 6,
                      padding: "5px 10px", marginBottom: 20, display: "inline-block", letterSpacing: "0.02em" }}>
                      $ {c.code}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: c.accent,
                        textTransform: "uppercase", padding: "3px 10px", borderRadius: 100,
                        background: `${c.accent}12`, border: `1px solid ${c.accent}30` }}>{c.tag}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2">
                        <path d="M7 17L17 7M17 7H7M17 7v10"/>
                      </svg>
                    </div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", lineHeight: 1.4, marginBottom: 20 }}>{c.title}</div>
                    <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "baseline", gap: 8 }}>
                      <div style={{ fontSize: 32, fontWeight: 900, color: c.accent, letterSpacing: "-0.03em", lineHeight: 1 }}>{c.metric}</div>
                      <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{c.metricLabel}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── News ── */}
        <section id="news" style={{ background: "#fff", padding: "120px 64px 140px" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <div className="sr" style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 64 }}>
              <h2 style={{ fontSize: "clamp(48px, 7vw, 96px)", fontWeight: 900, letterSpacing: "-0.05em", color: "#0f172a", lineHeight: 1 }}>News</h2>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#6366f1", letterSpacing: "0.1em", textTransform: "uppercase" }}>Latest Updates</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {[
                { date: "2025.12", cat: "Product", title: "LENDS AI 新機能「採用アセスメント」正式リリース", desc: "心理・論理・コミュニケーション・敬語の4軸で候補者を自動評価する採用アセスメント機能を追加しました。" },
                { date: "2025.10", cat: "Service", title: "AI受託開発サービス「AI Build」提供開始", desc: "LLM・RAG・業務自動化を中心としたAI開発サービスを正式に開始。初月無料相談受付中。" },
                { date: "2025.08", cat: "Works",   title: "大手飲食チェーン向け予約システムAI化を完了", desc: "月間10万件超の予約対応をAIが自動処理。スタッフの対応工数を約70%削減することに成功。" },
                { date: "2025.06", cat: "Works",   title: "HR企業向け入社時AIアセスメントシステムを納品", desc: "採用選考の一次評価をAIが自動化。採用精度の向上と選考時間の大幅な短縮を実現。" },
                { date: "2025.04", cat: "Company", title: "合同会社80 設立", desc: "「人の知覚を、ソフトウェアで拡張する。」をミッションに、名古屋を拠点として合同会社80を設立。" },
              ].map((item, i) => (
                <div key={i} className="sr" style={{
                  display: "grid", gridTemplateColumns: "120px 80px 1fr",
                  gap: "0 40px", alignItems: "start",
                  padding: "32px 0", borderTop: "1px solid #e2e8f0",
                  transitionDelay: `${i * 0.06}s`, cursor: "pointer",
                  transition: "opacity 0.2s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.6")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.06em", paddingTop: 4 }}>{item.date}</div>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100,
                      background: "#eef2ff", color: "#6366f1", letterSpacing: "0.06em" }}>{item.cat}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 8, lineHeight: 1.5 }}>{item.title}</div>
                    <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.8 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
              <div style={{ borderTop: "1px solid #e2e8f0" }} />
            </div>
          </div>
        </section>

        {/* ── Recruit ── */}
        <section id="recruit" style={{ background: "#111827", padding: "120px 64px 140px" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>

            {/* Title */}
            <div className="sr" style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 80 }}>
              <h2 style={{ fontSize: "clamp(48px, 7vw, 96px)", fontWeight: 900, letterSpacing: "-0.05em", color: "#f8fafc", lineHeight: 1 }}>Recruit</h2>
              <a href="mailto:info@80llc.jp"
                style={{ display: "inline-flex", alignItems: "center", gap: 10,
                  padding: "12px 28px", borderRadius: 6,
                  border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)",
                  fontSize: 13, fontWeight: 600, letterSpacing: "0.02em",
                  textDecoration: "none", transition: "border-color 0.2s, color 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor="#6366f1"; (e.currentTarget as HTMLAnchorElement).style.color="#fff"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor="rgba(255,255,255,0.2)"; (e.currentTarget as HTMLAnchorElement).style.color="rgba(255,255,255,0.6)"; }}>
                カジュアル面談を申し込む
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>

            {/* Positions */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {[
                { role: "AI Engineer",        type: "業務委託 / 正社員",  tags: ["Python", "LLM", "RAG"] },
                { role: "Frontend Engineer",  type: "業務委託 / 正社員",  tags: ["Next.js", "TypeScript", "UI/UX"] },
                { role: "Sales / BizDev",     type: "業務委託 / インターン", tags: ["SaaS", "法人営業", "企画"] },
              ].map((pos, i) => (
                <div key={i} className="sr" style={{
                  display: "grid", gridTemplateColumns: "1fr auto",
                  alignItems: "center", gap: 24,
                  padding: "36px 0", borderTop: "1px solid rgba(255,255,255,0.08)",
                  cursor: "pointer", transitionDelay: `${i * 0.06}s`,
                }}
                  onMouseEnter={e => { (e.currentTarget.style.opacity = "0.6"); }}
                  onMouseLeave={e => { (e.currentTarget.style.opacity = "1"); }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap", marginBottom: 12 }}>
                      <div style={{ fontSize: "clamp(20px, 2.2vw, 26px)", fontWeight: 800,
                        color: "#f8fafc", letterSpacing: "-0.02em" }}>{pos.role}</div>
                      <div style={{ fontSize: 12, color: "rgba(248,250,252,0.3)", fontWeight: 500 }}>{pos.type}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {pos.tags.map(t => (
                        <span key={t} style={{ fontSize: 11, fontWeight: 600, padding: "3px 11px",
                          borderRadius: 100, background: "rgba(99,102,241,0.15)",
                          color: "#a5b4fc", letterSpacing: "0.04em" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              ))}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer style={{ background: "#13151f", padding: "80px 64px 0" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "220px 1fr 200px", gap: 64, paddingBottom: 80, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>

              {/* Left — logo + tagline */}
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", marginBottom: 12 }}>80</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.8 }}>
                    人の知覚を、<br />ソフトウェアで拡張する。
                  </div>
                </div>
              </div>

              {/* Center — nav columns */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 48px" }}>

                {/* Column 1 — 事業内容 */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>事業内容</span>
                    <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {[["quix","business"],["LENDS AI","business"],["AI Labs","business"],["jGO","business"]].map(([l, id]) => (
                      <button key={l} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" })}
                        style={{ background:"none", border:"none", cursor:"pointer", padding:0, textAlign:"left",
                          fontSize:13, color:"rgba(255,255,255,0.45)", fontFamily:"inherit", transition:"color 0.2s" }}
                        onMouseEnter={e => (e.currentTarget.style.color="#fff")}
                        onMouseLeave={e => (e.currentTarget.style.color="rgba(255,255,255,0.45)")}>{l}</button>
                    ))}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "40px 0 24px" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>プロダクト</span>
                    <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {[["AIでできること","product"],["導入事例","product"]].map(([l, id]) => (
                      <button key={l} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" })}
                        style={{ background:"none", border:"none", cursor:"pointer", padding:0, textAlign:"left",
                          fontSize:13, color:"rgba(255,255,255,0.45)", fontFamily:"inherit", transition:"color 0.2s" }}
                        onMouseEnter={e => (e.currentTarget.style.color="#fff")}
                        onMouseLeave={e => (e.currentTarget.style.color="rgba(255,255,255,0.45)")}>{l}</button>
                    ))}
                  </div>
                </div>

                {/* Column 2 — 会社情報 */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>会社情報</span>
                    <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {[["ビジョン","vision"],["ニュース","news"],["採用","recruit"]].map(([l, id]) => (
                      <button key={l} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" })}
                        style={{ background:"none", border:"none", cursor:"pointer", padding:0, textAlign:"left",
                          fontSize:13, color:"rgba(255,255,255,0.45)", fontFamily:"inherit", transition:"color 0.2s" }}
                        onMouseEnter={e => (e.currentTarget.style.color="#fff")}
                        onMouseLeave={e => (e.currentTarget.style.color="rgba(255,255,255,0.45)")}>{l}</button>
                    ))}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "40px 0 24px" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>お問い合わせ</span>
                    <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
                  </div>
                  <a href="mailto:info@80llc.jp"
                    style={{ fontSize:13, color:"rgba(255,255,255,0.45)", textDecoration:"none", transition:"color 0.2s", display:"block" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color="#fff")}
                    onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color="rgba(255,255,255,0.45)")}>
                    info@80llc.jp
                  </a>
                </div>
              </div>

              {/* Right — TOP button */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "flex-start" }}>
                <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6,
                    background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                    borderRadius:8, padding:"16px 20px", cursor:"pointer",
                    transition:"background 0.2s", color:"rgba(255,255,255,0.5)", fontFamily:"inherit" }}
                  onMouseEnter={e => (e.currentTarget.style.background="rgba(255,255,255,0.12)")}
                  onMouseLeave={e => (e.currentTarget.style.background="rgba(255,255,255,0.06)")}>
                  <span style={{ fontSize:9, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase" }}>TOP</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 19V5M5 12l7-7 7 7"/>
                  </svg>
                  <span style={{ fontSize:9, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase" }}>PAGE</span>
                </button>
              </div>
            </div>

            {/* Bottom bar */}
            <div style={{ padding: "28px 0 32px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.2)", letterSpacing:"0.04em" }}>
                © 2025 合同会社80. All rights reserved.
              </div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.2)" }}>
                名古屋市 / Nagoya, Japan
              </div>
            </div>
          </div>
        </footer>
        </div>{/* /gradient wrapper */}
      </div>
    </>
  );
}

