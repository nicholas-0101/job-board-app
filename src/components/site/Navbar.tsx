"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, UserPlus, Menu, X, User, Settings, LogOut } from "lucide-react";
import { useState } from "react";
import { NotificationBell } from "../ui/NotificationBell";
import { motion, AnimatePresence } from "framer-motion";

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
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          ProHire
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((it) => (
            <Link 
              key={it.href} 
              href={it.href} 
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                pathname === it.href ? "text-blue-600" : "text-gray-600"
              }`}
            >
              {it.label}
            </Link>
          ))}
        </nav>
        
        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <NotificationBell />
          
          <div className="h-8 w-px bg-gray-200" />
          
          <Link 
            href="/signin" 
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
          >
            <LogIn className="w-4 h-4" /> 
            Login
          </Link>
          <Link 
            href="/signup" 
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all hover:scale-105"
          >
            <UserPlus className="w-4 h-4" /> 
            Register
          </Link>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t bg-white/95 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navItems.map((it) => (
              <Link 
                key={it.href} 
                href={it.href} 
                className={`block text-sm font-medium transition-colors hover:text-blue-600 ${
                  pathname === it.href ? "text-blue-600" : "text-gray-600"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {it.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t">
              <Link 
                href="/signin" 
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 text-gray-700"
                onClick={() => setIsOpen(false)}
              >
                <LogIn className="w-4 h-4" /> 
                Login
              </Link>
              <Link 
                href="/signup" 
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                onClick={() => setIsOpen(false)}
              >
                <UserPlus className="w-4 h-4" /> 
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
