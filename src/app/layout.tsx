import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/Theme/ThemeProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AsuoSafi — Community Water Safety & Mining Concession Ledger",
  description: "A decentralized, offline-first civic trust ledger tracking water purity and illegal galamsey mining buffer violations across Ghana and Africa.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  keywords: ["AsuoSafi", "Galamsey", "Water Safety", "Ghana", "Open Society Foundations", "OSF Hackathon", "Civic Tech", "Clean Water"],
};

export const viewport: Viewport = {
  themeColor: "#1a73e8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className={`${plusJakartaSans.variable} min-h-full flex flex-col font-sans antialiased bg-[#f8f9fa] dark:bg-[#141414] text-[#1f2124] dark:text-white transition-colors duration-150`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
