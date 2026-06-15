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
        <section style={{ minHeight: "100vh", display: "flex", alignItems: "center",
          justifyContent: "center", padding: "120px 48px 140px", position: "relative" }}>
          <div style={{ textAlign: "center", maxWidth: 900, width: "100%" }}>
            <p style={{ fontSize: 12, letterSpacing: "0.32em", color: "#6366f1",
              fontWeight: 700, textTransform: "uppercase", marginBottom: 32,
              animation: "fade-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s both" }}>
              合同会社80 — Japan, Nagoya
            </p>
            <p style={{ fontSize: "clamp(20px, 2.8vw, 32px)", fontWeight: 800,
              color: "#6366f1", letterSpacing: "0.02em", marginBottom: 20,
              animation: "fade-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s both",
              fontStyle: "italic" }}>
              Build what&apos;s next.
            </p>
            <h1 style={{ fontSize: "clamp(28px, 5vw, 72px)", fontWeight: 800,
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
          {/* SCROLL — 画面下端に固定 */}
          <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
            animation: "fade-in 1s ease 1.4s both" }}>
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
                  合同会社80は、AIとソフトウェアで<br />人の知覚を拡張する会社です。
                </h2>
                <p style={{ fontSize: 16, color: "#475569", lineHeight: 2.0, marginBottom: 28 }}>
                  私たちのミッションは「人の知覚を、ソフトウェアで拡張する」こと。人が本来持つ力を引き出し、テクノロジーで可能性を広げる。そのためのソフトウェアを、真摯に作り続けます。
                </p>
                <p style={{ fontSize: 16, color: "#475569", lineHeight: 2.0 }}>
                  大企業だけでなく、中小企業や現場の第一線でも最先端のテクノロジーが活きる世界を目指して。AIとソフトウェアの力で、あらゆる現場の「できない」を「できる」に変えていきます。
                </p>
              </div>
            </div>

            {/* Values */}
            <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 72 }}>
              <div className="sr" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", color: "#6366f1", textTransform: "uppercase", marginBottom: 40 }}>Values</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
                {[
                  { en:"Integrity", jp:"誠実さ",       desc:"顧客・パートナー・社会に対して、常に誠実に向き合う" },
                  { en:"Curiosity", jp:"先端への好奇心", desc:"最新技術への探求を止めず、革新を追求し続ける" },
                  { en:"Respect",   jp:"人への敬意",    desc:"関わるすべての人を尊重し、共に成長することを喜びとする" },
                  { en:"Speed",     jp:"圧倒的な速さ",  desc:"機会を逃さず、スピードを最大の競争優位にする" },
                ].map((v, i) => (
                  <div key={v.en} className="sr" style={{ padding: "32px 28px", borderLeft: i === 0 ? "none" : "1px solid #e2e8f0", transitionDelay:`${i*0.08}s` }}>
                    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", color: "#6366f1", textTransform: "uppercase", marginBottom: 14 }}>{v.en}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>{v.jp}</div>
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
              <h2 style={{ fontSize: "clamp(64px, 10vw, 130px)", fontWeight: 900, letterSpacing: "-0.05em", color: "#0f172a", lineHeight: 1 }}>Business</h2>
            </div>
            {/* 2×2 grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>

              {/* 01 — LENDS AI */}
              <div className="sr" style={{ borderRadius: 20, overflow: "hidden", cursor: "pointer" }}
                onMouseEnter={e => { (e.currentTarget.querySelector(".biz-img") as HTMLElement).style.transform = "scale(1.03)"; }}
                onMouseLeave={e => { (e.currentTarget.querySelector(".biz-img") as HTMLElement).style.transform = "scale(1)"; }}>
                <div className="biz-img" style={{ height: 380, background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden",
                  transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
                  <div style={{ position: "absolute", fontSize: 96, fontWeight: 900, color: "rgba(99,102,241,0.1)", letterSpacing: "-0.05em", whiteSpace: "nowrap", userSelect: "none" }}>LENDS AI</div>
                  <div style={{ position: "relative", textAlign: "center" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(165,180,252,0.7)", textTransform: "uppercase", marginBottom: 16 }}>AI SaaS Platform</div>
                    <div style={{ fontSize: 42, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em" }}>LENDS AI</div>
                  </div>
                </div>
                <div style={{ padding: "22px 4px" }}>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8, fontWeight: 600 }}>01</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>Organisation Intelligence</div>
                  <div style={{ fontSize: 14, color: "#64748b", marginTop: 6, lineHeight: 1.7 }}>組織の状態をAIで可視化するSaaSプロダクト。人事課題の早期発見から採用・育成まで一気通貫で支援します。</div>
                </div>
              </div>

              {/* 02 — AI Build */}
              <div className="sr" style={{ borderRadius: 20, overflow: "hidden", cursor: "pointer", transitionDelay: "0.08s" }}
                onMouseEnter={e => { (e.currentTarget.querySelector(".biz-img") as HTMLElement).style.transform = "scale(1.03)"; }}
                onMouseLeave={e => { (e.currentTarget.querySelector(".biz-img") as HTMLElement).style.transform = "scale(1)"; }}>
                <div className="biz-img" style={{ height: 380, background: "linear-gradient(135deg, #0c0a1e 0%, #1e1b4b 50%, #0f172a 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden",
                  transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
                  <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(99,102,241,0.08) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
                  <div style={{ position: "relative", textAlign: "center" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(165,180,252,0.7)", textTransform: "uppercase", marginBottom: 16 }}>Custom AI Development</div>
                    <div style={{ fontSize: 42, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em" }}>AI Build</div>
                  </div>
                </div>
                <div style={{ padding: "22px 4px" }}>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8, fontWeight: 600 }}>02</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>AI Build</div>
                  <div style={{ fontSize: 14, color: "#64748b", marginTop: 6, lineHeight: 1.7 }}>ChatGPT・LLM・RAGを活用した業務AI・自動化ツール・データ分析システムをオーダーメイドで開発します。</div>
                </div>
              </div>

              {/* 03 — Craft */}
              <div className="sr" style={{ borderRadius: 20, overflow: "hidden", cursor: "pointer", transitionDelay: "0.16s" }}
                onMouseEnter={e => { (e.currentTarget.querySelector(".biz-img") as HTMLElement).style.transform = "scale(1.03)"; }}
                onMouseLeave={e => { (e.currentTarget.querySelector(".biz-img") as HTMLElement).style.transform = "scale(1)"; }}>
                <div className="biz-img" style={{ height: 380, background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden",
                  transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
                  <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                  <div style={{ position: "relative", textAlign: "center" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", color: "#94a3b8", textTransform: "uppercase", marginBottom: 16 }}>Web & Brand Design</div>
                    <div style={{ fontSize: 42, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.03em" }}>Craft</div>
                  </div>
                </div>
                <div style={{ padding: "22px 4px" }}>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8, fontWeight: 600 }}>03</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>Craft</div>
                  <div style={{ fontSize: 14, color: "#64748b", marginTop: 6, lineHeight: 1.7 }}>ブランドの価値をデジタルで表現するWeb制作。戦略的なUI/UXデザインから実装まで、事業の成果につながるサイトを届けます。</div>
                </div>
              </div>

              {/* 04 — Talent Match */}
              <div className="sr" style={{ borderRadius: 20, overflow: "hidden", cursor: "pointer", transitionDelay: "0.24s" }}
                onMouseEnter={e => { (e.currentTarget.querySelector(".biz-img") as HTMLElement).style.transform = "scale(1.03)"; }}
                onMouseLeave={e => { (e.currentTarget.querySelector(".biz-img") as HTMLElement).style.transform = "scale(1)"; }}>
                <div className="biz-img" style={{ height: 380, background: "linear-gradient(135deg, #0f172a 0%, #1a1025 50%, #0f172a 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden",
                  transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
                  <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 30% 50%, rgba(124,58,237,0.14) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(99,102,241,0.1) 0%, transparent 60%)" }} />
                  <div style={{ position: "relative", textAlign: "center" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(196,181,253,0.7)", textTransform: "uppercase", marginBottom: 16 }}>Talent Placement</div>
                    <div style={{ fontSize: 42, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em" }}>Talent Match</div>
                  </div>
                </div>
                <div style={{ padding: "22px 4px" }}>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8, fontWeight: 600 }}>04</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>Talent Match</div>
                  <div style={{ fontSize: 14, color: "#64748b", marginTop: 6, lineHeight: 1.7 }}>テクノロジーと人の知見を組み合わせた次世代型の人材紹介。企業と人材の最適なマッチングを実現します。（有料職業紹介事業）</div>
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
        <section style={{ background: "#fff", padding: "100px 0 120px", overflow: "hidden" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 64px", marginBottom: 52 }}>
            <div className="sr" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ width: 24, height: 1, background: "#6366f1" }} />
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", color: "#6366f1", textTransform: "uppercase" }}>Case Studies</div>
            </div>
            <h2 className="sr" style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
              AIを、現場に届けてきた。
            </h2>
          </div>

          {/* Ticker */}
          <div style={{ overflow: "hidden", cursor: "default" }}>
            <div className="ticker-track" style={{ display: "flex", gap: 16, width: "max-content" }}>
              {[
                { tag: "予約管理", title: "予約システムのAI化", desc: "空き状況の自動最適化と予約対応をAIが代行。対応工数を大幅削減。" },
                { tag: "採用・HR", title: "入社時テストのAI化", desc: "適性・論理・コミュ力をAIがスコアリング。一次評価を自動化。" },
                { tag: "業務効率", title: "日報管理のAI化", desc: "音声・テキスト入力からAIが日報を自動生成。提出率が劇的改善。" },
                { tag: "バックオフィス", title: "会計ソフトのAI化", desc: "レシート読み取り・仕訳提案をAIが自動処理。経理負荷を半減。" },
                { tag: "DX推進", title: "生成AIツールの社内導入", desc: "ChatGPTベースの社内AIアシスタントを構築し全社展開。" },
                { tag: "Web", title: "ホームページへのAI実装", desc: "サイト訪問者の質問にAIが即答。問い合わせ転換率が向上。" },
                { tag: "マーケ", title: "SEO対策のAI化", desc: "キーワード分析から記事構成・タイトル最適化までAIが自動提案。" },
                { tag: "コンテンツ", title: "自動ブログ更新AI", desc: "トレンド検知からAIが記事を生成し自動投稿。運用コストゼロへ。" },
                /* duplicate for seamless loop */
                { tag: "予約管理", title: "予約システムのAI化", desc: "空き状況の自動最適化と予約対応をAIが代行。対応工数を大幅削減。" },
                { tag: "採用・HR", title: "入社時テストのAI化", desc: "適性・論理・コミュ力をAIがスコアリング。一次評価を自動化。" },
                { tag: "業務効率", title: "日報管理のAI化", desc: "音声・テキスト入力からAIが日報を自動生成。提出率が劇的改善。" },
                { tag: "バックオフィス", title: "会計ソフトのAI化", desc: "レシート読み取り・仕訳提案をAIが自動処理。経理負荷を半減。" },
                { tag: "DX推進", title: "生成AIツールの社内導入", desc: "ChatGPTベースの社内AIアシスタントを構築し全社展開。" },
                { tag: "Web", title: "ホームページへのAI実装", desc: "サイト訪問者の質問にAIが即答。問い合わせ転換率が向上。" },
                { tag: "マーケ", title: "SEO対策のAI化", desc: "キーワード分析から記事構成・タイトル最適化までAIが自動提案。" },
                { tag: "コンテンツ", title: "自動ブログ更新AI", desc: "トレンド検知からAIが記事を生成し自動投稿。運用コストゼロへ。" },
              ].map((c, i) => (
                <div key={i} style={{
                  width: 280, flexShrink: 0, borderRadius: 18, padding: "32px 28px",
                  background: "#fff", border: "1.5px solid #e2e8f0",
                  backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
                  backgroundSize: "18px 18px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                  transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease",
                  cursor: "pointer",
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)";
                  }}
                >
                  <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, padding: "4px 10px",
                    borderRadius: 100, background: "#eef2ff", color: "#6366f1", marginBottom: 18,
                    letterSpacing: "0.04em" }}>{c.tag}</span>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", lineHeight: 1.45, marginBottom: 12 }}>{c.title}</div>
                  <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.75 }}>{c.desc}</div>
                </div>
              ))}
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
