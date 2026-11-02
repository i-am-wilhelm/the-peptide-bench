"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { site } from "@/lib/site";

const NAV = [
  { href: "/compounds", label: "compounds" },
  { href: "/coa", label: "lab data" },
  { href: "/learn", label: "learn" },
  { href: "/compliance", label: "compliance" },
];

export default function Header() {
  const { count, hydrated } = useCart();
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span aria-hidden className="mono grid h-7 w-7 place-items-center rounded-sm border border-accent/60 text-[11px] text-accent">
            Ψ
          </span>
          <span className="display text-sm tracking-tight">{site.shortName}</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="label transition-colors hover:text-fg">
              {n.label}
            </Link>
          ))}
        </nav>
        <Link href="/cart" className="btn !py-1.5 !px-3">
          cart
          <span className="mono rounded-sm bg-bg-2 px-1.5 text-[11px] text-fg-2">{hydrated ? count : "·"}</span>
        </Link>
      </div>
      <div className="border-t border-line bg-bg-1">
        <p className="mono mx-auto max-w-7xl px-4 py-1 text-[10.5px] tracking-wide text-fg-3 sm:px-6">
          research use only · not for human or veterinary use · {site.minimumAge}+ · ships {site.shipsTo.toLowerCase()}
        </p>
      </div>
    </header>
  );
}
