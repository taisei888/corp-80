import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約",
  description: "合同会社80が提供するサービスの利用規約です。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
