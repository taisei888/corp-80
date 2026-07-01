import { NextResponse } from "next/server";

export async function GET() {
  const url = `https://news.google.com/rss/search?q=AI+%E4%BA%BA%E5%B7%A5%E7%9F%A5%E8%83%BD+%E3%83%86%E3%82%AF%E3%83%8E%E3%83%AD%E3%82%B8%E3%83%BC&hl=ja&gl=JP&ceid=JP:ja`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; NewsBot/1.0)" },
    });

    if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`);

    const xml = await res.text();
    const items: Array<{ title: string; link: string; pubDate: string; source: string }> = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRegex.exec(xml)) !== null && items.length < 5) {
      const block = match[1];
      const rawTitle =
        (block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) ||
          block.match(/<title>(.*?)<\/title>/))?.[1] || "";
      const link =
        (block.match(/<link>(.*?)<\/link>/) ||
          block.match(/<link\/>\s*(https?:\/\/\S+)/))?.[1] || "";
      const pubDate = block.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";
      const source = block.match(/<source[^>]*>(.*?)<\/source>/)?.[1] || "";

      if (rawTitle) {
        const title = source
          ? rawTitle.replace(
              new RegExp(
                `\\s*[-–—]\\s*${source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`
              ),
              ""
            )
          : rawTitle;
        items.push({ title: title || rawTitle, link, pubDate, source });
      }
    }

    return NextResponse.json({ items });
  } catch (e) {
    console.error("News fetch error:", e);
    return NextResponse.json(
      { items: [], error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
