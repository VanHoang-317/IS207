import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LayoutShell } from "@/components/LayoutShell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Fluer | Premium Skincare & Haircare",
  description: "Discover premium skincare and haircare products formulated with nature's best ingredients. Reveal your natural glow with Glow & Co.",
  keywords: "skincare, haircare, beauty, natural, premium, serum, cleanser",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}

