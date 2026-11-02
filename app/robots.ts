import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Images, data and lab reports stay crawlable. Only transactional routes are excluded.
      { userAgent: "*", allow: "/", disallow: ["/cart", "/checkout", "/api/orders"] },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
