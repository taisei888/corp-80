"use client";

import { useEffect, useRef, useState } from "react";

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function Home() {
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });

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
      observer.disconnect();
    };
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ background: "#fff", color: "#1a1a2e" }}>

      {/* ── Nav ──────────────────────────────── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 48px",
          height: navScrolled ? 64 : 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: navScrolled ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.0)",
          backdropFilter: navScrolled ? "blur(20px)" : "none",
          borderBottom: navScrolled ? "1px solid #e8edf2" : "none",
          transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Logo */}
        <button
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
              fontSize: 22,
              fontWeight: 900,
              letterSpacing: "-0.03em",
              color: "#1a1a2e",
            }}
          >
            80
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
              onClick={() => scrollTo(item.id)}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                fontSize: 14,
                fontWeight: 500,
                color: "#4a5568",
                cursor: "pointer",
                transition: "color 0.2s",
                letterSpacing: "0.01em",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#1a1a2e")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#4a5568")}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => scrollTo("contact")}
          style={{
            padding: "9px 24px",
            borderRadius: 6,
            border: "1.5px solid #1a1a2e",
            background: "transparent",
            color: "#1a1a2e",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.22s",
            letterSpacing: "0.02em",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#1a1a2e";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#1a1a2e";
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
          background: "#fff",
          overflow: "hidden",
        }}
      >
        {/* Subtle background accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "45%",
            height: "100%",
            background: "linear-gradient(135deg, #f8f9ff 0%, #eef2ff 100%)",
            clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Hero content */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            maxWidth: 1160,
            width: "100%",
            padding: "0 48px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "center",
          }}
        >
          <div>
            {/* Eyebrow */}
            <p
              style={{
                fontSize: 12,
                letterSpacing: "0.2em",
                color: "#6366f1",
                textTransform: "uppercase",
                fontWeight: 700,
                marginBottom: 28,
                animation: "fade-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s both",
              }}
            >
              合同会社80
            </p>

            {/* Mission */}
            <h1
              style={{
                fontSize: "clamp(40px, 5.5vw, 72px)",
                fontWeight: 800,
                color: "#1a1a2e",
                lineHeight: 1.18,
                letterSpacing: "-0.03em",
                marginBottom: 28,
                animation: "fade-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.25s both",
              }}
            >
              人の知覚を、<br />
              ソフトウェアで<br />
              <span style={{ color: "#6366f1" }}>拡張する。</span>
            </h1>

            {/* Sub */}
            <p
              style={{
                fontSize: 16,
                color: "#64748b",
                lineHeight: 1.85,
                marginBottom: 44,
                animation: "fade-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.4s both",
              }}
            >
              テクノロジーの恩恵を、すべての現場へ。<br />
              AI・SaaS・Webで、ビジネスの可能性を広げます。
            </p>

            {/* CTA buttons */}
            <div
              style={{
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
                animation: "fade-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.55s both",
              }}
            >
              <button
                className="btn-primary-light"
                onClick={() => scrollTo("business")}
              >
                事業内容を見る
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <button
                className="btn-outline-light"
                onClick={() => scrollTo("contact")}
              >
                お問い合わせ
              </button>
            </div>
          </div>

          {/* Right side: visual */}
          <div
            style={{
              animation: "fade-up 1s cubic-bezier(0.16,1,0.3,1) 0.3s both",
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 20,
                border: "1px solid #e2e8f0",
                padding: 36,
                boxShadow: "0 20px 60px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04)",
              }}
            >
              {/* Stats */}
              <div style={{ display: "flex", gap: 16, marginBottom: 28 }}>
                {[
                  { val: "87", unit: "pt", label: "組織スコア", color: "#6366f1" },
                  { val: "+12", unit: "", label: "先月比", color: "#10b981" },
                  { val: "64", unit: "名", label: "回答者数", color: "#8b5cf6" },
                ].map((s) => (
                  <div key={s.label} style={{
                    flex: 1,
                    background: "#f8fafc",
                    borderRadius: 12,
                    padding: "16px",
                    border: "1px solid #f1f5f9",
                  }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: s.color, letterSpacing: "-0.02em" }}>
                      {s.val}<span style={{ fontSize: 13, fontWeight: 600 }}>{s.unit}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4, letterSpacing: "0.04em" }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bar chart */}
              <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                月別コンディション推移
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 90 }}>
                {[52, 68, 60, 78, 72, 85, 87].map((h, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" }}>
                    <div style={{
                      width: "100%",
                      height: `${h}%`,
                      background: i === 6
                        ? "linear-gradient(to top, #6366f1, #8b5cf6)"
                        : "#e0e7ff",
                      borderRadius: "4px 4px 0 0",
                      marginTop: "auto",
                    }} />
                    <div style={{ fontSize: 9, color: "#cbd5e1" }}>
                      {["7月", "8月", "9月", "10月", "11月", "12月", "1月"][i]}
                    </div>
                  </div>
                ))}
              </div>

              {/* Label */}
              <div style={{
                marginTop: 20,
                padding: "12px 16px",
                background: "#f0f4ff",
                borderRadius: 10,
                border: "1px solid #e0e7ff",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", flexShrink: 0 }} />
                <div style={{ fontSize: 12, color: "#6366f1", fontWeight: 600 }}>
                  LENDS AI — 組織ダッシュボード
                </div>
              </div>
            </div>
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
            color: "#cbd5e1",
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            animation: "fade-in 1s ease 1s both",
          }}
        >
          <span>Scroll</span>
          <div
            style={{
              width: 1,
              height: 48,
              background: "linear-gradient(to bottom, #cbd5e1, transparent)",
              animation: "scroll-line 2.2s ease-in-out infinite",
              transformOrigin: "top",
            }}
          />
        </div>
      </section>

      {/* ── Business ─────────────────────────── */}
      <section id="business" style={{ padding: "120px 48px", background: "#f8f9fc" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div className="section-reveal" style={{ marginBottom: 72 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.2em",
              color: "#6366f1", marginBottom: 16, textTransform: "uppercase",
            }}>
              Business
            </div>
            <h2 style={{
              fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800,
              letterSpacing: "-0.03em", lineHeight: 1.2, maxWidth: 480, color: "#1a1a2e",
            }}>
              3つの事業領域
            </h2>
            <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.9, marginTop: 16, maxWidth: 440 }}>
              パッケージ製品・AI受託開発・Webデザインの3軸で、<br />
              クライアントのデジタル変革を支援します。
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {/* 01 Package */}
            <div className="business-card-light section-reveal">
              <div style={{ fontSize: 11, fontWeight: 800, color: "#c7d2fe", marginBottom: 24, letterSpacing: "0.1em" }}>01</div>
              <div style={{
                width: 48, height: 48, borderRadius: 12, marginBottom: 28,
                background: "#eef2ff",
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
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14, lineHeight: 1.35, letterSpacing: "-0.01em", color: "#1a1a2e" }}>
                パッケージ販売<br />
                <span style={{ fontSize: 14, fontWeight: 400, color: "#94a3b8" }}>LENDS AI など</span>
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.9, color: "#64748b" }}>
                自社開発のSaaSプロダクトを提供。LENDS AIは組織コンディションをスマホアンケート×AIで可視化し、人事課題の早期発見を支援します。
              </p>
            </div>

            {/* 02 AI Dev */}
            <div className="business-card-light section-reveal" style={{ transitionDelay: "0.1s" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#c7d2fe", marginBottom: 24, letterSpacing: "0.1em" }}>02</div>
              <div style={{
                width: 48, height: 48, borderRadius: 12, marginBottom: 28,
                background: "#f5f3ff",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.8">
                  <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2"/>
                </svg>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", color: "#8b5cf6", marginBottom: 10, textTransform: "uppercase" }}>
                AI Development
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14, lineHeight: 1.35, letterSpacing: "-0.01em", color: "#1a1a2e" }}>
                AI受託開発
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.9, color: "#64748b" }}>
                ChatGPT・LLM・RAGを活用した業務効率化ツール、データ分析システム、AIチャットボットなどをオーダーメイドで開発します。
              </p>
            </div>

            {/* 03 Web Design */}
            <div className="business-card-light section-reveal" style={{ transitionDelay: "0.2s" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#c7d2fe", marginBottom: 24, letterSpacing: "0.1em" }}>03</div>
              <div style={{
                width: 48, height: 48, borderRadius: 12, marginBottom: 28,
                background: "#ecfeff",
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
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14, lineHeight: 1.35, letterSpacing: "-0.01em", color: "#1a1a2e" }}>
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
      <section id="product" style={{ padding: "120px 48px", background: "#fff" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div className="section-reveal" style={{ marginBottom: 72 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.2em",
              color: "#6366f1", marginBottom: 16, textTransform: "uppercase",
            }}>
              Featured Product
            </div>
            <h2 style={{
              fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800,
              letterSpacing: "-0.03em", lineHeight: 1.2, color: "#1a1a2e",
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
                lineHeight: 1.55, marginBottom: 24, letterSpacing: "-0.02em", color: "#1a1a2e",
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
                      background: "#eef2ff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="https://www.lens-ai.jp"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary-light"
                style={{ marginTop: 40, display: "inline-flex", textDecoration: "none" }}
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
                background: "#fff",
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: "0 24px 64px rgba(0,0,0,0.09), 0 0 0 1px #e2e8f0",
              }}>
                {/* Window bar */}
                <div style={{
                  background: "#f8fafc",
                  padding: "14px 20px",
                  display: "flex",
                  gap: 7,
                  alignItems: "center",
                  borderBottom: "1px solid #e2e8f0",
                }}>
                  {["#f87171", "#fbbf24", "#34d399"].map((c) => (
                    <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.7 }} />
                  ))}
                  <div style={{ marginLeft: 12, fontSize: 11, color: "#94a3b8", letterSpacing: "0.05em" }}>
                    LENDS AI — 組織ダッシュボード
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: 28 }}>
                  {/* Stats row */}
                  <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
                    {[
                      { val: "87", unit: "pt", label: "組織スコア", color: "#6366f1" },
                      { val: "+12", unit: "", label: "先月比", color: "#10b981" },
                      { val: "64", unit: "名", label: "回答者数", color: "#8b5cf6" },
                    ].map((s) => (
                      <div key={s.label} style={{
                        flex: 1, background: "#f8fafc",
                        borderRadius: 12, padding: "14px 16px",
                        border: "1px solid #f1f5f9",
                      }}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: s.color, letterSpacing: "-0.02em" }}>
                          {s.val}<span style={{ fontSize: 13, fontWeight: 600 }}>{s.unit}</span>
                        </div>
                        <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 4, letterSpacing: "0.05em" }}>
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bar chart */}
                  <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    月別コンディション推移
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 90 }}>
                    {[52, 68, 60, 78, 72, 85, 87].map((h, i) => (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" }}>
                        <div style={{
                          width: "100%",
                          height: `${h}%`,
                          background: i === 6
                            ? "linear-gradient(to top, #6366f1, #8b5cf6)"
                            : "#e0e7ff",
                          borderRadius: "4px 4px 0 0",
                          marginTop: "auto",
                        }} />
                        <div style={{ fontSize: 9, color: "#cbd5e1" }}>
                          {["7月", "8月", "9月", "10月", "11月", "12月", "1月"][i]}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Alert row */}
                  <div style={{
                    marginTop: 20, padding: "12px 16px",
                    background: "#fef2f2", borderRadius: 10,
                    border: "1px solid #fecaca",
                    display: "flex", alignItems: "center", gap: 10,
                  }}>
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

      {/* ── About / Philosophy ───────────────── */}
      <section id="about" style={{ padding: "120px 48px", background: "#f8f9fc" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div className="section-reveal" style={{ marginBottom: 72 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.2em",
              color: "#6366f1", marginBottom: 16, textTransform: "uppercase",
            }}>
              Philosophy
            </div>
            <h2 style={{
              fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800,
              letterSpacing: "-0.03em", lineHeight: 1.2, maxWidth: 440, color: "#1a1a2e",
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
                  background: "#fff",
                  borderRadius: 20,
                  border: "1px solid #e2e8f0",
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
                  lineHeight: 1.55, color: "#1a1a2e", marginBottom: 18,
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
                  borderRight: i < 3 ? "1px solid #e2e8f0" : "none",
                  background: "#fff",
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
                  fontSize: 18, fontWeight: 700, color: "#1a1a2e",
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
      <section id="contact" style={{ padding: "120px 48px 140px", background: "#fff" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div className="section-reveal" style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.2em",
              color: "#6366f1", marginBottom: 20, textTransform: "uppercase",
            }}>
              Contact
            </div>
            <h2 style={{
              fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800,
              color: "#1a1a2e", lineHeight: 1.2, letterSpacing: "-0.03em", marginBottom: 20,
            }}>
              一緒に、未来を<br />作りませんか。
            </h2>
            <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.9 }}>
              テクノロジーで現場を変えたい企業様、<br />
              まずはお気軽にご相談ください。
            </p>
          </div>

          <div className="section-reveal" style={{
            background: "#fff",
            borderRadius: 20,
            border: "1px solid #e2e8f0",
            padding: "44px 40px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
          }}>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────── */}
      <footer style={{
        background: "#1a1a2e",
        padding: "40px 48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 20,
      }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em" }}>
            80
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4, letterSpacing: "0.05em" }}>
            合同会社80
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
                fontSize: 12, color: "rgba(255,255,255,0.45)",
                background: "none", border: "none", cursor: "pointer",
                padding: 0, transition: "color 0.2s",
                letterSpacing: "0.02em",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: "0.05em" }}>
          © 2025 合同会社80. All rights reserved.
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
    padding: "12px 16px",
    borderRadius: 10,
    border: "1.5px solid #e2e8f0",
    background: "#fff",
    color: "#1a1a2e",
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 700,
    color: "#4a5568",
    display: "block",
    marginBottom: 8,
    letterSpacing: "0.04em",
  };

  if (status === "done") {
    return (
      <div style={{ textAlign: "center", padding: "32px 0" }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          background: "#eef2ff",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#1a1a2e", marginBottom: 8 }}>
          送信完了しました
        </div>
        <div style={{ fontSize: 14, color: "#64748b" }}>
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
              {req && <span style={{ color: "#ef4444", marginLeft: 4 }}>*</span>}
            </label>
            <input
              required={req}
              type={type}
              placeholder={placeholder}
              value={form[key as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
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
              {req && <span style={{ color: "#ef4444", marginLeft: 4 }}>*</span>}
            </label>
            <input
              required={req}
              type={type}
              placeholder={placeholder}
              value={form[key as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
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
          onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
          onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary-light"
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
        <div style={{ fontSize: 13, color: "#ef4444", textAlign: "center" }}>
          送信に失敗しました。時間をおいて再度お試しください。
        </div>
      )}
    </form>
  );
}
