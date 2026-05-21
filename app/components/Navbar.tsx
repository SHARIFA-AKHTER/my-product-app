/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  const verifySessionMatrix = useCallback(async () => {
    try {
    
      const res = await fetch("/api/products?myOnly=true", { method: "GET" });
      
      if (res.status === 401 || res.status === 403) {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
    } catch {

      const hasCookieToken = document.cookie
        .split(";")
        .some((item) => item.trim().startsWith("token="));
      setIsLoggedIn(hasCookieToken);
    }
  }, []);

  useEffect(() => {
   
    verifySessionMatrix();
  }, [pathname, verifySessionMatrix]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error("Authentication termination dropped");
      
      toast.success("Logged out successfully");
      setIsLoggedIn(false);
      setIsOpen(false);
      
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
      router.push("/login");
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected security error occurred");
      }
    }
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Identity */}
          <Link href="/" className="text-xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            ProductHub
          </Link>

          {/* Desktop Control Matrix */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/products" 
              className={`text-sm font-medium transition-colors ${
                pathname === "/products" || pathname === "/" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Browse Products
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link 
                  href="/dashboard" 
                  className={`text-sm font-medium transition-colors ${
                    pathname.startsWith("/dashboard") ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Drawer Trigger */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-gray-600 hover:text-gray-900 focus:outline-none cursor-pointer"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Component Render Block */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-2 shadow-inner">
          <Link 
            href="/products" 
            onClick={() => setIsOpen(false)} 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
          >
            Browse Products
          </Link>
          
          {isLoggedIn ? (
            <>
              <Link 
                href="/dashboard" 
                onClick={() => setIsOpen(false)} 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Dashboard
              </Link>
              <button 
                onClick={handleLogout} 
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                onClick={() => setIsOpen(false)} 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Login
              </Link>
              <Link 
                href="/signup" 
                onClick={() => setIsOpen(false)} 
                className="block px-3 py-2 rounded-md text-base font-medium text-center text-white bg-blue-600 hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}