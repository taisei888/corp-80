"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Google広告のコンバージョン計測地点。
// NEXT_PUBLIC_ADS_CONVERSION（例: AW-XXXXXXXXXX/AbCdEfGhIj）を設定すると発火する。
export default function ThanksPage() {
  useEffect(() => {
    const sendTo = process.env.NEXT_PUBLIC_ADS_CONVERSION;
    if (sendTo && window.gtag) {
      window.gtag("event", "conversion", { send_to: sendTo });
    }
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, marginBottom: 28 }}>
        ✓
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em", marginBottom: 16 }}>
        お問い合わせを受け付けました
      </h1>
      <p style={{ fontSize: 14, color: "#64748b", lineHeight: 2, marginBottom: 36 }}>
        ご入力いただいた内容を確認のうえ、<br />
        通常1営業日以内に担当者よりご返信いたします。
      </p>
      <a
        href="/"
        style={{
          display: "inline-block", padding: "14px 32px", borderRadius: 100,
          background: "#0f172a", color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none",
        }}
      >
        トップページへ戻る
      </a>
      <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 40 }}>
        合同会社80 ｜ ito.t@80grp.com ｜ 050-8896-5889
      </p>
    </div>
  );
}
