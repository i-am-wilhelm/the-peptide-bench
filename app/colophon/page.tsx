import type { Metadata } from "next";
import Crumbs from "@/components/Crumbs";
import JsonLd from "@/components/JsonLd";
import GlyphField from "@/components/GlyphField";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Colophon",
  description: `How ${site.name} is built: stack, data model, testing standard and who made it.`,
  alternates: { canonical: "/colophon" },
};

export default function Colophon() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: site.name,
          url: site.url,
          creator: { "@type": "Organization", name: site.builder.name, url: site.builder.url, founder: { "@type": "Person", name: site.builder.person } },
        }}
      />
      <Crumbs items={[{ label: "colophon" }]} />
      <div className="grid gap-10 lg:grid-cols-5">
        <div className="prose lg:col-span-3">
          <h1 className="display text-3xl">Colophon</h1>
          <p>
            This site is a research supply catalog built so the lab data sits in front of the price. Every design and
            engineering decision follows from that.
          </p>
          <h2>Data model</h2>
          <p>
            Three tables. <code>compounds</code> holds identity: name, class, sequence and modifications, CAS, formula, mass,
            aliases, name origin. <code>products</code> holds the supplier catalog: SKU, format, net content, tiered cost,
            retail rule. <code>lots</code> holds every certificate of analysis: lab, date, method, purity, observed and expected
            mass, trace data, report file. Pages are generated from those tables; nothing on a product page is typed by hand.
          </p>
          <h2>The glyph field</h2>
          <p>
            The character set in the background art is the twenty single-letter amino acid codes. On a compound page the
            field is seeded from that compound's own sequence, and the brighter path that resolves out of it is the
            backbone, one glyph per residue, drawn in sequence order. It is decoration built from the data rather than
            an illustration of the molecule.
          </p>
          <h2>Instrument traces</h2>
          <p>
            Where a lot's chromatogram or mass spectrum has been digitized from the report, it is drawn from the measured
            points. Where it has not, the page shows the glyph field. We do not draw synthetic curves.
          </p>
          <h2>Stack</h2>
          <ul>
            <li>Next.js (App Router) with static generation for every catalog, compound, lot and learn page</li>
            <li>Tailwind CSS 4 with a small token set: near-black base, phosphor white, one electric accent, one muted accent per research class</li>
            <li>Geist and Geist Mono; every measurement is set in the monospace face</li>
            <li>Cloudflare: Pages for the static output, Workers for the order API, D1 for orders and attestation records</li>
            <li>Schema.org structured data on every page: OnlineStore, Product, MolecularEntity, Dataset (lots), FAQPage and Article</li>
            <li><code>llms.txt</code> at the root, a sitemap split by template, and a robots file that leaves images and data crawlable</li>
          </ul>
          <h2>Standards</h2>
          <ul>
            <li>No SKU is listed without a lot certificate naming the lab, date and method.</li>
            <li>Identity fields (sequence, CAS, mass) display only after they have been checked against the lot report.</li>
            <li>No usage, outcome or testimonial content anywhere on the site.</li>
            <li>The site is complete with motion off. Animation honors <code>prefers-reduced-motion</code>.</li>
          </ul>
          <h2>Made by</h2>
          <p>
            Designed and built by <a href={site.builder.url} rel="noopener" target="_blank">{site.builder.name}</a>
            {" "}({site.builder.person}), {site.foundedYear}. The third regulated-category storefront on this system,
            after a hemp-cannabinoid store and a CBD store, each tuned to its category and its rulebook.
          </p>
        </div>
        <div className="lg:col-span-2">
          <div className="sticky top-24 overflow-hidden rounded-lg border border-line bg-bg-1">
            <div className="relative h-72">
              <GlyphField sequence="ACDEFGHIKLMNPQRSTVWY" density={14} />
              <span className="label absolute bottom-3 left-3">the twenty</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
