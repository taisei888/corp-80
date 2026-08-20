import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Labs — AIエージェント開発・業務自動化",
  description: "答えるAIから、仕事をやり切るAIエージェントへ。メール対応・経理・電話応対まで、御社の業務に合わせたAIエージェントをオーダーメイドで開発します。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
