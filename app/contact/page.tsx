"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot（人間は入力しない）
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (website) return; // botはここで捨てる
    setBusy(true);
    setError(false);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      router.push("/contact/thanks");
    } catch {
      setError(true);
      setBusy(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "14px 18px", borderRadius: 10,
    border: "1.5px solid #e2e8f0", background: "#fafafa",
    fontSize: 14, fontFamily: "inherit", color: "#0f172a",
    outline: "none", transition: "border-color 0.2s",
  };

  return (
    <div style={{ fontFamily: "inherit", background: "#fff", color: "#0f172a", overflowX: "hidden", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(255,255,255,0.88)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(15,23,42,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 48px", height: 64,
      }}>
        <a href="/"><img src="/7.png" alt="80" style={{ height: 48, display: "block" }} /></a>
        <a href="/" style={{ fontSize: 13, fontWeight: 600, color: "#475569", textDecoration: "none", padding: "8px 20px", borderRadius: 100, border: "1.5px solid #e2e8f0" }}>← トップに戻る</a>
      </nav>

      <section style={{ paddingTop: 140, paddingBottom: 80, paddingLeft: 80, paddingRight: 80, background: "linear-gradient(160deg, #f8fafc 0%, #f1f5f9 100%)" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "#6366f1", textTransform: "uppercase", marginBottom: 24 }}>Contact</div>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 72px)", fontWeight: 900, letterSpacing: "-0.05em", color: "#0f172a", lineHeight: 1.0, marginBottom: 24 }}>お問い合わせ</h1>
          <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.9 }}>
            サービスに関するご質問・ご相談・お見積もりなど、お気軽にお問い合わせください。
          </p>
        </div>
      </section>

      <section style={{ padding: "80px 80px 120px", flex: 1 }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* honeypot: 画面には見えない */}
              <input
                type="text"
                value={website}
                onChange={e => setWebsite(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", height: 0, width: 0, opacity: 0 }}
              />
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 8, display: "block" }}>
                  お名前 <span style={{ color: "#ef4444", fontSize: 11 }}>*</span>
                </label>
                <input required type="text" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="山田 太郎"
                  style={inputStyle}
                  onFocus={e => e.currentTarget.style.borderColor = "#6366f1"}
                  onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"} />
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 8, display: "block" }}>
                  メールアドレス <span style={{ color: "#ef4444", fontSize: 11 }}>*</span>
                </label>
                <input required type="email" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="example@company.com"
                  style={inputStyle}
                  onFocus={e => e.currentTarget.style.borderColor = "#6366f1"}
                  onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"} />
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 8, display: "block" }}>
                  お電話番号
                </label>
                <input type="tel" value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="090-1234-5678（任意）"
                  style={inputStyle}
                  onFocus={e => e.currentTarget.style.borderColor = "#6366f1"}
                  onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"} />
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 8, display: "block" }}>
                  会社名
                </label>
                <input type="text" value={form.company}
                  onChange={e => setForm({ ...form, company: e.target.value })}
                  placeholder="株式会社○○"
                  style={inputStyle}
                  onFocus={e => e.currentTarget.style.borderColor = "#6366f1"}
                  onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"} />
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 8, display: "block" }}>
                  お問い合わせ内容 <span style={{ color: "#ef4444", fontSize: 11 }}>*</span>
                </label>
                <textarea required value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="お問い合わせ内容をご入力ください"
                  rows={6}
                  style={{ ...inputStyle, resize: "vertical" }}
                  onFocus={e => e.currentTarget.style.borderColor = "#6366f1"}
                  onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"} />
              </div>

              {error && (
                <p style={{ fontSize: 13, fontWeight: 700, color: "#ef4444", lineHeight: 1.8 }}>
                  送信に失敗しました。お手数ですが時間をおいて再度お試しいただくか、
                  <a href="mailto:ito.t@80grp.com" style={{ color: "#6366f1", textDecoration: "none" }}>ito.t@80grp.com</a> まで直接ご連絡ください。
                </p>
              )}

              <button type="submit" disabled={busy}
                style={{
                  padding: "16px 32px", borderRadius: 10, border: "none",
                  background: "#0f172a", color: "#fff", fontSize: 14, fontWeight: 700,
                  cursor: busy ? "wait" : "pointer", transition: "all 0.2s", fontFamily: "inherit",
                  letterSpacing: "0.02em", opacity: busy ? 0.6 : 1,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#1e293b"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#0f172a"; e.currentTarget.style.transform = "translateY(0)"; }}>
                {busy ? "送信中…" : "送信する →"}
              </button>

              <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.8, textAlign: "center" }}>
                通常1営業日以内にご返信いたします。<br />
                直接メールする場合: <a href="mailto:ito.t@80grp.com" style={{ color: "#6366f1", textDecoration: "none" }}>ito.t@80grp.com</a>
              </p>
            </form>
        </div>
      </section>

      <footer style={{ background: "#0f172a", padding: "48px 80px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>© 2025 合同会社80. All rights reserved.</div>
        <div style={{ display: "flex", gap: 24 }}>
          {[["会社概要", "/company"], ["プライバシーポリシー", "/privacy"], ["利用規約", "/terms"]].map(([label, href]) => (
            <a key={href as string} href={href as string} style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textDecoration: "none" }}
              onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}>{label}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
