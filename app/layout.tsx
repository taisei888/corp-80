import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// Google広告・GA4の計測タグ（環境変数があるときだけ出力）
const GTAG_ID = process.env.NEXT_PUBLIC_GTAG_ID; // 例: AW-XXXXXXXXXX または G-XXXXXXX

const noto = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "800", "900"],
  display: "swap",
});

const SITE_TITLE = "合同会社80｜名古屋のAIエージェント開発・業務自動化";
const SITE_DESC =
  "名古屋のAI開発会社・合同会社80。中小企業向けに、AIエージェントによる業務自動化（請求書処理・電話応対・議事録・予約管理）、Webサイト制作、自社SaaSの開発・運用を手がけています。";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.rng-labs.com"),
  title: {
    default: SITE_TITLE,
    template: "%s | 合同会社80",
  },
  description: SITE_DESC,
  keywords: [
    "名古屋 AI開発",
    "AIエージェント 開発",
    "業務自動化 AI",
    "中小企業 AI導入",
    "合同会社80",
    "愛知 システム開発",
  ],
  alternates: { canonical: "https://www.rng-labs.com" },
  icons: {
    icon: "/logo-square.png",
    apple: "/logo-square.png",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "合同会社80",
    title: SITE_TITLE,
    description: SITE_DESC,
    images: [{ url: "/logo-square.png", width: 512, height: 512, alt: "合同会社80" }],
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESC,
  },
  robots: { index: true, follow: true },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "合同会社80",
  alternateName: ["RNG Lab", "AI Labs（合同会社80）"],
  url: "https://www.rng-labs.com",
  logo: "https://www.rng-labs.com/logo-square.png",
  description: SITE_DESC,
  address: {
    "@type": "PostalAddress",
    addressRegion: "愛知県",
    addressLocality: "名古屋市北区",
    streetAddress: "楠味鋺2-914-2 2F",
    addressCountry: "JP",
  },
  telephone: "+81-50-8896-5889",
  email: "ito.t@80grp.com",
  founder: { "@type": "Person", name: "伊藤大世" },
  foundingDate: "2023-03",
  areaServed: "JP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={noto.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {children}
        {GTAG_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GTAG_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
