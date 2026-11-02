import type { Metadata } from "next";
import Link from "next/link";
import Crumbs from "@/components/Crumbs";
import { CLASS_LIST, compoundsInClass, productsByCompound } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Compounds",
  description: "Research-use-only peptides and lab compounds organized by research class, with sequence, mass and lot data.",
  alternates: { canonical: "/compounds" },
};

export default function CompoundsIndex() {
  return (
    <>
      <Crumbs items={[{ label: "compounds" }]} />
      <h1 className="display text-3xl">Compounds by research class</h1>
      <p className="mt-3 max-w-2xl text-fg-2">
        Navigation follows the chemistry. Each class page lists its compounds; each compound page lists its formats, sizes
        and lots.
      </p>
      <div className="mt-10 space-y-12">
        {CLASS_LIST.filter((c) => c.count).map((c) => {
          const compounds = compoundsInClass(c.key);
          return (
            <section key={c.key} id={c.slug}>
              <div className="mb-4 flex items-baseline justify-between border-b border-line pb-3">
                <h2 className="display text-xl">
                  <Link href={`/compounds/${c.slug}`} className="hover:text-accent">
                    {c.name}
                  </Link>
                </h2>
                <span className="label" style={{ color: `var(${c.cssVar})` }}>
                  {compounds.length} compounds · {c.count} SKUs
                </span>
              </div>
              <ul className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
                {compounds.map((cp) => {
                  const skus = productsByCompound(cp.slug);
                  const avail = skus.filter((s) => s.available).length;
                  return (
                    <li key={cp.slug} className="scan bg-bg-1 p-4 hover:bg-bg-2">
                      <Link href={`/compounds/${c.slug}/${cp.slug}`} className="block">
                        <h3 className="display text-base">{cp.name}</h3>
                        <p className="mono mt-1 truncate text-[11px] text-fg-3" title={cp.sequence}>
                          {cp.sequence ?? cp.aliases[0] ?? ""}
                        </p>
                        <p className="label mt-3">
                          {skus.length} formats · {avail} in stock
                        </p>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
