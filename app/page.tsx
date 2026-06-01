"use client";

import { useEffect, useState } from "react";

const LENDS_AI_URL = "https://www.lens-ai.jp";

export default function Home() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".section-reveal").forEach((el) => observer.observe(el));

    return () => { window.removeEventListener("scroll", onScroll); observer.disconnect(); };
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ background: "#fff", color: "#0f172a" }}>

      {/* ── Nav ─────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 48px",
        height: 68,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: navScrolled ? "rgba(255,255,255,0.92)" : "transparent",
        backdropFilter: navScrolled ? "blur(20px)" : "none",
        borderBottom: navScrolled ? "1px solid #f1f5f9" : "none",
        transition: "all 0.35s ease",
      }}>
        <button
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.04em" }} className="gradient-text">80.</span>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {[
            { label: "サービス", id: "services" },
            { label: "私たちについて", id: "about" },
            { label: "会社概要", id: "company" },
          ].map((item) => (
            <button key={item.id} className="nav-link" onClick={() => scrollTo(item.id)}>
              {item.label}
            </button>
          ))}
        </div>

        <button className="btn-primary" style={{ fontSize: 13, padding: "9px 22px" }} onClick={() => scrollTo("contact")}>
          お問い合わせ
        </button>
      </nav>

      {/* ── Hero ────────────────────────────────── */}
      <section style={{
        minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "120px 48px 80px",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(160deg, #fafafa 0%, #fff 50%, #faf5ff 100%)",
      }}>
        {/* Subtle bg decoration */}
        <div style={{
          position: "absolute", top: "8%", right: "8%",
          width: 480, height: 480, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)",
          filter: "blur(40px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", left: "5%",
          width: 360, height: 360, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)",
          filter: "blur(40px)", pointerEvents: "none",
        }} />

        {/* Decorative grid pattern */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(circle, #e2e8f0 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          opacity: 0.5,
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
        }} />

        <div style={{
          position: "relative", zIndex: 1, textAlign: "center", maxWidth: 760,
          animation: "fade-up 0.9s cubic-bezier(0.16,1,0.3,1) both",
        }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "5px 16px", borderRadius: 100,
            background: "rgba(99,102,241,0.06)",
            border: "1px solid rgba(99,102,241,0.15)",
            fontSize: 12, fontWeight: 600, color: "#6366f1",
            marginBottom: 40, letterSpacing: "0.06em",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", display: "inline-block" }} />
            テクノロジーカンパニー · 名古屋
          </div>

          <h1 style={{
            fontSize: "clamp(38px, 6vw, 72px)",
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            marginBottom: 28,
            color: "#0f172a",
          }}>
            ビジネスの課題を、<br />
            <span className="gradient-text">テクノロジーで解く。</span>
          </h1>

          <p style={{
            fontSize: 18, lineHeight: 1.85, color: "#64748b",
            maxWidth: 500, margin: "0 auto 52px",
            fontWeight: 400,
          }}>
            システム開発・人材紹介・AIソリューション。<br />
            合同会社80が、あなたの成長を共に支えます。
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={() => scrollTo("services")}>
              サービスを見る
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button className="btn-ghost" onClick={() => scrollTo("contact")}>
              無料で相談する
            </button>
          </div>

          {/* Social proof bar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 32, marginTop: 72,
            padding: "24px 40px",
            background: "#fff",
            borderRadius: 16,
            border: "1px solid #f1f5f9",
            boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
          }}>
            {[
              { num: "3", label: "コアサービス" },
              { num: "501万円", label: "資本金" },
              { num: "愛知・名古屋", label: "拠点" },
            ].map((s, i) => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 32 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>{s.num}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3, letterSpacing: "0.05em" }}>{s.label}</div>
                </div>
                {i < 2 && <div style={{ width: 1, height: 32, background: "#e2e8f0" }} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ────────────────────────────── */}
      <section id="services" style={{ padding: "120px 48px", background: "#fff" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div className="section-reveal" style={{ marginBottom: 64 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.16em",
              color: "#6366f1", marginBottom: 14, textTransform: "uppercase",
            }}>Services</div>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.025em", maxWidth: 480 }}>
              3つの領域で、<br /><span className="gradient-text">課題を解決します</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>

            {/* System Dev */}
            <div className="service-card section-reveal" onClick={() => scrollTo("contact")}>
              <div style={{
                width: 48, height: 48, borderRadius: 12, marginBottom: 28,
                background: "linear-gradient(135deg, #eef2ff, #e0e7ff)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
              }}>💻</div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "#6366f1", marginBottom: 10, textTransform: "uppercase" }}>
                System Development
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 14, letterSpacing: "-0.01em", lineHeight: 1.3 }}>
                オーダーメイド<br />システム開発
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.9, color: "#64748b" }}>
                ホームページ制作からWebアプリ・スマートフォンアプリまで、貴社の要件に完全カスタマイズしたシステムを開発します。
              </p>
              <div style={{ marginTop: 28, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["Webサイト", "Webアプリ", "スマホアプリ"].map((t) => (
                  <span key={t} style={{
                    fontSize: 11, fontWeight: 600, padding: "4px 11px", borderRadius: 100,
                    background: "#f0f0ff", color: "#6366f1",
                  }}>{t}</span>
                ))}
              </div>
            </div>

            {/* HR */}
            <div className="service-card section-reveal" style={{ transitionDelay: "0.08s" }} onClick={() => scrollTo("contact")}>
              <div style={{
                width: 48, height: 48, borderRadius: 12, marginBottom: 28,
                background: "linear-gradient(135deg, #fdf4ff, #f3e8ff)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
              }}>🤝</div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "#8b5cf6", marginBottom: 10, textTransform: "uppercase" }}>
                Staffing &amp; Recruitment
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 14, letterSpacing: "-0.01em", lineHeight: 1.3 }}>
                人材紹介業
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.9, color: "#64748b" }}>
                企業の成長に欠かせない「人」のマッチングを支援。採用要件ヒアリングから候補者選定・面接サポートまでトータルで対応します。
              </p>
              <div style={{ marginTop: 28, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["採用支援", "人材マッチング", "キャリア相談"].map((t) => (
                  <span key={t} style={{
                    fontSize: 11, fontWeight: 600, padding: "4px 11px", borderRadius: 100,
                    background: "#faf5ff", color: "#8b5cf6",
                  }}>{t}</span>
                ))}
              </div>
            </div>

            {/* LENDS AI */}
            <div
              className="service-card section-reveal"
              style={{
                transitionDelay: "0.16s",
                background: "linear-gradient(160deg, #fdf2f8 0%, #fff 60%)",
                borderColor: "#fbcfe8",
                position: "relative", overflow: "hidden",
              }}
              onClick={() => window.open(LENDS_AI_URL, "_blank")}
            >
              {/* Featured badge */}
              <div style={{
                position: "absolute", top: 20, right: 20,
                fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
                padding: "4px 10px", borderRadius: 100,
                background: "rgba(236,72,153,0.1)", color: "#ec4899",
                border: "1px solid rgba(236,72,153,0.2)",
              }}>自社プロダクト</div>
              <div style={{
                width: 48, height: 48, borderRadius: 12, marginBottom: 28,
                background: "linear-gradient(135deg, #fce7f3, #fdf2f8)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
              }}>✦</div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "#ec4899", marginBottom: 10, textTransform: "uppercase" }}>
                AI Solution
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 14, letterSpacing: "-0.01em", lineHeight: 1.3 }}>
                LENDS AI
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.9, color: "#64748b" }}>
                組織のエンゲージメントを可視化し、マネジメントを次世代へ。AIを活用した組織診断・採用アセスメント・1on1支援サービス。
              </p>
              <div style={{
                marginTop: 28, display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: 13, fontWeight: 700, color: "#ec4899",
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
      <section id="about" style={{ padding: "120px 48px", background: "#fafafa" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 100, alignItems: "center" }}>

          <div className="section-reveal">
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: "#6366f1", marginBottom: 16, textTransform: "uppercase" }}>About Us</div>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 900, letterSpacing: "-0.025em", marginBottom: 28, lineHeight: 1.2 }}>
              テクノロジーで、<br />ビジネスの可能性を<br /><span className="gradient-text">最大化する</span>
            </h2>
            <p style={{ fontSize: 15, lineHeight: 2.1, color: "#64748b", marginBottom: 20 }}>
              合同会社80は、愛知県名古屋市を拠点に、オーダーメイドのシステム開発・人材紹介・AIソリューションを提供するテクノロジーカンパニーです。
            </p>
            <p style={{ fontSize: 15, lineHeight: 2.1, color: "#64748b" }}>
              クライアントの課題に真摯に向き合い、技術と人の力で、共に未来を創り続けます。
            </p>
          </div>

          <div className="section-reveal" style={{ transitionDelay: "0.12s", display: "grid", gap: 16 }}>
            {[
              {
                num: "01", title: "スピード", color: "#6366f1", bg: "#eef2ff",
                desc: "迅速な開発・納品でビジネスチャンスを逃しません",
              },
              {
                num: "02", title: "フルカスタマイズ", color: "#8b5cf6", bg: "#faf5ff",
                desc: "既製品ではなく、貴社専用のソリューションを一から構築します",
              },
              {
                num: "03", title: "長期パートナー", color: "#ec4899", bg: "#fdf2f8",
                desc: "納品で終わりではなく、成長を共に支えるパートナーとして伴走します",
              },
            ].map((v) => (
              <div key={v.num} style={{
                padding: "22px 24px", borderRadius: 16,
                background: "#fff", border: "1px solid #f1f5f9",
                display: "flex", gap: 20, alignItems: "flex-start",
                transition: "box-shadow 0.2s ease",
              }}>
                <div style={{
                  width: 40, height: 40, flexShrink: 0, borderRadius: 10,
                  background: v.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 800, color: v.color,
                }}>{v.num}</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 5, color: "#0f172a" }}>{v.title}</div>
                  <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>{v.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Company ─────────────────────────────── */}
      <section id="company" style={{ padding: "120px 48px", background: "#fff" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div className="section-reveal" style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: "#6366f1", marginBottom: 14, textTransform: "uppercase" }}>Company</div>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 900, letterSpacing: "-0.025em" }}>
              <span className="gradient-text">会社概要</span>
            </h2>
          </div>

          <div className="section-reveal" style={{
            borderRadius: 20, border: "1px solid #e2e8f0", overflow: "hidden",
            boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
          }}>
            {[
              { label: "会社名", value: "合同会社80" },
              { label: "資本金", value: "501万円" },
              { label: "所在地", value: "愛知県名古屋市北区楠味鋺2-914-2-2F" },
              { label: "電話番号", value: "050-8896-5889（代表）" },
              { label: "事業内容", value: "オーダーメイドシステム開発（ホームページ制作・アプリ開発）、人材紹介業、AIソリューション（LENDS AI）" },
              { label: "許認可番号", value: "23-ユ-303078" },
            ].map((row, i, arr) => (
              <div key={row.label} className="info-row" style={{
                display: "grid", gridTemplateColumns: "140px 1fr",
                borderBottom: i < arr.length - 1 ? "1px solid #f1f5f9" : "none",
              }}>
                <div style={{
                  padding: "20px 24px", fontSize: 12, fontWeight: 700, color: "#94a3b8",
                  letterSpacing: "0.04em", background: "#fafafa",
                  borderRight: "1px solid #f1f5f9",
                }}>
                  {row.label}
                </div>
                <div style={{ padding: "20px 24px", fontSize: 14, color: "#1e293b", lineHeight: 1.7 }}>
                  {row.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ─────────────────────────────── */}
      <section id="contact" style={{ padding: "120px 48px 140px", background: "#fafafa" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div className="section-reveal" style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: "#6366f1", marginBottom: 14, textTransform: "uppercase" }}>Contact</div>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 900, letterSpacing: "-0.025em", marginBottom: 16 }}>
              まずは<span className="gradient-text">無料相談</span>から
            </h2>
            <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.85 }}>
              プロジェクトのご相談・お見積もり・採用のご相談など、<br />お気軽にお問い合わせください。
            </p>
          </div>

          <div className="section-reveal" style={{
            background: "#fff", borderRadius: 24,
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 40px rgba(0,0,0,0.05)",
            padding: "44px 40px",
          }}>
            <ContactForm />
          </div>

          <div style={{ marginTop: 32, textAlign: "center", color: "#cbd5e1", fontSize: 13 }}>
            050-8896-5889（代表）
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────── */}
      <footer style={{
        background: "#0f172a", color: "#fff",
        padding: "48px 48px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 20,
      }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.04em" }} className="gradient-text">80.</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>合同会社80</div>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          {[
            { label: "サービス", id: "services" },
            { label: "私たちについて", id: "about" },
            { label: "お問い合わせ", id: "contact" },
          ].map((item) => (
            <button key={item.id}
              onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" })}
              style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", background: "none", border: "none", cursor: "pointer", padding: 0, transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
          © 2025 合同会社80. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ company: "", name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "13px 16px", borderRadius: 12,
    border: "1px solid #e2e8f0", background: "#fafafa",
    color: "#0f172a", fontSize: 14, outline: "none", fontFamily: "inherit",
    transition: "border-color 0.2s ease, background 0.2s ease",
  };

  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = "#a5b4fc";
    e.target.style.background = "#fff";
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = "#e2e8f0";
    e.target.style.background = "#fafafa";
  };

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
    } catch { setStatus("error"); }
  };

  if (status === "done") {
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%", margin: "0 auto 20px",
          background: "linear-gradient(135deg, #eef2ff, #fdf4ff)",
          border: "1px solid #e0e7ff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, color: "#6366f1",
        }}>✓</div>
        <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 8, color: "#0f172a" }}>送信完了しました</div>
        <div style={{ fontSize: 14, color: "#94a3b8" }}>担当者より折り返しご連絡いたします。</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {[
          { key: "company", label: "会社名", placeholder: "株式会社〇〇", req: true, type: "text" },
          { key: "name", label: "お名前", placeholder: "山田 太郎", req: true, type: "text" },
        ].map(({ key, label, placeholder, req, type }) => (
          <div key={key}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 7 }}>
              {label}{req && <span style={{ color: "#ec4899", marginLeft: 3 }}>*</span>}
            </label>
            <input required={req} type={type} placeholder={placeholder}
              value={form[key as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {[
          { key: "email", label: "メールアドレス", placeholder: "your@example.com", req: true, type: "email" },
          { key: "phone", label: "電話番号", placeholder: "090-0000-0000", req: false, type: "tel" },
        ].map(({ key, label, placeholder, req, type }) => (
          <div key={key}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 7 }}>
              {label}{req && <span style={{ color: "#ec4899", marginLeft: 3 }}>*</span>}
            </label>
            <input required={req} type={type} placeholder={placeholder}
              value={form[key as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </div>
        ))}
      </div>
      <div>
        <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 7 }}>
          お問い合わせ内容
        </label>
        <textarea rows={4} placeholder="ご相談内容をご記入ください"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          style={{ ...inputStyle, resize: "vertical", lineHeight: 1.75 }}
          onFocus={onFocus} onBlur={onBlur} />
      </div>
      <button type="submit" disabled={status === "sending"} className="btn-primary"
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
