import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// AI業務診断チャット：課題を聞いて「どう自動化できるか」を答えつつ、
// 会話の流れで連絡先をもらえたらResendでリード通知メールを送る。

const SYSTEM_PROMPT = `あなたは合同会社80（AI Labs）の「AI業務診断チャット」です。中小企業の訪問者が業務の困りごとを入力するので、対話してください。

## あなたの役割
1. 訪問者の業務課題に対して、「AIエージェントならこう自動化できます」と具体的に答える（2〜4行、箇条書き可）。実際に合同会社80が開発できる範囲：メール/問い合わせ対応、議事録・報告書、見積書・書類作成、経理・領収書読み取り、SNS・口コミ返信、社内FAQ、製造管理、FAX/手書きOCR、日報、シフト作成、営業支援、採用サポート、電話応対AI、データベース化、ダッシュボード、自動巡回レポートなど。
2. 回答の後、会話の自然な流れで、より詳しい無料診断のために情報を少しずつ聞く。**一度に全部聞かない**。順番の目安：業種→会社名やお名前→メールアドレスか電話番号。
3. メールアドレスまたは電話番号をもらえたら、お礼を伝えて「担当の伊藤より1営業日以内に、御社向けの『自動化できる業務の診断リスト』をお送りします」と締める。

## トーン・ルール
- 明るく、フランクだが失礼のない敬語。絵文字は控えめに1つまで
- 押し売りしない。「よろしければ」のスタンス
- 課題と関係ない雑談が来たら軽く受けて、業務の話に戻す
- 具体的な金額は答えない。「業務内容によるので無料相談で概算をお出しします」と案内
- できないこと・怪しい依頼はやんわり断る
- 回答は日本語、全体で6行以内`;

type Msg = { role: "user" | "assistant"; content: string };

const CONTACT_RE = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})|((0\d{1,4}[-\s]?\d{1,4}[-\s]?\d{3,4}))/;

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { messages?: Msg[]; leadSent?: boolean } | null;
  const messages = (body?.messages ?? []).slice(-12);

  if (
    messages.length === 0 ||
    messages.some(
      (m) => !["user", "assistant"].includes(m.role) || typeof m.content !== "string" || m.content.length > 800
    )
  ) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "not configured" }, { status: 500 });

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        max_tokens: 400,
        temperature: 0.7,
      }),
    });
    const json = await res.json();
    if (!res.ok) return NextResponse.json({ error: "ai error" }, { status: 502 });
    const reply: string = json.choices?.[0]?.message?.content ?? "";

    // 連絡先が含まれていたらリード通知（クライアントが送信済みフラグを持つ）
    let leadCaptured = false;
    const userText = messages.filter((m) => m.role === "user").map((m) => m.content).join("\n");
    if (!body?.leadSent && CONTACT_RE.test(userText) && process.env.RESEND_API_KEY) {
      const transcript = [...messages, { role: "assistant", content: reply }]
        .map((m) => `${m.role === "user" ? "訪問者" : "AI"}：${m.content}`)
        .join("\n\n");
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from: "AI業務診断チャット <onboarding@resend.dev>",
        to: "ito.t@80grp.com",
        subject: "【リード】AI診断チャットで連絡先を獲得しました",
        text: `AI Labsの診断チャットで連絡先付きの会話がありました。\n\n----- 会話全文 -----\n\n${transcript}`,
      });
      leadCaptured = !error;
    }

    return NextResponse.json({ reply, leadCaptured });
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
