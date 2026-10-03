import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StoreForge — AI Store Generator (POC)",
  description:
    "Proof of concept: an AI e-commerce store generator. Blueprint -> renderer -> website.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
