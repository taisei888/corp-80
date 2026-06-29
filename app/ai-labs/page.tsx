"use client";

import { useEffect, useRef, useState } from "react";

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".sr2");
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

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        let start = 0;
        const step = Math.ceil(to / 60);
        const id = setInterval(() => {
          start = Math.min(start + step, to);
          setVal(start);
          if (start >= to) clearInterval(id);
        }, 20);
      },
      { threshold: 0.5 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ===== Data =====
const solutions = [
  { id: "manufacturing", tag: "MANUFACTURING", title: "製造管理AI", desc: "工程ごとの進捗状況、不具合報告、点検記録を一元管理。リアルタイムで現場の状況を把握できます。", icon: "M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" },
  { id: "report", tag: "DAILY REPORT", title: "日報・報告書 生成AI", desc: "現場データから日報を自動生成。異常値の検知・週次比較まで対応します。", icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" },
  { id: "sales", tag: "SALES SUPPORT", title: "営業支援AI", desc: "商談管理と訪問履歴から次のアクションを自動提案。営業活動を見える化します。", icon: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" },
  { id: "doc", tag: "DOCUMENT", title: "書類作成サポートAI", desc: "見積書・契約書・提案書をAIが下書き。過去の文書から最適なテンプレートを自動引用。", icon: "M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" },
  { id: "faq", tag: "FAQ / MANUAL", title: "社内FAQ・マニュアル検索AI", desc: "社内規程やマニュアルをAIが学習し、チャットで即座に回答。問い合わせ削減に。", icon: "M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" },
  { id: "support", tag: "CUSTOMER SUPPORT", title: "問い合わせ対応AI", desc: "顧客からのよくある質問にAIが自動回答。対応履歴も一元管理します。", icon: "M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" },
  { id: "hr", tag: "HR / RECRUITMENT", title: "採用・人事サポートAI", desc: "応募者の適性分析、面接メモの要約、求人票の改善まで対応。", icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" },
  { id: "dashboard", tag: "DATA VIZ", title: "データ分析・見える化", desc: "売上・生産・品質データをダッシュボードで可視化。経営判断をスピードアップ。", icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" },
];

const combos = [
  {
    title: "製造業DXパック",
    desc: "紙の日報・点検記録をデジタル化し、製造進捗を一目で把握",
    services: ["manufacturing", "report", "dashboard"],
    color: "#6366f1",
  },
  {
    title: "営業力強化パック",
    desc: "商談管理から書類作成まで、営業活動をAIで効率化",
    services: ["sales", "doc", "dashboard"],
    color: "#0ea5e9",
  },
  {
    title: "社内DX基盤パック",
    desc: "社内の問い合わせ削減とナレッジ共有で属人化を解消",
    services: ["faq", "support", "hr"],
    color: "#10b981",
  },
];

const processSteps = [
  { step: "01", title: "ヒアリング", body: "業務内容、課題、改善したい作業を確認" },
  { step: "02", title: "現状整理", body: "紙・Excel・業務フローの棚卸しと優先順位整理" },
  { step: "03", title: "設計・提案", body: "使う人に合わせて画面と機能を設計" },
  { step: "04", title: "小さく導入", body: "効果が出やすい部分から先に導入・調整" },
  { step: "05", title: "見える化・拡張", body: "ダッシュボード化、AI活用、機能追加" },
  { step: "06", title: "伴走・改善", body: "月10時間以上の直接サポートで定着まで伴走" },
];

const plans = [
  {
    name: "受注開発プラン",
    planLabel: "Plan A",
    desc: "貴社の業務に合わせてシステムを一から構築する開発型プラン",
    features: ["貴社専用のシステム設計・開発", "業務フローに完全対応", "月10時間以上の直接サポート", "慣れるまで専任担当が伴走"],
    popular: false,
  },
  {
    name: "月額サブスクプラン",
    planLabel: "Plan B",
    desc: "初期費用を抑えて、月額利用ですぐに始められるプラン",
    features: ["全機能を月額で利用可能", "段階的に機能を追加できる", "月10時間以上の直接サポート", "慣れるまで専任担当が伴走"],
    popular: true,
  },
  {
    name: "買取予定サブスクプラン",
    planLabel: "Plan C",
    desc: "月額で利用開始し、将来的にシステムを買い取れるプラン",
    features: ["まずは月額でリスクなく開始", "合わなければ解約も可能", "自社管理へ移行時に買取可", "月10時間以上の直接サポート"],
    popular: false,
  },
];

const benefits = [
  { label: "紙・Excel業務", before: "手書き → 転記 → 集計", after: "入力 → 自動集計 → 即共有", metric: "80", metricLabel: "作業時間削減" },
  { label: "ノウハウ共有", before: "聞かないとわからない", after: "検索すれば出てくる", metric: "90", metricLabel: "問い合わせ削減" },
  { label: "経営状況の把握", before: "各部署に確認 → 集計", after: "ダッシュボードで即確認", metric: "30", metricLabel: "秒で状況把握" },
];

const useCases = [
  { industry: "製造業", challenge: "紙の日報・進捗が見えない・世代交代", uses: ["製造管理AI", "日報生成AI", "教育管理"] },
  { industry: "建設業", challenge: "現場報告のバラつき・安全管理・技術継承", uses: ["報告書AI", "ダッシュボード", "ナレッジ共有"] },
  { industry: "物流・倉庫", challenge: "在庫Excel管理・配送状況の把握", uses: ["在庫デジタル化", "見える化", "チェックリスト"] },
  { industry: "飲食・小売", challenge: "シフト管理・在庫確認・本部報告", uses: ["日報デジタル化", "店舗可視化", "社内FAQ"] },
  { industry: "サービス業", challenge: "顧客対応の属人化・社内ルール周知・採用難", uses: ["ナレッジ共有", "採用支援AI", "ダッシュボード"] },
];

// ===== Main Component =====
export default function AILabsPage() {
  useScrollReveal();
  const [isMobile, setIsMobile] = useState(false);
  const [visibleCards, setVisibleCards] = useState(0);
  const [typingIdx, setTypingIdx] = useState(0);
  const [liveResult, setLiveResult] = useState("");
  const [liveTyped, setLiveTyped] = useState("");
  const liveRequested = useRef(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const sr2: React.CSSProperties = {
    opacity: 0,
    transform: "translateY(32px)",
    transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
  };

  const accent = "#6366f1";
  const accentLight = "#eef2ff";

  const timelineTasks = [
    { label: "メール下書き", icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75", result: "件名：先日のお打ち合わせの御礼\n\nお世話になっております。先日はお忙しい中お時間をいただき、誠にありがとうございました。ご提案内容について社内で検討を進めております。来週中に改めてご連絡差し上げます。", color: "#6366f1" },
    { label: "議事録を要約", icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z", result: "【決定事項】\n・新システムは9月導入で確定\n・予算上限は500万円\n【TODO】\n・田中：要件定義書を金曜までに提出\n・佐藤：ベンダー3社に見積もり依頼", color: "#0ea5e9" },
    { label: "英語に翻訳", icon: "M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802", result: "Original：弊社のAIソリューションは業務効率を劇的に改善します。\n\nTranslation：Our AI solutions dramatically improve operational efficiency across your entire organization.", color: "#10b981" },
    { label: "売上データ分析", icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z", result: "前月比 +12.3%（¥18.4M → ¥20.7M）\n好調要因：新規顧客5社獲得、リピート率が82%→89%に改善\n注意：広告費が予算を15%超過。ROI要確認。", color: "#f59e0b" },
    { label: "AIがリアルタイムで回答", icon: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z", result: "", color: "#ec4899", live: true },
  ];

  // Auto-reveal cards one by one
  useEffect(() => {
    if (visibleCards >= timelineTasks.length) return;
    const timer = setTimeout(() => setVisibleCards(v => v + 1), visibleCards === 0 ? 800 : 1800);
    return () => clearTimeout(timer);
  }, [visibleCards, timelineTasks.length]);

  // Typing effect for each card
  useEffect(() => {
    if (typingIdx >= visibleCards) return;
    const timer = setTimeout(() => setTypingIdx(t => t + 1), 600);
    return () => clearTimeout(timer);
  }, [visibleCards, typingIdx]);

  // Live API call for the last card
  useEffect(() => {
    if (visibleCards < timelineTasks.length) return;
    if (liveRequested.current) return;
    liveRequested.current = true;
    fetch("/api/ai-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "日本の面白い雑学を1つ教えて。短く。" }),
    })
      .then(r => r.json())
      .then(d => setLiveResult(d.reply || ""))
      .catch(() => setLiveResult("AIが考え中..."));
  }, [visibleCards, timelineTasks.length]);

  // Typewriter for live result
  useEffect(() => {
    if (!liveResult) return;
    let i = 0;
    setLiveTyped("");
    const id = setInterval(() => {
      i++;
      setLiveTyped(liveResult.slice(0, i));
      if (i >= liveResult.length) clearInterval(id);
    }, 25);
    return () => clearInterval(id);
  }, [liveResult]);

  const solvForId = (id: string) => solutions.find(s => s.id === id);

  return (
    <div style={{ fontFamily: "inherit", background: "#fff", color: "#1e293b", overflowX: "hidden" }}>

      {/* ── Nav ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid #f1f5f9",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: isMobile ? "0 20px" : "0 48px", height: 64,
      }}>
        <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/7.png" alt="80" style={{ height: 48, display: "block" }} />
          <span style={{ width: 1, height: 16, background: "#e2e8f0" }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: accent, letterSpacing: "0.1em", textTransform: "uppercase" }}>AI Labs</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/demo" style={{
            fontSize: 12, fontWeight: 600, color: "#475569", textDecoration: "none",
            padding: "8px 16px", borderRadius: 100, border: "1px solid #e2e8f0",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#475569"; }}
          >
            デモを試す
          </a>
          <a href="/contact" style={{
            fontSize: 12, fontWeight: 600, color: "#fff", textDecoration: "none",
            padding: "8px 20px", borderRadius: 100, background: accent,
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#4f46e5"; }}
            onMouseLeave={e => { e.currentTarget.style.background = accent; }}
          >
            無料相談
          </a>
        </div>
      </nav>

      {/* ── 01. Hero ── */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        justifyContent: "center",
        padding: isMobile ? "100px 20px 60px" : "120px 48px 80px",
        background: "#fff", position: "relative", overflow: "hidden",
      }}>
        {/* Subtle dot background */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.3, pointerEvents: "none",
          backgroundImage: "radial-gradient(circle, #e2e8f0 1px, transparent 1px)",
          backgroundSize: "32px 32px" }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", width: "100%",
          display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 40 : 60, alignItems: "center",
        }}>
          {/* Left: Copy */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8,
              fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: accent,
              textTransform: "uppercase", marginBottom: 24,
              padding: "6px 16px", borderRadius: 100,
              border: `1.5px solid ${accentLight}`, background: accentLight,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: accent, animation: "pulse 2s infinite" }} />
              AI Labs
            </div>

            <h1 style={{
              fontSize: isMobile ? "clamp(26px, 8vw, 38px)" : "clamp(32px, 3.5vw, 48px)",
              fontWeight: 900, letterSpacing: "-0.04em", color: "#0f172a", lineHeight: 1.25, marginBottom: 20,
            }}>
              AIは、もう<br />
              <span style={{ color: accent }}>ここまでできる。</span>
            </h1>

            <p style={{ fontSize: isMobile ? 14 : 15, color: "#64748b", lineHeight: 1.9, marginBottom: 32, maxWidth: 420 }}>
              メール下書き、議事録要約、翻訳、データ分析 ─<br />
              今まで人がやっていた業務を、AIがリアルタイムで処理しています。
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="/demo" style={{
                display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700,
                color: "#fff", background: accent, padding: "14px 28px", borderRadius: 100,
                textDecoration: "none", transition: "all 0.3s",
                boxShadow: "0 6px 24px rgba(99,102,241,0.25)",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
              >
                デモを体験する
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
              <a href="/contact" style={{
                display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600,
                color: "#475569", background: "transparent", padding: "14px 28px", borderRadius: 100,
                textDecoration: "none", border: "1.5px solid #e2e8f0", transition: "all 0.3s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#475569"; }}
              >
                無料相談
              </a>
            </div>
          </div>

          {/* Right: AI Timeline */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, position: "relative" }}>
            {/* Timeline line */}
            <div style={{
              position: "absolute", left: 19, top: 0, bottom: 0, width: 2,
              background: `linear-gradient(to bottom, ${accent}20, ${accent}05)`,
              zIndex: 0,
            }} />

            {timelineTasks.map((task, i) => {
              const visible = i < visibleCards;
              const typed = i < typingIdx;
              const isLive = task.live;
              const content = isLive ? (liveTyped || null) : task.result;

              return (
                <div key={i} style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(20px)",
                  transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
                  display: "flex", gap: 14, alignItems: "flex-start", position: "relative", zIndex: 1,
                }}>
                  {/* Dot */}
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                    background: `${task.color}12`, border: `2px solid ${task.color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.3s",
                    ...(visible && typed ? { background: task.color, borderColor: task.color } : {}),
                  }}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24"
                      stroke={visible && typed ? "#fff" : task.color} strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={task.icon} />
                    </svg>
                  </div>

                  {/* Card */}
                  <div style={{
                    flex: 1, padding: "14px 18px", borderRadius: 14,
                    background: "#fff", border: "1px solid #f1f5f9",
                    boxShadow: visible ? "0 2px 12px rgba(0,0,0,0.04)" : "none",
                    transition: "all 0.3s",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: typed && content ? 8 : 0 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: task.color }}>{task.label}</span>
                      {visible && !typed && (
                        <span style={{ fontSize: 10, color: "#94a3b8", display: "inline-flex", gap: 3 }}>
                          <span style={{ animation: "blink 1.4s infinite" }}>.</span>
                          <span style={{ animation: "blink 1.4s infinite", animationDelay: "0.2s" }}>.</span>
                          <span style={{ animation: "blink 1.4s infinite", animationDelay: "0.4s" }}>.</span>
                        </span>
                      )}
                      {typed && !isLive && (
                        <span style={{ fontSize: 9, fontWeight: 600, color: "#10b981", background: "#f0fdf4", padding: "2px 8px", borderRadius: 100 }}>完了</span>
                      )}
                      {isLive && liveTyped && !liveResult.length ? null : isLive && liveTyped && liveTyped.length >= liveResult.length && (
                        <span style={{ fontSize: 9, fontWeight: 600, color: "#ec4899", background: "#fdf2f8", padding: "2px 8px", borderRadius: 100 }}>LIVE</span>
                      )}
                    </div>
                    {typed && content && (
                      <div style={{
                        fontSize: 11, color: "#475569", lineHeight: 1.7,
                        whiteSpace: "pre-wrap",
                        animation: isLive ? "none" : "fadeIn 0.4s ease",
                      }}>
                        {isLive ? liveTyped : content}
                        {isLive && liveTyped.length < (liveResult?.length || 999) && (
                          <span style={{ animation: "blink 0.8s infinite", color: accent }}>|</span>
                        )}
                      </div>
                    )}
                    {isLive && typed && !liveResult && (
                      <div style={{ fontSize: 11, color: "#94a3b8", display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                        <span style={{ display: "inline-flex", gap: 3 }}>
                          <span style={{ animation: "blink 1.4s infinite" }}>.</span>
                          <span style={{ animation: "blink 1.4s infinite", animationDelay: "0.2s" }}>.</span>
                          <span style={{ animation: "blink 1.4s infinite", animationDelay: "0.4s" }}>.</span>
                        </span>
                        {" "}AIがリアルタイムで生成中
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 02. Services ── */}
      <section id="services" style={{ padding: isMobile ? "80px 20px" : "120px 48px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="sr2" style={{ ...sr2, marginBottom: 56, textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: accent, textTransform: "uppercase", marginBottom: 12 }}>Services</div>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#0f172a", lineHeight: 1.3 }}>
              あらゆる業務課題に、<br />AIで応えます。
            </h2>
            <p style={{ fontSize: 14, color: "#64748b", marginTop: 12, lineHeight: 1.8 }}>以下は代表的なサービス例です。貴社の課題に合わせて、最適なシステムをゼロから構築します。</p>
          </div>
          <div className="al-services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {solutions.map((s, i) => (
              <a key={i} href={`/demo?s=${s.id}`}
                className="sr2" style={{ ...sr2, transitionDelay: `${i * 0.05}s`,
                padding: "28px 24px", borderRadius: 16, background: "#fff",
                border: "1.5px solid #f1f5f9", textDecoration: "none",
                transition: "all 0.25s", display: "block", cursor: "pointer",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(99,102,241,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#f1f5f9"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: accentLight, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={accent} strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                  </svg>
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: accent, textTransform: "uppercase", marginBottom: 8 }}>{s.tag}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 8, lineHeight: 1.4 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>{s.desc}</div>
                <div style={{ marginTop: 16, fontSize: 11, fontWeight: 700, color: accent, display: "flex", alignItems: "center", gap: 4 }}>
                  デモを見る
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
          <div className="sr2" style={{ ...sr2, marginTop: 32, textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.8, marginBottom: 16 }}>
              上記以外にも、在庫管理・教育管理・工程進捗・通知システムなど、<br />
              貴社の業務に必要な機能をすべてオーダーメイドで構築できます。
            </p>
            <a href="/contact" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 13, fontWeight: 700, color: accent, textDecoration: "none",
            }}>
              「こんなこともできる？」まずはご相談ください
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ── 03. Recommended Combos ── */}
      <section style={{ padding: isMobile ? "80px 20px" : "120px 48px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="sr2" style={{ ...sr2, marginBottom: 56, textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: accent, textTransform: "uppercase", marginBottom: 12 }}>Recommended</div>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#0f172a", lineHeight: 1.3 }}>
              こんな組み合わせがおすすめです。
            </h2>
            <p style={{ fontSize: 14, color: "#64748b", marginTop: 12 }}>業種や課題に合わせて、最適なパッケージをご提案します。</p>
          </div>
          <div className="al-combos-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {combos.map((c, i) => (
              <div key={i} className="sr2" style={{ ...sr2, transitionDelay: `${i * 0.1}s`,
                borderRadius: 20, overflow: "hidden", background: "#fff",
                border: "1.5px solid #f1f5f9", transition: "all 0.25s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = c.color; e.currentTarget.style.boxShadow = `0 12px 40px ${c.color}15`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#f1f5f9"; e.currentTarget.style.boxShadow = "none"; }}
              >
                {/* Color bar */}
                <div style={{ height: 4, background: c.color }} />
                <div style={{ padding: "28px 24px" }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: "#0f172a", marginBottom: 8 }}>{c.title}</div>
                  <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, marginBottom: 20 }}>{c.desc}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {c.services.map((sId) => {
                      const s = solvForId(sId);
                      if (!s) return null;
                      return (
                        <a key={sId} href={`/demo?s=${sId}`} style={{
                          display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                          borderRadius: 12, background: "#f8fafc", textDecoration: "none",
                          transition: "all 0.2s", border: "1px solid #f1f5f9",
                        }}
                          onMouseEnter={e => { e.currentTarget.style.background = accentLight; e.currentTarget.style.borderColor = `${accent}30`; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#f1f5f9"; }}
                        >
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: `${c.color}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={c.color} strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                            </svg>
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{s.title}</div>
                          </div>
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#94a3b8" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </a>
                      );
                    })}
                  </div>
                  <a href="/demo" style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    marginTop: 20, fontSize: 13, fontWeight: 700, color: c.color,
                    textDecoration: "none",
                  }}>
                    すべてのデモを見る
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04. Use Cases ── */}
      <section style={{ padding: isMobile ? "80px 20px" : "120px 48px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="sr2" style={{ ...sr2, marginBottom: 56, textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: accent, textTransform: "uppercase", marginBottom: 12 }}>Use Cases</div>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#0f172a", lineHeight: 1.3 }}>
              業種ごとの活用イメージ
            </h2>
          </div>
          <div className="al-usecases-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
            {useCases.map((d, i) => (
              <div key={i} className="sr2" style={{ ...sr2, transitionDelay: `${i * 0.08}s`,
                padding: "28px 20px", borderRadius: 16, background: "#fff",
                border: "1.5px solid #f1f5f9", textAlign: "center",
              }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>{d.industry}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.7, marginBottom: 16, minHeight: 40 }}>{d.challenge}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {d.uses.map((u, j) => (
                    <div key={j} style={{ fontSize: 10, fontWeight: 600, padding: "5px 8px", borderRadius: 6,
                      background: accentLight, color: accent }}>{u}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 05. Benefits ── */}
      <section style={{ padding: isMobile ? "80px 20px" : "120px 48px", background: "#fff" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div className="sr2" style={{ ...sr2, marginBottom: 56, textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: accent, textTransform: "uppercase", marginBottom: 12 }}>Benefits</div>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#0f172a", lineHeight: 1.3 }}>
              Before → Afterで変わること。
            </h2>
          </div>
          <div className="al-benefits-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {benefits.map((b, i) => (
              <div key={i} className="sr2" style={{ ...sr2, transitionDelay: `${i * 0.1}s`,
                padding: "32px 24px", borderRadius: 20, background: "#f8fafc",
                border: "1.5px solid #f1f5f9", textAlign: "center",
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 20 }}>{b.label}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: "#94a3b8", padding: "8px 12px", borderRadius: 8, background: "#fff", border: "1px solid #e2e8f0" }}>
                    <span style={{ fontWeight: 700 }}>BEFORE</span>　{b.before}
                  </div>
                  <div style={{ fontSize: 16, color: accent }}>↓</div>
                  <div style={{ fontSize: 11, color: "#059669", padding: "8px 12px", borderRadius: 8, background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                    <span style={{ fontWeight: 700 }}>AFTER</span>　{b.after}
                  </div>
                </div>
                <div style={{ fontSize: "clamp(32px, 4vw, 44px)", fontWeight: 900, color: accent, letterSpacing: "-0.03em", lineHeight: 1 }}>
                  <Counter to={parseInt(b.metric)} suffix="%" />
                </div>
                <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, marginTop: 4 }}>{b.metricLabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 06. Process ── */}
      <section style={{ padding: isMobile ? "80px 20px" : "120px 48px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div className="sr2" style={{ ...sr2, marginBottom: 56, textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: accent, textTransform: "uppercase", marginBottom: 12 }}>Process</div>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#0f172a", lineHeight: 1.3 }}>
              ヒアリングから定着まで6ステップ
            </h2>
          </div>
          <div className="al-process-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {processSteps.map((p, i) => (
              <div key={i} className="sr2" style={{ ...sr2, transitionDelay: `${i * 0.08}s`,
                padding: "28px 24px", borderRadius: 16, background: "#fff",
                border: "1.5px solid #f1f5f9", display: "flex", alignItems: "flex-start", gap: 16,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${accent}, #8b5cf6)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 800, color: "#fff", flexShrink: 0,
                }}>{p.step}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>{p.title}</div>
                  <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.7 }}>{p.body}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="sr2" style={{ ...sr2, marginTop: 24, fontSize: 13, color: accent, fontWeight: 700, textAlign: "center" }}>
            慣れるまで専任担当が伴走。現場で本当に使えるシステムに育てます。
          </div>
        </div>
      </section>

      {/* ── 07. Pricing ── */}
      <section style={{ padding: isMobile ? "80px 20px" : "120px 48px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="sr2" style={{ ...sr2, marginBottom: 24, textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: accent, textTransform: "uppercase", marginBottom: 12 }}>Pricing</div>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#0f172a", lineHeight: 1.3 }}>
              3つの導入プラン
            </h2>
            <p style={{ fontSize: 14, color: "#64748b", marginTop: 12 }}>貴社の状況に合わせて、最適なプランをご提案します。</p>
          </div>

          <div className="al-pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {plans.map((p, i) => (
              <div key={i} className="sr2" style={{ ...sr2, transitionDelay: `${i * 0.08}s`,
                padding: "36px 28px", borderRadius: 20,
                background: p.popular ? "#fafafe" : "#fff",
                border: p.popular ? `2px solid ${accent}` : "1.5px solid #f1f5f9",
                position: "relative", textAlign: "center",
              }}>
                {p.popular && <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%) translateY(-50%)",
                  fontSize: 10, fontWeight: 700, padding: "4px 18px", borderRadius: 100,
                  background: accent, color: "#fff", letterSpacing: "0.1em" }}>RECOMMENDED</div>}
                <div style={{ fontSize: 11, fontWeight: 700, color: accent, letterSpacing: "0.15em", marginBottom: 8 }}>{p.planLabel}</div>
                <div style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 24, lineHeight: 1.6, minHeight: 36 }}>{p.desc}</div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, textAlign: "left", marginBottom: 24 }}>
                  {p.features.map((f, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#475569", lineHeight: 1.5 }}>
                      <span style={{ color: accent, flexShrink: 0, marginTop: 1 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </span>
                      {f}
                    </div>
                  ))}
                </div>

                <a href="/contact" style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  fontSize: 13, fontWeight: 700, color: p.popular ? "#fff" : accent,
                  background: p.popular ? accent : accentLight,
                  padding: "10px 24px", borderRadius: 100, textDecoration: "none",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => { if (!p.popular) { e.currentTarget.style.background = `${accent}20`; } }}
                  onMouseLeave={e => { if (!p.popular) { e.currentTarget.style.background = accentLight; } }}
                >
                  詳しく相談する
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
          <div className="sr2" style={{ ...sr2, marginTop: 24, fontSize: 12, color: "#94a3b8", textAlign: "center", lineHeight: 1.8 }}>
            ※ 費用は対象業務や機能範囲に応じて個別にお見積もりいたします。<br />
            ※ 全プラン共通で月10時間以上の直接サポート付き。慣れるまで専任担当が伴走します。
          </div>
        </div>
      </section>

      {/* ── 08. CTA ── */}
      <section style={{
        padding: isMobile ? "80px 20px" : "120px 48px",
        background: `linear-gradient(135deg, ${accentLight} 0%, #fff 100%)`,
        position: "relative",
      }}>
        <div className="sr2" style={{ ...sr2, maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(26px, 4.5vw, 44px)", fontWeight: 900, letterSpacing: "-0.04em", color: "#0f172a", lineHeight: 1.3, marginBottom: 16 }}>
            業務のデジタル化、<br />まずは無料相談から。
          </h2>
          <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.9, marginBottom: 40 }}>
            初回ご相談は無料です。現状の課題整理から、小さく始められる導入案のご提案まで対応します。
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/contact" style={{
              display: "inline-flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 700,
              color: "#fff", background: accent, padding: "16px 36px", borderRadius: 100,
              textDecoration: "none", transition: "all 0.3s",
              boxShadow: "0 8px 32px rgba(99,102,241,0.25)",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(99,102,241,0.35)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(99,102,241,0.25)"; }}
            >
              無料相談を申し込む
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
            <a href="/demo" style={{
              display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600,
              color: "#475569", background: "#fff", padding: "16px 32px", borderRadius: 100,
              textDecoration: "none", border: "1.5px solid #e2e8f0", transition: "all 0.3s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#475569"; }}
            >
              デモを体験する
            </a>
          </div>

          <div style={{ marginTop: 48, display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              ["ito.t@80grp.com", "EMAIL"],
              ["050-8896-5889", "PHONE"],
              ["rmg-labs.com", "WEBSITE"],
            ].map(([val, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: "#94a3b8", marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 13, color: "#475569", fontWeight: 600 }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: "#f8fafc", borderTop: "1px solid #f1f5f9", padding: isMobile ? "36px 20px" : "48px 48px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 11, color: "#94a3b8", letterSpacing: "0.04em" }}>
          &copy; 2026 合同会社80. All rights reserved.
        </div>
        <a href="/"><img src="/7.png" alt="80" style={{ height: 36, display: "block", opacity: 0.5 }} /></a>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes blink {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .al-services-grid { grid-template-columns: 1fr 1fr !important; }
          .al-combos-grid { grid-template-columns: 1fr !important; }
          .al-usecases-grid { grid-template-columns: 1fr 1fr !important; }
          .al-benefits-grid { grid-template-columns: 1fr !important; }
          .al-pricing-grid { grid-template-columns: 1fr !important; }
          .al-process-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .al-services-grid { grid-template-columns: 1fr !important; }
          .al-usecases-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
