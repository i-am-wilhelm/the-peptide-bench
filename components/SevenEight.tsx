"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A seven-step sequencer toy in 7/8. Chrome-only easter egg (404 page). Click cells to toggle,
 * press play. Uses the Web Audio API; silent until the visitor starts it.
 */
const ROWS = ["K", "S", "H"]; // kick, snare-ish, hat-ish
const STEPS = 7;

export default function SevenEight() {
  const [grid, setGrid] = useState<boolean[][]>(() => [
    [true, false, false, true, false, false, true],
    [false, false, true, false, false, true, false],
    [true, true, true, true, true, true, true],
  ]);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(-1);
  const ctxRef = useRef<AudioContext | null>(null);
  const timer = useRef<number | null>(null);
  const gridRef = useRef(grid);
  gridRef.current = grid;

  useEffect(() => {
    if (!playing) {
      if (timer.current) window.clearInterval(timer.current);
      setStep(-1);
      return;
    }
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = ctxRef.current ?? new AC();
    ctxRef.current = ctx;
    let i = 0;
    const eighth = 60 / 108 / 2; // 108 bpm, eighth-note grid → 7 eighths per bar
    const hit = (row: number, t: number) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g).connect(ctx.destination);
      if (row === 0) {
        o.frequency.setValueAtTime(140, t);
        o.frequency.exponentialRampToValueAtTime(40, t + 0.12);
        g.gain.setValueAtTime(0.5, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
      } else if (row === 1) {
        o.type = "triangle";
        o.frequency.setValueAtTime(220, t);
        g.gain.setValueAtTime(0.25, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      } else {
        o.type = "square";
        o.frequency.setValueAtTime(3200, t);
        g.gain.setValueAtTime(0.05, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
      }
      o.start(t);
      o.stop(t + 0.2);
    };
    timer.current = window.setInterval(() => {
      const s = i % STEPS;
      setStep(s);
      const t = ctx.currentTime + 0.01;
      gridRef.current.forEach((row, r) => row[s] && hit(r, t));
      i++;
    }, eighth * 1000);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [playing]);

  return (
    <div className="inline-block rounded-lg border border-line bg-bg-1 p-4 text-left">
      <div className="mb-3 flex items-center justify-between">
        <span className="label">7/8 · 108</span>
        <button className="btn !py-1 !px-3" onClick={() => setPlaying((p) => !p)}>
          {playing ? "stop" : "play"}
        </button>
      </div>
      <div className="grid gap-1" style={{ gridTemplateColumns: `auto repeat(${STEPS}, 28px)` }}>
        {grid.map((row, r) => (
          <div key={r} className="contents">
            <span className="mono pr-2 text-[11px] text-fg-3 leading-7">{ROWS[r]}</span>
            {row.map((on, c) => (
              <button
                key={c}
                aria-label={`${ROWS[r]} step ${c + 1}`}
                aria-pressed={on}
                onClick={() => setGrid((g) => g.map((rr, ri) => (ri === r ? rr.map((v, ci) => (ci === c ? !v : v)) : rr)))}
                className="h-7 w-7 rounded-sm border transition-colors"
                style={{
                  borderColor: step === c ? "var(--accent)" : "var(--line-strong)",
                  background: on ? (step === c ? "var(--accent)" : "var(--accent-dim)") : "transparent",
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
