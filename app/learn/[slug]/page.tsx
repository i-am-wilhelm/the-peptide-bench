import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Crumbs from "@/components/Crumbs";
import JsonLd from "@/components/JsonLd";
import { LEARN, learnBySlug } from "@/content/learn";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return LEARN.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const l = learnBySlug(slug);
  if (!l) return {};
  return { title: l.question, description: l.answer.slice(0, 158), alternates: { canonical: `/learn/${l.slug}` } };
}

export default async function LearnPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const l = learnBySlug(slug);
  if (!l) notFound();
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [{ "@type": "Question", name: l.question, acceptedAnswer: { "@type": "Answer", text: l.answer } }],
          },
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: l.question,
            url: `${site.url}/learn/${l.slug}`,
            datePublished: l.published,
            dateModified: l.updated,
            author: { "@type": "Person", name: l.author },
            ...(l.reviewer ? { reviewedBy: { "@type": "Person", name: l.reviewer } } : {}),
            publisher: { "@type": "Organization", name: site.name, url: site.url },
          },
        ]}
      />
      <Crumbs items={[{ href: "/learn", label: "learn" }, { label: l.slug.replace(/-/g, " ") }]} />
      <article className="max-w-3xl">
        <h1 className="display text-3xl">{l.question}</h1>
        <p className="label mt-3">
          {l.author}
          {l.reviewer ? ` · reviewed by ${l.reviewer}` : ""} · published {l.published} · updated {l.updated}
        </p>
        <p className="mt-6 border-l-2 border-accent pl-4 text-base text-fg">{l.answer}</p>
        <div className="prose mt-6">
          {l.body.map((p, i) =>
            p.startsWith("## ") ? <h2 key={i}>{p.slice(3)}</h2> : <p key={i}>{p}</p>,
          )}
        </div>
        {l.related?.length ? (
          <aside className="mt-10 border-t border-line pt-5">
            <p className="label mb-2">related</p>
            <ul className="space-y-1 text-sm">
              {l.related.map((r) => {
                const t = learnBySlug(r);
                return t ? (
                  <li key={r}>
                    <Link href={`/learn/${r}`} className="underline underline-offset-4 hover:text-accent">{t.question}</Link>
                  </li>
                ) : null;
              })}
            </ul>
          </aside>
        ) : null}
      </article>
    </>
  );
}
