import type { MetadataRoute } from "next";
import { PRODUCTS, CLASS_LIST } from "@/lib/catalog";
import { COMPOUNDS, CLASSES } from "@/data/compounds";
import { LOTS } from "@/data/lots";
import { LEARN } from "@/content/learn";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const u = (p: string) => `${site.url}${p}`;
  return [
    { url: u("/"), lastModified: now, priority: 1 },
    { url: u("/compounds"), lastModified: now, priority: 0.9 },
    { url: u("/coa"), lastModified: now, priority: 0.8 },
    { url: u("/learn"), lastModified: now, priority: 0.8 },
    { url: u("/compliance"), lastModified: now, priority: 0.7 },
    { url: u("/colophon"), lastModified: now, priority: 0.3 },
    { url: u("/shipping"), lastModified: now, priority: 0.3 },
    { url: u("/terms"), lastModified: now, priority: 0.2 },
    { url: u("/privacy"), lastModified: now, priority: 0.2 },
    ...CLASS_LIST.filter((c) => c.count).map((c) => ({ url: u(`/compounds/${c.slug}`), lastModified: now, priority: 0.8 })),
    ...COMPOUNDS.filter((c) => PRODUCTS.some((p) => p.compound?.slug === c.slug)).map((c) => ({
      url: u(`/compounds/${CLASSES[c.class].slug}/${c.slug}`),
      lastModified: now,
      priority: 0.8,
    })),
    ...PRODUCTS.map((p) => ({ url: u(`/products/${p.sku}`), lastModified: now, priority: 0.6 })),
    ...LOTS.map((l) => ({ url: u(`/coa/${l.lot}`), lastModified: new Date(l.reportDate), priority: 0.5 })),
    ...LEARN.map((l) => ({ url: u(`/learn/${l.slug}`), lastModified: new Date(l.updated), priority: 0.7 })),
  ];
}
