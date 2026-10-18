import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AIエージェント開発・業務自動化のAIラボ｜名古屋の合同会社80",
  description:
    "貴社専用のAIエージェントをオーダーメイド開発。メール返信・議事録・電話応対・経費処理・シフト作成などの業務自動化を、月額数万円台から。名古屋のAI開発会社・合同会社80が設計から運用まで伴走します。無料のAI業務診断チャットつき。",
  keywords: [
    "AIエージェント 開発",
    "業務自動化 AI",
    "AI 受託開発 名古屋",
    "中小企業 AI導入",
    "議事録 AI",
    "AI チャットボット 導入",
  ],
  alternates: { canonical: "https://www.rng-labs.com/ai-labs" },
  openGraph: {
    type: "website",
    title: "貴社専用の、AIエージェント。｜AIラボ - 合同会社80",
    description: "毎日の「めんどうな仕事」を、貴社の業務に合わせて育てたAIチームが最後まで実行。月額数万円台から、2〜4週間で導入。",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
