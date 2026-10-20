import type { Metadata } from "next";

const TITLE = "ツキジメ｜請求書が、そろって届く。取引先入力型の請求書クラウド";
const DESC =
  "バラバラの請求書を、統一フォーマットで受け取る。取引先は専用ページで入力するだけ、貴社には同じ様式のPDFが届き、支払管理・会計ソフトCSVまで自動。建設業・製造業の月締めをラクにするクラウドサービスです。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "https://www.rng-labs.com/tsukijime" },
  keywords: [
    "請求書 統一フォーマット",
    "建設業 請求書 管理",
    "出来高管理 システム",
    "請求書 受け取り クラウド",
    "下請け 請求書 電子化",
    "月締め 効率化",
  ],
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "https://www.rng-labs.com/tsukijime",
    type: "website",
    images: [{ url: "/tsukijime/hero-inbox.webp", width: 1024, height: 1024, alt: "ツキジメ｜請求書が、そろって届く。" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: ["/tsukijime/hero-inbox.webp"],
  },
};

export default function TsukijimeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
