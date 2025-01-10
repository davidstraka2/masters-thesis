import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SuperTokensProvider } from "./components/supertokensProvider";
import "./globals.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: `%s | ${process.env.APP_NAME ?? "Booking Client App"}`,
    default: process.env.APP_NAME ?? "Booking Client App",
  },
  description:
    process.env.DESCRIPTION ?? "A prototype booking client application",
  keywords: process.env.KEYWORDS ?? [
    "Booking Client App",
    "booking client",
    "decentralized reservation system",
    "David Straka thesis",
    "booking",
    "reservation",
    "appointment",
    "scheduling",
  ],
  authors: {
    name: process.env.AUTHOR ?? "David Straka",
    url: process.env.AUTHOR_URL ?? "https://davidstraka.dev",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
  applicationName: process.env.APP_NAME ?? "Booking Client App",
  appleWebApp: {
    title: process.env.APP_NAME ?? "Booking Client App",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <SuperTokensProvider>
        <body className={inter.className}>{children}</body>
      </SuperTokensProvider>
    </html>
  );
}
