"use client";

import { useEffect, useRef, useState } from "react";

const BLUE = "#1690f5";
const BLUE_DEEP = "#0d6fd8";
const NAVY = "#0b3e7a";
const BLUE_BG = "#eaf5ff";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING: Msg = {
  role: "assistant",
  content: "こんにちは！AI業務診断です🤖\n今、手間がかかっている業務や困りごとを入力してみてください。「AIエージェントならどう自動化できるか」を、その場でお答えします。",
};

const QUICK_CHIPS = [
  "請求書や領収書の入力が大変",
  "電話対応に追われている",
  "シフト作成が毎月つらい",
  "口コミ返信まで手が回らない",
];

export default function LeadChat({ headFont, hero = false, greeting, placeholder }: { headFont: React.CSSProperties; hero?: boolean; greeting?: string; placeholder?: string }) {
  const [messages, setMessages] = useState<Msg[]>([greeting ? { role: "assistant", content: greeting } : GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/lead-chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next.slice(1), leadSent }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error();
      setMessages((m) => [...m, { role: "assistant", content: json.reply || "うまく返答できませんでした。もう一度お試しください。" }]);
      if (json.leadCaptured) setLeadSent(true);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "通信エラーが発生しました。少し時間をおいてお試しいただくか、お問い合わせフォームをご利用ください。" }]);
    } finally {
      setBusy(false);
    }
  }

  const userTurns = messages.filter((m) => m.role === "user").length;
  // ヒーロー埋め込み時は、最初の送信までメッセージ欄を畳んでおく（Yoom風の入力ボックス見え）
  const expanded = !hero || userTurns > 0 || busy;

  return (
    <div style={{
      background: "#fff", borderRadius: 24, overflow: "hidden",
      boxShadow: "0 24px 64px rgba(9,60,120,0.22)",
      display: "flex", flexDirection: "column",
    }}>
      {/* header */}
      <div style={{ background: "linear-gradient(90deg, #38a5ff, #0e6fe0)", padding: "14px 20px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#7CFFA0", boxShadow: "0 0 8px #7CFFA0" }} />
        <span style={{ ...headFont, fontSize: 14, color: "#fff", letterSpacing: "0.04em" }}>AI業務診断チャット</span>
        <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.85)", background: "rgba(255,255,255,0.16)", padding: "3px 10px", borderRadius: 100 }}>無料・その場で回答</span>
      </div>

      {/* messages */}
      <div ref={listRef} style={{
        height: expanded ? (hero ? 300 : 330) : 0,
        overflowY: expanded ? "auto" : "hidden",
        padding: expanded ? "18px 18px 8px" : "0 18px",
        display: "flex", flexDirection: "column", gap: 12, background: "#f7fbff",
        transition: "height 0.4s cubic-bezier(0.16,1,0.3,1), padding 0.4s",
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "82%", padding: "11px 15px", fontSize: 13, lineHeight: 1.8, whiteSpace: "pre-wrap",
              borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              background: m.role === "user" ? BLUE : "#fff",
              color: m.role === "user" ? "#fff" : "#2c4a6b",
              boxShadow: m.role === "user" ? "0 4px 12px rgba(22,144,245,0.25)" : "0 2px 10px rgba(13,111,216,0.08)",
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {busy && (
          <div style={{ display: "flex" }}>
            <div style={{ padding: "11px 15px", borderRadius: "16px 16px 16px 4px", background: "#fff", boxShadow: "0 2px 10px rgba(13,111,216,0.08)", fontSize: 13, color: "#7d99b8" }}>
              <span style={{ animation: "lcblink 1.2s infinite" }}>●</span>
              <span style={{ animation: "lcblink 1.2s infinite", animationDelay: "0.2s" }}> ●</span>
              <span style={{ animation: "lcblink 1.2s infinite", animationDelay: "0.4s" }}> ●</span>
            </div>
          </div>
        )}
      </div>

      {/* quick chips（最初だけ表示） */}
      {userTurns === 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: expanded ? "10px 18px 0" : "16px 18px 0", background: "#f7fbff" }}>
          {QUICK_CHIPS.map((c) => (
            <button key={c} onClick={() => send(c)} style={{
              fontSize: 11.5, fontWeight: 700, color: BLUE_DEEP, background: BLUE_BG,
              border: "none", borderRadius: 100, padding: "8px 14px", cursor: "pointer",
              fontFamily: "inherit", transition: "background 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#d9edff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = BLUE_BG; }}
            >{c}</button>
          ))}
        </div>
      )}

      {/* input */}
      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        style={{ display: "flex", gap: 10, padding: "14px 18px 16px", background: "#f7fbff" }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={userTurns >= 10 ? "続きは無料相談でどうぞ！" : (placeholder ?? "例：毎月の請求書づくりに追われています…")}
          disabled={busy || userTurns >= 10}
          maxLength={500}
          style={{
            flex: 1, padding: "12px 16px", borderRadius: 100, border: "1.5px solid #d8e8f8",
            fontSize: 13, fontFamily: "inherit", color: NAVY, outline: "none", background: "#fff",
          }}
          onFocus={e => { e.currentTarget.style.borderColor = BLUE; }}
          onBlur={e => { e.currentTarget.style.borderColor = "#d8e8f8"; }}
        />
        <button type="submit" disabled={busy || !input.trim()} style={{
          width: 44, height: 44, borderRadius: "50%", border: "none", background: BLUE, color: "#fff",
          cursor: busy ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 14px rgba(22,144,245,0.35)", opacity: input.trim() && !busy ? 1 : 0.5,
          flexShrink: 0, transition: "opacity 0.2s",
        }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </button>
      </form>

      <style>{`
        @keyframes lcblink { 0%,100% { opacity: 0.25; } 50% { opacity: 1; } }
      `}</style>
    </div>
  );
}
