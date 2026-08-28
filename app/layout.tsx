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

export const metadata: Metadata = {
  metadataBase: new URL("https://rng-labs.com"),
  title: {
    default: "合同会社80 | 人の知覚を、ソフトウェアで拡張する。",
    template: "%s | 合同会社80",
  },
  description:
    "LENDS AIをはじめとする自社SaaS開発、AI受託開発、HP制作デザインを手がける合同会社80の公式サイトです。",
  icons: {
    icon: "/7.png",
    apple: "/7.png",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "合同会社80",
    title: "合同会社80 | 人の知覚を、ソフトウェアで拡張する。",
    description: "LENDS AIをはじめとする自社SaaS開発、AI受託開発、HP制作デザインを手がける合同会社80の公式サイトです。",
    images: [{ url: "/7.png", width: 512, height: 512, alt: "合同会社80" }],
  },
  twitter: {
    card: "summary",
    title: "合同会社80 | 人の知覚を、ソフトウェアで拡張する。",
    description: "LENDS AIをはじめとする自社SaaS開発、AI受託開発、HP制作デザインを手がける合同会社80の公式サイトです。",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={noto.className}>
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
