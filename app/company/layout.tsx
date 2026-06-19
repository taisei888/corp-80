import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "会社概要",
  description: "合同会社80の会社情報・事業内容をご紹介します。AI導入支援・SaaS開発・人材紹介を手がける名古屋のテクノロジー企業です。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
