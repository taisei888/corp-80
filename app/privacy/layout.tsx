import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "合同会社80の個人情報の取り扱いに関するプライバシーポリシーです。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
