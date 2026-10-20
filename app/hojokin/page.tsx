"use client";

import { useEffect, useState } from "react";
import { Shippori_Mincho } from "next/font/google";

const mincho = Shippori_Mincho({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const FAQ = [
  {
    q: "補助金はいくらぐらいの開発から使う意味がありますか？",
    a: "目安は開発費がおおよそ1,000万円規模からです。例えば省力化投資補助金（一般型）は中小企業で費用の1/2が補助されるため、1,100万円の開発なら実質負担を大きく下げられます。逆に100〜300万円規模の開発は、申請の手間と期間を考えると補助金を使わずに最短で作ったほうが得なことが多く、その場合も弊社がそのままお手伝いできます。",
  },
  {
    q: "申請は誰がやるのですか？",
    a: "申請書の作成・提出は、提携する認定経営革新等支援機関・士業の専門家と連携して進めます。弊社は申請に必要な開発見積・要件整理・システム構成の説明資料を担当し、採択後の開発・実装を一括でお引き受けします。",
  },
  {
    q: "採択されるまでどのくらいかかりますか？",
    a: "公募回によりますが、申請準備に約1ヶ月、採択発表まで数ヶ月、その後の交付決定を経て開発着手となり、システムが実際に動き出すまでトータルで半年〜1年程度を見込むのが現実的です。そのため「1年後を見据えた計画」に向いた制度です。",
  },
  {
    q: "注意点はありますか？",
    a: "①交付決定前に契約・発注したものは補助対象になりません ②賃上げ要件など事業計画上の約束が伴います ③補助金は後払いのため、いったん全額を立て替える資金計画が必要です ④採択は保証されません。この4点は最初の無料相談で必ずご説明しています。",
  },
  {
    q: "どの補助金が使えるか分かりません。",
    a: "現在の業務課題と投資規模を伺えば、省力化投資補助金（一般型）・ものづくり補助金・デジタル化AI導入補助金・自治体の補助金のどれが合うか、そもそも補助金を使わないほうが早いかまで含めて率直にお答えします。相談は無料です。",
  },
];

const JSONLD_FAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const JSONLD_SERVICE = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "補助金対応のシステム開発・AI開発",
  provider: { "@type": "Organization", name: "合同会社80", url: "https://www.rng-labs.com" },
  areaServed: "JP",
  description:
    "省力化投資補助金・ものづくり補助金などを活用したAI・業務システム開発。申請用見積の48時間提出から採択後の実装まで対応。",
};

export default function Hojokin() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    document.querySelectorAll(".sr").forEach((el) => io.observe(el));
    return () => { window.removeEventListener("resize", check); io.disconnect(); };
  }, []);

  const S = {
    section: { padding: isMobile ? "72px 20px" : "100px 64px" } as const,
    inner: { maxWidth: 1040, margin: "0 auto" } as const,
    kicker: { fontSize: 11, fontWeight: 700, letterSpacing: "0.24em", color: "#64748b", textTransform: "uppercase", marginBottom: 20 } as const,
    h2: { fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 700, lineHeight: 1.6, color: "#0f172a", letterSpacing: "0.02em", marginBottom: 20 } as const,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD_SERVICE) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD_FAQ) }} />

      {/* Nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: isMobile ? "0 20px" : "0 48px",
        background: "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src="/logo-mark.png" alt="80" style={{ height: 44, display: "block" }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>合同会社80</span>
        </a>
        <a href="/contact" style={{
          padding: "9px 20px", border: "1.5px solid #0f172a", color: "#0f172a",
          fontSize: 12.5, fontWeight: 700, textDecoration: "none", borderRadius: 4,
        }}>無料相談</a>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: isMobile ? "auto" : "88vh", display: "flex", alignItems: "center",
        padding: isMobile ? "120px 20px 72px" : "140px 64px 80px",
        background: "#fff", position: "relative", overflow: "hidden",
      }}>
        <div aria-hidden className="serif" style={{
          position: "absolute", right: isMobile ? -40 : 20, bottom: isMobile ? 20 : -30,
          fontSize: isMobile ? 180 : "min(26vw, 380px)", fontWeight: 500, lineHeight: 1,
          color: "transparent", WebkitTextStroke: "1px #e2e8f0", userSelect: "none", pointerEvents: "none",
        }}>½</div>
        <div style={{ ...S.inner, width: "100%", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
            <div style={{ width: 48, height: 1, background: "#0f172a" }} />
            <div style={{ fontSize: 12, letterSpacing: "0.2em", color: "#475569", fontWeight: 600 }}>
              補助金対応のAI・システム開発 — 名古屋
            </div>
          </div>
          <h1 className="serif" style={{
            fontSize: isMobile ? "clamp(30px, 8.6vw, 40px)" : "clamp(40px, 4.8vw, 64px)",
            fontWeight: 700, lineHeight: 1.6, letterSpacing: "0.03em", color: "#0f172a", marginBottom: 24,
          }}>
            そのシステム開発、<br />補助金で半分にできるかもしれない。
          </h1>
          <p style={{ fontSize: isMobile ? 14 : 16, color: "#64748b", lineHeight: 2.1, marginBottom: 36 }}>
            省力化投資補助金・ものづくり補助金などを使えば、AI・業務システムの開発費は実質1/2〜1/3になります。<br className="mob-hide" />
            申請に必要な開発見積・要件整理は<b style={{ color: "#0f172a" }}>48時間以内・無償</b>でご用意。採択後の実装まで、開発会社として伴走します。
          </p>
          <div style={{ display: "flex", gap: isMobile ? 16 : 28, alignItems: "center", flexWrap: "wrap" }}>
            <a href="/contact" className="serif" style={{
              padding: isMobile ? "15px 30px" : "16px 38px", background: "#0f172a", color: "#fff",
              fontSize: 14, fontWeight: 600, letterSpacing: "0.12em", textDecoration: "none",
            }}>無料で相談する</a>
            <a href="/ai-labs" style={{
              fontSize: 13.5, fontWeight: 600, color: "#0f172a", textDecoration: "underline", textUnderlineOffset: 5,
            }}>開発実績を見る →</a>
          </div>
        </div>
      </section>

      {/* 制度早見表 */}
      <section style={{ ...S.section, background: "#f8fafc" }}>
        <div style={S.inner}>
          <div className="sr" style={S.kicker}>Subsidy Overview</div>
          <h2 className="serif sr" style={S.h2}>主な対象制度（2026年度）</h2>
          <div className="sr" style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: isMobile ? 13 : 14.5, background: "#fff", minWidth: 560 }}>
              <thead>
                <tr>
                  {["制度", "補助率", "補助上限", "相性の良い開発"].map((h) => (
                    <th key={h} style={{ background: "#0f172a", color: "#fff", padding: "12px 14px", textAlign: "left", fontSize: 12.5, fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["省力化投資補助金（一般型）", "中小 1/2（大幅賃上げで 2/3）\n小規模 2/3", "750万〜8,000万円\n（従業員数による・賃上げ特例で最大1億円）", "オーダーメイドの業務システム・AIによる省力化"],
                  ["ものづくり補助金", "1/2〜2/3", "従業員規模による", "新製品・新サービスのためのシステム開発"],
                  ["デジタル化・AI導入補助金2026（旧IT導入）", "類型による", "類型による", "ITツール・AIツールの導入"],
                  ["自治体の補助金（愛知県・名古屋市など）", "制度による", "数十万〜数百万円", "小規模なDX・デジタル化の第一歩"],
                ].map((row, i) => (
                  <tr key={i}>
                    {row.map((c, j) => (
                      <td key={j} style={{ padding: "13px 14px", borderBottom: "1px solid #e2e8f0", lineHeight: 1.8, whiteSpace: "pre-line", fontWeight: j === 0 ? 700 : 400, color: j === 0 ? "#0f172a" : "#475569" }}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="sr" style={{ fontSize: 12, color: "#94a3b8", marginTop: 14, lineHeight: 1.8 }}>
            ※ 補助率・上限は公募回により変わります。最新の公募要領をもとに、無料相談でご案内します。
          </p>
        </div>
      </section>

      {/* 80の提供 */}
      <section style={{ ...S.section, background: "#fff" }}>
        <div style={S.inner}>
          <div className="sr" style={S.kicker}>What We Do</div>
          <h2 className="serif sr" style={S.h2}>申請の前から、入金の後まで。</h2>
          <div className="mob-grid-1" style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 14, marginTop: 36 }}>
            {[
              { n: "01", t: "申請用見積を48時間で", d: "補助金の申請書には開発費の根拠（見積・要件）が必要です。ヒアリングから48時間以内に、申請にそのまま使える見積と要件整理を無償でお出しします。" },
              { n: "02", t: "採択後の実装を一括で", d: "AI・業務システムの設計から開発・運用まで弊社が一括で実装。交付申請や実績報告に必要な資料・証憑の作成にも対応します。" },
              { n: "03", t: "申請は専門家と連携", d: "申請書の作成・提出は、提携する認定支援機関・士業と連携。「開発は80、申請はプロ」の分業で、採択の可能性と開発の質を両立します。" },
            ].map((c) => (
              <div key={c.n} className="sr" style={{ border: "1px solid #e2e8f0", padding: "28px 24px" }}>
                <div className="serif" style={{ fontSize: 13, color: "#94a3b8", marginBottom: 12 }}>{c.n}</div>
                <div className="serif" style={{ fontSize: 19, fontWeight: 700, color: "#0f172a", marginBottom: 12, lineHeight: 1.5 }}>{c.t}</div>
                <div style={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.9 }}>{c.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 正直セクション */}
      <section style={{ ...S.section, background: "#f8fafc" }}>
        <div style={S.inner}>
          <div className="sr" style={S.kicker}>Honest Advice</div>
          <h2 className="serif sr" style={S.h2}>補助金が向いている会社、<br />向いていない会社。</h2>
          <p className="sr" style={{ fontSize: 14.5, color: "#64748b", lineHeight: 2, marginBottom: 32, maxWidth: 680 }}>
            正直にお伝えします。補助金は万能ではありません。向いていない場合は「使わないほうが早くて安い」とはっきり言うのが弊社の方針です。
          </p>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
            <div className="sr" style={{ background: "#fff", border: "1px solid #e2e8f0", borderTop: "3px solid #0f172a", padding: "26px 24px" }}>
              <div className="serif" style={{ fontSize: 17, fontWeight: 700, marginBottom: 14 }}>向いている</div>
              <ul style={{ paddingLeft: 18, fontSize: 13.5, color: "#475569", lineHeight: 2.1 }}>
                <li>開発規模がおおよそ<b>1,000万円級〜</b>の投資</li>
                <li>基幹業務の刷新・省力化など、1年がかりの計画で動ける</li>
                <li>「せっかくやるなら良いものを」と考えている</li>
                <li>賃上げ要件を前向きに満たせる・満たしたい</li>
              </ul>
            </div>
            <div className="sr" style={{ background: "#fff", border: "1px solid #e2e8f0", borderTop: "3px solid #cbd5e1", padding: "26px 24px" }}>
              <div className="serif" style={{ fontSize: 17, fontWeight: 700, marginBottom: 14 }}>向いていない</div>
              <ul style={{ paddingLeft: 18, fontSize: 13.5, color: "#475569", lineHeight: 2.1 }}>
                <li>100〜300万円規模の小さな開発<br /><span style={{ fontSize: 12.5, color: "#94a3b8" }}>→ 補助金なしで最短2〜4週間で作るほうが得。それも弊社の得意分野です</span></li>
                <li>今すぐ動くシステムが必要（交付決定前の発注はNG）</li>
                <li>立て替え資金の確保が難しい（補助金は後払い）</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 流れ */}
      <section style={{ ...S.section, background: "#fff" }}>
        <div style={S.inner}>
          <div className="sr" style={S.kicker}>Process</div>
          <h2 className="serif sr" style={S.h2}>ご相談から入金までの流れ</h2>
          <div className="sr" style={{ marginTop: 28 }}>
            {[
              ["無料相談", "業務課題と投資規模を伺い、使える制度と「そもそも補助金を使うべきか」を率直にお答えします。"],
              ["見積・要件整理（48時間）", "申請に必要な開発見積・システム構成資料を無償でご用意します。"],
              ["申請", "提携する認定支援機関・士業が申請書を作成・提出。弊社は技術面の資料を支えます。"],
              ["採択・交付決定", "採択後、交付決定を待って正式契約・開発着手（ここまで契約・発注はしません）。"],
              ["開発・実装", "AI・業務システムを開発。進捗は毎週共有し、現場に馴染むまで調整します。"],
              ["実績報告・入金", "実績報告に必要な資料・証憑づくりに対応。補助金の入金まで見届けます。"],
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 20, padding: "18px 0", borderBottom: "1px solid #eef1f5", alignItems: "baseline" }}>
                <div className="serif" style={{ fontSize: 15, fontWeight: 700, color: "#94a3b8", minWidth: 34 }}>{String(i + 1).padStart(2, "0")}</div>
                <div>
                  <div className="serif" style={{ fontSize: 16.5, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>{s[0]}</div>
                  <div style={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.9 }}>{s[1]}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="sr" style={{ fontSize: 12.5, color: "#94a3b8", marginTop: 16, lineHeight: 1.8 }}>
            目安：申請準備 約1ヶ月／採択発表まで数ヶ月／システム稼働まで半年〜1年。お急ぎの開発は補助金なしの通常開発をおすすめします。
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ ...S.section, background: "#f8fafc" }}>
        <div style={S.inner}>
          <div className="sr" style={S.kicker}>FAQ</div>
          <h2 className="serif sr" style={S.h2}>よくあるご質問</h2>
          <div style={{ marginTop: 24 }}>
            {FAQ.map((f, i) => (
              <details key={i} className="sr" style={{ background: "#fff", border: "1px solid #e2e8f0", marginBottom: 10, padding: "4px 0" }}>
                <summary className="serif" style={{ cursor: "pointer", padding: "16px 20px", fontSize: 15, fontWeight: 700, color: "#0f172a", listStyle: "none" }}>
                  Q. {f.q}
                </summary>
                <p style={{ padding: "0 20px 18px", fontSize: 13.5, color: "#64748b", lineHeight: 2 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 士業向け */}
      <section style={{ ...S.section, background: "#fff" }}>
        <div style={{ ...S.inner, textAlign: "center" }}>
          <div className="sr" style={{ ...S.kicker }}>For Partners</div>
          <h2 className="serif sr" style={{ ...S.h2, marginBottom: 16 }}>税理士・会計事務所・補助金支援会社さまへ</h2>
          <p className="sr" style={{ fontSize: 14.5, color: "#64748b", lineHeight: 2.1, maxWidth: 640, margin: "0 auto 28px" }}>
            顧問先・クライアント様のシステム開発の「実装側パートナー」をお探しでしたら、ぜひご連絡ください。
            申請用の開発見積は48時間以内にお出しします。相互のご紹介も歓迎です。
          </p>
          <a href="/contact" className="sr serif" style={{
            display: "inline-block", padding: "14px 36px", border: "1.5px solid #0f172a",
            color: "#0f172a", fontSize: 14, fontWeight: 600, letterSpacing: "0.1em", textDecoration: "none",
          }}>提携のご相談</a>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: isMobile ? "72px 20px" : "100px 64px", background: "#0f172a", textAlign: "center" }}>
        <h2 className="serif" style={{ fontSize: "clamp(24px, 3.4vw, 40px)", fontWeight: 700, color: "#fff", lineHeight: 1.7, marginBottom: 18 }}>
          まず、使えるかどうかだけ<br />確かめませんか。
        </h2>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 2, marginBottom: 32 }}>
          相談は無料です。「補助金を使わないほうがいい」場合も、はっきりお伝えします。
        </p>
        <a href="/contact" className="serif" style={{
          display: "inline-block", padding: "16px 44px", background: "#fff", color: "#0f172a",
          fontSize: 14.5, fontWeight: 700, letterSpacing: "0.12em", textDecoration: "none",
        }}>無料で相談する</a>
        <div style={{ marginTop: 48, fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
          合同会社80｜名古屋市｜<a href="/" style={{ color: "rgba(255,255,255,0.35)" }}>トップへ</a>
        </div>
      </section>

      <style>{`
        .serif { font-family: ${mincho.style.fontFamily}, "Hiragino Mincho ProN", "Yu Mincho", serif; }
        details summary::-webkit-details-marker { display: none; }
        @media (max-width: 768px) { .mob-hide { display: none; } }
      `}</style>
    </>
  );
}
