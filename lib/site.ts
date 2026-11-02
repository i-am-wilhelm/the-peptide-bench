/**
 * Single source of truth for brand and operating facts.
 * Rename the store here; every page, schema block and the llms.txt read from this file.
 */
export const site = {
  name: "The Peptide Bench",
  shortName: "The Peptide Bench",
  tagline: "Research-use-only peptides with the lab data up front.",
  domain: "thepeptidebench.com",
  url: "https://thepeptidebench.com",
  email: "orders@thepeptidebench.com",
  // Entity name is a placeholder until formation.
  legalName: "The Peptide Bench LLC",
  state: "Arizona",
  country: "US",
  foundedYear: 2026,
  minimumAge: 21,
  shipsTo: "United States only",
  // Supplier facts from the Aspen Wholesale sheet.
  supplier: {
    shippingFlat: 35,
    freeShippingOver: 300,
  },
  /**
   * Retail pricing rule applied to supplier tier-1 (1-25) cost.
   * Placeholder until the competitive pricing table is in. Adjust per class later.
   */
  pricing: {
    defaultMultiplier: 2.0,
    classMultipliers: {} as Record<string, number>,
    roundTo: 1, // round up to the nearest dollar
  },
  builder: {
    name: "Websites by Wilhelm",
    url: "https://advancinglibertymedia.com",
    person: "Michael Wilhelm",
  },
  social: {} as Record<string, string>,
} as const;

export const RUO_STATEMENT =
  "For laboratory research use only. Not for human or veterinary use. Not for use in diagnostic procedures. Not a drug, food, cosmetic or dietary supplement.";
