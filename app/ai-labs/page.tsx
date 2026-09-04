"use client";

import { useEffect, useRef, useState } from "react";
import { M_PLUS_Rounded_1c } from "next/font/google";
import LeadChat from "./LeadChat";

const rounded = M_PLUS_Rounded_1c({ subsets: ["latin"], weight: ["700", "800"] });

const NAVY = "#1e3a5f";
const BLUE = "#3b82d6";
const BLUE_DEEP = "#2563b8";
const MUTED = "#64798f";
const BG_ALT = "#f4f9fe";

// ===== キャラクター名鑑（全員に担当業務） =====
const TEAM = [
  { img: "/chars/prop-routine.png", name: "POST", role: "文章生成AI", line: "メールも書類も、ぼくが書きます。",
    intro: "文章づくりの担当だよ。メールの返信、見積書、SNSの投稿文まで、御社らしい言葉づかいで下書きします。よくある質問なら即答もできるよ。",
    skills: ["問い合わせの一次対応", "返信文の自動下書き", "見積書・書類の送付"] },
  { img: "/chars/drop.png", name: "DROP", role: "音声認識AI", line: "会議の一滴も、聞きのがしません。",
    intro: "音声認識の担当だよ。会議でも電話でも、人の話を聴きとって文字にするのが得意。決定事項とTODOの整理までやっておくね。",
    skills: ["議事録の自動作成", "TODOの整理と通知", "報告書・日報のまとめ"] },
  { img: "/chars/prop-phone.png", name: "TELL", role: "音声対話AI", line: "自然な声で、会話ができます。",
    intro: "音声で話す担当だよ。自然な声で電話に出て、用件を聞いて、予約ならカレンダーに登録。人と会話するAIの進化、体験してみて！",
    skills: ["電話の自動応対", "予約のカレンダー登録", "担当者への即時通知"] },
  { img: "/chars/prop-receipts.png", name: "DONA", role: "文字読み取りAI", line: "手書きもレシートも、読みとります。",
    intro: "文字の読み取り（OCR）担当だよ。レシートも手書きのFAXも、写真から文字を読みとってデータにします。仕訳して会計ソフトへの登録まで！",
    skills: ["領収書・請求書の読み取り", "勘定科目の自動仕訳", "会計ソフトへの登録"] },
  { img: "/chars/star.png", name: "STAR", role: "業務最適化AI", line: "むずかしいパズルほど、燃えるんだ。",
    intro: "最適化の担当だよ。たくさんの条件からいちばんいい答えを見つけるのが得意。シフト表も配送ルートも、パズルみたいに解いちゃう。",
    skills: ["シフト表の自動作成", "希望休・法令チェック", "人件費の最適化"] },
  { img: "/chars/prop-custom.png", name: "GEMBA", role: "画像認識AI", line: "写真1枚から、報告書がつくれるよ。",
    intro: "画像認識の担当だよ。現場の写真から状況を読みとって、日報や報告書にするのが得意。目で見る仕事は、ぼくにまかせて。",
    skills: ["現場写真→日報の自動作成", "FAX・手書き書類のデータ化", "工程・点検記録の管理"] },
  { img: "/chars/prop-grow.png", name: "NYOKI", role: "学習AI", line: "使うほど、御社の仕事を覚えます。",
    intro: "学習の担当だよ。使ってもらうほど、御社の言葉づかいや仕事のクセを覚えて賢くなります。AIチームを育てるのがぼくの役目。",
    skills: ["導入プランの設計", "効果測定と改善", "専任担当との伴走サポート"] },
  { img: "/chars/cloud.png", name: "COO", role: "会話AI", line: "心配ごとは、ふんわり聞かせてください。",
    intro: "対話の担当だよ。チャットで質問に答えたり、社内マニュアルを検索したり。このページのチャットも、ぼくの仲間が動かしてるよ。",
    skills: ["導入前の疑問にお答え", "セキュリティ方針のご説明", "無料相談の受付"] },
];

// ── チーム連携の3つのシーン（事務所図） ──
const FLOWS = [
  {
    title: "請求書が届いたら",
    icon: "📄",
    steps: [
      { img: "/chars/prop-routine.png", name: "POST", does: "メールで届いた請求書をキャッチ" },
      { img: "/chars/prop-receipts.png", name: "DONA", does: "読み取って仕訳、会計ソフトへ登録" },
      { img: "/chars/prop-chart.png", name: "EIGHT", does: "ダッシュボードの数字に反映" },
    ],
    result: "経理の入力作業はゼロ。数字はいつでも最新です。",
  },
  {
    title: "予約の電話が鳴ったら",
    icon: "📞",
    steps: [
      { img: "/chars/prop-phone.png", name: "TELL", does: "電話に出て、予約を受け付け" },
      { img: "/chars/star.png", name: "STAR", does: "空き状況を確認してカレンダーに登録" },
      { img: "/chars/prop-routine.png", name: "POST", does: "お客様へ確認の連絡を送信" },
    ],
    result: "手が離せなくても、予約は取りこぼしません。",
  },
  {
    title: "現場の1日が終わったら",
    icon: "📷",
    steps: [
      { img: "/chars/prop-custom.png", name: "GEMBA", does: "現場写真から日報を自動作成" },
      { img: "/chars/drop.png", name: "DROP", does: "週次の報告書にまとめる" },
      { img: "/chars/prop-chart.png", name: "EIGHT", does: "進捗をダッシュボードへ反映" },
    ],
    result: "事務所に戻ってからの報告作業がなくなります。",
  },
];

// ===== 6つのショーケース =====
const SHOWCASES = [
  {
    id: "mail", mock: "/mocks/agent.png", char: "/chars/prop-routine.png", cname: "POST", crole: "文章生成AI",
    say: "届いたメール、読んで下書きしておきました！",
    title: <>メールの返信が、<br />確認するだけになる。</>,
    body: "届いた問い合わせを読み、過去のやり取りや在庫を確認して、返信文までご用意。あなたは最後に「送信」を押すだけです。",
    points: ["受信内容を読み取り、要件を整理", "履歴・データを参照して回答を作成", "ワンクリックで送信完了"],
  },
  {
    id: "minutes", mock: "/mocks/minutes.png", char: "/chars/drop.png", cname: "DROP", crole: "音声認識AI",
    say: "会議おつかれさま！一滴ものがさずメモしたよ。",
    title: <>会議が終わった瞬間、<br />議事録も終わっている。</>,
    body: "録音するだけで、決定事項とTODOを整理して担当者へ通知まで。「議事録まとめといて」という仕事が消えます。",
    points: ["録音から議事録を自動生成", "決定事項・TODOを自動整理", "担当者へそのまま通知"],
  },
  {
    id: "phone", mock: "/mocks/phone.png", char: "/chars/prop-phone.png", cname: "TELL", crole: "音声対話AI",
    say: "さっきの予約のお電話、ぼくが承りました！",
    title: <>忙しい時間の電話に、<br />AIが出てくれる。</>,
    body: "用件を聞いて、予約ならカレンダーに登録、確認の連絡まで自動で完了。仕込み中も接客中も、電話で手が止まりません。",
    points: ["自然な会話で用件をヒアリング", "予約をカレンダーへ自動登録", "担当者のLINEへ即通知"],
  },
  {
    id: "keihi", mock: "/mocks/keihi.png", char: "/chars/prop-receipts.png", cname: "DONA", crole: "文字読み取りAI",
    say: "領収書142枚、ぜんぶ仕訳しておきました！",
    title: <>領収書は、<br />撮るだけでいい。</>,
    body: "スマホで撮影するだけで、読み取り・勘定科目の仕訳・会計ソフトへの登録まで自動化。月末の憂鬱がなくなります。",
    points: ["写真から日付・金額・摘要を読み取り", "勘定科目をAIが自動で仕訳", "freee・マネーフォワードへ自動登録"],
  },
  {
    id: "shift", mock: "/mocks/shift.png", char: "/chars/star.png", cname: "STAR", crole: "業務最適化AI",
    say: "来月のシフト、星ぞろいにしといたよ！",
    title: <>来月のシフトが、<br />3分で組み上がる。</>,
    body: "スタッフの希望・労働時間のルール・人件費の予算を全部ふまえて、AIがシフト表を自動作成。毎月の頭痛が消えます。",
    points: ["希望休を全員分反映", "労働時間・法令を自動チェック", "人件費も予算内に最適化"],
  },
  {
    id: "numbers", mock: "/mocks/dashboard.png", char: "/chars/prop-chart.png", cname: "EIGHT", crole: "データ分析AI",
    say: "今朝の数字、そろえておきました！",
    title: <>「今どうなってる？」に、<br />即答できる会社になる。</>,
    body: "GoogleマップやLINE、会計ソフトなど、普段お使いのサービスとAPIで直接つながり、数字を毎日自動で取得。バラバラだったデータが、ひと目でわかる画面にそろいます。",
    points: ["Google・LINE・会計ソフト等とAPI連携", "散らばった数字を毎日自動で収集", "AIが「次の一手」まで提案"],
  },
];

const CAPABILITIES = [
  "見積書・書類ドラフト", "SNS投稿・口コミ返信", "社内FAQ・マニュアル検索", "製造管理",
  "FAX・手書き書類のデータ化", "現場写真→日報", "営業支援", "採用・人事サポート",
  "紙の山→データベース化", "毎朝の自動巡回レポート", "24時間働く営業アシスタント", "在庫の見える化",
  "顧客対応の記録・引き継ぎ", "補助金情報のウォッチ", "予約サイトの構築", "ホームページ制作",
];

const WORKS = [
  { tag: "飲食店（愛知県）", title: "集客×売上ダッシュボード", desc: "Googleマップの数字と売上を毎日自動集計。口コミ返信もAIが支援。", img: "/mocks/dashboard.png" },
  { tag: "地域団体", title: "コミュニティアプリ", desc: "写真を選ぶだけでAIが会報を自動レイアウト。見守り機能も。", img: "/mocks/community.png" },
  { tag: "自社サービス", title: "組織分析AI「LENDS AI」", desc: "アンケートから組織の状態を診断し、改善レポートを自動生成。", img: "/mocks/lends.png", href: "https://www.lens-ai.jp" },
  { tag: "自社ツール", title: "経費の自動読み取り", desc: "領収書をスキャンするだけで一覧データ化。自社でも毎日使っています。", img: "/mocks/keihi.png" },
];

const PLANS = [
  { label: "Plan A", name: "受注開発", desc: "御社専用にゼロから構築する開発型プラン", popular: false },
  { label: "Plan B", name: "月額サブスク", desc: "初期費用を抑えて、月額ですぐ始めるプラン", popular: true },
  { label: "Plan C", name: "買取予定サブスク", desc: "月額で始めて、将来は自社資産にできるプラン", popular: false },
];

const FAQS = [
  { q: "ITに詳しい社員がいなくても大丈夫？", a: "大丈夫です。使い方の説明から日々の運用まで、専任担当が伴走します。" },
  { q: "情報漏えいが心配です", a: "データの取り扱いルールを事前に取り決めます。入力内容をAIに学習させない構成も可能です。" },
  { q: "今使っているシステムはそのまま使える？", a: "使えます。既存のExcel・会計ソフト・基幹システムに合わせて開発します。" },
  { q: "途中でやめられますか？", a: "月額プランは解約自由です。小さく試してから、続けるかご判断ください。" },
];

const LINEUP = [
  ["/chars/star.png", 84], ["/chars/drop.png", 106], ["/chars/capsule.png", 122],
  ["/chars/longlegs.png", 156], ["/chars/ball.png", 138], ["/chars/cyclops.png", 126],
  ["/chars/capsule2.png", 116], ["/chars/cloud.png", 102], ["/chars/donut.png", 110],
] as const;

// ガイド（エイト）のセリフ：セクションindex → セリフ
const GUIDE_LINES: Record<number, string> = {
  0: "こんにちは！ぼくはEIGHT。案内するね！",
  1: "こういうの、身に覚えありませんか…？",
  2: "気になる子、タップしてみて！",
  3: "ぼくら、連係プレーが得意なんだ！",
  4: "POSTは文章を書くのが得意なんだ！",
  5: "DROPは音を聴きとる名人だよ。",
  6: "TELLは声でおしゃべりできるんだ。",
  7: "DONAはどんな文字でも読めるんだ。",
  8: "STARは最適化のパズル名人！",
  9: "ぼくの得意分野！データの見える化！",
  10: "APIでつながるほど、賢くなるよ。",
  11: "GEMBAは写真を見て理解するよ！",
  12: "導入したら、こんな毎日になります。",
  13: "実際につくったものも見てって！",
  14: "自分たちのサービスも育ててます。",
  15: "NYOKIは使うほど賢くなるんだ。",
  16: "お金の話も、ちゃんとします。",
  17: "プランは3つ。あとから変えられるよ。",
  18: "COOはおしゃべりが上手なんだ。",
  19: "最後まで見てくれてありがとう！",
};

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

export default function StoryPage() {
  const [active, setActive] = useState(0);
  const [walking, setWalking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [flat, setFlat] = useState(false); // ?flat=1: スクショ検証用（100vh無効化）
  const [picked, setPicked] = useState<number | null>(null); // 名鑑でタップされたキャラ
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const c = () => setIsMobile(window.innerWidth < 700);
    c();
    window.addEventListener("resize", c);
    return () => window.removeEventListener("resize", c);
  }, []);
  useEffect(() => { setFlat(new URLSearchParams(window.location.search).has("flat")); }, []);
  const walkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const els = document.querySelectorAll("[data-scene]");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.scene));
      });
    }, { threshold: 0.25 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setWalking(true);
      if (walkTimer.current) clearTimeout(walkTimer.current);
      walkTimer.current = setTimeout(() => setWalking(false), 180);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hf: React.CSSProperties = { fontFamily: rounded.style.fontFamily, fontWeight: 800 };
  let sceneIdx = -1;
  const scene = () => { sceneIdx += 1; return sceneIdx; };

  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.28em", color: BLUE, marginBottom: 16, textTransform: "uppercase" }}>{children}</p>
  );

  const CTA = ({ big = false }: { big?: boolean }) => (
    <a href="/contact" className="cta" style={{
      ...hf, fontSize: big ? 16 : 14, color: "#fff", background: BLUE, textDecoration: "none",
      padding: big ? "18px 46px" : "14px 34px", borderRadius: 100, display: "inline-flex", alignItems: "center", gap: 10,
      boxShadow: "0 10px 28px rgba(59,130,214,0.32)",
    }}>
      無料相談してみる
      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
    </a>
  );

  return (
    <div style={{ background: "#fff", color: NAVY, fontFamily: "inherit", overflowX: "hidden" }}>
      {/* 進行バー */}
      <div style={{ position: "fixed", top: 0, left: 0, height: 3, width: `${progress * 100}%`, background: BLUE, zIndex: 200, transition: "width 0.1s" }} />

      {/* ナビ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px", height: 62, borderBottom: "1px solid #eef3f9",
      }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src="/logo-mark.png" alt="" style={{ height: 42 }} />
          <span style={{ ...hf, fontSize: 13.5, color: NAVY }}>AI Labs ─ 合同会社80</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <a href="/demo" style={{ fontSize: 13, fontWeight: 700, color: MUTED, textDecoration: "none" }}>デモ</a>
          <a href="/contact" className="cta" style={{
            fontSize: 13, fontWeight: 800, color: "#fff", textDecoration: "none",
            background: BLUE, padding: "10px 26px", borderRadius: 100,
          }}>無料相談</a>
        </div>
      </nav>

      {/* ══ 1. ヒーロー ══ */}
      <section data-scene={scene()} className="sec" style={{ minHeight: flat ? undefined : "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: isMobile ? "84px 18px 28px" : "110px 40px 40px", position: "relative", background: "linear-gradient(180deg,#fff 0%,#f4f9fe 100%)" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.5, pointerEvents: "none", backgroundImage: "radial-gradient(circle,#dcebfa 1.5px,transparent 1.5px)", backgroundSize: "34px 34px" }} />
        <div style={{ maxWidth: 1120, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 64, alignItems: "center", position: "relative" }} className="hero-grid">
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 800, color: BLUE, background: "#fff", border: "1.5px solid #d8e8fa", borderRadius: 100, padding: "7px 18px", marginBottom: 26, boxShadow: "0 2px 12px rgba(59,130,214,0.08)" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#39c26d" }} />
              中小企業のためのAIエージェント開発
            </div>
            <h1 style={{ ...hf, fontSize: "clamp(34px, 3.8vw, 52px)", lineHeight: 1.45, letterSpacing: "0.01em" }}>
              <span style={{ color: BLUE }}>御社専用</span>の、<br />
              AIエージェント。
            </h1>
            {!isMobile && (
              <p style={{ fontSize: 15, lineHeight: 2.1, color: MUTED, marginTop: 22, maxWidth: 440 }}>
                メール、電話、経理、シフト表。毎日の「めんどうな仕事」を、御社の業務に合わせて育てたAIのチームが、受けわたしながら最後まで実行します。
              </p>
            )}
            {!isMobile && (
              <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 30 }}>
                <CTA />
                <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.7 }}>診断リスト進呈 ｜ 月数万円台〜<br />2〜4週間で導入</p>
              </div>
            )}
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: -34, right: 8, zIndex: 2, background: "#fff", border: "1.5px solid #e3edf7", borderRadius: 16, padding: "10px 16px", boxShadow: "0 8px 24px rgba(30,58,95,0.1)", animation: "bob 3.6s ease-in-out infinite" }}>
              <p style={{ ...hf, fontSize: 12.5, color: NAVY }}>💬 グチみたいな一言でOKです</p>
            </div>
            <LeadChat headFont={hf}
              greeting={"こんにちは！ぼくはAIエージェントのエイトです🤖\nお仕事、なにが一番めんどうですか？\n「請求書の入力がつらい」「電話が多すぎる」——そんなグチみたいな一言で大丈夫です。どう自動化できるか、その場でお答えします！"}
              placeholder="例：毎日おなじ入力作業ばっかりで…" />
          </div>
        </div>
        {isMobile && (
          <div style={{ textAlign: "center", marginTop: 22 }}>
            <CTA />
          </div>
        )}
        <p style={{ textAlign: "center", fontSize: 12, color: MUTED, marginTop: isMobile ? 20 : 46, position: "relative" }}>
          <span style={{ display: "inline-block", animation: "nudge 1.6s ease-in-out infinite" }}>▼</span>　スクロールして、エイトについていく
        </p>
      </section>

      {/* ══ 2. お悩み ══ */}
      <section data-scene={scene()} className="sec" style={{ padding: "110px 40px", background: "#fff" }}>
        <div style={{ maxWidth: 1020, margin: "0 auto", textAlign: "center" }}>
          <div className="rv"><SectionLabel>Problem</SectionLabel>
          <h2 style={{ ...hf, fontSize: "clamp(26px, 3.2vw, 38px)", lineHeight: 1.6 }}>こんな毎日に、<br />心当たりはありませんか？</h2></div>
          <div style={{ display: "flex", justifyContent: "center", gap: 44, marginTop: 56, flexWrap: "wrap" }}>
            {[
              { img: "/photos/pain-paperwork.jpg", t: "入力と転記だけで、\n1日が終わる…" },
              { img: "/photos/pain-phone.jpg", t: "電話のたびに、\n仕事の手が止まる…" },
              { img: "/photos/pain-latenight.jpg", t: "気づけばまた、\n夜まで書類づくり…" },
            ].map((p, i) => (
              <div key={i} className="rv" style={{ width: 250 }}>
                <div style={{ position: "relative", background: BG_ALT, borderRadius: 18, padding: "14px 16px", marginBottom: 24 }}>
                  <p style={{ ...hf, fontSize: 14, lineHeight: 1.8, whiteSpace: "pre-line" }}>{p.t}</p>
                  <span style={{ position: "absolute", left: "50%", bottom: -8, transform: "translateX(-50%) rotate(45deg)", width: 14, height: 14, background: BG_ALT }} />
                </div>
                <img src={p.img} alt="" style={{ width: 188, height: 188, borderRadius: "50%", objectFit: "cover", border: "6px solid #fff", boxShadow: "0 16px 36px rgba(30,58,95,0.16)" }} />
              </div>
            ))}
          </div>
          <p className="rv" style={{ ...hf, fontSize: "clamp(20px, 2.6vw, 28px)", marginTop: 64, lineHeight: 1.7 }}>
            その仕事、ぜんぶ<span style={{ color: BLUE }}>ぼくらの得意分野</span>です。
          </p>
        </div>
      </section>

      {/* ══ 3. チーム紹介 ══ */}
      <section data-scene={scene()} className="sec" style={{ padding: "110px 40px", background: BG_ALT }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", textAlign: "center" }}>
          <div className="rv"><SectionLabel>Team</SectionLabel>
          <h2 style={{ ...hf, fontSize: "clamp(26px, 3.2vw, 38px)", lineHeight: 1.6 }}>担当をご紹介します。</h2>
          <p style={{ fontSize: 14, color: MUTED, marginTop: 14, lineHeight: 2 }}>それぞれ得意な仕事があります。気になる子をタップすると、自己紹介してくれます。</p></div>
          {/* 横一列のコンパクト名鑑（タップで下のパネルに詳細） */}
          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 44, flexWrap: "wrap" }} className="team-row">
            {TEAM.map((c, i) => (
              <button key={c.name} onClick={() => setPicked(picked === i ? null : i)} className="rv chara-card" style={{
                background: "#fff", borderRadius: 18, padding: "16px 8px 12px", width: 118,
                border: picked === i ? `2.5px solid ${BLUE}` : "1.5px solid #e8f0f9",
                boxShadow: picked === i ? "0 14px 34px rgba(59,130,214,0.18)" : undefined,
                transform: picked === i ? "translateY(-6px)" : undefined,
                transitionDelay: `${i * 0.03}s`, cursor: "pointer", fontFamily: "inherit", textAlign: "center",
              }}>
                <div className="chara" style={{ height: 92, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                  <img src={c.img} alt={c.name} style={{ maxHeight: 90, maxWidth: "86%" }} />
                </div>
                <p style={{ ...hf, fontSize: 13, marginTop: 8, color: NAVY }}>{c.name}</p>
                <p style={{ fontSize: 10, fontWeight: 800, color: BLUE, background: "#ecf4fd", borderRadius: 100, padding: "3px 10px", display: "inline-block", marginTop: 4 }}>{c.role}</p>
              </button>
            ))}
          </div>

          {/* タップで自己紹介パネル（初期はPOST） */}
          {(() => { const sel = picked ?? 0; return (
            <div key={sel} style={{
              marginTop: 24, background: "#fff", borderRadius: 24, border: `2px solid ${BLUE}30`,
              padding: "26px 34px", display: "flex", alignItems: "center", gap: 34, textAlign: "left",
              boxShadow: "0 18px 44px rgba(30,58,95,0.1)", animation: "bubbleIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both",
            }} className="pick-panel">
              <div className="chara" style={{ flexShrink: 0 }}>
                <img src={TEAM[sel].img} alt="" style={{ height: 180, animation: "bob 3.2s ease-in-out infinite" }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ ...hf, fontSize: 19, color: NAVY }}>
                  {TEAM[sel].name}
                  <span style={{ fontSize: 12, fontWeight: 800, color: BLUE, background: "#ecf4fd", borderRadius: 100, padding: "4px 14px", marginLeft: 12, verticalAlign: "middle" }}>{TEAM[sel].role}</span>
                </p>
                <div style={{ position: "relative", background: BG_ALT, borderRadius: 16, padding: "16px 20px", marginTop: 14 }}>
                  <p style={{ fontSize: 13.5, lineHeight: 2, color: NAVY, fontWeight: 700 }}>「{TEAM[sel].intro}」</p>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                  {TEAM[sel].skills.map((sk) => (
                    <span key={sk} style={{ fontSize: 12, fontWeight: 800, color: BLUE_DEEP, background: "#ecf4fd", borderRadius: 100, padding: "7px 16px" }}>✓ {sk}</span>
                  ))}
                </div>
              </div>
            </div>
          ); })()}
        </div>
      </section>

      {/* ══ 3b. チーム連携（事務所図×3） ══ */}
      <section data-scene={scene()} className="sec" style={{ padding: "110px 40px", background: "#fff" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div className="rv" style={{ textAlign: "center" }}><SectionLabel>Teamwork</SectionLabel>
          <h2 style={{ ...hf, fontSize: "clamp(26px, 3.2vw, 38px)", lineHeight: 1.6 }}>御社専用のAIエージェントは、<br /><span style={{ color: BLUE }}>チームで働く。</span></h2>
          <p style={{ fontSize: 14, color: MUTED, marginTop: 14, lineHeight: 2 }}>ひとつの仕事を、担当者どうしが受けわたして、最後まで完了させます。<br />たとえば、こんなふうに。</p></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 26, marginTop: 50 }}>
            {FLOWS.map((f, fi) => (
              <div key={f.title} className="rv" style={{ background: BG_ALT, borderRadius: 26, padding: isMobile ? "22px 16px 18px" : "34px 40px 30px", transitionDelay: `${fi * 0.06}s` }}>
                <p style={{ ...hf, fontSize: 17, color: NAVY, textAlign: "center" }}>{f.icon} {f.title}</p>
                {!isMobile ? (
                <div style={{ display: "flex", alignItems: "stretch", justifyContent: "center", gap: 0, marginTop: 26 }} className="flow-row">
                  {f.steps.map((st, si) => (
                    <div key={st.name} style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ width: 214, textAlign: "center" }}>
                        <div className="chara" style={{ height: 118, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                          <img src={st.img} alt={st.name} style={{ maxHeight: 114, animation: `bob 3.4s ease-in-out ${si * 0.5}s infinite` }} />
                        </div>
                        <p style={{ ...hf, fontSize: 13.5, color: NAVY, marginTop: 10 }}>{st.name}</p>
                        <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.8, marginTop: 5 }}>{st.does}</p>
                      </div>
                      {si < f.steps.length - 1 && (
                        <div style={{ width: 84, position: "relative", height: 3, background: "repeating-linear-gradient(90deg, #b9d4f2 0 8px, transparent 8px 16px)", borderRadius: 2, margin: "0 4px", marginBottom: 58, flexShrink: 0 }}>
                          <span style={{ position: "absolute", top: -15, left: 0, fontSize: 17, animation: `flowMove 2.4s ease-in-out ${fi * 0.5}s infinite` }}>{f.icon}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                ) : (
                <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 6 }}>
                  {f.steps.map((st, si) => (
                    <div key={st.name}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", borderRadius: 14, padding: "10px 14px" }}>
                        <img src={st.img} alt={st.name} style={{ height: 56, flexShrink: 0 }} />
                        <div>
                          <p style={{ ...hf, fontSize: 12.5, color: NAVY }}>{st.name}</p>
                          <p style={{ fontSize: 11.5, color: MUTED, lineHeight: 1.6 }}>{st.does}</p>
                        </div>
                      </div>
                      {si < f.steps.length - 1 && <p style={{ textAlign: "center", fontSize: 14, color: BLUE, margin: "2px 0" }}>↓ {f.icon}</p>}
                    </div>
                  ))}
                </div>
                )}
                <p style={{ ...hf, fontSize: 13.5, color: BLUE_DEEP, textAlign: "center", marginTop: 18, background: "#fff", borderRadius: 100, padding: "10px 24px", display: "table", marginLeft: "auto", marginRight: "auto" }}>→ {f.result}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 4-9. ショーケース ══ */}
      {SHOWCASES.map((s, i) => (
        <section key={s.id} data-scene={scene()} style={{ padding: "100px 40px 150px", background: i % 2 === 0 ? "#fff" : BG_ALT }}>
          <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 60, alignItems: "center", direction: i % 2 === 1 ? "rtl" : "ltr" }} className="show-grid">
            <div className="rv" style={{ direction: "ltr", position: "relative" }}>
              <img src={s.mock} alt="" style={{ width: "100%", filter: "drop-shadow(0 22px 48px rgba(30,58,95,0.16))" }} />
              {!isMobile ? (
                <div style={{ position: "absolute", right: i % 2 === 1 ? "auto" : -14, left: i % 2 === 1 ? -14 : "auto", bottom: -58, textAlign: "center", zIndex: 2 }}>
                  <div style={{ position: "relative", marginBottom: 10, background: "#fff", border: "1.5px solid #e3edf7", borderRadius: 14, padding: "9px 14px", boxShadow: "0 8px 22px rgba(30,58,95,0.12)", maxWidth: 210 }}>
                    <p style={{ ...hf, fontSize: 11.5, lineHeight: 1.6 }}>{s.say}</p>
                    <span style={{ position: "absolute", left: "50%", bottom: -7, transform: "translateX(-50%) rotate(45deg)", width: 12, height: 12, background: "#fff", borderRight: "1.5px solid #e3edf7", borderBottom: "1.5px solid #e3edf7" }} />
                  </div>
                  <div className="chara" style={{ display: "inline-block" }}>
                    <img src={s.char} alt={s.cname} style={{ height: 142, animation: `bob 3.4s ease-in-out ${i * 0.4}s infinite` }} />
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
                  <img src={s.char} alt={s.cname} style={{ height: 74, flexShrink: 0 }} />
                  <div style={{ position: "relative", background: "#fff", border: "1.5px solid #e3edf7", borderRadius: 12, padding: "8px 12px", boxShadow: "0 6px 16px rgba(30,58,95,0.1)" }}>
                    <p style={{ ...hf, fontSize: 11.5, lineHeight: 1.6 }}>{s.say}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="rv" style={{ direction: "ltr" }}>
              <p style={{ fontSize: 11.5, fontWeight: 800, color: BLUE, background: "#ecf4fd", borderRadius: 100, padding: "5px 16px", display: "inline-block" }}>担当：{s.cname}（{s.crole}）</p>
              <h2 style={{ ...hf, fontSize: "clamp(24px, 2.8vw, 33px)", lineHeight: 1.55, marginTop: 16 }}>{s.title}</h2>
              <p style={{ fontSize: 14, lineHeight: 2.1, color: MUTED, marginTop: 16 }}>{s.body}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
                {s.points.map((pt) => (
                  <div key={pt} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, fontWeight: 700 }}>
                    <span style={{ width: 21, height: 21, borderRadius: "50%", background: BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    </span>
                    {pt}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ══ 10. もっとできる（マーキー） ══ */}
      <section data-scene={scene()} className="sec" style={{ padding: "100px 0 90px", background: "#fff", overflow: "hidden" }}>
        <div style={{ maxWidth: 1020, margin: "0 auto", textAlign: "center", padding: "0 40px" }}>
          <div className="rv"><SectionLabel>And more</SectionLabel>
          <h2 style={{ ...hf, fontSize: "clamp(26px, 3.2vw, 38px)", lineHeight: 1.6 }}>「うちのあの仕事も？」<br />──たぶん、できます。</h2>
          <p style={{ fontSize: 14, color: MUTED, marginTop: 14, lineHeight: 2 }}>ここに載っていない業務も、まずは聞かせてください。<br />「それ、自動化できます」とお答えできるケースがほとんどです。</p></div>
        </div>
        <div style={{ marginTop: 44, display: "flex", flexDirection: "column", gap: 14 }}>
          {[0, 1].map((row) => (
            <div key={row} style={{ display: "flex", gap: 12, width: "max-content", animation: `${row === 0 ? "marqueeL" : "marqueeR"} 46s linear infinite` }}>
              {[...CAPABILITIES, ...CAPABILITIES].map((c, j) => (
                <span key={j} style={{ fontSize: 13, fontWeight: 700, color: NAVY, background: BG_ALT, border: "1.5px solid #e3edf7", borderRadius: 100, padding: "11px 22px", whiteSpace: "nowrap" }}>{c}</span>
              ))}
            </div>
          ))}
        </div>
        {/* API連携（中央ハブから散らばるロゴ） */}
        <div className="rv" style={{ maxWidth: 900, margin: "70px auto 0", padding: "0 40px", textAlign: "center" }}>
          <h3 style={{ ...hf, fontSize: "clamp(19px, 2.2vw, 25px)", lineHeight: 1.6 }}>
            つながるほど、<span style={{ color: BLUE }}>賢くなる。</span>
          </h3>
          <p style={{ fontSize: 13.5, color: MUTED, lineHeight: 2, marginTop: 10 }}>
            普段お使いのサービスとAPIで直接つながり、データを自動で取得します。
          </p>
          {!isMobile ? (
          <div style={{ position: "relative", height: 440, maxWidth: 780, margin: "6px auto 0" }}>
            {/* 中心：EIGHT */}
            <div style={{ position: "absolute", left: "50%", top: 218, transform: "translate(-50%,-50%)", zIndex: 2 }}>
              <div className="chara"><img src="/chars/ball.png" alt="" style={{ height: 132, animation: "bob 3.2s ease-in-out infinite" }} /></div>
            </div>
            {/* 散らばるロゴ（大きさ＝連携の定番度） */}
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
                boxShadow: "0 8px 22px rgba(30,58,95,0.13)", display: "flex", alignItems: "center", justifyContent: "center",
                animation: `bob 3.8s ease-in-out ${d} infinite`,
              }}>
                <img src={`/logos/${logo}.png`} alt={logo} style={{ width: size * 0.56, height: size * 0.56, borderRadius: 6 }} />
              </div>
            ))}
          </div>
          ) : (
            <div style={{ marginTop: 18 }}>
              <div style={{ textAlign: "center", marginBottom: 14 }}>
                <img src="/chars/ball.png" alt="" style={{ height: 84, animation: "bob 3.2s ease-in-out infinite" }} />
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
                {["line","gmaps","gcal","freee","mf","excel","instagram","youtube","slack","salesforce","chatwork","kintone","zoom","notion","smaregi","shopify","stripe","dropbox","airregi","x"].map((logo) => (
                  <span key={logo} style={{ width: 44, height: 44, borderRadius: "50%", background: "#fff", boxShadow: "0 4px 14px rgba(30,58,95,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img src={`/logos/${logo}.png`} alt="" style={{ width: 24, height: 24, borderRadius: 5 }} />
                  </span>
                ))}
              </div>
            </div>
          )}
          <p style={{ fontSize: 11.5, color: MUTED, marginTop: 8 }}>ほかにも、POSレジ・基幹システム・各種SaaSなど<br />※ ご利用中のシステムに合わせて接続方法をご提案します</p>
        </div>
      </section>

      {/* ══ 11. 業種別 ══ */}
      <section data-scene={scene()} className="sec" style={{ padding: "100px 40px", background: BG_ALT }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 60, alignItems: "center" }} className="show-grid">
          <div className="rv">
            <SectionLabel>Industries</SectionLabel>
            <h2 style={{ ...hf, fontSize: "clamp(24px, 2.8vw, 33px)", lineHeight: 1.55 }}>現場のある仕事にこそ、<br />効きます。</h2>
            <p style={{ fontSize: 14, lineHeight: 2.1, color: MUTED, marginTop: 16 }}>製造、建設、物流、飲食、サービス業。紙とExcelと電話で回っている現場ほど、AIエージェントの効果は大きくなります。</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 20 }}>
              {["製造業", "建設業", "物流・倉庫", "飲食・小売", "サービス業"].map((u) => (
                <span key={u} style={{ fontSize: 12.5, fontWeight: 800, color: BLUE_DEEP, background: "#fff", border: "1.5px solid #d8e8fa", borderRadius: 100, padding: "8px 18px" }}>{u}</span>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 28 }}>
              <div className="chara"><img src="/chars/prop-custom.png" alt="GEMBA" style={{ height: 128 }} /></div>
              <div style={{ position: "relative", background: "#fff", border: "1.5px solid #e3edf7", borderRadius: 14, padding: "10px 15px" }}>
                <p style={{ ...hf, fontSize: 12 }}>画像認識AIのGEMBAです。<br />写真から日報、つくります！</p>
              </div>
            </div>
          </div>
          <div className="rv" style={{ display: "flex", gap: 16 }}>
            <img src="/photos/industry-factory.jpg" alt="" style={{ width: isMobile ? "100%" : "50%", borderRadius: 20, objectFit: "cover", aspectRatio: isMobile ? "16/10" : "3/4", boxShadow: "0 18px 40px rgba(30,58,95,0.14)", marginTop: isMobile ? 0 : 30 }} />
            {!isMobile && <img src="/photos/industry-restaurant.jpg" alt="" style={{ width: "50%", borderRadius: 20, objectFit: "cover", aspectRatio: "3/4", boxShadow: "0 18px 40px rgba(30,58,95,0.14)" }} />}
          </div>
        </div>
      </section>

      {/* ══ 12. Before/After ══ */}
      <section data-scene={scene()} className="sec" style={{ padding: "100px 40px", background: "#fff" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div className="rv" style={{ textAlign: "center" }}><SectionLabel>After</SectionLabel>
          <h2 style={{ ...hf, fontSize: "clamp(26px, 3.2vw, 38px)", lineHeight: 1.6 }}>「また入力作業か…」が、<br />なくなる。</h2></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 50, alignItems: "center", marginTop: 50 }} className="show-grid">
            <img className="rv" src="/photos/after-relaxed.jpg" alt="" style={{ width: "100%", borderRadius: 22, boxShadow: "0 18px 44px rgba(30,58,95,0.14)" }} />
            <div className="rv">
              <p style={{ fontSize: 14.5, lineHeight: 2.2, color: MUTED }}>
                空いた時間は、お客様との会話に。新しい商品づくりに。本当にやりたかった仕事に使ってください。それがAIエージェント導入のいちばんの効果です。
              </p>
              <div style={{ display: "flex", gap: 16, marginTop: 30 }}>
                {[
                  { n: 80, s: "%", l: "作業時間を削減（最大）" },
                  { n: 4, s: "週間", l: "で導入スタート（2〜）" },
                  { n: 10, s: "時間〜", l: "毎月の直接サポート" },
                ].map((k) => (
                  <div key={k.l} style={{ flex: 1, background: BG_ALT, borderRadius: 18, padding: "20px 14px", textAlign: "center" }}>
                    <p style={{ ...hf, fontSize: 28, color: BLUE }}><Counter to={k.n} suffix={k.s} /></p>
                    <p style={{ fontSize: 10.5, fontWeight: 700, color: MUTED, marginTop: 5, lineHeight: 1.6 }}>{k.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 中間CTA ══ */}
      <section style={{ padding: "56px 40px", background: "linear-gradient(90deg,#3b82d6,#2c66c4)" }}>
        <div style={{ maxWidth: 940, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 30, flexWrap: "wrap" }}>
          <p style={{ ...hf, fontSize: 19, color: "#fff", lineHeight: 1.7 }}>「うちの業務でもできる？」——まずは聞いてみてください。</p>
          <a href="/contact" className="cta" style={{ ...hf, fontSize: 14.5, color: BLUE_DEEP, background: "#fff", textDecoration: "none", padding: "15px 38px", borderRadius: 100, boxShadow: "0 10px 26px rgba(10,40,90,0.3)", flexShrink: 0 }}>無料相談してみる →</a>
        </div>
      </section>

      {/* ══ 13. 実績 ══ */}
      <section data-scene={scene()} className="sec" style={{ padding: "100px 40px", background: BG_ALT }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", textAlign: "center" }}>
          <div className="rv"><SectionLabel>Works</SectionLabel>
          <h2 style={{ ...hf, fontSize: "clamp(26px, 3.2vw, 38px)", lineHeight: 1.6 }}>つくってきたもの。</h2>
          <p style={{ fontSize: 14, color: MUTED, marginTop: 12 }}>企画からデザイン・開発・運用まで、すべて自社で行っています。</p></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 22, marginTop: 48, textAlign: "left" }} className="works-grid">
            {WORKS.map((w, i) => {
              const card = (
                <div className="rv workcard" style={{ background: "#fff", borderRadius: 22, border: "1.5px solid #e8f0f9", overflow: "hidden", height: "100%", transitionDelay: `${i * 0.05}s` }}>
                  <div style={{ height: 210, background: "linear-gradient(160deg,#eef6ff,#fafcff)", display: "flex", alignItems: "center", justifyContent: "center", padding: 18 }}>
                    <img src={w.img} alt="" style={{ maxHeight: 190, maxWidth: "94%", filter: "drop-shadow(0 10px 24px rgba(30,58,95,0.12))" }} />
                  </div>
                  <div style={{ padding: "20px 24px 24px" }}>
                    <p style={{ fontSize: 11, fontWeight: 800, color: BLUE }}>{w.tag}</p>
                    <p style={{ ...hf, fontSize: 17, marginTop: 5, color: NAVY }}>{w.title}</p>
                    <p style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.9, marginTop: 7 }}>{w.desc}</p>
                  </div>
                </div>
              );
              return w.href ? <a key={w.title} href={w.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>{card}</a> : <div key={w.title}>{card}</div>;
            })}
          </div>
        </div>
      </section>

      {/* ══ 14. 自社サービス ══ */}
      <section data-scene={scene()} className="sec" style={{ padding: "100px 40px", background: "#fff" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 60, alignItems: "center" }} className="show-grid">
          <img className="rv" src="/photos/hero-owner.jpg" alt="" style={{ width: "100%", borderRadius: 22, boxShadow: "0 18px 44px rgba(30,58,95,0.14)" }} />
          <div className="rv">
            <SectionLabel>Our products</SectionLabel>
            <h2 style={{ ...hf, fontSize: "clamp(24px, 2.8vw, 33px)", lineHeight: 1.55 }}>頼まれたものだけを<br />作る会社ではありません。</h2>
            <p style={{ fontSize: 14, lineHeight: 2.1, color: MUTED, marginTop: 16 }}>
              組織分析AI「LENDS AI」をはじめ、自社サービスの開発・運営も続けています。自分たちで作って、自分たちで毎日使って、自分たちで育てている。だから「現場で本当に使えるもの」の作り方を知っています。
            </p>
            <a href="https://www.lens-ai.jp" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 800, color: BLUE, textDecoration: "none", marginTop: 18 }}>
              LENDS AI を見てみる
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.6}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </a>
          </div>
        </div>
      </section>

      {/* ══ 15. 進め方 ══ */}
      <section data-scene={scene()} className="sec" style={{ padding: "100px 40px", background: BG_ALT }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 60, alignItems: "center" }} className="show-grid">
          <div className="rv">
            <SectionLabel>Process</SectionLabel>
            <h2 style={{ ...hf, fontSize: "clamp(24px, 2.8vw, 33px)", lineHeight: 1.55 }}>小さく始めて、<br />大きく育てる。</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 26 }}>
              {[
                ["01", "無料相談", "業務内容を伺い、「自動化できる業務の診断リスト」をその場でお渡しします"],
                ["02", "小さく試す", "効果が出やすい業務ひとつから、2〜4週間で開発してお試しいただきます"],
                ["03", "広げる", "効果を確認しながら、自動化の範囲を少しずつ広げていきます"],
              ].map(([n, t, b]) => (
                <div key={n} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "#fff", borderRadius: 18, padding: "18px 22px", border: "1.5px solid #e8f0f9" }}>
                  <span style={{ ...hf, width: 42, height: 42, borderRadius: "50%", background: BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{n}</span>
                  <div><p style={{ ...hf, fontSize: 15.5 }}>{t}</p><p style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.9, marginTop: 4 }}>{b}</p></div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 24 }}>
              <div className="chara"><img src="/chars/prop-grow.png" alt="NYOKI" style={{ height: 132 }} /></div>
              <p style={{ ...hf, fontSize: 12.5, color: BLUE_DEEP }}>学習AIのNYOKIです。使うほど御社の仕事を覚えます！</p>
            </div>
          </div>
          <img className="rv" src="/photos/support-meeting.jpg" alt="" style={{ width: "100%", borderRadius: 22, boxShadow: "0 18px 44px rgba(30,58,95,0.14)" }} />
        </div>
      </section>

      {/* ══ 16. 費用 ══ */}
      <section data-scene={scene()} className="sec" style={{ padding: "100px 40px", background: "#fff" }}>
        <div style={{ maxWidth: 1020, margin: "0 auto" }}>
          <div className="rv" style={{ textAlign: "center" }}><SectionLabel>Cost</SectionLabel>
          <h2 style={{ ...hf, fontSize: "clamp(26px, 3.2vw, 38px)", lineHeight: 1.6 }}>「AI導入って、高そう…」<br />いいえ、<span style={{ color: BLUE }}>小さく安く</span>始められます。</h2></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 22, marginTop: 66, alignItems: "stretch" }} className="show-grid">
            <div className="rv" style={{ background: BG_ALT, borderRadius: 22, padding: "30px 28px" }}>
              <p style={{ fontSize: 12, fontWeight: 800, color: "#94a3b8" }}>たとえば、新しく人を雇うと…</p>
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 9 }}>
                {["求人広告費と採用の手間がかかる", "月給＋社会保険料が毎月発生", "仕事を覚えるまで数ヶ月", "辞めてしまうリスクがある"].map((t) => (
                  <p key={t} style={{ fontSize: 13, color: MUTED }}>・{t}</p>
                ))}
              </div>
              <p style={{ ...hf, fontSize: 24, color: "#94a3b8", marginTop: 18 }}>月20万円〜<span style={{ fontSize: 13 }}>＋教育コスト</span></p>
            </div>
            <div className="rv" style={{ background: "#fff", borderRadius: 22, padding: "30px 28px", border: `2.5px solid ${BLUE}`, boxShadow: "0 18px 46px rgba(59,130,214,0.15)", position: "relative" }}>
              <div className="chara" style={{ position: "absolute", right: 12, top: -84 }}>
                <img src="/chars/prop-piggy.png" alt="" style={{ height: 148, animation: "bob 3.6s ease-in-out infinite" }} />
              </div>
              <p style={{ fontSize: 12, fontWeight: 800, color: BLUE }}>AIエージェントなら</p>
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                {["初期費用を抑えた月額制で始められる", "24時間365日、休まず働く", "教育不要。辞めない", "効果が出る業務ひとつからでOK"].map((t) => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, fontWeight: 700 }}>
                    <span style={{ width: 19, height: 19, borderRadius: "50%", background: BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    </span>{t}
                  </div>
                ))}
              </div>
              <p style={{ ...hf, fontSize: 27, color: BLUE, marginTop: 18 }}>月数万円台〜<span style={{ fontSize: 12, color: MUTED }}>※業務内容により個別見積り</span></p>
            </div>
          </div>
          <p className="rv" style={{ fontSize: 12.5, color: MUTED, textAlign: "center", marginTop: 22, lineHeight: 1.9 }}>IT導入補助金など、各種補助金の対象になる場合もあります。対象かどうかも無料相談でご案内します。</p>
        </div>
      </section>

      {/* ══ 17. プラン ══ */}
      <section data-scene={scene()} className="sec" style={{ padding: "100px 40px", background: BG_ALT }}>
        <div style={{ maxWidth: 1020, margin: "0 auto", textAlign: "center" }}>
          <div className="rv"><SectionLabel>Pricing</SectionLabel>
          <h2 style={{ ...hf, fontSize: "clamp(26px, 3.2vw, 38px)", lineHeight: 1.6 }}>御社に合う形で。</h2>
          <p style={{ fontSize: 14, color: MUTED, marginTop: 12 }}>費用は対象業務や機能範囲に応じて個別にお見積もり。全プラン月10時間以上の直接サポート付き。</p></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 48 }} className="team-grid">
            {PLANS.map((p, i) => (
              <div key={p.label} className="rv workcard" style={{
                background: "#fff", borderRadius: 22, padding: "34px 24px 30px", position: "relative",
                border: p.popular ? `2.5px solid ${BLUE}` : "1.5px solid #e8f0f9",
                boxShadow: p.popular ? "0 18px 46px rgba(59,130,214,0.15)" : "none",
                transitionDelay: `${i * 0.05}s`,
              }}>
                {p.popular && <span style={{ ...hf, position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", fontSize: 11, background: "#ff9718", color: "#fff", borderRadius: 100, padding: "5px 18px", boxShadow: "0 4px 12px rgba(255,151,24,0.4)" }}>いちばん人気</span>}
                <p style={{ fontSize: 11, fontWeight: 800, color: BLUE, letterSpacing: "0.15em" }}>{p.label}</p>
                <p style={{ ...hf, fontSize: 19, marginTop: 7 }}>{p.name}</p>
                <p style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.9, marginTop: 9 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 18. FAQ ══ */}
      <section data-scene={scene()} className="sec" style={{ padding: "100px 40px", background: "#fff" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <div className="rv" style={{ textAlign: "center" }}><SectionLabel>FAQ</SectionLabel>
          <h2 style={{ ...hf, fontSize: "clamp(26px, 3.2vw, 38px)", lineHeight: 1.6 }}>ご心配ごとには、<br />先にお答えします。</h2></div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 30, marginTop: 46 }}>
            <div className="chara" style={{ flexShrink: 0, textAlign: "center" }}>
              <img src="/chars/cloud.png" alt="COO" style={{ height: 150, animation: "bob 3.4s ease-in-out infinite" }} />
              <p style={{ ...hf, fontSize: 12, marginTop: 8 }}>会話AI<br />COO</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
              {FAQS.map((f, i) => (
                <div key={f.q} className="rv" style={{ background: BG_ALT, borderRadius: 18, padding: "20px 24px", transitionDelay: `${i * 0.04}s` }}>
                  <p style={{ ...hf, fontSize: 14.5 }}>Q. {f.q}</p>
                  <p style={{ fontSize: 13, color: MUTED, lineHeight: 2, marginTop: 7 }}>A. {f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ 19. 最終CTA ══ */}
      <section data-scene={scene()} className="sec" style={{ padding: "110px 40px 90px", background: "linear-gradient(180deg,#f4f9fe, #e9f3fd)", textAlign: "center" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 className="rv" style={{ ...hf, fontSize: "clamp(28px, 3.6vw, 44px)", lineHeight: 1.6 }}>どの仕事から、<br />任せてみますか？</h2>
          <p className="rv" style={{ fontSize: 14.5, color: MUTED, lineHeight: 2.1, marginTop: 16 }}>
            初回のご相談は無料です。「自動化できる業務の診断リスト」をその場でお渡しします。<br />しつこい営業は、ぼくらの得意分野ではありません。
          </p>
          <div className="rv lineup-row" style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 16, marginTop: 46 }}>
            {LINEUP.map(([src, h], j) => (
              <div key={src} className="chara">
                <img src={src} alt="" style={{ height: h, animation: `bob 3.4s ease-in-out ${j * 0.3}s infinite` }} />
              </div>
            ))}
          </div>
          <div className="rv" style={{ marginTop: 46, display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <CTA big />
            <a href="/demo" className="cta" style={{ ...hf, fontSize: 14.5, color: NAVY, background: "#fff", textDecoration: "none", padding: "18px 38px", borderRadius: 100, border: "1.5px solid #d8e4f0" }}>デモを体験する</a>
          </div>
          <p style={{ fontSize: 12, color: MUTED, marginTop: 40 }}>合同会社80 ｜ 愛知県名古屋市 ｜ ito.t@80grp.com ｜ 050-8896-5889</p>
        </div>
      </section>

      {/* ── ガイド：エイト ── */}
      <div style={{ position: "fixed", left: "clamp(8px, 3.5vw, 56px)", bottom: 14, zIndex: 90, display: "flex", flexDirection: "column", alignItems: "center", pointerEvents: "none" }}>
        <div key={active} style={{
          position: "relative", marginBottom: 12, maxWidth: isMobile ? 168 : 250,
          background: "#fff", border: "1.5px solid #e3edf7", borderRadius: 16,
          padding: isMobile ? "8px 12px" : "11px 16px", boxShadow: "0 10px 30px rgba(30,58,95,0.13)",
          animation: "bubbleIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both",
        }}>
          <p style={{ ...hf, fontSize: isMobile ? 10.5 : 12.5, lineHeight: 1.7 }}>{GUIDE_LINES[active] ?? GUIDE_LINES[0]}</p>
          <span style={{ position: "absolute", left: "50%", bottom: -8, transform: "translateX(-50%) rotate(45deg)", width: 13, height: 13, background: "#fff", borderRight: "1.5px solid #e3edf7", borderBottom: "1.5px solid #e3edf7" }} />
        </div>
        <div style={{ animation: walking ? "walkBob 0.4s ease-in-out infinite" : "bob 3s ease-in-out infinite" }}>
          <img src="/chars/ball.png" alt="EIGHT" style={{ height: isMobile ? 72 : 134, display: "block" }} />
        </div>
        <div style={{ width: isMobile ? 52 : 88, height: 12, borderRadius: "50%", background: "rgba(30,58,95,0.10)", marginTop: -4, filter: "blur(3px)", animation: walking ? "shadowWalk 0.4s ease-in-out infinite" : "shadowBob 3s ease-in-out infinite" }} />
        {!isMobile && <p style={{ ...hf, fontSize: 10.5, color: MUTED, marginTop: 5, background: "rgba(255,255,255,0.85)", borderRadius: 100, padding: "2px 12px" }}>案内係 EIGHT</p>}
      </div>

      <style>{`
        @keyframes bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes walkBob { 0%,100% { transform: translateY(0) rotate(2deg); } 50% { transform: translateY(-12px) rotate(-2deg); } }
        @keyframes shadowBob { 0%,100% { transform: scaleX(1); opacity: 1; } 50% { transform: scaleX(0.86); opacity: 0.7; } }
        @keyframes shadowWalk { 0%,100% { transform: scaleX(1); opacity: 1; } 50% { transform: scaleX(0.7); opacity: 0.5; } }
        @keyframes bubbleIn { from { opacity: 0; transform: translateY(10px) scale(0.92); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes nudge { 0%,100% { transform: translateY(0); } 50% { transform: translateY(5px); } }
        @keyframes marqueeL { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes flowMove { 0% { left: -4px; opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { left: calc(100% - 14px); opacity: 0; } }
        @keyframes marqueeR { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        .chara { cursor: pointer; pointer-events: auto; }
        .chara:hover img { animation: jelly 1.6s ease-in-out !important; }
        @keyframes jelly {
          0%, 100% { transform: scale(1, 1) translateY(0); }
          25% { transform: scale(1.06, 0.94) translateY(2px); }
          50% { transform: scale(0.95, 1.05) translateY(-7px); }
          75% { transform: scale(1.03, 0.97) translateY(1px); }
        }
        .chara-card { transition: transform 0.5s cubic-bezier(0.34,1.2,0.64,1), box-shadow 0.5s; }
        .chara-card:hover { transform: translateY(-6px); box-shadow: 0 20px 44px rgba(30,58,95,0.12); }
        .workcard { transition: transform 0.4s, box-shadow 0.4s; display: block; }
        .workcard:hover { transform: translateY(-5px); box-shadow: 0 20px 44px rgba(30,58,95,0.12); }
        .cta { transition: transform 0.25s, box-shadow 0.25s; }
        .cta:hover { transform: translateY(-2px); }
        @supports (animation-timeline: view()) {
          .rv { animation: rvIn 1ms linear both; animation-timeline: view(); animation-range: entry 5% entry 34%; }
        }
        @keyframes rvIn { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 700px) {
          .sec { padding-left: 18px !important; padding-right: 18px !important; padding-top: 56px !important; padding-bottom: 56px !important; }
          .team-grid { grid-template-columns: 1fr !important; }
          .lineup-row img { transform: scale(0.72); transform-origin: bottom; }
          .lineup-row { gap: 0 !important; }
        }
        @media (max-width: 980px) {
          .hero-grid, .show-grid { grid-template-columns: 1fr !important; direction: ltr !important; }
          .flow-row { flex-direction: column !important; }
          .lineup-row { flex-wrap: wrap !important; }
          .flow-row > div { flex-direction: column !important; }
          .pick-panel { flex-direction: column !important; text-align: center !important; }
          .team-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .works-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
