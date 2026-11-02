"use client";

import { useEffect, useRef } from "react";

/**
 * Amino-acid glyph dither.
 *
 * Draws a field of single-letter amino acid codes. When a `sequence` is supplied, the field is seeded
 * from it and a brighter "signal" path (the peptide backbone, as a deterministic pseudo-3D polyline)
 * resolves out of the noise over ~1.75 s (one bar of 7/8 at 60 bpm). Without a sequence it renders the
 * canonical 20-letter alphabet as ambient texture.
 *
 * Decorative only. It carries no data claims; the sequence shown is the one on the product page.
 */

const ALPHABET = "ACDEFGHIKLMNPQRSTVWY";

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let s = seed || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 100000) / 100000;
  };
}

export default function GlyphField({
  sequence,
  accent = "#5ef2e6",
  density = 14,
  className = "",
  intensity = 1,
}: {
  sequence?: string;
  accent?: string;
  /** cell size in px */
  density?: number;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clean = (sequence ?? "").toUpperCase().replace(/[^ACDEFGHIKLMNPQRSTVWY]/g, "");
    const seed = hash(clean || "ambient");
    let raf = 0;
    let start = performance.now();
    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let cells: { ch: string; a: number; phase: number }[] = [];
    let path: { x: number; y: number; z: number; ch: string }[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / density);
      rows = Math.ceil(h / density);
      const r = rng(seed);
      cells = [];
      for (let i = 0; i < cols * rows; i++) {
        const src = clean.length ? clean[Math.floor(r() * clean.length)] : ALPHABET[Math.floor(r() * 20)];
        cells.push({ ch: src, a: 0.05 + r() * 0.12, phase: r() * Math.PI * 2 });
      }
      // Backbone path: walk across the canvas, one node per residue, with a gentle pseudo-3D wobble.
      path = [];
      const n = clean.length;
      if (n > 1) {
        const r2 = rng(seed ^ 0x9e3779b9);
        const margin = Math.min(w, h) * 0.12;
        for (let i = 0; i < n; i++) {
          const t = i / (n - 1);
          const x = margin + t * (w - margin * 2);
          const wobble = Math.sin(t * Math.PI * 2.5 + r2() * 0.6) * h * 0.18 + (r2() - 0.5) * h * 0.06;
          const y = h / 2 + wobble;
          const z = 0.55 + 0.45 * Math.sin(t * Math.PI * 3.1 + seed % 7);
          path.push({ x, y, z, ch: clean[i] });
        }
      }
      start = performance.now();
    };

    const draw = (now: number) => {
      const t = reduce ? 1 : Math.min(1, (now - start) / 1750);
      const ease = 1 - Math.pow(1 - t, 3);
      ctx.clearRect(0, 0, w, h);
      ctx.font = `${Math.round(density * 0.72)}px ${getComputedStyle(canvas).fontFamily}`;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";

      // Ambient field.
      const breathe = reduce ? 0 : Math.sin(now / 1750 * Math.PI * 2) * 0.02;
      for (let i = 0; i < cells.length; i++) {
        const c = cells[i];
        const x = (i % cols) * density + density / 2;
        const y = Math.floor(i / cols) * density + density / 2;
        const flicker = reduce ? 0 : Math.sin(now / 900 + c.phase) * 0.02;
        ctx.fillStyle = `rgba(232,236,239,${(c.a + flicker + breathe) * intensity})`;
        ctx.fillText(c.ch, x, y);
      }

      // Signal path resolving.
      if (path.length > 1) {
        const shown = Math.floor(ease * path.length);
        ctx.lineWidth = 1;
        ctx.strokeStyle = accent + "55";
        ctx.beginPath();
        for (let i = 0; i < shown; i++) {
          const p = path[i];
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
        for (let i = 0; i < shown; i++) {
          const p = path[i];
          const size = density * (0.9 + p.z * 0.9);
          ctx.font = `${Math.round(size)}px ${getComputedStyle(canvas).fontFamily}`;
          // chromatic fringe
          ctx.fillStyle = `rgba(255,60,60,${0.25 * p.z})`;
          ctx.fillText(p.ch, p.x + 1.2, p.y);
          ctx.fillStyle = `rgba(60,120,255,${0.25 * p.z})`;
          ctx.fillText(p.ch, p.x - 1.2, p.y);
          ctx.fillStyle = accent;
          ctx.globalAlpha = 0.55 + 0.45 * p.z;
          ctx.fillText(p.ch, p.x, p.y);
          ctx.globalAlpha = 1;
          ctx.fillStyle = accent + "aa";
          ctx.beginPath();
          ctx.arc(p.x, p.y + size * 0.65, 1.2 + p.z, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (!reduce) raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);
    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw(performance.now());
    });
    ro.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [sequence, accent, density, intensity]);

  return <canvas ref={ref} aria-hidden="true" className={`mono block h-full w-full ${className}`} />;
}
