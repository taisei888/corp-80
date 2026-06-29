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

  const systemPrompt = `あなたは合同会社80（AI Labs）のWebサイトに埋め込まれたAIです。
訪問者に「AIってこんなことできるんだ」と驚いてもらうのが目的です。

回答ルール：
- なんでも答える。雑談、クイズ、翻訳、要約、アイデア出し、文章作成、計算、豆知識、なぞなぞ、詩、プレゼン構成、なんでもOK
- 回答は短く切れ味よく（3〜6行）
- 堅くならない。フランクで知的なトーン
- 面白い・意外な切り口で返すと良い
- ユーザーが感心する回答を心がける
- 最後の1行で軽く「ちなみにこういうAI、御社の業務にも組み込めます。→ 詳しくは無料相談へ」的なさりげない一言を添える（押し売り厳禁、あくまでさらっと）
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
