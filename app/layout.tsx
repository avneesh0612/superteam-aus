import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "Superteam Australia",
    template: "%s | Superteam Australia",
  },
  description:
    "The home of builders in Australia. Discover members, events, opportunities, and ecosystem updates.",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "Superteam Australia",
    "Solana Australia",
    "Web3 community",
    "crypto builders",
    "startup community",
    "builders network",
  ],
  openGraph: {
    title: "Superteam Australia",
    description:
      "The home of builders in Australia. Discover members, events, opportunities, and ecosystem updates.",
    type: "website",
    locale: "en_AU",
    url: "/",
    siteName: "Superteam Australia",
    images: [
      {
        url: "/logo-mark.svg",
        alt: "Superteam Australia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Superteam Australia",
    description:
      "The home of builders in Australia. Discover members, events, opportunities, and ecosystem updates.",
    images: ["/logo-mark.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "technology",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src="https://platform.twitter.com/widgets.js"
          strategy="lazyOnload"
        />
        {process.env.NODE_ENV !== "production" ? (
          <Script
            src="https://mcp.figma.com/mcp/html-to-design/capture.js"
            strategy="lazyOnload"
          />
        ) : null}
      </body>
    </html>
  );
}
