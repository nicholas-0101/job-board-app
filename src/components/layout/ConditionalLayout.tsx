"use client";
import { usePathname } from "next/navigation";
import { Footer } from "../site/Footer";
import Navbar from "../site/Navbar/Navbar";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  const isDeveloperPage = pathname?.startsWith('/developer');
  const isAdminPage = pathname?.startsWith('/admin');
  
  return (
    <>
      {!isDeveloperPage && !isAdminPage && <Navbar />}
      <main className={!isDeveloperPage && !isAdminPage ? "flex-1 pt-16" : "flex-1"}>
        {children}
      </main>
      {!isDeveloperPage && !isAdminPage && <Footer />}
    </>
  );
}
