# the-peptide-bench

Research-use-only peptide storefront. Next.js 15 (App Router), Tailwind 4, static generation, Cloudflare target.
Design and data rules live in `../design-direction.md`; the compliance posture is on `/compliance`.

## Run

```
npm install
npm run dev
```

## Where things live

| path | what |
| --- | --- |
| `lib/site.ts` | Brand, domain, email, entity, pricing rule, builder credit. Rename the store here. |
| `data/catalog.json` | Aspen Wholesale catalog (130 SKUs, five cost tiers). Regenerate from the sheet with `scripts/` when it changes. |
| `data/compounds.ts` | Compound registry: class, sequence, CAS, mass, aliases, etymology, regulatory flags. `verified: false` hides identity fields until checked against a lot COA. |
| `data/lots.ts` | Certificates of analysis, one per lot. Empty at launch; product pages say so. |
| `content/learn.ts` | One-question-per-URL learn pages. |
| `lib/catalog.ts` | Joins catalog to compounds, computes retail price, exposes lookups. |
| `lib/payments.ts` | Payment provider adapter. `manualInvoice` is active until a high-risk gateway is underwritten. |
| `app/api/orders/route.ts` | Order intake: validates attestation and US address, re-prices server-side, calls the provider. Persist to D1 at launch. |
| `components/GlyphField.tsx` | Amino-acid glyph dither; seeded from each compound's sequence. |
| `components/Trace.tsx` | Renders measured HPLC/MS points only. Never synthetic. |

## Guardrails (fixed)

1. No human bodies or faces anywhere.
2. No effect, benefit or outcome language in copy, alt text, filenames or metadata.
3. No dosing, reconstitution or protocol content; no calculators.
4. Accessories never cross-sold against peptides in the UI.
5. Every number is a measurement with a source.

## Before first order

- Register thepeptidebench.com (done in config); point DNS at Cloudflare.
- Form the entity; update `legalName`, `email`.
- Verify each compound's sequence/CAS/mass against its COA and flip `verified: true`.
- Populate `data/lots.ts` from supplier COAs (lab, date, method, purity, report PDF under `public/coa/`).
- Replace the pricing placeholder (`pricing.defaultMultiplier`) with the competitive table from the research report.
- Choose and wire a high-risk payment provider in `lib/payments.ts`.
- Persist orders + attestations to Cloudflare D1 in `app/api/orders/route.ts`.
- Counsel review of `/compliance`, `/terms`, `/privacy`.
