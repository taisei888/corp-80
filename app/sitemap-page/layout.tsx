import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "サイトマップ",
  description: "合同会社80公式サイトの全ページ一覧です。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
