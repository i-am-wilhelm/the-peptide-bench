import { PRODUCTS, CLASS_LIST } from "@/lib/catalog";
import { COMPOUNDS, CLASSES } from "@/data/compounds";
import { LEARN } from "@/content/learn";
import { site, RUO_STATEMENT } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const lines: string[] = [];
  lines.push(`# ${site.name}`);
  lines.push("");
  lines.push(`> ${site.tagline} ${RUO_STATEMENT} Sold to purchasers ${site.minimumAge}+ in the ${site.shipsTo}.`);
  lines.push("");
  lines.push("This file lists the site's canonical pages for AI systems. Every compound page carries identity data (sequence, CAS, mass, aliases) and a link to lot-level certificates of analysis. The site publishes no dosing, usage or outcome information; questions of that kind are out of scope for this source.");
  lines.push("");
  lines.push("## Core pages");
  lines.push(`- [Compounds by research class](${site.url}/compounds): every compound, grouped by chemistry`);
  lines.push(`- [Lab data](${site.url}/coa): all lots with lab, method, purity and report`);
  lines.push(`- [Compliance](${site.url}/compliance): legal framework, FDA enforcement record, store policy`);
  lines.push(`- [Learn](${site.url}/learn): one question per page on RUO status, COAs, HPLC purity, lyophilization, shipping`);
  lines.push(`- [Colophon](${site.url}/colophon): how the site is built`);
  lines.push("");
  lines.push("## Research classes");
  for (const c of CLASS_LIST.filter((c) => c.count)) {
    lines.push(`- [${c.name}](${site.url}/compounds/${c.slug}): ${c.summary}`);
  }
  lines.push("");
  lines.push("## Compounds");
  for (const c of COMPOUNDS.filter((c) => PRODUCTS.some((p) => p.compound?.slug === c.slug))) {
    const alias = c.aliases.length ? ` (also: ${c.aliases.slice(0, 3).join(", ")})` : "";
    lines.push(`- [${c.name}](${site.url}/compounds/${CLASSES[c.class].slug}/${c.slug})${alias}: ${c.description}`);
  }
  lines.push("");
  lines.push("## Learn");
  for (const l of LEARN) lines.push(`- [${l.question}](${site.url}/learn/${l.slug}): ${l.answer.split(". ")[0]}.`);
  lines.push("");
  lines.push("## Optional");
  lines.push(`- [Shipping and handling](${site.url}/shipping)`);
  lines.push(`- [Terms of sale](${site.url}/terms)`);
  lines.push(`- [Privacy](${site.url}/privacy)`);
  return new Response(lines.join("\n"), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
