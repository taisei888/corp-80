"use client";

import { useEffect, useRef, useState } from "react";

// ─── Neural Network Canvas ────────────────────────────────────────────────────
const NODE_COLORS = ["#4f46e5", "#7c3aed", "#0891b2", "#6d28d9"];
const CONN_DIST   = 170;
const NODE_COUNT  = 85;

const KEYWORDS = ["AI", "LLM", "SaaS", "ML", "API", "GPT", "RAG", "Data", "Cloud", "Python", "React", "Vector"];

interface NNode {
  x: number; y: number;
  vx: number; vy: number;
  r: number; color: string; glow: number;
  label?: string; labelGlow: number;
}
interface Pulse {
  from: number; to: number;
  t: number; speed: number; color: string;
}

function NeuralCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0;
    const mouse = { x: -9999, y: -9999 };
    let nodes: NNode[] = [];
    let pulses: Pulse[] = [];
    let raf = 0, lastPulse = 0;

    const init = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Shuffle keyword indices so labels are spread randomly
      const labelIdx = Array.from({ length: NODE_COUNT }, (_, i) => i).sort(() => Math.random() - 0.5);
      nodes = Array.from({ length: NODE_COUNT }, (_, i) => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.45, vy: (Math.random() - 0.5) * 0.45,
        r: Math.random() * 1.8 + 1.2,
        color: NODE_COLORS[Math.floor(Math.random() * NODE_COLORS.length)],
        glow: 0, labelGlow: 0,
        label: labelIdx[i] < KEYWORDS.length ? KEYWORDS[labelIdx[i]] : undefined,
      }));
    };
    init();
    window.addEventListener("resize", init);
    window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });

    const render = (ts: number) => {
      ctx.clearRect(0, 0, W, H);

      for (const n of nodes) {
        const dx = mouse.x - n.x, dy = mouse.y - n.y;
        const md = Math.sqrt(dx*dx + dy*dy);
        if (md < 220 && md > 0) { n.vx += (dx/md)*0.025; n.vy += (dy/md)*0.025; }
        const spd = Math.sqrt(n.vx*n.vx + n.vy*n.vy);
        if (spd > 1.4) { n.vx *= 1.4/spd; n.vy *= 1.4/spd; }
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) { n.vx *= -1; n.x = Math.max(0, Math.min(W, n.x)); }
        if (n.y < 0 || n.y > H) { n.vy *= -1; n.y = Math.max(0, Math.min(H, n.y)); }
        n.glow = Math.max(0, n.glow - 0.018);
      }

      if (ts - lastPulse > 700) {
        const i = Math.floor(Math.random() * nodes.length);
        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          if (Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y) < CONN_DIST) {
            pulses.push({ from: i, to: j, t: 0, speed: 0.007 + Math.random()*0.007, color: nodes[i].color });
            lastPulse = ts; break;
          }
        }
      }

      // Connections
      ctx.lineWidth = 0.7;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i+1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (d < CONN_DIST) {
            const a = (1 - d/CONN_DIST) * 0.22;
            ctx.strokeStyle = `rgba(79,70,229,${a})`;
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
          }
        }
      }

      // Mouse connections
      ctx.lineWidth = 0.9;
      for (const n of nodes) {
        const d = Math.hypot(mouse.x - n.x, mouse.y - n.y);
        if (d < 200) {
          ctx.strokeStyle = `rgba(109,40,217,${(1-d/200)*0.45})`;
          ctx.beginPath(); ctx.moveTo(mouse.x, mouse.y); ctx.lineTo(n.x, n.y); ctx.stroke();
        }
      }

      // Nodes
      for (const n of nodes) {
        if (n.glow > 0.05) { ctx.shadowBlur = 16*n.glow; ctx.shadowColor = n.color; }
        ctx.globalAlpha = 0.6 + n.glow * 0.4;
        ctx.fillStyle = n.color;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r + n.glow*2.5, 0, Math.PI*2); ctx.fill();
        ctx.shadowBlur = 0; ctx.globalAlpha = 1;
      }

      // Pulses
      pulses = pulses.filter(p => {
        p.t += p.speed;
        if (p.t >= 1) {
          nodes[p.to].glow = 1;
          if (nodes[p.to].label) nodes[p.to].labelGlow = 1;
          return false;
        }
        const ni = nodes[p.from], nj = nodes[p.to];
        for (let k = 0; k < 5; k++) {
          const tt = Math.max(0, p.t - k*0.025);
          const tx = ni.x + (nj.x-ni.x)*tt, ty = ni.y + (nj.y-ni.y)*tt;
          ctx.globalAlpha = (1 - k/5) * 0.9;
          ctx.fillStyle = p.color;
          ctx.shadowBlur = k === 0 ? 12 : 0; ctx.shadowColor = p.color;
          ctx.beginPath(); ctx.arc(tx, ty, k === 0 ? 2.8 : 1.5 - k*0.2, 0, Math.PI*2); ctx.fill();
          ctx.shadowBlur = 0; ctx.globalAlpha = 1;
        }
        return true;
      });

      // IT word labels
      ctx.font = "bold 10px 'Courier New', 'SF Mono', monospace";
      ctx.textAlign = "left";
      for (const n of nodes) {
        if (!n.label) continue;
        n.labelGlow = Math.max(0, n.labelGlow - 0.014);
        const alpha = 0.18 + n.labelGlow * 0.78;
        ctx.globalAlpha = alpha;
        if (n.labelGlow > 0.05) {
          ctx.shadowBlur = 10 * n.labelGlow;
          ctx.shadowColor = n.color;
        }
        ctx.fillStyle = n.color;
        ctx.fillText(n.label, n.x + n.r + 5, n.y - n.r - 2);
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      // Mouse dot
      if (mouse.x > 0) {
        ctx.shadowBlur = 16; ctx.shadowColor = "#6366f1";
        ctx.fillStyle = "rgba(99,102,241,0.65)";
        ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 3.5, 0, Math.PI*2); ctx.fill();
        ctx.shadowBlur = 0;
      }

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", init); };
  }, []);

  return (
    <canvas ref={ref}
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh",
        zIndex: 0, display: "block", background: "#f8fafc" }} />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
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
      <NeuralCanvas />
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
          <button onClick={() => scrollTo("contact")}
            style={{ padding: "9px 24px", borderRadius: 6, border: "1.5px solid #0f172a",
              background: "transparent", color: "#0f172a", fontSize: 13, fontWeight: 600,
              cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit" }}
            onMouseEnter={e => { e.currentTarget.style.background="#0f172a"; e.currentTarget.style.color="#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#0f172a"; }}>
            お問い合わせ
          </button>
        </nav>

        {/* ── Hero ── */}
        <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", padding: "120px 48px 100px" }}>
          <div style={{ textAlign: "center", maxWidth: 960, width: "100%" }}>
            <p style={{ fontSize: 12, letterSpacing: "0.32em", color: "#6366f1",
              fontWeight: 700, textTransform: "uppercase", marginBottom: 32,
              animation: "fade-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s both" }}>
              合同会社80 — Japan, Nagoya
            </p>
            <p style={{ fontSize: "clamp(20px, 3vw, 34px)", fontWeight: 800,
              color: "#6366f1", letterSpacing: "0.02em", marginBottom: 20,
              animation: "fade-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s both",
              fontStyle: "italic" }}>
              Build what&apos;s next.
            </p>
            <h1 style={{ fontSize: "clamp(52px, 7.5vw, 104px)", fontWeight: 800,
              color: "#0f172a", lineHeight: 1.1, letterSpacing: "-0.04em", marginBottom: 40,
              whiteSpace: "nowrap",
              animation: "fade-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s both" }}>
              未来は、待つものじゃない。
            </h1>
            <p style={{ fontSize: 19, color: "#64748b", lineHeight: 1.9, marginBottom: 56,
              animation: "fade-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.45s both" }}>
              合同会社80は、AIとソフトウェアで<br />現場を根本から変える。
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap",
              animation: "fade-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.55s both" }}>
              <button className="btn-primary-light" onClick={() => scrollTo("vision")}>
                私たちのビジョン
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <button className="btn-outline-light" onClick={() => scrollTo("contact")}>
                お問い合わせ
              </button>
            </div>
          </div>
          <div style={{ marginTop: "auto", paddingTop: 60, display: "flex", flexDirection: "column",
            alignItems: "center", gap: 14, animation: "fade-in 1s ease 1.4s both" }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.35em",
              color: "#6366f1", textTransform: "uppercase" }}>Scroll</span>
            <div style={{ position: "relative", width: 2, height: 72, overflow: "hidden",
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
        <section id="vision" style={{ padding: "120px 48px 140px" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <div className="sr" style={{ marginBottom: 72 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "#6366f1", marginBottom: 20, textTransform: "uppercase" }}>Our Vision</div>
              <h2 style={{ fontSize: "clamp(36px, 5.5vw, 72px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1, color: "#0f172a" }}>
                テクノロジーの恩恵を、<br />すべての現場へ。
              </h2>
              <p style={{ fontSize: 17, color: "#64748b", lineHeight: 1.9, marginTop: 28, maxWidth: 540 }}>
                大企業だけでなく、中小企業や現場の第一線でも<br />最先端のテクノロジーが活きる世界を目指して。
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              {[
                { label:"Mission", title:"人の知覚を、ソフトウェアで拡張する。",
                  desc:"人が本来持つ力を引き出し、テクノロジーで可能性を広げる。私たちはそのためのソフトウェアを、真摯に作り続けます。", delay:"0s" },
                { label:"Vision", title:"テクノロジーの恩恵を、すべての現場へ。",
                  desc:"大企業だけでなく、中小企業や現場の第一線でも最先端のテクノロジーが活きる世界を目指します。", delay:"0.1s" },
              ].map(v => (
                <div key={v.label} className="sr" style={{ ...card, transitionDelay: v.delay }}>
                  <div style={{ fontSize:10, fontWeight:800, letterSpacing:"0.22em", color:"#6366f1", textTransform:"uppercase", marginBottom:18 }}>{v.label}</div>
                  <p style={{ fontSize:"clamp(18px, 2.2vw, 24px)", fontWeight:700, lineHeight:1.55, color:"#0f172a", marginBottom:16 }}>{v.title}</p>
                  <p style={{ fontSize:14, color:"#64748b", lineHeight:1.9 }}>{v.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4 }}>
              {[
                { en:"Integrity", jp:"誠実さ",       desc:"顧客・パートナー・社会に対して、常に誠実に向き合う" },
                { en:"Curiosity", jp:"先端への好奇心", desc:"最新技術への探求を止めず、革新を追求し続ける" },
                { en:"Respect",   jp:"人への敬意",    desc:"関わるすべての人を尊重し、共に成長することを喜びとする" },
                { en:"Speed",     jp:"圧倒的な速さ",  desc:"機会を逃さず、スピードを最大の競争優位にする" },
              ].map((v, i) => (
                <div key={v.en} className="sr" style={{ ...card, transitionDelay:`${i*0.08}s`, borderTop:"2px solid #6366f1", borderRadius:"0 0 16px 16px" }}>
                  <div style={{ fontSize:10, fontWeight:800, letterSpacing:"0.2em", color:"#6366f1", textTransform:"uppercase", marginBottom:10 }}>{v.en}</div>
                  <div style={{ fontSize:18, fontWeight:700, color:"#0f172a", marginBottom:10 }}>{v.jp}</div>
                  <div style={{ fontSize:13, color:"#64748b", lineHeight:1.85 }}>{v.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Business ── */}
        <div style={{ background: "#fff" }}>
        <section id="business" style={{ padding: "80px 48px 120px" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <div className="sr" style={{ marginBottom: 64 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em",
                color: "#6366f1", marginBottom: 16, textTransform: "uppercase" }}>Business</div>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800,
                letterSpacing: "-0.03em", lineHeight: 1.2, color: "#0f172a" }}>3つの事業領域</h2>
              <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.9, marginTop: 14, maxWidth: 420 }}>
                パッケージ製品・AI受託開発・Webデザインの3軸で、<br />クライアントのデジタル変革を支援します。
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {[
                { n:"01", color:"#6366f1", bg:"#eef2ff", label:"SaaS Package",
                  icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
                  title:"パッケージ販売", sub:"LENDS AI など",
                  desc:"自社開発のSaaSプロダクトを提供。LENDS AIは組織コンディションをスマホアンケート×AIで可視化し、人事課題の早期発見を支援します。", delay:"0s" },
                { n:"02", color:"#7c3aed", bg:"#f5f3ff", label:"AI Development",
                  icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.8"><path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2"/></svg>,
                  title:"AI受託開発", sub:"",
                  desc:"ChatGPT・LLM・RAGを活用した業務効率化ツール、データ分析システム、AIチャットボットなどをオーダーメイドで開発します。", delay:"0.1s" },
                { n:"03", color:"#0891b2", bg:"#ecfeff", label:"Web Design",
                  icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0891b2" strokeWidth="1.8"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M7 8h2M7 12h2M13 8h4M13 12h4"/></svg>,
                  title:"HP制作デザイン", sub:"",
                  desc:"ブランドの価値を最大化するWebサイト制作。戦略的なUI/UXデザインと高品質な実装で、ビジネスの成果につながるサイトを届けます。", delay:"0.2s" },
              ].map((item) => (
                <div key={item.n} className="sr" style={{ ...card, transitionDelay: item.delay, transition: "transform 0.28s ease, box-shadow 0.28s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 12px 40px rgba(0,0,0,0.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 4px 24px rgba(0,0,0,0.06)"; }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#c7d2fe", marginBottom: 20, letterSpacing: "0.1em" }}>{item.n}</div>
                  <div style={{ width: 48, height: 48, borderRadius: 12, marginBottom: 24,
                    background: item.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {item.icon}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", color: item.color, marginBottom: 10, textTransform: "uppercase" }}>{item.label}</div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, lineHeight: 1.35, color: "#0f172a" }}>
                    {item.title}{item.sub && <><br /><span style={{ fontSize: 13, fontWeight: 400, color: "#94a3b8" }}>{item.sub}</span></>}
                  </h3>
                  <p style={{ fontSize: 14, lineHeight: 1.9, color: "#64748b" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Product ── */}
        <section id="product" style={{ padding: "120px 48px" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <div className="sr" style={{ marginBottom: 64 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "#6366f1", marginBottom: 16, textTransform: "uppercase" }}>Featured Product</div>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#0f172a" }}>LENDS AI</h2>
              <p style={{ fontSize: 16, color: "#64748b", marginTop: 10 }}>組織コンディション可視化プラットフォーム</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
              <div className="sr">
                <h3 style={{ fontSize: "clamp(20px, 2.8vw, 30px)", fontWeight: 700, lineHeight: 1.6, marginBottom: 20, color: "#0f172a" }}>
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
                <div style={{ ...card, padding: 0, overflow: "hidden" }}>
                  <div style={{ background: "rgba(248,250,252,0.9)", padding: "14px 20px",
                    display: "flex", gap: 7, alignItems: "center", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                    {["#f87171","#fbbf24","#34d399"].map(c => (
                      <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.7 }} />
                    ))}
                    <div style={{ marginLeft: 10, fontSize: 11, color: "#94a3b8" }}>LENDS AI — 組織ダッシュボード</div>
                  </div>
                  <div style={{ padding: 28 }}>
                    <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
                      {[{val:"87",unit:"pt",label:"組織スコア",color:"#6366f1"},{val:"+12",unit:"",label:"先月比",color:"#10b981"},{val:"64",unit:"名",label:"回答者数",color:"#7c3aed"}].map(s => (
                        <div key={s.label} style={{ flex:1, background:"#f8fafc", borderRadius:12, padding:"14px 16px", border:"1px solid #f1f5f9" }}>
                          <div style={{ fontSize:22, fontWeight:800, color:s.color }}>{s.val}<span style={{ fontSize:12 }}>{s.unit}</span></div>
                          <div style={{ fontSize:10, color:"#94a3b8", marginTop:4 }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize:10, color:"#94a3b8", marginBottom:10, letterSpacing:"0.08em", textTransform:"uppercase" }}>月別コンディション推移</div>
                    <div style={{ display:"flex", alignItems:"flex-end", gap:5, height:80 }}>
                      {[52,68,60,78,72,85,87].map((h,i) => (
                        <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5, height:"100%" }}>
                          <div style={{ width:"100%", height:`${h}%`,
                            background: i===6 ? "linear-gradient(to top, #6366f1, #7c3aed)" : "#e0e7ff",
                            borderRadius:"4px 4px 0 0", marginTop:"auto" }} />
                          <div style={{ fontSize:9, color:"#cbd5e1" }}>{["7月","8月","9月","10月","11月","12月","1月"][i]}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop:18, padding:"11px 14px", background:"#fef2f2", borderRadius:10,
                      border:"1px solid #fecaca", display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:6, height:6, borderRadius:"50%", background:"#ef4444", flexShrink:0 }} />
                      <div style={{ fontSize:12, color:"#64748b" }}>
                        要面談候補者 <span style={{ color:"#ef4444", fontWeight:700 }}>3名</span> — 今週アラート送信済み
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ── Contact ── */}
        <section id="contact" style={{ padding: "120px 48px 140px" }}>
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <div className="sr" style={{ textAlign: "center", marginBottom: 52 }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.2em", color:"#6366f1", marginBottom:18, textTransform:"uppercase" }}>Contact</div>
              <h2 style={{ fontSize:"clamp(32px, 5vw, 56px)", fontWeight:800, color:"#0f172a", lineHeight:1.2, letterSpacing:"-0.03em", marginBottom:18 }}>
                一緒に、未来を<br />作りませんか。
              </h2>
              <p style={{ fontSize:15, color:"#64748b", lineHeight:1.9 }}>
                テクノロジーで現場を変えたい企業様、<br />まずはお気軽にご相談ください。
              </p>
            </div>
            <div className="sr" style={{ ...card, padding: "44px 40px" }}>
              <ContactForm />
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer style={{ background: "#0f172a", padding: "36px 48px",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ fontSize:20, fontWeight:900, color:"#fff", letterSpacing:"-0.02em" }}>80</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:4 }}>合同会社80</div>
          </div>
          <div style={{ display: "flex", gap: 28 }}>
            {([["ビジョン","vision"],["事業内容","business"],["プロダクト","product"],["お問い合わせ","contact"]] as const).map(([l, id]) => (
              <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" })}
                style={{ fontSize:12, color:"rgba(255,255,255,0.35)", background:"none", border:"none",
                  cursor:"pointer", padding:0, transition:"color 0.2s", fontFamily:"inherit" }}
                onMouseEnter={e => (e.currentTarget.style.color="#fff")}
                onMouseLeave={e => (e.currentTarget.style.color="rgba(255,255,255,0.35)")}>
                {l}
              </button>
            ))}
          </div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.18)" }}>© 2025 合同会社80. All rights reserved.</div>
        </footer>
          </div>{/* /white bg */}
        </div>{/* /gradient wrapper */}
      </div>
    </>
  );
}

// ─── Contact Form ─────────────────────────────────────────────────────────────
function ContactForm() {
  const [form, setForm] = useState({ company:"", name:"", email:"", phone:"", message:"" });
  const [status, setStatus] = useState<"idle"|"sending"|"done"|"error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setStatus("sending");
    try {
      const res = await fetch("/api/contact", { method:"POST",
        headers:{ "Content-Type":"application/json" }, body:JSON.stringify(form) });
      setStatus(res.ok ? "done" : "error");
    } catch { setStatus("error"); }
  };

  const inp: React.CSSProperties = {
    width:"100%", padding:"12px 14px", borderRadius:10,
    border:"1.5px solid #e2e8f0", background:"rgba(255,255,255,0.8)",
    color:"#0f172a", fontSize:14, fontFamily:"inherit", outline:"none", transition:"border-color 0.2s",
  };
  const lbl: React.CSSProperties = { fontSize:12, fontWeight:700, color:"#475569", display:"block", marginBottom:7, letterSpacing:"0.04em" };

  if (status === "done") return (
    <div style={{ textAlign:"center", padding:"32px 0" }}>
      <div style={{ width:52, height:52, borderRadius:"50%", background:"#eef2ff",
        display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px" }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
      </div>
      <div style={{ fontSize:17, fontWeight:700, color:"#0f172a", marginBottom:8 }}>送信完了しました</div>
      <div style={{ fontSize:14, color:"#64748b" }}>担当者より折り返しご連絡いたします。</div>
    </div>
  );

  return (
    <form onSubmit={submit} style={{ display:"grid", gap:14 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        {[{k:"company",label:"会社名",ph:"株式会社〇〇",req:true,type:"text"},{k:"name",label:"お名前",ph:"山田 太郎",req:true,type:"text"}].map(({k,label,ph,req,type}) => (
          <div key={k}>
            <label style={lbl}>{label}{req && <span style={{ color:"#ef4444", marginLeft:4 }}>*</span>}</label>
            <input required={req} type={type} placeholder={ph} value={form[k as keyof typeof form]}
              onChange={e => setForm({...form,[k]:e.target.value})} style={inp}
              onFocus={e => (e.target.style.borderColor="#6366f1")} onBlur={e => (e.target.style.borderColor="#e2e8f0")} />
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        {[{k:"email",label:"メールアドレス",ph:"your@example.com",req:true,type:"email"},{k:"phone",label:"電話番号",ph:"090-0000-0000",req:false,type:"tel"}].map(({k,label,ph,req,type}) => (
          <div key={k}>
            <label style={lbl}>{label}{req && <span style={{ color:"#ef4444", marginLeft:4 }}>*</span>}</label>
            <input required={req} type={type} placeholder={ph} value={form[k as keyof typeof form]}
              onChange={e => setForm({...form,[k]:e.target.value})} style={inp}
              onFocus={e => (e.target.style.borderColor="#6366f1")} onBlur={e => (e.target.style.borderColor="#e2e8f0")} />
          </div>
        ))}
      </div>
      <div>
        <label style={lbl}>お問い合わせ内容</label>
        <textarea rows={4} placeholder="ご相談内容をご記入ください" value={form.message}
          onChange={e => setForm({...form,message:e.target.value})}
          style={{...inp, resize:"vertical", lineHeight:1.75}}
          onFocus={e => (e.target.style.borderColor="#6366f1")} onBlur={e => (e.target.style.borderColor="#e2e8f0")} />
      </div>
      <button type="submit" disabled={status==="sending"} className="btn-primary-light"
        style={{ width:"100%", justifyContent:"center", marginTop:4, opacity:status==="sending"?0.7:1 }}>
        {status==="sending" ? "送信中..." : "送信する"}
      </button>
      {status==="error" && <div style={{ fontSize:13, color:"#ef4444", textAlign:"center" }}>送信に失敗しました。時間をおいて再度お試しください。</div>}
    </form>
  );
}
