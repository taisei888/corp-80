import type { Metadata } from "next";
import { ARTICLES } from "../../lib/articles";

export const metadata: Metadata = {
  title: "コラム・導入事例",
  description:
    "AIエージェント開発・業務自動化・補助金活用など、名古屋のAI開発会社が現場の実例をもとに解説するコラムと導入事例です。",
  alternates: { canonical: "https://www.rng-labs.com/columns" },
};

const F = { color: "#0f172a" };

export default function ColumnsPage() {
  return (
    <div style={{ background: "#fff", minHeight: "100vh", ...F }}>
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(15,23,42,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", height: 64,
      }}>
        <a href="/"><img src="/logo-mark.png" alt="合同会社80" style={{ height: 52, display: "block" }} /></a>
        <a href="/" className="col-backlink">← トップに戻る</a>
      </nav>

      <header style={{ padding: "88px 24px 56px", textAlign: "center" }}>
        <div className="metal-hairline" style={{ width: 120, margin: "0 auto 28px" }} />
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", color: "#64748b", textTransform: "uppercase", marginBottom: 18 }}>
          Columns
        </div>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1.4 }}>
          コラム・導入事例
        </h1>
        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 2, marginTop: 16 }}>
          AI開発・業務自動化の現場で得た知見を、実例ベースでまとめています。
        </p>
      </header>

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px 120px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {ARTICLES.map((a) => (
            <a key={a.slug} href={`/columns/${a.slug}`} className="col-card" style={{
              display: "block", padding: "28px 28px 24px", borderRadius: 16,
              border: "1px solid #e8edf3", background: "#fff", textDecoration: "none",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 100, background: "#f1f5f9", color: "#475569" }}>
                  {a.category}
                </span>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{a.date.replace(/-/g, ".")}　約{a.readMin}分</span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", lineHeight: 1.6, marginBottom: 10 }}>
                {a.title}
              </div>
              <div style={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.9 }}>
                {a.description}
              </div>
            </a>
          ))}
        </div>

        <div style={{ marginTop: 72, padding: "36px 32px", borderRadius: 16, background: "#0f172a", textAlign: "center" }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", marginBottom: 10 }}>
            自社の場合はどうなる？を相談する
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.9, marginBottom: 20 }}>
            記事の内容を御社の業務に当てはめた費用感・進め方をお答えします。相談は無料です。
          </p>
          <a href="/contact" style={{
            display: "inline-block", padding: "13px 32px", borderRadius: 10,
            background: "#fff", color: "#0f172a", fontSize: 14, fontWeight: 700, textDecoration: "none",
          }}>
            お問い合わせ
          </a>
        </div>
      </main>

      <footer style={{ background: "#0b1220", padding: "36px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
          © 2026 合同会社80　名古屋のAIエージェント開発・業務自動化
        </div>
      </footer>
    </div>
  );
}
