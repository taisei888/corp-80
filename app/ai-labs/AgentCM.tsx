"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * 30秒ループのイラストCM（4シーン × 7.5秒）B案「え、こんなことまで？」
 * 音声OFF（字幕のみ）が既定。ボタンでシーンごとのナレーションを再生。
 */
const SCENE_MS = 7500;
const SCENES = 4;

const CAPTIONS = [
  "え、電話にも出てくれるの？",
  "え、領収書の山も、全部？",
  "はい。AIエージェントなら、できます。",
  "合同会社80 ── 無料相談、受付中。",
];

export function AgentCM() {
  const [scene, setScene] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [running, setRunning] = useState(false);
  const [voiceOn, setVoiceOn] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setRunning(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setScene((s) => {
        const next = (s + 1) % SCENES;
        if (next === 0) setCycle((c) => c + 1);
        return next;
      });
    }, SCENE_MS);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (!voiceOn) {
      audioRef.current?.pause();
      return;
    }
    const audio = new Audio(`/cm/voice${scene + 1}.mp3`);
    audioRef.current?.pause();
    audioRef.current = audio;
    audio.play().catch(() => {});
    return () => audio.pause();
  }, [voiceOn, scene, cycle]);

  const toggleVoice = useCallback(() => {
    setVoiceOn((v) => {
      const next = !v;
      if (next) {
        setScene(0);
        setCycle((c) => c + 1);
      }
      return next;
    });
  }, []);

  const key = `${scene}-${cycle}`;

  return (
    <div ref={rootRef} style={{ position: "relative", borderRadius: 24, overflow: "hidden", border: "1.5px solid #e2e8f0", background: "linear-gradient(180deg, #eef2ff 0%, #fff 70%)", boxShadow: "0 20px 60px rgba(99,102,241,0.10)" }}>
      <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9" }}>
        {scene === 0 && <Scene1 key={key} />}
        {scene === 1 && <Scene2 key={key} />}
        {scene === 2 && <Scene3 key={key} />}
        {scene === 3 && <Scene4 key={key} />}
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "14px 20px 16px", background: "linear-gradient(transparent, rgba(15,23,42,0.55))", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
        <div key={`cap-${key}`} className="cm-caption" style={{ fontSize: "clamp(13px, 2.2vw, 18px)", fontWeight: 800, color: "#fff", textShadow: "0 2px 12px rgba(15,23,42,0.5)", lineHeight: 1.5 }}>
          {CAPTIONS[scene]}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 5 }}>
            {Array.from({ length: SCENES }).map((_, i) => (
              <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: i === scene ? "#fff" : "rgba(255,255,255,0.4)", transition: "background 0.3s" }} />
            ))}
          </div>
          <button
            onClick={toggleVoice}
            aria-label={voiceOn ? "音声を止める" : "音声で聞く"}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: voiceOn ? "#0f172a" : "#fff", background: voiceOn ? "#fff" : "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.5)", padding: "6px 12px", borderRadius: 100, cursor: "pointer", backdropFilter: "blur(4px)" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              {voiceOn
                ? <path d="M6 6h4v12H6zM14 6h4v12h-4z" />
                : <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />}
            </svg>
            {voiceOn ? "音声を止める" : "音声で聞く"}
          </button>
        </div>
      </div>

      <style>{`
        .cm-caption { animation: cmFadeUp 0.6s ease both; }
        @keyframes cmFadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes cmDrop { from { opacity: 0; transform: translateY(-40px); } 60% { transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes cmSlideIn { from { opacity: 0; transform: translateX(120px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes cmPop { from { opacity: 0; transform: scale(0.3); } 70% { transform: scale(1.12); } to { opacity: 1; transform: scale(1); } }
        @keyframes cmWave { 0%, 100% { transform: rotate(0deg); } 30% { transform: rotate(-18deg); } 60% { transform: rotate(8deg); } }
        @keyframes cmFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
        @keyframes cmShake { 0%, 100% { transform: rotate(0); } 25% { transform: rotate(2.5deg); } 75% { transform: rotate(-2.5deg); } }
        @keyframes cmRing { 0%, 100% { transform: rotate(0); } 10% { transform: rotate(-14deg); } 20% { transform: rotate(12deg); } 30% { transform: rotate(-8deg); } 40% { transform: rotate(0); } }
        @keyframes cmCheck { from { opacity: 0; transform: scale(0.2) rotate(-20deg); } to { opacity: 1; transform: scale(1) rotate(0); } }
        @keyframes cmFly { from { opacity: 1; transform: translate(0, 0) scale(1); } to { opacity: 0; transform: translate(150px, -80px) scale(0.3); } }
        @keyframes cmBow { 0%, 100% { transform: rotate(0); } 40%, 60% { transform: rotate(9deg); } }
        @keyframes cmConfetti { from { opacity: 1; transform: translateY(-10px) rotate(0); } to { opacity: 0; transform: translateY(90px) rotate(200deg); } }
        @keyframes cmBlink { 0%, 90%, 100% { transform: scaleY(1); } 95% { transform: scaleY(0.1); } }
        @keyframes cmScan { 0% { transform: translateY(0); opacity: 0.8; } 50% { transform: translateY(56px); opacity: 0.8; } 100% { transform: translateY(0); opacity: 0.8; } }
        @keyframes cmRow { from { opacity: 0; transform: translateX(-14px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes cmPulse { 0%, 100% { opacity: 0; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.15); } }
      `}</style>
    </div>
  );
}

/* ====== 共通パーツ ====== */

function Robot({ x = 0, y = 0, scale = 1, wave = false, phone = false }: { x?: number; y?: number; scale?: number; wave?: boolean; phone?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g style={{ animation: "cmFloat 2.6s ease-in-out infinite" }}>
        <line x1="0" y1="-86" x2="0" y2="-104" stroke="#6366f1" strokeWidth="5" strokeLinecap="round" />
        <circle cx="0" cy="-110" r="7" fill="#f59e0b" />
        <rect x="-46" y="-86" width="92" height="66" rx="20" fill="#6366f1" />
        <rect x="-34" y="-72" width="68" height="40" rx="14" fill="#eef2ff" />
        <g style={{ animation: "cmBlink 3.4s ease-in-out infinite", transformOrigin: "0px -52px" }}>
          <circle cx="-14" cy="-52" r="6" fill="#0f172a" />
          <circle cx="14" cy="-52" r="6" fill="#0f172a" />
        </g>
        <rect x="-38" y="-14" width="76" height="58" rx="18" fill="#818cf8" />
        <circle cx="0" cy="14" r="10" fill="#eef2ff" />
        <g style={wave ? { animation: "cmWave 1.4s ease-in-out infinite", transformOrigin: "-38px -2px" } : undefined}>
          <rect x="-62" y="-10" width="24" height="12" rx="6" fill="#6366f1" transform={wave ? "rotate(-40 -38 -2)" : ""} />
        </g>
        {phone ? (
          <g transform="translate(52 -52)">
            <rect x="-8" y="-16" width="16" height="32" rx="5" fill="#0f172a" />
            <rect x="-5" y="-12" width="10" height="20" rx="2" fill="#38bdf8" />
          </g>
        ) : (
          <rect x="38" y="-10" width="24" height="12" rx="6" fill="#6366f1" />
        )}
        {phone && <rect x="38" y="-10" width="20" height="12" rx="6" fill="#6366f1" transform="rotate(-50 44 -4)" />}
      </g>
      <ellipse cx="0" cy="58" rx="42" ry="7" fill="#0f172a" opacity="0.08" />
    </g>
  );
}

function Person({ x = 0, y = 0, surprised = false }: { x?: number; y?: number; surprised?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle cx="0" cy="-58" r="24" fill="#fde2c8" />
      <path d="M -24 -62 A 24 24 0 0 1 24 -62 L 24 -72 A 26 20 0 0 0 -24 -72 Z" fill="#334155" />
      <rect x="-30" y="-34" width="60" height="52" rx="16" fill="#0ea5e9" />
      {surprised ? (
        <>
          <circle cx="-8" cy="-58" r="4.5" fill="none" stroke="#0f172a" strokeWidth="2" />
          <circle cx="8" cy="-58" r="4.5" fill="none" stroke="#0f172a" strokeWidth="2" />
          <ellipse cx="0" cy="-44" rx="5" ry="7" fill="#0f172a" />
        </>
      ) : (
        <>
          <circle cx="-8" cy="-56" r="3" fill="#0f172a" />
          <circle cx="8" cy="-56" r="3" fill="#0f172a" />
          <path d="M -7 -44 Q 0 -48 7 -44" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      )}
    </g>
  );
}

/* ====== シーン1：え、電話にも出てくれるの？ ====== */
function Scene1() {
  return (
    <svg viewBox="0 0 800 450" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <rect width="800" height="450" fill="#f8fafc" />
      <circle cx="680" cy="90" r="140" fill="#eef2ff" />
      <circle cx="90" cy="380" r="110" fill="#eef2ff" />
      {/* 鳴っている電話（左上） */}
      <g style={{ animation: "cmRing 1.6s ease-in-out infinite", transformOrigin: "170px 150px" }}>
        <g transform="translate(170 150)">
          <rect x="-30" y="-20" width="60" height="40" rx="10" fill="#0f172a" />
          <rect x="-20" y="-32" width="40" height="14" rx="7" fill="#0f172a" />
          <circle cx="0" cy="0" r="7" fill="#38bdf8" />
        </g>
      </g>
      {/* 着信波紋 */}
      {[0, 0.5, 1].map((d, i) => (
        <circle key={i} cx="170" cy="120" r={18 + i * 12} fill="none" stroke="#6366f1" strokeWidth="3" style={{ animation: `cmPulse 1.6s ease-out ${d}s infinite` }} />
      ))}
      {/* 驚く人 */}
      <g style={{ animation: "cmPop 0.6s ease 0.3s both" }}>
        <Person x={300} y={330} surprised />
      </g>
      <g style={{ animation: "cmPop 0.5s ease 0.9s both" }}>
        <g transform="translate(300 200)">
          <rect x="-46" y="-26" width="92" height="44" rx="22" fill="#fff" stroke="#e2e8f0" strokeWidth="2" />
          <text x="0" y="7" textAnchor="middle" fontSize="24" fontWeight="900" fill="#f59e0b">え！？</text>
        </g>
      </g>
      {/* 電話対応するロボット */}
      <g style={{ animation: "cmSlideIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both" }}>
        <Robot x={560} y={310} scale={1.2} phone />
      </g>
      {/* ロボットの応対吹き出し */}
      <g style={{ animation: "cmPop 0.55s ease 1.5s both" }}>
        <g transform="translate(560 150)">
          <rect x="-140" y="-34" width="280" height="56" rx="28" fill="#6366f1" />
          <path d="M -16 22 L 0 44 L 10 22 Z" fill="#6366f1" />
          <text x="0" y="-6" textAnchor="middle" fontSize="17" fontWeight="800" fill="#fff">お電話ありがとうございます</text>
          <text x="0" y="14" textAnchor="middle" fontSize="12" fontWeight="600" fill="#c7d2fe">ご予約ですね、承ります</text>
        </g>
      </g>
      {/* カレンダー登録演出 */}
      <g style={{ animation: "cmCheck 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 2.6s both" }}>
        <g transform="translate(700 260)">
          <rect x="-30" y="-30" width="60" height="56" rx="8" fill="#fff" stroke="#e2e8f0" strokeWidth="2" />
          <rect x="-30" y="-30" width="60" height="16" rx="8" fill="#6366f1" />
          <circle cx="0" cy="4" r="13" fill="#10b981" />
          <path d="M -5 4 L -1 9 L 6 -1" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  );
}

/* ====== シーン2：え、領収書の山も全部？ ====== */
function Scene2() {
  return (
    <svg viewBox="0 0 800 450" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <rect width="800" height="450" fill="#f8fafc" />
      <circle cx="110" cy="90" r="130" fill="#eef2ff" />
      {/* 領収書の山（左） */}
      <g>
        {[
          [150, 340, -8], [190, 345, 5], [130, 320, 10], [175, 318, -5], [155, 296, 3],
          [195, 300, -10], [145, 275, -3], [180, 272, 8], [163, 250, -6],
        ].map(([x, y, r], i) => (
          <g key={i} style={{ animation: `cmDrop 0.45s ease ${0.15 + i * 0.12}s both` }}>
            <g transform={`translate(${x} ${y}) rotate(${r})`}>
              <rect x="-26" y="-16" width="52" height="32" rx="3" fill="#fff" stroke="#cbd5e1" strokeWidth="1.5" />
              <line x1="-16" y1="-6" x2="16" y2="-6" stroke="#cbd5e1" strokeWidth="2" />
              <line x1="-16" y1="2" x2="8" y2="2" stroke="#cbd5e1" strokeWidth="2" />
              <text x="10" y="11" fontSize="10" fontWeight="800" fill="#f59e0b">¥</text>
            </g>
          </g>
        ))}
        <text x="165" y="390" textAnchor="middle" fontSize="13" fontWeight="700" fill="#94a3b8">たまった領収書</text>
      </g>
      {/* 飛んでいく領収書 */}
      {[1.4, 2.0, 2.6].map((d, i) => (
        <g key={i} style={{ animation: `cmFly 1.0s ease-in ${d}s both` }}>
          <rect x={220} y={280 - i * 20} width="40" height="26" rx="3" fill="#fff" stroke="#cbd5e1" strokeWidth="1.5" />
        </g>
      ))}
      {/* スキャンするロボット（中央） */}
      <Robot x={420} y={300} scale={1.1} />
      <g style={{ animation: "cmPop 0.4s ease 0.8s both" }}>
        <rect x="374" y="330" width="92" height="10" rx="5" fill="#818cf8" />
        <rect x="376" y="278" width="88" height="56" rx="4" fill="#c7d2fe" opacity="0.35" />
        <rect x="376" y="278" width="88" height="4" rx="2" fill="#38bdf8" style={{ animation: "cmScan 1.8s ease-in-out 1s infinite" }} />
      </g>
      {/* データ化された表（右） */}
      <g style={{ animation: "cmPop 0.55s ease 1.2s both" }}>
        <g transform="translate(640 250)">
          <rect x="-85" y="-95" width="170" height="190" rx="14" fill="#fff" stroke="#e2e8f0" strokeWidth="2" />
          <rect x="-85" y="-95" width="170" height="34" rx="14" fill="#6366f1" />
          <text x="0" y="-73" textAnchor="middle" fontSize="14" fontWeight="800" fill="#fff">経費データ</text>
          {[0, 1, 2, 3].map((i) => (
            <g key={i} style={{ animation: `cmRow 0.4s ease ${1.8 + i * 0.45}s both` }}>
              <rect x="-70" y={-48 + i * 32} width="105" height="20" rx="5" fill="#f1f5f9" />
              <circle cx="55" cy={-38 + i * 32} r="9" fill="#10b981" />
              <path d={`M 51 ${-38 + i * 32} l 3 4 l 6 -7`} stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
}

/* ====== シーン3：はい。AIエージェントなら、できます。 ====== */
function Scene3() {
  const badges: [number, number, string, number][] = [
    [180, 160, "メール対応", 1.0],
    [160, 300, "経理・請求", 1.4],
    [640, 160, "電話応対", 1.8],
    [660, 300, "データ入力", 2.2],
  ];
  return (
    <svg viewBox="0 0 800 450" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <rect width="800" height="450" fill="#f8fafc" />
      <circle cx="400" cy="230" r="180" fill="#eef2ff" />
      {/* 主役ロボット（ドーン） */}
      <g style={{ animation: "cmPop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both" }}>
        <Robot x={400} y={300} scale={1.5} wave />
      </g>
      {/* できます！吹き出し */}
      <g style={{ animation: "cmPop 0.5s ease 0.7s both" }}>
        <g transform="translate(400 105)">
          <rect x="-105" y="-34" width="210" height="58" rx="29" fill="#f59e0b" />
          <path d="M -14 24 L 0 46 L 10 24 Z" fill="#f59e0b" />
          <text x="0" y="8" textAnchor="middle" fontSize="26" fontWeight="900" fill="#fff">できます！</text>
        </g>
      </g>
      {/* 業務バッジ4つ */}
      {badges.map(([x, y, label, d]) => (
        <g key={label as string} style={{ animation: `cmCheck 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${d}s both` }}>
          <g transform={`translate(${x} ${y})`}>
            <rect x="-64" y="-22" width="128" height="44" rx="22" fill="#fff" stroke="#e2e8f0" strokeWidth="2" />
            <circle cx="-40" cy="0" r="11" fill="#10b981" />
            <path d="M -45 0 L -41 5 L -34 -4" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <text x="10" y="5" textAnchor="middle" fontSize="14" fontWeight="800" fill="#0f172a">{label}</text>
          </g>
        </g>
      ))}
    </svg>
  );
}

/* ====== シーン4：CTA ====== */
function Scene4() {
  return (
    <svg viewBox="0 0 800 450" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <rect width="800" height="450" fill="#6366f1" />
      <circle cx="90" cy="70" r="130" fill="#818cf8" opacity="0.5" />
      <circle cx="730" cy="400" r="150" fill="#818cf8" opacity="0.5" />
      {[
        [120, "#fbbf24", 0.3], [220, "#fff", 0.7], [320, "#5eead4", 0.5], [480, "#fbbf24", 0.9],
        [580, "#fff", 0.4], [680, "#5eead4", 0.8],
      ].map(([x, c, d], i) => (
        <rect key={i} x={x as number} y={40} width="10" height="14" rx="2" fill={c as string} style={{ animation: `cmConfetti 2.4s ease-in ${d}s infinite` }} />
      ))}
      <g style={{ animation: "cmBow 2.8s ease-in-out infinite", transformOrigin: "560px 330px" }}>
        <Robot x={560} y={300} scale={1.1} />
      </g>
      <g style={{ animation: "cmPop 0.7s ease 0.3s both" }}>
        <text x="300" y="185" textAnchor="middle" fontSize="32" fontWeight="900" fill="#fff">御社の業務も、診断します。</text>
        <text x="300" y="225" textAnchor="middle" fontSize="15" fontWeight="600" fill="#c7d2fe">無料相談で「自動化できる業務リスト」をお渡し</text>
      </g>
      <g style={{ animation: "cmPop 0.6s ease 1.0s both" }}>
        <g transform="translate(300 290)">
          <rect x="-110" y="-26" width="220" height="52" rx="26" fill="#fff" />
          <text x="-12" y="7" textAnchor="middle" fontSize="17" fontWeight="800" fill="#6366f1">無料相談はこちら</text>
          <path d="M 74 -6 l 8 6 l -8 6" stroke="#6366f1" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
      <text x="300" y="360" textAnchor="middle" fontSize="12" fontWeight="700" fill="#c7d2fe" letterSpacing="2">合同会社80 ─ AI LABS</text>
    </svg>
  );
}
