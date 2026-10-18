import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "モシモシAI｜飲食店・受付の電話に、AIが出ます",
  description:
    "営業中も、仕込み中も、閉店後も。飲食店・クリニック・サロンの電話応対をAIが24時間代行する電話自動応対サービス「モシモシAI」。予約受付・よくある質問への応対・LINE通知まで。名古屋のAI開発会社・合同会社80が提供します。",
  keywords: ["飲食店 電話 自動応対", "AI 電話 予約受付", "電話代行 AI", "受付 自動化"],
  alternates: { canonical: "https://www.rng-labs.com/moshimoshi" },
  openGraph: {
    title: "モシモシAI｜お店の電話、AIが出ます",
    description: "飲食店・受付向けのAI電話自動応対サービス。24時間365日、予約も問い合わせもおまかせ。",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
