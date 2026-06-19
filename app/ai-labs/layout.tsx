import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Labs — AI導入支援・受託開発",
  description: "LLM・RAG・業務自動化を軸としたAIシステムをオーダーメイドで開発。戦略策定から実装・定着まで一気通貫でサポートします。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
