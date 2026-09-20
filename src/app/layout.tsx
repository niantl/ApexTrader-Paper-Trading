import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TradingProvider } from "@/store/TradingContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "ApexTrader | Pro Paper Trading Platform",
  description: "High-fidelity paper trading platform and stock market dashboard featuring live simulated execution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        suppressHydrationWarning
        className={`${inter.variable} font-sans antialiased bg-[#0B0E14] text-slate-200 selection:bg-indigo-500/30`}
      >
        <TradingProvider>
          {children}
        </TradingProvider>
      </body>
    </html>
  );
}
