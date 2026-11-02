import Link from "next/link";

export default function Crumbs({ items }: { items: Array<{ href?: string; label: string }> }) {
  return (
    <nav aria-label="Breadcrumb" className="mono mb-6 text-[11px] text-fg-3">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="hover:text-fg">
            ~
          </Link>
        </li>
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2">
            <span aria-hidden>/</span>
            {it.href ? (
              <Link href={it.href} className="hover:text-fg">
                {it.label}
              </Link>
            ) : (
              <span className="text-fg-2">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
