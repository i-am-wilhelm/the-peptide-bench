import Link from "next/link";
import { site, RUO_STATEMENT } from "@/lib/site";
import { CLASS_LIST } from "@/lib/catalog";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="display text-lg">{site.name}</p>
          <p className="mt-3 max-w-md text-sm text-fg-2">{RUO_STATEMENT}</p>
          <p className="mt-3 max-w-md text-sm text-fg-3">
            Statements on this site have not been evaluated by the Food and Drug Administration. Products are supplied as
            research materials with the lab report attached and are sold to qualified purchasers {site.minimumAge} years of age
            or older, {site.shipsTo}.
          </p>
        </div>
        <div>
          <p className="label mb-3">compounds</p>
          <ul className="space-y-1.5 text-sm text-fg-2">
            {CLASS_LIST.filter((c) => c.count).map((c) => (
              <li key={c.key}>
                <Link href={`/compounds/${c.slug}`} className="hover:text-fg">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="label mb-3">store</p>
          <ul className="space-y-1.5 text-sm text-fg-2">
            <li><Link href="/coa" className="hover:text-fg">Lab data</Link></li>
            <li><Link href="/learn" className="hover:text-fg">Learn</Link></li>
            <li><Link href="/compliance" className="hover:text-fg">Compliance</Link></li>
            <li><Link href="/shipping" className="hover:text-fg">Shipping &amp; handling</Link></li>
            <li><Link href="/terms" className="hover:text-fg">Terms of sale</Link></li>
            <li><Link href="/privacy" className="hover:text-fg">Privacy</Link></li>
            <li><Link href="/colophon" className="hover:text-fg">Colophon</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-[11px] text-fg-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span className="mono">
            © {new Date().getFullYear()} {site.legalName}. {site.state}, {site.country}.
          </span>
          <Link href="/colophon" className="mono hover:text-fg">
            A Website by Wilhelm
          </Link>
        </div>
      </div>
    </footer>
  );
}
