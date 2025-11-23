// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

// Wallet Adapter UI styles (must be imported globally)
import "@solana/wallet-adapter-react-ui/styles.css";

import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "SOLPHYGITAL",
  description: "Tap an NFC chip. Hear the song. Own it forever — with card or crypto.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Essential mobile meta tags */}
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />

        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* iOS Icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
      </head>

      <body className="bg-black text-white antialiased min-h-screen overscroll-none">
        {/* Crossmint Pay SDK — loads safely globally */}
        <script src="https://embed.crossmint.com/latest/sdk.js" async />

        {/* Solana + Wallet + Theme Providers */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}