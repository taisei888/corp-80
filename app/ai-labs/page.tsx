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
    "AIで何ができるかそもそもわからない",
    "自社の業務にどう使えばいいの？",
    "導入費用が高そうで不安…",
    "社員が使いこなせる？ITが苦手な人も…",
    "既存システムとの連携が難しそう…",
    "どの業務から改善すべき？",
  ];

  const challenges = [
    { num: "01", text: "同じ質問が何度もくる" },
    { num: "02", text: "情報がバラバラ（紙・Excel・LINE）" },
    { num: "03", text: "担当者しかわからない業務" },
    { num: "04", text: "日報の確認に時間がかかる" },
    { num: "05", text: "顧客対応に時間が奪われる" },
    { num: "06", text: "入力・転記作業がとにかく多い" },
    { num: "07", text: "データはあるが活用できない" },
    { num: "08", text: "新人教育・引継ぎに時間がかかる" },
    { num: "09", text: "現場の状況が見えにくい" },
    { num: "10", text: "管理者の確認業務が多い" },
  ];

  const aiCanDo = [
    { num: "01", title: "社内問い合わせの自動回答" },
    { num: "02", title: "顧客問い合わせの一次対応" },
    { num: "03", title: "日報・報告書の自動要約" },
    { num: "04", title: "マニュアルや資料の検索" },
    { num: "05", title: "データの整理・分析" },
    { num: "06", title: "見積・提案・メール作成補助" },
    { num: "07", title: "営業履歴や顧客情報の整理" },
    { num: "08", title: "採用応募者の情報整理" },
    { num: "09", title: "アンケート・従業員の声の分析" },
    { num: "10", title: "業務フローの自動化" },
  ];

  const devExamples = [
    { num: "01", tag: "FAQ / MANUAL SEARCH", title: "社内FAQ・マニュアル検索AI", desc: "社内規程やマニュアルをAIが学習。チャットで質問するだけで即座に回答します。" },
    { num: "02", tag: "CUSTOMER SUPPORT", title: "問い合わせ対応AI", desc: "顧客からのよくある質問にAIが自動回答。解決しない場合は担当者にエスカレーション。" },
    { num: "03", tag: "DAILY REPORT", title: "日報・報告書 要約AI", desc: "日々の報告を自動で要約。管理者は3行サマリーで状況を把握できます。" },
    { num: "04", tag: "SALES SUPPORT", title: "営業支援AI", desc: "商談履歴から次のアクションを提案。見積もり作成もAIが補助します。" },
    { num: "05", tag: "DOCUMENT WRITING", title: "書類作成サポートAI", desc: "過去の見積書・提案書をAIが学習し、テンプレート生成や文面補完を行います。" },
    { num: "06", tag: "DATA VISUALIZATION", title: "データ分析・見える化", desc: "売上・顧客・業務データをダッシュボードで可視化。AIが傾向分析も行います。" },
    { num: "07", tag: "HR / ASSESSMENT", title: "採用・人事アセスメントAI", desc: "応募者情報の自動整理、面接メモの要約、アンケート分析をAIが担当。" },
  ];

  const departments = [
    { dept: "管理部", icon: "📋", challenge: "社内問い合わせ／書類確認／申請対応が多い", uses: ["社内FAQ", "申請ルール確認", "書類作成補助"] },
    { dept: "営業部", icon: "📈", challenge: "提案書作成／顧客管理／フォロー漏れ", uses: ["営業履歴整理", "提案文作成", "次回アクション提案"] },
    { dept: "人事部", icon: "👥", challenge: "採用対応／面接情報整理／従業員把握", uses: ["応募者整理", "面接メモ要約", "アンケート分析"] },
    { dept: "カスタマーサポート", icon: "💬", challenge: "同じ問い合わせが多い／対応品質にばらつき", uses: ["問い合わせAI", "回答候補作成", "対応履歴分析"] },
    { dept: "現場・店舗", icon: "🏪", challenge: "報告業務／マニュアル確認／情報共有", uses: ["日報要約", "マニュアル検索", "店舗状況の可視化"] },
  ];

  const benefits = [
    { label: "社内問い合わせ対応", before: "8時間/日", after: "1時間/日", metric: "-87%", metricLabel: "時間削減" },
    { label: "新人教育・引き継ぎ", before: "3週間（担当者頼み）", after: "3日", metric: "-85%", metricLabel: "時間削減" },
    { label: "顧客対応スピード", before: "24時間以内（担当者待ち）", after: "即時 24/365", metric: "24x", metricLabel: "レスポンス向上" },
  ];

  const moreBenefits = [
    "管理者の対応時間削減", "社内情報の活用", "属人化を防止",
    "報告内容を整理", "業務の抜け漏れ防止", "社内データ活用",
  ];

  const principles = [
    "課題を整理してから開発する",
    "使う人に合わせた画面を作る",
    "最初から複雑にしすぎない",
    "小さく作って早く試す",
    "実際の運用を見ながら改善する",
    "必要に応じて機能を追加する",
    "AIだけでなく、業務フロー全体を考える",
  ];

  const processSteps = [
    { step: "01", title: "ヒアリング", body: "業務内容、課題、改善したい作業を確認" },
    { step: "02", title: "業務整理・要件整理", body: "改善対象、システム化範囲、優先順位を整理" },
    { step: "03", title: "画面・機能設計", body: "使う人に合わせて画面と機能を設計" },
    { step: "04", title: "開発", body: "AI機能、管理画面、データ管理、連携機能を実装" },
    { step: "05", title: "テスト運用", body: "一部の部署で試験的に利用し使いやすさ確認" },
    { step: "06", title: "改善・本格運用", body: "利用状況をもとに改善し社内全体へ展開" },
  ];

  const modules = [
    "AIチャット機能", "管理画面", "ユーザー管理", "データ保存",
    "検索機能", "レポート自動作成", "通知機能", "LINE連携",
    "スプレッドシート連携", "顧客管理機能", "アンケート機能",
    "ダッシュボード", "権限管理", "履歴管理", "資料・マニュアル登録",
  ];

  const plans = [
    { name: "ライト開発", desc: "小規模AI機能、限定的な業務改善", price: "30〜80万円", features: ["単機能のAIチャット", "簡易な管理画面", "試作・PoCにも最適"], popular: false },
    { name: "スタンダード開発", desc: "社内向けAIシステム、管理画面、データ保存", price: "80〜200万円", features: ["社内AIシステム一式", "管理画面・データ管理", "基本的な業務フロー対応"], popular: true },
    { name: "カスタム開発", desc: "複数機能、外部連携、ダッシュボード", price: "200〜500万円", features: ["複数機能の統合システム", "外部サービス連携", "部署別管理・本格運用"], popular: false },
    { name: "保守・改善サポート", desc: "運用後の修正、改善提案、AI調整", price: "月額 2〜20万円", features: ["運用後の修正・改善", "軽微な機能追加", "AI回答精度の調整"], popular: false },
  ];

  const whyAffordable = [
    { num: "01", title: "開発工程にもAIを活用", desc: "効率的な作業フローでコストを圧縮" },
    { num: "02", title: "スタートアップ価格", desc: "実績作り重視の適正価格" },
    { num: "03", title: "必要な機能に絞って提案", desc: "過剰開発をしない" },
    { num: "04", title: "汎用構成を活用", desc: "既存の仕組み・テンプレートでコスト抑制" },
    { num: "05", title: "小さく作って改善", desc: "無駄な開発を回避するアジャイル方式" },
  ];

  const firstSteps = [
    "現在の業務課題のヒアリング",
    "AIで改善できる業務の洗い出し",
    "優先順位の整理",
    "小さく始められる開発案のご提案",
    "概算費用のご提示",
    "導入までのスケジュール案の作成",
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
            fontSize: isMobile ? "clamp(32px, 10vw, 48px)" : "clamp(48px, 6vw, 80px)",
            fontWeight: 900, letterSpacing: "-0.04em", color: "#f8fafc", lineHeight: 1.15, marginBottom: 32,
          }}>
            AIを、社内で使える<br />
            <span style={{ background: "linear-gradient(135deg, #6366f1, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              仕組みに。
            </span>
          </h1>

          <p style={{ fontSize: isMobile ? 14 : 17, color: "rgba(248,250,252,0.55)", lineHeight: 1.9, maxWidth: 520, marginBottom: 48 }}>
            企業ごとの課題に合わせて、専用システムを開発。<br />
            問い合わせ・日報・書類対応を効率化します。
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
              AIに興味はあるけれど、<br />何から始めたら？
            </h2>
            <p style={{ fontSize: 15, color: "#64748b", marginBottom: 48 }}>大切なのは「技術」ではなく、業務課題から考えること。</p>
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

      {/* ── 03. Challenges ── */}
      <section style={{ padding: isMobile ? "80px 20px" : "120px 80px", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="sr2" style={{ ...sr2, marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "#6366f1", textTransform: "uppercase", marginBottom: 16 }}>Challenges</div>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#0f172a", lineHeight: 1.3 }}>
              会社の中で起きている<br />&quot;あるある&quot;な業務課題
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
          <div className="sr2" style={{ ...sr2, marginTop: 32, fontSize: 14, color: "#6366f1", fontWeight: 700, textAlign: "center" }}>
            AIは、日々の業務に課題を感じている企業にこそ活用できる。
          </div>
        </div>
      </section>

      {/* ── 04. What AI Can Do ── */}
      <section style={{ padding: isMobile ? "80px 20px" : "120px 80px", background: "#0f172a" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="sr2" style={{ ...sr2, marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "rgba(99,102,241,0.8)", textTransform: "uppercase", marginBottom: 16 }}>What AI Can Do</div>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#f8fafc", lineHeight: 1.3 }}>
              AIは、「手間」「確認」「判断」<br />を助ける。
            </h2>
          </div>
          <div className="al-aican-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            {aiCanDo.map((a, i) => (
              <div key={i} className="sr2" style={{ ...sr2, transitionDelay: `${i * 0.04}s`,
                padding: "20px 24px", borderRadius: 12,
                background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.12)",
                display: "flex", alignItems: "center", gap: 16,
              }}>
                <span style={{ fontSize: 20, fontWeight: 900, color: "#6366f1", letterSpacing: "-0.02em", flexShrink: 0, width: 32, textAlign: "center" }}>{a.num}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(248,250,252,0.85)" }}>{a.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 05. Development Examples ── */}
      <section style={{ padding: isMobile ? "80px 20px" : "120px 80px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="sr2" style={{ ...sr2, marginBottom: 64 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "#6366f1", textTransform: "uppercase", marginBottom: 16 }}>Development Examples</div>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#0f172a", lineHeight: 1.3 }}>
              こんなAIシステムが作れます。
            </h2>
          </div>
          <div className="al-dev-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {devExamples.map((d, i) => (
              <div key={i} className="sr2" style={{ ...sr2, transitionDelay: `${i * 0.06}s`,
                padding: "32px 28px", borderRadius: 20, background: "#fafafa",
                border: "1.5px solid #f1f5f9", transition: "all 0.3s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366f160"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(99,102,241,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#f1f5f9"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#6366f1", textTransform: "uppercase", marginBottom: 16,
                  padding: "4px 10px", borderRadius: 100, background: "rgba(99,102,241,0.08)", display: "inline-block" }}>{d.tag}</div>
                <div style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", marginBottom: 12, lineHeight: 1.4 }}>{d.title}</div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.8 }}>{d.desc}</div>
              </div>
            ))}
          </div>
          <div className="sr2" style={{ ...sr2, marginTop: 32, fontSize: 12, color: "#94a3b8", textAlign: "center" }}>
            ※ 必要な機能だけを組み合わせて、専用システムとして構築します。
          </div>
        </div>
      </section>

      {/* ── 06. Department Use Cases ── */}
      <section style={{ padding: isMobile ? "80px 20px" : "120px 80px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="sr2" style={{ ...sr2, marginBottom: 64 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "#6366f1", textTransform: "uppercase", marginBottom: 16 }}>Use Cases</div>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#0f172a", lineHeight: 1.3 }}>
              部署ごとに、AIの使い方は変わる。
            </h2>
          </div>
          <div className="al-dept-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
            {departments.map((d, i) => (
              <div key={i} className="sr2" style={{ ...sr2, transitionDelay: `${i * 0.08}s`,
                padding: "28px 20px", borderRadius: 16, background: "#fff",
                border: "1.5px solid #f1f5f9", textAlign: "center",
              }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{d.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>{d.dept}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7, marginBottom: 16, minHeight: 40 }}>{d.challenge}</div>
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
            → 部署ごとの&quot;困りごと&quot;から逆算して、AIの使いどころを設計します。
          </div>
        </div>
      </section>

      {/* ── 07. Benefits ── */}
      <section style={{ padding: isMobile ? "80px 20px" : "120px 80px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="sr2" style={{ ...sr2, marginBottom: 64 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "#6366f1", textTransform: "uppercase", marginBottom: 16 }}>Benefits</div>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#0f172a", lineHeight: 1.3 }}>
              Before → Afterで、効果を見える化。
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
                  <Counter to={parseInt(b.metric.replace(/[^0-9]/g, ""))} suffix={b.metric.includes("x") ? "x" : "%"} />
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

      {/* ── 08. Development Policy ── */}
      <section style={{ padding: isMobile ? "80px 20px" : "120px 80px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div className="sr2" style={{ ...sr2, marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "#6366f1", textTransform: "uppercase", marginBottom: 16 }}>Policy</div>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#0f172a", lineHeight: 1.3 }}>
              大きく作る前に、<br />小さく試して改善します。
            </h2>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.9, marginTop: 16 }}>
              AI導入は最初から大規模に始める必要はありません。効果が出やすい業務から小さく始め、利用状況を見ながら改善・拡張します。
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

      {/* ── 09. Process ── */}
      <section style={{ padding: isMobile ? "80px 20px" : "120px 80px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="sr2" style={{ ...sr2, marginBottom: 64 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "#6366f1", textTransform: "uppercase", marginBottom: 16 }}>Process</div>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#0f172a", lineHeight: 1.3 }}>
              ヒアリング → 運用改善まで6ステップ
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
            → 運用後の改善まで伴走。現場で本当に使えるシステムに育てます。
          </div>
        </div>
      </section>

      {/* ── 10. Modules ── */}
      <section style={{ padding: isMobile ? "80px 20px" : "120px 80px", background: "#0f172a" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="sr2" style={{ ...sr2, marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "rgba(99,102,241,0.8)", textTransform: "uppercase", marginBottom: 16 }}>Scope</div>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#f8fafc", lineHeight: 1.3 }}>
              機能を組み合わせて、<br />専用システムとして開発。
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

      {/* ── 11. Pricing ── */}
      <section style={{ padding: isMobile ? "80px 20px" : "120px 80px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="sr2" style={{ ...sr2, marginBottom: 64 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "#6366f1", textTransform: "uppercase", marginBottom: 16 }}>Pricing</div>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#0f172a", lineHeight: 1.3 }}>
              料金は内容に応じてご相談
            </h2>
            <p style={{ fontSize: 14, color: "#64748b", marginTop: 12 }}>規模・機能・連携内容で変動 → 課題をお伺いした上でお見積もり</p>
          </div>
          <div className="al-pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {plans.map((p, i) => (
              <div key={i} className="sr2" style={{ ...sr2, transitionDelay: `${i * 0.08}s`,
                padding: "36px 24px", borderRadius: 20,
                background: p.popular ? "linear-gradient(135deg, #0f172a, #1e1b4b)" : "#fafafa",
                border: p.popular ? "2px solid #6366f1" : "1.5px solid #f1f5f9",
                position: "relative",
              }}>
                {p.popular && <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%) translateY(-50%)",
                  fontSize: 10, fontWeight: 700, padding: "3px 14px", borderRadius: 100,
                  background: "#6366f1", color: "#fff", letterSpacing: "0.08em" }}>POPULAR</div>}
                <div style={{ fontSize: 15, fontWeight: 800, color: p.popular ? "#f8fafc" : "#0f172a", marginBottom: 8 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: p.popular ? "rgba(255,255,255,0.45)" : "#94a3b8", marginBottom: 24, lineHeight: 1.6, minHeight: 40 }}>{p.desc}</div>
                <div style={{ fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 900, color: p.popular ? "#a78bfa" : "#6366f1", marginBottom: 24, letterSpacing: "-0.02em" }}>{p.price}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {p.features.map((f, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: p.popular ? "rgba(255,255,255,0.6)" : "#64748b", lineHeight: 1.5 }}>
                      <span style={{ color: p.popular ? "#a78bfa" : "#6366f1", flexShrink: 0 }}>✓</span>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="sr2" style={{ ...sr2, marginTop: 24, fontSize: 12, color: "#94a3b8", textAlign: "center" }}>
            ※ 上記はあくまで目安です。実際の料金は開発内容や運用範囲に応じて個別にご相談となります。
          </div>
        </div>
      </section>

      {/* ── 12. Why Affordable ── */}
      <section style={{ padding: isMobile ? "80px 20px" : "120px 80px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div className="sr2" style={{ ...sr2, marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "#6366f1", textTransform: "uppercase", marginBottom: 16 }}>Why Affordable</div>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#0f172a", lineHeight: 1.3 }}>
              導入しやすい形でご提案。
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

      {/* ── 13. First Steps ── */}
      <section style={{ padding: isMobile ? "80px 20px" : "120px 80px", background: "#fff" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div className="sr2" style={{ ...sr2, marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "#6366f1", textTransform: "uppercase", marginBottom: 16 }}>First Steps</div>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#0f172a", lineHeight: 1.3 }}>
              まずは「何ができるか」の<br />整理から始めます。
            </h2>
            <p style={{ fontSize: 14, color: "#64748b", marginTop: 12 }}>初回ご提案で6項目をご提供します。</p>
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
            AI導入が初めてでも、何ができるかの整理からサポートします。
          </div>
        </div>
      </section>

      {/* ── 14. CTA ── */}
      <section style={{ padding: isMobile ? "80px 20px 100px" : "160px 80px", background: "#0f172a", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: 800, height: 800, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
          pointerEvents: "none", filter: "blur(40px)" }} />
        <div className="sr2" style={{ ...sr2, maxWidth: 720, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "rgba(99,102,241,0.8)", textTransform: "uppercase", marginBottom: 24 }}>Contact</div>
          <h2 style={{ fontSize: "clamp(28px, 5vw, 56px)", fontWeight: 900, letterSpacing: "-0.04em", color: "#f8fafc", lineHeight: 1.15, marginBottom: 24 }}>
            AIを、現場で使える<br />業務改善システムに。
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
          .al-aican-grid { grid-template-columns: 1fr !important; }
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
