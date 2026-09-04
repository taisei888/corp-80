import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Labs — 御社専用のAIエージェント開発",
  description: "メール対応・電話・経理・シフト作成まで、御社の業務に合わせて育てたAIエージェントのチームが最後まで実行。中小企業のためのAI導入を、月数万円台から。愛知・名古屋の合同会社80。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
