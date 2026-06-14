import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { company, name, email, phone, message } = await req.json();

  const { error } = await resend.emails.send({
    from: "I.RI.N.G Group お問い合わせ <onboarding@resend.dev>",
    to: "ito.t@80grp.com",
    replyTo: email,
    subject: `【お問い合わせ】${company} / ${name}`,
    html: `
      <h2 style="color:#1e1b4b">I.RI.N.G Group — お問い合わせが届きました</h2>
      <table style="border-collapse:collapse;width:100%;max-width:600px;font-size:14px">
        <tr><td style="padding:10px 14px;background:#f5f3ff;font-weight:bold;width:140px;border-bottom:1px solid #ede9fe">会社名</td><td style="padding:10px 14px;border-bottom:1px solid #ede9fe">${company}</td></tr>
        <tr><td style="padding:10px 14px;background:#f5f3ff;font-weight:bold;border-bottom:1px solid #ede9fe">お名前</td><td style="padding:10px 14px;border-bottom:1px solid #ede9fe">${name}</td></tr>
        <tr><td style="padding:10px 14px;background:#f5f3ff;font-weight:bold;border-bottom:1px solid #ede9fe">メール</td><td style="padding:10px 14px;border-bottom:1px solid #ede9fe"><a href="mailto:${email}">${email}</a></td></tr>
        <tr><td style="padding:10px 14px;background:#f5f3ff;font-weight:bold;border-bottom:1px solid #ede9fe">電話番号</td><td style="padding:10px 14px;border-bottom:1px solid #ede9fe">${phone || "未入力"}</td></tr>
        <tr><td style="padding:10px 14px;background:#f5f3ff;font-weight:bold">お問い合わせ内容</td><td style="padding:10px 14px;white-space:pre-wrap">${message || "なし"}</td></tr>
      </table>
    `,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
