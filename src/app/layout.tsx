import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/Theme/ThemeProvider";

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
  themeColor: "#15803d",
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
      <body className="min-h-full flex flex-col font-sans antialiased bg-[#F8FAFC] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 transition-colors duration-150">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
