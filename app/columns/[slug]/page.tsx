import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ARTICLES, getArticle, type Block } from "../../../lib/articles";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.description,
    keywords: a.keywords,
    alternates: { canonical: `https://www.rng-labs.com/columns/${a.slug}` },
    openGraph: {
      type: "article",
      title: a.title,
      description: a.description,
      publishedTime: a.date,
    },
  };
}

function renderBlock(b: Block, i: number) {
  switch (b.t) {
    case "h2":
      return (
        <h2 key={i} style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "48px 0 16px", lineHeight: 1.6, paddingBottom: 10, borderBottom: "1px solid #e8edf3" }}>
          {b.text}
        </h2>
      );
    case "h3":
      return (
        <h3 key={i} style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", margin: "32px 0 12px", lineHeight: 1.6 }}>
          {b.text}
        </h3>
      );
    case "p":
      return (
        <p key={i} style={{ fontSize: 15, color: "#334155", lineHeight: 2.1, margin: "0 0 20px" }}>
          {b.text}
        </p>
      );
    case "ul":
      return (
        <ul key={i} style={{ margin: "0 0 20px", paddingLeft: 4, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
          {b.items.map((it, j) => (
            <li key={j} style={{ fontSize: 14.5, color: "#334155", lineHeight: 1.9, paddingLeft: 22, position: "relative" }}>
              <span style={{ position: "absolute", left: 0, top: 10, width: 8, height: 8, borderRadius: "50%", background: "linear-gradient(135deg, #cbd5e1, #64748b)" }} />
              {it}
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote key={i} style={{ margin: "28px 0", padding: "20px 24px", borderLeft: "3px solid #94a3b8", background: "#f8fafc", borderRadius: "0 12px 12px 0", fontSize: 15, fontWeight: 600, color: "#1e293b", lineHeight: 2 }}>
          {b.text}
        </blockquote>
      );
    case "table":
      return (
        <div key={i} style={{ overflowX: "auto", margin: "0 0 24px", border: "1px solid #e8edf3", borderRadius: 12 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5, minWidth: 520 }}>
            <thead>
              <tr>
                {b.head.map((h, j) => (
                  <th key={j} style={{ textAlign: "left", padding: "12px 16px", background: "#f1f5f9", color: "#475569", fontWeight: 700, borderBottom: "1px solid #e8edf3", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((row, j) => (
                <tr key={j}>
                  {row.map((c, k) => (
                    <td key={k} style={{ padding: "12px 16px", color: "#334155", lineHeight: 1.7, borderBottom: j < b.rows.length - 1 ? "1px solid #f1f5f9" : "none", verticalAlign: "top" }}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    datePublished: a.date,
    author: { "@type": "Organization", name: "合同会社80", url: "https://www.rng-labs.com" },
    publisher: { "@type": "Organization", name: "合同会社80", logo: { "@type": "ImageObject", url: "https://www.rng-labs.com/logo-square.png" } },
    mainEntityOfPage: `https://www.rng-labs.com/columns/${a.slug}`,
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: "https://www.rng-labs.com" },
      { "@type": "ListItem", position: 2, name: "コラム・導入事例", item: "https://www.rng-labs.com/columns" },
      { "@type": "ListItem", position: 3, name: a.title },
    ],
  };

  const others = ARTICLES.filter((x) => x.slug !== a.slug).slice(0, 3);

  return (
    <div style={{ background: "#fff", minHeight: "100vh", color: "#0f172a" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(15,23,42,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", height: 64,
      }}>
        <a href="/"><img src="/logo-mark.png" alt="合同会社80" style={{ height: 52, display: "block" }} /></a>
        <a href="/columns" className="col-backlink">← コラム一覧</a>
      </nav>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "64px 24px 100px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 100, background: "#f1f5f9", color: "#475569" }}>{a.category}</span>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>{a.date.replace(/-/g, ".")}　読了目安 約{a.readMin}分</span>
        </div>
        <h1 style={{ fontSize: "clamp(24px, 4.5vw, 34px)", fontWeight: 900, lineHeight: 1.55, letterSpacing: "-0.01em", marginBottom: 24 }}>
          {a.title}
        </h1>
        <div className="metal-hairline" style={{ margin: "0 0 32px" }} />
        <p style={{ fontSize: 15.5, color: "#334155", lineHeight: 2.1, marginBottom: 8 }}>{a.intro}</p>

        {a.blocks.map(renderBlock)}

        {/* CTA */}
        <div style={{ marginTop: 64, padding: "32px 28px", borderRadius: 16, background: "#0f172a", textAlign: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 10 }}>この記事の内容、御社の場合で試算します</div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.9, marginBottom: 18 }}>
            名古屋のAI開発会社・合同会社80が、費用感と進め方を無料でお答えします。
          </p>
          <a href="/contact" style={{ display: "inline-block", padding: "12px 30px", borderRadius: 10, background: "#fff", color: "#0f172a", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
            無料で相談する
          </a>
        </div>

        {/* 関連記事 */}
        <div style={{ marginTop: 56 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", color: "#64748b", textTransform: "uppercase", marginBottom: 18 }}>関連記事</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {others.map((o) => (
              <a key={o.slug} href={`/columns/${o.slug}`} className="col-card" style={{ display: "block", padding: "18px 20px", borderRadius: 12, border: "1px solid #e8edf3", textDecoration: "none" }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: "#0f172a", lineHeight: 1.6 }}>{o.title}</div>
              </a>
            ))}
          </div>
        </div>
      </main>

      <footer style={{ background: "#0b1220", padding: "36px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>© 2026 合同会社80　名古屋のAIエージェント開発・業務自動化</div>
      </footer>
    </div>
  );
}
