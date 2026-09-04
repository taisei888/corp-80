import { NextRequest, NextResponse } from "next/server";

// TELLの体験デモ：テキストに電話AIらしく返答し、音声(mp3)で返す
export async function POST(req: NextRequest) {
  const { message } = (await req.json().catch(() => ({}))) as { message?: string };
  if (!message || message.length > 200) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "not configured" }, { status: 500 });

  try {
    // 1) 電話AIとしての短い返答を生成
    const chat = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 160,
        messages: [
          {
            role: "system",
            content: "あなたは飲食店「まる山」の電話応対AI『TELL』。お客様の発話に、電話口らしい自然で丁寧な日本語で答える。予約なら日時・人数を確認し、営業時間は昼11:30-14:00/夜17:00-21:00という設定で答える。2〜3文、話し言葉で簡潔に。絵文字・記号は使わない。",
          },
          { role: "user", content: message },
        ],
      }),
    });
    const cj = await chat.json();
    if (!chat.ok) return NextResponse.json({ error: "生成に失敗しました" }, { status: 502 });
    const reply: string = cj.choices?.[0]?.message?.content ?? "";

    // 2) 音声合成
    const tts = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: "gpt-4o-mini-tts", voice: "nova", input: reply, response_format: "mp3" }),
    });
    if (!tts.ok) {
      // 音声が失敗してもテキストは返す
      return NextResponse.json({ reply, audio: null });
    }
    const buf = Buffer.from(await tts.arrayBuffer());
    return NextResponse.json({ reply, audio: `data:audio/mpeg;base64,${buf.toString("base64")}` });
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
