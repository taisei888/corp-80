import type { Metadata } from "next";

const TITLE = "ツキジメ｜請求書が、そろって届く。取引先入力型の請求書クラウド";
const DESC =
  "バラバラの請求書を、統一フォーマットで受け取る。取引先は専用ページで入力するだけ、貴社には同じ様式のPDFが届き、支払管理・会計ソフトCSVまで自動。建設業・製造業の月締めをラクにするクラウドサービスです。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "https://www.rng-labs.com/tsukijime" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "https://www.rng-labs.com/tsukijime",
    type: "website",
  },
};

export default function TsukijimeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
