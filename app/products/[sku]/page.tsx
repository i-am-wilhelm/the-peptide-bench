import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Crumbs from "@/components/Crumbs";
import GlyphField from "@/components/GlyphField";
import JsonLd from "@/components/JsonLd";
import AddToCart from "@/components/AddToCart";
import { CLASSES, CLASS_HEX } from "@/data/compounds";
import { PRODUCTS, money, productBySku, productsByCompound } from "@/lib/catalog";
import { lotsForSku } from "@/data/lots";
import { site, RUO_STATEMENT } from "@/lib/site";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ sku: p.sku }));
}

export async function generateMetadata({ params }: { params: Promise<{ sku: string }> }): Promise<Metadata> {
  const { sku } = await params;
  const p = productBySku(sku);
  if (!p) return {};
  return {
    title: p.title,
    description: `${p.compound?.name ?? p.name}, ${p.size}, ${p.formatLabel.toLowerCase()}. Research use only. Lot certificate of analysis attached.`,
    alternates: { canonical: `/products/${p.sku}` },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ sku: string }> }) {
  const { sku } = await params;
  const p = productBySku(sku);
  if (!p) notFound();
  const cp = p.compound;
  const cls = CLASSES[p.classKey];
  const lots = lotsForSku(p.sku);
  const siblings = cp ? productsByCompound(cp.slug).filter((s) => s.sku !== p.sku) : [];
  const accent = CLASS_HEX[p.classKey];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: p.title,
          sku: p.sku,
          url: `${site.url}/products/${p.sku}`,
          category: cls.name,
          description: `${cp?.description ?? ""} Supplied as ${p.formatLabel.toLowerCase()}, ${p.size}. ${RUO_STATEMENT}`,
          brand: { "@type": "Brand", name: site.name },
          audience: { "@type": "Audience", audienceType: "Laboratory researchers" },
          ...(p.available && p.price != null
            ? {
                offers: {
                  "@type": "Offer",
                  price: p.price,
                  priceCurrency: "USD",
                  availability: "https://schema.org/InStock",
                  url: `${site.url}/products/${p.sku}`,
                  eligibleRegion: "US",
                },
              }
            : {}),
        }}
      />
      <Crumbs
        items={[
          { href: "/compounds", label: "compounds" },
          { href: `/compounds/${cls.slug}`, label: cls.name.toLowerCase() },
          ...(cp ? [{ href: `/compounds/${cls.slug}/${cp.slug}`, label: cp.name }] : []),
          { label: p.size || p.formatLabel.toLowerCase() },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Data column */}
        <div>
          <p className="label mb-2" style={{ color: accent }}>
            {p.formatLabel}
          </p>
          <h1 className="display text-3xl sm:text-4xl">
            {cp?.name ?? p.name} <span className="text-fg-2">{p.size}</span>
          </h1>
          {cp && <p className="mt-3 max-w-xl text-fg-2">{cp.description}</p>}

          <div className="mt-8 flex items-center justify-between rounded-lg border border-line bg-bg-1 p-4">
            <div>
              <p className="label">price</p>
              <p className="mono text-2xl">{p.available ? money(p.price) : "coming soon"}</p>
            </div>
            <AddToCart sku={p.sku} disabled={!p.available} />
          </div>

          <h2 className="label mt-10 mb-2">specification</h2>
          <dl>
            <div className="spec"><dt>sku</dt><dd>{p.sku}</dd></div>
            <div className="spec"><dt>format</dt><dd>{p.formatLabel}{p.sprays ? ` · ${p.sprays} metered sprays` : ""}</dd></div>
            <div className="spec"><dt>net content</dt><dd>{p.size || "see label"}</dd></div>
            {cp?.sequence && (
              <div className="spec">
                <dt>sequence</dt>
                <dd>{cp.verified ? cp.sequence : <span className="text-fg-3">on file · pending verification against lot COA</span>}</dd>
              </div>
            )}
            {cp && (
              <>
                <div className="spec"><dt>CAS</dt><dd>{cp.verified && cp.cas ? cp.cas : <span className="text-fg-3">pending verification</span>}</dd></div>
                <div className="spec"><dt>mass</dt><dd>{cp.verified && cp.mass ? `${cp.mass} g/mol` : <span className="text-fg-3">pending verification</span>}</dd></div>
              </>
            )}
            <div className="spec"><dt>form</dt><dd>{p.format === "vial" ? "Lyophilized powder, sealed glass vial" : p.format === "nasal_spray" ? "Solution in metered spray bottle, supplied without label" : "Sterile, individually packaged"}</dd></div>
            <div className="spec"><dt>storage</dt><dd>{p.format === "vial" ? "Sealed, 2–8 °C, protected from light" : p.format === "nasal_spray" ? "2–8 °C, protected from light" : "Room temperature, dry"}</dd></div>
            <div className="spec"><dt>ships</dt><dd>{site.shipsTo}</dd></div>
            <div className="spec"><dt>intended use</dt><dd className="text-fg-2">In-vitro laboratory research only</dd></div>
          </dl>

          <h2 className="label mt-10 mb-2">lab reports for this sku</h2>
          {lots.length ? (
            <ul className="space-y-2">
              {lots.map((l) => (
                <li key={l.lot} className="flex flex-wrap items-baseline gap-x-3">
                  <Link href={`/coa/${l.lot}`} className="mono text-sm underline underline-offset-4 hover:text-accent">lot {l.lot}</Link>
                  <span className="mono text-[11px] text-fg-3">{l.lab} · {l.method} · {l.purity != null ? `${l.purity}% purity` : "see report"} · {l.reportDate}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="max-w-xl text-sm text-fg-3">
              {p.coa_ref
                ? "The supplier's certificate for this SKU is on file and publishes here once its lot number, lab and method are confirmed."
                : "A certificate of analysis has been requested from the supplier for this SKU. It will not ship without one."}
            </p>
          )}

          {p.format === "nasal_spray" && (
            <p className="mt-8 rounded-lg border border-line bg-bg-1 p-4 text-sm text-fg-2">
              Supplied unlabeled by the manufacturer. A research-use-only identification label listing compound, content, lot and this statement is applied before shipment.
            </p>
          )}

          <p className="mono mt-8 text-[11px] leading-relaxed text-fg-3">{RUO_STATEMENT}</p>
        </div>

        {/* Visual column */}
        <div>
          <div className="sticky top-24 space-y-4">
            <div className="relative h-72 overflow-hidden rounded-lg border border-line bg-bg-1 sm:h-96">
              <GlyphField sequence={cp?.sequence?.replace(/[^A-Za-z]/g, "")} accent={accent} density={13} />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-3">
                <span className="label">{cp?.sequence ? `${cp.sequence.replace(/[^A-Za-z]/g, "").length} residues · glyph field` : "glyph field"}</span>
                <span className="mono text-[11px] text-fg-3">{p.sku}</span>
              </div>
            </div>
            {siblings.length > 0 && (
              <div className="rounded-lg border border-line bg-bg-1 p-4">
                <p className="label mb-3">other formats of {cp?.name}</p>
                <ul className="space-y-1.5">
                  {siblings.map((s) => (
                    <li key={s.sku} className="flex items-center justify-between text-sm">
                      <Link href={`/products/${s.sku}`} className="hover:text-accent">
                        {s.size} · {s.formatLabel.toLowerCase()}
                      </Link>
                      <span className="mono text-fg-2">{s.available ? money(s.price) : "soon"}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
