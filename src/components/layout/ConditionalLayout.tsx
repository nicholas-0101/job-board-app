"use client";
import { usePathname } from "next/navigation";
import { Footer } from "../site/Footer";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Check if current path is developer page
  const isDeveloperPage = pathname?.startsWith('/developer');
  
  return (
    <>
      <main className={isDeveloperPage ? "flex-1" : "flex-1 pt-16"}>
        {children}
      </main>
      {!isDeveloperPage && <Footer />}
    </>
  );
}
