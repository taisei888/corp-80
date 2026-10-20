"use client";

import { useEffect, useRef, useState } from "react";
import { Shippori_Mincho } from "next/font/google";

const mincho = Shippori_Mincho({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

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
          ctx.shadowColor = `rgba(100,116,139,${proximity * 0.8})`;
        }
        ctx.globalAlpha = alpha;
        ctx.fillStyle = proximity > 0.3 ? "#64748b" : "rgba(100,116,139,0.9)";
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

// ─── Count-up number（スクロールで出現したらカウントアップ） ───────────────────
function CaseNum({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const m = value.match(/^([+−-]?)(\d+)(.*)$/);
    if (!m) return;
    const [, sign, numStr, suffix] = m;
    const target = parseInt(numStr, 10);
    setDisplay(`${sign}0${suffix}`);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const dur = 1300;
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(`${sign}${Math.round(target * eased)}${suffix}`);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  return <span ref={ref} className="case-num">{display}</span>;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [inHero, setInHero] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [flat, setFlat] = useState(false);
  useEffect(() => { setFlat(new URLSearchParams(window.location.search).has("flat")); }, []);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

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
    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <div className="grain" style={{ position: "relative", zIndex: 1 }}>

        {/* ── Nav ── */}
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          height: navScrolled ? 60 : 70,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: isMobile ? "0 20px" : "0 48px",
          background: isMobile
            ? (navScrolled ? "rgba(248,250,252,0.95)" : "transparent")
            : navScrolled ? "rgba(248,250,252,0.88)" : "transparent",
          backdropFilter: navScrolled ? "blur(20px)" : "none",
          borderBottom: navScrolled ? "1px solid rgba(0,0,0,0.07)" : "none",
          transition: "all 0.3s ease",
        }}>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <img src="/logo-mark.png" alt="80" style={{ height: 56, display: "block", transition: "opacity 0.3s" }} />
          </button>
          <div className="mob-hide" style={{ display: "flex", gap: 36 }}>
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
          <a href="/contact"
            style={{ padding: "8px 18px", borderRadius: 6,
              border: "1.5px solid #0f172a",
              background: "transparent",
              color: "#0f172a",
              fontSize: 12, fontWeight: 600,
              cursor: "pointer", transition: "all 0.3s", fontFamily: "inherit", textDecoration: "none" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#0f172a"; e.currentTarget.style.color="#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color = "#0f172a"; }}>
            お問い合わせ
          </a>
        </nav>

        {/* ── Hero（明朝×余白×モーション） ── */}
        <section style={{
          minHeight: flat ? undefined : "100vh", display: "flex", alignItems: "center",
          padding: isMobile ? "110px 24px 120px" : "120px 64px 100px",
          background: "#fff", position: "relative", overflow: "hidden",
        }}>
          {/* 背景：アウトラインの「80」がゆっくり浮遊 */}
          <div aria-hidden className="serif hero-eighty" style={{
            position: "absolute",
            right: isMobile ? "-8vw" : "2vw",
            bottom: isMobile ? 140 : "-6vh",
            fontSize: isMobile ? "min(64vw, 360px)" : "min(38vw, 620px)",
            fontWeight: 500, lineHeight: 1, letterSpacing: "-0.05em",
            color: "transparent", WebkitTextStroke: "1px #dce3eb",
            userSelect: "none", pointerEvents: "none", zIndex: 1,
          }}>80</div>

          {/* 縦書きアクセント */}
          <div className="mob-hide hero-fade" style={{
            position: "absolute", top: 130, right: 52, writingMode: "vertical-rl",
            fontSize: 11, letterSpacing: "0.42em", color: "#94a3b8", fontWeight: 600,
            animationDelay: "1.4s",
          }}>AI AGENT STUDIO — NAGOYA</div>

          <div style={{ maxWidth: 1160, margin: "0 auto", width: "100%", position: "relative", zIndex: 2 }}>
            {/* 肩書き＋罫線ドロー */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: isMobile ? 28 : 36 }}>
              <div className="hero-rule" style={{ width: 56, height: 1, background: "#0f172a", transformOrigin: "left" }} />
              <div className="hero-fade" style={{ fontSize: 12, letterSpacing: "0.24em", color: "#475569", fontWeight: 600, animationDelay: "0.5s" }}>
                合同会社80 — AIエージェント開発
              </div>
            </div>

            {/* 見出し：1文字ずつ下から立ち上がる */}
            <h1 className="serif hero-title" style={{
              fontSize: isMobile ? "clamp(34px, 9.6vw, 44px)" : "clamp(48px, 5.6vw, 80px)",
              fontWeight: 700, lineHeight: 1.6, letterSpacing: "0.04em",
              color: "#0f172a", marginBottom: isMobile ? 26 : 34,
            }}>
              {["人の知覚を、", "ソフトウェアで拡張する。"].map((line, li) => (
                <span key={li} style={{ display: "block", overflow: "hidden", paddingBottom: "0.08em", marginBottom: "-0.08em" }}>
                  {[...line].map((ch, ci) => (
                    <span key={ci} className="ch" style={{ animationDelay: `${0.15 + li * 0.5 + ci * 0.05}s` }}>{ch}</span>
                  ))}
                </span>
              ))}
            </h1>

            <p className="hero-lead hero-fade" style={{
              fontSize: isMobile ? 14 : 16, color: "#64748b", lineHeight: 2.2,
              marginBottom: isMobile ? 40 : 52, animationDelay: "1.15s",
            }}>
              名古屋のAI開発会社、合同会社80。<br />
              貴社専用のAIエージェントが、めんどうな仕事を代わりに働きます。
            </p>

            <div className="hero-fade" style={{ display: "flex", gap: isMobile ? 20 : 36, alignItems: "center", flexWrap: "wrap", animationDelay: "1.35s" }}>
              <a href="/ai-labs" className="serif hero-cta"
                style={{
                  padding: isMobile ? "15px 30px" : "17px 40px",
                  background: "#0f172a", color: "#fff",
                  fontSize: 14, fontWeight: 600, letterSpacing: "0.14em",
                  textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 14,
                }}>
                AI LABを見る
                <span className="hero-cta-arrow" aria-hidden>→</span>
              </a>
              <a href="/demo" className="u-link serif" style={{
                fontSize: 14, fontWeight: 600, letterSpacing: "0.12em",
                color: "#0f172a", textDecoration: "none", paddingBottom: 6,
              }}>
                さわって体験する →
              </a>
            </div>
          </div>

          {/* 下端：流れるテキスト */}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 24, overflow: "hidden", whiteSpace: "nowrap", zIndex: 1 }}>
            <div className="hero-marquee serif" style={{ display: "inline-block", fontSize: 12, letterSpacing: "0.34em", color: "#c3cdd8" }}>
              {Array.from({ length: 2 }).map((_, i) => (
                <span key={i} style={{ paddingRight: "4em" }}>
                  AIエージェント開発　／　業務自動化　／　Webシステム　／　人材紹介　／　名古屋　─　NAGOYA, JAPAN　・
                  AIエージェント開発　／　業務自動化　／　Webシステム　／　人材紹介　／　名古屋　─　NAGOYA, JAPAN　・
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Fixed right-side scroll indicator */}
        <div style={{
          position: "fixed", right: isMobile ? 12 : 28, top: "50%", transform: "translateY(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 12, zIndex: 50,
          opacity: inHero ? 1 : 0, pointerEvents: "none",
          transition: "opacity 0.4s ease",
        }}>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", color: "#94a3b8",
            textTransform: "uppercase", writingMode: "vertical-rl",
          }}>Scroll</span>
          <div style={{
            width: 1, height: 48, position: "relative", overflow: "hidden",
            background: "rgba(100,116,139,0.15)", borderRadius: 2,
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, width: "100%",
              background: "linear-gradient(to bottom, #64748b, #94a3b8)",
              borderRadius: 2, animation: "scroll-bar 1.6s cubic-bezier(0.4,0,0.2,1) infinite",
            }} />
          </div>
        </div>

        {/* ── White overlay sections ── */}
        <div style={{ position: "relative" }}>

        {/* ── Vision & Mission ── */}
        <section id="vision" className="mob-section" style={{ background: "#fff", padding: "120px 64px 140px" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>

            {/* Mission */}
            <div className="sr" style={{ textAlign: "center", marginBottom: 120 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", color: "#64748b", textTransform: "uppercase", marginBottom: 32 }}>
                Our Mission
              </div>
              <h2 className="serif" style={{
                fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 700,
                lineHeight: 1.5, letterSpacing: "-0.03em", color: "#0f172a",
                marginBottom: 32,
              }}>
                人の知覚を、<br />ソフトウェアで拡張する。
              </h2>
              <p style={{ fontSize: 16, color: "#64748b", lineHeight: 2.0, maxWidth: 640, margin: "0 auto", marginBottom: 8 }}>
                私たちは、人が持つ感覚・違和感・気づき・判断を、<br className="mob-hide" />
                ソフトウェアの力でより見える形にし、企業や組織の意思決定を支えます。
              </p>
              <p style={{ fontSize: 16, color: "#64748b", lineHeight: 2.0, maxWidth: 640, margin: "0 auto" }}>
                AIやテクノロジーを人の代わりにするのではなく、<br className="mob-hide" />
                人の可能性を広げるために活用します。
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "48px auto 0", maxWidth: 320 }}>
                <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, #e2e8f0)" }} />
                <div style={{ width: 5, height: 5, transform: "rotate(45deg)", background: "#64748b" }} />
                <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, #e2e8f0, transparent)" }} />
              </div>
            </div>

            {/* Vision: Editorial split layout */}
            <div className="sr mob-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1.8fr", gap: 80, alignItems: "flex-start", marginBottom: 100 }}>
              {/* Left: label + big English */}
              <div style={{ position: "sticky", top: 120 }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.22em", color: "#64748b", textTransform: "uppercase", marginBottom: 24 }}>
                  私たちのビジョン
                </div>
                <div className="serif serif-outline" style={{ fontSize: "clamp(56px, 7vw, 96px)", fontWeight: 500, lineHeight: 1.0, letterSpacing: "-0.01em" }}>
                  Our<br />Vision
                </div>
              </div>

              {/* Right: Japanese headline + body */}
              <div className="sr" style={{ transitionDelay: "0.1s" }}>
                <h2 className="serif" style={{ fontSize: "clamp(26px, 3.2vw, 44px)", fontWeight: 700, lineHeight: 1.45, letterSpacing: "-0.02em", color: "#0f172a", marginBottom: 40 }}>
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
              <div className="sr" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", color: "#64748b", textTransform: "uppercase", marginBottom: 40 }}>Values</div>
              <div className="mob-grid-values" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 0 }}>
                {[
                  { en:"Human First",  jp:"人間起点",   desc:"技術や機能からではなく、使う人・働く人・悩む人の視点から考えます。" },
                  { en:"Visualize",    jp:"可視化",     desc:"声・違和感・不安・負担など、見えにくいものを判断できる形に変えます。" },
                  { en:"Practical",    jp:"実用設計",   desc:"高機能であることよりも、現場で自然に使われ続けることを大切にします。" },
                  { en:"Coexistence",  jp:"技術共存",   desc:"テクノロジーは人を置き換えるものではなく、人の感覚や判断を支える存在として設計します。" },
                  { en:"Iteration",    jp:"継続改善",   desc:"完璧を待たずに小さく試し、現場の反応を見ながらより良い仕組みに育てます。" },
                ].map((v, i) => (
                  <div key={v.en} className="sr" style={{ padding: "32px 24px", borderLeft: i === 0 ? "none" : "1px solid #e2e8f0", transitionDelay:`${i*0.08}s` }}>
                    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: "#64748b", textTransform: "uppercase", marginBottom: 14 }}>{v.en}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>{v.jp}</div>
                    <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.85 }}>{v.desc}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── Business ── */}
        <section id="business" className="mob-section" style={{ background: "#fff", padding: "120px 64px 140px" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <div className="sr" style={{ textAlign: "center", marginBottom: 72 }}>
              <h2 className="serif serif-outline" style={{ fontSize: "clamp(64px, 10vw, 130px)", fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 1 }}>Works</h2>
            </div>
            {/* 2×2 grid */}
            <div className="mob-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>

              {/* 01 — AI Lab */}
              <div className="sr work-card" style={{ borderRadius: 20, overflow: "hidden", cursor: "pointer", background: "#fff", border: "1px solid #e8edf3" }}
                onClick={() => window.open("/ai-labs", "_blank")}
                onMouseEnter={e => { (e.currentTarget.querySelector(".biz-img") as HTMLElement).style.transform = "scale(1.03)"; }}
                onMouseLeave={e => { (e.currentTarget.querySelector(".biz-img") as HTMLElement).style.transform = "scale(1)"; }}>
                <div className="biz-img" style={{ height: 380, overflow: "hidden",
                  transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
                  <img src="/3.jpg" alt="AI Lab" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                <div style={{ padding: "22px 24px 26px" }}>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8, fontWeight: 600 }}>01</div>
                  <div className="serif" style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", letterSpacing: "0.02em" }}>AI LAB — 業務AIの受託開発</div>
                  <div style={{ fontSize: 14, color: "#64748b", marginTop: 6, lineHeight: 1.7 }}>御社専用のAIエージェントをオーダーメイドで開発。議事録・書類読み取り・チャットボット・FAQ・サーベイ分析などのパッケージ商品もご用意しています。</div>
                </div>
              </div>

              {/* 02 — 人材 */}
              <div className="sr work-card" style={{ borderRadius: 20, overflow: "hidden", transitionDelay: "0.08s", background: "#fff", border: "1px solid #e8edf3" }}>
                <div className="biz-img" style={{ height: 380, overflow: "hidden",
                  transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
                  <img src="/4.jpg" alt="人材紹介" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                <div style={{ padding: "22px 24px 26px" }}>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8, fontWeight: 600 }}>02</div>
                  <div className="serif" style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", letterSpacing: "0.02em" }}>人材紹介</div>
                  <div style={{ fontSize: 14, color: "#64748b", marginTop: 6, lineHeight: 1.7 }}>企業と人材を丁寧につなぐキャリア支援サービス。テクノロジーと人の知見で最適なマッチングを実現します。（有料職業紹介事業　許可番号 23-ユ-303078）</div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ── AI Capabilities ── */}
        <section id="product" className="mob-section" style={{ background: "#fff", padding: "120px 64px 140px" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>

            {/* Header */}
            <div className="sr" style={{ marginBottom: 80 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <div style={{ width: 24, height: 1, background: "#64748b" }} />
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", color: "#64748b", textTransform: "uppercase" }}>AI CAPABILITIES</div>
              </div>
              <h2 className="serif" style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 700, lineHeight: 1.6, color: "#0f172a", maxWidth: 560 }}>
                AIは今、ビジネスの<br />何を変えられるのか。
              </h2>
            </div>

            {/* FOLIO-style: left text + right 2 cards */}
            <div className="mob-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>

              {/* Left: description */}
              <div className="sr">
                <p className="serif" style={{ fontSize: "clamp(18px, 2vw, 24px)", fontWeight: 600, lineHeight: 1.9, color: "#0f172a", marginBottom: 32 }}>
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
                <div style={{ borderRadius: 20, overflow: "hidden", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #40506a 100%)", padding: "40px 36px", position: "relative" }}>
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, transparent 32%, rgba(255,255,255,0.07) 46%, transparent 60%)", pointerEvents: "none" }} />
                  <div style={{ position: "absolute", top: -20, right: -20, width: 160, height: 160, borderRadius: "50%", border: "1px solid rgba(148,163,184,0.25)" }} />
                  <div style={{ position: "absolute", top: 10, right: 60, fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", color: "rgba(203,213,225,0.5)", textTransform: "uppercase" }}>LANGUAGE MODEL</div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(203,213,225,0.6)", textTransform: "uppercase", marginBottom: 16 }}>自動化 & 生成</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 14, lineHeight: 1.4 }}>ドキュメント・<br />コミュニケーションをAIで。</div>
                  <div style={{ fontSize: 13, color: "rgba(203,213,225,0.8)", lineHeight: 1.8 }}>
                    報告書・提案書・メールの自動生成。社内FAQへの即答。AIが"書く・答える"を肩代わりします。
                  </div>
                </div>

                {/* Card 2 */}
                <div style={{ borderRadius: 20, overflow: "hidden", background: "linear-gradient(135deg, #334155 0%, #1e293b 45%, #0f172a 100%)", padding: "40px 36px", position: "relative" }}>
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, transparent 38%, rgba(255,255,255,0.06) 52%, transparent 66%)", pointerEvents: "none" }} />
                  <div style={{ position: "absolute", bottom: -30, right: -30, width: 180, height: 180, borderRadius: "50%", border: "1px solid rgba(148,163,184,0.2)" }} />
                  <div style={{ position: "absolute", bottom: 40, right: 36, fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", color: "rgba(203,213,225,0.5)", textTransform: "uppercase" }}>DATA SCIENCE</div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(203,213,225,0.6)", textTransform: "uppercase", marginBottom: 16 }}>分析 & 洞察</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 14, lineHeight: 1.4 }}>データから、<br />意思決定を変える。</div>
                  <div style={{ fontSize: 13, color: "rgba(203,213,225,0.8)", lineHeight: 1.8 }}>
                    売上予測・異常検知・顧客分析。膨大なデータを即座に解釈し、ビジネスの判断を支えます。
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>


        {/* ── Case Studies — 成果ボード ── */}
        <section className="mob-section" style={{ background: "#f8fafc", padding: "100px 64px 120px", position: "relative", overflow: "hidden" }}>
          <DotCanvas />

          <div style={{ position: "relative", zIndex: 1, maxWidth: 1160, margin: "0 auto" }}>
            {/* Header */}
            <div style={{ marginBottom: 56, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div>
                <div className="sr" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", color: "#64748b", textTransform: "uppercase", marginBottom: 16 }}>Case Studies</div>
                <h2 className="sr serif" style={{ fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 700, color: "#0f172a", letterSpacing: "0.02em", lineHeight: 1.3, transitionDelay: "0.08s" }}>
                  AIを、現場に<br />届けてきた。
                </h2>
              </div>
              <div className="sr" style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500, textAlign: "right", transitionDelay: "0.12s" }}>
                実際の導入実績
              </div>
            </div>

            {/* 成果ボード */}
            <div className="sr" style={{ transitionDelay: "0.1s" }}>
              {[
                { tag: "業務効率",      title: "日報管理のAI化",         label: "提出率",           num: "+40%" },
                { tag: "採用・HR",      title: "入社時テストのAI化",     label: "選考時間",         num: "−62%" },
                { tag: "予約管理",      title: "予約システムのAI化",     label: "対応工数",         num: "−78%" },
                { tag: "バックオフィス", title: "会計ソフトのAI化",      label: "経理負荷",         num: "−50%" },
                { tag: "DX推進",        title: "生成AIの社内導入",       label: "生産性",           num: "+55%" },
                { tag: "Web",           title: "ホームページへのAI実装", label: "CV率",             num: "+38%" },
                { tag: "マーケ",        title: "SEO対策のAI化",          label: "オーガニック流入", num: "+210%" },
                { tag: "コンテンツ",    title: "自動ブログ更新AI",       label: "運用コスト",       num: "−90%" },
              ].map((c) => (
                <div key={c.title} className="case-row">
                  <span className="case-tag" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#94a3b8", textTransform: "uppercase" }}>{c.tag}</span>
                  <span className="case-title" style={{ fontSize: "clamp(16px, 1.8vw, 21px)", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", lineHeight: 1.4 }}>{c.title}</span>
                  <span className="case-label" style={{ fontSize: 13, fontWeight: 600, color: "#64748b", textAlign: "right" }}>{c.label}</span>
                  <span style={{ textAlign: "right", fontSize: "clamp(28px, 3.2vw, 42px)", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.03em", lineHeight: 1 }}>
                    <CaseNum value={c.num} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ── Recruit ── */}
        <section id="recruit" className="mob-section" style={{ background: "#0f172a", padding: "120px 64px 140px", position: "relative" }}>
          <div className="metal-hairline" style={{ position: "absolute", top: 0, left: 0, right: 0, opacity: 0.5 }} />
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>

            {/* Title */}
            <div className="sr mob-recruit-header" style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 80 }}>
              <h2 className="serif serif-outline-dark" style={{ fontSize: "clamp(48px, 7vw, 96px)", fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 1 }}>Recruit</h2>
              <a href="mailto:ito.t@80grp.com"
                style={{ display: "inline-flex", alignItems: "center", gap: 10,
                  padding: "12px 28px", borderRadius: 6,
                  border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)",
                  fontSize: 13, fontWeight: 600, letterSpacing: "0.02em",
                  textDecoration: "none", transition: "border-color 0.2s, color 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor="#64748b"; (e.currentTarget as HTMLAnchorElement).style.color="#fff"; }}
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
                          borderRadius: 100, background: "rgba(100,116,139,0.15)",
                          color: "#cbd5e1", letterSpacing: "0.04em" }}>{t}</span>
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
        <footer style={{ background: "#0b1220", padding: "80px 64px 0" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <div className="mob-grid-footer" style={{ display: "grid", gridTemplateColumns: "220px 1fr 200px", gap: 64, paddingBottom: 80, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>

              {/* Left — logo + tagline */}
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ marginBottom: 12 }}><img src="/logo-mark.png" alt="80" style={{ height: 64, display: "block" }} /></div>
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
                    {[["quix","/quix"],["LENDS AI","https://www.lens-ai.jp"],["AI Labs","/ai-labs"],["ツキジメ（請求書クラウド）","/tsukijime"],["補助金×システム開発","/hojokin"],["コラム・導入事例","/columns"],["jGO",null]].map(([l, href]) => (
                      href ? (
                        <a key={l as string} href={href as string} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                          style={{ fontSize:13, color:"rgba(255,255,255,0.45)", textDecoration:"none", transition:"color 0.2s" }}
                          onMouseEnter={e => (e.currentTarget.style.color="#fff")}
                          onMouseLeave={e => (e.currentTarget.style.color="rgba(255,255,255,0.45)")}>{l}</a>
                      ) : (
                        <span key={l as string} style={{ fontSize:13, color:"rgba(255,255,255,0.25)" }}>{l}</span>
                      )
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
                    {[["ビジョン","vision"],["事業内容","business"],["採用","recruit"]].map(([l, id]) => (
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
                  <a href="/contact"
                    style={{ fontSize:13, color:"rgba(255,255,255,0.45)", textDecoration:"none", transition:"color 0.2s", display:"block" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color="#fff")}
                    onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color="rgba(255,255,255,0.45)")}>
                    お問い合わせフォーム →
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
            <div style={{ padding: "28px 0 32px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.2)", letterSpacing:"0.04em" }}>
                © 2025 合同会社80. All rights reserved.
              </div>
              <div style={{ display:"flex", gap:24, alignItems:"center", flexWrap:"wrap" }}>
                {([["会社概要","/company"],["プライバシーポリシー","/privacy"],["利用規約","/terms"],["サイトマップ","/sitemap-page"]] as [string,string][]).map(([label,href])=>(
                  <a key={href} href={href} style={{ fontSize:11, color:"rgba(255,255,255,0.25)", textDecoration:"none", transition:"color 0.2s" }}
                    onMouseEnter={e=>e.currentTarget.style.color="rgba(255,255,255,0.6)"}
                    onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.25)"}>{label}</a>
                ))}
                <span style={{ fontSize:11, color:"rgba(255,255,255,0.2)" }}>名古屋市 / Nagoya, Japan</span>
              </div>
            </div>
          </div>
        </footer>
        </div>{/* /gradient wrapper */}
      </div>

      <style>{`
        .serif { font-family: ${mincho.style.fontFamily}, "Hiragino Mincho ProN", "Yu Mincho", serif; }

        /* アウトライン文字（旧メタル文字の置き換え） */
        .serif-outline { -webkit-text-stroke: 1.2px #b9c4d1; color: transparent; }
        .serif-outline-dark { -webkit-text-stroke: 1px rgba(255,255,255,0.34); color: transparent; }

        /* ヒーロー：1文字ずつ立ち上がる */
        .ch {
          display: inline-block;
          transform: translateY(112%);
          animation: ch-up 0.9s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
        @keyframes ch-up { to { transform: translateY(0); } }

        /* ヒーロー：ふわっと出る要素 */
        .hero-fade {
          opacity: 0;
          transform: translateY(14px);
          animation: hero-fade 1s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
        @keyframes hero-fade { to { opacity: 1; transform: translateY(0); } }

        /* ヒーロー：罫線が左から引かれる */
        .hero-rule {
          transform: scaleX(0);
          animation: rule-draw 1s cubic-bezier(0.19, 1, 0.22, 1) 0.3s forwards;
        }
        @keyframes rule-draw { to { transform: scaleX(1); } }

        /* ヒーロー：背景の80がゆっくり漂う */
        .hero-eighty {
          opacity: 0;
          animation: eighty-in 1.6s ease 0.8s forwards, eighty-float 9s ease-in-out 2.4s infinite alternate;
        }
        @keyframes eighty-in { to { opacity: 1; } }
        @keyframes eighty-float {
          from { transform: translateY(0); }
          to { transform: translateY(-26px); }
        }

        /* ヒーロー：下端マーキー */
        .hero-marquee { animation: marquee-x 36s linear infinite; }
        @keyframes marquee-x { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        /* CTA */
        .hero-cta { transition: letter-spacing 0.4s cubic-bezier(0.19,1,0.22,1), background 0.3s; }
        .hero-cta:hover { letter-spacing: 0.22em; background: #1e293b !important; }
        .hero-cta-arrow { display: inline-block; transition: transform 0.4s cubic-bezier(0.19,1,0.22,1); }
        .hero-cta:hover .hero-cta-arrow { transform: translateX(6px); }
        .u-link {
          background-image: linear-gradient(#0f172a, #0f172a);
          background-repeat: no-repeat;
          background-size: 0% 1px;
          background-position: left bottom;
          transition: background-size 0.5s cubic-bezier(0.19,1,0.22,1);
        }
        .u-link:hover { background-size: 100% 1px; }

        @media (prefers-reduced-motion: reduce) {
          .ch, .hero-fade, .hero-rule, .hero-eighty, .hero-marquee {
            animation: none !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }

        @media (max-width: 768px) {
          .hero-lead { font-size: 13px !important; }
          .mob-hide { display: none !important; }

          .mob-section {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }

          .mob-grid-2 {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }

          .mob-grid-values {
            grid-template-columns: 1fr 1fr !important;
            gap: 0 !important;
          }
          .mob-grid-values > div {
            border-left: none !important;
            border-top: 1px solid #e2e8f0;
            padding: 24px 16px !important;
          }

          .mob-grid-footer {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }

          .mob-news-item {
            grid-template-columns: auto auto 1fr !important;
            gap: 0 12px !important;
          }

          .mob-recruit-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 20px !important;
          }

          .mob-hero-orb1 {
            animation: orb-float 8s ease-in-out infinite alternate;
          }
          .mob-hero-orb2 {
            animation: orb-float 10s ease-in-out infinite alternate-reverse;
          }
          @keyframes orb-float {
            0% { transform: translate(0, 0) scale(1); }
            100% { transform: translate(-10px, 15px) scale(1.08); }
          }
          .mob-scroll-line {
            animation: scroll-pulse 2s ease-in-out infinite;
          }
          @keyframes scroll-pulse {
            0%, 100% { opacity: 0.3; transform: scaleY(0.6); transform-origin: top; }
            50% { opacity: 1; transform: scaleY(1); transform-origin: top; }
          }

          .biz-img { height: 220px !important; }
        }
      `}</style>
    </>
  );
}

