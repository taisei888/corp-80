import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  if (!message || typeof message !== "string" || message.length > 500) {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const systemPrompt = `あなたは合同会社80（AI Labs）のAIアシスタントです。
企業の業務課題について相談を受け、AIやデジタル化による解決策を簡潔に提案してください。

回答ルール：
- 3〜5行程度で簡潔に回答
- 具体的な解決策を1〜2個提示
- 最後に「詳しくはぜひ無料相談で」のような軽い誘導を入れる
- 丁寧語で、押し売り感なく
- 合同会社80のサービス（製造管理AI、日報生成AI、営業支援AI、書類作成AI、社内FAQ AI、問い合わせ対応AI、採用サポートAI、データ分析ダッシュボード）に紐づけて回答
- 回答は日本語で`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("OpenAI API error:", err);
      return NextResponse.json({ error: "AI service error" }, { status: 502 });
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content ?? "申し訳ございません。回答の生成に失敗しました。";

    return NextResponse.json({ reply });
  } catch (e) {
    console.error("AI chat error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
