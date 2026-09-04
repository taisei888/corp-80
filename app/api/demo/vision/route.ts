import { NextRequest, NextResponse } from "next/server";

// DONAの体験デモ：画像（レシート・名刺・手書きメモ等）を読み取って構造化
export async function POST(req: NextRequest) {
  const { image } = (await req.json().catch(() => ({}))) as { image?: string };
  if (!image || !image.startsWith("data:image/") || image.length > 6_000_000) {
    return NextResponse.json({ error: "画像を読み込めませんでした" }, { status: 400 });
  }
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "not configured" }, { status: 500 });

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 500,
        messages: [
          {
            role: "system",
            content: `画像を読み取り、次のJSONだけを返す（コードブロック禁止）:
{"type":"レシート|名刺|請求書|手書きメモ|その他のいずれか","title":"何の画像かの短い説明","fields":[{"label":"項目名","value":"読み取った値"}],"comment":"ドーナツ型キャラ『DONA』としての一言（かわいく短く、です・ます調）"}
fieldsは重要な項目を最大8個。レシートなら店名/日付/合計/主な品目、名刺なら会社/氏名/役職/電話/メール等。読み取れない場合はfieldsを空にしてcommentで丁寧に伝える。個人情報はそのまま返してよい（本人がアップした画像のため）。`,
          },
          {
            role: "user",
            content: [
              { type: "text", text: "この画像を読み取ってください。" },
              { type: "image_url", image_url: { url: image, detail: "high" } },
            ],
          },
        ],
      }),
    });
    const json = await res.json();
    if (!res.ok) return NextResponse.json({ error: "AI読み取りに失敗しました" }, { status: 502 });
    const raw: string = json.choices?.[0]?.message?.content ?? "{}";
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "読み取り結果の解析に失敗しました" }, { status: 500 });
  }
}
