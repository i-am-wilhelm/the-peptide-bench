import type { Metadata } from "next";
import Link from "next/link";
import Crumbs from "@/components/Crumbs";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Order received", robots: { index: false, follow: false } };

export default async function Confirmation({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order } = await searchParams;
  return (
    <>
      <Crumbs items={[{ label: "order received" }]} />
      <div className="max-w-xl rounded-lg border border-line bg-bg-1 p-8">
        <p className="label">order received</p>
        <h1 className="display mt-2 text-3xl">{order ?? "—"}</h1>
        <p className="mt-4 text-sm text-fg-2">
          An invoice with payment instructions is on its way to the email on the order. Materials ship from the supplier's facility once payment clears, with the lot's certificate of analysis enclosed. Questions: <a href={`mailto:${site.email}`} className="underline underline-offset-4">{site.email}</a>.
        </p>
        <Link href="/compounds" className="btn mt-6">back to compounds</Link>
      </div>
    </>
  );
}
