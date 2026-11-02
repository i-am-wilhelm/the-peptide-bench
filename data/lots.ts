/**
 * Certificate-of-analysis lot registry.
 *
 * Each entry is one supplier lot with its lab report. Product pages show the lots attached to their
 * SKU; /coa lists all lots; /coa/[lot] renders one. Trace arrays hold real instrument data points only.
 * When a lot has no trace data the page renders the glyph field instead, never a synthetic curve.
 *
 * Populate from Aspen's COA PDFs. Until then this list is empty and the UI says so plainly.
 */

export interface LotTrace {
  /** e.g. "HPLC-UV 214 nm" or "ESI-MS" */
  method: string;
  xLabel: string;
  yLabel: string;
  points: Array<[number, number]>;
}

export interface Lot {
  lot: string;
  skus: string[];
  compoundSlug: string;
  lab: string;
  reportDate: string; // ISO date
  method: string;
  purity: number | null; // percent
  observedMass?: number; // Da
  expectedMass?: number; // Da
  netContent?: string; // e.g. "10.2 mg"
  endotoxin?: string;
  reportUrl?: string; // path under /public/coa or external URL
  traces?: LotTrace[];
  notes?: string;
}

export const LOTS: Lot[] = [];

export function lotsForSku(sku: string): Lot[] {
  return LOTS.filter((l) => l.skus.includes(sku));
}

export function lotById(id: string): Lot | undefined {
  return LOTS.find((l) => l.lot === id);
}
