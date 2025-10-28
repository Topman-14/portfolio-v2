"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import Logo from "../ui/logo";
import { navItems, socials } from "@/config";
import NavOverlay from "./nav-overlay";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showFullNavbar = !isScrolled && !isMobile;
  const showMenuIcon = isMobile || isScrolled;

  return (
    <>
      <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="flex gap-3 items-center justify-between px-3 py-4">
          {showFullNavbar ? (
            <>
              <Logo link />
              <div className="hidden md:flex gap-3 items-center">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} className="hover:text-gray-500 transition-colors">
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="hidden md:flex gap-3 items-center">
                {socials.map((social) => (
                  <Link
                    key={social.href}
                    href={social.href}
                    className="hover:text-gray-500 transition-colors"
                  >
                    {social.name}
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="flex justify-between items-center w-full">
              <Logo link />
              {showMenuIcon && (
                <button
                  onClick={() => setIsOpen(true)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Open menu"
                >
                  <Menu size={24} />
                </button>
              )}
            </div>
          )}
        </div>
      </nav>
      <NavOverlay isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
