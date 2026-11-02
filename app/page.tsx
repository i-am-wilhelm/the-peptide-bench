import Link from "next/link";
import GlyphField from "@/components/GlyphField";
import ProductCard from "@/components/ProductCard";
import { CLASS_LIST, PRODUCTS } from "@/lib/catalog";
import { site, RUO_STATEMENT } from "@/lib/site";

export default function Home() {
  const featured = PRODUCTS.filter((p) => p.available && p.format === "vial" && p.compound?.sequence)
    .filter((p, i, arr) => arr.findIndex((q) => q.compound?.slug === p.compound?.slug) === i)
    .slice(0, 6);
  const vialCount = PRODUCTS.filter((p) => p.format === "vial").length;
  const compoundCount = new Set(PRODUCTS.map((p) => p.compound?.slug)).size;

  return (
    <>
      {/* Hero */}
      <section className="relative -mx-4 -mt-10 overflow-hidden border-b border-line sm:-mx-6">
        <div className="absolute inset-0 opacity-70">
          <GlyphField sequence="GEPPPGKPADDAGLV" density={16} intensity={0.9} />
        </div>
        <div className="grid-bg absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 sm:pb-24 sm:pt-28">
          <p className="label mb-4">research supply · {site.state} · est. {site.foundedYear}</p>
          <h1 className="display max-w-3xl text-4xl leading-[1.05] sm:text-6xl">
            Peptides for the bench, with the lab report in front of the price.
          </h1>
          <p className="mt-6 max-w-xl text-base text-fg-2">
            {compoundCount} compounds across {CLASS_LIST.filter((c) => c.count && c.key !== "supply").length} research
            classes. Every vial lists its sequence, mass and lot. Every lot links its certificate of analysis.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/compounds" className="btn btn-primary">
              browse compounds
            </Link>
            <Link href="/coa" className="btn">
              read the lab data
            </Link>
          </div>
          <p className="mono mt-10 max-w-xl text-[11px] leading-relaxed text-fg-3">{RUO_STATEMENT}</p>
        </div>
      </section>

      {/* Classes */}
      <section className="mt-16">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="display text-2xl">Research classes</h2>
          <span className="mono text-[11px] text-fg-3">{vialCount} vials · {PRODUCTS.length} SKUs</span>
        </div>
        <ul className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {CLASS_LIST.filter((c) => c.count).map((c) => (
            <li key={c.key} className="scan bg-bg-1 p-5 transition-colors hover:bg-bg-2">
              <Link href={`/compounds/${c.slug}`} className="block">
                <div className="flex items-center justify-between">
                  <span className="label" style={{ color: `var(${c.cssVar})` }}>
                    {c.count} SKUs
                  </span>
                  <span aria-hidden className="mono text-fg-3">→</span>
                </div>
                <h3 className="display mt-2 text-base">{c.name}</h3>
                <p className="mt-1 text-sm text-fg-2">{c.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Standard */}
      <section className="mt-20 grid gap-10 md:grid-cols-3">
        {[
          {
            k: "01",
            h: "Identity, stated",
            p: "Sequence, modifications, CAS and molecular mass on every compound page, published once they are checked against the lot's own report.",
          },
          {
            k: "02",
            h: "Lot-level lab data",
            p: "Each lot shows the lab, the method, the purity figure and the instrument trace. The report PDF sits one click away.",
          },
          {
            k: "03",
            h: "Research-only, enforced",
            p: `A ${site.minimumAge}+ gate at the door, a researcher attestation at checkout, and no usage content anywhere on the site.`,
          },
        ].map((b) => (
          <div key={b.k} className="border-t border-line pt-5">
            <p className="mono text-[11px] text-accent">{b.k}</p>
            <h3 className="display mt-2 text-lg">{b.h}</h3>
            <p className="mt-2 text-sm text-fg-2">{b.p}</p>
          </div>
        ))}
      </section>

      {/* Featured */}
      <section className="mt-20">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="display text-2xl">In stock</h2>
          <Link href="/compounds" className="label hover:text-fg">
            all compounds →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p.sku} product={p} compact />
          ))}
        </div>
      </section>
    </>
  );
}
