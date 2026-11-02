"use client";

import { useEffect, useState } from "react";
import { site, RUO_STATEMENT } from "@/lib/site";

const KEY = "gate.v1";

export default function AgeGate() {
  const [open, setOpen] = useState(false);
  const [age, setAge] = useState(false);
  const [ruo, setRuo] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  if (!open) return null;

  const accept = () => {
    try {
      localStorage.setItem(KEY, new Date().toISOString());
    } catch {}
    setOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-bg/95 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-lg border border-line-strong bg-bg-1 p-6">
        <p className="label mb-3">access conditions</p>
        <h2 id="gate-title" className="display text-xl">
          {site.name}
        </h2>
        <p className="mt-3 text-sm text-fg-2">{RUO_STATEMENT}</p>
        <div className="mt-5 space-y-3 text-sm">
          <label className="flex cursor-pointer items-start gap-3">
            <input type="checkbox" className="mt-1 accent-[var(--accent)]" checked={age} onChange={(e) => setAge(e.target.checked)} />
            <span>I am at least {site.minimumAge} years of age.</span>
          </label>
          <label className="flex cursor-pointer items-start gap-3">
            <input type="checkbox" className="mt-1 accent-[var(--accent)]" checked={ruo} onChange={(e) => setRuo(e.target.checked)} />
            <span>
              I understand every item on this site is sold strictly for in-vitro laboratory research and I will handle it
              accordingly.
            </span>
          </label>
        </div>
        <div className="mt-6 flex items-center justify-between gap-3">
          <a href="https://www.fda.gov" className="label hover:text-fg">
            leave
          </a>
          <button className="btn btn-primary" disabled={!age || !ruo} onClick={accept}>
            enter
          </button>
        </div>
      </div>
    </div>
  );
}
