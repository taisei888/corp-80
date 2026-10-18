"use client";

import { useEffect, useRef, useState } from "react";
import LeadChat from "./LeadChat";

// ─── palette（白×黄×黒） ───
const YELLOW = "#FFE100";
const SOFT = "#FFF9D6";
const BLACK = "#111111";
const GRAY = "#5A5A52";
const HAIR = "#E8E6DE";

// ===== 8つのスキル（旧キャラ名鑑を機能ベースに再構成） =====
const SKILLS = [
  { icon: "/ailab/icon-pen.webp", role: "文章生成AI",
    intro: "メールの返信、見積書、SNSの投稿文まで、貴社らしい言葉づかいで下書きします。よくある質問への即答も得意です。",
    skills: ["問い合わせの一次対応", "返信文の自動下書き", "見積書・書類の送付"] },
  { icon: "/ailab/icon-mic.webp", role: "音声認識AI",
    intro: "会議でも電話でも、人の話を聴きとって文字にします。決定事項とTODOの整理まで自動で行います。",
    skills: ["議事録の自動作成", "TODOの整理と通知", "報告書・日報のまとめ"] },
  { icon: "/ailab/icon-call.webp", role: "音声対話AI",
    intro: "自然な声で電話に出て、用件を聞いて、予約ならカレンダーに登録まで。人と会話するAIです。",
    skills: ["電話の自動応対", "予約のカレンダー登録", "担当者への即時通知"] },
  { icon: "/ailab/icon-scan.webp", role: "文字読み取りAI",
    intro: "レシートも手書きのFAXも、写真から文字を読みとってデータ化。仕訳して会計ソフトへの登録まで行います。",
    skills: ["領収書・請求書の読み取り", "勘定科目の自動仕訳", "会計ソフトへの登録"] },
  { icon: "/ailab/icon-puzzle.webp", role: "業務最適化AI",
    intro: "たくさんの条件からいちばん良い答えを見つけます。シフト表も配送ルートも、パズルのように解きます。",
    skills: ["シフト表の自動作成", "希望休・法令チェック", "人件費の最適化"] },
  { icon: "/ailab/icon-eye.webp", role: "画像認識AI",
    intro: "現場の写真から状況を読みとって、日報や報告書に。目で見て判断する仕事を自動化します。",
    skills: ["現場写真から日報を自動作成", "FAX・手書き書類のデータ化", "工程・点検記録の管理"] },
  { icon: "/ailab/icon-grow.webp", role: "学習・改善AI",
    intro: "使うほど貴社の言葉づかいや仕事のクセを覚えて賢くなります。導入後の改善まで伴走します。",
    skills: ["導入プランの設計", "効果測定と改善", "専任担当との伴走サポート"] },
  { icon: "/ailab/icon-talk.webp", role: "会話AI",
    intro: "チャットで質問に答えたり、社内マニュアルを検索したり。このページの診断チャットも同じ仕組みです。",
    skills: ["導入前の疑問にお答え", "セキュリティ方針のご説明", "無料相談の受付"] },
];

// ── チーム連携の3つのシーン ──
const FLOWS = [
  {
    title: "請求書が届いたら",
    steps: [
      { icon: "/ailab/icon-pen.webp", name: "文章生成AI", does: "メールで届いた請求書をキャッチ" },
      { icon: "/ailab/icon-scan.webp", name: "文字読み取りAI", does: "読み取って仕訳、会計ソフトへ登録" },
      { icon: "/ailab/pk-survey.webp", name: "データ分析AI", does: "ダッシュボードの数字に反映" },
    ],
    result: "経理の入力作業はゼロ。数字はいつでも最新です。",
  },
  {
    title: "予約の電話が鳴ったら",
    steps: [
      { icon: "/ailab/icon-call.webp", name: "音声対話AI", does: "電話に出て、予約を受け付け" },
      { icon: "/ailab/icon-puzzle.webp", name: "業務最適化AI", does: "空き状況を確認してカレンダーに登録" },
      { icon: "/ailab/icon-pen.webp", name: "文章生成AI", does: "お客様へ確認の連絡を送信" },
    ],
    result: "手が離せなくても、予約は取りこぼしません。",
  },
  {
    title: "現場の1日が終わったら",
    steps: [
      { icon: "/ailab/icon-eye.webp", name: "画像認識AI", does: "現場写真から日報を自動作成" },
      { icon: "/ailab/icon-mic.webp", name: "音声認識AI", does: "週次の報告書にまとめる" },
      { icon: "/ailab/pk-survey.webp", name: "データ分析AI", does: "進捗をダッシュボードへ反映" },
    ],
    result: "事務所に戻ってからの報告作業がなくなります。",
  },
];

// ===== 6つのショーケース =====
const SHOWCASES = [
  {
    id: "mail", mock: "/mocks/agent.png", crole: "文章生成AI",
    title: <>メールの返信が、<br />確認するだけになる。</>,
    body: "届いた問い合わせを読み、過去のやり取りや在庫を確認して、返信文までご用意。最後に「送信」を押すだけです。",
    points: ["受信内容を読み取り、要件を整理", "履歴・データを参照して回答を作成", "ワンクリックで送信完了"],
  },
  {
    id: "minutes", mock: "/mocks/minutes.png", crole: "音声認識AI",
    title: <>会議が終わった瞬間、<br />議事録も終わっている。</>,
    body: "録音するだけで、決定事項とTODOを整理して担当者へ通知まで。「議事録まとめといて」という仕事が消えます。",
    points: ["録音から議事録を自動生成", "決定事項・TODOを自動整理", "担当者へそのまま通知"],
  },
  {
    id: "phone", mock: "/mocks/phone.png", crole: "音声対話AI",
    title: <>忙しい時間の電話に、<br />AIが出てくれる。</>,
    body: "用件を聞いて、予約ならカレンダーに登録、確認の連絡まで自動で完了。仕込み中も接客中も、電話で手が止まりません。",
    points: ["自然な会話で用件をヒアリング", "予約をカレンダーへ自動登録", "担当者のLINEへ即通知"],
  },
  {
    id: "keihi", mock: "/mocks/keihi.png", crole: "文字読み取りAI",
    title: <>領収書は、<br />撮るだけでいい。</>,
    body: "スマホで撮影するだけで、読み取り・勘定科目の仕訳・会計ソフトへの登録まで自動化。月末の憂鬱がなくなります。",
    points: ["写真から日付・金額・摘要を読み取り", "勘定科目をAIが自動で仕訳", "freee・マネーフォワードへ自動登録"],
  },
  {
    id: "shift", mock: "/mocks/shift.png", crole: "業務最適化AI",
    title: <>来月のシフトが、<br />3分で組み上がる。</>,
    body: "スタッフの希望・労働時間のルール・人件費の予算をすべてふまえて、AIがシフト表を自動作成。毎月の頭痛が消えます。",
    points: ["希望休を全員分反映", "労働時間・法令を自動チェック", "人件費も予算内に最適化"],
  },
  {
    id: "numbers", mock: "/mocks/dashboard.png", crole: "データ分析AI",
    title: <>「今どうなってる？」に、<br />即答できる会社になる。</>,
    body: "GoogleマップやLINE、会計ソフトなど、普段お使いのサービスとAPIで直接つながり、数字を毎日自動で取得。バラバラだったデータが、ひと目でわかる画面にそろいます。",
    points: ["Google・LINE・会計ソフト等とAPI連携", "散らばった数字を毎日自動で収集", "AIが「次の一手」まで提案"],
  },
];

const CAPABILITIES = [
  "見積書・書類ドラフト", "SNS投稿・口コミ返信", "社内FAQ・マニュアル検索", "製造管理",
  "FAX・手書き書類のデータ化", "現場写真から日報", "営業支援", "採用・人事サポート",
  "紙の山をデータベース化", "毎朝の自動巡回レポート", "24時間働く営業アシスタント", "在庫の見える化",
  "顧客対応の記録・引き継ぎ", "補助金情報のウォッチ", "予約サイトの構築", "ホームページ制作",
];

const WORKS = [
  { tag: "飲食店（愛知県）", title: "集客×売上ダッシュボード", desc: "Googleマップの数字と売上を毎日自動集計。口コミ返信もAIが支援。", img: "/mocks/dashboard.png" },
  { tag: "地域団体", title: "コミュニティアプリ", desc: "写真を選ぶだけでAIが会報を自動レイアウト。見守り機能も。", img: "/mocks/community.png" },
  { tag: "自社サービス", title: "組織分析AI「LENDS AI」", desc: "アンケートから組織の状態を診断し、改善レポートを自動生成。", img: "/mocks/lends.png", href: "https://www.lens-ai.jp" },
  { tag: "自社ツール", title: "経費の自動読み取り", desc: "領収書をスキャンするだけで一覧データ化。自社でも毎日使っています。", img: "/mocks/keihi.png" },
];

// パッケージ商品（月額・従量明記）。金額は税別
const PACKAGES = [
  { icon: "/ailab/pk-minutes.webp", name: "議事録AI", by: "音声認識", price: "24,800",
    unit: "1チーム", includes: "録音 月30時間まで", over: "超過 800円／時間", popular: false },
  { icon: "/ailab/pk-scan.webp", name: "書類読み取り", by: "文字読み取り", price: "19,800",
    unit: "1事業所", includes: "月500枚まで（領収書・請求書・手書き）", over: "超過 40円／枚", popular: true },
  { icon: "/ailab/pk-bot.webp", name: "AIチャットボット", by: "会話", price: "14,800",
    unit: "1サイト", includes: "月1,000会話まで", over: "超過 3円／会話", popular: false },
  { icon: "/ailab/pk-faq.webp", name: "社内・社外FAQ", by: "学習・改善", price: "14,800",
    unit: "1社", includes: "月1,000質問・学習100ファイルまで", over: "超過 3円／質問", popular: false },
  { icon: "/ailab/pk-survey.webp", name: "サーベイ・満足度調査", by: "データ分析", price: "19,800",
    unit: "1組織", includes: "月500回答まで＋AI分析レポート", over: "超過 20円／回答", popular: false },
];

const FAQS = [
  { q: "ITに詳しい社員がいなくても大丈夫？", a: "大丈夫です。使い方の説明から日々の運用まで、専任担当が伴走します。" },
  { q: "情報漏えいが心配です", a: "データの取り扱いルールを事前に取り決めます。入力内容をAIに学習させない構成も可能です。" },
  { q: "今使っているシステムはそのまま使える？", a: "使えます。既存のExcel・会計ソフト・基幹システムに合わせて開発します。" },
  { q: "途中でやめられますか？", a: "月額プランは解約自由です。小さく試してから、続けるかご判断ください。" },
];

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      let start = 0;
      const step = Math.max(1, Math.ceil(to / 50));
      const id = setInterval(() => {
        start = Math.min(start + step, to);
        setVal(start);
        if (start >= to) clearInterval(id);
      }, 24);
    }, { threshold: 0.5 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// 黄色マーカー
function Marker({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ background: `linear-gradient(transparent 55%, ${YELLOW} 55%, ${YELLOW} 92%, transparent 92%)`, padding: "0 2px" }}>
      {children}
    </span>
  );
}

// 巨大セクションタイトル
function Big({ en, jp, color = BLACK }: { en: string; jp: string; color?: string }) {
  return (
    <div className="rv" style={{ textAlign: "center", marginBottom: 44 }}>
      <p style={{ fontSize: 13.5, fontWeight: 800, color, marginBottom: 6, letterSpacing: "0.1em" }}>{jp}</p>
      <p style={{ fontSize: "clamp(44px, 9vw, 92px)", fontWeight: 900, color, lineHeight: 1.0, letterSpacing: "-0.01em" }}>{en}</p>
    </div>
  );
}

const JSONLD_SERVICE = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "AIエージェント開発・業務自動化（AIラボ）",
  provider: { "@type": "Organization", name: "合同会社80", url: "https://www.rng-labs.com" },
  areaServed: "JP",
  description: "中小企業向けにAIエージェントをオーダーメイド開発。メール・電話・経理・シフト作成などの業務自動化を、月額制で小さく始められます。",
};
const JSONLD_FAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function AiLabsPage() {
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [flat, setFlat] = useState(false);
  useEffect(() => {
    const c = () => setIsMobile(window.innerWidth < 700);
    c();
    window.addEventListener("resize", c);
    return () => window.removeEventListener("resize", c);
  }, []);
  useEffect(() => { setFlat(new URLSearchParams(window.location.search).has("flat")); }, []);
  // QA用: ?qy=1234 で指定位置へスクロール固定（スクショ検証用・通常閲覧には無影響）
  useEffect(() => {
    const qy = Number(new URLSearchParams(window.location.search).get("qy") || 0);
    if (!qy) return;
    const t = setInterval(() => window.scrollTo(0, qy), 250);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hf: React.CSSProperties = { fontWeight: 900 };

  const CTA = ({ big = false }: { big?: boolean }) => (
    <a href="/contact" className="cta-main" style={{ fontSize: big ? 16 : 14, padding: big ? "18px 46px" : "14px 34px" }}>
      無料相談してみる
      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
    </a>
  );

  return (
    <div style={{ background: "#fff", color: BLACK, fontFamily: "inherit", overflowX: "clip" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD_SERVICE) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD_FAQ) }} />

      {/* 進行バー */}
      <div style={{ position: "fixed", top: 0, left: 0, height: 4, width: `${progress * 100}%`, background: YELLOW, zIndex: 200, transition: "width 0.1s", borderRight: progress > 0.01 ? `2px solid ${BLACK}` : "none" }} />

      {/* ナビ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.8)",
        backdropFilter: "blur(14px)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", height: 62,
        borderBottom: scrolled ? `2px solid ${BLACK}` : `1px solid ${HAIR}`,
        transition: "border-color 0.25s, background 0.25s",
      }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <span style={{ width: 12, height: 12, borderRadius: "50%", background: YELLOW, border: `2px solid ${BLACK}`, display: "inline-block" }} />
          <span style={{ ...hf, fontSize: 14.5, color: BLACK }}>AIラボ — 合同会社80</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <a href="/demo" style={{ fontSize: 13, fontWeight: 800, color: GRAY, textDecoration: "none" }}>デモ</a>
          <a href="/contact" className="cta-nav">無料相談</a>
        </div>
      </nav>

      {/* ══ 1. ヒーロー ══ */}
      <section className="sec" style={{ minHeight: flat ? undefined : "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: isMobile ? "84px 18px 28px" : "110px 40px 40px", position: "relative", background: "#fff" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.55, backgroundImage: `radial-gradient(${HAIR} 3px, transparent 3px)`, backgroundSize: "30px 30px" }} />
        <div style={{ maxWidth: 1120, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 64, alignItems: "center", position: "relative" }} className="hero-grid">
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 800, color: BLACK, background: "#fff", border: `2px solid ${BLACK}`, borderRadius: 100, padding: "7px 18px", marginBottom: 26 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: YELLOW, border: `1.5px solid ${BLACK}` }} />
              中小企業のためのAIエージェント開発
            </div>
            <h1 style={{ ...hf, fontSize: "clamp(34px, 3.8vw, 52px)", lineHeight: 1.45, letterSpacing: "0.01em" }}>
              <Marker>貴社専用</Marker>の、<br />
              AIエージェント。
            </h1>
            {!isMobile && (
              <p style={{ fontSize: 15, fontWeight: 500, lineHeight: 2.1, color: GRAY, marginTop: 22, maxWidth: 440 }}>
                メール、電話、経理、シフト表。毎日の「めんどうな仕事」を、貴社の業務に合わせて育てたAIのチームが、受けわたしながら最後まで実行します。
              </p>
            )}
            {!isMobile && (
              <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 30 }}>
                <CTA />
                <p style={{ fontSize: 12, fontWeight: 600, color: GRAY, lineHeight: 1.7 }}>診断リスト進呈 ｜ 月数万円台〜<br />2〜4週間で導入</p>
              </div>
            )}
          </div>
          <div style={{ position: "relative" }}>
            <img src="/ailab/robo-wave.webp" alt="" style={{ position: "absolute", top: -74, right: 4, height: 92, zIndex: 2, animation: "bob 3.6s ease-in-out infinite" }} />
            <LeadChat headFont={hf}
              greeting={"こんにちは！AI業務診断チャットです。\nお仕事、なにが一番めんどうですか？\n「請求書の入力がつらい」「電話が多すぎる」——そんなグチみたいな一言で大丈夫です。どう自動化できるか、その場でお答えします。"}
              placeholder="例：毎日おなじ入力作業ばっかりで…" />
          </div>
        </div>
        {isMobile && (
          <div style={{ textAlign: "center", marginTop: 22, position: "relative", zIndex: 1 }}>
            <CTA />
          </div>
        )}
        <p style={{ textAlign: "center", fontSize: 12, fontWeight: 700, color: GRAY, marginTop: isMobile ? 20 : 46, position: "relative" }}>
          <span style={{ display: "inline-block", animation: "nudge 1.6s ease-in-out infinite" }}>▼</span>　スクロールして続きを見る
        </p>
      </section>

      {/* ══ 2. お悩み ══ */}
      <section className="sec" style={{ padding: "100px 40px", background: "#fff", borderTop: `2px solid ${BLACK}` }}>
        <div style={{ maxWidth: 1020, margin: "0 auto", textAlign: "center" }}>
          <Big en="PROBLEM" jp="こんな毎日に、心当たりはありませんか？" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22, marginTop: 10 }} className="grid3">
            {[
              { img: "/ailab/nayami-input.webp", t: "入力と転記だけで、1日が終わる" },
              { img: "/ailab/nayami-phone.webp", t: "電話のたびに、仕事の手が止まる" },
              { img: "/ailab/nayami-night.webp", t: "気づけばまた、夜まで書類づくり" },
            ].map((p, i) => (
              <div key={i} className="rv card" style={{ transitionDelay: `${i * 0.06}s` }}>
                <img src={p.img} alt="" style={{ width: "100%", borderRadius: 10, display: "block", marginBottom: 16, border: `1.5px solid ${HAIR}` }} />
                <p style={{ ...hf, fontSize: 15.5, lineHeight: 1.8 }}>{p.t}</p>
              </div>
            ))}
          </div>
          <p className="rv" style={{ ...hf, fontSize: "clamp(20px, 2.6vw, 28px)", marginTop: 56, lineHeight: 1.7 }}>
            その仕事、ぜんぶ<Marker>AIの得意分野</Marker>です。
          </p>
        </div>
      </section>

      {/* ══ 3. できること名鑑 ══ */}
      <section className="sec" style={{ padding: "100px 40px", background: SOFT, borderTop: `2px solid ${BLACK}` }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", textAlign: "center" }}>
          <Big en="SKILLS" jp="AIエージェントの8つの能力" />
          <p className="rv" style={{ fontSize: 14, fontWeight: 600, color: GRAY, marginTop: -20, marginBottom: 36, lineHeight: 2 }}>それぞれ得意な仕事があります。気になる能力をタップすると、詳しく見られます。</p>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 12 }}>
            {SKILLS.map((c, i) => (
              <button key={c.role} onClick={() => setPicked(picked === i ? null : i)} className="rv skill-card" style={{
                background: picked === i ? YELLOW : "#fff", borderRadius: 16, padding: "20px 10px 16px",
                border: `2px solid ${BLACK}`,
                boxShadow: picked === i ? `4px 4px 0 ${BLACK}` : "none",
                transform: picked === i ? "translateY(-4px)" : undefined,
                transitionDelay: `${i * 0.03}s`, cursor: "pointer", fontFamily: "inherit", textAlign: "center",
              }}>
                <img src={c.icon} alt="" style={{ height: 46, display: "block", margin: "0 auto 10px" }} />
                <p style={{ ...hf, fontSize: 13.5, color: BLACK }}>{c.role}</p>
              </button>
            ))}
          </div>

          {(() => { const sel = picked ?? 0; return (
            <div key={sel} style={{
              marginTop: 22, background: "#fff", borderRadius: 18, border: `2px solid ${BLACK}`,
              padding: "26px 34px", display: "flex", alignItems: "center", gap: 30, textAlign: "left",
              animation: "bubbleIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both",
            }} className="pick-panel">
              <img src={SKILLS[sel].icon} alt="" style={{ height: 88, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ ...hf, fontSize: 18, color: BLACK }}>{SKILLS[sel].role}</p>
                <p style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 2, color: GRAY, marginTop: 8 }}>{SKILLS[sel].intro}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                  {SKILLS[sel].skills.map((sk) => (
                    <span key={sk} style={{ fontSize: 12, fontWeight: 800, color: BLACK, background: SOFT, border: `1.5px solid ${BLACK}`, borderRadius: 100, padding: "6px 14px" }}>{sk}</span>
                  ))}
                </div>
              </div>
            </div>
          ); })()}
        </div>
      </section>

      {/* ══ 3b. チーム連携 ══ */}
      <section className="sec" style={{ padding: "100px 40px", background: "#fff", borderTop: `2px solid ${BLACK}` }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Big en="TEAMWORK" jp="ひとつの仕事を、受けわたして完了させる" />
          <div style={{ marginBottom: 40 }}>
            <img className="rv" src="/ailab/robo-team.webp" alt="" style={{ height: isMobile ? 84 : 120, display: "block", margin: "0 auto" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {FLOWS.map((f, fi) => (
              <div key={f.title} className="rv" style={{ background: SOFT, borderRadius: 18, border: `2px solid ${BLACK}`, padding: isMobile ? "22px 16px 18px" : "30px 36px 26px", transitionDelay: `${fi * 0.06}s` }}>
                <p style={{ ...hf, fontSize: 17, textAlign: "center" }}>{f.title}</p>
                {!isMobile ? (
                <div style={{ display: "flex", alignItems: "stretch", justifyContent: "center", marginTop: 24 }}>
                  {f.steps.map((st, si) => (
                    <div key={si} style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ width: 214, textAlign: "center", background: "#fff", border: `2px solid ${BLACK}`, borderRadius: 14, padding: "18px 14px 16px" }}>
                        <img src={st.icon} alt="" style={{ height: 48, display: "block", margin: "0 auto 10px" }} />
                        <p style={{ ...hf, fontSize: 13 }}>{st.name}</p>
                        <p style={{ fontSize: 12, fontWeight: 600, color: GRAY, lineHeight: 1.8, marginTop: 5 }}>{st.does}</p>
                      </div>
                      {si < f.steps.length - 1 && (
                        <div style={{ width: 56, height: 3, background: `repeating-linear-gradient(90deg, ${BLACK} 0 8px, transparent 8px 16px)`, margin: "0 6px", flexShrink: 0 }} />
                      )}
                    </div>
                  ))}
                </div>
                ) : (
                <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 6 }}>
                  {f.steps.map((st, si) => (
                    <div key={si}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", border: `2px solid ${BLACK}`, borderRadius: 12, padding: "10px 14px" }}>
                        <img src={st.icon} alt="" style={{ height: 38, flexShrink: 0 }} />
                        <div>
                          <p style={{ ...hf, fontSize: 12.5 }}>{st.name}</p>
                          <p style={{ fontSize: 11.5, fontWeight: 600, color: GRAY, lineHeight: 1.6 }}>{st.does}</p>
                        </div>
                      </div>
                      {si < f.steps.length - 1 && <p style={{ textAlign: "center", fontSize: 14, fontWeight: 900, margin: "2px 0" }}>↓</p>}
                    </div>
                  ))}
                </div>
                )}
                <p style={{ ...hf, fontSize: 13.5, textAlign: "center", marginTop: 16, background: YELLOW, border: `2px solid ${BLACK}`, borderRadius: 100, padding: "9px 24px", display: "table", marginLeft: "auto", marginRight: "auto" }}>{f.result}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 4-9. ショーケース ══ */}
      {SHOWCASES.map((s, i) => (
        <section key={s.id} style={{ padding: "90px 40px 110px", background: i % 2 === 0 ? SOFT : "#fff", borderTop: `2px solid ${BLACK}` }}>
          <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 60, alignItems: "center", direction: i % 2 === 1 ? "rtl" : "ltr" }} className="show-grid">
            <div className="rv" style={{ direction: "ltr" }}>
              <img src={s.mock} alt="" style={{ width: "100%", filter: "drop-shadow(0 18px 36px rgba(17,17,17,0.18))" }} />
            </div>
            <div className="rv" style={{ direction: "ltr" }}>
              <p style={{ fontSize: 11.5, fontWeight: 800, color: BLACK, background: YELLOW, border: `2px solid ${BLACK}`, borderRadius: 100, padding: "5px 16px", display: "inline-block" }}>{s.crole}</p>
              <h2 style={{ ...hf, fontSize: "clamp(24px, 2.8vw, 33px)", lineHeight: 1.55, marginTop: 16 }}>{s.title}</h2>
              <p style={{ fontSize: 14, fontWeight: 500, lineHeight: 2.1, color: GRAY, marginTop: 16 }}>{s.body}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
                {s.points.map((pt) => (
                  <div key={pt} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, fontWeight: 700 }}>
                    <span style={{ width: 12, height: 12, background: YELLOW, border: `2px solid ${BLACK}`, borderRadius: 3, flexShrink: 0 }} />
                    {pt}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ══ 10. もっとできる（マーキー）＋API連携 ══ */}
      <section className="sec" style={{ padding: "100px 0 90px", background: "#fff", overflow: "hidden", borderTop: `2px solid ${BLACK}` }}>
        <div style={{ maxWidth: 1020, margin: "0 auto", textAlign: "center", padding: "0 40px" }}>
          <Big en="AND MORE" jp="うちのあの仕事も？——たぶん、できます" />
          <p className="rv" style={{ fontSize: 14, fontWeight: 600, color: GRAY, marginTop: -16, lineHeight: 2 }}>ここに載っていない業務も、まずは聞かせてください。<br />「それ、自動化できます」とお答えできるケースがほとんどです。</p>
        </div>
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 12 }}>
          {[0, 1].map((row) => (
            <div key={row} style={{ display: "flex", gap: 12, width: "max-content", animation: `${row === 0 ? "marqueeL" : "marqueeR"} 46s linear infinite` }}>
              {(row === 0 ? [...CAPABILITIES, ...CAPABILITIES] : [...CAPABILITIES.slice(8), ...CAPABILITIES.slice(0, 8), ...CAPABILITIES.slice(8), ...CAPABILITIES.slice(0, 8)]).map((c, j) => (
                <span key={j} style={{ fontSize: 13, fontWeight: 800, color: BLACK, background: j % 2 === 0 ? "#fff" : YELLOW, border: `2px solid ${BLACK}`, borderRadius: 100, padding: "10px 22px", whiteSpace: "nowrap" }}>{c}</span>
              ))}
            </div>
          ))}
        </div>
        {/* API連携 */}
        <div className="rv" style={{ maxWidth: 900, margin: "70px auto 0", padding: "0 40px", textAlign: "center" }}>
          <h3 style={{ ...hf, fontSize: "clamp(19px, 2.2vw, 25px)", lineHeight: 1.6 }}>
            つながるほど、<Marker>賢くなる。</Marker>
          </h3>
          <p style={{ fontSize: 13.5, fontWeight: 600, color: GRAY, lineHeight: 2, marginTop: 10 }}>
            普段お使いのサービスとAPIで直接つながり、データを自動で取得します。
          </p>
          {!isMobile ? (
          <div style={{ position: "relative", height: 440, maxWidth: 780, margin: "6px auto 0" }}>
            <div style={{ position: "absolute", left: "50%", top: 218, transform: "translate(-50%,-50%)", zIndex: 2 }}>
              <img src="/ailab/robo-wave.webp" alt="" style={{ height: 120, animation: "bob 3.2s ease-in-out infinite" }} />
            </div>
            {([
              ["line", 468, 64, 45, "0s"],
              ["gmaps", 236, 78, 50, "0.3s"],
              ["gcal", 352, 36, 47, "0.6s"],
              ["freee", 604, 128, 53, "0.9s"],
              ["mf", 120, 160, 59, "1.2s"],
              ["excel", 196, 300, 50, "1.5s"],
              ["instagram", 556, 300, 47, "1.8s"],
              ["youtube", 680, 220, 60, "2.1s"],
              ["slack", 96, 262, 61, "2.4s"],
              ["salesforce", 636, 356, 59, "2.7s"],
              ["chatwork", 140, 66, 61, "3.0s"],
              ["kintone", 60, 356, 69, "0.5s"],
              ["zoom", 300, 388, 47, "1.0s"],
              ["notion", 448, 400, 47, "1.4s"],
              ["smaregi", 716, 120, 67, "1.9s"],
              ["shopify", 40, 120, 70, "2.2s"],
              ["stripe", 540, 168, 43, "2.6s"],
              ["dropbox", 388, 128, 34, "2.9s"],
              ["airregi", 720, 306, 67, "0.7s"],
              ["x", 168, 396, 60, "1.7s"],
            ] as [string, number, number, number, string][]).map(([logo, x, y, size, d]) => (
              <div key={logo} style={{
                position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)",
                width: size, height: size, borderRadius: "50%", background: "#fff",
                border: `1.5px solid ${HAIR}`,
                boxShadow: "0 8px 22px rgba(17,17,17,0.1)", display: "flex", alignItems: "center", justifyContent: "center",
                animation: `bob 3.8s ease-in-out ${d} infinite`,
              }}>
                <img src={`/logos/${logo}.png`} alt={logo} style={{ width: size * 0.56, height: size * 0.56, borderRadius: 6 }} />
              </div>
            ))}
          </div>
          ) : (
            <div style={{ marginTop: 18 }}>
              <div style={{ textAlign: "center", marginBottom: 14 }}>
                <img src="/ailab/robo-wave.webp" alt="" style={{ height: 80, animation: "bob 3.2s ease-in-out infinite" }} />
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
                {["line","gmaps","gcal","freee","mf","excel","instagram","youtube","slack","salesforce","chatwork","kintone","zoom","notion","smaregi","shopify","stripe","dropbox","airregi","x"].map((logo) => (
                  <span key={logo} style={{ width: 44, height: 44, borderRadius: "50%", background: "#fff", border: `1.5px solid ${HAIR}`, boxShadow: "0 4px 14px rgba(17,17,17,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img src={`/logos/${logo}.png`} alt="" style={{ width: 24, height: 24, borderRadius: 5 }} />
                  </span>
                ))}
              </div>
            </div>
          )}
          <p style={{ fontSize: 11.5, fontWeight: 600, color: GRAY, marginTop: 8 }}>ほかにも、POSレジ・基幹システム・各種SaaSなど<br />※ ご利用中のシステムに合わせて接続方法をご提案します</p>
        </div>
      </section>

      {/* ══ 11. 業種別 ══ */}
      <section className="sec" style={{ padding: "100px 40px", background: SOFT, borderTop: `2px solid ${BLACK}` }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 60, alignItems: "center" }} className="show-grid">
          <div className="rv">
            <p style={{ fontSize: 13.5, fontWeight: 800, letterSpacing: "0.1em", marginBottom: 6 }}>現場のある仕事にこそ</p>
            <p style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.01em", marginBottom: 20 }}>GENBA</p>
            <h2 style={{ ...hf, fontSize: "clamp(22px, 2.6vw, 30px)", lineHeight: 1.55 }}>紙とExcelと電話の現場ほど、<br />効きます。</h2>
            <p style={{ fontSize: 14, fontWeight: 500, lineHeight: 2.1, color: GRAY, marginTop: 16 }}>製造、建設、物流、飲食、サービス業。現場で回っている仕事ほど、AIエージェントの効果は大きくなります。</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 20 }}>
              {["製造業", "建設業", "物流・倉庫", "飲食・小売", "サービス業"].map((u) => (
                <span key={u} style={{ fontSize: 12.5, fontWeight: 800, color: BLACK, background: "#fff", border: `2px solid ${BLACK}`, borderRadius: 100, padding: "8px 18px" }}>{u}</span>
              ))}
            </div>
          </div>
          <div className="rv" style={{ display: "flex", gap: 16 }}>
            <img src="/ailab/industry-factory.webp" alt="製造業の現場" style={{ width: isMobile ? "100%" : "50%", borderRadius: 14, border: `2px solid ${BLACK}`, background: "#fff", marginTop: isMobile ? 0 : 30 }} />
            {!isMobile && <img src="/ailab/industry-genba.webp" alt="建設業の現場" style={{ width: "50%", borderRadius: 14, border: `2px solid ${BLACK}`, background: "#fff" }} />}
          </div>
        </div>
      </section>

      {/* ══ 12. Before/After ══ */}
      <section className="sec" style={{ padding: "100px 40px", background: "#fff", borderTop: `2px solid ${BLACK}` }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <Big en="AFTER" jp="「また入力作業か…」が、なくなる" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 50, alignItems: "center", marginTop: 10 }} className="show-grid">
            <img className="rv" src="/ailab/after-coffee.webp" alt="" style={{ width: "100%", borderRadius: 14, border: `2px solid ${BLACK}` }} />
            <div className="rv">
              <p style={{ fontSize: 14.5, fontWeight: 500, lineHeight: 2.2, color: GRAY }}>
                空いた時間は、お客様との会話に。新しい商品づくりに。本当にやりたかった仕事に使ってください。それがAIエージェント導入のいちばんの効果です。
              </p>
              <div style={{ display: "flex", gap: 14, marginTop: 28 }}>
                {[
                  { n: 80, s: "%", l: "作業時間を削減（最大）" },
                  { n: 4, s: "週間", l: "で導入スタート（2〜）" },
                  { n: 10, s: "時間〜", l: "毎月の直接サポート" },
                ].map((k) => (
                  <div key={k.l} style={{ flex: 1, background: SOFT, border: `2px solid ${BLACK}`, borderRadius: 14, padding: "18px 12px", textAlign: "center" }}>
                    <p style={{ ...hf, fontSize: 26 }}><Counter to={k.n} suffix={k.s} /></p>
                    <p style={{ fontSize: 10.5, fontWeight: 700, color: GRAY, marginTop: 5, lineHeight: 1.6 }}>{k.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 中間CTA ══ */}
      <section style={{ padding: "48px 40px", background: YELLOW, borderTop: `2px solid ${BLACK}`, borderBottom: `2px solid ${BLACK}` }}>
        <div style={{ maxWidth: 940, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 30, flexWrap: "wrap" }}>
          <p style={{ ...hf, fontSize: 19, lineHeight: 1.7 }}>「うちの業務でもできる？」——まずは聞いてみてください。</p>
          <a href="/contact" className="cta-black">無料相談してみる</a>
        </div>
      </section>

      {/* ══ 13. 実績 ══ */}
      <section className="sec" style={{ padding: "100px 40px", background: "#fff" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", textAlign: "center" }}>
          <Big en="WORKS" jp="つくってきたもの" />
          <p className="rv" style={{ fontSize: 14, fontWeight: 600, color: GRAY, marginTop: -20, marginBottom: 36 }}>企画からデザイン・開発・運用まで、すべて自社で行っています。</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 22, textAlign: "left" }} className="works-grid">
            {WORKS.map((w, i) => {
              const card = (
                <div className="rv workcard" style={{ background: "#fff", borderRadius: 16, border: `2px solid ${BLACK}`, overflow: "hidden", height: "100%", transitionDelay: `${i * 0.05}s` }}>
                  <div style={{ height: 210, background: SOFT, borderBottom: `2px solid ${BLACK}`, display: "flex", alignItems: "center", justifyContent: "center", padding: 18 }}>
                    <img src={w.img} alt="" style={{ maxHeight: 190, maxWidth: "94%", filter: "drop-shadow(0 10px 24px rgba(17,17,17,0.14))" }} />
                  </div>
                  <div style={{ padding: "18px 24px 22px" }}>
                    <p style={{ fontSize: 11, fontWeight: 800, color: GRAY }}>{w.tag}</p>
                    <p style={{ ...hf, fontSize: 17, marginTop: 5 }}>{w.title}</p>
                    <p style={{ fontSize: 12.5, fontWeight: 500, color: GRAY, lineHeight: 1.9, marginTop: 7 }}>{w.desc}</p>
                  </div>
                </div>
              );
              return w.href ? <a key={w.title} href={w.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>{card}</a> : <div key={w.title}>{card}</div>;
            })}
          </div>
        </div>
      </section>

      {/* ══ 14. 自社サービス ══ */}
      <section className="sec" style={{ padding: "100px 40px", background: SOFT, borderTop: `2px solid ${BLACK}` }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 60, alignItems: "center" }} className="show-grid">
          <img className="rv" src="/ailab/product-build.webp" alt="" style={{ width: "100%", borderRadius: 14, border: `2px solid ${BLACK}`, background: "#fff" }} />
          <div className="rv">
            <p style={{ fontSize: 13.5, fontWeight: 800, letterSpacing: "0.1em", marginBottom: 6 }}>自社サービス</p>
            <p style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.01em", marginBottom: 20 }}>PRODUCTS</p>
            <h2 style={{ ...hf, fontSize: "clamp(22px, 2.6vw, 30px)", lineHeight: 1.55 }}>頼まれたものだけを<br />作る会社ではありません。</h2>
            <p style={{ fontSize: 14, fontWeight: 500, lineHeight: 2.1, color: GRAY, marginTop: 16 }}>
              組織分析AI「LENDS AI」をはじめ、自社サービスの開発・運営も続けています。自分たちで作って、自分たちで毎日使って、自分たちで育てている。だから「現場で本当に使えるもの」の作り方を知っています。
            </p>
            <a href="https://www.lens-ai.jp" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 800, color: BLACK, textDecoration: "none", marginTop: 18, borderBottom: `3px solid ${YELLOW}`, paddingBottom: 2 }}>
              LENDS AI を見てみる
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.6}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </a>
          </div>
        </div>
      </section>

      {/* ══ 15. 進め方 ══ */}
      <section className="sec" style={{ padding: "100px 40px", background: "#fff", borderTop: `2px solid ${BLACK}` }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <Big en="PROCESS" jp="小さく始めて、大きく育てる" />
          <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 720, margin: "0 auto" }}>
            {[
              ["1", "無料相談", "業務内容を伺い、「自動化できる業務の診断リスト」をその場でお渡しします"],
              ["2", "小さく試す", "効果が出やすい業務ひとつから、2〜4週間で開発してお試しいただきます"],
              ["3", "広げる", "効果を確認しながら、自動化の範囲を少しずつ広げていきます"],
            ].map(([n, t, b]) => (
              <div key={n} className="rv" style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "#fff", borderRadius: 14, padding: "18px 22px", border: `2px solid ${BLACK}` }}>
                <span style={{ ...hf, width: 42, height: 42, borderRadius: "50%", background: YELLOW, border: `2px solid ${BLACK}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>{n}</span>
                <div><p style={{ ...hf, fontSize: 15.5 }}>{t}</p><p style={{ fontSize: 12.5, fontWeight: 500, color: GRAY, lineHeight: 1.9, marginTop: 4 }}>{b}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 16. 費用 ══ */}
      <section className="sec" style={{ padding: "100px 40px", background: SOFT, borderTop: `2px solid ${BLACK}` }}>
        <div style={{ maxWidth: 1020, margin: "0 auto" }}>
          <Big en="COST" jp="AI導入って、高そう…？ いいえ、小さく始められます" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 22, marginTop: 10, alignItems: "stretch" }} className="show-grid">
            <div className="rv" style={{ background: "#fff", borderRadius: 16, padding: "30px 28px", border: `2px solid ${HAIR}` }}>
              <p style={{ fontSize: 12, fontWeight: 800, color: "#9a9a90" }}>たとえば、新しく人を雇うと…</p>
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 9 }}>
                {["求人広告費と採用の手間がかかる", "月給と社会保険料が毎月発生", "仕事を覚えるまで数ヶ月", "辞めてしまうリスクがある"].map((t) => (
                  <p key={t} style={{ fontSize: 13, fontWeight: 600, color: GRAY }}>・{t}</p>
                ))}
              </div>
              <p style={{ ...hf, fontSize: 24, color: "#9a9a90", marginTop: 18 }}>月20万円〜<span style={{ fontSize: 13 }}>＋教育コスト</span></p>
            </div>
            <div className="rv" style={{ background: "#fff", borderRadius: 16, padding: "30px 28px", border: `2px solid ${BLACK}`, boxShadow: `6px 6px 0 ${YELLOW}`, position: "relative" }}>
              <img src="/ailab/robo-work.webp" alt="" style={{ position: "absolute", right: 14, top: -64, height: 96, animation: "bob 3.6s ease-in-out infinite" }} />
              <p style={{ fontSize: 12, fontWeight: 800 }}>AIエージェントなら</p>
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                {["初期費用を抑えた月額制で始められる", "24時間365日、休まず働く", "教育不要。辞めない", "効果が出る業務ひとつからでOK"].map((t) => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, fontWeight: 700 }}>
                    <span style={{ width: 11, height: 11, background: YELLOW, border: `2px solid ${BLACK}`, borderRadius: 3, flexShrink: 0 }} />{t}
                  </div>
                ))}
              </div>
              <p style={{ ...hf, fontSize: 27, marginTop: 18 }}>月数万円台〜<span style={{ fontSize: 12, fontWeight: 600, color: GRAY }}>※業務内容により個別見積り</span></p>
            </div>
          </div>
          <p className="rv" style={{ fontSize: 12.5, fontWeight: 600, color: GRAY, textAlign: "center", marginTop: 22, lineHeight: 1.9 }}>IT導入補助金など、各種補助金の対象になる場合もあります。対象かどうかも無料相談でご案内します。</p>
        </div>
      </section>

      {/* ══ 17. 料金 ══ */}
      <section className="sec" style={{ padding: "100px 40px", background: "#fff", borderTop: `2px solid ${BLACK}` }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <Big en="PRICING" jp="料金は、先に全部お見せします" />
          <p className="rv" style={{ fontSize: 14, fontWeight: 600, color: GRAY, marginTop: -20, textAlign: "center", lineHeight: 2 }}>私たちの仕事は、貴社専用の受託開発がすべての土台。<br />よくあるご依頼は、月額のパッケージとしてすぐ始められます。</p>

          {/* 受託開発（ベース） */}
          <div className="rv" style={{ marginTop: 40, background: BLACK, borderRadius: 18, padding: isMobile ? "28px 22px" : "36px 42px", display: "flex", alignItems: "center", gap: isMobile ? 18 : 36, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", color: YELLOW }}>BASE — すべての土台</p>
              <p style={{ ...hf, fontSize: "clamp(20px, 2.6vw, 27px)", color: "#fff", marginTop: 8 }}>貴社専用AIエージェントの受託開発</p>
              <p style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.75)", lineHeight: 2, marginTop: 10 }}>
                業務の診断から設計・開発・運用まで、貴社の仕事に合わせてゼロからつくります。月10時間以上の直接サポート付き。将来の買い取り（自社資産化）にも対応します。
              </p>
            </div>
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <p style={{ ...hf, fontSize: 26, color: "#fff" }}>要お見積もり</p>
              <p style={{ fontSize: 11.5, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>無料相談でその場で概算をご提示</p>
              <a href="/contact" className="cta-yellow" style={{ marginTop: 14 }}>見積もりを相談する</a>
            </div>
          </div>

          {/* パッケージ */}
          <p className="rv" style={{ ...hf, fontSize: 16, marginTop: 40, textAlign: "center" }}>
            パッケージ商品（月額）— <Marker>使う量まで、先に明記します。</Marker>
          </p>
          <p className="rv" style={{ fontSize: 12.5, fontWeight: 600, color: GRAY, textAlign: "center", marginTop: 8 }}>セットアップもサポートも込み。事務スタッフをひとり増やす<b>10分の1以下</b>のコストです。</p>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 18, marginTop: 26 }}>
            {PACKAGES.map((pk, i) => (
              <div key={pk.name} className="rv workcard" style={{
                background: pk.popular ? SOFT : "#fff", borderRadius: 16, padding: "24px 22px 22px", position: "relative",
                border: `2px solid ${BLACK}`,
                boxShadow: pk.popular ? `5px 5px 0 ${YELLOW}` : "none",
                transitionDelay: `${i * 0.04}s`, textAlign: "left",
              }}>
                {pk.popular && <span style={{ ...hf, position: "absolute", top: -13, right: 18, fontSize: 10.5, background: BLACK, color: "#fff", borderRadius: 100, padding: "4px 14px" }}>人気</span>}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <img src={pk.icon} alt="" style={{ height: 44, flexShrink: 0 }} />
                  <div>
                    <p style={{ ...hf, fontSize: 15.5 }}>{pk.name}</p>
                    <p style={{ fontSize: 10.5, fontWeight: 800, color: GRAY }}>{pk.by}AI</p>
                  </div>
                </div>
                <p style={{ marginTop: 14 }}>
                  <span style={{ ...hf, fontSize: 25 }}>月額 {pk.price}円</span>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: GRAY }}>／{pk.unit}（税別）</span>
                </p>
                <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, background: pk.popular ? "#fff" : SOFT, border: `1.5px solid ${HAIR}`, borderRadius: 8, padding: "8px 12px" }}>{pk.includes}</p>
                  <p style={{ fontSize: 12, fontWeight: 700, background: pk.popular ? "#fff" : SOFT, border: `1.5px solid ${HAIR}`, borderRadius: 8, padding: "8px 12px" }}>{pk.over}</p>
                </div>
              </div>
            ))}
            {/* 共通条件カード */}
            <div className="rv" style={{ background: "#fff", borderRadius: 16, padding: "24px 22px", textAlign: "left", border: `2px dashed ${BLACK}` }}>
              <p style={{ ...hf, fontSize: 14.5 }}>全パッケージ共通</p>
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8, fontSize: 12.5, fontWeight: 700, color: GRAY, lineHeight: 1.7 }}>
                <p>・初期設定費 80,000円〜</p>
                <p>・利用アカウント3名まで込み<br />　（追加 +1,500円／名・月）</p>
                <p>・契約縛りなし・いつでも解約OK</p>
                <p>・セットアップ・サポート込み</p>
                <p>・組み合わせ導入で月額10%オフ</p>
              </div>
            </div>
          </div>
          <p className="rv" style={{ fontSize: 12, fontWeight: 600, color: GRAY, textAlign: "center", marginTop: 22, lineHeight: 1.9 }}>
            パッケージに貴社仕様のカスタマイズを加える場合は、受託開発としてお見積もりします。IT導入補助金のご案内も無料相談で。
          </p>
        </div>
      </section>

      {/* ══ 18. FAQ ══ */}
      <section className="sec" style={{ padding: "100px 40px", background: SOFT, borderTop: `2px solid ${BLACK}` }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <Big en="FAQ" jp="ご心配ごとには、先にお答えします" />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {FAQS.map((f, i) => (
              <div key={f.q} className="rv" style={{ background: "#fff", border: `2px solid ${BLACK}`, borderRadius: 14, padding: "20px 24px", transitionDelay: `${i * 0.04}s` }}>
                <p style={{ ...hf, fontSize: 14.5 }}>
                  <span style={{ background: YELLOW, border: `2px solid ${BLACK}`, borderRadius: 6, padding: "1px 8px", fontSize: 12, marginRight: 10 }}>Q</span>
                  {f.q}
                </p>
                <p style={{ fontSize: 13, fontWeight: 500, color: GRAY, lineHeight: 2, marginTop: 8 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 19. 最終CTA ══ */}
      <section className="sec" style={{ padding: "100px 40px 90px", background: YELLOW, borderTop: `2px solid ${BLACK}`, textAlign: "center" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <img className="rv" src="/ailab/robo-team.webp" alt="" style={{ height: isMobile ? 90 : 130, margin: "0 auto 20px", display: "block" }} />
          <h2 className="rv" style={{ ...hf, fontSize: "clamp(28px, 3.6vw, 44px)", lineHeight: 1.6 }}>どの仕事から、<br />任せてみますか？</h2>
          <p className="rv" style={{ fontSize: 14.5, fontWeight: 600, lineHeight: 2.1, marginTop: 16 }}>
            初回のご相談は無料です。「自動化できる業務の診断リスト」をその場でお渡しします。<br />しつこい営業は、私たちの得意分野ではありません。
          </p>
          <div className="rv" style={{ marginTop: 38, display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <CTA big />
            <a href="/demo" className="cta-white">デモを体験する</a>
          </div>
          <p style={{ fontSize: 12, fontWeight: 700, marginTop: 40 }}>合同会社80 ｜ 愛知県名古屋市 ｜ ito.t@80grp.com ｜ 050-8896-5889</p>
        </div>
      </section>

      <style>{`
        @keyframes bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes bubbleIn { from { opacity: 0; transform: translateY(10px) scale(0.92); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes nudge { 0%,100% { transform: translateY(0); } 50% { transform: translateY(5px); } }
        @keyframes marqueeL { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes marqueeR { from { transform: translateX(-50%); } to { transform: translateX(0); } }

        .cta-main {
          display: inline-flex; align-items: center; gap: 10px;
          font-weight: 900; color: #fff; background: ${BLACK}; text-decoration: none;
          border: 2px solid ${BLACK}; border-radius: 100px;
          box-shadow: 4px 4px 0 ${YELLOW};
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .cta-main:hover { transform: translate(2px, 2px); box-shadow: 1px 1px 0 ${YELLOW}; }
        .cta-nav {
          font-size: 13px; font-weight: 900; color: #fff; text-decoration: none;
          background: ${BLACK}; padding: 10px 26px; border-radius: 100px; border: 2px solid ${BLACK};
          transition: background 0.2s, color 0.2s;
        }
        .cta-nav:hover { background: ${YELLOW}; color: ${BLACK}; }
        .cta-black {
          font-size: 14.5px; font-weight: 900; color: #fff; background: ${BLACK}; text-decoration: none;
          padding: 15px 38px; border-radius: 100px; flex-shrink: 0; border: 2px solid ${BLACK};
          transition: transform 0.2s;
        }
        .cta-black:hover { transform: scale(1.04); }
        .cta-yellow {
          display: inline-block; font-size: 13.5px; font-weight: 900; color: ${BLACK}; background: ${YELLOW};
          text-decoration: none; padding: 13px 32px; border-radius: 100px; border: 2px solid ${YELLOW};
          transition: transform 0.2s;
        }
        .cta-yellow:hover { transform: scale(1.04); }
        .cta-white {
          font-size: 14.5px; font-weight: 900; color: ${BLACK}; background: #fff; text-decoration: none;
          padding: 18px 38px; border-radius: 100px; border: 2px solid ${BLACK};
          transition: transform 0.2s;
        }
        .cta-white:hover { transform: translateY(-2px); }

        .card {
          background: #fff; border: 2px solid ${BLACK}; border-radius: 16px; padding: 16px 16px 20px;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .card:hover { transform: translateY(-5px); box-shadow: 6px 8px 0 ${YELLOW}; }
        .skill-card { transition: transform 0.4s cubic-bezier(0.34,1.2,0.64,1), box-shadow 0.4s, background 0.3s; }
        .skill-card:hover { transform: translateY(-4px); box-shadow: 4px 4px 0 ${YELLOW}; }
        .workcard { transition: transform 0.4s, box-shadow 0.4s; display: block; }
        .workcard:hover { transform: translateY(-5px); box-shadow: 6px 8px 0 ${YELLOW}; }

        @supports (animation-timeline: view()) {
          .rv { animation: rvIn 1ms linear both; animation-timeline: view(); animation-range: entry 5% entry 34%; }
        }
        @keyframes rvIn { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 700px) {
          .sec { padding-left: 18px !important; padding-right: 18px !important; padding-top: 56px !important; padding-bottom: 56px !important; }
          .grid3 { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 980px) {
          .hero-grid, .show-grid { grid-template-columns: 1fr !important; direction: ltr !important; }
          .pick-panel { flex-direction: column !important; text-align: center !important; }
          .works-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
