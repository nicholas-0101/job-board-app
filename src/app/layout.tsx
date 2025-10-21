import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import ConditionalLayout from "../components/layout/ConditionalLayout";
import "../utils/suppressConsoleErrors"; // Suppress preselection 404 console errors

export const metadata: Metadata = {
  title: "workoo",
  description: "Seek your next move",
  icons: { 
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico"
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <Script
          src="/suppress-errors.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://apis.google.com/js/platform.js"
          strategy="lazyOnload"
        />
      </head>
      <body
        suppressHydrationWarning
        className="antialiased min-h-screen bg-background text-foreground flex flex-col font-sans"
      >
        <ConditionalLayout>{children}</ConditionalLayout>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  );
}
