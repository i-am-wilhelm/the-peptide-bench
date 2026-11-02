import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Crumbs from "@/components/Crumbs";
import Trace from "@/components/Trace";
import GlyphField from "@/components/GlyphField";
import JsonLd from "@/components/JsonLd";
import { LOTS, lotById } from "@/data/lots";
import { CLASSES, CLASS_HEX, compoundBySlug } from "@/data/compounds";
import { productBySku } from "@/lib/catalog";
import { site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return LOTS.map((l) => ({ lot: l.lot }));
}

export async function generateMetadata({ params }: { params: Promise<{ lot: string }> }): Promise<Metadata> {
  const { lot } = await params;
  const l = lotById(lot);
  if (!l) return {};
  const cp = compoundBySlug(l.compoundSlug);
  return {
    title: `Lot ${l.lot} · ${cp?.name ?? l.compoundSlug} · certificate of analysis`,
    description: `${l.lab}, ${l.method}, ${l.reportDate}. ${l.purity != null ? `${l.purity}% purity.` : ""}`,
    alternates: { canonical: `/coa/${l.lot}` },
  };
}

export default async function LotPage({ params }: { params: Promise<{ lot: string }> }) {
  const { lot } = await params;
  const l = lotById(lot);
  if (!l) notFound();
  const cp = compoundBySlug(l.compoundSlug);
  const accent = cp ? CLASS_HEX[cp.class] : "#5ef2e6";

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: `Certificate of analysis · lot ${l.lot}`,
          description: `${cp?.name ?? l.compoundSlug}, ${l.method}, ${l.lab}, ${l.reportDate}`,
          url: `${site.url}/coa/${l.lot}`,
          creator: { "@type": "Organization", name: l.lab },
          dateCreated: l.reportDate,
          ...(l.reportUrl ? { distribution: { "@type": "DataDownload", contentUrl: l.reportUrl, encodingFormat: "application/pdf" } } : {}),
        }}
      />
      <Crumbs items={[{ href: "/coa", label: "lab data" }, { label: `lot ${l.lot}` }]} />
      <p className="label mb-2" style={{ color: accent }}>certificate of analysis</p>
      <h1 className="display text-3xl">
        {cp?.name ?? l.compoundSlug} <span className="mono text-fg-2">lot {l.lot}</span>
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <dl>
            <div className="spec"><dt>lab</dt><dd>{l.lab}</dd></div>
            <div className="spec"><dt>report date</dt><dd>{l.reportDate}</dd></div>
            <div className="spec"><dt>method</dt><dd>{l.method}</dd></div>
            <div className="spec"><dt>purity</dt><dd>{l.purity != null ? `${l.purity}%` : "—"}</dd></div>
            {l.expectedMass && <div className="spec"><dt>expected mass</dt><dd>{l.expectedMass} Da</dd></div>}
            {l.observedMass && <div className="spec"><dt>observed mass</dt><dd>{l.observedMass} Da</dd></div>}
            {l.netContent && <div className="spec"><dt>net content</dt><dd>{l.netContent}</dd></div>}
            {l.endotoxin && <div className="spec"><dt>endotoxin</dt><dd>{l.endotoxin}</dd></div>}
            <div className="spec">
              <dt>skus</dt>
              <dd className="flex flex-wrap gap-x-3 gap-y-1">
                {l.skus.map((s) => (
                  <Link key={s} href={`/products/${s}`} className="underline underline-offset-4 hover:text-accent">
                    {productBySku(s)?.title ?? s}
                  </Link>
                ))}
              </dd>
            </div>
          </dl>
          {l.reportUrl && (
            <a href={l.reportUrl} className="btn btn-primary mt-6" target="_blank" rel="noopener">
              open report pdf
            </a>
          )}
          {l.notes && <p className="mt-6 text-sm text-fg-2">{l.notes}</p>}
        </div>
        <div className="space-y-4 lg:col-span-3">
          {l.traces?.length ? (
            l.traces.map((t, i) => <Trace key={i} trace={t} accent={accent} />)
          ) : (
            <div className="relative h-64 overflow-hidden rounded-lg border border-line bg-bg-1">
              <GlyphField sequence={cp?.sequence?.replace(/[^A-Za-z]/g, "")} accent={accent} density={13} />
              <span className="label absolute bottom-3 left-3">instrument trace publishes when digitized from the report</span>
            </div>
          )}
          {cp && (
            <p className="text-sm text-fg-3">
              Compound identity page: <Link href={`/compounds/${CLASSES[cp.class].slug}/${cp.slug}`} className="underline underline-offset-4 hover:text-accent">{cp.name}</Link>
            </p>
          )}
        </div>
      </div>
    </>
  );
}
