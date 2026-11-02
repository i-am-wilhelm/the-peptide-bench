import type { Metadata } from "next";
import Link from "next/link";
import Crumbs from "@/components/Crumbs";
import JsonLd from "@/components/JsonLd";
import { LEARN } from "@/content/learn";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Learn · identity, documentation and handling",
  description: "Plain answers on research-use-only status, certificates of analysis, HPLC purity, lyophilization and shipping. One question per page.",
  alternates: { canonical: "/learn" },
};

export default function LearnIndex() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          url: `${site.url}/learn`,
          mainEntity: LEARN.map((l) => ({
            "@type": "Question",
            name: l.question,
            url: `${site.url}/learn/${l.slug}`,
            acceptedAnswer: { "@type": "Answer", text: l.answer },
          })),
        }}
      />
      <Crumbs items={[{ label: "learn" }]} />
      <h1 className="display text-3xl">Learn</h1>
      <p className="mt-3 max-w-2xl text-fg-2">
        One question per page, answered in the first paragraph. Topics cover identity, documentation and handling of
        research materials. We do not publish usage information of any kind.
      </p>
      <ul className="mt-10 divide-y divide-line border-y border-line">
        {LEARN.map((l) => (
          <li key={l.slug} className="scan py-5">
            <Link href={`/learn/${l.slug}`} className="group block">
              <h2 className="display text-lg group-hover:text-accent">{l.question}</h2>
              <p className="mt-2 max-w-3xl text-sm text-fg-2">{l.answer}</p>
              <p className="label mt-3">
                {l.author} · updated {l.updated}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
