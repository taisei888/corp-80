import OpenAI from "openai";
import fs from "node:fs";

const client = new OpenAI();
const LINES = [
  "え、電話にも出てくれるの？",
  "え、領収書の山も、全部？",
  "はい。AIエージェントなら、できます。",
  "御社の業務も診断します。合同会社エイティ、無料相談受付中。",
];
const INSTRUCTIONS = "日本人女性のテレビアナウンサーのようなCMナレーション。高めの明るい声で、滑舌よく、上品にハキハキと。1〜2行目は驚いた様子で、3行目は自信を持って頼もしく、4行目は締めのアナウンスらしく読んでください。";

for (let i = 0; i < LINES.length; i++) {
  const res = await client.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: "sage",
    input: LINES[i],
    instructions: INSTRUCTIONS,
    response_format: "mp3",
  });
  fs.writeFileSync(`public/cm/voice${i + 1}.mp3`, Buffer.from(await res.arrayBuffer()));
  console.log(`voice${i + 1}.mp3 ok`);
}
