"use client";

import { useEffect, useRef, useState } from "react";

// ── Scroll zones ──────────────────────────────────────────────────────────────
const ZONE_START    = 0.12;   // halftone appears
const ZONE_END      = 0.52;   // halftone fully gone
const PHASE2_FRAC   = 0.58;   // fraction of [0,1] where canvas phase takes over

// ── Canvas helpers ────────────────────────────────────────────────────────────
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  w: number, h: number,
  r: number
) {
  if (r <= 0) { ctx.rect(x, y, w, h); return; }
  r = Math.min(r, w / 2, h / 2);
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y,     x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x,     y + h, r);
  ctx.arcTo(x,     y + h, x,     y,     r);
  ctx.arcTo(x,     y,     x + w, y,     r);
  ctx.closePath();
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function GlitchOverlay() {
  const divRef    = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const clockRef  = useRef<number>(0); // independent time for animated warp
  const [mounted,    setMounted]    = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);

  useEffect(() => {
    let prevIn     = false;
    let prevCanvas = false;

    const loop = () => {
      clockRef.current += 0.016; // ~60 fps clock for animated warp
      const T = clockRef.current;

      const max      = document.documentElement.scrollHeight - window.innerHeight;
      const scroll   = max > 0 ? window.scrollY / max : 0;
      const progress = Math.max(0, Math.min(1, (scroll - ZONE_START) / (ZONE_END - ZONE_START)));

      const isIn     = progress > 0.005;
      const isCanvas = progress >= PHASE2_FRAC;

      if (isIn     !== prevIn)     setMounted(isIn);
      if (isCanvas !== prevCanvas) setShowCanvas(isCanvas);
      prevIn     = isIn;
      prevCanvas = isCanvas;

      // ── Phase 1: CSS tiling radial-gradient (circles → rounded squares) ──
      if (divRef.current && isIn && !isCanvas) {
        const p1    = Math.min(progress / PHASE2_FRAC, 1);      // 0→1 over phase 1
        const eased = Math.pow(p1, 0.58);                        // fast start, slow finish
        const size  = 3 + eased * 77;                            // 3 → 80 px grid

        // colour: warm orange → near-white
        const ct    = Math.pow(p1, 0.48);
        const r     = Math.round(210 + ct * 28);
        const g     = Math.round(95  + ct * 130);
        const b     = Math.round(20  + ct * 190);

        divRef.current.style.backgroundImage =
          `radial-gradient(circle, rgb(${r},${g},${b}) 42%, transparent 50%)`;
        divRef.current.style.backgroundSize = `${size}px ${size}px`;
      }

      // ── Phase 2: Canvas — distorted B&W checkerboard ──────────────────────
      const canvas = canvasRef.current;
      if (canvas && isCanvas) {
        const needResize =
          canvas.width  !== window.innerWidth ||
          canvas.height !== window.innerHeight;
        if (needResize) {
          canvas.width  = window.innerWidth;
          canvas.height = window.innerHeight;
        }

        const ctx = canvas.getContext("2d");
        if (ctx) {
          const W = canvas.width;
          const H = canvas.height;

          // p2: 0→1 across phase 2
          const p2 = Math.min((progress - PHASE2_FRAC) / (1 - PHASE2_FRAC), 1);

          const cellSize = 80 + p2 * 130;                      // 80 → 210 px
          const rounding = cellSize * 0.13 * Math.max(0, 1 - p2 * 3.5); // fades to 0
          const warpAmt  = p2 * cellSize * 0.30;               // warp grows with cell

          ctx.fillStyle = "#000000";
          ctx.fillRect(0, 0, W, H);

          ctx.fillStyle = "#ffffff";

          const cols = Math.ceil(W / cellSize) + 3;
          const rows = Math.ceil(H / cellSize) + 3;

          for (let row = -1; row < rows; row++) {
            for (let col = -1; col < cols; col++) {
              if ((col + row) % 2 !== 0) continue; // skip the black cells

              const bx = col * cellSize;
              const by = row * cellSize;

              // Sinusoidal warp — two superimposed waves per axis
              const dx =
                Math.sin(row * 0.13 + T * 1.05) * warpAmt * 0.7 +
                Math.sin(col * 0.08 + T * 0.60) * warpAmt * 0.3;
              const dy =
                Math.cos(col * 0.13 + T * 0.85) * warpAmt * 0.7 +
                Math.cos(row * 0.08 + T * 0.50) * warpAmt * 0.3;

              const x = bx + dx;
              const y = by + dy;
              const pad = 2;

              ctx.beginPath();
              roundRect(ctx, x + pad, y + pad, cellSize - pad * 2, cellSize - pad * 2, rounding);
              ctx.fill();
            }
          }
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Nothing in the DOM until we enter the zone
  if (!mounted) return null;

  return (
    <>
      {/* Phase 1 — CSS dot halftone */}
      <div
        ref={divRef}
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 35,
          backgroundColor: "rgba(0,0,0,0.88)",
          backgroundImage: "none",
          backgroundSize: "3px 3px",
          display: showCanvas ? "none" : "block",
        }}
      />

      {/* Phase 2 — Canvas distorted checkerboard */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 35,
          width: "100%",
          height: "100%",
          display: showCanvas ? "block" : "none",
        }}
      />
    </>
  );
}
