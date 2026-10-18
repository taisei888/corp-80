"use client";

import { useEffect } from "react";

// ─── palette（白×黄×黒：みんなの銀行系） ───
const C = {
  yellow: "#FFE100",
  yellowSoft: "#FFF9D6",
  black: "#111111",
  white: "#FFFFFF",
  line: "#111111",
  hair: "#E8E6DE",
  gray: "#5A5A52",
};

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".mm-sr");
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// 回転タグ
function Tag({ children, deg = -2, variant = "black" }: { children: React.ReactNode; deg?: number; variant?: "black" | "yellow" | "white" }) {
  const styles =
    variant === "yellow" ? { background: C.yellow, color: C.black, border: `2px solid ${C.black}` } :
    variant === "white" ? { background: C.white, color: C.black, border: `2px solid ${C.black}` } :
    { background: C.black, color: C.white, border: `2px solid ${C.black}` };
  return (
    <span style={{
      display: "inline-block", fontSize: 13, fontWeight: 800, padding: "7px 16px",
      borderRadius: 8, transform: `rotate(${deg}deg)`, letterSpacing: "0.04em", ...styles,
    }}>
      {children}
    </span>
  );
}

// 巨大セクションタイトル
function Big({ en, jp, color = C.black, labelColor }: { en: string; jp: string; color?: string; labelColor?: string }) {
  return (
    <div className="mm-sr" style={{ textAlign: "center", marginBottom: 48 }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: labelColor ?? color, marginBottom: 6, letterSpacing: "0.1em" }}>{jp}</div>
      <div style={{ fontSize: "clamp(52px, 11vw, 108px)", fontWeight: 900, color, lineHeight: 1.0, letterSpacing: "-0.01em" }}>{en}</div>
    </div>
  );
}

// 黄色マーカー下線
function Marker({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ background: `linear-gradient(transparent 55%, ${C.yellow} 55%, ${C.yellow} 92%, transparent 92%)`, padding: "0 2px" }}>
      {children}
    </span>
  );
}

export default function MoshimoshiPage() {
  useReveal();

  return (
    <div style={{ background: C.white, color: C.black, overflowX: "clip", fontFamily: "inherit" }}>

      {/* ── Nav ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 20px",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 9,
          background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)",
          padding: "9px 18px", borderRadius: 100, border: `2px solid ${C.black}`,
        }}>
          <span style={{ width: 12, height: 12, borderRadius: "50%", background: C.yellow, border: `2px solid ${C.black}`, display: "inline-block" }} />
          <span style={{ fontSize: 17, fontWeight: 900, letterSpacing: "0.02em" }}>モシモシAI</span>
        </div>
        <a href="/contact" className="mm-navbtn">無料デモ</a>
      </nav>

      {/* ── Hero ── */}
      <section style={{ position: "relative", padding: "128px 24px 56px", textAlign: "center", overflow: "hidden", background: C.white }}>
        <div style={{ position: "relative", maxWidth: 880, margin: "0 auto" }}>
          <div className="mm-sr on" style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
            <Tag deg={-3} variant="yellow">24時間365日</Tag>
            <Tag deg={2} variant="black">予約の受付もOK</Tag>
            <Tag deg={-1} variant="white">導入は最短2週間</Tag>
          </div>

          <h1 style={{ fontSize: "clamp(38px, 8.6vw, 76px)", fontWeight: 900, lineHeight: 1.32, letterSpacing: "0.01em", marginBottom: 24 }}>
            お店の電話、<br />
            <Marker>AIが出ます。</Marker>
          </h1>

          <p style={{ fontSize: "clamp(14px, 2.2vw, 17px)", fontWeight: 500, lineHeight: 2.1, marginBottom: 36, color: C.gray }}>
            仕込み中も、接客中も、閉店後も。<br />
            かかってきた電話にAIが応対して、予約も質問もぜんぶ受け止める。<br />
            飲食店・受付のための電話自動応対サービスです。
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 8 }}>
            <a href="/contact" className="mm-cta-main">AIと話してみる（無料デモ）</a>
            <a href="#price" className="mm-cta-sub">料金を見る</a>
          </div>

          {/* ヒーローイラスト（黄色の円の上に白黒線画） */}
          <div style={{ position: "relative", marginTop: 28, height: "clamp(260px, 40vw, 420px)" }}>
            <div aria-hidden style={{
              position: "absolute", left: "50%", bottom: 0, transform: "translateX(-50%)",
              width: "min(560px, 86vw)", aspectRatio: "2 / 1", borderRadius: "999px 999px 0 0",
              background: C.yellow,
            }} />
            <img src="/moshi/v2-hero.webp" alt="店主の代わりにモシモシAIが電話に出るイラスト" className="mm-bob"
              style={{ height: "92%", objectFit: "contain", position: "relative", zIndex: 2, display: "block", margin: "0 auto" }} />
          </div>
        </div>
      </section>

      {/* ── Marquee ── */}
      <div style={{ background: C.yellow, borderTop: `2px solid ${C.black}`, borderBottom: `2px solid ${C.black}`, padding: "13px 0", overflow: "hidden", whiteSpace: "nowrap" }}>
        <div className="mm-marquee" style={{ display: "inline-block" }}>
          {[0, 1].map((k) => (
            <span key={k} style={{ fontSize: 15, fontWeight: 800, color: C.black, letterSpacing: "0.1em" }}>
              {"　モシモシ、AIです ● 24時間365日ずっと応対 ● 予約もキャンセルも質問も ● 営業中は調理と接客に集中 ●".repeat(2)}
            </span>
          ))}
        </div>
      </div>

      {/* ── お悩み ── */}
      <section style={{ padding: "90px 24px 80px", background: C.white }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div className="mm-sr" style={{ textAlign: "center", marginBottom: 46 }}>
            <Tag deg={-2} variant="black">こんなお悩み、ありませんか？</Tag>
          </div>
          <div className="mm-grid3">
            {[
              { img: "/moshi/v2-nayami-busy.webp", t: "営業中は電話に出られない", d: "ピーク帯に鳴る電話。調理と接客で手いっぱいなのに、鳴り続ける音に焦るばかり。" },
              { img: "/moshi/v2-nayami-line.webp", t: "電話対応で接客が止まる", d: "目の前のお客様を待たせて電話対応。どちらも大事なのに、どちらかが犠牲に。" },
              { img: "/moshi/v2-nayami-night.webp", t: "閉店後の予約電話を逃す", d: "営業時間外にかかってくる予約の電話。留守電には、ほとんどの人が吹き込みません。" },
            ].map((x, i) => (
              <div key={i} className="mm-sr mm-card" style={{ transitionDelay: `${i * 0.08}s` }}>
                <img src={x.img} alt="" style={{ width: "100%", borderRadius: 10, display: "block", marginBottom: 18, border: `1.5px solid ${C.hair}` }} />
                <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>{x.t}</div>
                <div style={{ fontSize: 13.5, fontWeight: 500, lineHeight: 1.9, color: C.gray }}>{x.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT（黄色セクション） ── */}
      <section style={{ background: C.yellow, borderTop: `2px solid ${C.black}`, padding: "90px 24px 96px", position: "relative" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
          <Big en="ABOUT" jp="モシモシAIってなに？" color={C.black} />
          <p className="mm-sr" style={{ fontSize: "clamp(14.5px, 2vw, 16.5px)", fontWeight: 600, lineHeight: 2.3, marginTop: -8 }}>
            モシモシAIは、お店にかかってくる電話に<br className="mm-pc" />
            AIが人の声で応対してくれるサービスです。<br />
            予約の受付、営業時間や席の質問、キャンセルの連絡——<br className="mm-pc" />
            よくある電話はAIがその場で解決して、内容はすぐスマホに届きます。<br />
            お店の電話番号はそのまま。工事も、専用機器も、いりません。
          </p>
          <div className="mm-sr" style={{ marginTop: 36 }}>
            <img src="/moshi/v2-mascot-talk.webp" alt="" className="mm-bob" style={{ width: "min(220px, 46vw)" }} />
          </div>
        </div>
      </section>

      {/* ── FLOW ── */}
      <section style={{ background: C.white, borderTop: `2px solid ${C.black}`, padding: "90px 24px 96px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Big en="FLOW" jp="しくみはかんたん" />
          <div className="mm-grid3">
            {[
              { img: "/moshi/v2-step-ring.webp", n: "1", t: "電話が鳴る", d: "お客様はいつも通りお店に電話。設定した呼び出し回数で、AIにバトンタッチ。" },
              { img: "/moshi/v2-step-ai.webp", n: "2", t: "AIが応対する", d: "自然な声で予約・質問に応対。日時や人数もきちんと聞き取ります。" },
              { img: "/moshi/v2-step-notify.webp", n: "3", t: "スマホに届く", d: "応対内容はすぐLINE・管理画面へ。あとから録音と文字起こしも確認できます。" },
            ].map((x, i) => (
              <div key={i} className="mm-sr" style={{ textAlign: "center", transitionDelay: `${i * 0.1}s` }}>
                <div style={{ position: "relative", background: C.white, borderRadius: 16, padding: "34px 20px 24px", border: `2px solid ${C.black}` }}>
                  <div style={{ position: "absolute", top: -18, left: "50%", transform: "translateX(-50%) rotate(-4deg)",
                    background: C.yellow, color: C.black, fontWeight: 900, fontSize: 16, width: 42, height: 42, borderRadius: "50%",
                    border: `2px solid ${C.black}`, display: "flex", alignItems: "center", justifyContent: "center" }}>{x.n}</div>
                  <img src={x.img} alt="" style={{ width: "66%", maxWidth: 190, display: "block", margin: "0 auto 14px" }} />
                  <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{x.t}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.9, color: C.gray }}>{x.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 会話デモ ── */}
      <section style={{ background: C.yellowSoft, borderTop: `2px solid ${C.black}`, padding: "90px 24px 96px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <Big en="TALK" jp="たとえば、こんな応対" />
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { who: "customer", text: "もしもし、今週の土曜日、19時に4人で予約できますか？" },
              { who: "ai", text: "お電話ありがとうございます。土曜日の19時、4名さまですね。お席をご用意できます。お名前をお伺いしてもよろしいですか？" },
              { who: "customer", text: "田中です。あと、子ども用の椅子ってありますか？" },
              { who: "ai", text: "田中さま、ありがとうございます。お子さま用のお椅子もご用意がございます。それでは土曜日19時に4名さま、お待ちしております！" },
            ].map((m, i) => (
              <div key={i} className="mm-sr" style={{
                display: "flex", gap: 10, alignItems: "flex-end",
                flexDirection: m.who === "ai" ? "row" : "row-reverse",
                transitionDelay: `${i * 0.1}s`,
              }}>
                {m.who === "ai" && (
                  <img src="/moshi/v2-mascot.webp" alt="" style={{ width: 46, height: 46, objectFit: "contain", flexShrink: 0 }} />
                )}
                <div style={{
                  maxWidth: "76%", padding: "14px 18px", fontSize: 14, fontWeight: 600, lineHeight: 1.9,
                  background: m.who === "ai" ? C.white : C.black,
                  color: m.who === "ai" ? C.black : C.white,
                  border: `2px solid ${C.black}`,
                  borderRadius: m.who === "ai" ? "16px 16px 16px 4px" : "16px 16px 4px 16px",
                }}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <p className="mm-sr" style={{ textAlign: "center", fontSize: 13, fontWeight: 600, marginTop: 34, color: C.gray }}>
            応対の言葉づかいやルールは、お店に合わせて一緒に作ります。
          </p>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ background: C.white, borderTop: `2px solid ${C.black}`, padding: "90px 24px 86px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Big en="FEATURES" jp="できること" />
          <div className="mm-grid3">
            {[
              { ic: "/moshi/v2-icon-calendar.webp", t: "予約の受付", d: "日時・人数・名前・連絡先を聞き取り。満席の時間帯は空き枠をご案内。" },
              { ic: "/moshi/v2-icon-chat.webp", t: "よくある質問に応対", d: "営業時間・駐車場・アレルギー対応など、お店ごとのQ&Aを覚えて答えます。" },
              { ic: "/moshi/v2-icon-change.webp", t: "変更・キャンセル", d: "予約の変更やキャンセルの連絡も受付。無断キャンセルの削減につながります。" },
              { ic: "/moshi/v2-icon-bell.webp", t: "LINE・メール通知", d: "応対が終わった瞬間、内容がスマホへ。緊急の用件だけ呼び出す設定も。" },
              { ic: "/moshi/v2-icon-record.webp", t: "録音＆文字起こし", d: "すべての通話は録音＋テキスト化。管理画面からいつでも振り返れます。" },
              { ic: "/moshi/v2-icon-handoff.webp", t: "人への引き継ぎ", d: "AIで対応しきれない内容は、スタッフの携帯に転送。ぜんぶAI任せにしません。" },
            ].map((x, i) => (
              <div key={i} className="mm-sr mm-feature" style={{ transitionDelay: `${(i % 3) * 0.08}s` }}>
                <img src={x.ic} alt="" style={{ width: 52, height: 52, objectFit: "contain", marginBottom: 12, display: "block" }} />
                <div style={{ fontSize: 16.5, fontWeight: 800, marginBottom: 8 }}>{x.t}</div>
                <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.9, color: C.gray }}>{x.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCENE ── */}
      <section style={{ background: C.yellow, borderTop: `2px solid ${C.black}`, padding: "90px 0 90px" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 24px" }}>
          <Big en="SCENE" jp="こんなお店・窓口に" />
        </div>
        <div className="mm-scroller">
          {[
            { img: "/moshi/v2-scene-restaurant.webp", t: "飲食店", d: "予約・問い合わせの一次受付に" },
            { img: "/moshi/v2-scene-clinic.webp", t: "クリニック受付", d: "診療時間・予約変更の応対に" },
            { img: "/moshi/v2-scene-salon.webp", t: "美容室・サロン", d: "施術中の電話をまるごとおまかせ" },
            { img: "/moshi/v2-scene-office.webp", t: "会社の代表電話", d: "取り次ぎと一次対応の自動化に" },
          ].map((x, i) => (
            <div key={i} className="mm-scene-card">
              <img src={x.img} alt={x.t} style={{ width: "100%", borderRadius: 10, display: "block", marginBottom: 14, border: `1.5px solid ${C.hair}` }} />
              <div style={{ fontSize: 16, fontWeight: 800 }}>{x.t}</div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: C.gray, marginTop: 4 }}>{x.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICE ── */}
      <section id="price" style={{ background: C.white, borderTop: `2px solid ${C.black}`, padding: "90px 24px 96px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <Big en="PRICE" jp="りょうきん" />
          <div className="mm-grid2">
            {[
              { name: "ライト", price: "9,800", note: "まずは電話番から", items: ["AIによる電話応対（よくある質問）", "LINE・メール通知", "録音＆文字起こし"], hot: false },
              { name: "スタンダード", price: "19,800", note: "いちばん人気の構成", items: ["ライトの全機能", "予約の受付・変更・キャンセル", "管理画面（予約一覧・応対履歴）", "スタッフへの転送ルール設定"], hot: true },
            ].map((p, i) => (
              <div key={i} className="mm-sr" style={{
                position: "relative", background: p.hot ? C.yellowSoft : C.white, borderRadius: 16, padding: "34px 28px",
                border: `2px solid ${C.black}`,
                boxShadow: p.hot ? `6px 6px 0 ${C.yellow}` : "none",
                transitionDelay: `${i * 0.08}s`,
              }}>
                {p.hot && (
                  <div style={{ position: "absolute", top: -16, right: 20, transform: "rotate(4deg)",
                    background: C.black, color: C.white, fontSize: 12, fontWeight: 900, padding: "6px 14px", borderRadius: 100 }}>
                    人気No.1
                  </div>
                )}
                <div style={{ fontSize: 15, fontWeight: 900, marginBottom: 2 }}>{p.name}</div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: C.gray, marginBottom: 14 }}>{p.note}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 18 }}>
                  <span style={{ fontSize: 18, fontWeight: 800 }}>月額</span>
                  <span style={{ fontSize: 44, fontWeight: 900, letterSpacing: "-0.02em" }}>¥{p.price}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.gray }}>（税込）</span>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {p.items.map((it, j) => (
                    <li key={j} style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.7, paddingLeft: 22, position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, top: 7, width: 9, height: 9, background: C.yellow, border: `2px solid ${C.black}`, borderRadius: 2, display: "inline-block" }} />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mm-sr" style={{ textAlign: "center", fontSize: 12.5, fontWeight: 600, color: C.gray, marginTop: 28, lineHeight: 2 }}>
            初期設定費 50,000円〜（応対ルール・Q&Aの作り込み込み）／通話量が多い店舗はお見積もり。<br />
            導入前に、実際にAIと話せる無料デモをご用意しています。
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ background: C.white, borderTop: `2px solid ${C.black}`, padding: "90px 24px 80px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Big en="FAQ" jp="よくある質問" />
          {[
            ["電話番号は変わりますか？", "変わりません。今お使いの番号をそのまま使えます。転送設定だけで始められ、専用機器や工事も不要です。"],
            ["お客様に「AIだ」と気づかれませんか？", "最初に「AIの自動応対」であることを明るくお伝えする設定を推奨しています。隠すより、その方がお客様の満足度が高いためです。言い回しはお店に合わせて調整できます。"],
            ["AIが答えられない質問が来たら？", "「担当者からお折り返しします」と引き取って、要件をスマホに通知します。緊急の内容はスタッフの携帯に直接転送するルールも設定できます。"],
            ["予約台帳やシステムと連携できますか？", "まずはLINE通知＋管理画面での運用から始められます。お使いの予約台帳やPOSとの連携はご相談ください（内容により個別お見積もり）。"],
            ["導入までどのくらいかかりますか？", "お店のQ&Aと応対ルールを一緒に作って、最短2週間で開始できます。開始後も応対ログを見ながら言い回しを育てていきます。"],
          ].map(([q, a], i) => (
            <details key={i} className="mm-sr mm-faq" style={{ transitionDelay: `${i * 0.05}s` }}>
              <summary>
                <span style={{ fontWeight: 900, marginRight: 12, background: C.yellow, border: `2px solid ${C.black}`, borderRadius: 6, padding: "1px 8px", fontSize: 12.5 }}>Q</span>{q}
                <span className="mm-faq-plus">＋</span>
              </summary>
              <div style={{ padding: "4px 20px 18px 56px", fontSize: 13.5, fontWeight: 500, lineHeight: 2, color: C.gray }}>{a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: C.black, padding: "90px 24px 130px", textAlign: "center" }}>
        <div className="mm-sr">
          <div style={{ display: "inline-block", background: C.white, borderRadius: "50%", padding: 18, marginBottom: 24, border: `4px solid ${C.yellow}` }}>
            <img src="/moshi/v2-mascot-ok.webp" alt="" className="mm-bob" style={{ width: "min(150px, 34vw)", display: "block" }} />
          </div>
          <h2 style={{ fontSize: "clamp(26px, 5.5vw, 44px)", fontWeight: 900, color: C.white, lineHeight: 1.5, marginBottom: 18 }}>
            まずは、AIと<br className="mm-sp" />話してみてください。
          </h2>
          <p style={{ fontSize: 14.5, fontWeight: 600, color: "rgba(255,255,255,0.8)", lineHeight: 2, marginBottom: 32 }}>
            百聞は一見にしかず。デモ用の番号に電話するだけで、<br className="mm-pc" />
            モシモシAIの応対を体験できます。もちろん無料です。
          </p>
          <a href="/contact" className="mm-cta-yellow">無料デモを申し込む</a>
          <div style={{ marginTop: 26, fontSize: 12.5, fontWeight: 700, color: "rgba(255,255,255,0.55)" }}>
            運営：合同会社80（名古屋のAI開発会社）
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: C.black, borderTop: "1px solid rgba(255,255,255,0.15)", padding: "26px 24px 110px", textAlign: "center" }}>
        <div style={{ fontSize: 11.5, fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>
          © 2026 合同会社80　<a href="/" style={{ color: "rgba(255,255,255,0.6)" }}>会社サイト</a>　<a href="/privacy" style={{ color: "rgba(255,255,255,0.6)" }}>プライバシーポリシー</a>
        </div>
      </footer>

      {/* ── 固定ボトムCTA ── */}
      <div style={{ position: "fixed", left: 0, right: 0, bottom: 16, zIndex: 100, display: "flex", justifyContent: "center", padding: "0 16px", pointerEvents: "none" }}>
        <a href="/contact" className="mm-bottombar" style={{ pointerEvents: "auto" }}>
          <span className="mm-bottom-sticker">無料<br />デモ</span>
          AIと話してみる
        </a>
      </div>

      <style>{`
        .mm-sr { opacity: 0; transform: translateY(28px); transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
        .mm-sr.on { opacity: 1; transform: translateY(0); }

        .mm-navbtn {
          background: ${C.black}; color: #fff; font-size: 13px; font-weight: 800;
          padding: 11px 22px; border-radius: 100px; text-decoration: none; border: 2px solid ${C.black};
          transition: background 0.2s, color 0.2s, transform 0.2s;
        }
        .mm-navbtn:hover { background: ${C.yellow}; color: ${C.black}; transform: scale(1.04); }

        .mm-cta-main {
          display: inline-block; background: ${C.black}; color: #fff;
          font-size: 15px; font-weight: 800; padding: 16px 34px; border-radius: 100px;
          text-decoration: none; border: 2px solid ${C.black};
          box-shadow: 4px 4px 0 ${C.yellow};
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .mm-cta-main:hover { transform: translate(2px, 2px); box-shadow: 1px 1px 0 ${C.yellow}; }
        .mm-cta-sub {
          display: inline-block; background: #fff; color: ${C.black};
          font-size: 15px; font-weight: 800; padding: 16px 34px; border-radius: 100px;
          text-decoration: none; border: 2px solid ${C.black};
          transition: background 0.2s, transform 0.15s;
        }
        .mm-cta-sub:hover { background: ${C.yellowSoft}; transform: translateY(-2px); }
        .mm-cta-yellow {
          display: inline-block; background: ${C.yellow}; color: ${C.black};
          font-size: 16px; font-weight: 900; padding: 18px 44px; border-radius: 100px;
          text-decoration: none; border: 2px solid ${C.yellow};
          box-shadow: 0 6px 0 rgba(255,225,0,0.25);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .mm-cta-yellow:hover { transform: translateY(2px); box-shadow: 0 3px 0 rgba(255,225,0,0.25); }

        .mm-bob { animation: mm-bob 3.4s ease-in-out infinite; }
        @keyframes mm-bob { 0%,100% { transform: translateY(0) rotate(-0.5deg); } 50% { transform: translateY(-10px) rotate(1deg); } }

        .mm-marquee { animation: mm-marquee 30s linear infinite; }
        @keyframes mm-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        .mm-grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
        .mm-grid2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 26px; }

        .mm-card {
          background: #fff; border-radius: 16px; padding: 18px 18px 22px;
          border: 2px solid ${C.black};
          transition: transform 0.3s, box-shadow 0.3s, opacity 0.8s cubic-bezier(0.16,1,0.3,1);
        }
        .mm-card:hover { transform: translateY(-5px); box-shadow: 6px 8px 0 ${C.yellow}; }

        .mm-feature {
          background: #fff; border: 2px solid ${C.black}; border-radius: 16px; padding: 26px 24px;
          transition: transform 0.25s, box-shadow 0.25s, opacity 0.8s cubic-bezier(0.16,1,0.3,1);
        }
        .mm-feature:hover { transform: translateY(-4px); box-shadow: 6px 6px 0 ${C.yellow}; }

        .mm-scroller {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;
          max-width: 1060px; margin: 0 auto; padding: 0 24px;
        }
        .mm-scene-card { background: #fff; border: 2px solid ${C.black}; border-radius: 16px; padding: 14px 14px 18px; }

        .mm-faq {
          background: #fff; border: 2px solid ${C.black}; border-radius: 14px; margin-bottom: 14px; overflow: hidden;
        }
        .mm-faq summary {
          cursor: pointer; list-style: none; padding: 18px 20px;
          font-size: 14.5px; font-weight: 800; position: relative; padding-right: 48px;
        }
        .mm-faq summary::-webkit-details-marker { display: none; }
        .mm-faq-plus {
          position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
          width: 26px; height: 26px; border-radius: 50%; background: ${C.yellow}; border: 2px solid ${C.black};
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 900; color: ${C.black}; transition: transform 0.25s;
        }
        .mm-faq[open] .mm-faq-plus { transform: translateY(-50%) rotate(45deg); }

        .mm-bottombar {
          display: inline-flex; align-items: center; gap: 10px; position: relative;
          background: ${C.black}; color: #fff; font-size: 15px; font-weight: 800;
          padding: 17px 44px 17px 58px; border-radius: 100px; text-decoration: none;
          border: 2px solid ${C.black};
          box-shadow: 0 10px 30px rgba(17,17,17,0.35);
          transition: transform 0.2s;
        }
        .mm-bottombar:hover { transform: scale(1.04); }
        .mm-bottom-sticker {
          position: absolute; left: -10px; top: -14px;
          width: 54px; height: 54px; border-radius: 50%;
          background: ${C.yellow}; color: ${C.black}; font-size: 11px; font-weight: 900;
          display: flex; align-items: center; justify-content: center; text-align: center; line-height: 1.2;
          transform: rotate(-12deg); border: 2px solid ${C.black};
          clip-path: polygon(50% 0%, 59% 6%, 69% 2%, 75% 11%, 86% 10%, 89% 20%, 99% 23%, 98% 34%, 106% 41%, 100% 50%, 106% 59%, 98% 66%, 99% 77%, 89% 80%, 86% 90%, 75% 89%, 69% 98%, 59% 94%, 50% 100%, 41% 94%, 31% 98%, 25% 89%, 14% 90%, 11% 80%, 1% 77%, 2% 66%, -6% 59%, 0% 50%, -6% 41%, 2% 34%, 1% 23%, 11% 20%, 14% 10%, 25% 11%, 31% 2%, 41% 6%);
        }

        .mm-sp { display: none; }
        @media (max-width: 820px) {
          .mm-grid3 { grid-template-columns: 1fr; }
          .mm-grid2 { grid-template-columns: 1fr; }
          .mm-scroller { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; padding-bottom: 8px; }
          .mm-scene-card { flex: 0 0 72%; scroll-snap-align: start; }
          .mm-pc { display: none; }
          .mm-sp { display: inline; }
        }
      `}</style>
    </div>
  );
}
