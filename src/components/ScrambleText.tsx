"use client";

import { useState, useEffect, useRef } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&";

interface Props {
  children: string;
  className?: string;
  tag?: "h1" | "h2" | "h3" | "span" | "p";
  delay?: number; // ms before scramble starts after entering viewport
}

export default function ScrambleText({ children, className, tag: Tag = "span", delay = 0 }: Props) {
  const [display, setDisplay] = useState(children);
  const [done, setDone]       = useState(false);
  const ref     = useRef<HTMLElement>(null);
  const rafRef  = useRef<number>(0);
  const hasFired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasFired.current) {
          hasFired.current = true;
          observer.disconnect();

          setTimeout(() => {
            const text = children;
            let frame = 0;
            const TOTAL = 45;

            const animate = () => {
              const progress  = frame / TOTAL;
              const revealed  = Math.floor(text.length * progress);
              const scrambled = text
                .split("")
                .map((ch, i) => {
                  if (ch === " " || ch === "\n" || ch === "." || ch === "/") return ch;
                  if (i < revealed) return ch;
                  return CHARS[Math.floor(Math.random() * CHARS.length)];
                })
                .join("");

              setDisplay(scrambled);
              frame++;

              if (frame <= TOTAL) {
                rafRef.current = requestAnimationFrame(animate);
              } else {
                setDisplay(text);
                setDone(true);
              }
            };

            rafRef.current = requestAnimationFrame(animate);
          }, delay);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [children, delay]);

  // keep display in sync if children changes (e.g. hot-reload)
  useEffect(() => {
    if (done) setDisplay(children);
  }, [children, done]);

  return (
    // @ts-expect-error – dynamic tag
    <Tag ref={ref} className={className}>
      {display}
    </Tag>
  );
}
