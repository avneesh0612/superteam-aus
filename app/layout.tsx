import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Superteam Australia",
    template: "%s | Superteam Australia",
  },
  description: "The home of Solana builders in Australia. Discover members, events, opportunities, and ecosystem updates.",
  openGraph: {
    title: "Superteam Australia",
    description: "The home of Solana builders in Australia.",
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Superteam Australia",
    description: "The home of Solana builders in Australia.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script src="https://platform.twitter.com/widgets.js" strategy="lazyOnload" />
        {process.env.NODE_ENV !== "production" ? (
          <Script src="https://mcp.figma.com/mcp/html-to-design/capture.js" strategy="lazyOnload" />
        ) : null}
      </body>
    </html>
  );
}
