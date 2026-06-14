"use client";

import { useEffect, useRef, useState } from "react";

// ─── Cursor (DOM-direct, no state) ──────────────────────────────────────────
function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = -1000, my = -1000;
    let rx = -1000, ry = -1000;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + "px";
      dot.style.top = my + "px";
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    const tick = () => {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      raf = requestAnimationFrame(tick);
    };

    const onOver = (e: MouseEvent) => {
      const el = (e.target as Element).closest("a,button,[data-hover]");
      ring.classList.toggle("expanded", !!el);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function Home() {
  const [navScrolled, setNavScrolled] = useState(false);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Nav scroll
    const onScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });

    // Mouse glow in hero
    const onMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.left = e.clientX + "px";
        glowRef.current.style.top = e.clientY + "px";
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    // Scroll reveal
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".section-reveal").forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
      observer.disconnect();
    };
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ background: "#fff" }}>
      <Cursor />

      {/* ── Nav ──────────────────────────────── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: navScrolled ? "0 48px" : "0 48px",
          height: navScrolled ? 64 : 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: navScrolled ? "rgba(255,255,255,0.94)" : "transparent",
          backdropFilter: navScrolled ? "blur(20px)" : "none",
          borderBottom: navScrolled ? "1px solid #f1f5f9" : "none",
          transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Logo */}
        <button
          data-hover
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            lineHeight: 1,
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 900,
              letterSpacing: "-0.02em",
              color: navScrolled ? "#0a0a1a" : "#fff",
              transition: "color 0.3s",
            }}
          >
            I.RI.N.G
          </span>
        </button>

        {/* Links */}
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          {[
            { label: "事業内容", id: "business" },
            { label: "プロダクト", id: "product" },
            { label: "会社について", id: "about" },
          ].map((item) => (
            <button
              key={item.id}
              className={navScrolled ? "nav-link dark" : "nav-link"}
              onClick={() => scrollTo(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          data-hover
          onClick={() => scrollTo("contact")}
          style={{
            padding: "9px 22px",
            borderRadius: 100,
            border: navScrolled ? "1.5px solid #6366f1" : "1.5px solid rgba(255,255,255,0.35)",
            background: "transparent",
            color: navScrolled ? "#6366f1" : "rgba(255,255,255,0.85)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.25s",
            letterSpacing: "0.02em",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.background = navScrolled ? "#6366f1" : "rgba(255,255,255,0.12)";
            el.style.color = navScrolled ? "#fff" : "#fff";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.background = "transparent";
            el.style.color = navScrolled ? "#6366f1" : "rgba(255,255,255,0.85)";
          }}
        >
          お問い合わせ
        </button>
      </nav>

      {/* ── Hero ─────────────────────────────── */}
      <section
        id="top"
        style={{
          position: "relative",
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#06050f",
          overflow: "hidden",
        }}
      >
        {/* Grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Animated blobs */}
        <div
          style={{
            position: "absolute",
            width: 700,
            height: 700,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.55) 0%, transparent 70%)",
            filter: "blur(100px)",
            top: "-15%",
            right: "-10%",
            pointerEvents: "none",
            animation: "blob1 22s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 550,
            height: 550,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,0.45) 0%, transparent 70%)",
            filter: "blur(90px)",
            bottom: "-15%",
            left: "-8%",
            pointerEvents: "none",
            animation: "blob2 28s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6,182,212,0.35) 0%, transparent 70%)",
            filter: "blur(80px)",
            top: "45%",
            left: "42%",
            pointerEvents: "none",
            animation: "blob3 18s ease-in-out infinite",
          }}
        />

        {/* Mouse glow */}
        <div
          ref={glowRef}
          style={{
            position: "absolute",
            width: 360,
            height: 360,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)",
            filter: "blur(40px)",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: 2,
            transition: "left 0.4s ease, top 0.4s ease",
            left: "50%",
            top: "50%",
          }}
        />

        {/* Hero content */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            textAlign: "center",
            padding: "0 24px",
            maxWidth: 900,
          }}
        >
          {/* Eyebrow */}
          <p
            style={{
              fontSize: 12,
              letterSpacing: "0.22em",
              color: "rgba(255,255,255,0.4)",
              textTransform: "uppercase",
              marginBottom: 40,
              animation: "fade-up 1s cubic-bezier(0.16,1,0.3,1) 0.1s both",
            }}
          >
            株式会社 I.RI.N.G Group
          </p>

          {/* Mission */}
          <h1
            style={{
              fontSize: "clamp(48px, 8vw, 96px)",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.15,
              letterSpacing: "-0.025em",
              marginBottom: 36,
              animation: "fade-up 1s cubic-bezier(0.16,1,0.3,1) 0.3s both",
            }}
          >
            人の知覚を、
            <br />
            ソフトウェアで
            <br />
            <span className="gradient-text">拡張する。</span>
          </h1>

          {/* Sub */}
          <p
            style={{
              fontSize: 15,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.12em",
              animation: "fade-up 1s cubic-bezier(0.16,1,0.3,1) 0.55s both",
            }}
          >
            Software that expands human perception.
          </p>

          {/* CTA buttons */}
          <div
            style={{
              display: "flex",
              gap: 14,
              justifyContent: "center",
              marginTop: 56,
              flexWrap: "wrap",
              animation: "fade-up 1s cubic-bezier(0.16,1,0.3,1) 0.75s both",
            }}
          >
            <button data-hover className="btn-primary" onClick={() => scrollTo("business")}>
              事業内容を見る
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <button data-hover className="btn-ghost" onClick={() => scrollTo("contact")}>
              お問い合わせ
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            color: "rgba(255,255,255,0.25)",
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            animation: "fade-in 1s ease 1.2s both",
          }}
        >
          <span>Scroll</span>
          <div
            style={{
              width: 1,
              height: 56,
              background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)",
              animation: "scroll-line 2.2s ease-in-out infinite",
              transformOrigin: "top",
            }}
          />
        </div>
      </section>

      {/* ── Business ─────────────────────────── */}
      <section id="business" style={{ padding: "120px 48px", background: "#fff" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div className="section-reveal" style={{ marginBottom: 72 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.2em",
              color: "#6366f1", marginBottom: 16, textTransform: "uppercase",
            }}>
              Business
            </div>
            <h2 style={{
              fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700,
              letterSpacing: "-0.025em", lineHeight: 1.2, maxWidth: 480,
            }}>
              3つの事業領域
            </h2>
            <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.9, marginTop: 16, maxWidth: 440 }}>
              パッケージ製品・AI受託開発・Webデザインの3軸で、
              クライアントのデジタル変革を支援します。
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>

            {/* 01 Package */}
            <div className="business-card section-reveal">
              <div style={{ fontSize: 11, fontWeight: 800, color: "#c7d2fe", marginBottom: 24, letterSpacing: "0.1em" }}>01</div>
              <div style={{
                width: 48, height: 48, borderRadius: 12, marginBottom: 28,
                background: "linear-gradient(135deg, #eef2ff, #e0e7ff)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.8">
                  <rect x="2" y="3" width="20" height="14" rx="2"/>
                  <path d="M8 21h8M12 17v4"/>
                </svg>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", color: "#6366f1", marginBottom: 10, textTransform: "uppercase" }}>
                SaaS Package
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14, lineHeight: 1.35, letterSpacing: "-0.01em" }}>
                パッケージ販売<br />
                <span style={{ fontSize: 14, fontWeight: 400, color: "#94a3b8" }}>LENDS AI など</span>
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.9, color: "#64748b" }}>
                自社開発のSaaSプロダクトを提供。LENDS AIは組織コンディションをスマホアンケート×AIで可視化し、人事課題の早期発見を支援します。
              </p>
            </div>

            {/* 02 AI Dev */}
            <div className="business-card section-reveal" style={{ transitionDelay: "0.1s" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#c7d2fe", marginBottom: 24, letterSpacing: "0.1em" }}>02</div>
              <div style={{
                width: 48, height: 48, borderRadius: 12, marginBottom: 28,
                background: "linear-gradient(135deg, #fdf4ff, #f3e8ff)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.8">
                  <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/>
                  <path d="M12 8v4l3 3"/>
                  <circle cx="12" cy="12" r="2" fill="#8b5cf6"/>
                </svg>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", color: "#8b5cf6", marginBottom: 10, textTransform: "uppercase" }}>
                AI Development
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14, lineHeight: 1.35, letterSpacing: "-0.01em" }}>
                AI受託開発
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.9, color: "#64748b" }}>
                ChatGPT・LLM・RAGを活用した業務効率化ツール、データ分析システム、AIチャットボットなどをオーダーメイドで開発します。
              </p>
            </div>

            {/* 03 Web Design */}
            <div className="business-card section-reveal" style={{ transitionDelay: "0.2s" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#c7d2fe", marginBottom: 24, letterSpacing: "0.1em" }}>03</div>
              <div style={{
                width: 48, height: 48, borderRadius: 12, marginBottom: 28,
                background: "linear-gradient(135deg, #ecfeff, #cffafe)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0891b2" strokeWidth="1.8">
                  <rect x="3" y="4" width="18" height="14" rx="2"/>
                  <path d="M7 8h2M7 12h2M13 8h4M13 12h4"/>
                </svg>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", color: "#0891b2", marginBottom: 10, textTransform: "uppercase" }}>
                Web Design
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14, lineHeight: 1.35, letterSpacing: "-0.01em" }}>
                HP制作デザイン
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.9, color: "#64748b" }}>
                ブランドの価値を最大化するWebサイト制作。戦略的なUI/UXデザインと高品質な実装で、ビジネスの成果につながるサイトを届けます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Product: LENDS AI ───────── */}
      <section id="product" style={{ padding: "120px 48px", background: "#fafafa" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div className="section-reveal" style={{ marginBottom: 72 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.2em",
              color: "#6366f1", marginBottom: 16, textTransform: "uppercase",
            }}>
              Featured Product
            </div>
            <h2 style={{
              fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700,
              letterSpacing: "-0.025em", lineHeight: 1.2,
            }}>
              LENDS AI
            </h2>
            <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.9, marginTop: 12 }}>
              組織コンディション可視化プラットフォーム
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            {/* Info */}
            <div className="section-reveal">
              <h3 style={{
                fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700,
                lineHeight: 1.55, marginBottom: 24, letterSpacing: "-0.02em",
              }}>
                スマホアンケート × AI分析で、<br />
                従業員の「今」を見える化する。
              </h3>
              <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.9, marginBottom: 36 }}>
                LENDS AIは毎月のアンケートをAIが分析し、組織コンディションを8タイプで可視化するSaaSです。人事課題の早期発見から採用・育成まで一気通貫で支援します。
              </p>

              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  "月次スマホアンケート × AI組織診断",
                  "8タイプ組織コンディション可視化",
                  "1on1面談記録・アシスト機能",
                  "採用AI・採用KPI管理",
                  "採用アセスメント（心理・論理・コミュ・敬語）",
                  "要面談候補者アラートメール通知",
                ].map((f) => (
                  <li key={f} style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 14, color: "#475569" }}>
                    <span style={{
                      width: 20, height: 20, borderRadius: 6,
                      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                data-hover
                href="https://www.lens-ai.jp"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ marginTop: 40, display: "inline-flex" }}
              >
                LENDS AI サイトへ
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <path d="M15 3h6v6M10 14L21 3"/>
                </svg>
              </a>
            </div>

            {/* Mock visual */}
            <div className="section-reveal" style={{ transitionDelay: "0.15s" }}>
              <div style={{
                background: "#06050f",
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: "0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.04)",
              }}>
                {/* Window bar */}
                <div style={{
                  background: "#0f0e1e",
                  padding: "14px 20px",
                  display: "flex",
                  gap: 7,
                  alignItems: "center",
                }}>
                  {["#f87171", "#fbbf24", "#34d399"].map((c) => (
                    <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.7 }} />
                  ))}
                  <div style={{ marginLeft: 12, fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em" }}>
                    LENDS AI — 組織ダッシュボード
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: 28 }}>
                  {/* Stats row */}
                  <div style={{ display: "flex", gap: 16, marginBottom: 28 }}>
                    {[
                      { val: "87", unit: "pt", label: "組織スコア", color: "#6366f1" },
                      { val: "+12", unit: "", label: "先月比", color: "#34d399" },
                      { val: "64", unit: "名", label: "回答者数", color: "#8b5cf6" },
                    ].map((s) => (
                      <div key={s.label} style={{
                        flex: 1, background: "rgba(255,255,255,0.04)",
                        borderRadius: 12, padding: "14px 16px",
                        border: "1px solid rgba(255,255,255,0.05)",
                      }}>
                        <div style={{ fontSize: 22, fontWeight: 700, color: s.color, letterSpacing: "-0.02em" }}>
                          {s.val}<span style={{ fontSize: 13 }}>{s.unit}</span>
                        </div>
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 4, letterSpacing: "0.05em" }}>
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bar chart */}
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    月別コンディション推移
                  </div>
                  <div style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 6,
                    height: 100,
                  }}>
                    {[52, 68, 60, 78, 72, 85, 87].map((h, i) => (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" }}>
                        <div style={{
                          width: "100%",
                          height: `${h}%`,
                          background: i === 6
                            ? "linear-gradient(to top, #6366f1, #8b5cf6)"
                            : "rgba(99,102,241,0.3)",
                          borderRadius: "4px 4px 0 0",
                          marginTop: "auto",
                          transition: "height 1s ease",
                        }} />
                        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>
                          {["7月", "8月", "9月", "10月", "11月", "12月", "1月"][i]}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Alert row */}
                  <div style={{
                    marginTop: 20, padding: "12px 16px",
                    background: "rgba(239,68,68,0.08)", borderRadius: 10,
                    border: "1px solid rgba(239,68,68,0.15)",
                    display: "flex", alignItems: "center", gap: 10,
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", flexShrink: 0 }} />
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                      要面談候補者 <span style={{ color: "#f87171", fontWeight: 700 }}>3名</span> — 今週アラート送信済み
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── About / Philosophy ───────────────── */}
      <section id="about" style={{ padding: "120px 48px", background: "#fff" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div className="section-reveal" style={{ marginBottom: 72 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.2em",
              color: "#6366f1", marginBottom: 16, textTransform: "uppercase",
            }}>
              Philosophy
            </div>
            <h2 style={{
              fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700,
              letterSpacing: "-0.025em", lineHeight: 1.2, maxWidth: 440,
            }}>
              私たちが大切に<br />していること
            </h2>
          </div>

          {/* Mission / Vision */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 64 }}>
            {[
              {
                label: "Mission",
                title: "人の知覚を、ソフトウェアで拡張する。",
                desc: "人が本来持つ力を引き出し、テクノロジーで可能性を広げる。私たちはそのためのソフトウェアを、真摯に作り続けます。",
                delay: "0s",
              },
              {
                label: "Vision",
                title: "テクノロジーの恩恵を、すべての現場へ。",
                desc: "大企業だけでなく、中小企業や現場の第一線でも最先端のテクノロジーが活きる世界を目指します。",
                delay: "0.1s",
              },
            ].map((v) => (
              <div
                key={v.label}
                className="section-reveal"
                style={{
                  padding: "48px 44px",
                  background: "linear-gradient(135deg, #fafafe, #f3f2ff)",
                  borderRadius: 20,
                  border: "1px solid rgba(99,102,241,0.1)",
                  transitionDelay: v.delay,
                }}
              >
                <div style={{
                  fontSize: 10, fontWeight: 800, letterSpacing: "0.22em",
                  color: "#6366f1", textTransform: "uppercase", marginBottom: 20,
                }}>
                  {v.label}
                </div>
                <p style={{
                  fontSize: "clamp(18px, 2.2vw, 24px)", fontWeight: 700,
                  lineHeight: 1.55, color: "#0a0a1a", marginBottom: 18,
                  letterSpacing: "-0.01em",
                }}>
                  {v.title}
                </p>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.9 }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Values */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
            {[
              { en: "Integrity", jp: "誠実さ", desc: "顧客・パートナー・社会に対して、常に誠実に向き合う" },
              { en: "Curiosity", jp: "先端への好奇心", desc: "最新技術への探求を止めず、革新を追求し続ける" },
              { en: "Respect", jp: "人への敬意", desc: "関わるすべての人を尊重し、共に成長することを喜びとする" },
              { en: "Speed", jp: "圧倒的な速さ", desc: "機会を逃さず、スピードを最大の競争優位にする" },
            ].map((v, i) => (
              <div
                key={v.en}
                className="section-reveal"
                style={{
                  padding: "36px 32px",
                  borderTop: "2px solid #6366f1",
                  borderRight: i < 3 ? "1px solid #f1f5f9" : "none",
                  transitionDelay: `${i * 0.08}s`,
                }}
              >
                <div style={{
                  fontSize: 10, fontWeight: 800, letterSpacing: "0.2em",
                  color: "#6366f1", textTransform: "uppercase", marginBottom: 10,
                }}>
                  {v.en}
                </div>
                <div style={{
                  fontSize: 18, fontWeight: 700, color: "#0a0a1a",
                  marginBottom: 12, letterSpacing: "-0.01em",
                }}>
                  {v.jp}
                </div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.85 }}>
                  {v.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ──────────────────────────── */}
      <section id="contact" style={{ padding: "120px 48px 140px", background: "#06050f", position: "relative", overflow: "hidden" }}>
        {/* Background blobs */}
        <div style={{
          position: "absolute", width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)",
          filter: "blur(80px)", top: "-20%", right: "-10%", pointerEvents: "none",
          animation: "blob1 20s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
          filter: "blur(60px)", bottom: "-15%", left: "-5%", pointerEvents: "none",
          animation: "blob2 26s ease-in-out infinite",
        }} />

        <div style={{ maxWidth: 640, margin: "0 auto", position: "relative", zIndex: 10 }}>
          <div className="section-reveal" style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.2em",
              color: "rgba(99,102,241,0.7)", marginBottom: 20, textTransform: "uppercase",
            }}>
              Contact
            </div>
            <h2 style={{
              fontSize: "clamp(36px, 5.5vw, 64px)", fontWeight: 700,
              color: "#fff", lineHeight: 1.2, letterSpacing: "-0.025em", marginBottom: 20,
            }}>
              一緒に、未来を<br />作りませんか。
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", lineHeight: 1.9 }}>
              テクノロジーで現場を変えたい企業様、<br />
              まずはお気軽にご相談ください。
            </p>
          </div>

          <div className="section-reveal" style={{
            background: "rgba(255,255,255,0.04)",
            borderRadius: 24,
            border: "1px solid rgba(255,255,255,0.08)",
            padding: "44px 40px",
            backdropFilter: "blur(10px)",
          }}>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────── */}
      <footer style={{
        background: "#02010a",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        padding: "40px 48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 20,
      }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 900, color: "rgba(255,255,255,0.5)", letterSpacing: "0.02em" }}>
            I.RI.N.G Group
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 4, letterSpacing: "0.05em" }}>
            株式会社I.RI.N.G Group
          </div>
        </div>

        <div style={{ display: "flex", gap: 32 }}>
          {[
            { label: "事業内容", id: "business" },
            { label: "プロダクト", id: "product" },
            { label: "会社について", id: "about" },
            { label: "お問い合わせ", id: "contact" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              style={{
                fontSize: 12, color: "rgba(255,255,255,0.3)",
                background: "none", border: "none", cursor: "pointer",
                padding: 0, transition: "color 0.2s",
                letterSpacing: "0.02em",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.18)", letterSpacing: "0.05em" }}>
          © 2025 株式会社I.RI.N.G Group. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

// ─── Contact Form ────────────────────────────────────────────────────────────
function ContactForm() {
  const [form, setForm] = useState({
    company: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "13px 16px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.2s, background 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 700,
    color: "rgba(255,255,255,0.45)",
    display: "block",
    marginBottom: 8,
    letterSpacing: "0.04em",
  };

  if (status === "done") {
    return (
      <div style={{ textAlign: "center", padding: "32px 0" }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px", fontSize: 22, color: "#fff",
        }}>✓</div>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
          送信完了しました
        </div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
          担当者より折り返しご連絡いたします。
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[
          { key: "company", label: "会社名", placeholder: "株式会社〇〇", req: true, type: "text" },
          { key: "name", label: "お名前", placeholder: "山田 太郎", req: true, type: "text" },
        ].map(({ key, label, placeholder, req, type }) => (
          <div key={key}>
            <label style={labelStyle}>
              {label}
              {req && <span style={{ color: "#f87171", marginLeft: 4 }}>*</span>}
            </label>
            <input
              required={req}
              type={type}
              placeholder={placeholder}
              value={form[key as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(99,102,241,0.6)";
                e.target.style.background = "rgba(255,255,255,0.07)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255,255,255,0.1)";
                e.target.style.background = "rgba(255,255,255,0.05)";
              }}
            />
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[
          { key: "email", label: "メールアドレス", placeholder: "your@example.com", req: true, type: "email" },
          { key: "phone", label: "電話番号", placeholder: "090-0000-0000", req: false, type: "tel" },
        ].map(({ key, label, placeholder, req, type }) => (
          <div key={key}>
            <label style={labelStyle}>
              {label}
              {req && <span style={{ color: "#f87171", marginLeft: 4 }}>*</span>}
            </label>
            <input
              required={req}
              type={type}
              placeholder={placeholder}
              value={form[key as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(99,102,241,0.6)";
                e.target.style.background = "rgba(255,255,255,0.07)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255,255,255,0.1)";
                e.target.style.background = "rgba(255,255,255,0.05)";
              }}
            />
          </div>
        ))}
      </div>

      <div>
        <label style={labelStyle}>お問い合わせ内容</label>
        <textarea
          rows={4}
          placeholder="ご相談内容をご記入ください"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          style={{ ...inputStyle, resize: "vertical", lineHeight: 1.75 }}
          onFocus={(e) => {
            e.target.style.borderColor = "rgba(99,102,241,0.6)";
            e.target.style.background = "rgba(255,255,255,0.07)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(255,255,255,0.1)";
            e.target.style.background = "rgba(255,255,255,0.05)";
          }}
        />
      </div>

      <button
        data-hover
        type="submit"
        disabled={status === "sending"}
        className="btn-primary"
        style={{
          width: "100%",
          justifyContent: "center",
          marginTop: 4,
          opacity: status === "sending" ? 0.7 : 1,
        }}
      >
        {status === "sending" ? "送信中..." : "送信する"}
      </button>

      {status === "error" && (
        <div style={{ fontSize: 13, color: "#f87171", textAlign: "center" }}>
          送信に失敗しました。時間をおいて再度お試しください。
        </div>
      )}
    </form>
  );
}
