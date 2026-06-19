import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "合同会社80へのお問い合わせはこちらから。サービスに関するご質問・ご相談・お見積もりなどお気軽にご連絡ください。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
