"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function Hero() {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.from(textRef.current, {
      opacity: 0,
      z: -100,
      duration: 2,
      ease: "power4.out",
    });
  }, []);

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div 
        ref={textRef} 
        className="relative z-10 text-center px-4"
        style={{ perspective: "1000px" }}
      >
        <h1 className="font-space text-7xl md:text-[12rem] font-bold tracking-tighter leading-none text-white uppercase italic">
          AI 101
        </h1>
        <div className="mt-4 h-[1px] w-24 bg-accent mx-auto animate-width" />
      </div>
    </section>
  );
}
