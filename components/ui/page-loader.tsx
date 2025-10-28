"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Logo from "./logo";

const GRID_COLS = 10;
const GRID_ROWS = 10;

export default function PageLoader() {
  const loaderRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!loaderRef.current) return;

    const squares = loaderRef.current.querySelectorAll(".square");
    const contentElements = document.querySelectorAll("[data-content]");

    gsap.to(squares, {
      duration: 0.1,
      opacity: 0,
      ease: "sine",
      stagger: {
        grid: [GRID_ROWS, GRID_COLS],
        from: "end", 
        amount: 0.5, 
        ease: "",
      },
      onStart: () => {
      },
      onComplete: () => {
        gsap.to(contentElements, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
        });

        gsap.to(loaderRef.current, {
          opacity: 0,
          duration: 1,
          delay: 0.5,
          ease: "power2.inOut",
          onComplete: () => {
            if (loaderRef.current) loaderRef.current.style.display = "none";
          },
        });
      },
    });
  }, { scope: loaderRef });

  const squares = Array.from({ length: GRID_COLS * GRID_ROWS }, (_, i) => (
    <div key={i} className="square w-full h-full bg-black" />
  ));

  return (
    <div ref={loaderRef} className="fixed inset-0 z-[9999]">
      <div className="grid grid-cols-10 h-full w-full -scale-x-100">{squares}</div>
        <Logo color="white" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[100px] animate-pulse" />
    </div>
  );
}
