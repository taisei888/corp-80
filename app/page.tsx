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
          <div style={{ textAlign: "center", maxWidth: 900, width: "100%" }}>
            <p style={{ fontSize: 19, color: "#64748b", lineHeight: 1.9,
              animation: "fade-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.45s both" }}>
              合同会社80は、AIとソフトウェアで<br />現場を根本から変える。
            </p>
          </div>
          {/* SCROLL — right side */}
          <div style={{ position: "fixed", right: 32, bottom: "50%", transform: "translateY(50%)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 16, zIndex: 10,
            animation: "fade-in 1s ease 1.4s both" }}>
            <div style={{ position: "relative", width: 1, height: 80, overflow: "hidden",
              background: "rgba(99,102,241,0.15)", borderRadius: 2 }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: "100%",
                background: "linear-gradient(to bottom, #6366f1, #a78bfa)",
                borderRadius: 2, animation: "scroll-bar 1.6s cubic-bezier(0.4,0,0.2,1) infinite" }} />
            </div>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em",
              color: "#94a3b8", textTransform: "uppercase",
              writingMode: "vertical-rl", textOrientation: "mixed" }}>Scroll</span>
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

              {/* 01 — quix */}
              <div className="sr" style={{ borderRadius: 20, overflow: "hidden", cursor: "pointer" }}
                onMouseEnter={e => { (e.currentTarget.querySelector(".biz-img") as HTMLElement).style.transform = "scale(1.03)"; }}
                onMouseLeave={e => { (e.currentTarget.querySelector(".biz-img") as HTMLElement).style.transform = "scale(1)"; }}>
                <div className="biz-img" style={{ height: 380, background: "linear-gradient(135deg, #5b21b6 0%, #6d28d9 40%, #7c3aed 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden",
                  transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
                  {/* subtle dot pattern */}
                  <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                  {/* glow */}
                  <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.25) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
                  <div style={{ position: "relative", textAlign: "center" }}>
                    {/* chat bubble icon */}
                    <div style={{ marginBottom: 20, display: "flex", justifyContent: "center" }}>
                      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                        <rect width="56" height="56" rx="16" fill="rgba(255,255,255,0.15)"/>
                        <path d="M14 20a4 4 0 014-4h20a4 4 0 014 4v12a4 4 0 01-4 4H26l-6 4v-4h-2a4 4 0 01-4-4V20z" fill="rgba(255,255,255,0.9)"/>
                        <circle cx="22" cy="26" r="2" fill="#7c3aed"/>
                        <circle cx="28" cy="26" r="2" fill="#7c3aed"/>
                        <circle cx="34" cy="26" r="2" fill="#7c3aed"/>
                      </svg>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(221,214,254,0.8)", textTransform: "uppercase", marginBottom: 12 }}>Social FAQ SaaS</div>
                    <div style={{ fontSize: 48, fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", fontStyle: "italic" }}>quix</div>
                  </div>
                </div>
                <div style={{ padding: "22px 4px" }}>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8, fontWeight: 600 }}>01</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>quix — 社内AIナレッジ検索</div>
                  <div style={{ fontSize: 14, color: "#64748b", marginTop: 6, lineHeight: 1.7 }}>チャット形式で社内のFAQ・規程・マニュアルを瞬時に回答。AIが蓄積された知識を自動整理し、問い合わせ工数を大幅削減します。</div>
                </div>
              </div>

              {/* 02 — LENDS AI */}
              <div className="sr" style={{ borderRadius: 20, overflow: "hidden", cursor: "pointer", transitionDelay: "0.08s" }}
                onMouseEnter={e => { (e.currentTarget.querySelector(".biz-img") as HTMLElement).style.transform = "scale(1.03)"; }}
                onMouseLeave={e => { (e.currentTarget.querySelector(".biz-img") as HTMLElement).style.transform = "scale(1)"; }}>
                <div className="biz-img" style={{ height: 380, background: "linear-gradient(120deg, #f8fafc 0%, #f8fafc 45%, #1a3a8f 45%, #1e40af 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden",
                  transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
                  {/* right side circle like the brand image */}
                  <div style={{ position: "absolute", right: -60, top: "50%", transform: "translateY(-50%)", width: 380, height: 380, borderRadius: "50%", background: "linear-gradient(135deg, #1d4ed8, #1e3a8a)", opacity: 0.95 }} />
                  <div style={{ position: "relative", textAlign: "left", paddingLeft: 32, paddingRight: 32, width: "100%" }}>
                    {/* LENDS AI logo text */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: "#1d4ed8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                          <circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>
                        </svg>
                      </div>
                      <div style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.03em" }}>LENDS AI</div>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", letterSpacing: "0.05em" }}>Organisation Intelligence</div>
                  </div>
                </div>
                <div style={{ padding: "22px 4px" }}>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8, fontWeight: 600 }}>02</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>LENDS AI — 組織診断AI</div>
                  <div style={{ fontSize: 14, color: "#64748b", marginTop: 6, lineHeight: 1.7 }}>組織の状態をAIで可視化するSaaSプロダクト。人事課題の早期発見から採用・育成まで一気通貫で支援します。</div>
                </div>
              </div>

              {/* 03 — AI Labs */}
              <div className="sr" style={{ borderRadius: 20, overflow: "hidden", cursor: "pointer", transitionDelay: "0.16s" }}
                onMouseEnter={e => { (e.currentTarget.querySelector(".biz-img") as HTMLElement).style.transform = "scale(1.03)"; }}
                onMouseLeave={e => { (e.currentTarget.querySelector(".biz-img") as HTMLElement).style.transform = "scale(1)"; }}>
                <div className="biz-img" style={{ height: 380, background: "linear-gradient(160deg, #e8ecf5 0%, #dde3f0 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden",
                  transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
                  {/* grid lines */}
                  <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
                  <div style={{ position: "relative", textAlign: "center" }}>
                    {/* AI Labs logo */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: 16 }}>
                      {/* A shape */}
                      <svg width="52" height="56" viewBox="0 0 52 56" fill="none">
                        <path d="M26 4L4 52h12l4-10h12l4 10h12L26 4z" fill="#0f172a"/>
                        <path d="M18 36l8-20 8 20" fill="none" stroke="#0f172a" strokeWidth="2"/>
                        {/* blue I */}
                        <path d="M38 4h14v8h-3v32h3v8H38v-8h3V12h-3V4z" fill="#2563eb"/>
                      </svg>
                      <div style={{ fontSize: 44, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.03em", lineHeight: 1 }}>Labs</div>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase" }}>AI System Development</div>
                  </div>
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
                <div className="biz-img" style={{ height: 380, background: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden",
                  transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
                  {/* decorative blobs — yellow */}
                  <div style={{ position: "absolute", top: -40, left: -30, width: 180, height: 80, borderRadius: 40, background: "#facc15", opacity: 0.55, transform: "rotate(-30deg)" }} />
                  <div style={{ position: "absolute", bottom: -30, right: -20, width: 140, height: 60, borderRadius: 30, background: "#fbbf24", opacity: 0.45, transform: "rotate(20deg)" }} />
                  <div style={{ position: "absolute", top: 20, right: 30, width: 50, height: 50, borderRadius: "50%", background: "#facc15", opacity: 0.6 }} />
                  <div style={{ position: "absolute", bottom: 40, left: 24, width: 30, height: 30, borderRadius: "50%", background: "#86efac", opacity: 0.5 }} />
                  <div style={{ position: "relative", textAlign: "center" }}>
                    {/* jGO logo */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 12 }}>
                      {/* chevrons */}
                      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" style={{ marginRight: 6 }}>
                        <path d="M8 10l12 12-12 12" stroke="#facc15" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M20 10l12 12-12 12" stroke="#1e3a8a" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <div style={{ fontSize: 46, fontWeight: 900, color: "#1e3a8a", letterSpacing: "-0.03em", lineHeight: 1 }}>jGO</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#475569", letterSpacing: "0.04em" }}>グローバルキャリア支援サービス</div>
                  </div>
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
            <div style={{ maxWidth: 1160, margin: "0 auto 56px", padding: "0 64px" }}>
              <div className="sr" style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                <div style={{ width: 24, height: 1, background: "#6366f1" }} />
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", color: "#6366f1", textTransform: "uppercase" }}>Case Studies</div>
              </div>
              <h2 className="sr" style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em" }}>
                AIを、現場に届けてきた。
              </h2>
            </div>

            {/* Ticker */}
            <div style={{ overflow: "hidden", paddingBottom: 8 }}>
              <div className="ticker-track" style={{ display: "flex", gap: 20, width: "max-content", padding: "12px 20px" }}>
                {((cards) => [...cards, ...cards])([
                  { tag: "予約管理", title: "予約システムのAI化", desc: "空き状況の自動最適化と予約対応をAIが代行。対応工数を大幅削減。",
                    accent: "#6366f1", visual: (
                      <svg viewBox="0 0 200 120" width="100%" height="100%">
                        <rect x="20" y="10" width="160" height="100" rx="10" fill="rgba(99,102,241,0.12)" stroke="rgba(99,102,241,0.3)" strokeWidth="1"/>
                        <rect x="20" y="10" width="160" height="24" rx="10" fill="rgba(99,102,241,0.2)"/>
                        {[0,1,2,3,4].map(col => [0,1,2,3].map(row => (
                          <rect key={`${col}-${row}`} x={32+col*30} y={44+row*18} width="20" height="10" rx="3"
                            fill={col===2&&row===1?"#6366f1":"rgba(99,102,241,0.15)"} />
                        )))}
                        <circle cx="160" cy="90" r="14" fill="#6366f1" opacity="0.9"/>
                        <text x="160" y="94" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">AI</text>
                      </svg>
                    )},
                  { tag: "採用・HR", title: "入社時テストのAI化", desc: "適性・論理・コミュ力をAIがスコアリング。一次評価を自動化。",
                    accent: "#7c3aed", visual: (
                      <svg viewBox="0 0 200 120" width="100%" height="100%">
                        {[{l:"論理力",v:88,c:"#7c3aed"},{l:"コミュ",v:74,c:"#a78bfa"},{l:"適性",v:92,c:"#6366f1"},{l:"語彙力",v:65,c:"#8b5cf6"}].map((b,i)=>(
                          <g key={b.l}>
                            <text x="20" y={26+i*24} fill="rgba(255,255,255,0.5)" fontSize="9">{b.l}</text>
                            <rect x="60" y={16+i*24} width="110" height="10" rx="5" fill="rgba(255,255,255,0.06)"/>
                            <rect x="60" y={16+i*24} width={110*b.v/100} height="10" rx="5" fill={b.c}/>
                            <text x="178" y={26+i*24} fill="rgba(255,255,255,0.7)" fontSize="9" textAnchor="end">{b.v}</text>
                          </g>
                        ))}
                      </svg>
                    )},
                  { tag: "業務効率", title: "日報管理のAI化", desc: "音声・テキスト入力からAIが日報を自動生成。提出率が劇的改善。",
                    accent: "#0891b2", visual: (
                      <svg viewBox="0 0 200 120" width="100%" height="100%">
                        <rect x="16" y="8" width="100" height="104" rx="8" fill="rgba(8,145,178,0.1)" stroke="rgba(8,145,178,0.25)" strokeWidth="1"/>
                        {[0,1,2,3,4,5].map(i=><rect key={i} x="26" y={20+i*14} width={i===0?70:i===1?55:i===2?65:i===3?48:i===4?60:40} height="6" rx="3" fill={`rgba(8,145,178,${0.15+i*0.05})`}/>)}
                        <rect x="126" y="30" width="60" height="60" rx="10" fill="rgba(8,145,178,0.2)" stroke="rgba(8,145,178,0.4)" strokeWidth="1"/>
                        <text x="156" y="65" textAnchor="middle" fill="#0891b2" fontSize="11" fontWeight="bold">AI</text>
                        <path d="M116 60 L126 60" stroke="#0891b2" strokeWidth="1.5" strokeDasharray="3,2" markerEnd="url(#arrow)"/>
                      </svg>
                    )},
                  { tag: "バックオフィス", title: "会計ソフトのAI化", desc: "レシート読み取り・仕訳提案をAIが自動処理。経理負荷を半減。",
                    accent: "#059669", visual: (
                      <svg viewBox="0 0 200 120" width="100%" height="100%">
                        {[40,65,50,80,70,90,85].map((h,i)=>(
                          <g key={i}>
                            <rect x={18+i*26} y={105-h} width="18" height={h} rx="4"
                              fill={i===6?"#059669":`rgba(5,150,105,${0.2+i*0.06})`}/>
                            <text x={27+i*26} y="114" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="7">
                              {["4月","5月","6月","7月","8月","9月","10月"][i]}
                            </text>
                          </g>
                        ))}
                        <text x="100" y="15" textAnchor="middle" fill="rgba(5,150,105,0.8)" fontSize="9" fontWeight="bold">経費処理 自動化率 94%</text>
                      </svg>
                    )},
                  { tag: "DX推進", title: "生成AIの社内導入", desc: "ChatGPTベースの社内AIアシスタントを構築し全社展開。",
                    accent: "#d97706", visual: (
                      <svg viewBox="0 0 200 120" width="100%" height="100%">
                        {[{x:16,y:10,w:120,h:28,r:14,c:"rgba(217,119,6,0.2)",s:"rgba(217,119,6,0.4)",txt:"営業資料を作って",tx:76,ty:29},{x:64,y:50,w:120,h:28,r:14,c:"rgba(217,119,6,0.35)",s:"rgba(217,119,6,0.6)",txt:"はい、作成しました！",tx:124,ty:69},{x:16,y:88,w:100,h:24,r:12,c:"rgba(217,119,6,0.15)",s:"rgba(217,119,6,0.3)",txt:"ありがとう",tx:66,ty:104}].map((b,i)=>(
                          <g key={i}>
                            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={b.r} fill={b.c} stroke={b.s} strokeWidth="1"/>
                            <text x={b.tx} y={b.ty} textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="8">{b.txt}</text>
                          </g>
                        ))}
                        <circle cx="176" cy="64" r="16" fill="rgba(217,119,6,0.25)" stroke="rgba(217,119,6,0.5)" strokeWidth="1.5"/>
                        <text x="176" y="68" textAnchor="middle" fill="#d97706" fontSize="9" fontWeight="bold">AI</text>
                      </svg>
                    )},
                  { tag: "Web", title: "ホームページへのAI実装", desc: "サイト訪問者の質問にAIが即答。問い合わせ転換率が向上。",
                    accent: "#0ea5e9", visual: (
                      <svg viewBox="0 0 200 120" width="100%" height="100%">
                        <rect x="12" y="8" width="140" height="90" rx="8" fill="rgba(14,165,233,0.08)" stroke="rgba(14,165,233,0.2)" strokeWidth="1"/>
                        <rect x="12" y="8" width="140" height="18" rx="8" fill="rgba(14,165,233,0.15)"/>
                        {[0,1,2].map(i=><circle key={i} cx={22+i*12} cy="17" r="3" fill={`rgba(14,165,233,${0.3+i*0.1})`}/>)}
                        {[0,1,2].map(i=><rect key={i} x="22" y={36+i*18} width={80-i*15} height="7" rx="3" fill="rgba(14,165,233,0.12)"/>)}
                        <rect x="118" y="52" width="56" height="56" rx="12" fill="rgba(14,165,233,0.2)" stroke="rgba(14,165,233,0.5)" strokeWidth="1.5"/>
                        <text x="146" y="82" textAnchor="middle" fill="#0ea5e9" fontSize="9" fontWeight="bold">Chat</text>
                        <text x="146" y="96" textAnchor="middle" fill="#0ea5e9" fontSize="8">AI</text>
                      </svg>
                    )},
                  { tag: "マーケ", title: "SEO対策のAI化", desc: "キーワード分析から記事構成・タイトル最適化までAIが自動提案。",
                    accent: "#ec4899", visual: (
                      <svg viewBox="0 0 200 120" width="100%" height="100%">
                        <polyline points="20,100 50,82 80,70 110,52 140,38 170,20" stroke="rgba(236,72,153,0.3)" strokeWidth="1.5" fill="none"/>
                        <polyline points="20,100 50,82 80,70 110,52 140,38 170,20" stroke="#ec4899" strokeWidth="2" fill="none" strokeDasharray="200" strokeDashoffset="0"/>
                        {[[50,82],[80,70],[110,52],[140,38],[170,20]].map(([x,y],i)=>(
                          <circle key={i} cx={x} cy={y} r="4" fill="#ec4899" opacity={0.6+i*0.08}/>
                        ))}
                        {[["1位","#6366f1"],["3位","#7c3aed"],["8位","#a78bfa"]].map(([r,c],i)=>(
                          <g key={i}>
                            <rect x="16" y={10+i*28} width="36" height="18" rx="4" fill={`${c}22`}/>
                            <text x="34" y="22" textAnchor="middle" fill={c as string} fontSize="9" fontWeight="bold">{r}</text>
                          </g>
                        ))}
                      </svg>
                    )},
                  { tag: "コンテンツ", title: "自動ブログ更新AI", desc: "トレンド検知からAIが記事を生成し自動投稿。運用コストゼロへ。",
                    accent: "#8b5cf6", visual: (
                      <svg viewBox="0 0 200 120" width="100%" height="100%">
                        <rect x="14" y="10" width="110" height="100" rx="8" fill="rgba(139,92,246,0.08)" stroke="rgba(139,92,246,0.2)" strokeWidth="1"/>
                        {[{y:24,w:80},{y:38,w:65},{y:52,w:75},{y:66,w:55},{y:80,w:70},{y:94,w:45}].map((l,i)=>(
                          <rect key={i} x="24" y={l.y} width={l.w} height="7" rx="3" fill={`rgba(139,92,246,${0.1+i*0.04})`}/>
                        ))}
                        <circle cx="158" cy="40" r="26" fill="rgba(139,92,246,0.15)" stroke="rgba(139,92,246,0.4)" strokeWidth="1.5"/>
                        <text x="158" y="36" textAnchor="middle" fill="#8b5cf6" fontSize="8" fontWeight="bold">AUTO</text>
                        <text x="158" y="48" textAnchor="middle" fill="#8b5cf6" fontSize="8">POST</text>
                        <path d="M132 60 Q145 80 158 70" stroke="rgba(139,92,246,0.5)" strokeWidth="1.5" fill="none" markerEnd="url(#a)"/>
                        {[0,1,2].map(i=>(
                          <circle key={i} cx={138+i*6} cy={88+i*6} r="3" fill={`rgba(139,92,246,${0.4-i*0.1})`}/>
                        ))}
                      </svg>
                    )},
                ]).map((c, i) => (
                  <div key={i} style={{
                    width: 300, flexShrink: 0, borderRadius: 20, overflow: "hidden",
                    background: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(16px)",
                    transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1), background 0.35s ease, border-color 0.35s ease",
                    cursor: "pointer",
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                      e.currentTarget.style.background = "#1e293b";
                      e.currentTarget.style.borderColor = `${c.accent}55`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = "";
                      e.currentTarget.style.background = "#0f172a";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    }}
                  >
                    {/* Visual area */}
                    <div style={{ height: 140, background: `linear-gradient(135deg, ${c.accent}18, ${c.accent}08)`,
                      borderBottom: `1px solid ${c.accent}22`, overflow: "hidden", padding: "8px 0 0" }}>
                      {c.visual}
                    </div>
                    {/* Text */}
                    <div style={{ padding: "22px 24px 26px" }}>
                      <span style={{ display: "inline-block", fontSize: 10, fontWeight: 700, padding: "3px 10px",
                        borderRadius: 100, background: `${c.accent}22`, color: c.accent, marginBottom: 12,
                        letterSpacing: "0.06em" }}>{c.tag}</span>
                      <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", lineHeight: 1.45, marginBottom: 10 }}>{c.title}</div>
                      <div style={{ fontSize: 12, color: "rgba(148,163,184,0.85)", lineHeight: 1.75 }}>{c.desc}</div>
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
        <section id="recruit" style={{ background: "#0a0f1e", padding: "140px 64px", position: "relative", overflow: "hidden" }}>
          {/* subtle grid lines */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: "linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)",
            backgroundSize: "80px 80px" }} />
          {/* glow */}
          <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)",
            width: 600, height: 600, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
            pointerEvents: "none" }} />

          <div style={{ maxWidth: 1160, margin: "0 auto", position: "relative", zIndex: 1 }}>
            {/* label */}
            <div className="sr" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.3em",
              color: "#6366f1", textTransform: "uppercase", marginBottom: 40 }}>
              Recruit
            </div>

            {/* headline */}
            <h2 className="sr" style={{ fontSize: "clamp(40px, 6vw, 88px)", fontWeight: 900,
              letterSpacing: "-0.04em", lineHeight: 1.05, color: "#f8fafc", marginBottom: 32,
              transitionDelay: "0.08s" }}>
              共に、未来を<br />作りにきてほしい。
            </h2>

            <p className="sr" style={{ fontSize: 17, color: "rgba(248,250,252,0.5)", lineHeight: 1.95,
              maxWidth: 560, marginBottom: 80, transitionDelay: "0.14s" }}>
              合同会社80は少数精鋭のチームです。<br />
              AIと向き合い、プロダクトを育てる仲間を探しています。<br />
              職種・経験より、熱量と思考力を重視します。
            </p>

            {/* positions */}
            <div className="sr" style={{ display: "flex", flexDirection: "column", gap: 0, transitionDelay: "0.2s" }}>
              {[
                { role: "AI Engineer", type: "業務委託 / 正社員", tags: ["Python", "LLM", "RAG"] },
                { role: "Frontend Engineer", type: "業務委託 / 正社員", tags: ["Next.js", "TypeScript", "UI/UX"] },
                { role: "Sales / BizDev", type: "業務委託 / インターン", tags: ["SaaS", "法人営業", "企画"] },
              ].map((pos, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "36px 0", borderTop: "1px solid rgba(255,255,255,0.08)",
                  cursor: "pointer", transition: "background 0.2s",
                  borderRadius: 0,
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(99,102,241,0.07)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 48, flexWrap: "wrap" }}>
                    <div style={{ fontSize: "clamp(20px, 2.2vw, 28px)", fontWeight: 800,
                      color: "#f8fafc", letterSpacing: "-0.02em", minWidth: 260 }}>{pos.role}</div>
                    <div style={{ fontSize: 13, color: "rgba(248,250,252,0.35)", fontWeight: 500 }}>{pos.type}</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {pos.tags.map(t => (
                        <span key={t} style={{ fontSize: 11, fontWeight: 600, padding: "4px 12px",
                          borderRadius: 100, border: "1px solid rgba(99,102,241,0.4)",
                          color: "#818cf8", letterSpacing: "0.04em" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(248,250,252,0.25)" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              ))}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />
            </div>

            {/* CTA */}
            <div className="sr" style={{ marginTop: 72, transitionDelay: "0.26s" }}>
              <a href="mailto:info@80llc.jp"
                style={{ display: "inline-flex", alignItems: "center", gap: 12,
                  padding: "18px 40px", borderRadius: 8,
                  background: "#6366f1", color: "#fff",
                  fontSize: 15, fontWeight: 700, letterSpacing: "0.01em",
                  textDecoration: "none", transition: "background 0.2s, transform 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background="#4f46e5"; (e.currentTarget as HTMLAnchorElement).style.transform="translateY(-2px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background="#6366f1"; (e.currentTarget as HTMLAnchorElement).style.transform="translateY(0)"; }}>
                カジュアル面談を申し込む
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
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
            {([["ビジョン","vision"],["事業内容","business"],["プロダクト","product"],["ニュース","news"],["採用","recruit"]] as const).map(([l, id]) => (
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

