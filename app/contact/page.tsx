"use client";

import { useState, FormEvent } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`【お問い合わせ】${form.company ? form.company + " " : ""}${form.name}様`);
    const body = encodeURIComponent(
      `会社名: ${form.company || "個人"}\nお名前: ${form.name}\nメール: ${form.email}\n\n${form.message}`
    );
    window.location.href = `mailto:ito.t@80grp.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
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
          {submitted ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 24 }}>✓</div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 16 }}>メーラーが起動しました</h2>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.9, marginBottom: 32 }}>
                メールアプリから送信を完了してください。<br />
                もしメーラーが開かない場合は、直接 <a href="mailto:ito.t@80grp.com" style={{ color: "#6366f1", textDecoration: "none", fontWeight: 600 }}>ito.t@80grp.com</a> までご連絡ください。
              </p>
              <button onClick={() => setSubmitted(false)}
                style={{ padding: "10px 24px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "transparent", color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                もう一度入力する
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
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

              <button type="submit"
                style={{
                  padding: "16px 32px", borderRadius: 10, border: "none",
                  background: "#0f172a", color: "#fff", fontSize: 14, fontWeight: 700,
                  cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit",
                  letterSpacing: "0.02em",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#1e293b"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#0f172a"; e.currentTarget.style.transform = "translateY(0)"; }}>
                メールで送信する →
              </button>

              <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.8, textAlign: "center" }}>
                送信ボタンを押すとメールアプリが起動します。<br />
                直接メールする場合: <a href="mailto:ito.t@80grp.com" style={{ color: "#6366f1", textDecoration: "none" }}>ito.t@80grp.com</a>
              </p>
            </form>
          )}
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
