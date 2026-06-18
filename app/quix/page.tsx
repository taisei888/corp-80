"use client";

import { useEffect, useRef, useState } from "react";

// ── Scroll Reveal Hook ────────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".sr3");
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

// ── Chat Demo Component ───────────────────────────────────────────────────────
function ChatDemo() {
  const messages = [
    { role: "user", text: "育児休業の申請方法を教えてください" },
    { role: "ai", text: "育児休業の申請は以下の手順で行います。\n\n① 人事部へ申請書を提出（出産予定日の1ヶ月前まで）\n② 上長の承認を取得\n③ 社内ポータルで電子申請\n\n詳細は「育児・介護休業規程 第3条」をご参照ください。" },
    { role: "user", text: "リモートワーク申請はどうすれば？" },
    { role: "ai", text: "リモートワークの申請は毎週月曜日までに、Slackの #remote-request チャンネルに投稿してください。月最大15日まで利用可能です。" },
  ];

  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(v => v < messages.length ? v + 1 : v);
    }, 1200);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      background: "#fff", borderRadius: 20, border: "1.5px solid #e2e8f0",
      padding: "24px", boxShadow: "0 24px 80px rgba(0,0,0,0.08)",
      maxWidth: 480, width: "100%",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #f1f5f9" }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #10b981, #059669)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#fff", fontSize: 16, fontWeight: 900 }}>q</span>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>quix</div>
          <div style={{ fontSize: 11, color: "#10b981", fontWeight: 600 }}>● オンライン</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, minHeight: 200 }}>
        {messages.slice(0, visible).map((m, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: m.role === "user" ? "flex-end" : "flex-start",
            animation: "fadeSlideIn 0.4s ease both",
          }}>
            {m.role === "ai" && (
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #10b981, #059669)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: "#fff", marginRight: 8, flexShrink: 0, marginTop: 4 }}>q</div>
            )}
            <div style={{
              maxWidth: "78%", padding: "10px 16px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
              background: m.role === "user" ? "#0f172a" : "#f8fafc",
              color: m.role === "user" ? "#fff" : "#1e293b",
              fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-line",
              border: m.role === "ai" ? "1px solid #e2e8f0" : "none",
            }}>
              {m.text}
            </div>
          </div>
        ))}
        {visible < messages.length && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, paddingLeft: 36 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", animation: `bounce 1.2s ease ${i * 0.2}s infinite` }} />
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ marginTop: 16, display: "flex", gap: 8, padding: "10px 12px", borderRadius: 12, background: "#f8fafc", border: "1.5px solid #e2e8f0" }}>
        <input
          readOnly
          value="社内のことを何でも聞いてみてください…"
          style={{ flex: 1, border: "none", background: "transparent", fontSize: 13, color: "#94a3b8", outline: "none", fontFamily: "inherit" }}
        />
        <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg, #10b981, #059669)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#fff", fontSize: 14 }}>↑</span>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function QuixPage() {
  useScrollReveal();

  const sr3: React.CSSProperties = {
    opacity: 0,
    transform: "translateY(28px)",
    transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
  };

  const features = [
    {
      icon: "💬",
      title: "チャットで即回答",
      desc: "難しい検索は不要。話しかけるだけで、社内ドキュメントから最適な回答を瞬時に提示します。",
    },
    {
      icon: "📚",
      title: "あらゆる文書を学習",
      desc: "Word・PDF・Notion・Confluence・Slack など、散在する社内情報を一元的に取り込みます。",
    },
    {
      icon: "🔗",
      title: "出典付きで安心",
      desc: "回答には必ず元のドキュメントへのリンクを表示。情報の信頼性を担保します。",
    },
    {
      icon: "🔒",
      title: "セキュアな環境",
      desc: "社内データは外部のAIに学習されません。プライベートクラウドまたはオンプレでの運用に対応。",
    },
    {
      icon: "📊",
      title: "利用分析ダッシュボード",
      desc: "よく聞かれる質問・未回答の質問を可視化。ナレッジのギャップを継続的に改善できます。",
    },
    {
      icon: "⚡",
      title: "最短2週間で導入",
      desc: "既存ツールへのSSO連携と文書取り込みを含め、最短2週間で本番環境を構築します。",
    },
  ];

  const usecases = [
    { dept: "人事・総務", q: "「育休の申請方法は？」", a: "規程・フォームへ即アクセス" },
    { dept: "営業", q: "「製品Aの最新価格表は？」", a: "最新資料を自動参照" },
    { dept: "エンジニア", q: "「デプロイ手順を教えて」", a: "手順書を要約して回答" },
    { dept: "新入社員", q: "「経費精算はどこから？」", a: "フローをステップ解説" },
  ];

  const stats = [
    { val: 70, suffix: "%", label: "問い合わせ工数削減" },
    { val: 3, suffix: "秒", label: "平均回答時間" },
    { val: 2, suffix: "週", label: "最短導入期間" },
    { val: 99, suffix: "%", label: "回答精度" },
  ];

  return (
    <div style={{ fontFamily: "inherit", background: "#fff", color: "#0f172a", overflowX: "hidden" }}>

      {/* ── Nav ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(255,255,255,0.88)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(15,23,42,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 48px", height: 64,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg, #10b981, #059669)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: 16, fontWeight: 900 }}>q</span>
          </div>
          <span style={{ fontSize: 18, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.04em" }}>quix</span>
          <span style={{ width: 1, height: 16, background: "#e2e8f0" }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>by 合同会社80</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a
            href="#contact"
            style={{
              fontSize: 13, fontWeight: 700, color: "#fff",
              background: "linear-gradient(135deg, #10b981, #059669)",
              padding: "9px 22px", borderRadius: 100,
              textDecoration: "none", transition: "all 0.2s",
              boxShadow: "0 4px 16px rgba(16,185,129,0.3)",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
          >
            無料デモを見る
          </a>
          <a
            href="/"
            style={{
              fontSize: 13, fontWeight: 600, color: "#475569", textDecoration: "none",
              padding: "8px 18px", borderRadius: 100, border: "1.5px solid #e2e8f0",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#94a3b8"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; }}
          >
            ← 戻る
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        minHeight: "100vh",
        padding: "140px 80px 100px",
        background: "linear-gradient(160deg, #f0fdf9 0%, #ecfdf5 50%, #f0fdf4 100%)",
        display: "flex", alignItems: "center",
        position: "relative", overflow: "hidden",
      }}>
        {/* BG circles */}
        <div style={{ position: "absolute", top: "15%", right: "5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "0%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(5,150,105,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", width: "100%" }}>
          {/* Left */}
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "#059669",
              textTransform: "uppercase", marginBottom: 32,
              padding: "6px 16px", borderRadius: 100,
              border: "1.5px solid rgba(16,185,129,0.3)",
              background: "rgba(16,185,129,0.07)",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block", animation: "pulse 2s ease infinite" }} />
              社内AIナレッジ検索
            </div>

            <h1 style={{
              fontSize: "clamp(44px, 6.5vw, 88px)",
              fontWeight: 900, letterSpacing: "-0.05em",
              color: "#0f172a", lineHeight: 1.0, marginBottom: 32,
            }}>
              社内の知識を、<br />
              <span style={{ color: "#10b981" }}>チャットで</span><br />
              引き出す。
            </h1>

            <p style={{ fontSize: "clamp(15px, 1.6vw, 18px)", color: "#475569", lineHeight: 1.9, maxWidth: 480, marginBottom: 48 }}>
              FAQ・規程・マニュアルに何度も答えるのは、もう終わり。<br />
              quixが社内の知識を学習し、チャットで即座に回答します。
            </p>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <a
                href="#contact"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  fontSize: 14, fontWeight: 700, color: "#fff",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  padding: "16px 32px", borderRadius: 100,
                  textDecoration: "none", transition: "all 0.3s",
                  boxShadow: "0 8px 32px rgba(16,185,129,0.35)",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(16,185,129,0.45)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(16,185,129,0.35)"; }}
              >
                無料デモを申し込む →
              </a>
              <a
                href="#features"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  fontSize: 14, fontWeight: 600, color: "#475569",
                  padding: "16px 32px", borderRadius: 100,
                  textDecoration: "none", border: "2px solid #d1fae5",
                  transition: "all 0.3s", background: "#fff",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#10b981"; e.currentTarget.style.color = "#059669"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#d1fae5"; e.currentTarget.style.color = "#475569"; }}
              >
                機能を見る
              </a>
            </div>
          </div>

          {/* Right — Chat Demo */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ChatDemo />
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ background: "#0f172a", padding: "72px 80px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 40 }}>
          {stats.map((s, i) => (
            <div key={i} className="sr3" style={{ ...sr3, textAlign: "center", transitionDelay: `${i * 0.1}s` }}>
              <div style={{ fontSize: "clamp(40px, 5vw, 60px)", fontWeight: 900, color: "#10b981", letterSpacing: "-0.04em", lineHeight: 1 }}>
                <Counter to={s.val} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.4)", marginTop: 10, letterSpacing: "0.06em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" style={{ padding: "140px 80px", background: "#fff" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div className="sr3" style={{ ...sr3, marginBottom: 80, textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "#10b981", textTransform: "uppercase", marginBottom: 16 }}>Features</div>
            <h2 style={{ fontSize: "clamp(32px, 4.5vw, 64px)", fontWeight: 900, letterSpacing: "-0.04em", color: "#0f172a", lineHeight: 1.05 }}>
              quixができること
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {features.map((f, i) => (
              <div
                key={i}
                className="sr3"
                style={{
                  ...sr3, transitionDelay: `${i * 0.08}s`,
                  padding: "36px 32px", borderRadius: 20,
                  border: "1.5px solid #f1f5f9", background: "#fafafa",
                  transition: "all 0.3s", cursor: "default",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "rgba(16,185,129,0.4)";
                  e.currentTarget.style.background = "#fff";
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "0 16px 48px rgba(16,185,129,0.1)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "#f1f5f9";
                  e.currentTarget.style.background = "#fafafa";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 20 }}>{f.icon}</div>
                <div style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", marginBottom: 12, letterSpacing: "-0.02em" }}>{f.title}</div>
                <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.8 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Use Cases ── */}
      <section style={{ padding: "120px 80px", background: "linear-gradient(160deg, #f0fdf9, #f8fafc)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div className="sr3" style={{ ...sr3, marginBottom: 72 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "#10b981", textTransform: "uppercase", marginBottom: 16 }}>Use Cases</div>
            <h2 style={{ fontSize: "clamp(32px, 4.5vw, 64px)", fontWeight: 900, letterSpacing: "-0.04em", color: "#0f172a", lineHeight: 1.05 }}>
              こんな場面で使われています
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
            {usecases.map((u, i) => (
              <div
                key={i}
                className="sr3"
                style={{
                  ...sr3, transitionDelay: `${i * 0.1}s`,
                  padding: "32px 36px", borderRadius: 20,
                  background: "#fff", border: "1.5px solid #e2e8f0",
                  display: "flex", gap: 24, alignItems: "flex-start",
                  transition: "all 0.3s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "#10b981";
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(16,185,129,0.1)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{
                  flexShrink: 0, padding: "6px 14px", borderRadius: 100,
                  background: "rgba(16,185,129,0.1)", fontSize: 12, fontWeight: 700,
                  color: "#059669", whiteSpace: "nowrap",
                }}>
                  {u.dept}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>{u.q}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "#10b981", fontSize: 16 }}>→</span>
                    <span style={{ fontSize: 14, color: "#64748b" }}>{u.a}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ padding: "140px 80px", background: "#fff" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div className="sr3" style={{ ...sr3, marginBottom: 80 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "#10b981", textTransform: "uppercase", marginBottom: 16 }}>How it works</div>
            <h2 style={{ fontSize: "clamp(32px, 4.5vw, 64px)", fontWeight: 900, letterSpacing: "-0.04em", color: "#0f172a", lineHeight: 1.05 }}>
              導入の流れ
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, position: "relative" }}>
            <div style={{
              position: "absolute", top: 28, left: "16%", right: "16%",
              height: 2, background: "linear-gradient(90deg, #10b981, #059669, #0d9488)",
              zIndex: 0,
            }} />
            {[
              { step: "01", title: "文書を取り込む", body: "PDF・Word・Notion・Confluenceなど既存のドキュメントを接続。AIが自動的に整理・学習します。" },
              { step: "02", title: "チャットで質問", body: "Slack・Microsoft Teams・専用Webアプリから、自然な言葉で質問するだけ。特別な操作は不要です。" },
              { step: "03", title: "即座に回答", body: "AIが関連ドキュメントを検索し、出典付きで回答。不明点はフォローアップ質問でさらに深掘りできます。" },
            ].map((p, i) => (
              <div
                key={i}
                className="sr3"
                style={{
                  ...sr3, transitionDelay: `${i * 0.12}s`,
                  display: "flex", flexDirection: "column", alignItems: "center",
                  textAlign: "center", padding: "0 32px", position: "relative", zIndex: 1,
                }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 800, color: "#fff",
                  marginBottom: 32, boxShadow: "0 4px 20px rgba(16,185,129,0.35)",
                  border: "4px solid #fff",
                }}>
                  {p.step}
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 14 }}>{p.title}</div>
                <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.8 }}>{p.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="contact" style={{
        padding: "160px 80px",
        background: "linear-gradient(160deg, #0f172a 0%, #064e3b 100%)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div className="sr3" style={{ ...sr3, maxWidth: 680, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "#34d399", textTransform: "uppercase", marginBottom: 24 }}>Get Started</div>
          <h2 style={{ fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 900, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1.1, marginBottom: 24 }}>
            まずは無料デモで<br />体験してください
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.9, marginBottom: 56 }}>
            実際の社内ドキュメントを使ったデモをご覧いただけます。<br />
            導入費用・期間・セキュリティについても詳しくご説明します。
          </p>

          <a
            href="https://rng-labs.com/#contact"
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              fontSize: 15, fontWeight: 700, color: "#0f172a",
              background: "#fff",
              padding: "18px 44px", borderRadius: 100,
              textDecoration: "none", transition: "all 0.3s",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.2)"; }}
          >
            無料デモを申し込む →
          </a>

          <div style={{ marginTop: 48, display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap" }}>
            {["初回デモ無料", "最短2週間で導入", "秘密保持契約対応"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>
                <span style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(52,211,153,0.2)", border: "1.5px solid #34d399", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#34d399" }}>✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: "#020617", padding: "40px 80px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: "0.04em" }}>
          © 2025 合同会社80. All rights reserved.
        </div>
        <a href="/"><img src="/8.png" alt="80" style={{ height: 28, display: "block", opacity: 0.4 }} /></a>
      </footer>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
