import type { Metadata } from "next";

import "@/app/globals.css";
import Providers from "@/app/providers";

export const metadata: Metadata = {
  title: "LiveDocs",
  description:
    "A decentralized, real-time collaborative document editor designed to enable seamless and efficient collaboration without reliance on centralized servers.",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
