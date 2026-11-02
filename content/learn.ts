/**
 * Learn pages. One question per URL. Identity, handling and documentation topics only.
 * Nothing here describes use in humans or animals, dosing, reconstitution or protocols.
 */

export interface LearnPage {
  slug: string;
  question: string;
  answer: string; // one-paragraph direct answer, used as the FAQ answer and meta description
  body: string[]; // paragraphs; lines starting with "## " become h2
  author: string;
  reviewer?: string;
  published: string;
  updated: string;
  related?: string[];
}

export const LEARN: LearnPage[] = [
  {
    slug: "what-does-research-use-only-mean",
    question: "What does \"research use only\" mean on a peptide vial?",
    answer:
      "Research use only (RUO) identifies a chemical sold for in-vitro laboratory work, outside the drug, food, cosmetic and supplement categories. In US law the label alone does not decide the category; the seller's entire conduct does. An RUO product is not manufactured under cGMP, is not approved for any use in people or animals, and is sold only to purchasers who attest to laboratory use.",
    body: [
      "The phrase comes from laboratory supply. Reagent catalogs have carried it for decades to mark materials sold for bench work rather than for any regulated end use. On a peptide vial it means the same thing: the contents are a chemical standard for experiments, with a certificate of analysis describing what is in the vial and at what purity.",
      "## Where the line sits in US law",
      "The Federal Food, Drug, and Cosmetic Act defines a drug by intended use (21 U.S.C. § 321(g)(1)). Intended use is read from objective evidence: labeling, advertising, website content, the way a product is sold and what is sold next to it (21 C.F.R. § 201.128). A seller who prints RUO on the label and then describes physiological effects, offers dosing guidance or sells administration supplies alongside the material has, in the agency's view, established a drug intended use. The 2024–2026 FDA warning letters to peptide vendors were built on exactly that reasoning.",
      "## What it means for a purchaser",
      "The material is for in-vitro work. It carries a lot-specific lab report. It is not sterile-filled under pharmaceutical conditions, has not been evaluated for safety in any organism, and is not interchangeable with an approved drug of the same name. Purchasers here attest to all of that at checkout and undertake not to administer the material to any human or animal.",
      "## What it means for this store",
      "We publish identity data and lab reports, and nothing about use. Our compliance page sets out the full policy and the enforcement record behind it.",
    ],
    author: "Michael Wilhelm",
    published: "2026-10-31",
    updated: "2026-10-31",
    related: ["how-to-read-a-certificate-of-analysis", "research-peptide-vs-prescription-drug"],
  },
  {
    slug: "how-to-read-a-certificate-of-analysis",
    question: "How do you read a peptide certificate of analysis?",
    answer:
      "A certificate of analysis (COA) is a lab's report on one lot. Read it in this order: the lab's identity and date, the method (HPLC for purity, mass spectrometry for identity), the observed mass against the expected mass for the stated sequence, the purity percentage, and the net content if measured. A COA missing the lab's name, the lot number or the method is not a usable report.",
    body: [
      "## 1. Who ran it and when",
      "A credible report names the laboratory, gives a report date and a lot or batch number that matches the vial. A supplier's own in-house report is weaker evidence than a third-party lab's, because the party selling the material is also the party vouching for it.",
      "## 2. Identity: mass spectrometry",
      "The report should state an expected molecular mass for the declared sequence and an observed mass from the instrument. They should agree within the instrument's tolerance, typically a fraction of a dalton for monoisotopic mass or a few daltons for average mass. If the observed mass does not match the sequence on the label, the vial is not what it says it is, whatever the purity figure reads.",
      "## 3. Purity: HPLC",
      "High-performance liquid chromatography separates the main peptide from related impurities (truncated or deletion sequences, oxidation products, residual protecting groups). The purity figure is the area of the main peak as a percentage of total peak area, usually measured by UV absorbance at 214 or 220 nm. Note the wavelength and the column conditions if stated; purity figures from different methods are not directly comparable.",
      "## 4. Quantity",
      "Net content (how many milligrams are in the vial) is a separate measurement from purity and is often omitted. When it is present it should be stated with its method. A vial labeled 10 mg at 99% purity contains about 9.9 mg of the target peptide only if the net content was actually 10 mg.",
      "## 5. Other fields",
      "Water content, counter-ion (acetate or TFA salt) and endotoxin level appear on more complete reports. Their absence is normal for research-grade material; their presence is a plus.",
      "## What we require before listing a lot",
      "Lab name, report date, lot number matching the vial, mass spectrometry identity, HPLC purity with wavelength. Every lot we sell is listed with those fields on the lab data page, with the report attached.",
    ],
    author: "Michael Wilhelm",
    published: "2026-10-31",
    updated: "2026-10-31",
    related: ["what-is-hplc-purity", "what-is-a-lyophilized-peptide"],
  },
  {
    slug: "what-is-a-lyophilized-peptide",
    question: "What is a lyophilized peptide?",
    answer:
      "A lyophilized peptide is a peptide that has been freeze-dried: dissolved, frozen, and dried under vacuum so the water sublimes and leaves a dry powder or cake in the vial. Lyophilization is the standard way to stabilize synthetic peptides for storage and shipping, because most peptides degrade far faster in solution than as a dry solid.",
    body: [
      "## Why peptides are freeze-dried",
      "Peptide bonds and side chains are vulnerable to hydrolysis, oxidation and aggregation in water. Removing the water at low temperature, without heating the material, preserves the sequence and the purity measured on the certificate of analysis. The dry cake that remains is what ships in a sealed glass vial.",
      "## What is in the vial besides the peptide",
      "Synthetic peptides are typically isolated as salts. The counter-ion is most often acetate or trifluoroacetate, depending on the purification method, and it contributes to the gross weight. Some suppliers add a bulking agent such as mannitol so the cake holds its shape; a complete certificate will say so. The net content on the label refers to the peptide itself unless stated otherwise.",
      "## Appearance",
      "A lyophilized cake is usually white to off-white. It can be a solid disc, a fluffy powder or a thin film depending on fill volume and freezing conditions. Appearance alone says nothing about purity; the certificate does.",
      "## Storage",
      "Sealed lyophilized peptides are stored cold (2–8 °C for short periods, −20 °C for long-term storage) and protected from light and moisture. Stability varies by sequence; cysteine-, methionine- and tryptophan-containing peptides are more sensitive to oxidation.",
    ],
    author: "Michael Wilhelm",
    published: "2026-10-31",
    updated: "2026-10-31",
    related: ["how-are-research-peptides-shipped-and-stored", "how-to-read-a-certificate-of-analysis"],
  },
  {
    slug: "how-are-research-peptides-shipped-and-stored",
    question: "How are research peptides shipped and stored?",
    answer:
      "Lyophilized peptides ship as sealed glass vials in insulated packaging; the dry form tolerates a few days at ambient temperature in transit. On arrival they are logged, inspected and stored sealed at 2–8 °C or −20 °C, protected from light. Solutions and sprays are stored cold from receipt. Shipments here go out from the supplier's facility to US street addresses with the lot's certificate enclosed.",
    body: [
      "## Transit",
      "Dry peptides are stable enough for standard ground or 2-day shipping in insulated mailers. Cold packs are added in warm months. Nasal spray formats, which are solutions, ship with cold packs year-round and are not left in transit over a weekend.",
      "## Receiving",
      "Check the vial seal and cap, match the lot number on the vial to the certificate enclosed, and record the receipt date. Any vial with a broken seal or a lot that does not match its certificate should be reported before it is stored.",
      "## Storage",
      "Sealed lyophilized vials: 2–8 °C for weeks, −20 °C for months, desiccated and dark. Allow a cold vial to reach room temperature before opening so condensation does not form on the cake. Solutions and sprays: 2–8 °C, dark, used within the period stated on the certificate or supplier sheet.",
      "## Our shipping terms",
      "United States only, street addresses only for temperature-sensitive items, flat shipping with the fee waived over the stated threshold. Full terms on the shipping page.",
    ],
    author: "Michael Wilhelm",
    published: "2026-10-31",
    updated: "2026-10-31",
    related: ["what-is-a-lyophilized-peptide"],
  },
  {
    slug: "what-is-hplc-purity",
    question: "What does HPLC purity mean on a peptide report?",
    answer:
      "HPLC purity is the share of a sample that is the target peptide, as measured by high-performance liquid chromatography. The sample is pushed through a column that separates molecules by their interaction with the column material, a UV detector records each component as a peak, and purity is the main peak's area divided by the total area of all peaks. A 98% figure means 98% of the UV-absorbing material eluting from the column was the main peak.",
    body: [
      "## What the number includes and leaves out",
      "The figure counts peptide-like impurities that absorb at the detection wavelength: deletion sequences, truncated chains, oxidized variants, incompletely deprotected material. It does not count water, counter-ions or salts, because those do not absorb at 214–220 nm. That is why purity and net content are separate measurements.",
      "## Why wavelength matters",
      "Peptide bonds absorb near 214 nm; aromatic residues (Trp, Tyr, Phe) absorb near 280 nm. A report at 220 nm sees every peptide; a report at 280 nm sees only aromatic-containing species and can overstate purity for a sequence whose impurities lack aromatics. Reports should state the wavelength.",
      "## Reading the chromatogram",
      "A clean trace shows one dominant peak with a flat baseline. Shoulders on the main peak suggest closely related impurities (often a single-residue difference). Multiple small peaks before the main peak are commonly more polar fragments; peaks after it are commonly protected or hydrophobic variants. The report should list retention time and area for each.",
      "## Grades",
      "Research-grade peptides commonly report 95–99% purity. Figures above 99% appear on well-purified lots. A report with a round figure and no chromatogram attached deserves less weight than a lower figure with the trace shown.",
    ],
    author: "Michael Wilhelm",
    published: "2026-10-31",
    updated: "2026-10-31",
    related: ["how-to-read-a-certificate-of-analysis"],
  },
  {
    slug: "research-peptide-vs-prescription-drug",
    question: "What is the difference between a research peptide and a prescription drug with the same name?",
    answer:
      "The sequence may be identical; the product is not. A prescription drug is manufactured under current good manufacturing practice, sterile-filled in a controlled facility, formulated with defined excipients, released against a pharmacopeial specification and labeled for a specific use after FDA review. A research peptide is a chemical standard with a lot certificate, sold for laboratory work, with none of those controls and no approved use.",
    body: [
      "## Same molecule, different product",
      "Semaglutide, tirzepatide, tesamorelin, oxytocin and bremelanotide each exist as an FDA-approved drug and also appear in research catalogs. The research material is synthesized to the same sequence and characterized by HPLC and mass spectrometry. It is not made in a GMP facility, is not sterile-filled, has no formulation studies behind it, no stability program and no approved labeling. It is not a generic, a biosimilar or a substitute.",
      "## Investigational compounds",
      "Some catalog peptides (retatrutide, cagrilintide, elamipretide, cibinetide) are investigational: a company is studying them under an IND but no product is approved anywhere. Research-grade material of those sequences is a laboratory reagent with the same status as any other RUO chemical; the brand owner's trademarks and patents remain the brand owner's.",
      "## Why vendors are held to the distinction",
      "US drug law turns on intended use. A seller that describes a research peptide in the terms of the approved drug (indications, effects, dosing) has marketed an unapproved drug. That is the theory behind the 2024–2026 FDA warning letters and the 2026 brand-owner lawsuits against online sellers. This store publishes identity data only and treats the distinction as a hard rule.",
    ],
    author: "Michael Wilhelm",
    published: "2026-10-31",
    updated: "2026-10-31",
    related: ["what-does-research-use-only-mean"],
  },
];

export function learnBySlug(slug: string) {
  return LEARN.find((l) => l.slug === slug);
}
