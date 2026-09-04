"use client";

import { useEffect, useRef, useState } from "react";
import { M_PLUS_Rounded_1c } from "next/font/google";

const rounded = M_PLUS_Rounded_1c({ subsets: ["latin"], weight: ["700", "800"] });

const NAVY = "#1e3a5f";
const BLUE = "#3b82d6";
const MUTED = "#64798f";
const BG_ALT = "#f4f9fe";
const STAGE = "#122a4a";

type Booth = "dona" | "tell" | "post";

const BOOTHS: Record<Booth, { img: string; name: string; role: string; intro: string; color: string }> = {
  dona: { img: "/chars/prop-receipts.png", name: "DONA", role: "文字読み取りAI", color: "#f59e0b",
    intro: "レシートでも名刺でも手書きメモでも、写真をくれたら読みとります。お手元の1枚、試してみて！" },
  tell: { img: "/chars/prop-phone.png", name: "TELL", role: "音声対話AI", color: "#ec4899",
    intro: "ぼくは声でお話しできます。お店に電話をかけたつもりで、何か話しかけてみて！" },
  post: { img: "/chars/prop-routine.png", name: "POST", role: "文章生成AI", color: "#10b981",
    intro: "お題をくれたら、そのまま送れるビジネスメールを書きます。むずかしいお詫びメールも、まかせて！" },
};

const TELL_CHIPS = ["金曜の19時に4人で予約したいんですけど", "営業時間をおしえてください", "駐車場はありますか？"];
const POST_CHIPS = ["納期遅延のお詫びメール", "見積書を送るときの添え文", "打ち合わせの日程調整のお願い", "お支払いのやんわりした催促"];

// LINE通知風カード
function LineCard({ title, body, show }: { title: string; body: string; show: boolean }) {
  if (!show) return null;
  return (
    <div style={{
      marginTop: 18, maxWidth: 360, marginLeft: "auto", marginRight: "auto",
      animation: "slideUp 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
    }}>
      <p style={{ fontSize: 11, fontWeight: 800, color: MUTED, textAlign: "center", marginBottom: 8 }}>── そして、担当者のスマホには ──</p>
      <div style={{ background: "#0f1c2e", borderRadius: 22, padding: "12px 12px 14px", boxShadow: "0 18px 44px rgba(15,28,46,0.35)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 6px 8px" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#39c26d" }} />
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", fontWeight: 700 }}>たった今</span>
        </div>
        <div style={{ background: "#fff", borderRadius: 14, padding: "12px 14px", display: "flex", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "#06C755", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, flexShrink: 0 }}>LINE</div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 12, fontWeight: 800, color: "#111" }}>{title}</p>
            <p style={{ fontSize: 11.5, color: "#555", lineHeight: 1.6, marginTop: 2 }}>{body}</p>
          </div>
        </div>
      </div>
      <p style={{ fontSize: 10.5, color: MUTED, textAlign: "center", marginTop: 8 }}>※ デモ演出です。実際の導入ではLINE・メール・Slack等に通知できます</p>
    </div>
  );
}

export default function DemoLabPage() {
  const [booth, setBooth] = useState<Booth>("dona");
  const hf: React.CSSProperties = { fontFamily: rounded.style.fontFamily, fontWeight: 800 };

  // ── DONA ──
  const [img, setImg] = useState<string | null>(null);
  const [donaBusy, setDonaBusy] = useState(false);
  const [donaLog, setDonaLog] = useState<string[]>([]);
  const [donaResult, setDonaResult] = useState<{ type?: string; title?: string; fields?: { label: string; value: string }[]; comment?: string; error?: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function onFile(f: File | undefined) {
    if (!f || !f.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      // 縮小してからアップ（重い写真対策）
      const image = new Image();
      image.onload = () => {
        const scale = Math.min(1, 1400 / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = image.width * scale;
        canvas.height = image.height * scale;
        canvas.getContext("2d")!.drawImage(image, 0, 0, canvas.width, canvas.height);
        setImg(canvas.toDataURL("image/jpeg", 0.85));
        setDonaResult(null);
        setDonaLog([]);
      };
      image.src = reader.result as string;
    };
    reader.readAsDataURL(f);
  }

  async function runDona() {
    if (!img || donaBusy) return;
    setDonaBusy(true);
    setDonaResult(null);
    setDonaLog([]);
    const steps = ["画像を受け取りました…", "文字のありかを探しています…", "1文字ずつ読みとっています…", "項目を整理しています…"];
    steps.forEach((st, i) => setTimeout(() => setDonaLog((l) => [...l, st]), i * 900));
    try {
      const res = await fetch("/api/demo/vision", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ image: img }),
      });
      const json = await res.json();
      setTimeout(() => {
        setDonaResult(res.ok ? json : { error: json.error || "読み取りに失敗しました" });
        setDonaBusy(false);
      }, Math.max(0, steps.length * 900 - 200));
    } catch {
      setDonaResult({ error: "通信エラーが発生しました" });
      setDonaBusy(false);
    }
  }

  // ── TELL ──
  const [tellInput, setTellInput] = useState("");
  const [tellBusy, setTellBusy] = useState(false);
  const [tellReply, setTellReply] = useState<string | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [ringing, setRinging] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  async function runTell(text: string) {
    const message = text.trim();
    if (!message || tellBusy) return;
    setTellBusy(true);
    setTellReply(null);
    setRinging(true);
    try {
      const res = await fetch("/api/demo/voice", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const json = await res.json();
      setRinging(false);
      if (!res.ok) throw new Error();
      setTellReply(json.reply);
      if (json.audio) {
        const audio = new Audio(json.audio);
        audioRef.current = audio;
        setSpeaking(true);
        audio.onended = () => setSpeaking(false);
        audio.play().catch(() => setSpeaking(false));
      }
    } catch {
      setRinging(false);
      setTellReply("すみません、うまく聞き取れませんでした。もう一度お願いします。");
    } finally {
      setTellBusy(false);
    }
  }

  // ── POST ──
  const [postTopic, setPostTopic] = useState("");
  const [postDetail, setPostDetail] = useState("");
  const [postBusy, setPostBusy] = useState(false);
  const [postMail, setPostMail] = useState<string | null>(null);
  const [typed, setTyped] = useState("");

  async function runPost(topic: string) {
    if (!topic.trim() || postBusy) return;
    setPostTopic(topic);
    setPostBusy(true);
    setPostMail(null);
    setTyped("");
    try {
      const res = await fetch("/api/demo/write", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ topic, detail: postDetail || undefined }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error();
      setPostMail(json.mail);
    } catch {
      setPostMail("すみません、うまく書けませんでした。もう一度お試しください。");
    } finally {
      setPostBusy(false);
    }
  }

  // タイプライター
  useEffect(() => {
    if (!postMail) return;
    let i = 0;
    const id = setInterval(() => {
      i += 2;
      setTyped(postMail.slice(0, i));
      if (i >= postMail.length) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, [postMail]);

  const b = BOOTHS[booth];

  return (
    <div style={{ background: "#fff", color: NAVY, fontFamily: "inherit", minHeight: "100vh" }}>
      {/* ナビ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px", height: 62, borderBottom: "1px solid #eef3f9",
      }}>
        <a href="/ai-labs" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src="/logo-mark.png" alt="" style={{ height: 42 }} />
          <span style={{ ...hf, fontSize: 13.5, color: NAVY }}>AI Labs ─ 合同会社80</span>
        </a>
        <a href="/contact" style={{ fontSize: 13, fontWeight: 800, color: "#fff", textDecoration: "none", background: BLUE, padding: "10px 26px", borderRadius: 100 }}>無料相談</a>
      </nav>

      {/* ══ 劇場ステージ ══ */}
      <section style={{ background: STAGE, padding: "108px 40px 0", position: "relative", overflow: "hidden" }}>
        {/* スポットライト */}
        <div style={{ position: "absolute", left: "50%", top: 0, transform: "translateX(-50%)", width: 900, height: 520, background: "radial-gradient(ellipse 420px 480px at 50% 30%, rgba(140,190,255,0.28), transparent 70%)", pointerEvents: "none" }} />
        {/* 舞台照明 */}
        <div style={{ position: "absolute", top: 84, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 60 }}>
          {["#ffd166", "#8cbeff", "#ff9fb2", "#8cbeff", "#ffd166"].map((c, i) => (
            <span key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, boxShadow: `0 0 18px 4px ${c}66`, animation: `twinkle 2.6s ease-in-out ${i * 0.4}s infinite` }} />
          ))}
        </div>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.3em", color: "#8cbeff", marginBottom: 14 }}>EXPERIENCE LAB</p>
          <h1 style={{ ...hf, fontSize: "clamp(28px, 3.6vw, 44px)", color: "#fff", lineHeight: 1.5 }}>
            ようこそ、<span style={{ color: "#8cbeff" }}>AI体験ラボ</span>へ。
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 2, marginTop: 14 }}>
            ここでは、ぼくらの仕事を<b style={{ color: "#fff" }}>実際に体験</b>できます。<br />
            読ませてよし、話してよし、書かせてよし。さあ、どの子に頼んでみますか？
          </p>

          {/* ブース選択 */}
          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 36, flexWrap: "wrap" }} className="booth-row">
            {(Object.keys(BOOTHS) as Booth[]).map((key) => {
              const bb = BOOTHS[key];
              const on = booth === key;
              return (
                <button key={key} onClick={() => setBooth(key)} className="booth-btn" style={{
                  width: 190, background: on ? "#fff" : "rgba(255,255,255,0.08)",
                  border: on ? "2.5px solid #8cbeff" : "1.5px solid rgba(255,255,255,0.18)",
                  borderRadius: 20, padding: "18px 12px 14px", cursor: "pointer", fontFamily: "inherit",
                  transform: on ? "translateY(-6px)" : undefined, transition: "all 0.35s",
                }}>
                  <img src={bb.img} alt={bb.name} style={{ height: 84, display: "block", margin: "0 auto", animation: on ? "bob 3s ease-in-out infinite" : undefined }} />
                  <p style={{ ...hf, fontSize: 14, color: on ? NAVY : "#fff", marginTop: 8 }}>{bb.name}</p>
                  <p style={{ fontSize: 10.5, fontWeight: 800, color: on ? BLUE : "rgba(255,255,255,0.65)", marginTop: 3 }}>{bb.role}</p>
                </button>
              );
            })}
          </div>
        </div>
        {/* 舞台の床 */}
        <div style={{ height: 54, background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.25))", marginTop: 26 }} />
      </section>

      {/* ══ 体験ブース ══ */}
      <section style={{ padding: "56px 40px 80px", background: BG_ALT, minHeight: 620 }}>
        <div key={booth} style={{ maxWidth: 760, margin: "0 auto", animation: "slideUp 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}>
          {/* 出演者あいさつ */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 26 }}>
            <div className="chara" style={{ flexShrink: 0 }}>
              <img src={b.img} alt={b.name} style={{ height: speaking && booth === "tell" ? 132 : 124, animation: (donaBusy && booth === "dona") || (tellBusy && booth === "tell") || (postBusy && booth === "post") ? "workBob 0.5s ease-in-out infinite" : "bob 3.2s ease-in-out infinite" }} />
            </div>
            <div style={{ position: "relative", background: "#fff", border: "1.5px solid #e3edf7", borderRadius: 18, padding: "14px 20px", boxShadow: "0 10px 28px rgba(30,58,95,0.1)", flex: 1 }}>
              <p style={{ ...hf, fontSize: 14, lineHeight: 1.9 }}>
                {b.name}（{b.role}）：「{b.intro}」
              </p>
              {booth === "tell" && speaking && (
                <span style={{ display: "inline-flex", gap: 3, marginTop: 6 }}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span key={i} style={{ width: 4, borderRadius: 99, background: BLUE, height: 14, animation: `talk 0.7s ease-in-out ${i * 0.12}s infinite` }} />
                  ))}
                </span>
              )}
            </div>
          </div>

          {/* ── DONAブース ── */}
          {booth === "dona" && (
            <div style={{ background: "#fff", borderRadius: 24, padding: "30px 32px", boxShadow: "0 12px 36px rgba(30,58,95,0.08)" }}>
              {!img ? (
                <button
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files?.[0]); }}
                  style={{
                    width: "100%", border: "2.5px dashed #b9d4f2", borderRadius: 20, background: BG_ALT,
                    padding: "52px 20px", cursor: "pointer", fontFamily: "inherit", textAlign: "center",
                  }}>
                  <p style={{ fontSize: 40 }}>📸</p>
                  <p style={{ ...hf, fontSize: 16, color: NAVY, marginTop: 10 }}>レシート・名刺・手書きメモの写真を<br />ここにドロップ（クリックで選択）</p>
                  <p style={{ fontSize: 12, color: MUTED, marginTop: 10 }}>アップした画像は読み取りにのみ使用し、保存しません</p>
                </button>
              ) : (
                <div style={{ display: "flex", gap: 26, alignItems: "flex-start", flexWrap: "wrap" }}>
                  <div style={{ width: 220, flexShrink: 0 }}>
                    <img src={img} alt="アップロード画像" style={{ width: "100%", borderRadius: 14, boxShadow: "0 8px 24px rgba(30,58,95,0.15)" }} />
                    <button onClick={() => { setImg(null); setDonaResult(null); setDonaLog([]); }} style={{ fontSize: 11.5, fontWeight: 700, color: MUTED, background: "none", border: "none", cursor: "pointer", marginTop: 8, fontFamily: "inherit" }}>別の画像にする</button>
                  </div>
                  <div style={{ flex: 1, minWidth: 280 }}>
                    {!donaResult && !donaBusy && (
                      <button onClick={runDona} style={{ ...hf, fontSize: 14.5, color: "#fff", background: b.color, border: "none", borderRadius: 100, padding: "14px 36px", cursor: "pointer", boxShadow: `0 8px 24px ${b.color}55` }}>
                        DONA、読んで！ →
                      </button>
                    )}
                    {donaLog.length > 0 && !donaResult && (
                      <div style={{ background: BG_ALT, borderRadius: 14, padding: "16px 20px" }}>
                        {donaLog.map((l, i) => (
                          <p key={i} style={{ fontSize: 12.5, fontWeight: 700, color: i === donaLog.length - 1 ? NAVY : MUTED, padding: "3px 0", animation: "fadeIn 0.4s ease both" }}>
                            {i === donaLog.length - 1 ? "🍩 " : "✓ "}{l}
                          </p>
                        ))}
                      </div>
                    )}
                    {donaResult && (
                      <div style={{ animation: "slideUp 0.45s cubic-bezier(0.34,1.56,0.64,1) both" }}>
                        {donaResult.error ? (
                          <p style={{ fontSize: 13, fontWeight: 700, color: "#c25353" }}>{donaResult.error}</p>
                        ) : (
                          <>
                            <p style={{ fontSize: 11, fontWeight: 800, color: b.color }}>読み取り結果：{donaResult.type}｜{donaResult.title}</p>
                            <div style={{ border: "1.5px solid #e3edf7", borderRadius: 14, overflow: "hidden", marginTop: 10 }}>
                              {(donaResult.fields ?? []).map((f, i) => (
                                <div key={i} style={{ display: "flex", borderTop: i ? "1px solid #eef3f9" : "none" }}>
                                  <span style={{ width: 110, flexShrink: 0, fontSize: 11.5, fontWeight: 800, color: MUTED, background: BG_ALT, padding: "9px 14px" }}>{f.label}</span>
                                  <span style={{ fontSize: 12.5, fontWeight: 700, color: NAVY, padding: "9px 14px" }}>{f.value}</span>
                                </div>
                              ))}
                            </div>
                            {donaResult.comment && <p style={{ ...hf, fontSize: 12.5, color: NAVY, marginTop: 12 }}>🍩「{donaResult.comment}」</p>}
                            <LineCard show title="経理グループ" body={`DONA：新しい${donaResult.type ?? "書類"}を読み取りました。${(donaResult.fields ?? []).slice(0, 2).map((f) => `${f.label} ${f.value}`).join("／")}`} />
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" style={{ display: "none" }} onChange={(e) => onFile(e.target.files?.[0])} />
            </div>
          )}

          {/* ── TELLブース ── */}
          {booth === "tell" && (
            <div style={{ background: "#fff", borderRadius: 24, padding: "30px 32px", boxShadow: "0 12px 36px rgba(30,58,95,0.08)" }}>
              <p style={{ fontSize: 12.5, fontWeight: 800, color: MUTED }}>📞 飲食店「まる山」に電話をかけたつもりで、話しかけてみてください</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
                {TELL_CHIPS.map((c) => (
                  <button key={c} onClick={() => runTell(c)} disabled={tellBusy} style={{ fontSize: 12, fontWeight: 700, color: NAVY, background: BG_ALT, border: "1.5px solid #e3edf7", borderRadius: 100, padding: "9px 18px", cursor: "pointer", fontFamily: "inherit" }}>
                    「{c}」
                  </button>
                ))}
              </div>
              <form onSubmit={(e) => { e.preventDefault(); runTell(tellInput); setTellInput(""); }} style={{ display: "flex", gap: 10, marginTop: 14 }}>
                <input value={tellInput} onChange={(e) => setTellInput(e.target.value)} placeholder="自由に話しかけてもOK（例：個室はありますか？）" maxLength={200}
                  style={{ flex: 1, padding: "13px 18px", borderRadius: 100, border: "1.5px solid #d8e8f8", fontSize: 13, fontFamily: "inherit", color: NAVY, outline: "none" }} />
                <button type="submit" disabled={tellBusy} style={{ ...hf, fontSize: 13.5, color: "#fff", background: b.color, border: "none", borderRadius: 100, padding: "0 28px", cursor: "pointer", boxShadow: `0 6px 18px ${b.color}55` }}>
                  発信
                </button>
              </form>
              {ringing && <p style={{ ...hf, fontSize: 14, color: MUTED, marginTop: 20, animation: "blink 1s infinite" }}>プルルル…　プルルル…</p>}
              {tellReply && (
                <div style={{ marginTop: 20, animation: "slideUp 0.45s cubic-bezier(0.34,1.56,0.64,1) both" }}>
                  <div style={{ background: BG_ALT, borderRadius: 16, padding: "16px 20px", borderLeft: `4px solid ${b.color}` }}>
                    <p style={{ fontSize: 11, fontWeight: 800, color: b.color, marginBottom: 6 }}>{speaking ? "🔊 TELLが話しています…" : "📞 TELLの応答（音声付き）"}</p>
                    <p style={{ ...hf, fontSize: 14.5, lineHeight: 2, color: NAVY }}>「{tellReply}」</p>
                  </div>
                  <LineCard show title="店長" body={`TELL：お電話を承りました。「${tellReply.slice(0, 40)}…」と応対済みです`} />
                </div>
              )}
            </div>
          )}

          {/* ── POSTブース ── */}
          {booth === "post" && (
            <div style={{ background: "#fff", borderRadius: 24, padding: "30px 32px", boxShadow: "0 12px 36px rgba(30,58,95,0.08)" }}>
              <p style={{ fontSize: 12.5, fontWeight: 800, color: MUTED }}>✍️ お題を選ぶと、そのまま送れるメールを書きます</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
                {POST_CHIPS.map((c) => (
                  <button key={c} onClick={() => runPost(c)} disabled={postBusy} style={{ fontSize: 12, fontWeight: 700, color: postTopic === c ? "#fff" : NAVY, background: postTopic === c ? b.color : BG_ALT, border: "1.5px solid #e3edf7", borderRadius: 100, padding: "9px 18px", cursor: "pointer", fontFamily: "inherit" }}>
                    {c}
                  </button>
                ))}
              </div>
              <input value={postDetail} onChange={(e) => setPostDetail(e.target.value)} placeholder="補足があれば（例：遅延は3日間、相手は長年の取引先）" maxLength={300}
                style={{ width: "100%", marginTop: 12, padding: "12px 18px", borderRadius: 14, border: "1.5px solid #d8e8f8", fontSize: 13, fontFamily: "inherit", color: NAVY, outline: "none" }} />
              {postBusy && (
                <p style={{ ...hf, fontSize: 13.5, color: MUTED, marginTop: 18 }}>📮 POSTが書いています<span style={{ animation: "blink 1s infinite" }}>…</span></p>
              )}
              {typed && (
                <div style={{ marginTop: 18 }}>
                  <div style={{ background: BG_ALT, borderRadius: 16, padding: "18px 22px", borderLeft: `4px solid ${b.color}` }}>
                    <p style={{ fontSize: 13, lineHeight: 2.1, color: NAVY, whiteSpace: "pre-wrap", fontWeight: 600 }}>{typed}{typed.length < (postMail?.length ?? 0) && <span style={{ animation: "blink 0.8s infinite", color: BLUE }}>|</span>}</p>
                  </div>
                  {postMail && typed.length >= postMail.length && (
                    <>
                      <button onClick={() => navigator.clipboard.writeText(postMail)} style={{ fontSize: 12, fontWeight: 800, color: BLUE, background: "#ecf4fd", border: "none", borderRadius: 100, padding: "9px 20px", cursor: "pointer", fontFamily: "inherit", marginTop: 12 }}>
                        📋 コピーして使う
                      </button>
                      <LineCard show title="営業チーム" body="POST：メールの下書きが完成しました。確認して送信してください" />
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ══ 締めCTA ══ */}
      <section style={{ padding: "70px 40px 80px", background: "#fff", textAlign: "center" }}>
        <h2 style={{ ...hf, fontSize: "clamp(22px, 2.8vw, 32px)", lineHeight: 1.6 }}>
          いま体験したことが、<span style={{ color: BLUE }}>御社の業務で毎日</span>起こります。
        </h2>
        <p style={{ fontSize: 13.5, color: MUTED, lineHeight: 2, marginTop: 12 }}>
          読み取ったデータは会計ソフトへ。電話の内容はLINEへ。メールはそのまま送信箱へ。<br />御社の業務に合わせた形は、無料相談でご提案します。
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 30 }}>
          <a href="/contact" style={{ ...hf, fontSize: 15, color: "#fff", background: BLUE, textDecoration: "none", padding: "16px 42px", borderRadius: 100, boxShadow: "0 10px 28px rgba(59,130,214,0.32)" }}>無料相談してみる →</a>
          <a href="/ai-labs" style={{ ...hf, fontSize: 14, color: NAVY, background: "#fff", textDecoration: "none", padding: "16px 34px", borderRadius: 100, border: "1.5px solid #d8e4f0" }}>ストーリーに戻る</a>
        </div>
      </section>

      <style>{`
        @keyframes bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @media (max-width: 700px) {
          section { padding-left: 16px !important; padding-right: 16px !important; }
          .booth-btn { width: 30% !important; min-width: 104px; padding: 12px 6px 10px !important; }
          .booth-btn img { height: 58px !important; }
        }
        @keyframes workBob { 0%,100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-10px) rotate(2deg); } }
        @keyframes twinkle { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes blink { 0%,100% { opacity: 0.2; } 50% { opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes talk { 0%,100% { height: 6px; } 50% { height: 18px; } }
        .chara { cursor: pointer; }
        .chara:hover img { animation: workBob 1.4s ease-in-out !important; }
      `}</style>
    </div>
  );
}
