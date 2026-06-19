import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URLが空です" }, { status: 400 });
    }

    // Fetch the page HTML
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "ja,en;q=0.9",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return NextResponse.json({ error: `ページの取得に失敗しました (${res.status})` }, { status: 400 });
    }

    const html = await res.text();

    // Strip scripts, styles, and extract text content
    const textContent = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[\s\S]*?<\/nav>/gi, "")
      .replace(/<footer[\s\S]*?<\/footer>/gi, "")
      .replace(/<header[\s\S]*?<\/header>/gi, "")
      .replace(/<[^>]+>/g, "\n")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&#?\w+;/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
      .slice(0, 8000); // Limit to avoid token overflow

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `あなたは企業のホームページから会社情報を抽出するアシスタントです。
以下のWebページのテキストから、会社情報を読み取ってJSON形式で返してください。

出力するJSON:
{
  "company": "会社名",
  "industry": "業種（飲食業、製造業、IT、不動産など簡潔に）",
  "employees": "従業員数（わかれば）",
  "locations": "店舗数・拠点数（わかれば）",
  "current_tools": "使っていそうなツール（推測でOK）",
  "summary": "この会社の概要を2〜3行で"
}

わからない項目は空文字""にしてください。推測できる場合は「推定: 〜」と書いてください。
必ずJSON形式のみを返してください。マークダウンのコードブロックは不要です。`
        },
        {
          role: "user",
          content: `URL: ${url}\n\n以下はこのページのテキスト内容です:\n\n${textContent}`
        }
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content ?? "";

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "会社情報の解析に失敗しました" }, { status: 500 });
    }

    const info = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ info });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "不明なエラー";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
