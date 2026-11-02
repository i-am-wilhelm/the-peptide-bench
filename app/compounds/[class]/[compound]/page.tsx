import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Crumbs from "@/components/Crumbs";
import GlyphField from "@/components/GlyphField";
import ProductCard from "@/components/ProductCard";
import JsonLd from "@/components/JsonLd";
import { COMPOUNDS, CLASSES, CLASS_HEX, compoundBySlug } from "@/data/compounds";
import { classBySlug, productsByCompound } from "@/lib/catalog";
import { LOTS } from "@/data/lots";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return COMPOUNDS.filter((c) => productsByCompound(c.slug).length).map((c) => ({
    class: CLASSES[c.class].slug,
    compound: c.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ class: string; compound: string }> }): Promise<Metadata> {
  const { compound } = await params;
  const cp = compoundBySlug(compound);
  if (!cp) return {};
  return {
    title: `${cp.name} · research-use-only`,
    description: `${cp.description} Identity data, aliases and available research formats.`,
    alternates: { canonical: `/compounds/${CLASSES[cp.class].slug}/${cp.slug}` },
  };
}

export default async function CompoundPage({ params }: { params: Promise<{ class: string; compound: string }> }) {
  const { class: classSlug, compound } = await params;
  const cp = compoundBySlug(compound);
  const c = classBySlug(classSlug);
  if (!cp || !c || CLASSES[cp.class].slug !== classSlug) notFound();
  const products = productsByCompound(cp.slug);
  const lots = LOTS.filter((l) => l.compoundSlug === cp.slug);
  const accent = `var(${c.cssVar})`;
  const accentHex = CLASS_HEX[cp.class];

  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "MolecularEntity",
    name: cp.name,
    alternateName: cp.aliases,
    url: `${site.url}/compounds/${classSlug}/${cp.slug}`,
    description: cp.description,
  };
  if (cp.verified) {
    if (cp.cas) ld.identifier = { "@type": "PropertyValue", propertyID: "CAS", value: cp.cas };
    if (cp.formula) ld.molecularFormula = cp.formula;
    if (cp.mass) ld.molecularWeight = { "@type": "QuantitativeValue", value: cp.mass, unitCode: "D43" };
    if (cp.sequence) ld.hasRepresentation = cp.sequence;
  }

  return (
    <>
      <JsonLd data={ld} />
      <Crumbs items={[{ href: "/compounds", label: "compounds" }, { href: `/compounds/${c.slug}`, label: c.name.toLowerCase() }, { label: cp.name }]} />

      <div className="grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <p className="label mb-2" style={{ color: accent }}>
            {c.name}
          </p>
          <h1 className="display text-3xl sm:text-4xl">{cp.name}</h1>
          <p className="mt-4 max-w-2xl text-fg-2">{cp.description}</p>

          <h2 className="label mt-10 mb-2">identity</h2>
          <dl>
            <div className="spec">
              <dt>sequence</dt>
              <dd>
                {cp.sequence ? (
                  cp.verified ? cp.sequence : <span className="text-fg-3">on file · pending verification against lot COA</span>
                ) : cp.isBlend ? (
                  <span className="text-fg-2">blend · see components</span>
                ) : (
                  <span className="text-fg-3">not applicable</span>
                )}
              </dd>
            </div>
            {cp.sequenceNote && cp.verified && (
              <div className="spec">
                <dt>notes</dt>
                <dd className="text-fg-2">{cp.sequenceNote}</dd>
              </div>
            )}
            <div className="spec">
              <dt>CAS</dt>
              <dd>{cp.verified && cp.cas ? cp.cas : <span className="text-fg-3">pending verification</span>}</dd>
            </div>
            <div className="spec">
              <dt>formula</dt>
              <dd>{cp.verified && cp.formula ? cp.formula : <span className="text-fg-3">pending verification</span>}</dd>
            </div>
            <div className="spec">
              <dt>mass</dt>
              <dd>{cp.verified && cp.mass ? `${cp.mass} g/mol` : <span className="text-fg-3">pending verification</span>}</dd>
            </div>
            <div className="spec">
              <dt>also listed as</dt>
              <dd className="text-fg-2">{cp.aliases.join(" · ") || "—"}</dd>
            </div>
            {cp.isBlend && cp.components && (
              <div className="spec">
                <dt>components</dt>
                <dd className="flex flex-wrap gap-2">
                  {cp.components.map((s) => {
                    const comp = compoundBySlug(s)!;
                    return (
                      <Link key={s} href={`/compounds/${CLASSES[comp.class].slug}/${comp.slug}`} className="underline underline-offset-4 hover:text-accent">
                        {comp.name}
                      </Link>
                    );
                  })}
                </dd>
              </div>
            )}
          </dl>

          {cp.etymology && (
            <>
              <h2 className="label mt-10 mb-2">name and origin</h2>
              <p className="max-w-2xl text-sm text-fg-2">{cp.etymology}</p>
            </>
          )}

          <h2 className="label mt-10 mb-2">regulatory notes</h2>
          {cp.flags?.length ? (
            <ul className="max-w-2xl space-y-1.5 text-sm text-fg-2">
              {cp.flags.map((f) => (
                <li key={f} className="flex gap-2">
                  <span aria-hidden className="mono text-fg-3">›</span>
                  {f}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-fg-3">No compound-specific notes. General terms on the <Link href="/compliance" className="underline underline-offset-4">compliance page</Link> apply.</p>
          )}

          <h2 className="label mt-10 mb-2">lots</h2>
          {lots.length ? (
            <ul className="space-y-2">
              {lots.map((l) => (
                <li key={l.lot}>
                  <Link href={`/coa/${l.lot}`} className="mono text-sm underline underline-offset-4 hover:text-accent">
                    {l.lot}
                  </Link>{" "}
                  <span className="mono text-[11px] text-fg-3">
                    {l.lab} · {l.reportDate} · {l.purity != null ? `${l.purity}%` : "—"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-fg-3">
              Lot reports for this compound publish here as each lot is received and its certificate is checked. See <Link href="/coa" className="underline underline-offset-4">lab data</Link>.
            </p>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-24 overflow-hidden rounded-lg border border-line bg-bg-1">
            <div className="relative h-56">
              <GlyphField sequence={cp.sequence?.replace(/[^A-Za-z]/g, "")} accent={accentHex} density={13} />
              <span className="label absolute bottom-3 left-3">{cp.sequence ? "sequence glyph field" : "glyph field"}</span>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-14">
        <h2 className="display mb-4 text-xl">Formats and sizes</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.sku} product={p} compact />
          ))}
        </div>
      </section>
    </>
  );
}
