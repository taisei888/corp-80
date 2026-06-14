import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const noto = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "株式会社I.RI.N.G Group | 人の知覚を、ソフトウェアで拡張する。",
  description:
    "LENDS AIをはじめとする自社SaaS開発、AI受託開発、HP制作デザインを手がける株式会社I.RI.N.G Groupの公式サイトです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={noto.className}>{children}</body>
    </html>
  );
}
