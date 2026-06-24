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

export default function AILabsPage() {
  useScrollReveal();
  const [isMobile, setIsMobile] = useState(false);

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

  const concerns = [
    "紙の書類やExcelが多く、管理が大変",
    "社内の情報共有がうまくいかない",
    "ベテランのノウハウが引き継げない",
    "中途採用がなかなかうまくいかない",
    "デジタル化を進めたいが何から始めれば…",
    "システム導入しても現場が使いこなせるか不安",
  ];

  const challenges = [
    { num: "01", text: "日報・報告書・チェックシートが紙のまま" },
    { num: "02", text: "Excelが複雑化して担当者しか触れない" },
    { num: "03", text: "情報が人に依存し、共有されない" },
    { num: "04", text: "製造現場の進捗が見えにくい" },
    { num: "05", text: "ベテランの退職でノウハウが消えるリスク" },
    { num: "06", text: "新人教育・引き継ぎに時間がかかる" },
    { num: "07", text: "求人を出しても応募が集まらない" },
    { num: "08", text: "採用しても定着しにくい" },
    { num: "09", text: "経営判断に必要な数字がすぐ出ない" },
    { num: "10", text: "管理者の確認業務が多すぎる" },
  ];

  const solutions = [
    { num: "01", tag: "DIGITALIZATION", title: "紙・Excel業務のデジタル化", desc: "日報・チェックシート・報告書・申請書など、紙やExcelの業務をスマホ・PCから入力できるフォームに置き換え。自動集計・検索・共有まで一気に対応します。" },
    { num: "02", tag: "MANUFACTURING", title: "製造管理システム", desc: "工程ごとの進捗状況、不具合報告、点検記録を一覧管理。管理者は事務所にいながら現場の状況をリアルタイムで把握できます。" },
    { num: "03", tag: "DASHBOARD", title: "ダッシュボード管理", desc: "製造進捗、書類提出状況、未対応タスク、採用状況、教育進捗など、経営に必要な情報を一画面に集約。一目で状況を把握できます。" },
    { num: "04", tag: "KNOWLEDGE BASE", title: "社内ナレッジ共有 / 社内FAQ", desc: "業務マニュアルやベテランのノウハウを蓄積し、検索できる仕組みに。AIが質問に対して該当するマニュアルを回答します。" },
    { num: "05", tag: "EDUCATION", title: "教育・引き継ぎ管理", desc: "誰が何を習得済みか、何が未対応かを一覧で管理。世代交代に向けた教育の抜け漏れを防ぎ、教育担当の負担も軽減します。" },
    { num: "06", tag: "RECRUITMENT", title: "採用改善支援", desc: "求人票の改善、応募者の適性診断、面接質問の設計まで対応。必要に応じて人材紹介も可能。採用から定着まで一貫して支援します。" },
  ];

  const useCases = [
    { industry: "製造業", icon: "🏭", challenge: "紙の日報・点検記録が多い / 製造進捗が見えない / 世代交代が迫っている", uses: ["紙業務のデジタル化", "製造管理システム", "教育・引き継ぎ管理"] },
    { industry: "建設業", icon: "🏗", challenge: "現場ごとに報告が異なる / 安全管理の記録 / 職人の技術継承", uses: ["報告書のデジタル化", "ダッシュボード管理", "ナレッジ共有"] },
    { industry: "物流・倉庫", icon: "📦", challenge: "在庫管理がExcel / ピッキングミス / 配送状況の把握", uses: ["在庫管理のデジタル化", "作業状況の見える化", "チェックリスト"] },
    { industry: "飲食・小売", icon: "🏪", challenge: "シフト管理 / 在庫確認 / 本部への報告業務", uses: ["日報・報告デジタル化", "店舗状況の可視化", "社内FAQ"] },
    { industry: "サービス業", icon: "💼", challenge: "顧客対応の属人化 / 社内ルールの周知 / 採用難", uses: ["ナレッジ共有", "採用改善支援", "ダッシュボード"] },
  ];

  const benefits = [
    { label: "紙・Excel業務", before: "手書き → 転記 → 集計", after: "入力 → 自動集計 → 即共有", metric: "80", metricLabel: "作業時間削減" },
    { label: "ノウハウ共有", before: "聞かないとわからない", after: "検索すれば出てくる", metric: "90", metricLabel: "問い合わせ削減" },
    { label: "経営状況の把握", before: "各部署に確認 → 集計", after: "ダッシュボードで即確認", metric: "30", metricLabel: "秒で状況把握" },
  ];

  const moreBenefits = [
    "製造現場の見える化", "教育の抜け漏れ防止", "採用精度の向上",
    "Excel属人化の解消", "世代交代の準備", "経営判断のスピードアップ",
  ];

  const principles = [
    "課題を整理してから開発する",
    "使う人に合わせた画面を作る",
    "最初から複雑にしすぎない",
    "小さく作って早く試す",
    "実際の運用を見ながら改善する",
    "AIだけでなく、業務フロー全体を考える",
    "慣れるまで専任担当が伴走する",
  ];

  const processSteps = [
    { step: "01", title: "ヒアリング", body: "業務内容、課題、改善したい作業を確認" },
    { step: "02", title: "現状整理", body: "紙・Excel・業務フローの棚卸しと優先順位整理" },
    { step: "03", title: "設計・提案", body: "使う人に合わせて画面と機能を設計" },
    { step: "04", title: "小さく導入", body: "効果が出やすい部分から先に導入・調整" },
    { step: "05", title: "見える化・拡張", body: "ダッシュボード化、AI活用、機能追加" },
    { step: "06", title: "伴走・改善", body: "月10時間以上の直接サポートで定着まで伴走" },
  ];

  const modules = [
    "紙帳票のデジタル化", "日報・報告書システム", "チェックシート", "製造管理",
    "工程進捗管理", "ダッシュボード", "社内FAQ・ナレッジ", "教育管理",
    "引き継ぎ管理", "採用アセスメント", "求人改善AI", "在庫管理",
    "不具合報告", "データ分析", "通知・アラート",
  ];

  const plans = [
    {
      name: "受注開発プラン",
      planLabel: "Plan A",
      desc: "貴社の業務に合わせてシステムを一から構築する開発型プラン",
      originalPrice: "300〜500万円",
      campaignPrice: "150万円〜",
      note: "＋ 保守サポート 月額5万円",
      features: ["貴社専用のシステム設計・開発", "業務フローに完全対応", "月10時間以上の直接サポート", "慣れるまで専任担当が伴走"],
      popular: false,
    },
    {
      name: "月額サブスクプラン",
      planLabel: "Plan B",
      desc: "初期費用を抑えて、月額利用ですぐに始められるプラン",
      originalPrice: "月額 50万円",
      campaignPrice: "月額 30万円",
      note: "初期費用なし・最低契約期間12ヶ月",
      features: ["全機能を月額で利用可能", "段階的に機能を追加できる", "月10時間以上の直接サポート", "慣れるまで専任担当が伴走"],
      popular: true,
    },
    {
      name: "買取予定サブスクプラン",
      planLabel: "Plan C",
      desc: "月額で利用開始し、将来的にシステムを買い取れるプラン",
      originalPrice: "月額 40万円",
      campaignPrice: "月額 25万円",
      note: "6ヶ月以降、買取移行が可能",
      features: ["まずは月額でリスクなく開始", "合わなければ解約も可能", "自社管理へ移行時に買取可", "月10時間以上の直接サポート"],
      popular: false,
    },
  ];

  const whyAffordable = [
    { num: "01", title: "開発工程にもAIを活用", desc: "効率的な作業フローでコストを圧縮" },
    { num: "02", title: "スタートアップ価格で提供中", desc: "実績作りのため、今なら特別価格でご提供" },
    { num: "03", title: "必要な機能に絞って提案", desc: "過剰開発をせず、本当に必要なものだけ" },
    { num: "04", title: "汎用構成を活用", desc: "既存の仕組み・テンプレートでコスト抑制" },
    { num: "05", title: "小さく作って改善", desc: "無駄な開発を回避する段階的な進め方" },
  ];

  const firstSteps = [
    "現在の業務課題のヒアリング",
    "紙・Excel・属人化の棚卸し",
    "デジタル化の優先順位整理",
    "採用課題の整理",
    "小さく始められる導入案のご提案",
    "概算費用・スケジュールのご提示",
  ];

  return (
    <div style={{ fontFamily: "inherit", background: "#fff", color: "#0f172a", overflowX: "hidden" }}>

      {/* ── Nav ── */}
      <nav className="al-nav" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(15,23,42,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: isMobile ? "0 20px" : "0 48px", height: 64,
      }}>
        <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/7.png" alt="80" style={{ height: 48, display: "block" }} />
          <span style={{ width: 1, height: 16, background: "#e2e8f0" }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: "#6366f1", letterSpacing: "0.1em", textTransform: "uppercase" }}>AI Labs</span>
        </a>
        <a href="/contact" style={{
          fontSize: 12, fontWeight: 600, color: "#fff", textDecoration: "none",
          padding: "8px 20px", borderRadius: 100, background: "#6366f1",
          transition: "all 0.2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "#4f46e5"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#6366f1"; }}
        >
          無料相談
        </a>
      </nav>

      {/* ── 01. Hero ── */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        justifyContent: "center", padding: isMobile ? "120px 24px 60px" : "120px 80px 80px",
        background: "#0f172a", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px" }} />
        <div style={{ position: "absolute", top: "10%", right: "-5%", width: "50vw", height: "50vw",
          borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)",
          pointerEvents: "none", filter: "blur(60px)" }} />

        <div style={{ maxWidth: 800, position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "#6366f1",
            textTransform: "uppercase", marginBottom: 32,
            padding: "6px 16px", borderRadius: 100,
            border: "1.5px solid rgba(99,102,241,0.3)", background: "rgba(99,102,241,0.08)",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1" }} />
            AI Labs — 合同会社80
          </div>

          <h1 style={{
            fontSize: isMobile ? "clamp(28px, 9vw, 44px)" : "clamp(40px, 5vw, 72px)",
            fontWeight: 900, letterSpacing: "-0.04em", color: "#f8fafc", lineHeight: 1.2, marginBottom: 32,
          }}>
            紙・Excel・属人化を、<br />
            <span style={{ background: "linear-gradient(135deg, #6366f1, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              次世代に引き継げる<br />仕組みに。
            </span>
          </h1>

          <p style={{ fontSize: isMobile ? 14 : 17, color: "rgba(248,250,252,0.55)", lineHeight: 1.9, maxWidth: 560, marginBottom: 48 }}>
            製造管理・社内共有・採用改善まで一体で支援。<br />
            業務のデジタル化から定着まで、伴走型でサポートします。
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="#concerns" style={{
              display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700,
              color: "#fff", background: "#6366f1", padding: "16px 32px", borderRadius: 100,
              textDecoration: "none", transition: "all 0.3s", boxShadow: "0 8px 32px rgba(99,102,241,0.35)",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
            >サービスを見る <span style={{ fontSize: 18 }}>↓</span></a>
            <a href="/contact" style={{
              display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700,
              color: "rgba(255,255,255,0.7)", background: "transparent", padding: "16px 32px", borderRadius: 100,
              textDecoration: "none", border: "1.5px solid rgba(255,255,255,0.15)", transition: "all 0.3s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
            >初回無料相談</a>
          </div>
        </div>
      </section>

      {/* ── 02. Concerns ── */}
      <section id="concerns" style={{ padding: isMobile ? "80px 20px" : "120px 80px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="sr2" style={sr2}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "#6366f1", textTransform: "uppercase", marginBottom: 16 }}>Concerns</div>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#0f172a", lineHeight: 1.3, marginBottom: 16 }}>
              こんなお悩み、<br />ありませんか？
            </h2>
            <p style={{ fontSize: 15, color: "#64748b", marginBottom: 48 }}>多くの企業が抱える課題は共通しています。</p>
          </div>
          <div className="al-concerns-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {concerns.map((c, i) => (
              <div key={i} className="sr2" style={{ ...sr2, transitionDelay: `${i * 0.06}s`,
                padding: "24px 28px", borderRadius: 16, background: "#fff",
                border: "1.5px solid #f1f5f9", fontSize: 14, fontWeight: 600, color: "#475569", lineHeight: 1.7,
                display: "flex", alignItems: "flex-start", gap: 12,
              }}>
                <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>?</span>
                {c}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 03. Root Cause ── */}
      <section style={{ padding: isMobile ? "80px 20px" : "120px 80px", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="sr2" style={{ ...sr2, marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "#6366f1", textTransform: "uppercase", marginBottom: 16 }}>Root Cause</div>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#0f172a", lineHeight: 1.3 }}>
              課題の根本は、<br />&quot;情報が紙や人に依存している&quot;こと。
            </h2>
          </div>
          <div className="al-challenges-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            {challenges.map((c, i) => (
              <div key={i} className="sr2" style={{ ...sr2, transitionDelay: `${i * 0.04}s`,
                padding: "20px 24px", borderRadius: 12, background: "#f8fafc",
                border: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 16,
              }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#6366f1", letterSpacing: "0.1em", flexShrink: 0 }}>#{c.num}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#334155" }}>{c.text}</span>
              </div>
            ))}
          </div>
          <div className="sr2" style={{ ...sr2, marginTop: 32, padding: "24px 28px", borderRadius: 16, background: "#ede9fe", textAlign: "center" }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#4c1d95", lineHeight: 1.8 }}>
              必要なのは単なるデジタル化ではなく、<br />
              &quot;会社の仕組みを次世代に引き継げる状態にすること&quot;です。
            </p>
          </div>
        </div>
      </section>

      {/* ── 04. Solutions ── */}
      <section style={{ padding: isMobile ? "80px 20px" : "120px 80px", background: "#0f172a" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="sr2" style={{ ...sr2, marginBottom: 64 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "rgba(99,102,241,0.8)", textTransform: "uppercase", marginBottom: 16 }}>Solutions</div>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#f8fafc", lineHeight: 1.3 }}>
              業務デジタル化から採用改善まで、<br />一体で支援します。
            </h2>
          </div>
          <div className="al-dev-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {solutions.map((d, i) => (
              <div key={i} className="sr2" style={{ ...sr2, transitionDelay: `${i * 0.06}s`,
                padding: "32px 28px", borderRadius: 20,
                background: "rgba(255,255,255,0.04)",
                border: "1.5px solid rgba(255,255,255,0.08)", transition: "all 0.3s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366f160"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(99,102,241,0.15)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#a78bfa", textTransform: "uppercase", marginBottom: 16,
                  padding: "4px 10px", borderRadius: 100, background: "rgba(99,102,241,0.12)", display: "inline-block" }}>{d.tag}</div>
                <div style={{ fontSize: 17, fontWeight: 800, color: "#f8fafc", marginBottom: 12, lineHeight: 1.4 }}>{d.title}</div>
                <div style={{ fontSize: 13, color: "rgba(248,250,252,0.5)", lineHeight: 1.8 }}>{d.desc}</div>
              </div>
            ))}
          </div>
          <div className="sr2" style={{ ...sr2, marginTop: 32, fontSize: 12, color: "rgba(255,255,255,0.35)", textAlign: "center" }}>
            ※ 必要な機能だけを組み合わせて、貴社専用のシステムとして構築します。
          </div>
        </div>
      </section>

      {/* ── 05. Use Cases ── */}
      <section style={{ padding: isMobile ? "80px 20px" : "120px 80px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="sr2" style={{ ...sr2, marginBottom: 64 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "#6366f1", textTransform: "uppercase", marginBottom: 16 }}>Use Cases</div>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#0f172a", lineHeight: 1.3 }}>
              業種ごとに、解決できる課題は変わる。
            </h2>
          </div>
          <div className="al-dept-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
            {useCases.map((d, i) => (
              <div key={i} className="sr2" style={{ ...sr2, transitionDelay: `${i * 0.08}s`,
                padding: "28px 20px", borderRadius: 16, background: "#fff",
                border: "1.5px solid #f1f5f9", textAlign: "center",
              }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{d.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>{d.industry}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7, marginBottom: 16, minHeight: 48 }}>{d.challenge}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {d.uses.map((u, j) => (
                    <div key={j} style={{ fontSize: 11, fontWeight: 600, padding: "4px 8px", borderRadius: 6,
                      background: "rgba(99,102,241,0.06)", color: "#6366f1" }}>{u}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="sr2" style={{ ...sr2, marginTop: 32, fontSize: 14, color: "#6366f1", fontWeight: 700, textAlign: "center" }}>
            業種・規模に合わせて、最適な組み合わせをご提案します。
          </div>
        </div>
      </section>

      {/* ── 06. Benefits ── */}
      <section style={{ padding: isMobile ? "80px 20px" : "120px 80px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="sr2" style={{ ...sr2, marginBottom: 64 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "#6366f1", textTransform: "uppercase", marginBottom: 16 }}>Benefits</div>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#0f172a", lineHeight: 1.3 }}>
              Before → Afterで変わること。
            </h2>
          </div>
          <div className="al-benefits-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {benefits.map((b, i) => (
              <div key={i} className="sr2" style={{ ...sr2, transitionDelay: `${i * 0.1}s`,
                padding: "36px 28px", borderRadius: 20, background: "#f8fafc",
                border: "1.5px solid #f1f5f9", textAlign: "center",
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 24 }}>{b.label}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                  <div style={{ fontSize: 12, color: "#94a3b8", padding: "8px 12px", borderRadius: 8, background: "#fff", border: "1px solid #e2e8f0" }}>
                    <span style={{ fontWeight: 700 }}>BEFORE</span>　{b.before}
                  </div>
                  <div style={{ fontSize: 18, color: "#6366f1" }}>↓</div>
                  <div style={{ fontSize: 12, color: "#059669", padding: "8px 12px", borderRadius: 8, background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                    <span style={{ fontWeight: 700 }}>AFTER</span>　{b.after}
                  </div>
                </div>
                <div style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, color: "#6366f1", letterSpacing: "-0.03em", lineHeight: 1 }}>
                  <Counter to={parseInt(b.metric)} suffix="%" />
                </div>
                <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, marginTop: 4 }}>{b.metricLabel}</div>
              </div>
            ))}
          </div>
          <div className="sr2 al-more-benefits" style={{ ...sr2, marginTop: 32, display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {moreBenefits.map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#475569", fontWeight: 600 }}>
                <span style={{ color: "#6366f1" }}>✓</span> {m}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 07. Development Policy ── */}
      <section style={{ padding: isMobile ? "80px 20px" : "120px 80px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div className="sr2" style={{ ...sr2, marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "#6366f1", textTransform: "uppercase", marginBottom: 16 }}>Policy</div>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#0f172a", lineHeight: 1.3 }}>
              大きく作る前に、<br />小さく試して改善します。
            </h2>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.9, marginTop: 16 }}>
              導入は最初から大規模に始める必要はありません。効果が出やすい業務から小さく始め、利用状況を見ながら改善・拡張します。
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {principles.map((p, i) => (
              <div key={i} className="sr2" style={{ ...sr2, transitionDelay: `${i * 0.05}s`,
                padding: "20px 24px", borderRadius: 12, background: "#fff",
                border: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 16,
              }}>
                <span style={{ fontSize: 13, fontWeight: 900, color: "#6366f1", flexShrink: 0, width: 28, textAlign: "center" }}>0{i + 1}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#334155" }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 08. Process ── */}
      <section style={{ padding: isMobile ? "80px 20px" : "120px 80px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="sr2" style={{ ...sr2, marginBottom: 64 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "#6366f1", textTransform: "uppercase", marginBottom: 16 }}>Process</div>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#0f172a", lineHeight: 1.3 }}>
              ヒアリング → 定着まで6ステップ
            </h2>
          </div>
          <div className="al-process-grid" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 2, position: "relative" }}>
            <div className="al-process-line" style={{
              position: "absolute", top: 28, left: "8%", right: "8%",
              height: 2, background: "linear-gradient(90deg, #6366f1, #a78bfa, #6366f1)", zIndex: 0,
            }} />
            {processSteps.map((p, i) => (
              <div key={i} className="sr2" style={{ ...sr2, transitionDelay: `${i * 0.1}s`,
                display: "flex", flexDirection: "column", alignItems: "center",
                textAlign: "center", padding: "0 8px", position: "relative", zIndex: 1,
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 20,
                  boxShadow: "0 4px 20px rgba(99,102,241,0.35)", border: "4px solid #fff",
                }}>{p.step}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>{p.title}</div>
                <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.7 }}>{p.body}</div>
              </div>
            ))}
          </div>
          <div className="sr2" style={{ ...sr2, marginTop: 32, fontSize: 14, color: "#6366f1", fontWeight: 700, textAlign: "center" }}>
            → 慣れるまで専任担当が伴走。現場で本当に使えるシステムに育てます。
          </div>
        </div>
      </section>

      {/* ── 09. Modules ── */}
      <section style={{ padding: isMobile ? "80px 20px" : "120px 80px", background: "#0f172a" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="sr2" style={{ ...sr2, marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "rgba(99,102,241,0.8)", textTransform: "uppercase", marginBottom: 16 }}>Scope</div>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#f8fafc", lineHeight: 1.3 }}>
              必要な機能を組み合わせて、<br />貴社専用のシステムを構築。
            </h2>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {modules.map((m, i) => (
              <div key={i} className="sr2" style={{ ...sr2, transitionDelay: `${(i % 8) * 0.05}s`,
                padding: "10px 20px", borderRadius: 100,
                border: "1.5px solid rgba(99,102,241,0.25)", color: "rgba(255,255,255,0.6)",
                fontSize: 13, fontWeight: 600, background: "rgba(99,102,241,0.08)",
                transition: "all 0.25s", cursor: "default",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.8)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(99,102,241,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.25)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; e.currentTarget.style.background = "rgba(99,102,241,0.08)"; }}
              >{m}</div>
            ))}
          </div>
          <div className="sr2" style={{ ...sr2, marginTop: 32, fontSize: 12, color: "rgba(255,255,255,0.35)", textAlign: "center" }}>
            既製ツールでは合わない部分を、自社専用に設計できます。
          </div>
        </div>
      </section>

      {/* ── 10. Pricing ── */}
      <section style={{ padding: isMobile ? "80px 20px" : "120px 80px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="sr2" style={{ ...sr2, marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "#6366f1", textTransform: "uppercase", marginBottom: 16 }}>Pricing</div>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#0f172a", lineHeight: 1.3 }}>
              3つの導入プラン
            </h2>
            <p style={{ fontSize: 14, color: "#64748b", marginTop: 12 }}>貴社の状況に合わせて、最適なプランをご提案します。</p>
          </div>

          {/* Campaign banner */}
          <div className="sr2" style={{ ...sr2, marginBottom: 32, padding: "14px 28px", borderRadius: 100,
            background: "linear-gradient(135deg, #ef4444, #dc2626)", textAlign: "center",
          }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "0.05em" }}>
              導入支援キャンペーン実施中 ─ 今なら特別価格でご提供しています
            </span>
          </div>

          <div className="al-pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {plans.map((p, i) => (
              <div key={i} className="sr2" style={{ ...sr2, transitionDelay: `${i * 0.08}s`,
                padding: "40px 28px", borderRadius: 20,
                background: p.popular ? "linear-gradient(135deg, #0f172a, #1e1b4b)" : "#fafafa",
                border: p.popular ? "2px solid #6366f1" : "1.5px solid #f1f5f9",
                position: "relative", textAlign: "center",
              }}>
                {p.popular && <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%) translateY(-50%)",
                  fontSize: 10, fontWeight: 700, padding: "4px 18px", borderRadius: 100,
                  background: "#6366f1", color: "#fff", letterSpacing: "0.1em" }}>RECOMMENDED</div>}
                <div style={{ fontSize: 11, fontWeight: 700, color: p.popular ? "#a78bfa" : "#6366f1", letterSpacing: "0.15em", marginBottom: 8 }}>{p.planLabel}</div>
                <div style={{ fontSize: 17, fontWeight: 800, color: p.popular ? "#f8fafc" : "#0f172a", marginBottom: 8 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: p.popular ? "rgba(255,255,255,0.45)" : "#94a3b8", marginBottom: 24, lineHeight: 1.6, minHeight: 36 }}>{p.desc}</div>

                {/* Original price with strikethrough */}
                <div style={{ fontSize: 14, color: p.popular ? "rgba(255,255,255,0.3)" : "#c0c0c0", textDecoration: "line-through", marginBottom: 4 }}>
                  {p.originalPrice}
                </div>
                {/* Campaign price */}
                <div style={{ fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 900, color: "#ef4444", marginBottom: 8, letterSpacing: "-0.02em" }}>
                  {p.campaignPrice}
                </div>
                <div style={{ fontSize: 11, color: p.popular ? "rgba(255,255,255,0.35)" : "#94a3b8", marginBottom: 24 }}>{p.note}</div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, textAlign: "left" }}>
                  {p.features.map((f, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: p.popular ? "rgba(255,255,255,0.6)" : "#64748b", lineHeight: 1.5 }}>
                      <span style={{ color: p.popular ? "#a78bfa" : "#6366f1", flexShrink: 0 }}>✓</span>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="sr2" style={{ ...sr2, marginTop: 24, fontSize: 12, color: "#94a3b8", textAlign: "center" }}>
            ※ 上記はすべて税別表記です。最終的な費用は対象業務や機能範囲に応じて個別にお見積もりいたします。<br />
            ※ 全プラン共通で月10時間以上の直接サポート付き。慣れるまで専任担当が伴走します。
          </div>
        </div>
      </section>

      {/* ── 11. Why Affordable ── */}
      <section style={{ padding: isMobile ? "80px 20px" : "120px 80px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div className="sr2" style={{ ...sr2, marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "#6366f1", textTransform: "uppercase", marginBottom: 16 }}>Why Affordable</div>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#0f172a", lineHeight: 1.3 }}>
              導入しやすい価格で提供できる理由。
            </h2>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.9, marginTop: 12 }}>
              安く作るのではなく、無駄を減らして必要なものから作ります。
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
            {whyAffordable.map((w, i) => (
              <div key={i} className="sr2" style={{ ...sr2, transitionDelay: `${i * 0.06}s`,
                padding: "24px 28px", borderRadius: 14, background: "#fff",
                border: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 20,
              }}>
                <span style={{ fontSize: 24, fontWeight: 900, color: "#6366f1", flexShrink: 0, width: 36, textAlign: "center" }}>{w.num}</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>{w.title}</div>
                  <div style={{ fontSize: 13, color: "#64748b" }}>{w.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 12. First Steps ── */}
      <section style={{ padding: isMobile ? "80px 20px" : "120px 80px", background: "#fff" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div className="sr2" style={{ ...sr2, marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "#6366f1", textTransform: "uppercase", marginBottom: 16 }}>First Steps</div>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#0f172a", lineHeight: 1.3 }}>
              まずは現状の整理から<br />始めます。
            </h2>
            <p style={{ fontSize: 14, color: "#64748b", marginTop: 12 }}>初回ご相談で以下をご提供します。</p>
          </div>
          <div className="al-steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            {firstSteps.map((s, i) => (
              <div key={i} className="sr2" style={{ ...sr2, transitionDelay: `${i * 0.06}s`,
                padding: "20px 24px", borderRadius: 12, background: "#f8fafc",
                border: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 16,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 800, color: "#fff", flexShrink: 0,
                }}>0{i + 1}</div>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#334155" }}>{s}</span>
              </div>
            ))}
          </div>
          <div className="sr2" style={{ ...sr2, marginTop: 32, fontSize: 14, color: "#6366f1", fontWeight: 700, textAlign: "center" }}>
            デジタル化が初めてでも、何から始めるかの整理からサポートします。
          </div>
        </div>
      </section>

      {/* ── 13. CTA ── */}
      <section style={{ padding: isMobile ? "80px 20px 100px" : "160px 80px", background: "#0f172a", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: 800, height: 800, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
          pointerEvents: "none", filter: "blur(40px)" }} />
        <div className="sr2" style={{ ...sr2, maxWidth: 720, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "rgba(99,102,241,0.8)", textTransform: "uppercase", marginBottom: 24 }}>Contact</div>
          <h2 style={{ fontSize: "clamp(28px, 5vw, 56px)", fontWeight: 900, letterSpacing: "-0.04em", color: "#f8fafc", lineHeight: 1.15, marginBottom: 24 }}>
            紙・Excel・属人化を、<br />次世代に引き継げる<br />仕組みに変えませんか。
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", lineHeight: 1.9, marginBottom: 48 }}>
            初回ご相談は無料です。<br />まずは現状の課題からお聞かせください。
          </p>

          <a href="/contact" style={{
            display: "inline-flex", alignItems: "center", gap: 10, fontSize: 15, fontWeight: 700,
            color: "#fff", background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            padding: "18px 40px", borderRadius: 100, textDecoration: "none",
            transition: "all 0.3s", boxShadow: "0 8px 32px rgba(99,102,241,0.35)",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(99,102,241,0.45)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(99,102,241,0.35)"; }}
          >無料相談を申し込む →</a>

          <div style={{ marginTop: 48, display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              ["ito.t@80grp.com", "EMAIL"],
              ["050-8896-5889", "PHONE"],
              ["rng-labs.com", "WEBSITE"],
            ].map(([val, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: "rgba(255,255,255,0.25)", marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: "#13151f", padding: isMobile ? "36px 20px" : "48px 80px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: "0.04em" }}>
          © 2025 合同会社80. All rights reserved.
        </div>
        <a href="/"><img src="/8.png" alt="80" style={{ height: 48, display: "block", opacity: 0.6 }} /></a>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .al-concerns-grid { grid-template-columns: 1fr !important; }
          .al-challenges-grid { grid-template-columns: 1fr !important; }
          .al-dev-grid { grid-template-columns: 1fr !important; }
          .al-dept-grid { grid-template-columns: 1fr 1fr !important; }
          .al-benefits-grid { grid-template-columns: 1fr !important; }
          .al-pricing-grid { grid-template-columns: 1fr !important; }
          .al-process-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 24px !important; }
          .al-process-line { display: none !important; }
          .al-steps-grid { grid-template-columns: 1fr !important; }
          .al-more-benefits { flex-direction: column !important; align-items: flex-start !important; }
        }
      `}</style>
    </div>
  );
}
