"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Logo from "../ui/logo";
import { navItems, socials } from "@/config";
import Link from "next/link";
import { X } from "lucide-react";

const GRID_COLS = 10;
const GRID_ROWS = 10;

interface NavOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NavOverlay({ isOpen, onClose }: NavOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const squares = Array.from({ length: GRID_COLS * GRID_ROWS }, (_, i) => (
    <div key={i} className="square w-full h-full bg-black" />
  ));

  useGSAP(() => {
    if (!overlayRef.current) return;

    if (isOpen) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0, display: "block" },
        {
          opacity: 1,
          duration: 0.5,
          ease: "power2.inOut",
        }
      );

      const squares = overlayRef.current.querySelectorAll(".square");
      gsap.fromTo(
        squares,
        { opacity: 1 },
        {
          duration: 0.5,
          opacity: 0,
          ease: "sine",
          stagger: {
            grid: [GRID_ROWS, GRID_COLS],
            from: "start",
            amount: 0.3,
          },
        }
      );
    } else {
      const squares = overlayRef.current.querySelectorAll(".square");
      gsap.fromTo(
        squares,
        { opacity: 0 },
        {
          duration: 0.3,
          opacity: 1,
          ease: "sine",
          stagger: {
            grid: [GRID_ROWS, GRID_COLS],
            from: "end",
            amount: 0.3,
          },
          onComplete: () => {
            gsap.to(overlayRef.current, {
              opacity: 0,
              duration: 0.3,
              ease: "power2.inOut",
              onComplete: () => {
                if (overlayRef.current) overlayRef.current.style.display = "none";
              },
            });
          },
        }
      );
    }
  }, { scope: overlayRef, dependencies: [isOpen] });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] bg-white flex items-center justify-center"
    >
      <div className="grid grid-cols-10 h-full w-full absolute inset-0">{squares}</div>
      
      <div className="relative z-10 w-full max-w-6xl px-6">
        <div className="flex justify-end mb-12">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close menu"
          >
            <X size={32} />
          </button>
        </div>

        <nav className="flex flex-col gap-8">
          <div className="mb-8">
            <Logo link color="black" />
          </div>

          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="text-4xl md:text-5xl font-semibold hover:text-gray-500 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex gap-6 mt-8">
            {socials.map((social) => (
              <Link
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg hover:text-gray-500 transition-colors"
              >
                {social.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
