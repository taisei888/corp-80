"use client";

export default function PrivacyPage() {
  const sections = [
    {
      title: "第1条（個人情報の定義）",
      body: "本プライバシーポリシーにおける「個人情報」とは、個人情報保護法第2条第1項に定める個人情報、すなわち生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日その他の記述等により特定の個人を識別することができるもの（他の情報と容易に照合することができ、それにより特定の個人を識別することができることとなるものを含みます。）をいいます。",
    },
    {
      title: "第2条（個人情報の収集方法）",
      body: "当社は、お客様が当社サービスをご利用になる際に、氏名・住所・電話番号・メールアドレス・会社名・役職等の個人情報をお尋ねすることがあります。また、当社とお客様との間の取引に関連して、当社の提携先（情報提供元、広告主、広告配信先等を含みます。以下「提携先」といいます。）などからお客様の個人情報を収集することがあります。",
    },
    {
      title: "第3条（個人情報の利用目的）",
      body: `当社は、収集した個人情報を以下の目的のために利用いたします。

① 当社サービスの提供・運営・改善のため
② お客様からのお問い合わせ・ご相談・ご依頼への対応のため
③ サービスに関するご案内・情報提供のため
④ 新サービス・新機能の開発・研究のため
⑤ 利用規約等の変更等の通知のため
⑥ 上記の利用目的に附随する目的のため`,
    },
    {
      title: "第4条（個人情報の第三者提供）",
      body: `当社は、次に掲げる場合を除いて、あらかじめお客様の同意を得ることなく、第三者に個人情報を提供することはありません。

① 法令に基づく場合
② 人の生命・身体・財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき
③ 公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき
④ 国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき`,
    },
    {
      title: "第5条（個人情報の開示）",
      body: "当社は、本人から個人情報の開示を求められたときは、本人に対し、遅滞なくこれを開示します。ただし、開示することにより次のいずれかに該当する場合は、その全部または一部を開示しないこともあり、開示しない決定をした場合には、その旨を遅滞なく通知します。\n\n① 本人または第三者の生命・身体・財産その他の権利利益を害するおそれがある場合\n② 当社の業務の適正な実施に著しい支障を及ぼすおそれがある場合\n③ 他の法令に違反することとなる場合",
    },
    {
      title: "第6条（個人情報の訂正および削除）",
      body: "お客様は、当社の保有する自己の個人情報が誤った情報である場合には、当社が定める手続きにより、当社に対して個人情報の訂正、追加または削除（以下「訂正等」といいます。）を請求することができます。当社は、お客様から前項の請求を受けてその請求に応じる必要があると判断した場合には、遅滞なく、当該個人情報の訂正等を行います。",
    },
    {
      title: "第7条（個人情報の利用停止等）",
      body: "当社は、本人から、個人情報が、利用目的の範囲を超えて取り扱われているという理由、または不正の手段により取得されたものであるという理由により、その利用の停止または消去（以下「利用停止等」といいます。）を求められた場合には、遅滞なく必要な調査を行います。調査結果に基づき、その請求に応じる必要があると判断した場合には、遅滞なく、当該個人情報の利用停止等を行います。",
    },
    {
      title: "第8条（プライバシーポリシーの変更）",
      body: "本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて、お客様に通知することなく変更することができるものとします。当社が別途定める場合を除いて、変更後のプライバシーポリシーは、本ウェブサイトに掲載したときから効力を生じるものとします。",
    },
    {
      title: "第9条（お問い合わせ窓口）",
      body: "本ポリシーに関するお問い合わせは、下記の窓口までお願いいたします。\n\n会社名：合同会社80\n所在地：愛知県名古屋市北区楠味鋺2-914-2-2F\n電話番号：050-8896-5889\nメールアドレス：ito.t@80grp.com",
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
        <a href="/" style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", textDecoration: "none", letterSpacing: "-0.04em" }}>80</a>
        <a href="/" style={{ fontSize: 13, fontWeight: 600, color: "#475569", textDecoration: "none", padding: "8px 20px", borderRadius: 100, border: "1.5px solid #e2e8f0" }}>← トップに戻る</a>
      </nav>

      <section style={{ paddingTop: 140, paddingBottom: 80, paddingLeft: 80, paddingRight: 80, background: "linear-gradient(160deg, #f8fafc 0%, #f1f5f9 100%)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: "#6366f1", textTransform: "uppercase", marginBottom: 24 }}>Privacy Policy</div>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 72px)", fontWeight: 900, letterSpacing: "-0.05em", color: "#0f172a", lineHeight: 1.0, marginBottom: 24 }}>プライバシーポリシー</h1>
          <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.9 }}>
            合同会社80（以下「当社」）は、本ウェブサイト上で提供するサービスにおける、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシーを定めます。
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
          {[["会社概要", "/company"], ["利用規約", "/terms"], ["サイトマップ", "/sitemap-page"]].map(([label, href]) => (
            <a key={href} href={href} style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textDecoration: "none" }}
              onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}>{label}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
