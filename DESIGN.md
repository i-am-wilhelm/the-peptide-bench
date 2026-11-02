# Design direction (v1, Oct 31 2026)

Working brief for the storefront. Refine freely; this is the starting frame the build prompt will reference.

## Position

Clinical cyberpunk. The lab wing of Blade Runner 2049, the restraint of an Aesop store, the data density of a spec sheet. Futuristic through precision and material, never through sci-fi costume.

Audience: post-looksmaxx. They already know the compounds, the labs, the Reddit threads. The site respects that by showing data and skipping persuasion. Every page reads like it was built by someone who tests what they sell.

Compliance is baked into the aesthetic: molecules, glass, traces and type carry the whole visual language. No bodies, no faces, no physiques, no before/after, no lifestyle photography. That rule is taste and it is also the FDA line.

## Palette

- Base: near-black with a cool undertone (around #0B0D10), surfaces stepping up through #12151A and #1A1E25. Dark glass and brushed metal textures, used sparingly.
- Text: phosphor white (#E8ECEF) for body, cooler grey (#8B949E) for secondary.
- Primary accent: one electric tone, cyan-leaning (around #5EF2E6). Used for focus, data highlights, the active lot.
- Class accents, muted neon, one per compound class (incretins, GH secretagogues, tissue repair, copper peptides, mitochondrial, neuropeptides, melanocortins, bioregulators, immune, lab supplies). Low saturation at rest, full on hover.
- RGB chromatic fringing on the glyph dither only. Nowhere else.

## Type

- Display and UI: a technical grotesk (Geist, Space Grotesk or Inter Tight). Tight tracking on headlines, generous on labels.
- Data: a monospace (Geist Mono or JetBrains Mono) for sequences, lot numbers, purity figures, masses, dates, CAS numbers. If it's a measurement, it's mono.
- No sci-fi display faces. The futurism comes from the grid and the data, never from the letterforms.

## Imagery

- Amino acid glyph dither: the site's character set is the 20 single-letter amino acid codes. Each compound hero resolves from its own sequence into a wireframe molecular render.
- COA traces as art: HPLC chromatograms and mass spectra drawn as the constellation layer, from the real lot data.
- Product photography: vials on dark glass, hard single-source light, shallow depth. Sprays and supplies shot the same way.
- Iconography: thin-line, geometric, monochrome. Hermes as the house mark (messenger, signaling). No caduceus, no rod of Asclepius, no DNA helix cliché.

## Motion

- Resolve-from-glyph on load; subtle scanline or glitch only on hover over data elements.
- Timing on the house 7/8 pulse, slow enough that it reads as breath rather than beat.
- prefers-reduced-motion fully respected; the site is complete with motion off.

## Layout and UI

- Product cards as spec sheets: name, sequence, format, mass, purity, lot, COA link. Add-to-cart lives below the data.
- Product pages in two columns: data and lot history on one side, the glyph render and trace on the other. COA viewer inline, per lot, with lab name and date.
- Checkout flow terminal-adjacent: 21+ gate, researcher attestation, terms acceptance, each a single clean step.
- Navigation by compound class, with supplier marketing categories gone.
- Chrome carries the personality: colophon, 404, empty cart, footer. Product pages stay pure.

## Voice

Terse, declarative, spec-sheet English. Labels lowercase where it reads cleanly. Zero adjectives about effects. The only claims on the site are measurements with a lab's name next to them.

## SEO / GEO layer (carried over from the Euphoria pattern, now a house standard)

- Full SSR, clean semantic HTML, fast on Cloudflare.
- One question per URL for learn content, each with a named author and reviewer at launch. No "pending" placeholders anywhere.
- Compound pages with Product, FAQPage and MolecularEntity schema; sequence, CAS and molecular mass in structured data.
- Per-lot COA pages, indexable, with lab name, date and method.
- Statute-cited legality and compliance page, dated, maintained.
- Etymology and nomenclature block per compound: name origin, aliases and research-literature names, so AI engines and searchers match on every variant.
- llms.txt at the root domain, sitemap by template type, robots.txt that leaves image and API paths crawlable.
- Colophon page with schema.org creator credit: A Website by Wilhelm.

## Guardrails that stay fixed through refinement

1. No human bodies or faces anywhere on the site.
2. No effect, benefit or outcome language in any copy, alt text, filename or metadata.
3. No dosing, reconstitution or protocol content, and no calculators.
4. Accessories never cross-sold against peptides in UI.
5. Every number on the site is a measurement with a source.
