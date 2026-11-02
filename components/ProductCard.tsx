import Link from "next/link";
import { money, type Product } from "@/lib/catalog";
import { CLASSES } from "@/data/compounds";
import AddToCart from "@/components/AddToCart";

export default function ProductCard({ product: p, compact = false }: { product: Product; compact?: boolean }) {
  const accent = `var(${CLASSES[p.classKey].cssVar})`;
  return (
    <article
      className="scan group relative flex flex-col justify-between rounded-lg border border-line bg-bg-1 p-4 transition-colors hover:border-line-strong"
      style={{ ["--card-accent" as string]: accent }}
    >
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="label" style={{ color: accent }}>
            {p.formatLabel}
          </span>
          <span className="mono text-[11px] text-fg-3">{p.sku}</span>
        </div>
        <h3 className="display text-base leading-snug">
          <Link href={`/products/${p.sku}`} className="hover:text-accent">
            {p.compound?.name ?? p.name}
          </Link>
        </h3>
        <dl className="mt-3">
          <div className="spec">
            <dt>content</dt>
            <dd>{p.size || "see label"}</dd>
          </div>
          {!compact && p.compound?.sequence && (
            <div className="spec">
              <dt>sequence</dt>
              <dd className="truncate" title={p.compound.sequence}>
                {p.compound.verified ? p.compound.sequence : <span className="text-fg-3">pending COA verification</span>}
              </dd>
            </div>
          )}
          <div className="spec">
            <dt>lab report</dt>
            <dd>{p.coa_ref ? <span className="text-fg-2">on file, publishing</span> : <span className="text-fg-3">requested</span>}</dd>
          </div>
        </dl>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="mono text-base">{p.available ? money(p.price) : <span className="text-fg-3 text-sm">coming soon</span>}</span>
        <AddToCart sku={p.sku} disabled={!p.available} small />
      </div>
    </article>
  );
}
