"use client";

import { useEffect, useRef, useState } from "react";

// ─── Dot Grid Canvas ──────────────────────────────────────────────────────────
function DotCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const GAP = 36;
    const mouse = { x: -9999, y: -9999 };
    let W = 0, H = 0, raf = 0, t = 0;

    // dots[row][col] = { bx, by, phase }
    type Dot = { bx: number; by: number; phase: number; r: number };
    let dots: Dot[] = [];

    const init = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      const cols = Math.ceil(W / GAP) + 1;
      const rows = Math.ceil(H / GAP) + 1;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          dots.push({ bx: col * GAP, by: row * GAP, phase: Math.random() * Math.PI * 2, r: 1.5 });
        }
      }
    };

    init();
    const onResize = () => init();
    const onMouse = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      // only react when cursor is over the section
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
      } else {
        mouse.x = -9999; mouse.y = -9999;
      }
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouse);

    const render = () => {
      t += 0.012;
      ctx.clearRect(0, 0, W, H);

      for (const d of dots) {
        // gentle float offset
        const ox = Math.sin(t + d.phase) * 1.2;
        const oy = Math.cos(t * 0.8 + d.phase) * 1.2;
        const x = d.bx + ox;
        const y = d.by + oy;

        // cursor proximity
        const dist = Math.hypot(mouse.x - x, mouse.y - y);
        const HOVER_R = 72;
        const proximity = dist < HOVER_R ? 1 - dist / HOVER_R : 0;

        const radius = 1.5 + proximity * 3.5;
        const alpha = 0.25 + proximity * 0.7;

        if (proximity > 0) {
          ctx.shadowBlur = 8 * proximity;
          ctx.shadowColor = `rgba(99,102,241,${proximity * 0.8})`;
        }
        ctx.globalAlpha = alpha;
        ctx.fillStyle = proximity > 0.3 ? "#6366f1" : "rgba(99,102,241,0.9)";
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

// ─── Particle Text Canvas ─────────────────────────────────────────────────────
function ParticleTextCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    interface P { x:number; y:number; tx:number; ty:number; vx:number; vy:number; sz:number; col:string; }
    let W = 0, H = 0, pts: P[] = [], raf = 0;
    const mouse = { x: -9999, y: -9999 };
    const COLS = ["#1e293b","#1e293b","#3730a3","#4f46e5","#1e293b","#1e293b","#312e81"];

    const build = (): P[] => {
      const off = document.createElement("canvas");
      off.width = W; off.height = H;
      const oc = off.getContext("2d")!;

      // auto-size to fill viewport
      const L1 = "Build what's", L2 = "NEXT.";
      let fs = 10;
      oc.font = `900 ${fs}px -apple-system, BlinkMacSystemFont, sans-serif`;
      while (oc.measureText(L1).width < W * 0.80) {
        fs += 2;
        oc.font = `900 ${fs}px -apple-system, BlinkMacSystemFont, sans-serif`;
      }
      const lh = fs * 1.08;
      const cy = H * 0.40;
      oc.fillStyle = "#000";
      oc.textAlign = "center";
      oc.textBaseline = "alphabetic";
      oc.fillText(L1, W / 2, cy);
      oc.fillText(L2, W / 2, cy + lh);

      const data = oc.getImageData(0, 0, W, H).data;
      const gap = 4, out: P[] = [];
      for (let y = 0; y < H; y += gap) {
        for (let x = 0; x < W; x += gap) {
          if (data[(y * W + x) * 4 + 3] > 128) {
            out.push({
              tx: x, ty: y,
              x: Math.random() * W,
              y: Math.random() * H,
              vx: 0, vy: 0,
              sz: 1.3 + Math.random() * 1.3,
              col: COLS[Math.floor(Math.random() * COLS.length)],
            });
          }
        }
      }
      return out;
    };

    const init = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = build();
    };

    init();
    const onResize = () => init();
    const onMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    const REPEL = 150;
    const render = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < REPEL * REPEL) {
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / REPEL) * 16;
          p.vx -= (dx / d) * f;
          p.vy -= (dy / d) * f;
        }
        // spring back to target
        p.vx += (p.tx - p.x) * 0.052;
        p.vy += (p.ty - p.y) * 0.052;
        // damping
        p.vx *= 0.84; p.vy *= 0.84;
        p.x += p.vx; p.y += p.vy;

        ctx.fillStyle = p.col;
        ctx.globalAlpha = 0.80;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} style={{ position: "fixed", inset: 0, zIndex: 0, display: "block", background: "#f8fafc" }} />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [inHero, setInHero] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [newsItems, setNewsItems] = useState<Array<{title:string;source:string;link:string;pubDate:string}>>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const [aiStatus, setAiStatus] = useState("> ニュースソースに接続中...");
  const [translating, setTranslating] = useState(false);
  const [translated, setTranslated] = useState("");
  const [summarizing, setSummarizing] = useState(false);
  const [aiSummary, setAiSummary] = useState("");

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const onScroll = () => {
      setNavScrolled(window.scrollY > 40);
      setInHero(window.scrollY < window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(
      (e) => e.forEach((en) => { if (en.isIntersecting) en.target.classList.add("visible"); }),
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    document.querySelectorAll(".sr").forEach((el) => io.observe(el));
    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  // Fetch real news
  useEffect(() => {
    setNewsLoading(true);
    fetch("/api/news")
      .then(r => r.json())
      .then(d => setNewsItems(d.items || []))
      .catch(() => setNewsItems([]))
      .finally(() => setNewsLoading(false));
  }, []);

  // AI status messages during loading
  useEffect(() => {
    if (!newsLoading) {
      setAiStatus(newsItems.length > 0 ? `> 完了。${newsItems.length}件のニュースを取得しました。` : "> ニュースを取得できませんでした。");
      return;
    }
    const msgs = ["> ニュースソースに接続中...", "> ヘッドラインを抽出中...", "> AIが分析中..."];
    let idx = 0;
    setAiStatus(msgs[0]);
    const timer = setInterval(() => { idx = (idx + 1) % msgs.length; setAiStatus(msgs[idx]); }, 1200);
    return () => clearInterval(timer);
  }, [newsLoading, newsItems.length]);

  // Typewriter effect for current headline
  useEffect(() => {
    if (newsItems.length === 0 || newsLoading) return;
    const headline = newsItems[activeIndex]?.title || "";
    setTypedText("");
    setTypingDone(false);
    setTranslated("");
    setAiSummary("");
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setTypedText(headline.slice(0, i));
      if (i >= headline.length) { clearInterval(timer); setTypingDone(true); }
    }, 28);
    return () => clearInterval(timer);
  }, [activeIndex, newsItems, newsLoading]);

  // Auto-advance to next headline (pause when AI result is showing)
  useEffect(() => {
    if (!typingDone || newsItems.length <= 1 || aiSummary || translated || summarizing || translating) return;
    const timer = setTimeout(() => {
      setActiveIndex(prev => (prev + 1) % newsItems.length);
    }, 6000);
    return () => clearTimeout(timer);
  }, [typingDone, newsItems.length, activeIndex, aiSummary, translated, summarizing, translating]);

  const handleTranslate = async () => {
    if (translating || newsItems.length === 0) return;
    setTranslating(true);
    setTranslated("");
    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: "Translate the following Japanese news headline to natural English. Return only the translation, nothing else.",
          message: newsItems[activeIndex].title,
        }),
      });
      const data = await res.json();
      setTranslated(data.reply || "Translation failed.");
    } catch {
      setTranslated("Translation failed.");
    } finally {
      setTranslating(false);
    }
  };

  const handleSummary = async () => {
    if (summarizing || newsItems.length === 0) return;
    setSummarizing(true);
    setAiSummary("");
    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: "あなたはニュースアナリストです。以下のニュース見出しについて、背景や意味を3行程度で簡潔に解説してください。日本語で回答してください。",
          message: newsItems[activeIndex].title,
        }),
      });
      const data = await res.json();
      setAiSummary(data.reply || "解説を生成できませんでした。");
    } catch {
      setAiSummary("解説を生成できませんでした。");
    } finally {
      setSummarizing(false);
    }
  };

  const handleDownload = () => {
    if (newsItems.length === 0) return;
    const today = new Date();
    const fname = `news_${today.getFullYear()}${String(today.getMonth()+1).padStart(2,"0")}${String(today.getDate()).padStart(2,"0")}.txt`;
    const lines = newsItems.map((n, i) => `${i+1}. ${n.title}\n   ${n.source} | ${n.link}`).join("\n\n");
    const blob = new Blob([lines], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = fname; a.click();
    URL.revokeObjectURL(url);
  };

  const timeAgo = (pubDate: string) => {
    if (!pubDate) return "";
    const diff = Date.now() - new Date(pubDate).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}分前`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}時間前`;
    return `${Math.floor(hrs / 24)}日前`;
  };

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      {!isMobile && <ParticleTextCanvas />}
      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ── Nav ── */}
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          height: navScrolled ? 60 : 70,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: isMobile ? "0 20px" : "0 48px",
          background: isMobile
            ? (navScrolled ? "rgba(248,250,252,0.95)" : "transparent")
            : navScrolled ? "rgba(248,250,252,0.88)" : "transparent",
          backdropFilter: navScrolled ? "blur(20px)" : "none",
          borderBottom: navScrolled ? "1px solid rgba(0,0,0,0.07)" : "none",
          transition: "all 0.3s ease",
        }}>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <img src={(isMobile && inHero) ? "/8.png" : "/7.png"} alt="80" style={{ height: 40, display: "block", transition: "opacity 0.3s" }} />
          </button>
          <div className="mob-hide" style={{ display: "flex", gap: 36 }}>
            {([["ビジョン","vision"],["事業内容","business"],["プロダクト","product"]] as const).map(([l, id]) => (
              <button key={id} onClick={() => scrollTo(id)}
                style={{ background: "none", border: "none", cursor: "pointer",
                  fontSize: 14, fontWeight: 500, color: "#475569", transition: "color 0.2s", fontFamily: "inherit" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#0f172a")}
                onMouseLeave={e => (e.currentTarget.style.color = "#475569")}>
                {l}
              </button>
            ))}
          </div>
          <a href="/contact"
            style={{ padding: "8px 18px", borderRadius: 6,
              border: (isMobile && inHero) ? "1.5px solid rgba(255,255,255,0.3)" : "1.5px solid #0f172a",
              background: "transparent",
              color: (isMobile && inHero) ? "#f8fafc" : "#0f172a",
              fontSize: 12, fontWeight: 600,
              cursor: "pointer", transition: "all 0.3s", fontFamily: "inherit", textDecoration: "none" }}
            onMouseEnter={e => { e.currentTarget.style.background = (isMobile && inHero) ? "rgba(255,255,255,0.1)" : "#0f172a"; e.currentTarget.style.color="#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color = (isMobile && inHero) ? "#f8fafc" : "#0f172a"; }}>
            お問い合わせ
          </a>
        </nav>

        {/* ── News Hero ── */}
        <section style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center",
          padding: isMobile ? "100px 20px 60px" : "120px 48px 80px",
          background: "#fff", position: "relative", overflow: "hidden",
        }}>
          {/* Background grid */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <div style={{ position: "absolute", inset: 0, opacity: 0.035,
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 59px, #94a3b8 59px, #94a3b8 60px), repeating-linear-gradient(90deg, transparent, transparent 59px, #94a3b8 59px, #94a3b8 60px)",
            }} />
            <div style={{ position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at center, transparent 20%, rgba(255,255,255,0.92) 65%)",
            }} />
          </div>

          <div style={{ maxWidth: 800, width: "100%", position: "relative" }}>

            {/* AI Status terminal line */}
            <div style={{
              fontFamily: "'SF Mono', 'Fira Code', Menlo, monospace",
              fontSize: 11, color: newsLoading ? "#6366f1" : "#22c55e",
              marginBottom: 20, textAlign: "center",
              transition: "color 0.3s",
            }}>
              {aiStatus}
              {newsLoading && (
                <span style={{ display: "inline-block", width: 6, height: 12, background: "#6366f1", marginLeft: 4, verticalAlign: "text-bottom", animation: "cursor-blink 1s step-end infinite" }} />
              )}
            </div>

            {/* Title */}
            <div style={{ textAlign: "center", marginBottom: isMobile ? 28 : 36 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "6px 16px", borderRadius: 100,
                border: "1px solid #e2e8f0",
                fontSize: 11, fontWeight: 600, color: "#64748b",
                letterSpacing: "0.08em", marginBottom: 24,
                fontFamily: "'SF Mono', 'Fira Code', Menlo, monospace",
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%", background: "#22c55e",
                  boxShadow: "0 0 6px rgba(34,197,94,0.4)",
                  animation: "pulse-dot 2s ease-in-out infinite",
                }} />
                {(() => { const d = new Date(); return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")}`; })()}
              </div>
              <h1 style={{
                fontSize: isMobile ? "clamp(36px, 10vw, 52px)" : "clamp(48px, 5vw, 64px)",
                fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em",
                color: "#0f172a", marginBottom: 10,
              }}>
                Today&apos;s <span style={{ color: "#6366f1" }}>News</span>
              </h1>
              <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                AI &amp; Technology — 合同会社80
              </p>
            </div>

            {/* ── Terminal Card ── */}
            <div style={{
              borderRadius: 16, overflow: "hidden",
              background: "#0f172a",
              boxShadow: "0 8px 40px rgba(15,23,42,0.25), 0 0 0 1px rgba(99,102,241,0.1)",
              marginBottom: 20,
            }}>
              {/* Terminal header */}
              <div style={{
                padding: "12px 20px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "#1e293b",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" }} />
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e" }} />
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 500, color: "rgba(148,163,184,0.6)",
                    fontFamily: "'SF Mono', 'Fira Code', Menlo, monospace", marginLeft: 6,
                  }}>
                    news.ai — headlines
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {!newsLoading && newsItems.length > 0 && (
                    <span style={{
                      fontSize: 10, fontWeight: 800, color: "#6366f1",
                      fontFamily: "'SF Mono', 'Fira Code', Menlo, monospace",
                      letterSpacing: "0.1em",
                    }}>
                      {String(activeIndex + 1).padStart(2, "0")}/{String(newsItems.length).padStart(2, "0")}
                    </span>
                  )}
                  <span style={{
                    fontSize: 9, fontWeight: 700, color: "#22c55e",
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    padding: "3px 10px", borderRadius: 100,
                    background: "rgba(34,197,94,0.1)",
                    border: "1px solid rgba(34,197,94,0.2)",
                    display: "flex", alignItems: "center", gap: 5,
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", animation: "pulse-dot 2s ease-in-out infinite" }} />
                    LIVE
                  </span>
                </div>
              </div>

              {/* Terminal body */}
              <div style={{ padding: isMobile ? "28px 20px 32px" : "36px 36px 40px" }}>
                {newsLoading ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
                    {[85, 65, 45].map((w, i) => (
                      <div key={i} style={{
                        height: 16, borderRadius: 4,
                        background: "linear-gradient(90deg, rgba(99,102,241,0.1) 25%, rgba(99,102,241,0.2) 50%, rgba(99,102,241,0.1) 75%)",
                        backgroundSize: "200% 100%",
                        animation: "shimmer 1.8s ease-in-out infinite",
                        animationDelay: `${i * 0.15}s`,
                        width: `${w}%`,
                      }} />
                    ))}
                  </div>
                ) : newsItems.length === 0 ? (
                  <div style={{ color: "#64748b", fontSize: 14, textAlign: "center", padding: "20px 0" }}>
                    ニュースを取得できませんでした
                  </div>
                ) : (
                  <>
                    {/* Headline */}
                    <h2 style={{
                      fontSize: isMobile ? "clamp(20px, 5.5vw, 28px)" : "clamp(26px, 2.8vw, 34px)",
                      fontWeight: 700, lineHeight: 1.65, letterSpacing: "-0.01em",
                      color: "#f1f5f9", marginBottom: 20,
                      minHeight: isMobile ? 90 : 110,
                    }}>
                      {typedText}
                      {!typingDone && (
                        <span style={{
                          display: "inline-block", width: 3, height: "0.85em",
                          background: "#6366f1", marginLeft: 3, verticalAlign: "text-bottom",
                          animation: "cursor-blink 1s step-end infinite",
                        }} />
                      )}
                    </h2>

                    {/* Source + time + link */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      {newsItems[activeIndex]?.source && (
                        <span style={{
                          fontSize: 11, fontWeight: 600, color: "#a5b4fc",
                          padding: "3px 10px", borderRadius: 100,
                          background: "rgba(99,102,241,0.15)",
                          border: "1px solid rgba(99,102,241,0.2)",
                        }}>
                          {newsItems[activeIndex].source}
                        </span>
                      )}
                      {newsItems[activeIndex]?.pubDate && (
                        <span style={{ fontSize: 11, color: "#64748b", fontFamily: "'SF Mono', 'Fira Code', Menlo, monospace" }}>
                          {timeAgo(newsItems[activeIndex].pubDate)}
                        </span>
                      )}
                      <a href={newsItems[activeIndex]?.link} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: 11, color: "#6366f1", textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: 3, marginLeft: "auto" }}>
                        記事を読む
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M7 17L17 7M17 7H7M17 7v10"/>
                        </svg>
                      </a>
                    </div>
                  </>
                )}
              </div>

              {/* Dot indicators inside terminal */}
              {!newsLoading && newsItems.length > 0 && (
                <div style={{
                  padding: "0 36px 20px",
                  display: "flex", gap: 6, justifyContent: "center",
                }}>
                  {newsItems.map((_, i) => (
                    <button key={i} onClick={() => setActiveIndex(i)}
                      style={{
                        width: activeIndex === i ? 24 : 8, height: 6,
                        borderRadius: 100, border: "none", cursor: "pointer",
                        background: activeIndex === i ? "#6366f1" : "rgba(255,255,255,0.1)",
                        transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                        padding: 0,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* AI result panels */}
            {translated && (
              <div style={{
                border: "1px solid #c7d2fe", borderRadius: 12,
                padding: isMobile ? "16px 16px" : "20px 24px",
                marginBottom: 12,
                background: "linear-gradient(180deg, #fafbff, #f5f3ff)",
                animation: "fade-up 0.4s ease both",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#6366f1" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
                  </svg>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#6366f1", letterSpacing: "0.12em" }}>ENGLISH TRANSLATION</span>
                </div>
                <div style={{ fontSize: isMobile ? 14 : 15, color: "#334155", lineHeight: 1.8 }}>{translated}</div>
              </div>
            )}

            {aiSummary && (
              <div style={{
                border: "1px solid #bbf7d0", borderRadius: 12,
                padding: isMobile ? "16px 16px" : "20px 24px",
                marginBottom: 12,
                background: "linear-gradient(180deg, #f0fdf4, #ecfdf5)",
                animation: "fade-up 0.4s ease both",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#16a34a" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#16a34a", letterSpacing: "0.12em" }}>AI ANALYSIS</span>
                </div>
                <div style={{ fontSize: isMobile ? 13 : 14, color: "#334155", lineHeight: 1.9, whiteSpace: "pre-wrap" }}>{aiSummary}</div>
              </div>
            )}

            {/* Action buttons */}
            {!newsLoading && newsItems.length > 0 && typingDone && (
              <div style={{
                display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap",
                animation: "fade-up 0.5s ease both",
              }}>
                {/* AI Analysis */}
                <button onClick={handleSummary} disabled={summarizing} style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "11px 20px", borderRadius: 10,
                  border: "1.5px solid #6366f1", background: "#6366f1", color: "#fff",
                  fontSize: 12, fontWeight: 700,
                  cursor: summarizing ? "wait" : "pointer", transition: "all 0.25s", fontFamily: "inherit",
                  opacity: summarizing ? 0.7 : 1,
                }}
                  onMouseEnter={e => { if(!summarizing){ e.currentTarget.style.background="#4f46e5"; e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 6px 20px rgba(99,102,241,0.3)"; } }}
                  onMouseLeave={e => { e.currentTarget.style.background="#6366f1"; e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="none"; }}
                >
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  {summarizing ? "分析中..." : aiSummary ? "再分析" : "AI解説"}
                </button>

                {/* Translate */}
                <button onClick={handleTranslate} disabled={translating} style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "11px 20px", borderRadius: 10, border: "1.5px solid #e2e8f0",
                  background: "#fff", color: translating ? "#94a3b8" : "#475569", fontSize: 12, fontWeight: 600,
                  cursor: translating ? "wait" : "pointer", transition: "all 0.25s", fontFamily: "inherit",
                }}
                  onMouseEnter={e => { if(!translating){ e.currentTarget.style.borderColor="#6366f1"; e.currentTarget.style.color="#6366f1"; e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 4px 12px rgba(99,102,241,0.1)"; } }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor="#e2e8f0"; e.currentTarget.style.color=translating?"#94a3b8":"#475569"; e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="none"; }}
                >
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
                  </svg>
                  {translating ? "翻訳中..." : translated ? "翻訳済み" : "英語翻訳"}
                </button>

                {/* Download */}
                <button onClick={handleDownload} style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "11px 20px", borderRadius: 10, border: "1.5px solid #e2e8f0",
                  background: "#fff", color: "#475569", fontSize: 12, fontWeight: 600,
                  cursor: "pointer", transition: "all 0.25s", fontFamily: "inherit",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor="#0f172a"; e.currentTarget.style.color="#0f172a"; e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,0.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor="#e2e8f0"; e.currentTarget.style.color="#475569"; e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="none"; }}
                >
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  全件DL
                </button>
              </div>
            )}
          </div>

        </section>

        {/* ── Hero (Desktop) ── */}
        {!isMobile && (
          <section style={{ minHeight: "100vh", display: "flex", alignItems: "flex-end",
            justifyContent: "center", padding: "0 48px 80px", position: "relative" }}>
            <div style={{ textAlign: "center", maxWidth: 900, width: "100%" }} />
          </section>
        )}

        {/* Fixed right-side scroll indicator */}
        <div style={{
          position: "fixed", right: isMobile ? 12 : 28, top: "50%", transform: "translateY(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 12, zIndex: 50,
          opacity: inHero ? 1 : 0, pointerEvents: "none",
          transition: "opacity 0.4s ease",
        }}>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", color: "#94a3b8",
            textTransform: "uppercase", writingMode: "vertical-rl",
          }}>Scroll</span>
          <div style={{
            width: 1, height: 48, position: "relative", overflow: "hidden",
            background: "rgba(99,102,241,0.15)", borderRadius: 2,
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, width: "100%",
              background: "linear-gradient(to bottom, #6366f1, #a78bfa)",
              borderRadius: 2, animation: "scroll-bar 1.6s cubic-bezier(0.4,0,0.2,1) infinite",
            }} />
          </div>
        </div>

        {/* ── Hero (Mobile) ── */}
        {isMobile && (
          <section style={{
            minHeight: "100vh", display: "flex", flexDirection: "column",
            justifyContent: "flex-end", padding: "0 0 48px",
            background: "#0f172a",
            position: "relative", overflow: "hidden",
          }}>
            {/* animated gradient orbs */}
            <div className="mob-hero-orb1" style={{ position: "absolute", top: "-15%", right: "-20%", width: "70vw", height: "70vw",
              borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)",
              pointerEvents: "none", filter: "blur(40px)" }} />
            <div className="mob-hero-orb2" style={{ position: "absolute", bottom: "10%", left: "-25%", width: "60vw", height: "60vw",
              borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)",
              pointerEvents: "none", filter: "blur(50px)" }} />

            {/* grid pattern overlay */}
            <div style={{ position: "absolute", inset: 0, opacity: 0.04, pointerEvents: "none",
              backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "40px 40px" }} />

            {/* top section with big text */}
            <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "100px 28px 0" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", color: "#6366f1",
                textTransform: "uppercase", marginBottom: 24,
                display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 24, height: 1.5, background: "#6366f1", display: "inline-block" }} />
                LLC 80
              </div>

              <h1 style={{ fontSize: "clamp(56px, 16vw, 80px)", fontWeight: 900,
                letterSpacing: "-0.05em", color: "#f8fafc", lineHeight: 0.95, marginBottom: 32 }}>
                Build<br />
                what&apos;s<br />
                <span style={{
                  background: "linear-gradient(135deg, #6366f1, #a78bfa, #818cf8)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>NEXT.</span>
              </h1>

              <p style={{ fontSize: 14, color: "rgba(248,250,252,0.5)", lineHeight: 1.9, maxWidth: 300 }}>
                テクノロジーで「次」をつくる。<br />
                合同会社80のコーポレートサイト。
              </p>
            </div>

            {/* bottom CTA area */}
            <div style={{ position: "relative", padding: "0 28px" }}>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => scrollTo("business")}
                  style={{ flex: 1, padding: "18px 20px", borderRadius: 12, border: "none",
                    background: "#fff", color: "#0f172a", fontSize: 14, fontWeight: 700,
                    cursor: "pointer", fontFamily: "inherit",
                    display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  事業内容
                  <span style={{ fontSize: 18 }}>→</span>
                </button>
                <a href="/contact"
                  style={{ flex: 1, padding: "18px 20px", borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)",
                    color: "#f8fafc", fontSize: 14, fontWeight: 600,
                    cursor: "pointer", fontFamily: "inherit",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    textDecoration: "none" }}>
                  お問い合わせ
                  <span style={{ color: "#a78bfa", fontSize: 18 }}>→</span>
                </a>
              </div>
            </div>

          </section>
        )}

        {/* ── White overlay sections ── */}
        <div style={{ position: "relative" }}>
          {/* Gradient fade from transparent to white */}
          {!isMobile && (
            <div style={{ height: 160, background: "linear-gradient(to bottom, transparent, #fff)", pointerEvents: "none" }} />
          )}
          {isMobile && (
            <div style={{ height: 80, background: "linear-gradient(to bottom, #0f172a, #fff)", pointerEvents: "none" }} />
          )}

        {/* ── Vision & Mission ── */}
        <section id="vision" className="mob-section" style={{ background: "#fff", padding: "120px 64px 140px" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>

            {/* Mission */}
            <div className="sr" style={{ textAlign: "center", marginBottom: 120 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", color: "#6366f1", textTransform: "uppercase", marginBottom: 32 }}>
                Our Mission
              </div>
              <h2 style={{
                fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 900,
                lineHeight: 1.5, letterSpacing: "-0.03em", color: "#0f172a",
                marginBottom: 32,
              }}>
                人の知覚を、<br />ソフトウェアで拡張する。
              </h2>
              <p style={{ fontSize: 16, color: "#64748b", lineHeight: 2.0, maxWidth: 640, margin: "0 auto", marginBottom: 8 }}>
                私たちは、人が持つ感覚・違和感・気づき・判断を、<br className="mob-hide" />
                ソフトウェアの力でより見える形にし、企業や組織の意思決定を支えます。
              </p>
              <p style={{ fontSize: 16, color: "#64748b", lineHeight: 2.0, maxWidth: 640, margin: "0 auto" }}>
                AIやテクノロジーを人の代わりにするのではなく、<br className="mob-hide" />
                人の可能性を広げるために活用します。
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "48px auto 0", maxWidth: 320 }}>
                <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, #e2e8f0)" }} />
                <div style={{ width: 5, height: 5, transform: "rotate(45deg)", background: "#6366f1" }} />
                <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, #e2e8f0, transparent)" }} />
              </div>
            </div>

            {/* Vision: Editorial split layout */}
            <div className="sr mob-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1.8fr", gap: 80, alignItems: "flex-start", marginBottom: 100 }}>
              {/* Left: label + big English */}
              <div style={{ position: "sticky", top: 120 }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.22em", color: "#6366f1", textTransform: "uppercase", marginBottom: 24 }}>
                  私たちのビジョン
                </div>
                <div style={{ fontSize: "clamp(56px, 7vw, 96px)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.04em", color: "#0f172a" }}>
                  Our<br />Vision
                </div>
              </div>

              {/* Right: Japanese headline + body */}
              <div className="sr" style={{ transitionDelay: "0.1s" }}>
                <h2 style={{ fontSize: "clamp(26px, 3.2vw, 44px)", fontWeight: 800, lineHeight: 1.45, letterSpacing: "-0.02em", color: "#0f172a", marginBottom: 40 }}>
                  人間らしさとテクノロジーが、<br />共存する社会へ。
                </h2>
                <p style={{ fontSize: 16, color: "#475569", lineHeight: 2.0, marginBottom: 28 }}>
                  効率化だけを目的にするのではなく、人が人らしく働き、考え、選択できる社会を目指します。
                </p>
                <p style={{ fontSize: 16, color: "#475569", lineHeight: 2.0 }}>
                  テクノロジーが人に寄り添い、働く人・経営する人・関わるすべての人を自然に支える未来をつくります。
                </p>
              </div>
            </div>

            {/* Values */}
            <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 72 }}>
              <div className="sr" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", color: "#6366f1", textTransform: "uppercase", marginBottom: 40 }}>Values</div>
              <div className="mob-grid-values" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 0 }}>
                {[
                  { en:"Human First",  jp:"人間起点",   desc:"技術や機能からではなく、使う人・働く人・悩む人の視点から考えます。" },
                  { en:"Visualize",    jp:"可視化",     desc:"声・違和感・不安・負担など、見えにくいものを判断できる形に変えます。" },
                  { en:"Practical",    jp:"実用設計",   desc:"高機能であることよりも、現場で自然に使われ続けることを大切にします。" },
                  { en:"Coexistence",  jp:"技術共存",   desc:"テクノロジーは人を置き換えるものではなく、人の感覚や判断を支える存在として設計します。" },
                  { en:"Iteration",    jp:"継続改善",   desc:"完璧を待たずに小さく試し、現場の反応を見ながらより良い仕組みに育てます。" },
                ].map((v, i) => (
                  <div key={v.en} className="sr" style={{ padding: "32px 24px", borderLeft: i === 0 ? "none" : "1px solid #e2e8f0", transitionDelay:`${i*0.08}s` }}>
                    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: "#6366f1", textTransform: "uppercase", marginBottom: 14 }}>{v.en}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>{v.jp}</div>
                    <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.85 }}>{v.desc}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── Business ── */}
        <section id="business" className="mob-section" style={{ background: "#fff", padding: "120px 64px 140px" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <div className="sr" style={{ textAlign: "center", marginBottom: 72 }}>
              <h2 style={{ fontSize: "clamp(64px, 10vw, 130px)", fontWeight: 900, letterSpacing: "-0.05em", color: "#0f172a", lineHeight: 1 }}>Works</h2>
            </div>
            {/* 2×2 grid */}
            <div className="mob-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>

              {/* 01 — quix */}
              <div className="sr" style={{ borderRadius: 20, overflow: "hidden", cursor: "pointer" }}
                onClick={() => window.open("/quix", "_blank")}
                onMouseEnter={e => { (e.currentTarget.querySelector(".biz-img") as HTMLElement).style.transform = "scale(1.03)"; }}
                onMouseLeave={e => { (e.currentTarget.querySelector(".biz-img") as HTMLElement).style.transform = "scale(1)"; }}>
                <div className="biz-img" style={{ height: 380, overflow: "hidden",
                  transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
                  <img src="/1.jpg" alt="quix" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                <div style={{ padding: "22px 4px" }}>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8, fontWeight: 600 }}>01</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>quix — 社内AIナレッジ検索</div>
                  <div style={{ fontSize: 14, color: "#64748b", marginTop: 6, lineHeight: 1.7 }}>チャット形式で社内のFAQ・規程・マニュアルを瞬時に回答。AIが蓄積された知識を自動整理し、問い合わせ工数を大幅削減します。</div>
                </div>
              </div>

              {/* 02 — LENDS AI */}
              <div className="sr" style={{ borderRadius: 20, overflow: "hidden", cursor: "pointer", transitionDelay: "0.08s" }}
                onClick={() => window.open("https://www.lens-ai.jp", "_blank")}
                onMouseEnter={e => { (e.currentTarget.querySelector(".biz-img") as HTMLElement).style.transform = "scale(1.03)"; }}
                onMouseLeave={e => { (e.currentTarget.querySelector(".biz-img") as HTMLElement).style.transform = "scale(1)"; }}>
                <div className="biz-img" style={{ height: 380, overflow: "hidden",
                  transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
                  <img src="/2.jpg" alt="LENDS AI" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                <div style={{ padding: "22px 4px" }}>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8, fontWeight: 600 }}>02</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>LENDS AI — 組織診断AI</div>
                  <div style={{ fontSize: 14, color: "#64748b", marginTop: 6, lineHeight: 1.7 }}>組織の状態をAIで可視化するSaaSプロダクト。人事課題の早期発見から採用・育成まで一気通貫で支援します。</div>
                </div>
              </div>

              {/* 03 — AI Labs */}
              <div className="sr" style={{ borderRadius: 20, overflow: "hidden", cursor: "pointer", transitionDelay: "0.16s" }}
                onClick={() => window.open("/ai-labs", "_blank")}
                onMouseEnter={e => { (e.currentTarget.querySelector(".biz-img") as HTMLElement).style.transform = "scale(1.03)"; }}
                onMouseLeave={e => { (e.currentTarget.querySelector(".biz-img") as HTMLElement).style.transform = "scale(1)"; }}>
                <div className="biz-img" style={{ height: 380, overflow: "hidden",
                  transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
                  <img src="/3.jpg" alt="AI Labs" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                <div style={{ padding: "22px 4px" }}>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8, fontWeight: 600 }}>03</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>AI Labs — 業務AI受託開発</div>
                  <div style={{ fontSize: 14, color: "#64748b", marginTop: 6, lineHeight: 1.7 }}>LLM・RAG・業務自動化を軸としたAIシステムをオーダーメイドで開発。現場課題を技術で根本から解決します。</div>
                </div>
              </div>

              {/* 04 — jGO */}
              <div className="sr" style={{ borderRadius: 20, overflow: "hidden", cursor: "default", transitionDelay: "0.24s", opacity: 0.7 }}>
                <div className="biz-img" style={{ height: 380, overflow: "hidden",
                  transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
                  <img src="/4.jpg" alt="jGO" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                <div style={{ padding: "22px 4px" }}>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8, fontWeight: 600 }}>04</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>jGO — 人材紹介</div>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: "#f1f5f9", color: "#94a3b8", letterSpacing: "0.06em" }}>Coming Soon</span>
                  </div>
                  <div style={{ fontSize: 14, color: "#64748b", marginTop: 6, lineHeight: 1.7 }}>グローバル視点で人材と企業をつなぐキャリア支援サービス。テクノロジーと人の知見で最適なマッチングを実現します。（有料職業紹介事業）</div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── AI Capabilities ── */}
        <section id="product" className="mob-section" style={{ background: "#fff", padding: "120px 64px 140px" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>

            {/* Header */}
            <div className="sr" style={{ marginBottom: 80 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <div style={{ width: 24, height: 1, background: "#6366f1" }} />
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", color: "#6366f1", textTransform: "uppercase" }}>AI CAPABILITIES</div>
              </div>
              <h2 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, lineHeight: 1.5, color: "#0f172a", maxWidth: 560 }}>
                AIは今、ビジネスの<br />何を変えられるのか。
              </h2>
            </div>

            {/* FOLIO-style: left text + right 2 cards */}
            <div className="mob-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>

              {/* Left: description */}
              <div className="sr">
                <p style={{ fontSize: "clamp(18px, 2vw, 24px)", fontWeight: 700, lineHeight: 1.7, color: "#0f172a", marginBottom: 32 }}>
                  私たちは、AIを使って<br />できることを増やし続けている。
                </p>
                <p style={{ fontSize: 15, color: "#64748b", lineHeight: 2.0, marginBottom: 24 }}>
                  LLM・RAG・機械学習を組み合わせれば、これまで人手に頼っていた業務の多くを、より速く・より正確に処理できます。
                </p>
                <p style={{ fontSize: 15, color: "#64748b", lineHeight: 2.0 }}>
                  業種や規模を問わず、AIの力を現場に届けること。それが合同会社80の使命です。
                </p>

                {/* capability tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 36 }}>
                  {["LLM活用","RAG構築","業務自動化","チャットボット","データ分析","組織診断AI","採用AI","文書生成"].map(t => (
                    <span key={t} style={{ fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 100,
                      border: "1.5px solid #e2e8f0", color: "#475569", letterSpacing: "0.02em" }}>{t}</span>
                  ))}
                </div>
              </div>

              {/* Right: 2 cards stacked */}
              <div className="sr" style={{ display: "flex", flexDirection: "column", gap: 16, transitionDelay: "0.12s" }}>

                {/* Card 1 */}
                <div style={{ borderRadius: 20, overflow: "hidden", background: "linear-gradient(135deg, #0f172a, #1e1b4b)", padding: "40px 36px", position: "relative" }}>
                  <div style={{ position: "absolute", top: -20, right: -20, width: 160, height: 160, borderRadius: "50%", border: "1px solid rgba(99,102,241,0.2)" }} />
                  <div style={{ position: "absolute", top: 10, right: 60, fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", color: "rgba(165,180,252,0.5)", textTransform: "uppercase" }}>LANGUAGE MODEL</div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(165,180,252,0.6)", textTransform: "uppercase", marginBottom: 16 }}>自動化 & 生成</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 14, lineHeight: 1.4 }}>ドキュメント・<br />コミュニケーションをAIで。</div>
                  <div style={{ fontSize: 13, color: "rgba(203,213,225,0.8)", lineHeight: 1.8 }}>
                    報告書・提案書・メールの自動生成。社内FAQへの即答。AIが"書く・答える"を肩代わりします。
                  </div>
                </div>

                {/* Card 2 */}
                <div style={{ borderRadius: 20, overflow: "hidden", background: "linear-gradient(135deg, #1a1025, #312e81)", padding: "40px 36px", position: "relative" }}>
                  <div style={{ position: "absolute", bottom: -30, right: -30, width: 180, height: 180, borderRadius: "50%", border: "1px solid rgba(124,58,237,0.2)" }} />
                  <div style={{ position: "absolute", bottom: 40, right: 36, fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", color: "rgba(196,181,253,0.5)", textTransform: "uppercase" }}>DATA SCIENCE</div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(196,181,253,0.6)", textTransform: "uppercase", marginBottom: 16 }}>分析 & 洞察</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 14, lineHeight: 1.4 }}>データから、<br />意思決定を変える。</div>
                  <div style={{ fontSize: 13, color: "rgba(203,213,225,0.8)", lineHeight: 1.8 }}>
                    売上予測・異常検知・顧客分析。膨大なデータを即座に解釈し、ビジネスの判断を支えます。
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>


        {/* ── Case Studies ── */}
        <section style={{ background: "#f8fafc", padding: "100px 0 120px", position: "relative", overflow: "hidden" }}>
          <DotCanvas />

          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Header */}
            <div style={{ maxWidth: 1160, margin: "0 auto 64px", padding: "0 64px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div>
                <div className="sr" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", color: "#6366f1", textTransform: "uppercase", marginBottom: 16 }}>Case Studies</div>
                <h2 className="sr" style={{ fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.04em", lineHeight: 1.05, transitionDelay: "0.08s" }}>
                  AIを、現場に<br />届けてきた。
                </h2>
              </div>
              <div className="sr" style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500, textAlign: "right", transitionDelay: "0.12s" }}>
                実際の導入実績
              </div>
            </div>

            {/* Ticker — row 1 */}
            <div style={{ overflow: "hidden", marginBottom: 16 }}>
              <div className="ticker-track" style={{ display: "flex", gap: 16, width: "max-content", padding: "0 16px" }}>
                {((cards) => [...cards, ...cards])([
                  { tag: "採用・HR",      title: "入社時テストのAI化",    metric: "−62%", metricLabel: "選考時間", accent: "#6366f1", code: "assess.run()" },
                  { tag: "予約管理",      title: "予約システムのAI化",    metric: "−78%", metricLabel: "対応工数", accent: "#8b5cf6", code: "booking.auto()" },
                  { tag: "バックオフィス", title: "会計ソフトのAI化",     metric: "−50%", metricLabel: "経理負荷", accent: "#0891b2", code: "ledger.ai()" },
                  { tag: "業務効率",      title: "日報管理のAI化",       metric: "+40%", metricLabel: "提出率",   accent: "#059669", code: "report.gen()" },
                ]).map((c, i) => (
                  <div key={i} style={{
                    width: 320, flexShrink: 0, borderRadius: 16,
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
                    padding: "28px 26px 24px",
                    display: "flex", flexDirection: "column", gap: 0,
                    transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s, border-color 0.3s",
                    cursor: "pointer", position: "relative", overflow: "hidden",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 12px 40px ${c.accent}22`; e.currentTarget.style.borderColor = `${c.accent}50`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.05)"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
                  >
                    {/* top accent bar */}
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${c.accent}, ${c.accent}88)`, borderRadius: "16px 16px 0 0" }} />
                    {/* terminal-style code snippet */}
                    <div style={{ fontFamily: "'SF Mono', 'Fira Code', monospace", fontSize: 11, color: c.accent,
                      background: `${c.accent}0e`, border: `1px solid ${c.accent}22`, borderRadius: 6,
                      padding: "5px 10px", marginBottom: 20, display: "inline-block", letterSpacing: "0.02em" }}>
                      $ {c.code}
                    </div>
                    {/* tag + arrow */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: c.accent,
                        textTransform: "uppercase", padding: "3px 10px", borderRadius: 100,
                        background: `${c.accent}12`, border: `1px solid ${c.accent}30` }}>{c.tag}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2">
                        <path d="M7 17L17 7M17 7H7M17 7v10"/>
                      </svg>
                    </div>
                    {/* title */}
                    <div style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", lineHeight: 1.4, marginBottom: 20 }}>{c.title}</div>
                    {/* metric */}
                    <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "baseline", gap: 8 }}>
                      <div style={{ fontSize: 32, fontWeight: 900, color: c.accent, letterSpacing: "-0.03em", lineHeight: 1 }}>{c.metric}</div>
                      <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{c.metricLabel}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ticker — row 2 (reverse) */}
            <div style={{ overflow: "hidden" }}>
              <div style={{ display: "flex", gap: 16, width: "max-content", padding: "0 16px",
                animation: "ticker 44s linear infinite reverse" }}>
                {((cards) => [...cards, ...cards])([
                  { tag: "DX推進",    title: "生成AIの社内導入",       metric: "+55%", metricLabel: "生産性",    accent: "#f59e0b", code: "deploy.ai()" },
                  { tag: "Web",       title: "ホームページへのAI実装", metric: "+38%", metricLabel: "CV率",      accent: "#0ea5e9", code: "chat.embed()" },
                  { tag: "マーケ",    title: "SEO対策のAI化",          metric: "+210%", metricLabel: "オーガニック流入", accent: "#ec4899", code: "seo.optimize()" },
                  { tag: "コンテンツ", title: "自動ブログ更新AI",      metric: "−90%", metricLabel: "運用コスト", accent: "#8b5cf6", code: "content.auto()" },
                ]).map((c, i) => (
                  <div key={i} style={{
                    width: 320, flexShrink: 0, borderRadius: 16,
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
                    padding: "28px 26px 24px",
                    display: "flex", flexDirection: "column", gap: 0,
                    transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s, border-color 0.3s",
                    cursor: "pointer", position: "relative", overflow: "hidden",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 12px 40px ${c.accent}22`; e.currentTarget.style.borderColor = `${c.accent}50`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.05)"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
                  >
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${c.accent}, ${c.accent}88)`, borderRadius: "16px 16px 0 0" }} />
                    <div style={{ fontFamily: "'SF Mono', 'Fira Code', monospace", fontSize: 11, color: c.accent,
                      background: `${c.accent}0e`, border: `1px solid ${c.accent}22`, borderRadius: 6,
                      padding: "5px 10px", marginBottom: 20, display: "inline-block", letterSpacing: "0.02em" }}>
                      $ {c.code}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: c.accent,
                        textTransform: "uppercase", padding: "3px 10px", borderRadius: 100,
                        background: `${c.accent}12`, border: `1px solid ${c.accent}30` }}>{c.tag}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2">
                        <path d="M7 17L17 7M17 7H7M17 7v10"/>
                      </svg>
                    </div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", lineHeight: 1.4, marginBottom: 20 }}>{c.title}</div>
                    <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "baseline", gap: 8 }}>
                      <div style={{ fontSize: 32, fontWeight: 900, color: c.accent, letterSpacing: "-0.03em", lineHeight: 1 }}>{c.metric}</div>
                      <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{c.metricLabel}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── News ── */}
        <section id="news" className="mob-section" style={{ background: "#fff", padding: "120px 64px 140px" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <div className="sr" style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 64 }}>
              <h2 style={{ fontSize: "clamp(48px, 7vw, 96px)", fontWeight: 900, letterSpacing: "-0.05em", color: "#0f172a", lineHeight: 1 }}>News</h2>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#6366f1", letterSpacing: "0.1em", textTransform: "uppercase" }}>Latest Updates</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {[
                { date: "2026.06", cat: "Research", title: "RAGパイプラインの精度向上に関する社内検証を実施", desc: "チャンク分割戦略とリランキングモデルの組み合わせにより、社内FAQ検索の回答精度を従来比で約25%改善。" },
                { date: "2026.04", cat: "Research", title: "マルチモーダルLLMを活用した業務文書解析の研究開発", desc: "画像・表・PDFを含む業務文書をLLMで構造的に解析する手法を検証中。請求書・契約書の自動処理への応用を目指す。" },
                { date: "2026.02", cat: "Research", title: "LLMエージェントによる業務フロー自動化の技術検証", desc: "複数ツールを跨いだタスクをAIエージェントが自律的に処理する仕組みのPoC開発に着手。" },
                { date: "2025.12", cat: "Product",  title: "LENDS AI 新機能「採用アセスメント」正式リリース", desc: "心理・論理・コミュニケーション・敬語の4軸で候補者を自動評価する採用アセスメント機能を追加しました。" },
                { date: "2025.10", cat: "Research", title: "小規模LLMのファインチューニングによる業務特化AI検証", desc: "オープンソースLLMを業務データで追加学習し、汎用モデルと比較してドメイン特化タスクの精度向上を確認。" },
              ].map((item, i) => (
                <div key={i} className="sr mob-news-item" style={{
                  display: "grid", gridTemplateColumns: "120px 80px 1fr",
                  gap: "0 40px", alignItems: "start",
                  padding: "32px 0", borderTop: "1px solid #e2e8f0",
                  transitionDelay: `${i * 0.06}s`, cursor: "pointer",
                  transition: "opacity 0.2s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.6")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.06em", paddingTop: 4 }}>{item.date}</div>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100,
                      background: "#eef2ff", color: "#6366f1", letterSpacing: "0.06em" }}>{item.cat}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 8, lineHeight: 1.5 }}>{item.title}</div>
                    <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.8 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
              <div style={{ borderTop: "1px solid #e2e8f0" }} />
            </div>
          </div>
        </section>

        {/* ── Recruit ── */}
        <section id="recruit" className="mob-section" style={{ background: "#111827", padding: "120px 64px 140px" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>

            {/* Title */}
            <div className="sr mob-recruit-header" style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 80 }}>
              <h2 style={{ fontSize: "clamp(48px, 7vw, 96px)", fontWeight: 900, letterSpacing: "-0.05em", color: "#f8fafc", lineHeight: 1 }}>Recruit</h2>
              <a href="mailto:ito.t@80grp.com"
                style={{ display: "inline-flex", alignItems: "center", gap: 10,
                  padding: "12px 28px", borderRadius: 6,
                  border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)",
                  fontSize: 13, fontWeight: 600, letterSpacing: "0.02em",
                  textDecoration: "none", transition: "border-color 0.2s, color 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor="#6366f1"; (e.currentTarget as HTMLAnchorElement).style.color="#fff"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor="rgba(255,255,255,0.2)"; (e.currentTarget as HTMLAnchorElement).style.color="rgba(255,255,255,0.6)"; }}>
                カジュアル面談を申し込む
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>

            {/* Positions */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {[
                { role: "AI Engineer",        type: "業務委託 / 正社員",  tags: ["Python", "LLM", "RAG"] },
                { role: "Frontend Engineer",  type: "業務委託 / 正社員",  tags: ["Next.js", "TypeScript", "UI/UX"] },
                { role: "Sales / BizDev",     type: "業務委託 / インターン", tags: ["SaaS", "法人営業", "企画"] },
              ].map((pos, i) => (
                <div key={i} className="sr" style={{
                  display: "grid", gridTemplateColumns: "1fr auto",
                  alignItems: "center", gap: 24,
                  padding: "36px 0", borderTop: "1px solid rgba(255,255,255,0.08)",
                  cursor: "pointer", transitionDelay: `${i * 0.06}s`,
                }}
                  onMouseEnter={e => { (e.currentTarget.style.opacity = "0.6"); }}
                  onMouseLeave={e => { (e.currentTarget.style.opacity = "1"); }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap", marginBottom: 12 }}>
                      <div style={{ fontSize: "clamp(20px, 2.2vw, 26px)", fontWeight: 800,
                        color: "#f8fafc", letterSpacing: "-0.02em" }}>{pos.role}</div>
                      <div style={{ fontSize: 12, color: "rgba(248,250,252,0.3)", fontWeight: 500 }}>{pos.type}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {pos.tags.map(t => (
                        <span key={t} style={{ fontSize: 11, fontWeight: 600, padding: "3px 11px",
                          borderRadius: 100, background: "rgba(99,102,241,0.15)",
                          color: "#a5b4fc", letterSpacing: "0.04em" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              ))}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer style={{ background: "#13151f", padding: "80px 64px 0" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <div className="mob-grid-footer" style={{ display: "grid", gridTemplateColumns: "220px 1fr 200px", gap: 64, paddingBottom: 80, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>

              {/* Left — logo + tagline */}
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ marginBottom: 12 }}><img src="/8.png" alt="80" style={{ height: 48, display: "block" }} /></div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.8 }}>
                    人の知覚を、<br />ソフトウェアで拡張する。
                  </div>
                </div>
              </div>

              {/* Center — nav columns */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 48px" }}>

                {/* Column 1 — 事業内容 */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>事業内容</span>
                    <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {[["quix","/quix"],["LENDS AI","https://www.lens-ai.jp"],["AI Labs","/ai-labs"],["jGO",null]].map(([l, href]) => (
                      href ? (
                        <a key={l as string} href={href as string} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                          style={{ fontSize:13, color:"rgba(255,255,255,0.45)", textDecoration:"none", transition:"color 0.2s" }}
                          onMouseEnter={e => (e.currentTarget.style.color="#fff")}
                          onMouseLeave={e => (e.currentTarget.style.color="rgba(255,255,255,0.45)")}>{l}</a>
                      ) : (
                        <span key={l as string} style={{ fontSize:13, color:"rgba(255,255,255,0.25)" }}>{l}</span>
                      )
                    ))}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "40px 0 24px" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>プロダクト</span>
                    <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {[["AIでできること","product"],["導入事例","product"]].map(([l, id]) => (
                      <button key={l} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" })}
                        style={{ background:"none", border:"none", cursor:"pointer", padding:0, textAlign:"left",
                          fontSize:13, color:"rgba(255,255,255,0.45)", fontFamily:"inherit", transition:"color 0.2s" }}
                        onMouseEnter={e => (e.currentTarget.style.color="#fff")}
                        onMouseLeave={e => (e.currentTarget.style.color="rgba(255,255,255,0.45)")}>{l}</button>
                    ))}
                  </div>
                </div>

                {/* Column 2 — 会社情報 */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>会社情報</span>
                    <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {[["ビジョン","vision"],["ニュース","news"],["採用","recruit"]].map(([l, id]) => (
                      <button key={l} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" })}
                        style={{ background:"none", border:"none", cursor:"pointer", padding:0, textAlign:"left",
                          fontSize:13, color:"rgba(255,255,255,0.45)", fontFamily:"inherit", transition:"color 0.2s" }}
                        onMouseEnter={e => (e.currentTarget.style.color="#fff")}
                        onMouseLeave={e => (e.currentTarget.style.color="rgba(255,255,255,0.45)")}>{l}</button>
                    ))}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "40px 0 24px" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>お問い合わせ</span>
                    <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
                  </div>
                  <a href="/contact"
                    style={{ fontSize:13, color:"rgba(255,255,255,0.45)", textDecoration:"none", transition:"color 0.2s", display:"block" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color="#fff")}
                    onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color="rgba(255,255,255,0.45)")}>
                    お問い合わせフォーム →
                  </a>
                </div>
              </div>

              {/* Right — TOP button */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "flex-start" }}>
                <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6,
                    background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                    borderRadius:8, padding:"16px 20px", cursor:"pointer",
                    transition:"background 0.2s", color:"rgba(255,255,255,0.5)", fontFamily:"inherit" }}
                  onMouseEnter={e => (e.currentTarget.style.background="rgba(255,255,255,0.12)")}
                  onMouseLeave={e => (e.currentTarget.style.background="rgba(255,255,255,0.06)")}>
                  <span style={{ fontSize:9, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase" }}>TOP</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 19V5M5 12l7-7 7 7"/>
                  </svg>
                  <span style={{ fontSize:9, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase" }}>PAGE</span>
                </button>
              </div>
            </div>

            {/* Bottom bar */}
            <div style={{ padding: "28px 0 32px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.2)", letterSpacing:"0.04em" }}>
                © 2025 合同会社80. All rights reserved.
              </div>
              <div style={{ display:"flex", gap:24, alignItems:"center", flexWrap:"wrap" }}>
                {([["会社概要","/company"],["プライバシーポリシー","/privacy"],["利用規約","/terms"],["サイトマップ","/sitemap-page"]] as [string,string][]).map(([label,href])=>(
                  <a key={href} href={href} style={{ fontSize:11, color:"rgba(255,255,255,0.25)", textDecoration:"none", transition:"color 0.2s" }}
                    onMouseEnter={e=>e.currentTarget.style.color="rgba(255,255,255,0.6)"}
                    onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.25)"}>{label}</a>
                ))}
                <span style={{ fontSize:11, color:"rgba(255,255,255,0.2)" }}>名古屋市 / Nagoya, Japan</span>
              </div>
            </div>
          </div>
        </footer>
        </div>{/* /gradient wrapper */}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mob-hide { display: none !important; }

          .mob-section {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }

          .mob-grid-2 {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }

          .mob-grid-values {
            grid-template-columns: 1fr 1fr !important;
            gap: 0 !important;
          }
          .mob-grid-values > div {
            border-left: none !important;
            border-top: 1px solid #e2e8f0;
            padding: 24px 16px !important;
          }

          .mob-grid-footer {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }

          .mob-news-item {
            grid-template-columns: auto auto 1fr !important;
            gap: 0 12px !important;
          }

          .mob-recruit-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 20px !important;
          }

          .mob-hero-orb1 {
            animation: orb-float 8s ease-in-out infinite alternate;
          }
          .mob-hero-orb2 {
            animation: orb-float 10s ease-in-out infinite alternate-reverse;
          }
          @keyframes orb-float {
            0% { transform: translate(0, 0) scale(1); }
            100% { transform: translate(-10px, 15px) scale(1.08); }
          }
          .mob-scroll-line {
            animation: scroll-pulse 2s ease-in-out infinite;
          }
          @keyframes scroll-pulse {
            0%, 100% { opacity: 0.3; transform: scaleY(0.6); transform-origin: top; }
            50% { opacity: 1; transform: scaleY(1); transform-origin: top; }
          }

          .biz-img { height: 220px !important; }
        }
      `}</style>
    </>
  );
}

