import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "quix — 社内AIナレッジ検索",
  description: "チャット形式で社内FAQ・規程・マニュアルを瞬時に回答。AIが蓄積された知識を自動整理し、問い合わせ工数を大幅削減するSaaSプロダクトです。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
