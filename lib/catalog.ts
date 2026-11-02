import raw from "@/data/catalog.json";
import { COMPOUNDS, CLASSES, findCompound, type Compound, type CompoundClass } from "@/data/compounds";
import { site } from "@/lib/site";

export type ProductFormat = "vial" | "nasal_spray" | "supply";

export interface RawProduct {
  sku: string;
  name: string;
  format: ProductFormat;
  sprays: number | null;
  research_class: string;
  supplier_categories: string[];
  coa_ref: string | null;
  coming_soon: boolean;
  cost: Record<string, number>;
  flags: string[];
}

export interface Product extends RawProduct {
  compound?: Compound;
  classKey: CompoundClass;
  className: string;
  classSlug: string;
  /** e.g. "10mg", "30mL", "10ct" */
  size: string;
  /** Tier-1 supplier cost. */
  cost1: number | null;
  /** Retail price in USD; null when supplier has no price. */
  price: number | null;
  available: boolean;
  formatLabel: string;
  /** Short data-only title without format noise, e.g. "BPC-157 · 10 mg · lyophilized vial" */
  title: string;
}

const FORMAT_LABEL: Record<ProductFormat, string> = {
  vial: "Lyophilized vial",
  nasal_spray: "Nasal spray (unlabeled)",
  supply: "Lab supply",
};

function extractSize(name: string): string {
  const m = name.match(/(\d+(?:\.\d+)?\s?(?:mg|mL|ml|mcg|ct))/i);
  if (m) return m[1].replace(/\s+/g, "").replace("ml", "mL");
  const blend = name.match(/(\d+\/\d+)/);
  return blend ? blend[1] : "";
}

function retail(cost1: number | null, cls: CompoundClass): number | null {
  if (cost1 == null) return null;
  const mult = site.pricing.classMultipliers[cls] ?? site.pricing.defaultMultiplier;
  const p = cost1 * mult;
  const step = site.pricing.roundTo;
  return Math.ceil(p / step) * step;
}

function build(): Product[] {
  const data = raw as { products: RawProduct[] };
  return data.products.map((p) => {
    const compound = findCompound(p.name);
    const classKey: CompoundClass = compound?.class ?? (p.format === "supply" ? "supply" : "mito");
    const cls = CLASSES[classKey];
    const cost1 = p.cost["1-25"] ?? null;
    const size = extractSize(p.name);
    const base = compound?.name ?? p.name;
    const title = [base, size, FORMAT_LABEL[p.format].toLowerCase()].filter(Boolean).join(" · ");
    return {
      ...p,
      compound,
      classKey,
      className: cls.name,
      classSlug: cls.slug,
      size,
      cost1,
      price: retail(cost1, classKey),
      available: !p.coming_soon && cost1 != null,
      formatLabel: FORMAT_LABEL[p.format],
      title,
    };
  });
}

export const PRODUCTS: Product[] = build();

export function productBySku(sku: string): Product | undefined {
  return PRODUCTS.find((p) => p.sku === sku);
}

export function productsByClass(slug: string): Product[] {
  return PRODUCTS.filter((p) => p.classSlug === slug);
}

export function productsByCompound(slug: string): Product[] {
  return PRODUCTS.filter((p) => p.compound?.slug === slug);
}

export function classBySlug(slug: string) {
  const entry = Object.entries(CLASSES).find(([, c]) => c.slug === slug);
  return entry ? { key: entry[0] as CompoundClass, ...entry[1] } : undefined;
}

export function compoundsInClass(key: CompoundClass): Compound[] {
  return COMPOUNDS.filter((c) => c.class === key && PRODUCTS.some((p) => p.compound?.slug === c.slug));
}

export const CLASS_LIST = (Object.keys(CLASSES) as CompoundClass[]).map((key) => ({
  key,
  ...CLASSES[key],
  count: PRODUCTS.filter((p) => p.classKey === key).length,
}));

export function money(n: number | null): string {
  if (n == null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}
