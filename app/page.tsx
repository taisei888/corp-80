"use client";

import { useEffect, useRef, useState } from "react";

const LENDS_AI_URL = "https://www.lens-ai.jp";

export default function Home() {
  const cursorRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);

    const onMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      cursorRef.current = { x, y };
      setCursorPos({ x, y });
    };

    const onScroll = () => setNavScrolled(window.scrollY > 50);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("scroll", onScroll);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".section-reveal").forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      {/* Cursor marble glow */}
      {mounted && (
        <div
          style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
            pointerEvents: "none", zIndex: 0,
            background: `radial-gradient(700px circle at ${cursorPos.x}% ${cursorPos.y}%, rgba(129,140,248,0.13) 0%, rgba(192,132,252,0.07) 30%, transparent 65%)`,
            transition: "background 0.12s ease",
          }}
        />
      )}

      {/* ── Nav ─────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "20px 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: navScrolled ? "rgba(5,6,15,0.88)" : "transparent",
        backdropFilter: navScrolled ? "blur(24px)" : "none",
        borderBottom: navScrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
        transition: "all 0.4s ease",
      }}>
        <div
          style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-0.04em", cursor: "pointer", lineHeight: 1 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <span className="gradient-text">80</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          {[
            { label: "サービス", id: "services" },
            { label: "私たちについて", id: "about" },
            { label: "会社概要", id: "company" },
            { label: "お問い合わせ", id: "contact" },
          ].map((item) => (
            <button key={item.id} className="nav-link"
              onClick={() => scrollTo(item.id)}
              style={{ background: "none", border: "none", cursor: "pointer" }}>
              {item.label}
            </button>
          ))}
        </div>

        <button className="btn-primary" style={{ fontSize: 13, padding: "10px 24px" }}
          onClick={() => scrollTo("contact")}>
          無料相談
        </button>
      </nav>

      {/* ── Hero ────────────────────────────────── */}
      <section style={{
        position: "relative", minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden", padding: "120px 24px 80px",
      }}>
        {/* Background orbs */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}>
          <div style={{
            position: "absolute", top: "10%", left: "5%",
            width: 650, height: 650, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.32) 0%, rgba(139,92,246,0.12) 50%, transparent 75%)",
            filter: "blur(70px)", animation: "float 9s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute", top: "35%", right: "0%",
            width: 550, height: 550, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(192,132,252,0.28) 0%, rgba(244,114,182,0.12) 50%, transparent 75%)",
            filter: "blur(70px)", animation: "float 11s ease-in-out infinite 3.5s",
          }} />
          <div style={{
            position: "absolute", bottom: "5%", left: "30%",
            width: 450, height: 450, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(244,114,182,0.22) 0%, rgba(99,102,241,0.08) 50%, transparent 75%)",
            filter: "blur(60px)", animation: "float 13s ease-in-out infinite 7s",
          }} />
          {/* Rotating rings */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            width: 1000, height: 1000, marginTop: -500, marginLeft: -500,
            border: "1px solid rgba(139,92,246,0.07)", borderRadius: "50%",
            animation: "rotate-slow 35s linear infinite",
          }}>
            <div style={{
              position: "absolute", top: 50, left: 50, right: 50, bottom: 50,
              border: "1px solid rgba(244,114,182,0.05)", borderRadius: "50%",
              animation: "counter-rotate 22s linear infinite",
            }} />
            <div style={{
              position: "absolute", top: 110, left: 110, right: 110, bottom: 110,
              border: "1px solid rgba(99,102,241,0.04)", borderRadius: "50%",
              animation: "rotate-slow 18s linear infinite",
            }} />
          </div>
          {/* Particles */}
          {[
            { top: "22%", left: "22%", size: 4, color: "#818cf8", delay: "0s", dur: 7 },
            { top: "62%", left: "12%", size: 3, color: "#f472b6", delay: "1.5s", dur: 9 },
            { top: "30%", right: "18%", size: 5, color: "#c084fc", delay: "0.8s", dur: 8 },
            { top: "72%", right: "28%", size: 3, color: "#818cf8", delay: "2.1s", dur: 11 },
            { top: "48%", left: "58%", size: 4, color: "#f472b6", delay: "1.1s", dur: 10 },
            { top: "15%", right: "40%", size: 2, color: "#c084fc", delay: "0.4s", dur: 6 },
          ].map((p, i) => (
            <div key={i} style={{
              position: "absolute",
              top: p.top, left: (p as { left?: string }).left, right: (p as { right?: string }).right,
              width: p.size, height: p.size, borderRadius: "50%",
              background: p.color, boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
              animation: `float ${p.dur}s ease-in-out infinite ${p.delay}`,
              opacity: 0.75,
            }} />
          ))}
        </div>

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 800 }}>
          <div style={{
            display: "inline-block", padding: "6px 20px", borderRadius: 100,
            background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.22)",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", color: "#c084fc",
            marginBottom: 36, animation: "fade-in 0.8s ease 0.2s both",
          }}>
            GODO KAISHA 80
          </div>

          <h1 style={{
            fontSize: "clamp(42px, 7vw, 86px)", fontWeight: 900,
            lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: 28,
            animation: "slide-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s both",
          }}>
            <span className="gradient-text">テクノロジーで、</span>
            <br />
            未来を共に<span className="gradient-text">創る</span>
          </h1>

          <p style={{
            fontSize: 17, lineHeight: 1.9, color: "rgba(255,255,255,0.5)",
            maxWidth: 520, margin: "0 auto 52px",
            animation: "slide-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s both",
          }}>
            システム開発・人材紹介・AIソリューションで、<br />
            ビジネスの次のステージを共に実現します。
          </p>

          <div style={{
            display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap",
            animation: "slide-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.7s both",
          }}>
            <button className="btn-primary" onClick={() => scrollTo("services")}>
              サービスを見る
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button className="btn-outline" onClick={() => scrollTo("contact")}>
              無料相談する
            </button>
          </div>

          <div style={{
            display: "flex", gap: 56, justifyContent: "center", marginTop: 80,
            animation: "slide-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.9s both",
          }}>
            {[
              { num: "3", label: "コアサービス" },
              { num: "501万", label: "資本金" },
              { num: "愛知", label: "名古屋市拠点" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-0.02em" }} className="gradient-text">{s.num}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 6, letterSpacing: "0.08em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          animation: "fade-in 1s ease 1.5s both",
        }}>
          <div style={{ fontSize: 10, letterSpacing: "0.18em", color: "rgba(255,255,255,0.3)" }}>SCROLL</div>
          <div style={{ width: 1, height: 48, background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)" }} />
        </div>
      </section>

      {/* ── Services ────────────────────────────── */}
      <section id="services" style={{ padding: "120px 48px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div className="section-reveal" style={{ textAlign: "center", marginBottom: 72 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: "#8b5cf6", marginBottom: 14, textTransform: "uppercase" }}>Services</div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 16 }}>
              私たちの<span className="gradient-text">サービス</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, maxWidth: 440, margin: "0 auto" }}>
              ビジネスの課題に合わせた最適なソリューションをご提供します。
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {/* System Dev */}
            <div className="glass-card section-reveal" style={{ padding: "40px 32px" }} onClick={() => scrollTo("contact")}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.15))",
                border: "1px solid rgba(99,102,241,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 24, fontSize: 22,
              }}>💻</div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#818cf8", marginBottom: 10, textTransform: "uppercase" }}>
                System Development
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 14, lineHeight: 1.35 }}>
                オーダーメイド<br />システム開発
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.9, color: "rgba(255,255,255,0.45)" }}>
                ホームページ制作からWebアプリ・スマートフォンアプリまで、貴社のビジネス要件に完全カスタマイズしたシステムを開発。最新技術で競争優位性を構築します。
              </p>
              <div style={{ marginTop: 28, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["Webサイト", "Webアプリ", "スマホアプリ", "API"].map((t) => (
                  <span key={t} style={{
                    fontSize: 11, fontWeight: 600, padding: "4px 11px", borderRadius: 100,
                    background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "#a5b4fc",
                  }}>{t}</span>
                ))}
              </div>
            </div>

            {/* HR */}
            <div className="glass-card section-reveal" style={{ padding: "40px 32px", transitionDelay: "0.1s" }} onClick={() => scrollTo("contact")}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: "linear-gradient(135deg, rgba(192,132,252,0.25), rgba(244,114,182,0.15))",
                border: "1px solid rgba(192,132,252,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 24, fontSize: 22,
              }}>🤝</div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#c084fc", marginBottom: 10, textTransform: "uppercase" }}>
                Staffing & Recruitment
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 14, lineHeight: 1.35 }}>
                人材紹介業
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.9, color: "rgba(255,255,255,0.45)" }}>
                企業の成長に欠かせない「人」のマッチングを支援。採用要件ヒアリングから候補者選定・面接サポートまで、最適な人材をご紹介します。
              </p>
              <div style={{ marginTop: 28, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["採用支援", "人材マッチング", "キャリア相談", "企業向け"].map((t) => (
                  <span key={t} style={{
                    fontSize: 11, fontWeight: 600, padding: "4px 11px", borderRadius: 100,
                    background: "rgba(192,132,252,0.1)", border: "1px solid rgba(192,132,252,0.2)", color: "#e9d5ff",
                  }}>{t}</span>
                ))}
              </div>
            </div>

            {/* LENDS AI */}
            <div
              className="glass-card section-reveal"
              style={{
                padding: "40px 32px", transitionDelay: "0.2s",
                background: "linear-gradient(135deg, rgba(244,114,182,0.05), rgba(99,102,241,0.05))",
                border: "1px solid rgba(244,114,182,0.12)",
              }}
              onClick={() => window.open(LENDS_AI_URL, "_blank")}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: "linear-gradient(135deg, rgba(244,114,182,0.25), rgba(99,102,241,0.15))",
                border: "1px solid rgba(244,114,182,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 24, fontSize: 22,
              }}>✦</div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#f9a8d4", marginBottom: 10, textTransform: "uppercase" }}>
                AI Solution
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 14, lineHeight: 1.35 }}>
                LENDS AI
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.9, color: "rgba(255,255,255,0.45)" }}>
                組織のエンゲージメントを可視化し、マネジメントを次世代へ。AIを活用した組織診断・採用アセスメント・1on1支援で、強い組織づくりをサポート。
              </p>
              <div style={{
                marginTop: 28, display: "flex", alignItems: "center", gap: 6,
                fontSize: 13, fontWeight: 700, color: "#f9a8d4",
              }}>
                サービスサイトへ
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── About ───────────────────────────────── */}
      <section id="about" style={{ padding: "120px 48px", position: "relative", zIndex: 1 }}>
        <div style={{
          position: "absolute", top: "20%", right: 0,
          width: 500, height: 500,
          background: "radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 70%)",
          filter: "blur(80px)", pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 96, alignItems: "center" }}>
          <div className="section-reveal">
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: "#8b5cf6", marginBottom: 16, textTransform: "uppercase" }}>About Us</div>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 44px)", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 28, lineHeight: 1.2 }}>
              テクノロジーで<br /><span className="gradient-text">ビジネスの可能性</span><br />を広げる
            </h2>
            <p style={{ fontSize: 15, lineHeight: 2.1, color: "rgba(255,255,255,0.45)", marginBottom: 20 }}>
              合同会社80は愛知県名古屋市を拠点に、オーダーメイドのシステム開発・人材紹介・AIソリューションを提供するテクノロジーカンパニーです。
            </p>
            <p style={{ fontSize: 15, lineHeight: 2.1, color: "rgba(255,255,255,0.45)" }}>
              「テクノロジーで、未来を共に創る」をミッションに、クライアントの課題に真摯に向き合い、最適なソリューションを提供し続けます。
            </p>
          </div>

          <div className="section-reveal" style={{ transitionDelay: "0.15s", display: "grid", gap: 16 }}>
            {[
              { icon: "⚡", title: "スピード", desc: "迅速な開発・納品でビジネスチャンスを逃しません", color: "#6366f1" },
              { icon: "🎯", title: "フルカスタマイズ", desc: "既製品ではなく、貴社専用のソリューションを構築します", color: "#8b5cf6" },
              { icon: "🔒", title: "信頼性", desc: "セキュリティと品質に妥協なく、長期パートナーとして伴走", color: "#ec4899" },
            ].map((v) => (
              <div key={v.title} className="glass-card" style={{ padding: "22px 24px", display: "flex", gap: 18, alignItems: "flex-start" }}>
                <div style={{
                  width: 44, height: 44, flexShrink: 0, borderRadius: 12,
                  background: `rgba(${v.color === "#6366f1" ? "99,102,241" : v.color === "#8b5cf6" ? "139,92,246" : "236,72,153"},0.12)`,
                  border: `1px solid rgba(${v.color === "#6366f1" ? "99,102,241" : v.color === "#8b5cf6" ? "139,92,246" : "236,72,153"},0.2)`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                }}>{v.icon}</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 5 }}>{v.title}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.42)", lineHeight: 1.7 }}>{v.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Company Info ────────────────────────── */}
      <section id="company" style={{ padding: "120px 48px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div className="section-reveal" style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: "#8b5cf6", marginBottom: 16, textTransform: "uppercase" }}>Company</div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.02em" }}>
              <span className="gradient-text">会社概要</span>
            </h2>
          </div>

          <div className="glass-card section-reveal" style={{ overflow: "hidden", padding: 0 }}>
            {[
              { label: "会社名", value: "合同会社80" },
              { label: "資本金", value: "501万円" },
              { label: "所在地", value: "愛知県名古屋市北区楠味鋺2-914-2-2F" },
              { label: "電話番号", value: "050-8896-5889（代表）" },
              { label: "事業内容", value: "オーダーメイドシステム開発（ホームページ制作・アプリ開発）、人材紹介業、AIソリューション（LENDS AI）" },
              { label: "許認可番号", value: "23-ユ-303078" },
            ].map((row, i, arr) => (
              <div key={row.label} style={{
                display: "grid", gridTemplateColumns: "150px 1fr",
                borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
              }}>
                <div style={{
                  padding: "22px 24px", fontSize: 12, fontWeight: 700,
                  color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em",
                  borderRight: "1px solid rgba(255,255,255,0.05)",
                  background: "rgba(255,255,255,0.02)",
                }}>{row.label}</div>
                <div style={{ padding: "22px 24px", fontSize: 14, color: "rgba(255,255,255,0.78)", lineHeight: 1.7 }}>
                  {row.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ─────────────────────────────── */}
      <section id="contact" style={{ padding: "120px 48px 160px", position: "relative", zIndex: 1 }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: 700, height: 400,
          background: "radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)",
          filter: "blur(60px)", pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div className="section-reveal">
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: "#8b5cf6", marginBottom: 16, textTransform: "uppercase" }}>Contact</div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 18 }}>
              まずは<span className="gradient-text">無料相談</span>から
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.42)", lineHeight: 1.95, marginBottom: 48 }}>
              プロジェクトのご相談・お見積もり・採用のご相談など、<br />お気軽にお問い合わせください。
            </p>

            <div className="glass-card" style={{ padding: "44px 40px" }}>
              <ContactForm />
            </div>

            <div style={{
              marginTop: 36, display: "flex", justifyContent: "center",
              gap: 8, alignItems: "center", color: "rgba(255,255,255,0.3)", fontSize: 13,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              050-8896-5889（代表）
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────── */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.05)", padding: "40px 48px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 16, position: "relative", zIndex: 1,
      }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.03em" }} className="gradient-text">80</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>合同会社80</div>
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.22)" }}>
          © 2025 合同会社80. All rights reserved.
        </div>
      </footer>
    </>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ company: "", name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "13px 16px", borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff", fontSize: 14, outline: "none",
    fontFamily: "inherit",
    transition: "border-color 0.2s ease",
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = "rgba(139,92,246,0.5)");
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = "rgba(255,255,255,0.1)");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, employees: "" }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{
          width: 60, height: 60, borderRadius: "50%", margin: "0 auto 20px",
          background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(244,114,182,0.2))",
          border: "1px solid rgba(139,92,246,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
        }}>✓</div>
        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>送信完了しました</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>担当者より折り返しご連絡いたします。</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14, textAlign: "left" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {[
          { key: "company", label: "会社名", placeholder: "株式会社〇〇", req: true },
          { key: "name", label: "お名前", placeholder: "山田 太郎", req: true },
        ].map(({ key, label, placeholder, req }) => (
          <div key={key}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.45)", display: "block", marginBottom: 7, letterSpacing: "0.05em" }}>
              {label}{req && <span style={{ color: "#f472b6", marginLeft: 3 }}>*</span>}
            </label>
            <input
              required={req}
              value={form[key as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              placeholder={placeholder}
              style={inputStyle}
              onFocus={handleFocus} onBlur={handleBlur}
            />
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {[
          { key: "email", label: "メールアドレス", placeholder: "your@example.com", req: true, type: "email" },
          { key: "phone", label: "電話番号", placeholder: "090-0000-0000", req: false, type: "tel" },
        ].map(({ key, label, placeholder, req, type }) => (
          <div key={key}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.45)", display: "block", marginBottom: 7, letterSpacing: "0.05em" }}>
              {label}{req && <span style={{ color: "#f472b6", marginLeft: 3 }}>*</span>}
            </label>
            <input
              required={req} type={type}
              value={form[key as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              placeholder={placeholder}
              style={inputStyle}
              onFocus={handleFocus} onBlur={handleBlur}
            />
          </div>
        ))}
      </div>
      <div>
        <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.45)", display: "block", marginBottom: 7, letterSpacing: "0.05em" }}>
          お問い合わせ内容
        </label>
        <textarea
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="ご相談内容をご記入ください"
          style={{ ...inputStyle, resize: "vertical", lineHeight: 1.75 }}
          onFocus={handleFocus} onBlur={handleBlur}
        />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary"
        style={{ width: "100%", justifyContent: "center", marginTop: 6, opacity: status === "sending" ? 0.7 : 1 }}
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
