"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, UserPlus, Menu, X, User, Settings, LogOut } from "lucide-react";
import { useState } from "react";
import { NotificationBell } from "../ui/NotificationBell";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/explore/jobs", label: "Jobs" },
  { href: "/explore/companies", label: "Companies" },
  { href: "/subscription", label: "Subscription" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-2xl bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          ProHire
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((it) => (
            <Link 
              key={it.href} 
              href={it.href} 
              className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                pathname === it.href ? "text-primary-600" : "text-muted-foreground"
              }`}
            >
              {it.label}
            </Link>
          ))}
        </nav>
        
        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <NotificationBell />
          
          <div className="h-8 w-px bg-border" />
          
          <Link href="/signin">
            <Button variant="outline" className="rounded-xl">
              <LogIn className="w-4 h-4" />
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:shadow-lg">
              <UserPlus className="w-4 h-4" />
              Register
            </Button>
          </Link>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-lg hover:bg-accent"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navItems.map((it) => (
              <Link 
                key={it.href} 
                href={it.href} 
                className={`block text-sm font-medium transition-colors hover:text-primary-600 ${
                  pathname === it.href ? "text-primary-600" : "text-muted-foreground"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {it.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t">
              <Link href="/signin" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full rounded-xl justify-center">
                  <LogIn className="w-4 h-4" />
                  Login
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setIsOpen(false)}>
                <Button className="w-full rounded-xl justify-center bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
                  <UserPlus className="w-4 h-4" />
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
