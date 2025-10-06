"use client";
import { usePathname } from "next/navigation";
import { Footer } from "../site/Footer";
import Navbar from "../site/Navbar/Navbar";
import { UserGuard } from "../auth/UserGuard";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  const isDeveloperPage = pathname?.startsWith('/developer');
  const isAdminPage = pathname?.startsWith('/admin');
  const isAuthPage = pathname?.startsWith('/auth');
  const isProfilePage = pathname?.startsWith('/profile');
  
  // Public pages or pages that handle their own auth (profile has UserGuard internally)
  const isPublicPage = isAdminPage || isDeveloperPage || isAuthPage || isProfilePage;
  
  return (
    <>
      {!isDeveloperPage && !isAdminPage && <Navbar />}
      <main className={!isDeveloperPage && !isAdminPage ? "flex-1 pt-16" : "flex-1"}>
        {!isPublicPage ? (
          <UserGuard>{children}</UserGuard>
        ) : (
          children
        )}
      </main>
      {!isDeveloperPage && !isAdminPage && <Footer />}
    </>
  );
}
