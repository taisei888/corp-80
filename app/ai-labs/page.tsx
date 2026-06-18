"use client";

import { useEffect, useRef, useState } from "react";

// ── Scroll Reveal Hook ────────────────────────────────────────────────────────
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
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ── Animated Counter ──────────────────────────────────────────────────────────
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

// ── Typing Text ───────────────────────────────────────────────────────────────
function TypingText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setDisplayed(text.slice(0, ++i));
      if (i >= text.length) clearInterval(id);
    }, 60);
    return () => clearInterval(id);
  }, [text]);
  return (
    <span>
      {displayed}
      <span style={{ opacity: displayed.length < text.length ? 1 : 0, transition: "opacity 0.3s" }}>|</span>
    </span>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AILabsPage() {
  useScrollReveal();
  const [activeService, setActiveService] = useState(0);

  const sr2: React.CSSProperties = {
    opacity: 0,
    transform: "translateY(32px)",
    transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
  };

  const services = [
    {
      num: "01",
      title: "AI 導入支援",
      sub: "Consulting & Implementation",
      color: "#6366f1",
      desc: "現状分析から導入計画、実装、定着まで一気通貫でサポート。貴社の業務フローに最適なAI活用を設計します。",
      details: [
        { label: "現状ヒアリング & 課題整理", body: "業務フロー・ボトルネック・データ環境を丁寧にヒアリングし、AI化による効果を試算します。" },
        { label: "PoC（概念実証）設計", body: "本番投資前に小さく試す。2〜4週間のPoCで効果を可視化し、経営判断を支援します。" },
        { label: "導入ロードマップ策定", body: "短期・中期・長期の優先順位を整理し、リスクを最小化した段階的な展開計画を作成します。" },
        { label: "定着支援 & 効果測定", body: "導入後の運用定着まで伴走。KPIを設定し、継続的な改善サイクルを構築します。" },
      ],
    },
    {
      num: "02",
      title: "AI 受託開発",
      sub: "Custom AI Development",
      color: "#8b5cf6",
      desc: "LLM・RAG・業務自動化・データ分析など、貴社専用のAIシステムをフルカスタムで開発。現場に本当に使われるものを届けます。",
      details: [
        { label: "LLM / RAG システム構築", body: "社内ドキュメントをAIに学習させるRAGシステムや、業務特化型チャットボットを開発します。" },
        { label: "業務自動化 (RPA × AI)", body: "反復作業・書類処理・メール対応など、AIとRPAを組み合わせた高度な自動化を実現します。" },
        { label: "データ分析 & 予測モデル", body: "売上予測・異常検知・顧客分析など、蓄積されたデータから意思決定を支える予測AIを構築します。" },
        { label: "API 連携 & システム統合", body: "既存の基幹システム・CRM・SaaSとAIをシームレスに連携。既存資産を活かした開発を行います。" },
      ],
    },
    {
      num: "03",
      title: "AI 学習支援",
      sub: "Education & Training",
      color: "#06b6d4",
      desc: "経営層から現場担当者まで、それぞれのレベルに合わせたAI研修・ワークショップを提供。組織全体のAIリテラシーを底上げします。",
      details: [
        { label: "AI リテラシー研修", body: "ChatGPT・Copilotなど生成AIツールの実践的な活用方法を、業種・職種別にカスタマイズして研修します。" },
        { label: "プロンプトエンジニアリング講座", body: "AIから高品質なアウトプットを引き出すプロンプト設計を、実演・演習形式で習得します。" },
        { label: "技術者向け LLM 開発講座", body: "OpenAI API・LangChain・ベクターDBなど、開発者がAIアプリを構築するための実践的なハンズオン研修です。" },
        { label: "経営 × AI 戦略セッション", body: "AI時代の経営戦略・競合優位性の作り方を、具体的な事例とともにエグゼクティブ向けに解説します。" },
      ],
    },
  ];

  const stats = [
    { val: 30, suffix: "+", label: "導入支援実績" },
    { val: 70, suffix: "%", label: "平均工数削減率" },
    { val: 48, suffix: "h", label: "最短納品" },
    { val: 98, suffix: "%", label: "顧客継続率" },
  ];

  const process = [
    { step: "01", title: "無料相談", body: "ご要望・課題を60分でヒアリング。最適なアプローチをご提案します。" },
    { step: "02", title: "提案 & 見積", body: "要件を整理し、スコープ・スケジュール・費用感を明示した提案書をご提出します。" },
    { step: "03", title: "開発 & 検証", body: "アジャイルに開発。定期的なデモで認識合わせをしながら進めます。" },
    { step: "04", title: "納品 & 伴走", body: "本番リリース後も継続サポート。運用定着まで責任を持って伴走します。" },
  ];

  return (
    <div style={{ fontFamily: "inherit", background: "#fff", color: "#0f172a", overflowX: "hidden" }}>

      {/* ── Nav ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(15,23,42,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 48px", height: 64,
      }}>
        <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/7.png" alt="80" style={{ height: 26, display: "block" }} />
          <span style={{ width: 1, height: 16, background: "#e2e8f0" }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: "#6366f1", letterSpacing: "0.1em", textTransform: "uppercase" }}>AI Labs</span>
        </a>
        <a
          href="/#works"
          style={{
            fontSize: 13, fontWeight: 600, color: "#475569", textDecoration: "none",
            padding: "8px 20px", borderRadius: 100, border: "1.5px solid #e2e8f0",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.color = "#6366f1"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#475569"; }}
        >
          ← 戻る
        </a>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "flex-start",
        padding: "120px 80px 80px",
        background: "linear-gradient(160deg, #f8fafc 0%, #f0f4ff 60%, #e8eeff 100%)",
        position: "relative", overflow: "hidden",
      }}>
        {/* BG grid lines */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.25,
          backgroundImage: "linear-gradient(#6366f120 1px, transparent 1px), linear-gradient(90deg, #6366f120 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          pointerEvents: "none",
        }} />
        {/* Glow blob */}
        <div style={{
          position: "absolute", top: "20%", right: "10%",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 900, position: "relative" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "#6366f1",
            textTransform: "uppercase", marginBottom: 32,
            padding: "6px 16px", borderRadius: 100,
            border: "1.5px solid rgba(99,102,241,0.3)",
            background: "rgba(99,102,241,0.06)",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", display: "inline-block" }} />
            AI Labs — 合同会社80
          </div>

          <h1 style={{
            fontSize: "clamp(52px, 8vw, 112px)",
            fontWeight: 900, letterSpacing: "-0.05em",
            color: "#0f172a", lineHeight: 1.0, marginBottom: 40,
          }}>
            <TypingText text="AIを、現場に。" />
          </h1>

          <p style={{ fontSize: "clamp(16px, 1.8vw, 20px)", color: "#475569", lineHeight: 1.9, maxWidth: 560, marginBottom: 56 }}>
            AI導入支援・受託開発・学習支援を通じて、<br />
            企業のAI活用を戦略から実装まで一気通貫でサポートします。
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a
              href="#services"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                fontSize: 14, fontWeight: 700, color: "#fff",
                background: "#6366f1", padding: "16px 32px", borderRadius: 100,
                textDecoration: "none", transition: "all 0.3s",
                boxShadow: "0 8px 32px rgba(99,102,241,0.35)",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(99,102,241,0.45)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(99,102,241,0.35)"; }}
            >
              サービスを見る
              <span style={{ fontSize: 18 }}>↓</span>
            </a>
            <a
              href="#contact"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                fontSize: 14, fontWeight: 700, color: "#0f172a",
                background: "transparent", padding: "16px 32px", borderRadius: 100,
                textDecoration: "none", border: "2px solid #e2e8f0", transition: "all 0.3s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#0f172a"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; }}
            >
              無料相談する
            </a>
          </div>
        </div>

        {/* scroll indicator */}
        <div style={{
          position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", color: "#94a3b8", textTransform: "uppercase" }}>Scroll</div>
          <div style={{
            width: 1, height: 40, background: "linear-gradient(to bottom, #94a3b8, transparent)",
            animation: "scrollPulse 2s ease-in-out infinite",
          }} />
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ background: "#0f172a", padding: "80px 80px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 48 }}>
          {stats.map((s, i) => (
            <div key={i} className="sr2" style={{ ...sr2, textAlign: "center", transitionDelay: `${i * 0.1}s` }}>
              <div style={{ fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>
                <Counter to={s.val} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.4)", marginTop: 12, letterSpacing: "0.06em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" style={{ padding: "140px 80px", background: "#fff" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>

          <div className="sr2" style={{ ...sr2, marginBottom: 80 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "#6366f1", textTransform: "uppercase", marginBottom: 16 }}>Services</div>
            <h2 style={{ fontSize: "clamp(36px, 5vw, 72px)", fontWeight: 900, letterSpacing: "-0.04em", color: "#0f172a", lineHeight: 1.05 }}>
              3つの支援領域
            </h2>
          </div>

          {/* Service Tab Nav */}
          <div className="sr2" style={{ ...sr2, display: "flex", gap: 8, marginBottom: 64, transitionDelay: "0.1s" }}>
            {services.map((s, i) => (
              <button
                key={i}
                onClick={() => setActiveService(i)}
                style={{
                  padding: "10px 24px", borderRadius: 100, border: "none", cursor: "pointer",
                  fontSize: 13, fontWeight: 700, fontFamily: "inherit",
                  background: activeService === i ? s.color : "transparent",
                  color: activeService === i ? "#fff" : "#94a3b8",
                  outline: activeService === i ? "none" : "1.5px solid #e2e8f0",
                  transition: "all 0.25s",
                }}
              >
                {s.num} {s.title}
              </button>
            ))}
          </div>

          {/* Active Service Detail */}
          {services.map((s, i) => (
            <div
              key={i}
              style={{
                display: i === activeService ? "grid" : "none",
                gridTemplateColumns: "1fr 1fr",
                gap: 64, alignItems: "start",
              }}
            >
              {/* Left */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: s.color, textTransform: "uppercase", marginBottom: 16 }}>{s.sub}</div>
                <h3 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 900, letterSpacing: "-0.04em", color: "#0f172a", lineHeight: 1.1, marginBottom: 24 }}>{s.title}</h3>
                <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.9, marginBottom: 40 }}>{s.desc}</p>
                <a
                  href="#contact"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    fontSize: 14, fontWeight: 700, color: "#fff",
                    background: s.color, padding: "14px 28px", borderRadius: 100,
                    textDecoration: "none", transition: "all 0.3s",
                    boxShadow: `0 8px 24px ${s.color}50`,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  このサービスについて相談する →
                </a>
              </div>

              {/* Right — detail list */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {s.details.map((d, j) => (
                  <div
                    key={j}
                    style={{
                      padding: "28px 32px", borderRadius: 16,
                      border: "1.5px solid #f1f5f9",
                      background: "#fafafa",
                      transition: "all 0.3s", cursor: "default",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = s.color + "60";
                      e.currentTarget.style.background = "#fff";
                      e.currentTarget.style.transform = "translateX(6px)";
                      e.currentTarget.style.boxShadow = `0 4px 24px ${s.color}15`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = "#f1f5f9";
                      e.currentTarget.style.background = "#fafafa";
                      e.currentTarget.style.transform = "translateX(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: "50%", background: s.color,
                        marginTop: 6, flexShrink: 0,
                      }} />
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>{d.label}</div>
                        <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.8 }}>{d.body}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* All 3 cards preview */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 80 }}>
            {services.map((s, i) => (
              <div
                key={i}
                className="sr2"
                onClick={() => setActiveService(i)}
                style={{
                  ...sr2, transitionDelay: `${i * 0.1}s`,
                  padding: "36px 32px", borderRadius: 20,
                  border: `2px solid ${i === activeService ? s.color : "#f1f5f9"}`,
                  background: i === activeService ? `linear-gradient(135deg, ${s.color}08, ${s.color}15)` : "#fafafa",
                  cursor: "pointer", transition: "all 0.3s",
                }}
                onMouseEnter={e => {
                  if (i !== activeService) {
                    e.currentTarget.style.borderColor = s.color + "60";
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }
                }}
                onMouseLeave={e => {
                  if (i !== activeService) {
                    e.currentTarget.style.borderColor = "#f1f5f9";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: s.color, letterSpacing: "0.2em", marginBottom: 12 }}>{s.num}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 10, letterSpacing: "-0.02em" }}>{s.title}</div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7 }}>{s.desc.slice(0, 48)}…</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section style={{ padding: "140px 80px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div className="sr2" style={{ ...sr2, marginBottom: 80 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "#6366f1", textTransform: "uppercase", marginBottom: 16 }}>Process</div>
            <h2 style={{ fontSize: "clamp(36px, 5vw, 72px)", fontWeight: 900, letterSpacing: "-0.04em", color: "#0f172a", lineHeight: 1.05 }}>
              進め方
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, position: "relative" }}>
            {/* connector line */}
            <div style={{
              position: "absolute", top: 28, left: "12.5%", right: "12.5%",
              height: 2, background: "linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)",
              zIndex: 0,
            }} />
            {process.map((p, i) => (
              <div
                key={i}
                className="sr2"
                style={{
                  ...sr2, transitionDelay: `${i * 0.12}s`,
                  display: "flex", flexDirection: "column", alignItems: "center",
                  textAlign: "center", padding: "0 24px",
                  position: "relative", zIndex: 1,
                }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 800, color: "#fff",
                  marginBottom: 28, boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
                  border: "4px solid #f8fafc",
                }}>
                  {p.step}
                </div>
                <div style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>{p.title}</div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.8 }}>{p.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Technologies ── */}
      <section style={{ padding: "120px 80px", background: "#0f172a", overflow: "hidden" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div className="sr2" style={{ ...sr2, marginBottom: 64, textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "rgba(99,102,241,0.8)", textTransform: "uppercase", marginBottom: 16 }}>Tech Stack</div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1.1 }}>
              活用技術・ツール
            </h2>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            {[
              "OpenAI GPT-4o", "Claude 3.5", "LangChain", "LlamaIndex",
              "RAG", "Pinecone", "Supabase Vector", "Next.js",
              "Python", "FastAPI", "n8n", "Make (Integromat)",
              "Vercel", "AWS", "GCP", "Notion AI",
            ].map((t, i) => (
              <div
                key={i}
                className="sr2"
                style={{
                  ...sr2, transitionDelay: `${(i % 8) * 0.06}s`,
                  padding: "10px 20px", borderRadius: 100,
                  border: "1.5px solid rgba(99,102,241,0.25)",
                  color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 600,
                  background: "rgba(99,102,241,0.08)",
                  transition: "all 0.25s",
                  cursor: "default",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "rgba(99,102,241,0.8)";
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.background = "rgba(99,102,241,0.2)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "rgba(99,102,241,0.25)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                  e.currentTarget.style.background = "rgba(99,102,241,0.08)";
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA / Contact ── */}
      <section id="contact" style={{ padding: "160px 80px", background: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: 800, height: 800, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div className="sr2" style={{ ...sr2, maxWidth: 720, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "#6366f1", textTransform: "uppercase", marginBottom: 24 }}>Contact</div>
          <h2 style={{ fontSize: "clamp(36px, 5vw, 72px)", fontWeight: 900, letterSpacing: "-0.04em", color: "#0f172a", lineHeight: 1.1, marginBottom: 24 }}>
            まずは無料相談から
          </h2>
          <p style={{ fontSize: 17, color: "#475569", lineHeight: 1.9, marginBottom: 56 }}>
            AI活用に関するお悩みやご相談を60分でお聞きします。<br />
            費用・スコープ・技術的な疑問、何でもお気軽にどうぞ。
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="https://rng-labs.com/#contact"
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                fontSize: 15, fontWeight: 700, color: "#fff",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                padding: "18px 40px", borderRadius: 100,
                textDecoration: "none", transition: "all 0.3s",
                boxShadow: "0 8px 32px rgba(99,102,241,0.35)",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(99,102,241,0.45)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(99,102,241,0.35)"; }}
            >
              無料相談を申し込む
              <span>→</span>
            </a>
          </div>

          <div style={{ marginTop: 48, display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap" }}>
            {["初回60分無料", "秘密保持契約対応", "翌日以内に返信"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#64748b", fontWeight: 600 }}>
                <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#f0fdf4", border: "1.5px solid #86efac", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#16a34a" }}>✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: "#0f172a", padding: "48px 80px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: "0.04em" }}>
          © 2025 合同会社80. All rights reserved.
        </div>
        <a href="/"><img src="/8.png" alt="80" style={{ height: 28, display: "block", opacity: 0.6 }} /></a>
      </footer>

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 1; transform: scaleY(1); }
          50% { opacity: 0.4; transform: scaleY(0.7); }
        }
      `}</style>
    </div>
  );
}
