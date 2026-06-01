import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "合同会社80 | システム開発・人材紹介・AIソリューション",
  description: "合同会社80はオーダーメイドのシステム開発（ホームページ・アプリ）、人材紹介業、LENDS AIを提供するテクノロジーカンパニーです。愛知県名古屋市拠点。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
