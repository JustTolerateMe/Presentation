"use client";

import { ReactNode, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SectionProps {
  children:  ReactNode;
  className?: string;
  id?:        string;
}

export default function Section({ children, id, className }: SectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    // Subtle fade+rise on enter — no z/scale to avoid fighting the WebGL camera
    const tween = gsap.fromTo(
      el,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => { tween.kill(); };
  }, []);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`min-h-screen w-full flex flex-col items-center justify-center py-20 px-8 ${className ?? ""}`}
    >
      <div ref={contentRef} className="max-w-5xl w-full text-center opacity-0">
        {children}
      </div>
    </section>
  );
}
