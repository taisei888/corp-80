"use client";

import { useState, useEffect, useRef } from "react";

// ===== Types =====
type DemoId = "manufacturing" | "report" | "sales" | "doc" | "faq" | "support" | "hr" | "dashboard";

interface DemoItem {
  id: DemoId;
  num: string;
  tag: string;
  title: string;
  desc: string;
}

const demos: DemoItem[] = [
  { id: "manufacturing", num: "01", tag: "MANUFACTURING", title: "製造管理AI", desc: "生産ライン監視・不良検知・予知保全をAIで一元管理" },
  { id: "report", num: "02", tag: "DAILY REPORT", title: "日報・報告書 生成AI", desc: "現場データから日報を自動生成。異常値の検知・週次比較も" },
  { id: "sales", num: "03", tag: "SALES SUPPORT", title: "営業支援AI", desc: "製造業特化の商談管理。訪問履歴から次アクションを提案" },
  { id: "doc", num: "04", tag: "DOCUMENT", title: "書類作成サポートAI", desc: "作業標準書・QC工程表をAIが下書き。過去文書から自動引用" },
  { id: "faq", num: "05", tag: "FAQ / MANUAL", title: "社内FAQ・マニュアル検索AI", desc: "社内規程やマニュアルをAIが学習し、チャットで即座に回答" },
  { id: "support", num: "06", tag: "CUSTOMER SUPPORT", title: "問い合わせ対応AI", desc: "顧客からのよくある質問にAIが自動回答" },
  { id: "hr", num: "07", tag: "HR / RECRUITMENT", title: "採用・人事サポートAI", desc: "応募者の適性分析、面接メモの要約を担当" },
  { id: "dashboard", num: "08", tag: "DATA VIZ", title: "データ分析・見える化", desc: "売上・生産・品質データをダッシュボードで可視化" },
];

// ===== Shared components =====
function ChatBubble({ role, children, typing }: { role: "user" | "ai"; children?: React.ReactNode; typing?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: role === "user" ? "flex-end" : "flex-start", marginBottom: 12 }}>
      {role === "ai" && (
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff", flexShrink: 0, marginRight: 8, marginTop: 2 }}>AI</div>
      )}
      <div style={{
        maxWidth: "75%", padding: "12px 16px", borderRadius: role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
        background: role === "user" ? "#6366f1" : "#f1f5f9",
        color: role === "user" ? "#fff" : "#1e293b",
        fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap",
      }}>
        {typing ? <TypingDots /> : children}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <span style={{ display: "inline-flex", gap: 4, alignItems: "center", height: 20 }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 6, height: 6, borderRadius: "50%", background: "#94a3b8",
          animation: `blink 1.2s infinite ${i * 0.2}s`,
        }} />
      ))}
      <style>{`@keyframes blink { 0%,80%,100% { opacity: 0.3; } 40% { opacity: 1; } }`}</style>
    </span>
  );
}

function SourceBadge({ text }: { text: string }) {
  return (
    <span style={{ display: "inline-block", fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 100, background: "#ede9fe", color: "#6366f1", marginTop: 8, marginRight: 6 }}>{text}</span>
  );
}

function AnimBar({ width, color, delay = 0 }: { width: number; color: string; delay?: number }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(width), 200 + delay); return () => clearTimeout(t); }, [width, delay]);
  return (
    <div style={{ height: 8, background: "#e2e8f0", borderRadius: 4, overflow: "hidden", width: "100%" }}>
      <div style={{ height: "100%", width: `${w}%`, background: color, borderRadius: 4, transition: "width 0.8s ease-out" }} />
    </div>
  );
}

function MiniCard({ label, value, sub, subColor }: { label: string; value: string; sub: string; subColor?: string }) {
  return (
    <div style={{ background: "#f8fafc", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
      <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.05em" }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 900, color: "#0f172a", margin: "2px 0" }}>{value}</div>
      <div style={{ fontSize: 10, fontWeight: 600, color: subColor || "#22c55e" }}>{sub}</div>
    </div>
  );
}

// ===== DEMO 01: 製造管理AI =====
function DemoManufacturing() {
  const [selectedLine, setSelectedLine] = useState(0);
  const [alertExpanded, setAlertExpanded] = useState(true);

  const lines = [
    {
      name: "CNCマシニングセンタ MC-500",
      lineId: "ライン1",
      status: "稼働中",
      statusColor: "#22c55e",
      today: 342, target: 400,
      defectCount: 1, defectRate: "0.29%",
      cycleTime: "48s", cycleTarget: "45s",
      oee: 82.4,
      temp: "32.4\u00b0C",
      vibration: "4.2mm/s",
      spindleHours: "1,847h",
      nextMaint: "7/5",
      operator: "佐藤 健一",
      product: "SUS304 ブラケット A-2241",
    },
    {
      name: "射出成型機 IM-200T",
      lineId: "ライン2",
      status: "段取替え中",
      statusColor: "#f59e0b",
      today: 1280, target: 2000,
      defectCount: 1, defectRate: "0.08%",
      cycleTime: "22s", cycleTarget: "20s",
      oee: 71.2,
      temp: "198\u00b0C",
      vibration: "1.1mm/s",
      spindleHours: "-",
      nextMaint: "7/12",
      operator: "田中 裕二",
      product: "PP樹脂 ハウジング C-1105",
    },
    {
      name: "プレス加工機 P-150",
      lineId: "ライン3",
      status: "稼働中",
      statusColor: "#22c55e",
      today: 5430, target: 6000,
      defectCount: 8, defectRate: "0.15%",
      cycleTime: "4.2s", cycleTarget: "4.0s",
      oee: 88.1,
      temp: "28.1\u00b0C",
      vibration: "2.8mm/s",
      spindleHours: "-",
      nextMaint: "6/30",
      operator: "山本 剛",
      product: "SPCC 端子台カバー T-0887",
    },
  ];

  const alerts = [
    { level: "warn", icon: "\u26a0\ufe0f", text: "ライン1: スピンドル振動値が基準の85%に到達（4.2mm/s / 閾値5.0mm/s）。次回定期点検(7/5)の前倒しを推奨。", time: "10分前" },
    { level: "error", icon: "\ud83d\udfe1", text: "ライン2: 金型温度が設定値+3\u00b0C（198\u00b0C / 設定195\u00b0C）。冷却水流量の確認を推奨。ショートショットの発生リスクあり。", time: "25分前" },
    { level: "ok", icon: "\u2705", text: "ライン3: 安定稼働中。現ペースで16:30に本日目標達成見込み。不良率は先週比0.03%改善。", time: "5分前" },
    { level: "info", icon: "\ud83d\udcca", text: "全体: 4M変更管理の効果で不良率が先週比0.05%改善。SPC管理図も安定推移中。", time: "1時間前" },
  ];

  const l = lines[selectedLine];
  const progressPct = Math.round((l.today / l.target) * 100);

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden", fontSize: 12 }}>
      {/* Left: Line list */}
      <div style={{ width: 200, borderRight: "1px solid #f1f5f9", overflowY: "auto", flexShrink: 0 }}>
        <div style={{ padding: "14px 14px 6px", fontSize: 9, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.15em" }}>PRODUCTION LINES</div>
        {lines.map((ln, i) => (
          <div key={i} onClick={() => setSelectedLine(i)} style={{
            padding: "10px 14px", cursor: "pointer",
            borderLeft: selectedLine === i ? "3px solid #6366f1" : "3px solid transparent",
            background: selectedLine === i ? "#f8fafc" : "transparent", transition: "all 0.15s",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: ln.statusColor, flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: "#1e293b" }}>{ln.lineId}</span>
            </div>
            <div style={{ fontSize: 10, color: "#64748b", marginBottom: 4 }}>{ln.name.split(" ")[0]}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ flex: 1, height: 4, background: "#e2e8f0", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.round((ln.today / ln.target) * 100)}%`, background: ln.statusColor, borderRadius: 2 }} />
              </div>
              <span style={{ fontSize: 9, color: "#94a3b8", fontWeight: 600 }}>{Math.round((ln.today / ln.target) * 100)}%</span>
            </div>
          </div>
        ))}
        {/* OEE Summary */}
        <div style={{ padding: "12px 14px", borderTop: "1px solid #f1f5f9", marginTop: 4 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", marginBottom: 8 }}>OEE (設備総合効率)</div>
          {lines.map((ln, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 9, color: "#64748b", width: 40 }}>{ln.lineId}</span>
              <div style={{ flex: 1, height: 4, background: "#e2e8f0", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${ln.oee}%`, background: ln.oee >= 85 ? "#22c55e" : ln.oee >= 70 ? "#f59e0b" : "#ef4444", borderRadius: 2 }} />
              </div>
              <span style={{ fontSize: 9, fontWeight: 700, color: ln.oee >= 85 ? "#22c55e" : ln.oee >= 70 ? "#f59e0b" : "#ef4444" }}>{ln.oee}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Center: Line detail */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>{l.lineId}: {l.name}</div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>製品: {l.product}　|　担当: {l.operator}</div>
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: 100, background: `${l.statusColor}18`, color: l.statusColor }}>{l.status}</span>
        </div>

        {/* KPI Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
          <div style={{ background: "#f8fafc", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 600 }}>生産数 / 目標</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#0f172a" }}>{l.today.toLocaleString()}<span style={{ fontSize: 11, color: "#94a3b8" }}>/{l.target.toLocaleString()}</span></div>
            <div style={{ fontSize: 10, fontWeight: 600, color: progressPct >= 80 ? "#22c55e" : "#f59e0b" }}>{progressPct}% 達成</div>
          </div>
          <div style={{ background: "#f8fafc", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 600 }}>不良率</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: parseFloat(l.defectRate) < 0.2 ? "#22c55e" : "#f59e0b" }}>{l.defectRate}</div>
            <div style={{ fontSize: 10, color: "#64748b" }}>{l.defectCount}件 / {l.today}</div>
          </div>
          <div style={{ background: "#f8fafc", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 600 }}>サイクルタイム</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#0f172a" }}>{l.cycleTime}</div>
            <div style={{ fontSize: 10, color: "#64748b" }}>目標 {l.cycleTarget}</div>
          </div>
          <div style={{ background: "#f8fafc", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 600 }}>OEE</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: l.oee >= 85 ? "#22c55e" : l.oee >= 70 ? "#f59e0b" : "#ef4444" }}>{l.oee}%</div>
            <div style={{ fontSize: 10, color: "#64748b" }}>世界水準 85%</div>
          </div>
        </div>

        {/* Equipment Status */}
        <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", marginBottom: 8 }}>EQUIPMENT SENSOR</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 12px" }}>
            <div style={{ fontSize: 9, color: "#94a3b8", marginBottom: 2 }}>温度</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{l.temp}</div>
          </div>
          <div style={{ background: "#fff", border: selectedLine === 0 ? "1px solid #f59e0b" : "1px solid #e2e8f0", borderRadius: 8, padding: "10px 12px" }}>
            <div style={{ fontSize: 9, color: "#94a3b8", marginBottom: 2 }}>振動値</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: selectedLine === 0 ? "#f59e0b" : "#0f172a" }}>{l.vibration}</div>
            {selectedLine === 0 && <div style={{ fontSize: 9, color: "#f59e0b", marginTop: 2 }}>閾値: 5.0mm/s</div>}
          </div>
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 12px" }}>
            <div style={{ fontSize: 9, color: "#94a3b8", marginBottom: 2 }}>次回点検</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: l.nextMaint === "6/30" ? "#ef4444" : "#0f172a" }}>{l.nextMaint}</div>
            {l.nextMaint === "6/30" && <div style={{ fontSize: 9, color: "#ef4444", marginTop: 2 }}>明日</div>}
          </div>
        </div>

        {/* AI Alerts */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em" }}>AI ALERTS</div>
          <button onClick={() => setAlertExpanded(!alertExpanded)} style={{ fontSize: 10, color: "#6366f1", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
            {alertExpanded ? "折りたたむ" : "展開"}
          </button>
        </div>
        {alertExpanded && (
          <div style={{ display: "grid", gap: 6 }}>
            {alerts.map((a, i) => (
              <div key={i} style={{
                padding: "10px 12px", borderRadius: 8, fontSize: 11, lineHeight: 1.6,
                background: a.level === "error" ? "#fef3c7" : a.level === "warn" ? "#fff7ed" : a.level === "ok" ? "#f0fdf4" : "#ede9fe",
                border: `1px solid ${a.level === "error" ? "#fde68a" : a.level === "warn" ? "#fed7aa" : a.level === "ok" ? "#bbf7d0" : "#c7d2fe"}`,
                color: "#1e293b",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span>{a.icon} {a.text}</span>
                  <span style={{ fontSize: 9, color: "#94a3b8", flexShrink: 0, marginLeft: 8 }}>{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ===== DEMO 02: 日報 AI =====
function DemoReport() {
  const [mode, setMode] = useState<"input" | "result">("input");
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMode("result");
    }, 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "10px 20px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#1e293b" }}>製造日報</span>
          <span style={{ fontSize: 10, color: "#64748b" }}>2026/06/29（日）日勤</span>
        </div>
        <div style={{ display: "flex", gap: 4, background: "#e2e8f0", borderRadius: 6, padding: 2 }}>
          <button onClick={() => setMode("input")} style={{
            padding: "4px 14px", borderRadius: 4, border: "none", fontSize: 10, fontWeight: 600, cursor: "pointer",
            background: mode === "input" ? "#fff" : "transparent", color: mode === "input" ? "#0f172a" : "#94a3b8",
          }}>入力データ</button>
          <button onClick={() => mode === "result" && setMode("result")} style={{
            padding: "4px 14px", borderRadius: 4, border: "none", fontSize: 10, fontWeight: 600, cursor: "pointer",
            background: mode === "result" ? "#fff" : "transparent", color: mode === "result" ? "#0f172a" : "#94a3b8",
            opacity: mode === "result" ? 1 : 0.5,
          }}>AI生成結果</button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
        {mode === "input" ? (
          <div style={{ maxWidth: 580, margin: "0 auto" }}>
            {/* Production data */}
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", letterSpacing: "0.1em", marginBottom: 10 }}>PRODUCTION DATA</div>
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {["ライン", "製品", "目標", "実績", "不良", "稼働率"].map(h => (
                      <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontWeight: 600, color: "#64748b", borderBottom: "1px solid #e2e8f0", fontSize: 10 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["L1", "ブラケット A-2241", "400", "342", "1", "85.5%"],
                    ["L2", "ハウジング C-1105", "2,000", "1,280", "1", "64.0%"],
                    ["L3", "カバー T-0887", "6,000", "5,430", "8", "90.5%"],
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      {row.map((cell, j) => (
                        <td key={j} style={{ padding: "8px 10px", color: j === 4 && parseInt(cell) > 5 ? "#ef4444" : "#334155", fontWeight: j === 4 && parseInt(cell) > 5 ? 700 : 400 }}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Equipment notes */}
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", letterSpacing: "0.1em", marginBottom: 10 }}>EQUIPMENT NOTES</div>
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: 14, fontSize: 11, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
              <div>L1: MC-500 スピンドル振動値やや上昇（4.2mm/s）。閾値内だが経過観察中。</div>
              <div>L2: IM-200T 14:00-15:30 金型交換で段取替え。金型温度設定値+3{"\u00b0"}Cの傾向あり。</div>
              <div>L3: P-150 異常なし。明日定期点検予定。</div>
            </div>

            {/* Other sections */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", letterSpacing: "0.1em", marginBottom: 8 }}>SAFETY</div>
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: 12, fontSize: 11, color: "#166534" }}>
                  労災: 0件　/　ヒヤリハット: 0件
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", letterSpacing: "0.1em", marginBottom: 8 }}>4M CHANGES</div>
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: 12, fontSize: 11, color: "#475569" }}>
                  Man: 変更なし　/　Material: ロットNo.切替（L3）
                </div>
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <button onClick={handleGenerate} disabled={loading} style={{
                padding: "12px 32px", borderRadius: 100, border: "none",
                background: loading ? "#a5b4fc" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
                color: "#fff", fontSize: 13, fontWeight: 700, cursor: loading ? "wait" : "pointer",
                transition: "all 0.2s", boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
              }}>
                {loading ? "AI が日報を生成中..." : "AI で日報を自動生成"}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: 580, margin: "0 auto", animation: "fadeIn 0.5s" }}>
            {/* AI Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#fff" }}>AI</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#6366f1" }}>AI生成日報</div>
                <div style={{ fontSize: 9, color: "#94a3b8" }}>入力データ + 設備センサーデータから自動生成</div>
              </div>
            </div>

            {/* Generated report */}
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20, marginBottom: 16 }}>
              <div style={{ textAlign: "center", fontSize: 15, fontWeight: 800, color: "#1e293b", marginBottom: 4 }}>製造日報</div>
              <div style={{ textAlign: "center", fontSize: 10, color: "#94a3b8", marginBottom: 16 }}>2026年6月29日（日）日勤 8:00-17:00　|　製造1課</div>

              <div style={{ fontSize: 11, fontWeight: 700, color: "#1e293b", borderBottom: "2px solid #1e293b", paddingBottom: 4, marginBottom: 10 }}>1. 生産実績サマリー</div>
              <div style={{ fontSize: 11, color: "#475569", lineHeight: 2, marginBottom: 16 }}>
                本日の総生産数 <strong>7,052個</strong>（目標 8,400個 / 達成率 <strong style={{ color: "#f59e0b" }}>83.9%</strong>）<br />
                総不良数 <strong>10個</strong>（不良率 <strong style={{ color: "#22c55e" }}>0.14%</strong>）— 先週平均0.19%より改善<br />
                L2の段取替え（1.5h）が全体達成率の主要因。L1・L3は目標ペース内。
              </div>

              <div style={{ fontSize: 11, fontWeight: 700, color: "#1e293b", borderBottom: "2px solid #1e293b", paddingBottom: 4, marginBottom: 10 }}>2. 設備・品質 注意事項</div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 8, padding: "10px 12px", fontSize: 11, color: "#92400e", marginBottom: 6, lineHeight: 1.6 }}>
                  <strong>[要経過観察]</strong> L1 MC-500 スピンドル振動値 4.2mm/s（閾値5.0mm/s の84%到達）。MTBF分析から、7/5定期点検の前倒しを推奨。
                </div>
                <div style={{ background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 8, padding: "10px 12px", fontSize: 11, color: "#92400e", lineHeight: 1.6 }}>
                  <strong>[要対応]</strong> L2 IM-200T 金型温度+3{"\u00b0"}C傾向。冷却水系統（流量・水温）の確認を推奨。放置時、ショートショット不良増加リスクあり。
                </div>
              </div>

              <div style={{ fontSize: 11, fontWeight: 700, color: "#1e293b", borderBottom: "2px solid #1e293b", paddingBottom: 4, marginBottom: 10 }}>3. AI分析・推奨アクション</div>
              <div style={{ fontSize: 11, color: "#475569", lineHeight: 2 }}>
                <strong style={{ color: "#6366f1" }}>{">"} L3の不良8件の内訳分析：</strong>バリ不良6件・寸法NG2件。バリ不良はプレス刃の摩耗が原因と推定。明日の定期点検で刃の交換を推奨。<br />
                <strong style={{ color: "#6366f1" }}>{">"} 材料ロット切替（L3）：</strong>新ロットNo.切替後も品質数値に有意差なし。SPC管理図は管理限界内で安定推移。<br />
                <strong style={{ color: "#6366f1" }}>{">"} 来週の生産計画への示唆：</strong>L2の段取替え頻度削減のため、ロットまとめ生産の検討を推奨（現状 週3回 → 週2回で段取り時間 約4.5h/週 削減見込み）。
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <button style={{ padding: "8px 20px", borderRadius: 100, border: "1px solid #e2e8f0", background: "#fff", fontSize: 11, fontWeight: 600, color: "#475569", cursor: "pointer" }}>PDF出力</button>
              <button style={{ padding: "8px 20px", borderRadius: 100, border: "1px solid #e2e8f0", background: "#fff", fontSize: 11, fontWeight: 600, color: "#475569", cursor: "pointer" }}>メール送信</button>
              <button onClick={() => setMode("input")} style={{ padding: "8px 20px", borderRadius: 100, border: "1px solid #e2e8f0", background: "#fff", fontSize: 11, fontWeight: 600, color: "#6366f1", cursor: "pointer" }}>入力に戻る</button>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

// ===== DEMO 03: 営業支援AI =====
function DemoSales() {
  const [selected, setSelected] = useState(0);
  const [showTimeline, setShowTimeline] = useState(false);

  const clients = [
    {
      name: "株式会社サンライズ建設",
      industry: "総合建設業（従業員200名）",
      person: "木村 常務取締役",
      status: "提案中",
      statusColor: "#6366f1",
      meetings: 4,
      prob: 75,
      revenue: "年商 42億円 / 従業員 200名",
      challenge: "現場監督の高齢化で技術ノウハウが属人化。日報・安全書類が紙ベースで月末に事務作業が集中している。",
      timeline: [
        { date: "6/10", event: "初回訪問", detail: "本社にてヒアリング。現場が15拠点に分散、情報共有が電話とFAX中心。" },
        { date: "6/18", event: "現場見学", detail: "横浜の現場を見学。所長が日報に毎日1.5時間かけている実態を確認。写真整理が最大の負荷。" },
        { date: "6/22", event: "提案書送付", detail: "日報AI + 安全書類自動生成の提案。月額20万円のサブスクプラン。" },
        { date: "6/27", event: "2回目訪問", detail: "デモ実施。常務は前向き。「現場の所長たちが使えるかどうかが鍵」と発言。" },
      ],
      aiAction: "【受注確度UP施策】\n1. 同業種(建設業)の導入事例を準備 — 日報作成時間70%削減の実績を提示\n2. 現場所長向けの「かんたん操作デモ動画」を作成 — スマホ撮影→自動整理の流れを可視化\n3. 7/3の最終提案時に1現場限定トライアル(2ヶ月無料)を提示\n\n【競合情報】K社の建設DXツールが競合。差別化ポイントは「AI要約による報告書自動生成」と「既存のExcel帳票への出力対応」。",
    },
    {
      name: "めし処 やまと（飲食チェーン）",
      industry: "飲食業（12店舗展開）",
      person: "山田 エリアマネージャー",
      status: "見積提出済",
      statusColor: "#f59e0b",
      meetings: 3,
      prob: 55,
      revenue: "年商 6億円 / 12店舗",
      challenge: "アルバイトの教育コストが高い。接客マニュアルが店舗ごとにバラバラで、クレーム対応が属人的。",
      timeline: [
        { date: "6/5", event: "紹介経由で連絡", detail: "税理士からの紹介。「人手不足でベテランが抜けると店が回らない」という相談。" },
        { date: "6/15", event: "初回訪問", detail: "本店で店長にもヒアリング。クレーム対応・食材発注・シフト管理が三大課題。" },
        { date: "6/23", event: "見積提出", detail: "社内FAQ AI(接客マニュアル) + 問い合わせAI(お客様対応)。月額15万円。" },
      ],
      aiAction: "【フォローアップ推奨】\n1. 見積提出後5日経過 — 明日までにフォロー電話を推奨\n2. 先方の主要課題は「教育コスト」 — 新人研修時間の削減効果を試算（現状: 1人あたり40時間 → 推定15時間）\n3. 実際のメニューと接客フレーズを使ったFAQデモを作成し、「うちの店で使えるイメージ」を具体化\n\n【価格交渉に備えて】月額15万円に対して「高い」と言われた場合、アルバイト1名の採用・教育コスト(約30万円)と比較して提示。",
    },
    {
      name: "関東物流サービス株式会社",
      industry: "物流・倉庫業（従業員80名）",
      person: "佐々木 業務部長",
      status: "初回訪問予定",
      statusColor: "#94a3b8",
      meetings: 0,
      prob: 20,
      revenue: "年商 12億円 / 従業員 80名",
      challenge: "（ヒアリング前）HPによると3PL事業が主力。ドライバーの勤怠管理と配車計画の効率化をPRしている。",
      timeline: [
        { date: "6/25", event: "Web問い合わせ", detail: "LPからの問い合わせ。「Excelで配車管理しているが限界」とのこと。" },
        { date: "7/2", event: "初回訪問予定", detail: "14:00- 倉庫見学＋ヒアリング予定。" },
      ],
      aiAction: "【初回訪問の準備】\n1. 物流業界の2024年問題(ドライバー残業規制)を踏まえた課題整理を準備\n2. 配車計画のExcel脱却事例を1つ用意（入力時間60%削減）\n3. 従業員80名規模の場合、IT担当不在の可能性高 — 「運用はお任せ」のフルサポート体制を強調\n4. 倉庫のWMS連携ニーズも想定されるため、API連携の技術資料も持参\n\n【想定ニーズ】配車計画の最適化、ドライバー日報の自動化、倉庫在庫の見える化。",
    },
  ];

  const c = clients[selected];

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={{ width: 220, borderRight: "1px solid #f1f5f9", overflowY: "auto", flexShrink: 0 }}>
        <div style={{ padding: "14px 14px 6px", fontSize: 9, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.15em" }}>CLIENTS ({clients.length})</div>
        {clients.map((cl, i) => (
          <div key={i} onClick={() => { setSelected(i); setShowTimeline(false); }} style={{
            padding: "10px 14px", cursor: "pointer",
            borderLeft: selected === i ? "3px solid #6366f1" : "3px solid transparent",
            background: selected === i ? "#f8fafc" : "transparent", transition: "all 0.15s",
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#1e293b" }}>{cl.name}</div>
            <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>{cl.industry}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
              <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 8px", borderRadius: 100, background: `${cl.statusColor}18`, color: cl.statusColor }}>{cl.status}</span>
              <span style={{ fontSize: 9, color: "#94a3b8" }}>{cl.prob}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>{c.name}</div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{c.industry}　|　{c.revenue}</div>
            <div style={{ fontSize: 11, color: "#64748b" }}>担当: {c.person}　|　商談: {c.meetings}回　|　確度: {c.prob}%</div>
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, padding: "4px 14px", borderRadius: 100, background: `${c.statusColor}18`, color: c.statusColor }}>{c.status}</span>
        </div>

        {/* Challenge */}
        <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", marginBottom: 6 }}>CHALLENGE</div>
        <div style={{ background: "#f8fafc", borderRadius: 10, padding: 12, fontSize: 12, color: "#334155", marginBottom: 16, lineHeight: 1.7 }}>{c.challenge}</div>

        {/* Timeline toggle */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em" }}>VISIT TIMELINE</div>
          <button onClick={() => setShowTimeline(!showTimeline)} style={{ fontSize: 10, color: "#6366f1", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
            {showTimeline ? "閉じる" : `${c.timeline.length}件を表示`}
          </button>
        </div>
        {showTimeline && (
          <div style={{ marginBottom: 16, borderLeft: "2px solid #e2e8f0", paddingLeft: 16, marginLeft: 4 }}>
            {c.timeline.map((t, i) => (
              <div key={i} style={{ marginBottom: 12, position: "relative" }}>
                <div style={{ position: "absolute", left: -22, top: 4, width: 8, height: 8, borderRadius: "50%", background: i === c.timeline.length - 1 ? "#6366f1" : "#e2e8f0", border: "2px solid #fff" }} />
                <div style={{ fontSize: 9, fontWeight: 700, color: "#6366f1" }}>{t.date}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#1e293b" }}>{t.event}</div>
                <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.6 }}>{t.detail}</div>
              </div>
            ))}
          </div>
        )}

        {/* AI Action */}
        <div style={{ background: "linear-gradient(135deg,#ede9fe,#e0e7ff)", borderRadius: 12, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#fff" }}>AI</div>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#6366f1" }}>NEXT ACTION</span>
          </div>
          <div style={{ fontSize: 12, color: "#1e293b", lineHeight: 1.9, whiteSpace: "pre-wrap" }}>{c.aiAction}</div>
        </div>
      </div>
    </div>
  );
}

// ===== DEMO 04: 書類作成AI =====
function DemoDoc() {
  const [docType, setDocType] = useState<"quote" | "contract" | "proposal">("quote");
  const [aiOn, setAiOn] = useState(false);
  const [filledFields, setFilledFields] = useState<number[]>([]);

  const docTypes = [
    { id: "quote" as const, label: "見積書", icon: "\ud83d\udcb0" },
    { id: "contract" as const, label: "契約書", icon: "\ud83d\udcdd" },
    { id: "proposal" as const, label: "提案書", icon: "\ud83d\udcca" },
  ];

  const aiSuggestions = {
    quote: [
      { text: "過去の同規模案件「A社向けシステム開発(2025/11)」から単価を参照可能", action: "引用" },
      { text: "保守費の月額計算が業界平均(開発費の15-20%/年)より低め。見直しを推奨", action: "見直し" },
      { text: "有効期限が未記載です。30日間の有効期限を追加推奨", action: "追加" },
      { text: "消費税の端数処理が前回と異なります（切捨て→四捨五入）。統一推奨", action: "統一" },
      { text: "「ご不明点がございましたら〜」の結び文を過去の成約案件から最適化", action: "最適化" },
    ],
    contract: [
      { text: "秘密保持条項が旧テンプレート(2024年版)のまま。2026年版に更新を推奨", action: "更新" },
      { text: "損害賠償の上限金額が契約金額を超えています。条件の見直しを推奨", action: "見直し" },
      { text: "反社会的勢力排除条項が未記載。コンプライアンス上、追加を推奨", action: "追加" },
    ],
    proposal: [
      { text: "競合B社の提案書(入手済み)との差別化ポイントを3つ自動抽出しました", action: "確認" },
      { text: "先方の中期経営計画(IR資料)から関連KPIを引用可能", action: "引用" },
      { text: "導入効果の数値が根拠不足。業界ベンチマークデータの挿入を推奨", action: "挿入" },
      { text: "スライド7の図表が解像度不足。高解像度版に差し替え推奨", action: "差替" },
    ],
  };

  const handleFill = (i: number) => {
    if (!filledFields.includes(i)) {
      setFilledFields(prev => [...prev, i]);
    }
  };

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Toolbar */}
        <div style={{ padding: "8px 16px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {docTypes.map(d => (
              <button key={d.id} onClick={() => { setDocType(d.id); setFilledFields([]); }} style={{
                padding: "5px 12px", borderRadius: 6, border: docType === d.id ? "1.5px solid #6366f1" : "1.5px solid #e2e8f0",
                background: docType === d.id ? "#ede9fe" : "#fff", fontSize: 10, fontWeight: 600,
                color: docType === d.id ? "#6366f1" : "#64748b", cursor: "pointer", transition: "all 0.2s",
              }}>
                {d.icon} {d.label}
              </button>
            ))}
          </div>
          <button onClick={() => setAiOn(!aiOn)} style={{
            padding: "5px 14px", borderRadius: 100, border: "none",
            background: aiOn ? "#6366f1" : "#e2e8f0",
            color: aiOn ? "#fff" : "#475569",
            fontSize: 10, fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
          }}>
            AI支援 {aiOn ? "ON" : "OFF"}
          </button>
        </div>

        {/* Document content */}
        <div style={{ flex: 1, padding: 20, overflowY: "auto" }}>
          {docType === "quote" && (
            <div style={{ maxWidth: 520, margin: "0 auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "3px solid #1e293b", paddingBottom: 8, marginBottom: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: "#1e293b" }}>お見積書</div>
                <div style={{ textAlign: "right", fontSize: 10, color: "#64748b", lineHeight: 1.8 }}>
                  見積No: EST-2026-0042<br />
                  発行日: 2026年6月29日
                </div>
              </div>
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>株式会社サンライズ建設 御中</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 16 }}>業務デジタル化支援システム 導入費用</div>
              <div style={{ fontSize: 12, color: "#334155", lineHeight: 2, marginBottom: 16 }}>
                平素より大変お世話になっております。<br />
                ご依頼いただきました件、下記のとおりお見積もりをご提示いたします。
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, marginBottom: 16 }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    <th style={{ padding: "8px 12px", textAlign: "left", borderBottom: "2px solid #e2e8f0", color: "#64748b", fontWeight: 600 }}>項目</th>
                    <th style={{ padding: "8px 12px", textAlign: "center", borderBottom: "2px solid #e2e8f0", color: "#64748b", fontWeight: 600 }}>数量</th>
                    <th style={{ padding: "8px 12px", textAlign: "right", borderBottom: "2px solid #e2e8f0", color: "#64748b", fontWeight: 600 }}>単価</th>
                    <th style={{ padding: "8px 12px", textAlign: "right", borderBottom: "2px solid #e2e8f0", color: "#64748b", fontWeight: 600 }}>金額</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["要件定義・設計", "1式", "\u00a5400,000", "\u00a5400,000"],
                    ["システム開発", "1式", "\u00a5800,000", "\u00a5800,000"],
                    ["データ移行・初期設定", "1式", "\u00a5150,000", "\u00a5150,000"],
                    ["操作研修（2回）", "2回", "\u00a575,000", "\u00a5150,000"],
                    ["月額保守費（12ヶ月）", "12", "\u00a550,000", "\u00a5600,000"],
                  ].map((row, i) => (
                    <tr key={i}><td style={{ padding: "8px 12px", borderBottom: "1px solid #f1f5f9" }}>{row[0]}</td><td style={{ padding: "8px 12px", textAlign: "center", borderBottom: "1px solid #f1f5f9" }}>{row[1]}</td><td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid #f1f5f9" }}>{row[2]}</td><td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid #f1f5f9" }}>{row[3]}</td></tr>
                  ))}
                  <tr style={{ fontWeight: 700 }}><td colSpan={3} style={{ padding: "8px 12px", borderTop: "2px solid #1e293b" }}>合計（税別）</td><td style={{ padding: "8px 12px", textAlign: "right", borderTop: "2px solid #1e293b" }}>\u00a52,100,000</td></tr>
                </tbody>
              </table>
              {aiOn && (
                <div style={{ background: "#ede9fe", borderRadius: 10, padding: "12px 16px", marginTop: 8, fontSize: 11, color: "#6366f1", lineHeight: 1.7, animation: "fadeIn 0.3s" }}>
                  <strong>AI提案：</strong>有効期限（発行日より30日間）の追記と、「ご不明点がございましたらお気軽にお問い合わせください」の結び文追加を推奨します。
                </div>
              )}
            </div>
          )}

          {docType === "contract" && (
            <div style={{ maxWidth: 520, margin: "0 auto" }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#1e293b", marginBottom: 4, textAlign: "center" }}>業務委託基本契約書</div>
              <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 16, textAlign: "center" }}>契約番号: AGR-2026-018 | 作成日: 2026/06/29</div>
              <div style={{ fontSize: 11, color: "#475569", lineHeight: 2, marginBottom: 12 }}>
                株式会社サンライズ建設（以下「甲」という）と合同会社80（以下「乙」という）は、以下のとおり業務委託基本契約を締結する。
              </div>
              {[
                { title: "第1条（目的）", text: "甲は乙に対し、業務デジタル化に関するシステム開発・運用保守業務を委託し、乙はこれを受託する。" },
                { title: "第2条（委託業務の内容）", text: "別紙仕様書に定めるシステム開発、導入支援、保守・運用業務。" },
                { title: "第3条（契約期間）", text: "2026年7月1日から2027年6月30日までの1年間とする。以降、3ヶ月前の書面通知なき場合は自動更新。" },
                { title: "第4条（報酬及び支払条件）", text: "月額報酬は金200,000円（税別）。毎月末日締め、翌月末日払い。" },
                { title: "第5条（秘密保持）", text: "甲乙双方は、本契約に関連して知り得た相手方の秘密情報を第三者に開示してはならない。" },
              ].map((clause, i) => (
                <div key={i} style={{ marginBottom: 12, padding: "10px 14px", background: i === 4 && aiOn ? "#fff7ed" : "#f8fafc", borderRadius: 8, border: i === 4 && aiOn ? "1px solid #fed7aa" : "1px solid transparent" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#1e293b" }}>{clause.title}</div>
                  <div style={{ fontSize: 11, color: "#475569", lineHeight: 1.7 }}>{clause.text}</div>
                  {i === 4 && aiOn && (
                    <div style={{ fontSize: 10, color: "#f59e0b", marginTop: 4, fontWeight: 600 }}>AI: このテンプレートは2024年版です。2026年改正個人情報保護法に対応した条項への更新を推奨</div>
                  )}
                </div>
              ))}
              {aiOn && (
                <div style={{ background: "#ede9fe", borderRadius: 8, padding: 12, fontSize: 11, color: "#6366f1", lineHeight: 1.7 }}>
                  <strong>AI提案:</strong> 反社会的勢力排除条項（第X条）と損害賠償上限条項が未記載です。コンプライアンス上、追加を推奨します。
                </div>
              )}
            </div>
          )}

          {docType === "proposal" && (
            <div style={{ maxWidth: 520, margin: "0 auto" }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#1e293b", marginBottom: 4 }}>ご提案書</div>
              <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 16 }}>株式会社サンライズ建設 様 | 業務デジタル化プロジェクト</div>

              {[
                { num: "01", title: "現状課題の整理", items: ["日報作成に現場監督1人あたり平均1.5時間/日", "安全書類の作成・管理が紙ベース", "15拠点間の情報共有に平均2日のタイムラグ"] },
                { num: "02", title: "ご提案内容", items: ["AI日報自動生成システム（音声入力+写真自動整理）", "安全書類テンプレート管理+AI補完", "リアルタイム現場ダッシュボード"] },
                { num: "03", title: "導入効果（試算）", items: ["日報作成時間: 1.5時間 \u2192 20分（-78%）", "書類作成工数: 月40時間 \u2192 月12時間", "年間削減効果: 約520万円（人件費換算）"] },
              ].map((section, i) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: "#6366f1", background: "#ede9fe", padding: "2px 8px", borderRadius: 4 }}>{section.num}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{section.title}</span>
                  </div>
                  <div style={{ background: i === 2 && aiOn ? "#ede9fe" : "#f8fafc", border: i === 2 && aiOn ? "1px solid #c7d2fe" : "1px solid #e2e8f0", borderRadius: 8, padding: 12 }}>
                    {section.items.map((item, j) => (
                      <div key={j} style={{ fontSize: 11, color: "#475569", lineHeight: 1.8, paddingLeft: 12, position: "relative" }}>
                        <span style={{ position: "absolute", left: 0 }}>{"\u2022"}</span>{item}
                      </div>
                    ))}
                    {i === 2 && aiOn && (
                      <div style={{ fontSize: 10, color: "#6366f1", marginTop: 6, fontWeight: 600 }}>AI: 削減効果の根拠が弱め。建設業DXの業界ベンチマーク（国交省i-Construction推進調査）のデータ挿入を推奨</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Suggestions panel */}
      {aiOn && (
        <div style={{ width: 230, borderLeft: "1px solid #f1f5f9", background: "#fafafa", padding: 14, overflowY: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 800, color: "#fff" }}>AI</div>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#6366f1" }}>SUGGESTIONS</span>
          </div>
          {aiSuggestions[docType].map((s, i) => (
            <div key={i} onClick={() => handleFill(i)} style={{
              padding: "10px 12px", borderRadius: 8, marginBottom: 8, fontSize: 10, lineHeight: 1.6,
              color: filledFields.includes(i) ? "#22c55e" : "#475569",
              background: filledFields.includes(i) ? "#f0fdf4" : "#fff",
              border: `1px solid ${filledFields.includes(i) ? "#bbf7d0" : "#e2e8f0"}`,
              cursor: "pointer", transition: "all 0.2s",
            }}>
              <div>{filledFields.includes(i) ? "\u2713 " : ""}{s.text}</div>
              {!filledFields.includes(i) && (
                <div style={{ marginTop: 6 }}>
                  <span style={{ padding: "2px 8px", borderRadius: 4, background: "#6366f1", color: "#fff", fontSize: 9, fontWeight: 600 }}>{s.action}</span>
                </div>
              )}
            </div>
          ))}
          <div style={{ marginTop: 16, background: "#e0e7ff", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 9, color: "#6366f1", fontWeight: 600 }}>作成時間削減</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#6366f1" }}>-65%</div>
            <div style={{ fontSize: 9, color: "#818cf8" }}>平均 3時間 → 1時間</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== DEMO 05: 社内FAQ =====
function DemoFaq() {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const presetQs = ["有給休暇の申請方法を教えて", "出張費の精算はどうすればいい？", "リモートワークの申請手順は？", "社内システムのパスワードリセット方法"];

  const faqAnswers: Record<string, string> = {
    "有給休暇の申請方法を教えて": "就業規則 第5章 第2条に基づき、社内ポータル「申請」\u2192「休暇申請」から提出してください。\n\n\u25cf 上長の承認後、人事部にて処理されます\n\u25cf 申請は3営業日前までにお願いします\n\u25cf 半日有給の場合は「午前半休」または「午後半休」を選択",
    "出張費の精算はどうすればいい？": "経費規程 第3章 第1条に基づき、出張後5営業日以内に「経費精算システム」から申請してください。\n\n\u25cf 領収書の写真添付が必要です\n\u25cf 交通費はICカード履歴でも可\n\u25cf 日当は等級に応じて自動計算されます",
    "リモートワークの申請手順は？": "就業規則 第8章 第4条に基づき、前日までに「勤怠管理システム」\u2192「リモートワーク申請」から提出してください。\n\n\u25cf 週3日まで利用可能です\n\u25cf 業務報告は当日18時までに提出\n\u25cf Wi-Fi環境のある場所での作業が必須です\n\u25cf 上長が承認後、自動で勤怠に反映されます",
    "社内システムのパスワードリセット方法": "情報セキュリティ規程 第2章に基づく手順です。\n\n【自分でリセットする場合】\n1. ログイン画面の「パスワードを忘れた方」をクリック\n2. 社員番号とメールアドレスを入力\n3. 届いたメールのリンクから新パスワードを設定\n\n【ロックされた場合】\n情報システム部（内線: 2100）に連絡してください。\n本人確認後、仮パスワードが発行されます。\n\n※ パスワードは90日ごとに変更が必要です。",
  };

  const handleQ = (q: string) => {
    setMessages(prev => [...prev, { role: "user", text: q }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { role: "ai", text: faqAnswers[q] || "該当する情報が見つかりませんでした。" }]);
    }, 1200);
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 0" }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", padding: "30px 0" }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{"\ud83d\udcac"}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", marginBottom: 6 }}>社内FAQに質問してみましょう</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>就業規則・社内規程・マニュアルなど、社内文書から回答します</div>
          </div>
        )}
        {messages.map((m, i) => (
          <ChatBubble key={i} role={m.role}>
            {m.text}
            {m.role === "ai" && (
              <div style={{ marginTop: 8 }}>
                <SourceBadge text={"\ud83d\udcc4 " + (messages[i - 1]?.text.includes("パスワード") ? "情報セキュリティ規程" : messages[i - 1]?.text.includes("リモート") ? "就業規則 第8章" : messages[i - 1]?.text.includes("出張") ? "経費規程" : "就業規則")} />
                <SourceBadge text={"\ud83d\udccb " + (messages[i - 1]?.text.includes("パスワード") ? "情シス部マニュアル" : "社内ポータル")} />
              </div>
            )}
          </ChatBubble>
        ))}
        {typing && <ChatBubble role="ai" typing />}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: 14, borderTop: "1px solid #f1f5f9", display: "flex", gap: 6, flexWrap: "wrap" }}>
        {presetQs.map(q => (
          <button key={q} onClick={() => !typing && handleQ(q)} style={{
            padding: "7px 14px", borderRadius: 100, border: "1.5px solid #e2e8f0", background: "#fff",
            fontSize: 11, fontWeight: 600, color: "#475569", cursor: "pointer", transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.color = "#6366f1"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#475569"; }}
          >{q}</button>
        ))}
      </div>
    </div>
  );
}

// ===== DEMO 06: 問い合わせ対応AI =====
function DemoSupport() {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "お問い合わせありがとうございます。\nどのようなご用件でしょうか？" },
  ]);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const categories = ["注文状況の確認", "返品・交換について", "納期の確認", "技術的なご質問"];

  const answers: Record<string, string> = {
    "注文状況の確認": "ご注文番号、またはご登録のお名前をお知らせいただけますか？\n\n例: ORD-2026-12345\n\n確認次第、現在のステータスをお伝えいたします。",
    "返品・交換について": "返品・交換は商品到着後7日以内に承っております。\n\n【手順】\n1. マイページ \u2192「注文履歴」\u2192 該当商品を選択\n2.「返品・交換申請」ボタンをクリック\n3. 理由を選択し、送信\n\n確認後、返送用ラベルをメールでお送りします。",
    "納期の確認": "現在の標準納期は以下の通りです。\n\n\u25cf 標準品: 受注後 3-5営業日\n\u25cf 特注品: 受注後 10-15営業日\n\u25cf 大口注文(1,000個以上): 別途ご相談\n\n具体的な製品の納期確認は、ご注文番号をお知らせください。",
    "技術的なご質問": "技術的なお問い合わせは、以下の情報をいただけるとスムーズにご回答できます。\n\n\u25cf 製品名・型番\n\u25cf ご使用環境（温度・荷重・媒体など）\n\u25cf 具体的なお困りの内容\n\n専門スタッフが確認の上、1営業日以内にご回答いたします。\n\nお急ぎの場合は、技術サポート直通（050-XXXX-XXXX）もご利用いただけます。",
  };

  const handleCat = (cat: string) => {
    setMessages(prev => [...prev, { role: "user", text: cat }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { role: "ai", text: answers[cat] || "" }]);
    }, 1000);
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "10px 20px", background: "#6366f1", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80" }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>カスタマーサポートAI - オンライン</span>
        <span style={{ marginLeft: "auto", fontSize: 9, color: "rgba(255,255,255,0.6)" }}>平均応答: 3秒</span>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
        {messages.map((m, i) => <ChatBubble key={i} role={m.role}>{m.text}</ChatBubble>)}
        {typing && <ChatBubble role="ai" typing />}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: 14, borderTop: "1px solid #f1f5f9", display: "flex", gap: 6, flexWrap: "wrap" }}>
        {categories.map(c => (
          <button key={c} onClick={() => !typing && handleCat(c)} style={{
            padding: "7px 14px", borderRadius: 100, border: "1.5px solid #e2e8f0", background: "#fff",
            fontSize: 11, fontWeight: 600, color: "#475569", cursor: "pointer", transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.color = "#6366f1"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#475569"; }}
          >{c}</button>
        ))}
      </div>
    </div>
  );
}

// ===== DEMO 07: 採用・人事AI =====
function DemoHR() {
  const [selected, setSelected] = useState(0);
  const applicants = [
    { name: "山田 太郎", role: "バックエンドエンジニア", score: "A", skills: { technical: 90, communication: 75, leadership: 60, culture: 85 }, aiNote: "Go/Python でのAPI開発経験5年。AWS上のマイクロサービス構築実績あり。技術力が高く即戦力として期待。コミュニケーション面は1on1でのフォローアップを推奨。" },
    { name: "佐藤 花子", role: "UI/UXデザイナー", score: "A", skills: { technical: 80, communication: 95, leadership: 70, culture: 90 }, aiNote: "Figma/Adobe XDを用いたUI設計の実務経験6年。ユーザーインタビューからプロトタイプ作成までの一貫した経験あり。コミュニケーション力が高く、クライアント折衝も安心。" },
    { name: "鈴木 一郎", role: "法人営業", score: "B", skills: { technical: 45, communication: 85, leadership: 80, culture: 65 }, aiNote: "BtoB営業経験7年。年間売上目標の達成率は平均120%。IT商材の知識は補強が必要だが、顧客開拓力は高い。入社後に製品研修プログラムの受講を推奨。" },
    { name: "高橋 みゆき", role: "カスタマーサクセス", score: "A", skills: { technical: 85, communication: 80, leadership: 55, culture: 88 }, aiNote: "SaaS企業でのCS経験3年。解約率(チャーンレート)を12%から5%に改善した実績あり。データ分析スキルも高く、顧客のLTV最大化に貢献が期待できる。" },
  ];
  const a = applicants[selected];
  const scoreColor = a.score === "A" ? "#22c55e" : "#f59e0b";

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      <div style={{ width: 200, borderRight: "1px solid #f1f5f9", overflowY: "auto", flexShrink: 0 }}>
        <div style={{ padding: "14px 14px 6px", fontSize: 9, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.15em" }}>APPLICANTS ({applicants.length})</div>
        {applicants.map((ap, i) => (
          <div key={i} onClick={() => setSelected(i)} style={{
            padding: "10px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
            borderLeft: selected === i ? "3px solid #6366f1" : "3px solid transparent",
            background: selected === i ? "#f8fafc" : "transparent", transition: "all 0.15s",
          }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#475569" }}>{ap.name[0]}</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#1e293b" }}>{ap.name}</div>
              <div style={{ fontSize: 9, color: "#94a3b8" }}>{ap.role}</div>
            </div>
            <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 800, color: ap.score === "A" ? "#22c55e" : "#f59e0b" }}>{ap.score}</span>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, padding: 18, overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#475569" }}>{a.name[0]}</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>{a.name}</div>
            <div style={{ fontSize: 11, color: "#64748b" }}>{a.role}</div>
          </div>
          <div style={{ marginLeft: "auto", width: 36, height: 36, borderRadius: "50%", background: `${scoreColor}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: scoreColor }}>{a.score}</div>
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", marginBottom: 8 }}>SKILL MATCH</div>
        <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
          {Object.entries(a.skills).map(([key, val]) => {
            const labels: Record<string, string> = { technical: "技術力", communication: "コミュニケーション", leadership: "リーダーシップ", culture: "カルチャーフィット" };
            return (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 100, fontSize: 10, fontWeight: 600, color: "#475569" }}>{labels[key]}</div>
                <div style={{ flex: 1 }}><AnimBar width={val} color="#6366f1" /></div>
                <div style={{ width: 28, fontSize: 10, fontWeight: 700, color: "#6366f1", textAlign: "right" }}>{val}</div>
              </div>
            );
          })}
        </div>
        <div style={{ background: "linear-gradient(135deg,#ede9fe,#e0e7ff)", borderRadius: 12, padding: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#fff" }}>AI</div>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#6366f1" }}>AI ASSESSMENT</span>
          </div>
          <div style={{ fontSize: 12, color: "#1e293b", lineHeight: 1.8 }}>{a.aiNote}</div>
        </div>
      </div>
    </div>
  );
}

// ===== DEMO 08: ダッシュボード =====
function DemoDashboard() {
  const [tab, setTab] = useState<"daily" | "monthly" | "yearly">("monthly");
  const stats = {
    daily: { revenue: "\u00a51.8M", revLabel: "売上", revChange: "+5.2%", customers: "12", custLabel: "新規顧客", custChange: "+3", convRate: "58%", convLabel: "受注率", convChange: "+4%" },
    monthly: { revenue: "\u00a548.2M", revLabel: "売上", revChange: "+12.4%", customers: "324", custLabel: "顧客数", custChange: "+18", convRate: "62%", convLabel: "受注率", convChange: "-2%" },
    yearly: { revenue: "\u00a5520M", revLabel: "売上", revChange: "+18.7%", customers: "1,842", custLabel: "顧客数", custChange: "+245", convRate: "64%", convLabel: "受注率", convChange: "+5%" },
  };
  const s = stats[tab];

  return (
    <div style={{ padding: 18, height: "100%", overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>BUSINESS DASHBOARD</div>
        <div style={{ display: "flex", gap: 4, background: "#f1f5f9", borderRadius: 8, padding: 3 }}>
          {(["daily", "monthly", "yearly"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "5px 12px", borderRadius: 6, border: "none", fontSize: 10, fontWeight: 600, cursor: "pointer",
              background: tab === t ? "#fff" : "transparent", color: tab === t ? "#0f172a" : "#94a3b8",
              boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.08)" : "none", transition: "all 0.2s",
            }}>
              {{ daily: "日次", monthly: "月次", yearly: "年次" }[t]}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 18 }}>
        <MiniCard label={s.revLabel} value={s.revenue} sub={`\u25b2 ${s.revChange}`} />
        <MiniCard label={s.custLabel} value={s.customers} sub={`\u25bc ${s.custChange}`} subColor="#22c55e" />
        <MiniCard label={s.convLabel} value={s.convRate} sub={`\u25b2 ${s.convChange}`} />
      </div>

      <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", marginBottom: 8 }}>DEPARTMENT PERFORMANCE</div>
      <div style={{ display: "grid", gap: 8, marginBottom: 18 }}>
        {[
          { dept: "営業部", val: 87, color: "#6366f1" },
          { dept: "開発部", val: 94, color: "#22c55e" },
          { dept: "カスタマーサポート", val: 72, color: "#f59e0b" },
          { dept: "管理部", val: 81, color: "#8b5cf6" },
        ].map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 100, fontSize: 11, fontWeight: 600, color: "#475569" }}>{d.dept}</div>
            <div style={{ flex: 1 }}><AnimBar width={d.val} color={d.color} delay={i * 150} /></div>
            <div style={{ width: 36, fontSize: 11, fontWeight: 700, color: d.color, textAlign: "right" }}>{d.val}%</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", marginBottom: 8 }}>RECENT ACTIVITY</div>
      {[
        { dot: "#22c55e", text: "A社との商談が成約しました（\u00a52.1M）", time: "1時間前" },
        { dot: "#6366f1", text: "新規問い合わせ 3件（Web経由）", time: "2時間前" },
        { dot: "#f59e0b", text: "B社の見積もり有効期限が明日です", time: "3時間前" },
        { dot: "#22c55e", text: "カスタマーサポート: 今月の満足度スコア 4.6/5.0", time: "5時間前" },
        { dot: "#ef4444", text: "営業部: 月末目標まであと\u00a55.8M（達成率 88%）", time: "6時間前" },
      ].map((a, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: a.dot, flexShrink: 0 }} />
          <div style={{ flex: 1, fontSize: 11, color: "#334155" }}>{a.text}</div>
          <div style={{ fontSize: 9, color: "#94a3b8", flexShrink: 0 }}>{a.time}</div>
        </div>
      ))}
    </div>
  );
}

// ===== Main Page =====
export default function DemoPage() {
  const [active, setActive] = useState<DemoId>("manufacturing");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const demoComponents: Record<DemoId, React.ReactNode> = {
    manufacturing: <DemoManufacturing />,
    report: <DemoReport />,
    sales: <DemoSales />,
    doc: <DemoDoc />,
    faq: <DemoFaq />,
    support: <DemoSupport />,
    hr: <DemoHR />,
    dashboard: <DemoDashboard />,
  };

  const activeDemo = demos.find(d => d.id === active)!;

  return (
    <div style={{ fontFamily: "inherit", background: "#0f172a", minHeight: "100vh", color: "#f8fafc" }}>
      {/* Nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(15,23,42,0.9)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px", height: 56,
      }}>
        <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/7.png" alt="80" style={{ height: 40, display: "block" }} />
          <span style={{ width: 1, height: 14, background: "rgba(255,255,255,0.15)" }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: "#6366f1", letterSpacing: "0.1em" }}>AI Labs</span>
          <span style={{ width: 1, height: 14, background: "rgba(255,255,255,0.15)" }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}>DEMO</span>
        </a>
        <a href="/contact" style={{
          fontSize: 11, fontWeight: 600, color: "#fff", textDecoration: "none",
          padding: "6px 18px", borderRadius: 100, background: "#6366f1",
        }}>
          無料相談
        </a>
      </nav>

      {/* Header */}
      <div style={{ paddingTop: 56 }}>
        <div style={{ padding: isMobile ? "32px 20px 20px" : "40px 48px 24px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", color: "#6366f1", marginBottom: 8 }}>INTERACTIVE DEMO</div>
          <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.3, marginBottom: 6 }}>
            実際に触って体験できます。
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
            製造現場で使えるAIシステムの動作イメージです。各サービスを選択してお試しください。
          </p>
        </div>

        {/* Demo selector */}
        <div style={{ padding: isMobile ? "0 20px" : "0 48px", maxWidth: 1200, margin: "0 auto" }}>
          <div className="demo-selector" style={{
            display: "flex", gap: 6, overflowX: "auto", paddingBottom: 16,
            scrollbarWidth: "none",
          }}>
            {demos.map(d => (
              <button key={d.id} onClick={() => setActive(d.id)} style={{
                padding: "8px 16px", borderRadius: 10, border: active === d.id ? "1.5px solid #6366f1" : "1.5px solid rgba(255,255,255,0.08)",
                background: active === d.id ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.03)",
                color: active === d.id ? "#a5b4fc" : "rgba(255,255,255,0.45)",
                fontSize: 11, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                whiteSpace: "nowrap", flexShrink: 0, display: "flex", alignItems: "center", gap: 6,
              }}>
                <span style={{ fontSize: 9, fontWeight: 800, color: active === d.id ? "#6366f1" : "rgba(255,255,255,0.2)" }}>{d.num}</span>
                {d.title}
              </button>
            ))}
          </div>
        </div>

        {/* Active demo tag */}
        <div style={{ padding: isMobile ? "0 20px" : "0 48px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "#6366f1", padding: "3px 10px", borderRadius: 100, background: "rgba(99,102,241,0.12)" }}>{activeDemo.tag}</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#f8fafc" }}>{activeDemo.title}</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{"\u2014"} {activeDemo.desc}</span>
          </div>
        </div>

        {/* Demo container */}
        <div style={{ padding: isMobile ? "0 20px 40px" : "0 48px 60px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            background: "#fff", borderRadius: 16, overflow: "hidden",
            height: isMobile ? 520 : 560,
            boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
          }}>
            {/* Window chrome */}
            <div style={{ height: 36, background: "#f1f5f9", display: "flex", alignItems: "center", padding: "0 14px", gap: 6, borderBottom: "1px solid #e2e8f0" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#fca5a5" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#fde68a" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#86efac" }} />
              <div style={{ flex: 1, textAlign: "center", fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>{activeDemo.title} | AI Labs</div>
            </div>
            <div style={{ height: "calc(100% - 36px)" }}>
              {demoComponents[active]}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{ padding: isMobile ? "40px 20px 60px" : "40px 48px 80px", textAlign: "center" }}>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.35)", marginBottom: 20, lineHeight: 1.8 }}>
            実際のシステムは、貴社の設備・業務フローに合わせてカスタマイズして構築します。<br />
            <span style={{ fontSize: 12 }}>まずは無料ヒアリングで、どこから始められるかご提案します。</span>
          </p>
          <a href="/contact" style={{
            display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700,
            color: "#fff", background: "#6366f1", padding: "14px 32px", borderRadius: 100,
            textDecoration: "none", transition: "all 0.3s", boxShadow: "0 8px 32px rgba(99,102,241,0.35)",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
          >{"\u2192"} 無料相談を申し込む</a>
        </div>
      </div>

      <style>{`
        .demo-selector::-webkit-scrollbar { display: none; }
        @media (max-width: 900px) {
          .demo-selector { gap: 4px !important; }
        }
      `}</style>
    </div>
  );
}
