"use client";

export default function SitemapPage() {
  const siteLinks = [
    {
      category: "メインページ",
      links: [
        { label: "トップページ", href: "/", desc: "合同会社80 コーポレートサイト" },
        { label: "会社概要", href: "/company", desc: "会社情報・事業内容・アクセス" },
      ],
    },
    {
      category: "プロダクト・サービス",
      links: [
        { label: "quix", href: "/quix", desc: "社内AIナレッジ検索" },
        { label: "LENDS AI", href: "https://www.lens-ai.jp", desc: "組織診断AI（外部サイト）", external: true },
        { label: "AI Labs", href: "/ai-labs", desc: "AI導入支援・受託開発・学習支援" },
      ],
    },
    {
      category: "法的情報",
      links: [
        { label: "プライバシーポリシー", href: "/privacy", desc: "個人情報の取り扱いについて" },
        { label: "利用規約", href: "/terms", desc: "サービス利用に関する規約" },
        { label: "お問い合わせ", href: "/contact", desc: "お問い合わせフォーム" },
        { label: "サイトマップ", href: "/sitemap-page", desc: "本ページ" },
      ],
    },
  ];

  return (
    <div style={{ fontFamily: "inherit", background: "#fff", color: "#0f172a", overflowX: "hidden" }}>

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(255,255,255,0.88)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(15,23,42,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 48px", height: 64,
      }}>
        <a href="/"><img src="/7.png" alt="80" style={{ height: 48, display: "block" }} /></a>
        <a href="/" style={{ fontSize: 13, fontWeight: 600, color: "#475569", textDecoration: "none", padding: "8px 20px", borderRadius: 100, border: "1.5px solid #e2e8f0" }}>← トップに戻る</a>
      </nav>

      <section style={{ paddingTop: 140, paddingBottom: 80, paddingLeft: 80, paddingRight: 80, background: "linear-gradient(160deg, #f8fafc 0%, #f1f5f9 100%)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "#6366f1", textTransform: "uppercase", marginBottom: 24 }}>Sitemap</div>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 72px)", fontWeight: 900, letterSpacing: "-0.05em", color: "#0f172a", lineHeight: 1.0 }}>サイトマップ</h1>
        </div>
      </section>

      <section style={{ padding: "80px 80px 120px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column", gap: 64 }}>
          {siteLinks.map((cat, i) => (
            <div key={i}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "#6366f1", textTransform: "uppercase", marginBottom: 24, display: "flex", alignItems: "center", gap: 16 }}>
                {cat.category}
                <div style={{ flex: 1, height: 1, background: "#f1f5f9" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {cat.links.map((link, j) => (
                  <a
                    key={j}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "20px 28px", borderRadius: 14,
                      border: "1.5px solid #f1f5f9", background: "#fafafa",
                      textDecoration: "none", transition: "all 0.2s",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = "#6366f1";
                      e.currentTarget.style.background = "#fff";
                      e.currentTarget.style.transform = "translateX(6px)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = "#f1f5f9";
                      e.currentTarget.style.background = "#fafafa";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>
                          {link.label}
                          {link.external && <span style={{ fontSize: 10, color: "#94a3b8", marginLeft: 6, fontWeight: 600 }}>↗ 外部</span>}
                        </div>
                        <div style={{ fontSize: 12, color: "#94a3b8" }}>{link.desc}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: "#cbd5e1", fontFamily: "monospace" }}>{link.href}</div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ background: "#0f172a", padding: "48px 80px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>© 2025 合同会社80. All rights reserved.</div>
        <div style={{ display: "flex", gap: 24 }}>
          {[["会社概要", "/company"], ["プライバシーポリシー", "/privacy"], ["利用規約", "/terms"]].map(([label, href]) => (
            <a key={href} href={href} style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textDecoration: "none" }}
              onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}>{label}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
