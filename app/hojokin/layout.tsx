import type { Metadata } from "next";

const TITLE = "補助金対応のシステム開発・AI開発｜省力化投資補助金の活用支援";
const DESC =
  "省力化投資補助金・ものづくり補助金などを活用したAI・業務システム開発。申請に必要な開発見積・要件整理を48時間以内に無償提出、採択後の実装まで名古屋の開発会社・合同会社80が伴走します。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "https://www.rng-labs.com/hojokin" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "https://www.rng-labs.com/hojokin",
    type: "website",
  },
};

export default function HojokinLayout({ children }: { children: React.ReactNode }) {
  return children;
}
