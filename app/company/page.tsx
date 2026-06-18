"use client";

import { useEffect } from "react";

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".sr-c");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.opacity = "1";
            (e.target as HTMLElement).style.transform = "translateY(0)";
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function CompanyPage() {
  useScrollReveal();

  const sr: React.CSSProperties = {
    opacity: 0,
    transform: "translateY(24px)",
    transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
  };

  const companyInfo = [
    { label: "会社名", value: "合同会社80" },
    { label: "所在地", value: "〒462-0849　愛知県名古屋市北区楠味鋺2-914-2-2F" },
    { label: "電話番号", value: "050-8896-5889" },
    { label: "メールアドレス", value: "ito.t@80grp.com" },
    { label: "資本金", value: "501万円" },
    { label: "設立", value: "2023年3月" },
    { label: "許認可番号", value: "有料職業紹介事業　許可番号：23-ユ-303078" },
  ];

  const businesses = [
    {
      num: "01",
      name: "AI 導入支援",
      desc: "企業のAI活用を戦略策定から実装・定着まで一気通貫でサポートします。現状ヒアリング・PoC設計・ロードマップ策定・定着支援を提供します。",
      tag: "AI Labs",
    },
    {
      num: "02",
      name: "AI 受託開発",
      desc: "LLM・RAG・業務自動化・データ分析など、企業専用のAIシステムをフルカスタムで開発します。既存システムとのAPI連携にも対応します。",
      tag: "AI Labs",
    },
    {
      num: "03",
      name: "AI 学習支援",
      desc: "経営層から現場担当者まで、レベルに合わせたAI研修・ワークショップを提供します。プロンプトエンジニアリング講座・LLM開発講座も実施しています。",
      tag: "AI Labs",
    },
    {
      num: "04",
      name: "SaaS プロダクト開発・運営",
      desc: "社内AIナレッジ検索「quix」、組織診断AI「LENDS AI」など、自社プロダクトの開発・運営を行っています。",
      tag: "Product",
    },
    {
      num: "05",
      name: "人材紹介",
      desc: "グローバル視点で人材と企業をつなぐキャリア支援サービス「jGO」を運営しています。テクノロジーと人の知見で最適なマッチングを実現します。",
      tag: "jGO",
    },
  ];

  return (
    <div style={{ fontFamily: "inherit", background: "#fff", color: "#0f172a", overflowX: "hidden" }}>

      {/* ── Nav ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(255,255,255,0.88)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(15,23,42,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 48px", height: 64,
      }}>
        <a href="/" style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", textDecoration: "none", letterSpacing: "-0.04em" }}>80</a>
        <a
          href="/"
          style={{
            fontSize: 13, fontWeight: 600, color: "#475569", textDecoration: "none",
            padding: "8px 20px", borderRadius: 100, border: "1.5px solid #e2e8f0",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#0f172a"; e.currentTarget.style.color = "#0f172a"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#475569"; }}
        >
          ← トップに戻る
        </a>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        paddingTop: 160, paddingBottom: 100, paddingLeft: 80, paddingRight: 80,
        background: "linear-gradient(160deg, #f8fafc 0%, #f1f5f9 100%)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "20%", right: "8%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "#6366f1", textTransform: "uppercase", marginBottom: 24 }}>Company</div>
          <h1 style={{ fontSize: "clamp(48px, 7vw, 96px)", fontWeight: 900, letterSpacing: "-0.05em", color: "#0f172a", lineHeight: 1.0, marginBottom: 24 }}>会社概要</h1>
          <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.9 }}>
            「人の知覚を、ソフトウェアで拡張する。」をミッションに、<br />
            名古屋を拠点としてAI事業・プロダクト開発を手がけます。
          </p>
        </div>
      </section>

      {/* ── Company Info Table ── */}
      <section style={{ padding: "100px 80px", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="sr-c" style={{ ...sr, marginBottom: 64 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "#6366f1", textTransform: "uppercase", marginBottom: 16 }}>Overview</div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-0.04em", color: "#0f172a" }}>会社情報</h2>
          </div>

          <div style={{ border: "1.5px solid #e2e8f0", borderRadius: 20, overflow: "hidden" }}>
            {companyInfo.map((item, i) => (
              <div
                key={i}
                className="sr-c"
                style={{
                  ...sr, transitionDelay: `${i * 0.07}s`,
                  display: "grid", gridTemplateColumns: "200px 1fr",
                  borderBottom: i < companyInfo.length - 1 ? "1px solid #e2e8f0" : "none",
                }}
              >
                <div style={{
                  padding: "28px 32px",
                  background: "#f8fafc",
                  fontSize: 13, fontWeight: 700, color: "#475569",
                  borderRight: "1px solid #e2e8f0",
                  display: "flex", alignItems: "center",
                }}>
                  {item.label}
                </div>
                <div style={{ padding: "28px 36px", fontSize: 15, color: "#0f172a", display: "flex", alignItems: "center" }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Business ── */}
      <section style={{ padding: "100px 80px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div className="sr-c" style={{ ...sr, marginBottom: 64 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "#6366f1", textTransform: "uppercase", marginBottom: 16 }}>Business</div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-0.04em", color: "#0f172a" }}>事業内容</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {businesses.map((b, i) => (
              <div
                key={i}
                className="sr-c"
                style={{
                  ...sr, transitionDelay: `${i * 0.08}s`,
                  display: "flex", gap: 40, alignItems: "flex-start",
                  padding: "36px 40px", borderRadius: 20,
                  background: "#fff", border: "1.5px solid #e2e8f0",
                  transition: "all 0.3s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.transform = "translateX(6px)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(99,102,241,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", paddingTop: 4, flexShrink: 0 }}>{b.num}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>{b.name}</div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 100, background: "rgba(99,102,241,0.08)", color: "#6366f1", letterSpacing: "0.06em" }}>{b.tag}</span>
                  </div>
                  <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.8 }}>{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Access ── */}
      <section style={{ padding: "100px 80px", background: "#fff" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div className="sr-c" style={{ ...sr, marginBottom: 56 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "#6366f1", textTransform: "uppercase", marginBottom: 16 }}>Access</div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-0.04em", color: "#0f172a" }}>アクセス</h2>
          </div>

          <div className="sr-c" style={{ ...sr, transitionDelay: "0.1s", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>合同会社80</div>
              <div style={{ fontSize: 14, color: "#64748b", lineHeight: 2.0 }}>
                〒462-0849<br />
                愛知県名古屋市北区楠味鋺2-914-2-2F<br /><br />
                TEL：050-8896-5889<br />
                MAIL：ito.t@80grp.com
              </div>
            </div>
            <div style={{
              borderRadius: 20, overflow: "hidden",
              border: "1.5px solid #e2e8f0", height: 280,
              background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3260.2!2d136.9!3d35.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z5oSb55-l55yM5ZCN5Y-k5bGL5YyX5YyX5Yy65qCq5byP5Lya56S-!5e0!3m2!1sja!2sjp!4v1234567890"
                width="100%" height="280"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: "#0f172a", padding: "48px 80px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: "0.04em" }}>© 2025 合同会社80. All rights reserved.</div>
        <div style={{ display: "flex", gap: 24 }}>
          {[["プライバシーポリシー", "/privacy"], ["利用規約", "/terms"], ["サイトマップ", "/sitemap-page"]].map(([label, href]) => (
            <a key={href} href={href} style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}>{label}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
