import { NextRequest, NextResponse } from "next/server";

// POSTの体験デモ：お題からビジネスメールを生成
export async function POST(req: NextRequest) {
  const { topic, detail } = (await req.json().catch(() => ({}))) as { topic?: string; detail?: string };
  if (!topic || topic.length > 100 || (detail && detail.length > 300)) {
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
        max_tokens: 420,
        messages: [
          {
            role: "system",
            content: "あなたは中小企業の実務に強いビジネスメールの名手AI『POST』。指定されたお題に対して、そのまま送れる自然で丁寧な日本語のビジネスメールを書く。件名から書き始める（形式：件名：〜、本文）。社名や個人名は「◯◯株式会社」「◯◯様」のようにプレースホルダーにする。過度にかしこまりすぎず、感じの良い実務的なトーン。250字以内。",
          },
          { role: "user", content: `お題：${topic}${detail ? `\n補足：${detail}` : ""}` },
        ],
      }),
    });
    const json = await res.json();
    if (!res.ok) return NextResponse.json({ error: "生成に失敗しました" }, { status: 502 });
    return NextResponse.json({ mail: json.choices?.[0]?.message?.content ?? "" });
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
