"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import Logo from "../ui/logo";
import { navItems, socials } from "@/config";
import NavOverlay from "./nav-overlay";
import { useIsMobile } from "@/hooks/use-mobile";
import RollingText from "../animations/rolling-text";
import SocialIcons from "../ui/social-icon";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
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
      <nav className="fixed w-full top-0 z-[100] ">
        <div className="flex gap-3 items-center justify-between px-3 md:px-5 py-4 font-sans text-white">

              <Logo link color='white' height={40} width={40} />
              {/* <Logo link color='white' variant="full" height={40} width={120} /> */}

              <div className="hidden md:flex gap-8 items-center backdrop-blur-lg bg-white/10 rounded-full p-3 px-6 ">
                {navItems.map((item) => (
                  <Link 
                    key={item.href} 
                    href={item.href} 
                    className="relative overflow-hidden"
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <RollingText 
                      className="text-white "
                    >
                      {item.name}
                    </RollingText>
                  </Link>
                ))}
              </div>

              <div className="hidden md:flex gap-3 items-center">
                {socials.map((social) => (
                 
                    <SocialIcons key={social.href} link={social.href} name={social.name} />
                ))}
              </div>

        </div>
            {/* <div className="flex justify-between items-center w-full">
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
            </div> */}
      </nav>
      <NavOverlay isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
