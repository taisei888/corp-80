"use client";

import { useState, useRef } from "react";

const FIELDS = [
  { key: "company", label: "会社名", placeholder: "株式会社○○" },
  { key: "industry", label: "業種", placeholder: "飲食業、製造業、IT、不動産など" },
  { key: "employees", label: "従業員数", placeholder: "50名、200名など" },
  { key: "locations", label: "店舗数・拠点数", placeholder: "5店舗、本社+支社3拠点など" },
  { key: "role", label: "商談相手の役職", placeholder: "代表取締役、人事部長、総務マネージャーなど" },
  { key: "pain_points", label: "現在困っていること", placeholder: "離職が多い、クレーム対応が属人化しているなど", multiline: true },
  { key: "time_consuming", label: "時間がかかっている業務", placeholder: "日報確認、問い合わせ対応、新人教育など", multiline: true },
  { key: "dependent", label: "属人化している業務", placeholder: "会計処理、顧客対応、見積作成など", multiline: true },
  { key: "sharing_issues", label: "社内共有で困っていること", placeholder: "マニュアルがバラバラ、LINEで連絡しているなど", multiline: true },
  { key: "hr_issues", label: "人材・離職・モチベーションの課題", placeholder: "離職率が高い、現場の声が届かないなど", multiline: true },
  { key: "current_tools", label: "現在使っているツール", placeholder: "Excel、紙、LINE、kintone、freeeなど" },
  { key: "budget", label: "予算感", placeholder: "月5万円以内、初期100万円以内、未定など" },
  { key: "timeline", label: "導入時期", placeholder: "来月、来期、すぐにでも、未定など" },
  { key: "reactions", label: "相手が特に反応していた話", placeholder: "組織診断の話に興味を示した、コスト削減に前のめりだったなど", multiline: true },
  { key: "my_ideas", label: "こちらが提案できそうだと感じたこと", placeholder: "LENS AIが合いそう、FAQ系のシステムが刺さりそうなど", multiline: true },
  { key: "other", label: "その他メモ", placeholder: "自由記述", multiline: true },
] as const;

type FormData = Record<string, string>;

export default function HearingTool() {
  const [form, setForm] = useState<FormData>(() => {
    const init: FormData = {};
    FIELDS.forEach(f => init[f.key] = "");
    return init;
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  const update = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

  const buildMemo = () => {
    return FIELDS
      .filter(f => form[f.key].trim())
      .map(f => `${f.label}：${form[f.key].trim()}`)
      .join("\n");
  };

  const analyze = async () => {
    const memo = buildMemo();
    if (!memo) return;
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/hearing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.result);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
  };

  const clearAll = () => {
    const init: FormData = {};
    FIELDS.forEach(f => init[f.key] = "");
    setForm(init);
    setResult("");
    setError("");
  };

  const filledCount = FIELDS.filter(f => form[f.key].trim()).length;

  const inputBase: React.CSSProperties = {
    width: "100%", padding: "12px 16px", borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)",
    fontSize: 13, fontFamily: "inherit", color: "#f8fafc", lineHeight: 1.7,
    outline: "none", transition: "border-color 0.2s",
  };

  // Parse result into sections
  const sections = result.split(/(?=\d+\.\s)/).filter(s => s.trim());

  return (
    <div style={{ fontFamily: "'Noto Sans JP', sans-serif", background: "#0f172a", color: "#f8fafc", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        padding: "16px 32px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(15,23,42,0.95)", backdropFilter: "blur(12px)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1" }} />
          <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.05em" }}>Hearing → Proposal</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>internal tool</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{filledCount}/{FIELDS.length} 入力済</span>
          <button onClick={clearAll} style={{
            padding: "5px 12px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.08)",
            background: "transparent", color: "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
          }}>クリア</button>
        </div>
      </div>

      {/* Form */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>ヒアリングメモ入力</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}>
            商談時のメモを入力してください。全項目埋める必要はありません。わかる範囲でOKです。
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {FIELDS.map((f) => (
            <div key={f.key}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 6, letterSpacing: "0.04em" }}>
                {f.label}
              </label>
              {"multiline" in f && f.multiline ? (
                <textarea
                  value={form[f.key]}
                  onChange={e => update(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  rows={3}
                  style={{ ...inputBase, resize: "vertical" }}
                  onFocus={e => e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)"}
                  onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                />
              ) : (
                <input
                  type="text"
                  value={form[f.key]}
                  onChange={e => update(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  style={inputBase}
                  onFocus={e => e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)"}
                  onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                />
              )}
            </div>
          ))}
        </div>

        {/* Submit */}
        <div style={{ marginTop: 32, display: "flex", gap: 12, alignItems: "center" }}>
          <button
            onClick={analyze}
            disabled={loading || filledCount === 0}
            style={{
              flex: 1, padding: "18px 28px", borderRadius: 12, border: "none",
              background: loading ? "rgba(99,102,241,0.3)" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff", fontSize: 15, fontWeight: 700, cursor: loading ? "wait" : "pointer",
              fontFamily: "inherit", transition: "all 0.2s",
              boxShadow: loading ? "none" : "0 4px 20px rgba(99,102,241,0.3)",
            }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <span className="ht-spinner" style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block" }} />
                分析中...（20〜40秒ほどかかります）
              </span>
            ) : "提案を生成する →"}
          </button>
        </div>

        {error && (
          <div style={{ marginTop: 16, padding: 16, borderRadius: 10, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", fontSize: 13, color: "#fca5a5" }}>
            {error}
          </div>
        )}
      </div>

      {/* Result */}
      {result && (
        <div ref={resultRef} style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 32 }}>
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 80px" }}>

            {/* Result header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>
                  {form.company ? `${form.company} 向け提案` : "提案結果"}
                </h2>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
                  {form.industry && `${form.industry}`}{form.employees && ` / ${form.employees}`}
                </p>
              </div>
              <button onClick={copyResult} style={{
                padding: "8px 18px", borderRadius: 8, border: "1px solid rgba(99,102,241,0.3)",
                background: "rgba(99,102,241,0.08)", color: "#a78bfa", fontSize: 12, fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.15)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(99,102,241,0.08)"; }}
              >全文コピー</button>
            </div>

            {/* Sections */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {sections.map((section, i) => {
                const lines = section.trim().split("\n");
                const title = lines[0] || "";
                const body = lines.slice(1).join("\n").trim();
                return (
                  <div key={i} style={{
                    padding: "24px 28px", borderRadius: 14,
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                  }}>
                    <div style={{
                      fontSize: 14, fontWeight: 800, color: "#a78bfa", marginBottom: 14,
                      paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}>
                      {title}
                    </div>
                    <div style={{
                      fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 2.0,
                      whiteSpace: "pre-wrap", wordBreak: "break-word",
                    }}>
                      {body}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Raw toggle */}
            <details style={{ marginTop: 24 }}>
              <summary style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", cursor: "pointer", padding: "8px 0" }}>
                生テキストを表示
              </summary>
              <pre style={{
                marginTop: 12, padding: 20, borderRadius: 10,
                background: "rgba(0,0,0,0.3)", fontSize: 12, color: "rgba(255,255,255,0.5)",
                lineHeight: 1.8, whiteSpace: "pre-wrap", wordBreak: "break-word",
                maxHeight: 400, overflow: "auto",
              }}>
                {result}
              </pre>
            </details>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .ht-spinner { animation: spin 0.8s linear infinite; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.15); }
      `}</style>
    </div>
  );
}
