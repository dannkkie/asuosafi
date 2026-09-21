import type { Metadata, Viewport } from "next";
import "./globals.css";

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
  themeColor: "#059669",
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
    <html lang="en" className="h-full bg-slate-950 text-slate-100">
      <body className="min-h-full flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
