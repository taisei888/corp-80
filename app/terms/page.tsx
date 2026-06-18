"use client";

export default function TermsPage() {
  const sections = [
    {
      title: "第1条（適用）",
      body: "本規約は、合同会社80（以下「当社」といいます。）が提供するサービス（以下「本サービス」といいます。）の利用条件を定めるものです。登録ユーザーの皆さまには、本規約に従って、本サービスをご利用いただきます。",
    },
    {
      title: "第2条（利用登録）",
      body: "本サービスにおいては、登録希望者が本規約に同意の上、当社の定める方法によって利用登録を申請し、当社がこれを承認することによって、利用登録が完了するものとします。\n\n当社は、利用登録の申請者に以下の事由があると判断した場合、利用登録の申請を承認しないことがあり、その理由については一切の開示義務を負わないものとします。\n\n① 本規約に違反したことがある者からの申請である場合\n② 虚偽の事項を届け出た場合\n③ その他、当社が利用登録を相当でないと判断した場合",
    },
    {
      title: "第3条（禁止事項）",
      body: `ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。

① 法令または公序良俗に違反する行為
② 犯罪行為に関連する行為
③ 当社、本サービスの他のユーザー、またはその他第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為
④ 当社のサービスの運営を妨害するおそれのある行為
⑤ 他のユーザーに関する個人情報等を収集または蓄積する行為
⑥ 不正アクセスをし、またはこれを試みる行為
⑦ 他のユーザーに成りすます行為
⑧ 当社のサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為
⑨ その他、当社が不適切と判断する行為`,
    },
    {
      title: "第4条（本サービスの提供の停止等）",
      body: `当社は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。

① 本サービスにかかるコンピュータシステムの保守点検または更新を行う場合
② 地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合
③ コンピュータまたは通信回線等が事故により停止した場合
④ その他、当社が本サービスの提供が困難と判断した場合

当社は、本サービスの提供の停止または中断により、ユーザーまたは第三者が被ったいかなる不利益または損害についても、一切の責任を負わないものとします。`,
    },
    {
      title: "第5条（著作権）",
      body: "ユーザーは、自ら著作権等の必要な知的財産権を有するか、または必要な権利者の許諾を得た文章、画像や映像等の情報に関してのみ、本サービスを利用し、投稿ないしアップロードすることができるものとします。ユーザーが本サービスを利用して投稿ないしアップロードした文章、画像、映像等の著作権については、当該ユーザーその他既存の権利者に留まるものとします。ただし、当社は、本サービスを改善、運営するために必要な範囲で、当該コンテンツを利用することができるものとします。",
    },
    {
      title: "第6条（利用制限および登録抹消）",
      body: `当社は、ユーザーが以下のいずれかに該当する場合には、事前の通知なく、ユーザーに対して、本サービスの全部もしくは一部の利用を制限し、またはユーザーとしての登録を抹消することができるものとします。

① 本規約のいずれかの条項に違反した場合
② 登録事項に虚偽の事実があることが判明した場合
③ 料金等の支払債務の不履行があった場合
④ 当社からの連絡に対し、一定期間返答がない場合
⑤ 本サービスについて、最終の利用から一定期間利用がない場合
⑥ その他、当社が本サービスの利用を適当でないと判断した場合`,
    },
    {
      title: "第7条（免責事項）",
      body: "当社の債務不履行責任は、当社の故意または重過失によらない場合には免責されるものとします。当社は、何らかの理由によって責任を負う場合にも、通常生じうる損害の範囲内かつ有料サービスにあっては代金額（継続的サービスの場合には1ヶ月分相当額）を上限として損害賠償の責任を負うものとします。当社は、本サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等について一切責任を負いません。",
    },
    {
      title: "第8条（サービス内容の変更等）",
      body: "当社は、ユーザーに通知することなく、本サービスの内容を変更しまたは本サービスの提供を中止することができるものとし、これによってユーザーに生じた損害について一切の責任を負いません。",
    },
    {
      title: "第9条（利用規約の変更）",
      body: "当社は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。なお、本規約の変更後、本サービスの利用を開始した場合には、当該ユーザーは変更後の規約に同意したものとみなします。",
    },
    {
      title: "第10条（準拠法・裁判管轄）",
      body: "本規約の解釈にあたっては、日本法を準拠法とします。本サービスに関して紛争が生じた場合には、当社の本店所在地を管轄する裁判所を専属的合意管轄とします。",
    },
    {
      title: "第11条（お問い合わせ窓口）",
      body: "本規約に関するお問い合わせは、下記の窓口までお願いいたします。\n\n会社名：合同会社80\n所在地：愛知県名古屋市北区楠味鋺2-914-2-2F\n電話番号：050-8896-5889\nメールアドレス：ito.t@80grp.com",
    },
  ];

  return (
    <div style={{ fontFamily: "inherit", background: "#fff", color: "#0f172a", overflowX: "hidden" }}>

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(255,255,255,0.88)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(15,23,42,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 48px", height: 64,
      }}>
        <a href="/"><img src="/7.png" alt="80" style={{ height: 28, display: "block" }} /></a>
        <a href="/" style={{ fontSize: 13, fontWeight: 600, color: "#475569", textDecoration: "none", padding: "8px 20px", borderRadius: 100, border: "1.5px solid #e2e8f0" }}>← トップに戻る</a>
      </nav>

      <section style={{ paddingTop: 140, paddingBottom: 80, paddingLeft: 80, paddingRight: 80, background: "linear-gradient(160deg, #f8fafc 0%, #f1f5f9 100%)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "#6366f1", textTransform: "uppercase", marginBottom: 24 }}>Terms of Service</div>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 72px)", fontWeight: 900, letterSpacing: "-0.05em", color: "#0f172a", lineHeight: 1.0, marginBottom: 24 }}>利用規約</h1>
          <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.9 }}>
            この利用規約（以下「本規約」といいます。）は、合同会社80（以下「当社」といいます。）が提供するサービスの利用条件を定めるものです。ユーザーの皆さまには、本規約に従ってサービスをご利用いただきます。
          </p>
        </div>
      </section>

      <section style={{ padding: "80px 80px 120px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", flexDirection: "column", gap: 48 }}>
          {sections.map((s, i) => (
            <div key={i}>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", marginBottom: 16, paddingBottom: 12, borderBottom: "2px solid #f1f5f9" }}>{s.title}</h2>
              <p style={{ fontSize: 14, color: "#475569", lineHeight: 2.0, whiteSpace: "pre-line" }}>{s.body}</p>
            </div>
          ))}
          <div style={{ paddingTop: 32, borderTop: "1px solid #e2e8f0" }}>
            <p style={{ fontSize: 13, color: "#94a3b8" }}>制定日：2023年3月1日<br />最終改定日：2025年1月1日</p>
          </div>
        </div>
      </section>

      <footer style={{ background: "#0f172a", padding: "48px 80px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>© 2025 合同会社80. All rights reserved.</div>
        <div style={{ display: "flex", gap: 24 }}>
          {[["会社概要", "/company"], ["プライバシーポリシー", "/privacy"], ["サイトマップ", "/sitemap-page"]].map(([label, href]) => (
            <a key={href} href={href} style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textDecoration: "none" }}
              onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}>{label}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
