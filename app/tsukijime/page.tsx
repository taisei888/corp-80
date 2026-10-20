"use client";

import { useEffect, useState } from "react";

const RED = "#E60033";
const INK = "#111111";

const FAQ = [
  { q: "取引先にアプリのインストールは必要ですか？", a: "不要です。取引先にはURLをひとつお渡しするだけ。スマホ・PCのブラウザから項目を選んで入力すれば、貴社の統一フォーマットの請求書が自動で出来上がります。" },
  { q: "ITが苦手な取引先でも使えますか？", a: "入力は「選ぶだけ」を基本に設計しています。選べる工事や項目は貴社が割り当てたものだけが表示されるので、間違った項目に入力される心配もありません。紙で届く請求書のAI読み取りも併用できます。" },
  { q: "会計ソフト・原価管理ソフトと連携できますか？", a: "確定した請求データは、お使いのソフトの取込形式に合わせたCSVで出力できます（どっと原価、freee、マネーフォワード等の形式に対応予定）。レイアウト表をいただければ貴社の様式に合わせます。" },
  { q: "出来高払い（部分請求）に対応していますか？", a: "対応しています。契約額・今回請求・累計・残額を様式に組み込み、出来高50%などの部分請求も自動計算。残金管理のメモや記憶に頼る運用がなくなります。" },
  { q: "導入までどのくらいかかりますか？", a: "最短2週間です。貴社の請求書様式と項目のルールを伺い、統一フォーマットを設定してから取引先へご案内します。ご案内用のテンプレート文もご用意しています。" },
];

const JSONLD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ツキジメ",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: "取引先入力型の請求書統一クラウド。統一フォーマットのPDF受領・出来高管理・会計ソフトCSV連携。",
  provider: { "@type": "Organization", name: "合同会社80", url: "https://www.rng-labs.com" },
};
const JSONLD_FAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function Tsukijime() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) e.target.classList.add("tj-on"); }),
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll(".tj").forEach((el) => io.observe(el));
    return () => { window.removeEventListener("resize", check); io.disconnect(); };
  }, []);

  const S = {
    sec: { padding: isMobile ? "72px 20px" : "104px 64px", position: "relative" } as const,
    inner: { maxWidth: 1080, margin: "0 auto" } as const,
    h2: { fontSize: isMobile ? 26 : 38, fontWeight: 900, lineHeight: 1.5, letterSpacing: "0.01em", color: INK } as const,
    kicker: { display: "inline-block", background: INK, color: "#fff", fontSize: 12, fontWeight: 800, letterSpacing: "0.18em", padding: "6px 14px", borderRadius: 4, marginBottom: 18 } as const,
  };

  const Card = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
    <div style={{ background: "#fff", border: `2px solid ${INK}`, borderRadius: 16, boxShadow: `6px 6px 0 ${RED}`, ...style }}>{children}</div>
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD_FAQ) }} />

      <div style={{ background: "#fff", color: INK, overflowX: "clip" }}>

        {/* ── Nav ── */}
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 62,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: isMobile ? "0 16px" : "0 40px",
          background: "rgba(255,255,255,0.92)", backdropFilter: "blur(14px)", borderBottom: `2px solid ${INK}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 26, height: 26, borderRadius: 7, background: RED, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 15 }}>〆</span>
            <span style={{ fontWeight: 900, fontSize: 17, letterSpacing: "0.04em" }}>ツキジメ</span>
            <span className="mob-hide" style={{ fontSize: 11, color: "#888", fontWeight: 600, marginLeft: 6 }}>請求書が、そろって届く。</span>
          </div>
          <a href="/contact" style={{
            background: INK, color: "#fff", fontSize: 13, fontWeight: 800, letterSpacing: "0.06em",
            padding: "10px 22px", borderRadius: 999, textDecoration: "none", position: "relative",
          }}>
            無料で相談
            <span style={{ position: "absolute", top: -7, right: -7, width: 14, height: 14, borderRadius: "50%", background: RED, border: "2px solid #fff" }} />
          </a>
        </nav>

        {/* ── Hero ── */}
        <section style={{ ...S.sec, paddingTop: isMobile ? 108 : 140, paddingBottom: isMobile ? 48 : 72 }}>
          <div style={{ ...S.inner, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.05fr 0.95fr", gap: isMobile ? 32 : 48, alignItems: "center" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, border: `2px solid ${INK}`, borderRadius: 999, padding: "6px 16px", fontSize: 12.5, fontWeight: 800, marginBottom: 22, background: "#fff" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: RED }} />
                取引先入力型・請求書統一クラウド
              </div>
              <h1 style={{ fontSize: isMobile ? 34 : 52, fontWeight: 900, lineHeight: 1.42, letterSpacing: "0.01em", marginBottom: 20 }}>
                バラバラの請求書が、<br />
                <span className="tj-marker">そろって届く。</span>
              </h1>
              <p style={{ fontSize: isMobile ? 14.5 : 16.5, lineHeight: 2.1, color: "#444", marginBottom: 30 }}>
                取引先は、専用ページで<b>選んで入力するだけ</b>。<br />
                貴社には<b>統一フォーマットのPDF</b>が届いて、<br className="mob-hide" />
                支払管理も、会計ソフトへの取込も、そのまま終わる。
              </p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
                <a href="/contact" style={{
                  background: RED, color: "#fff", fontSize: 15.5, fontWeight: 900, letterSpacing: "0.04em",
                  padding: "16px 34px", borderRadius: 12, textDecoration: "none",
                  border: `2px solid ${INK}`, boxShadow: `5px 5px 0 ${INK}`,
                }}>無料デモを見る →</a>
                <span style={{ fontSize: 12.5, color: "#777", fontWeight: 700 }}>導入最短2週間／取引先はURLを開くだけ</span>
              </div>
            </div>
            <div className="tj">
              <Card style={{ overflow: "hidden" }}>
                <img src="/tsukijime/hero-inbox.webp" alt="統一フォーマットの請求書が受信箱にそろって届くイメージ" style={{ width: "100%", display: "block" }} />
              </Card>
            </div>
          </div>
        </section>

        {/* ── Marquee ── */}
        <div style={{ background: RED, borderTop: `2px solid ${INK}`, borderBottom: `2px solid ${INK}`, overflow: "hidden", whiteSpace: "nowrap", padding: "10px 0" }}>
          <div className="tj-marquee" style={{ display: "inline-block", color: "#fff", fontWeight: 900, fontSize: 14, letterSpacing: "0.2em" }}>
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i} style={{ paddingRight: "3em" }}>
                書式バラバラ卒業　✦　転記ゼロ　✦　出来高管理も自動　✦　会計ソフトへCSV　✦　建設業・製造業の月締めに　✦
                書式バラバラ卒業　✦　転記ゼロ　✦　出来高管理も自動　✦　会計ソフトへCSV　✦　建設業・製造業の月締めに　✦
              </span>
            ))}
          </div>
        </div>

        {/* ── お悩み ── */}
        <section style={{ ...S.sec, background: "#FFF5F6" }}>
          <div style={S.inner}>
            <div style={{ textAlign: "center", marginBottom: 44 }}>
              <div style={S.kicker}>PROBLEM</div>
              <h2 style={S.h2}>月末のあの作業、<br className="mob-only" />まだ続けますか。</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 18 }}>
              {[
                { img: "nayami-barabara", t: "書式がバラバラ", d: "手書き・Excel・独自様式。届くたびに読み方から考える。確認だけで半日が消える。" },
                { img: "nayami-tenki", t: "転記がエンドレス", d: "紙の請求書を見ながら会計ソフトへ手入力。打ち間違いが怖くて二重チェック、また半日。" },
                { img: "nayami-tsukimatsu", t: "月末月初が消える", d: "締め日に一斉に届いて、残業で処理。出来高や残金の管理はメモと記憶が頼り。" },
              ].map((c, i) => (
                <div key={i} className="tj" style={{ transitionDelay: `${i * 0.08}s` }}>
                  <Card>
                    <img src={`/tsukijime/${c.img}.webp`} alt={c.t} style={{ width: "100%", display: "block", borderBottom: `2px solid ${INK}`, borderRadius: "14px 14px 0 0" }} />
                    <div style={{ padding: "18px 20px 22px" }}>
                      <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 8 }}>{c.t}</div>
                      <div style={{ fontSize: 13.5, lineHeight: 1.9, color: "#555" }}>{c.d}</div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
            <p className="tj" style={{ textAlign: "center", marginTop: 44, fontSize: isMobile ? 20 : 26, fontWeight: 900 }}>
              原因はぜんぶ同じ。<span className="tj-marker">「入口」が揃っていない</span>から。
            </p>
          </div>
        </section>

        {/* ── FLOW ── */}
        <section style={S.sec}>
          <div style={S.inner}>
            <div style={{ textAlign: "center", marginBottom: 44 }}>
              <div style={S.kicker}>HOW IT WORKS</div>
              <h2 style={S.h2}>ツキジメは、入口で揃えます。</h2>
              <p style={{ fontSize: 14.5, color: "#666", marginTop: 14, lineHeight: 2 }}>読み取りで頑張るのではなく、<b>最初から統一フォーマットで届く</b>仕組みです。</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 18 }}>
              {[
                { img: "flow-vendor", n: "01", t: "取引先が入力", d: "専用URLを開いて、割り当てられた項目から選ぶだけ。金額・税・出来高は自動計算。請求書を作る手間ごとなくなるので、取引先にも喜ばれます。" },
                { img: "flow-pdf", n: "02", t: "統一PDFが届く", d: "貴社の受信箱に、全社共通の統一フォーマットで到着。読む・探す・問い合わせるがゼロに。紙で届く分はAI読み取りで同じ形式に合流。" },
                { img: "flow-csv", n: "03", t: "確認して、取込", d: "内容を確認したら、支払管理表に自動反映。会計ソフト・原価管理ソフトの取込CSVもワンクリックで出力できます。" },
              ].map((c, i) => (
                <div key={i} className="tj" style={{ transitionDelay: `${i * 0.08}s` }}>
                  <Card>
                    <img src={`/tsukijime/${c.img}.webp`} alt={c.t} style={{ width: "100%", display: "block", borderBottom: `2px solid ${INK}`, borderRadius: "14px 14px 0 0" }} />
                    <div style={{ padding: "18px 20px 22px" }}>
                      <div style={{ fontSize: 13, fontWeight: 900, color: RED, marginBottom: 6 }}>{c.n}</div>
                      <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 8 }}>{c.t}</div>
                      <div style={{ fontSize: 13.5, lineHeight: 1.9, color: "#555" }}>{c.d}</div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 様式サンプル（CSSモック） ── */}
        <section style={{ ...S.sec, background: "#FFF5F6" }}>
          <div style={{ ...S.inner, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.1fr", gap: isMobile ? 28 : 56, alignItems: "center" }}>
            <div className="tj">
              <div style={S.kicker}>FORMAT</div>
              <h2 style={{ ...S.h2, marginBottom: 18 }}>届くのは、<br />いつもこの1枚。</h2>
              <p style={{ fontSize: 14.5, lineHeight: 2.1, color: "#555" }}>
                金額の内訳、消費税、<b>契約額・今回請求・累計・残額の出来高管理欄</b>まで、必要な情報が毎回同じ場所に。
                人が見るのは「内容が合っているか」だけ。読み解く仕事は、もうありません。
              </p>
              <ul style={{ marginTop: 18, paddingLeft: 0, listStyle: "none", display: "grid", gap: 10 }}>
                {["インボイス登録番号・税計算に対応", "出来高50%などの部分請求も自動計算", "取引先ごとの割り当てで入力ミスを防止"].map((t) => (
                  <li key={t} style={{ display: "flex", gap: 10, alignItems: "baseline", fontSize: 14, fontWeight: 700 }}>
                    <span style={{ color: RED, fontWeight: 900 }}>✔</span>{t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="tj" style={{ transitionDelay: "0.1s" }}>
              <Card style={{ padding: isMobile ? 16 : 26, background: "#fff" }}>
                {/* 統一様式のCSSモック */}
                <div style={{ border: `1.5px solid #c9c2b4`, padding: isMobile ? 14 : 22, fontSize: isMobile ? 10.5 : 12, color: "#2b2a26", lineHeight: 1.7 }}>
                  <div style={{ textAlign: "center", fontWeight: 900, letterSpacing: 10, borderBottom: "2px solid #2b2a26", paddingBottom: 6, marginBottom: 10, fontSize: isMobile ? 14 : 17 }}>御請求書</div>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontWeight: 800, borderBottom: "1px solid #2b2a26", paddingBottom: 2, marginBottom: 4 }}>株式会社サンプル工務店　御中</div>
                      <div style={{ border: "2px solid #2b2a26", padding: "4px 10px", fontWeight: 800, display: "inline-block" }}>ご請求金額（税込）　¥2,0●0,000 −</div>
                    </div>
                    <div style={{ fontSize: isMobile ? 9.5 : 10.5, textAlign: "right" }}>
                      請求日：20●●/10/31<br />●●建材株式会社<br />登録番号 T0000000000000
                      <span style={{ display: "inline-block", width: 26, height: 26, border: `1.5px solid ${RED}`, borderRadius: "50%", color: RED, textAlign: "center", lineHeight: "24px", marginLeft: 8 }}>印</span>
                    </div>
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 6 }}>
                    <thead><tr>{["コード", "工事件名・内容", "区分", "金額(税抜)"].map((h) => <th key={h} style={{ background: "#f3efe6", border: "1px solid #b9b2a2", padding: "3px 6px", fontSize: isMobile ? 9 : 10 }}>{h}</th>)}</tr></thead>
                    <tbody><tr>{["13-2", "●●ビル改修工事 内装仕上", "出来高50%", "1,8●3,636"].map((c, i) => <td key={i} style={{ border: "1px solid #b9b2a2", padding: "3px 6px", textAlign: i === 3 ? "right" : "left" }}>{c}</td>)}</tr></tbody>
                  </table>
                  <div style={{ background: "#faf8f2", border: "1px dashed #b9b2a2", padding: "6px 8px" }}>
                    <b style={{ fontSize: isMobile ? 9.5 : 10.5 }}>出来高管理欄</b>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 3 }}>
                      <thead><tr>{["契約金額", "既請求累計", "今回請求", "残額", "出来高率"].map((h) => <th key={h} style={{ background: "#f3efe6", border: "1px solid #b9b2a2", padding: "2px 4px", fontSize: isMobile ? 8.5 : 9.5 }}>{h}</th>)}</tr></thead>
                      <tbody><tr>{["4,1●0,000", "0", "2,0●0,000", "2,0●0,000", "50%"].map((c, i) => <td key={i} style={{ border: "1px solid #b9b2a2", padding: "2px 4px", textAlign: "right" }}>{c}</td>)}</tr></tbody>
                    </table>
                  </div>
                  <div style={{ marginTop: 6, fontSize: isMobile ? 8.5 : 9.5, color: "#777" }}>※画面はイメージです。貴社の様式・項目に合わせて設定します。</div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section style={S.sec}>
          <div style={S.inner}>
            <div style={{ textAlign: "center", marginBottom: 44 }}>
              <div style={S.kicker}>FEATURES</div>
              <h2 style={S.h2}>月締めに効く、6つの機能。</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr", gap: 16 }}>
              {[
                { img: "icon-format", t: "統一フォーマット", d: "全取引先が同じ様式。読む・探すが消える" },
                { img: "icon-calc", t: "自動計算", d: "税・出来高・残額を自動で。打ち間違いゼロ" },
                { img: "icon-pdf", t: "PDF発行", d: "取引先側も請求書作成が不要に。喜ばれて浸透" },
                { img: "icon-csv", t: "会計ソフトCSV", d: "どっと原価・freee等の取込形式で出力" },
                { img: "icon-dekidaka", t: "出来高・残金管理", d: "契約額に対する進捗と残りを常に見える化" },
                { img: "icon-bell", t: "締め日リマインド", d: "未提出の取引先へ自動でお知らせ" },
              ].map((c, i) => (
                <div key={i} className="tj" style={{ transitionDelay: `${(i % 3) * 0.06}s` }}>
                  <Card style={{ padding: "22px 18px", textAlign: "center", height: "100%" }}>
                    <img src={`/tsukijime/${c.img}.webp`} alt="" style={{ width: 64, height: 64, objectFit: "contain", margin: "0 auto 10px", display: "block" }} />
                    <div style={{ fontSize: 15.5, fontWeight: 900, marginBottom: 6 }}>{c.t}</div>
                    <div style={{ fontSize: 12.5, lineHeight: 1.8, color: "#555" }}>{c.d}</div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 向いている会社 ── */}
        <section style={{ ...S.sec, background: "#FFF5F6" }}>
          <div style={{ ...S.inner, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 28 : 48, alignItems: "center" }}>
            <div className="tj">
              <Card style={{ overflow: "hidden" }}>
                <img src="/tsukijime/after-teiji.webp" alt="月末でも定時で帰れるイメージ" style={{ width: "100%", display: "block" }} />
              </Card>
            </div>
            <div className="tj" style={{ transitionDelay: "0.08s" }}>
              <div style={S.kicker}>FOR WHO</div>
              <h2 style={{ ...S.h2, marginBottom: 20 }}>こんな会社に<br />効きます。</h2>
              <ul style={{ paddingLeft: 0, listStyle: "none", display: "grid", gap: 14 }}>
                {[
                  ["建設業", "協力業者からの請求が書式バラバラ。出来高・相殺・支払サイトの管理が大変"],
                  ["製造業", "外注先・材料仕入の請求処理に毎月追われている"],
                  ["多店舗・FC運営", "店舗や加盟店からの報告・請求を揃えて受け取りたい"],
                ].map(([t, d]) => (
                  <li key={t} style={{ borderLeft: `4px solid ${RED}`, paddingLeft: 14 }}>
                    <div style={{ fontWeight: 900, fontSize: 16 }}>{t}</div>
                    <div style={{ fontSize: 13.5, color: "#555", lineHeight: 1.8 }}>{d}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── PRICE ── */}
        <section style={S.sec}>
          <div style={S.inner}>
            <div style={{ textAlign: "center", marginBottom: 44 }}>
              <div style={S.kicker}>PRICE</div>
              <h2 style={S.h2}>事務スタッフひとり増やすより、<br className="mob-only" />ずっと軽く。</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20, maxWidth: 820, margin: "0 auto" }}>
              {[
                { name: "ライト", price: "9,800", unit: "円/月（税別）", items: ["取引先 5社まで", "統一フォーマット受信箱", "自動計算・PDF発行", "メールサポート"], hot: false },
                { name: "スタンダード", price: "29,800", unit: "円/月（税別）", items: ["取引先 無制限", "会計・原価ソフトCSV連携", "出来高・残金管理", "締め日リマインド", "導入設定・取引先案内を伴走"], hot: true },
              ].map((p) => (
                <div key={p.name} className="tj">
                  <Card style={{ padding: "28px 26px", position: "relative", height: "100%", background: p.hot ? "#fff" : "#fff" }}>
                    {p.hot && <span style={{ position: "absolute", top: -14, right: 18, background: RED, color: "#fff", fontSize: 12, fontWeight: 900, padding: "5px 14px", borderRadius: 999, border: `2px solid ${INK}` }}>人気</span>}
                    <div style={{ fontSize: 15, fontWeight: 900, marginBottom: 8 }}>{p.name}</div>
                    <div style={{ marginBottom: 16 }}>
                      <span style={{ fontSize: 40, fontWeight: 900, color: p.hot ? RED : INK }}>{p.price}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#666", marginLeft: 4 }}>{p.unit}</span>
                    </div>
                    <ul style={{ paddingLeft: 0, listStyle: "none", display: "grid", gap: 8 }}>
                      {p.items.map((t) => (
                        <li key={t} style={{ fontSize: 13.5, fontWeight: 700, display: "flex", gap: 8 }}>
                          <span style={{ color: RED, fontWeight: 900 }}>✔</span>{t}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              ))}
            </div>
            <p style={{ textAlign: "center", fontSize: 12.5, color: "#888", marginTop: 18 }}>
              初期設定 50,000円〜（様式設定・取引先ご案内テンプレート込み）。省力化投資補助金等の対象となる構成のご相談も可能です。
            </p>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ ...S.sec, background: "#FFF5F6" }}>
          <div style={{ ...S.inner, maxWidth: 820 }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <div style={S.kicker}>FAQ</div>
              <h2 style={S.h2}>よくあるご質問</h2>
            </div>
            {FAQ.map((f, i) => (
              <details key={i} className="tj" style={{ background: "#fff", border: `2px solid ${INK}`, borderRadius: 12, marginBottom: 12, padding: "2px 0" }}>
                <summary style={{ cursor: "pointer", padding: "16px 20px", fontSize: 15, fontWeight: 900, listStyle: "none", display: "flex", gap: 10 }}>
                  <span style={{ color: RED }}>Q.</span>{f.q}
                </summary>
                <p style={{ padding: "0 20px 18px 44px", fontSize: 13.5, color: "#555", lineHeight: 2 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding: isMobile ? "72px 20px 90px" : "104px 64px 120px", background: INK, textAlign: "center" }}>
          <h2 style={{ fontSize: isMobile ? 26 : 40, fontWeight: 900, color: "#fff", lineHeight: 1.6, marginBottom: 16 }}>
            来月の月締めから、<br /><span style={{ color: "#fff", background: RED, padding: "0 10px" }}>そろえて</span>始めませんか。
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 2, marginBottom: 32 }}>
            実際の画面をご覧いただける無料デモをご用意しています。導入は最短2週間。
          </p>
          <a href="/contact" style={{
            display: "inline-block", background: RED, color: "#fff", fontSize: 16, fontWeight: 900,
            padding: "18px 46px", borderRadius: 12, textDecoration: "none", border: "2px solid #fff", boxShadow: "6px 6px 0 rgba(255,255,255,0.25)",
          }}>無料デモを申し込む →</a>
          <div style={{ marginTop: 44, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
            ツキジメ｜運営：合同会社80（名古屋）｜<a href="/" style={{ color: "rgba(255,255,255,0.4)" }}>会社サイト</a>
          </div>
        </section>
      </div>

      <style>{`
        .tj { opacity: 0; transform: translateY(18px); transition: opacity 0.7s cubic-bezier(0.19,1,0.22,1), transform 0.7s cubic-bezier(0.19,1,0.22,1); }
        .tj-on { opacity: 1; transform: none; }
        .tj-marker { background: linear-gradient(transparent 58%, rgba(230,0,51,0.22) 58%); padding: 0 2px; }
        .tj-marquee { animation: tj-mq 30s linear infinite; }
        @keyframes tj-mq { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        details summary::-webkit-details-marker { display: none; }
        .mob-only { display: none; }
        @media (max-width: 768px) {
          .mob-hide { display: none; }
          .mob-only { display: inline; }
        }
      `}</style>
    </>
  );
}
