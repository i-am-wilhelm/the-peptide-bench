import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Crumbs from "@/components/Crumbs";
import ProductCard from "@/components/ProductCard";
import JsonLd from "@/components/JsonLd";
import { CLASS_LIST, classBySlug, compoundsInClass, productsByClass } from "@/lib/catalog";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return CLASS_LIST.filter((c) => c.count).map((c) => ({ class: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ class: string }> }): Promise<Metadata> {
  const { class: slug } = await params;
  const c = classBySlug(slug);
  if (!c) return {};
  return {
    title: c.name,
    description: `${c.summary} Research-use-only formats with sequence, mass and lot data.`,
    alternates: { canonical: `/compounds/${c.slug}` },
  };
}

export default async function ClassPage({ params }: { params: Promise<{ class: string }> }) {
  const { class: slug } = await params;
  const c = classBySlug(slug);
  if (!c) notFound();
  const compounds = compoundsInClass(c.key);
  const products = productsByClass(c.slug);
  const accent = `var(${c.cssVar})`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: c.name,
          url: `${site.url}/compounds/${c.slug}`,
          description: c.summary,
          hasPart: compounds.map((cp) => ({ "@type": "WebPage", name: cp.name, url: `${site.url}/compounds/${c.slug}/${cp.slug}` })),
        }}
      />
      <Crumbs items={[{ href: "/compounds", label: "compounds" }, { label: c.name.toLowerCase() }]} />
      <p className="label mb-2" style={{ color: accent }}>
        research class
      </p>
      <h1 className="display text-3xl">{c.name}</h1>
      <p className="mt-3 max-w-2xl text-fg-2">{c.summary}</p>

      <section className="mt-10">
        <h2 className="label mb-3">compounds in this class</h2>
        <ul className="flex flex-wrap gap-2">
          {compounds.map((cp) => (
            <li key={cp.slug}>
              <Link href={`/compounds/${c.slug}/${cp.slug}`} className="btn !py-1.5 !px-3">
                {cp.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="label mb-4">all formats · {products.length}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.sku} product={p} compact />
          ))}
        </div>
      </section>
    </>
  );
}
