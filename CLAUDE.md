# The Peptide Bench — project memory

Research-use-only (RUO) peptide storefront, thepeptidebench.com, dropshipped from Aspen Wholesale. Next.js 15 App Router, React 19, Tailwind 4, TypeScript, static generation, deployed to Cloudflare Workers via OpenNext. Read `DESIGN.md` and `README.md` before changing anything.

## Why the codebase looks the way it does

FDA has sent two dozen warning letters to RUO peptide sites in 2024–2026 on the theory that website content, not the RUO label, proves intended human use. Stripe, Shopify Payments, PayPal and Square prohibit the category. Every rule below exists because of that.

## Guardrails (fixed, from DESIGN.md)

1. No human bodies or faces anywhere on the site.
2. No effect, benefit or outcome language in any copy, alt text, filename or metadata.
3. No dosing, reconstitution or protocol content, and no calculators.
4. Accessories (BAC water, syringes, needles) are never cross-sold, bundled or recommended alongside peptides in the UI.
5. Every number on the site is a measurement with a source.

## Working rules

- Identity fields in `data/compounds.ts` (sequence, sequenceNote, cas, formula, mass) change only when a lot COA is supplied to check against; flipping `verified: true` is the owner's call per compound.
- `data/lots.ts` entries are transcribed from real certificates only; `traces` hold measured points only; no synthetic data anywhere.
- Every price comes from `lib/site.ts` pricing rules applied to `data/catalog.json`; never hand-type a price.
- No reviews, testimonials, "related products", blog, chat widget, analytics trackers or newsletter popups without an explicit request; if one seems needed, ask.
- The age gate and the checkout attestation are not to be weakened or made skippable.
- Run `npm run build` and `npm run smoke` before every commit. The smoke test includes a banned-term scan on product pages.
- Commit messages are plain and specific; no emoji.

## Map

| path | owns |
| --- | --- |
| `lib/site.ts` | brand, domain, entity, pricing rule, builder credit |
| `data/catalog.json` | supplier catalog, 130 SKUs, five cost tiers (regenerate with `scripts/parse_aspen.py`) |
| `data/compounds.ts` | compound registry: class, identity, aliases, etymology, regulatory flags |
| `data/lots.ts` | certificates of analysis, one per lot |
| `content/learn.ts` | one-question-per-URL learn pages |
| `lib/catalog.ts` | joins catalog to compounds, computes retail, lookups |
| `lib/payments.ts` | payment provider adapter (`manualInvoice` until a high-risk gateway is wired) |
| `app/api/orders/route.ts` | order intake: validation, repricing, D1 insert when `DB` is bound |
| `components/GlyphField.tsx` | amino-acid glyph dither seeded from each compound's sequence |
| `components/Trace.tsx` | renders measured HPLC/MS points only |
| `scripts/smoke.mjs` | post-build smoke test |
| `.github/workflows/deploy.yml` | build, smoke, D1 migrate (when bound), OpenNext deploy on push to main |
| `wrangler.jsonc` | Worker config; D1 block stays commented until the database id is pasted in |

## Deploy

Push to `main` deploys. Secrets required in the GitHub repo: `CLOUDFLARE_API_TOKEN` (Workers Scripts:Edit, D1:Edit, Account Settings:Read) and `CLOUDFLARE_ACCOUNT_ID`. The D1 database is created once with `npx wrangler d1 create the-peptide-bench-orders`; paste its id into `wrangler.jsonc` and uncomment the block, after which the workflow applies migrations on every deploy.
