import type { Metadata } from "next";
import Link from "next/link";
import Crumbs from "@/components/Crumbs";
import { LOTS } from "@/data/lots";
import { compoundBySlug } from "@/data/compounds";

export const metadata: Metadata = {
  title: "Lab data · certificates of analysis",
  description: "Every lot sold here, with its lab, method, purity figure and report. Independent certificates of analysis for research-use-only peptides.",
  alternates: { canonical: "/coa" },
};

export default function CoaIndex() {
  return (
    <>
      <Crumbs items={[{ label: "lab data" }]} />
      <h1 className="display text-3xl">Lab data</h1>
      <p className="mt-3 max-w-2xl text-fg-2">
        One row per lot. The lab, the method, the purity figure and the report. A SKU with no row here does not ship.
      </p>

      <div className="prose mt-8 max-w-3xl">
        <h2>How we read a certificate</h2>
        <p>
          A certificate of analysis is the lab's statement about a specific lot. The fields we check before a lot is listed:
          the lab's name and address, the analysis date, the method (HPLC-UV for purity, mass spectrometry for identity),
          the observed mass against the expected mass for the stated sequence, the purity figure, and the net content
          where it was measured. A report missing any of these sits in the queue until the supplier supplies it.
        </p>
      </div>

      <div className="mt-10 overflow-x-auto rounded-lg border border-line">
        <table className="mono w-full text-[12.5px]">
          <thead>
            <tr className="label border-b border-line bg-bg-1 text-left">
              <th className="px-3 py-2 font-medium">lot</th>
              <th className="px-3 py-2 font-medium">compound</th>
              <th className="px-3 py-2 font-medium">lab</th>
              <th className="px-3 py-2 font-medium">method</th>
              <th className="px-3 py-2 font-medium">purity</th>
              <th className="px-3 py-2 font-medium">date</th>
            </tr>
          </thead>
          <tbody>
            {LOTS.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-fg-3">
                  No lots published yet. The first lots list here the day they are received and their certificates are checked.
                </td>
              </tr>
            )}
            {LOTS.map((l) => (
              <tr key={l.lot} className="border-t border-line hover:bg-bg-1">
                <td className="px-3 py-2"><Link href={`/coa/${l.lot}`} className="underline underline-offset-4 hover:text-accent">{l.lot}</Link></td>
                <td className="px-3 py-2">{compoundBySlug(l.compoundSlug)?.name ?? l.compoundSlug}</td>
                <td className="px-3 py-2">{l.lab}</td>
                <td className="px-3 py-2">{l.method}</td>
                <td className="px-3 py-2">{l.purity != null ? `${l.purity}%` : "—"}</td>
                <td className="px-3 py-2">{l.reportDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
