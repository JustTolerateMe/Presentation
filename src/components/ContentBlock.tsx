"use client";

import { ReactNode, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ContentBlockProps {
  title?: string;
  children: ReactNode;
  delay?: number;
}

export default function ContentBlock({ title, children, delay = 0 }: ContentBlockProps) {
  const blockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (blockRef.current) {
      gsap.from(blockRef.current, {
        opacity: 0,
        y: 40,
        duration: 1.2,
        delay: delay,
        scrollTrigger: {
          trigger: blockRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    }
  }, [delay]);

  return (
    <div ref={blockRef} className="mb-48 last:mb-0 max-w-2xl mx-auto md:mx-0">
      {title && (
        <h2 className="font-playfair text-4xl md:text-6xl mb-16 text-foreground/90 border-l-4 border-accent pl-8 leading-tight">
          {title}
        </h2>
      )}
      <div className="font-inter text-xl md:text-2xl leading-relaxed text-foreground/85 space-y-8">
        {children}
      </div>
    </div>
  );
}
