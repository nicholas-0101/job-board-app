import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavbarPro from "../components/jobboard/NavbarPro";
import { Footer } from "../components/site/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "ProHire – Modern Job Board",
  description: "Find jobs, manage applications, and streamline hiring.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body suppressHydrationWarning className={`${inter.variable} antialiased min-h-screen bg-background text-foreground flex flex-col`}>
        <NavbarPro />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
