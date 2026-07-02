"use client";

import { useEffect, useRef, useState } from "react";

// ── Scroll Reveal ────────────────────────────────────────────────────────────
function useSR() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { (e.target as HTMLElement).style.opacity = "1"; (e.target as HTMLElement).style.transform = "translateY(0)"; io.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".qsr").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ── Counter ──────────────────────────────────────────────────────────────────
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      let s = 0;
      const step = Math.ceil(to / 50);
      const id = setInterval(() => { s = Math.min(s + step, to); setVal(s); if (s >= to) clearInterval(id); }, 25);
    }, { threshold: 0.5 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ── App Screen Mock: Chat ────────────────────────────────────────────────────
function ChatScreenMock() {
  const msgs = [
    { role: "user" as const, text: "育児休業の申請方法を教えてください" },
    { role: "ai" as const, text: "育児休業の申請は以下の手順で行います。\n\n① 人事部へ申請書を提出（出産予定日の1ヶ月前まで）\n② 上長の承認を取得\n③ 社内ポータルで電子申請\n\n詳細は「育児・介護休業規程 第3条」をご参照ください。" },
    { role: "user" as const, text: "リモートワーク申請はどうすれば？" },
    { role: "ai" as const, text: "リモートワークの申請は毎週月曜日までに、Slackの #remote-request チャンネルに投稿してください。月最大15日まで利用可能です。" },
  ];
  const [vis, setVis] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setVis(v => v < msgs.length ? v + 1 : v), 1200);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      background: "#fff", borderRadius: 24, overflow: "hidden",
      boxShadow: "0 32px 80px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)",
      width: "100%", maxWidth: 440,
    }}>
      {/* Window bar */}
      <div style={{ padding: "14px 18px", background: "#f8fafb", borderBottom: "1px solid #eef2f6", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", letterSpacing: "0.04em" }}>quix — チャット</span>
        </div>
      </div>

      {/* Chat area */}
      <div style={{ padding: "20px 18px", minHeight: 260, display: "flex", flexDirection: "column", gap: 10 }}>
        {msgs.slice(0, vis).map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", animation: "q-fade-in 0.4s ease both" }}>
            {m.role === "ai" && (
              <div style={{ width: 26, height: 26, borderRadius: 8, background: "linear-gradient(135deg, #10b981, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "#fff", marginRight: 8, flexShrink: 0, marginTop: 3 }}>q</div>
            )}
            <div style={{
              maxWidth: "75%", padding: "10px 14px",
              borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "4px 14px 14px 14px",
              background: m.role === "user" ? "linear-gradient(135deg, #10b981, #06b6d4)" : "#f1f5f9",
              color: m.role === "user" ? "#fff" : "#1e293b",
              fontSize: 12.5, lineHeight: 1.7, whiteSpace: "pre-line",
            }}>
              {m.text}
            </div>
          </div>
        ))}
        {vis < msgs.length && (
          <div style={{ display: "flex", gap: 5, paddingLeft: 34 }}>
            {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", animation: `q-bounce 1.2s ease ${i * 0.2}s infinite` }} />)}
          </div>
        )}
      </div>

      {/* Input bar */}
      <div style={{ padding: "12px 18px", borderTop: "1px solid #f1f5f9" }}>
        <div style={{ display: "flex", gap: 8, padding: "10px 14px", borderRadius: 14, background: "#f8fafc", border: "1.5px solid #e2e8f0" }}>
          <span style={{ flex: 1, fontSize: 12.5, color: "#94a3b8" }}>何でも聞いてみてください…</span>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #10b981, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>↑</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── App Screen Mock: Dashboard ───────────────────────────────────────────────
function DashboardScreenMock() {
  const bars = [
    { label: "育児休業", pct: 92, color: "#10b981" },
    { label: "経費精算", pct: 78, color: "#06b6d4" },
    { label: "リモートワーク", pct: 65, color: "#8b5cf6" },
    { label: "デプロイ手順", pct: 54, color: "#f59e0b" },
    { label: "有給申請", pct: 45, color: "#ec4899" },
  ];

  return (
    <div style={{
      background: "#fff", borderRadius: 24, overflow: "hidden",
      boxShadow: "0 32px 80px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)",
      width: "100%", maxWidth: 520,
    }}>
      {/* Window bar */}
      <div style={{ padding: "14px 18px", background: "#f8fafb", borderBottom: "1px solid #eef2f6", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", letterSpacing: "0.04em" }}>quix — ダッシュボード</span>
        </div>
      </div>

      <div style={{ padding: "24px 22px" }}>
        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
          {[
            { label: "今月の質問数", val: "1,284", change: "+12%" },
            { label: "平均回答時間", val: "2.8秒", change: "-15%" },
            { label: "解決率", val: "96.2%", change: "+3%" },
          ].map((s, i) => (
            <div key={i} style={{ padding: "14px 12px", borderRadius: 14, background: "#f8fafc", border: "1px solid #eef2f6" }}>
              <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em" }}>{s.val}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#10b981", marginTop: 4 }}>{s.change}</div>
            </div>
          ))}
        </div>

        {/* Top questions chart */}
        <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 14 }}>よくある質問 TOP5</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {bars.map((b, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#64748b", minWidth: 100, textAlign: "right" }}>{b.label}</span>
              <div style={{ flex: 1, height: 22, borderRadius: 6, background: "#f1f5f9", overflow: "hidden" }}>
                <div style={{ width: `${b.pct}%`, height: "100%", borderRadius: 6, background: b.color, transition: "width 1s ease", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>{b.pct}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// ── Main Page ────────────────────────────────────────────────────────────────
export default function QuixPage() {
  useSR();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const sr: React.CSSProperties = { opacity: 0, transform: "translateY(28px)", transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)" };

  return (
    <div style={{ fontFamily: "inherit", background: "#fff", color: "#0f172a", overflowX: "hidden" }}>

      {/* ── Nav ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: isMobile ? "0 16px" : "0 48px", height: 60,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 10, background: "linear-gradient(135deg, #10b981, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: 14, fontWeight: 900 }}>q</span>
          </div>
          <span style={{ fontSize: 17, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.03em" }}>quix</span>
          {!isMobile && <>
            <span style={{ width: 1, height: 14, background: "#e2e8f0" }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8" }}>by 合同会社80</span>
          </>}
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <a href="#contact" style={{
            fontSize: 12, fontWeight: 700, color: "#fff",
            background: "linear-gradient(135deg, #10b981, #06b6d4)",
            padding: "8px 20px", borderRadius: 100, textDecoration: "none",
            transition: "transform 0.2s", boxShadow: "0 4px 16px rgba(16,185,129,0.25)",
          }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
            onMouseLeave={e => e.currentTarget.style.transform = ""}
          >無料デモ</a>
          <a href="/" style={{
            fontSize: 12, fontWeight: 600, color: "#64748b", textDecoration: "none",
            padding: "7px 16px", borderRadius: 100, border: "1.5px solid #e2e8f0",
          }}>← 戻る</a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        minHeight: "100vh", padding: isMobile ? "120px 20px 60px" : "140px 64px 100px",
        background: "linear-gradient(160deg, #ecfdf5 0%, #f0fdfa 40%, #ecfeff 100%)",
        display: "flex", alignItems: "center", position: "relative", overflow: "hidden",
      }}>
        {/* Decorative blobs */}
        <div style={{ position: "absolute", top: "10%", right: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.12), transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "5%", left: "-10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.1), transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 48 : 64, alignItems: "center", width: "100%" }}>
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", color: "#059669",
              textTransform: "uppercase", marginBottom: 28,
              padding: "6px 16px", borderRadius: 100,
              background: "rgba(16,185,129,0.08)", border: "1.5px solid rgba(16,185,129,0.2)",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", animation: "q-pulse 2s ease infinite" }} />
              社内AIナレッジ検索
            </div>

            <h1 style={{
              fontSize: isMobile ? "clamp(36px, 10vw, 52px)" : "clamp(48px, 5.5vw, 76px)",
              fontWeight: 900, letterSpacing: "-0.04em",
              color: "#0f172a", lineHeight: 1.1, marginBottom: 28,
            }}>
              社内の知識を、<br />
              <span style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>チャットで</span><br />
              引き出す。
            </h1>

            <p style={{ fontSize: isMobile ? 14 : 16, color: "#475569", lineHeight: 1.9, maxWidth: 460, marginBottom: 40 }}>
              FAQ・規程・マニュアルに何度も答えるのは、もう終わり。<br />
              quixが社内の知識を学習し、チャットで即座に回答します。
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="#contact" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                fontSize: 14, fontWeight: 700, color: "#fff",
                background: "linear-gradient(135deg, #10b981, #06b6d4)",
                padding: "15px 32px", borderRadius: 100, textDecoration: "none",
                transition: "all 0.3s", boxShadow: "0 8px 32px rgba(16,185,129,0.3)",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 14px 40px rgba(16,185,129,0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 8px 32px rgba(16,185,129,0.3)"; }}
              >無料デモを申し込む →</a>
              <a href="#features" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                fontSize: 14, fontWeight: 600, color: "#475569",
                padding: "15px 28px", borderRadius: 100, textDecoration: "none",
                border: "2px solid #d1fae5", background: "#fff", transition: "all 0.3s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#10b981"; e.currentTarget.style.color = "#059669"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#d1fae5"; e.currentTarget.style.color = "#475569"; }}
              >機能を見る</a>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <ChatScreenMock />
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ background: "#0f172a", padding: isMobile ? "56px 20px" : "72px 64px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: isMobile ? 32 : 40 }}>
          {[
            { val: 70, suffix: "%", label: "問い合わせ工数削減" },
            { val: 3, suffix: "秒", label: "平均回答時間" },
            { val: 2, suffix: "週", label: "最短導入期間" },
            { val: 99, suffix: "%", label: "回答精度" },
          ].map((s, i) => (
            <div key={i} className="qsr" style={{ ...sr, textAlign: "center", transitionDelay: `${i * 0.1}s` }}>
              <div style={{ fontSize: isMobile ? 36 : 52, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1 }}>
                <span style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  <Counter to={s.val} suffix={s.suffix} />
                </span>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", marginTop: 10, letterSpacing: "0.06em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" style={{ padding: isMobile ? "80px 20px" : "140px 64px", background: "#fff" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div className="qsr" style={{ ...sr, marginBottom: 72, textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "#10b981", textTransform: "uppercase", marginBottom: 16 }}>Features</div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 56px)", fontWeight: 900, letterSpacing: "-0.04em", color: "#0f172a", lineHeight: 1.1 }}>
              quixができること
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
            {[
              { icon: "💬", title: "チャットで即回答", desc: "難しい検索は不要。話しかけるだけで、社内ドキュメントから最適な回答を瞬時に提示します。", color: "#10b981" },
              { icon: "📚", title: "あらゆる文書を学習", desc: "Word・PDF・Notion・Confluence・Slack など、散在する社内情報を一元的に取り込みます。", color: "#06b6d4" },
              { icon: "🔗", title: "出典付きで安心", desc: "回答には必ず元のドキュメントへのリンクを表示。情報の信頼性を担保します。", color: "#8b5cf6" },
              { icon: "🔒", title: "セキュアな環境", desc: "社内データは外部のAIに学習されません。プライベートクラウドまたはオンプレでの運用に対応。", color: "#f59e0b" },
              { icon: "📊", title: "利用分析ダッシュボード", desc: "よく聞かれる質問・未回答の質問を可視化。ナレッジのギャップを継続的に改善できます。", color: "#ec4899" },
              { icon: "⚡", title: "最短2週間で導入", desc: "既存ツールへのSSO連携と文書取り込みを含め、最短2週間で本番環境を構築します。", color: "#10b981" },
            ].map((f, i) => (
              <div key={i} className="qsr" style={{
                ...sr, transitionDelay: `${i * 0.07}s`,
                padding: "32px 28px", borderRadius: 20,
                border: "1.5px solid #f1f5f9", background: "#fff",
                transition: "all 0.3s", cursor: "default",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${f.color}50`; e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 16px 48px ${f.color}18`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#f1f5f9"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${f.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 18 }}>{f.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 10, letterSpacing: "-0.02em" }}>{f.title}</div>
                <div style={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.85 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dashboard Screen ── */}
      <section style={{ padding: isMobile ? "80px 20px" : "120px 64px", background: "linear-gradient(160deg, #f0fdfa, #ecfeff, #f8fafc)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.2fr", gap: isMobile ? 40 : 80, alignItems: "center" }}>
            <div className="qsr" style={sr}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "#06b6d4", textTransform: "uppercase", marginBottom: 16 }}>Analytics</div>
              <h2 style={{ fontSize: "clamp(26px, 3.5vw, 44px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#0f172a", lineHeight: 1.3, marginBottom: 24 }}>
                質問傾向を可視化。<br />ナレッジを改善し続ける。
              </h2>
              <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.9, marginBottom: 28 }}>
                よく聞かれる質問、回答できなかった質問を自動集計。ドキュメントの不足や改善ポイントが一目でわかります。
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {["質問ランキングの自動集計", "未回答・低評価の質問を検出", "部署別の利用状況レポート"].map((t, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 20, height: 20, borderRadius: 6, background: "linear-gradient(135deg, #10b981, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>✓</span>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#334155" }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="qsr" style={{ ...sr, transitionDelay: "0.15s", display: "flex", justifyContent: "center" }}>
              <DashboardScreenMock />
            </div>
          </div>
        </div>
      </section>

      {/* ── Use Cases ── */}
      <section style={{ padding: isMobile ? "80px 20px" : "120px 64px", background: "#fff" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div className="qsr" style={{ ...sr, marginBottom: 64, textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "#10b981", textTransform: "uppercase", marginBottom: 16 }}>Use Cases</div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 56px)", fontWeight: 900, letterSpacing: "-0.04em", color: "#0f172a", lineHeight: 1.1 }}>
              こんな場面で使われています
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 16 }}>
            {[
              { dept: "人事・総務", q: "「育休の申請方法は？」", a: "規程・フォームへ即アクセス", color: "#10b981" },
              { dept: "営業", q: "「製品Aの最新価格表は？」", a: "最新資料を自動参照", color: "#06b6d4" },
              { dept: "エンジニア", q: "「デプロイ手順を教えて」", a: "手順書を要約して回答", color: "#8b5cf6" },
              { dept: "新入社員", q: "「経費精算はどこから？」", a: "フローをステップ解説", color: "#f59e0b" },
            ].map((u, i) => (
              <div key={i} className="qsr" style={{
                ...sr, transitionDelay: `${i * 0.08}s`,
                padding: isMobile ? "24px 20px" : "28px 32px", borderRadius: 20,
                background: "#fff", border: "1.5px solid #eef2f6",
                display: "flex", gap: 16, alignItems: "flex-start", transition: "all 0.3s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${u.color}60`; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 12px 36px ${u.color}15`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#eef2f6"; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ flexShrink: 0, padding: "5px 14px", borderRadius: 100, background: `${u.color}12`, fontSize: 11, fontWeight: 700, color: u.color, whiteSpace: "nowrap", border: `1px solid ${u.color}30` }}>
                  {u.dept}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>{u.q}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: u.color, fontSize: 14, fontWeight: 700 }}>→</span>
                    <span style={{ fontSize: 13, color: "#64748b" }}>{u.a}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ padding: isMobile ? "80px 20px" : "140px 64px", background: "#f8fafb" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div className="qsr" style={{ ...sr, marginBottom: 72, textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "#10b981", textTransform: "uppercase", marginBottom: 16 }}>How it works</div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 56px)", fontWeight: 900, letterSpacing: "-0.04em", color: "#0f172a", lineHeight: 1.1 }}>
              導入はかんたん3ステップ
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: isMobile ? 40 : 24, position: "relative" }}>
            {!isMobile && (
              <div style={{ position: "absolute", top: 32, left: "20%", right: "20%", height: 3, borderRadius: 2, background: "linear-gradient(90deg, #10b981, #06b6d4)", zIndex: 0 }} />
            )}
            {[
              { step: "01", title: "文書を取り込む", body: "PDF・Word・Notion・Confluenceなど既存のドキュメントを接続。AIが自動的に整理・学習します。" },
              { step: "02", title: "チャットで質問", body: "Slack・Teams・専用Webアプリから、自然な言葉で質問するだけ。特別な操作は不要です。" },
              { step: "03", title: "即座に回答", body: "AIが関連ドキュメントを検索し、出典付きで回答。フォローアップ質問でさらに深掘りできます。" },
            ].map((p, i) => (
              <div key={i} className="qsr" style={{
                ...sr, transitionDelay: `${i * 0.12}s`,
                display: "flex", flexDirection: "column", alignItems: "center",
                textAlign: "center", padding: "0 20px", position: "relative", zIndex: 1,
              }}>
                <div style={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: "linear-gradient(135deg, #10b981, #06b6d4)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, fontWeight: 800, color: "#fff",
                  marginBottom: 28, boxShadow: "0 8px 24px rgba(16,185,129,0.3)",
                  border: "4px solid #f8fafb",
                }}>
                  {p.step}
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>{p.title}</div>
                <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.85 }}>{p.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="contact" style={{
        padding: isMobile ? "100px 20px" : "160px 64px",
        background: "linear-gradient(160deg, #0f172a 0%, #064e3b 100%)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.12), transparent 70%)", pointerEvents: "none" }} />

        <div className="qsr" style={{ ...sr, maxWidth: 680, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "#34d399", textTransform: "uppercase", marginBottom: 24 }}>Get Started</div>
          <h2 style={{ fontSize: "clamp(28px, 5vw, 56px)", fontWeight: 900, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1.15, marginBottom: 24 }}>
            まずは無料デモで<br />体験してください
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.9, marginBottom: 48 }}>
            実際の社内ドキュメントを使ったデモをご覧いただけます。<br />
            導入費用・期間・セキュリティについても詳しくご説明します。
          </p>

          <a href="/contact" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            fontSize: 15, fontWeight: 700, color: "#0f172a",
            background: "#fff", padding: "18px 44px", borderRadius: 100,
            textDecoration: "none", transition: "all 0.3s",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.2)"; }}
          >無料デモを申し込む →</a>

          <div style={{ marginTop: 48, display: "flex", gap: isMobile ? 20 : 40, justifyContent: "center", flexWrap: "wrap" }}>
            {["初回デモ無料", "最短2週間で導入", "秘密保持契約対応"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 600 }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(52,211,153,0.15)", border: "1.5px solid #34d399", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#34d399" }}>✓</div>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: "#020617", padding: isMobile ? "32px 20px" : "40px 64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>© 2025 合同会社80. All rights reserved.</div>
        <a href="/"><img src="/8.png" alt="80" style={{ height: 40, display: "block", opacity: 0.3 }} /></a>
      </footer>

      <style>{`
        @keyframes q-fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes q-bounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }
        @keyframes q-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}
