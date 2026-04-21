"use client";

import { useEffect, useState } from "react";

function randomDigits(len: number) {
  return Array.from({ length: len }, () => Math.floor(Math.random() * 10)).join("");
}

export default function InfiniteHUD() {
  const [scroll,  setScroll]  = useState(0);
  const [ticker,  setTicker]  = useState("081511 02 10800");
  const [section, setSection] = useState("00");

  // scroll progress
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? window.scrollY / max : 0;
      setScroll(pct);

      // derive section label from scroll
      const idx = Math.min(Math.floor(pct * 13), 12);
      setSection(idx.toString().padStart(2, "0"));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // live data ticker — fast random numbers cycling every 65 ms
  useEffect(() => {
    const id = setInterval(() => {
      const t = `${randomDigits(6)} ${randomDigits(2)} ${randomDigits(5)}`;
      setTicker(t);
    }, 65);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none flex flex-col justify-between p-8 md:p-12
                 font-space text-[10px] md:text-xs tracking-[0.4em] uppercase text-[var(--text)] opacity-70"
      style={{ zIndex: 50 }}
    >
      {/* ── Top ─────────────────────────────────────────────────────── */}
      <div className="flex justify-between items-start w-full">
        {/* Logo */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <span className="text-[var(--text)] font-bold tracking-widest text-sm">AI 101</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(25,100%,45%)] animate-pulse" />
          </div>
          <span className="text-[9px] opacity-60 tracking-[0.2em]">Artificial Cognition // Anshuman</span>
        </div>

        {/* Data ticker + progress */}
        <div className="flex flex-col items-end gap-2.5">
          {/* animated ticker */}
          <span className="font-mono text-[10px] text-[hsl(25,100%,45%)] tracking-widest opacity-80 tabular-nums">
            {ticker}
          </span>
          <div className="flex items-center gap-3">
            <span className="opacity-50">SYS:ACTIVE</span>
            <div className="relative w-28 h-[1px] bg-[var(--text)] opacity-10 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-[hsl(25,100%,45%)] transition-transform duration-300 ease-out origin-left"
                style={{ transform: `scaleX(${scroll})`, width: "100%" }}
              />
            </div>
            <span className="text-[var(--text)] opacity-60">{section}</span>
          </div>
          <span className="text-[9px] opacity-40">SCROLL TO PROCEED</span>
        </div>
      </div>

    </div>
  );
}
