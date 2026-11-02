import type { Metadata } from "next";
import Link from "next/link";
import Crumbs from "@/components/Crumbs";
import JsonLd from "@/components/JsonLd";
import { site, RUO_STATEMENT } from "@/lib/site";

export const metadata: Metadata = {
  title: "Compliance · how research-use-only works here",
  description:
    "The legal framework for research-use-only peptides in the United States, with statute citations, FDA enforcement context as of October 2026, and the controls this store applies.",
  alternates: { canonical: "/compliance" },
};

const UPDATED = "2026-10-31";

export default function Compliance() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Compliance",
          url: `${site.url}/compliance`,
          dateModified: UPDATED,
          about: "Research-use-only chemical sales in the United States",
        }}
      />
      <Crumbs items={[{ label: "compliance" }]} />
      <p className="label mb-2">updated {UPDATED}</p>
      <h1 className="display text-3xl">Compliance</h1>
      <p className="mt-3 max-w-2xl text-fg-2">
        What the law says, what the agency has done, and what this store does about it. Statute, enforcement and
        our own policy are kept separate below so each can be checked on its own.
      </p>

      <div className="prose mt-8">
        <h2>1. What "research use only" means in law</h2>
        <p>
          Under the Federal Food, Drug, and Cosmetic Act, an article is a <em>drug</em> when it is intended for use in the
          diagnosis, cure, mitigation, treatment or prevention of disease, or intended to affect the structure or any
          function of the body (<a href="https://www.law.cornell.edu/uscode/text/21/321" rel="noopener" target="_blank">21 U.S.C. § 321(g)(1)</a>).
          A new drug may not be introduced into interstate commerce without an approved application
          (<a href="https://www.law.cornell.edu/uscode/text/21/355" rel="noopener" target="_blank">21 U.S.C. § 355(a)</a>). Intended use is
          determined from the seller's objective conduct: labeling, advertising, website content and the circumstances of
          sale (<a href="https://www.ecfr.gov/current/title-21/chapter-I/subchapter-C/part-201/subpart-A/section-201.128" rel="noopener" target="_blank">21 C.F.R. § 201.128</a>).
        </p>
        <p>
          A research chemical sold for in-vitro laboratory use, with no claim or implication of use in humans or animals,
          falls outside that definition. The label by itself settles nothing. The seller's whole conduct does.
        </p>

        <h2>2. What the FDA has done, as of {UPDATED}</h2>
        <table>
          <thead>
            <tr><th>date</th><th>action</th><th>what the agency relied on</th></tr>
          </thead>
          <tbody>
            <tr>
              <td className="whitespace-nowrap">Dec 2024 – Oct 2026</td>
              <td>Warning letters to roughly two dozen online peptide sellers using research-only disclaimers, including letters dated 31 Mar 2026 (seven sellers), 17 Jun 2026 and 24 Aug 2026 (five sellers, posted 1 Sep).</td>
              <td>Website text describing physiological outcomes; category names and blog content; coded product names; reconstitution guides and dose calculators; bacteriostatic water, syringes and nasal formats sold alongside peptides; testimonials and social media. The agency's stated position is that this conduct establishes intended human use regardless of the RUO label.</td>
            </tr>
            <tr>
              <td className="whitespace-nowrap">Aug 2026</td>
              <td>Eli Lilly filed suit against six online sellers of retatrutide, an investigational compound with no approved product anywhere.</td>
              <td>Trademark and false-advertising theories against sellers marketing the compound by name and function.</td>
            </tr>
            <tr>
              <td className="whitespace-nowrap">Apr – Jul 2026</td>
              <td>FDA removed twelve peptides from the § 503A Category 2 list; the Pharmacy Compounding Advisory Committee reviewed several on 23–24 Jul 2026.</td>
              <td>This concerns the pathway for licensed compounding pharmacies working from prescriptions. It changes nothing about research-chemical retail, and nothing here is compounded or dispensed.</td>
            </tr>
          </tbody>
        </table>
        <p>
          Primary sources: the letters are published in the FDA warning letter database at fda.gov; the Federal Register
          notice of 16 Apr 2026 announces the PCAC meeting. Dates above are letter dates unless noted.
        </p>

        <h2>3. What this store does</h2>
        <ul>
          <li><strong>No usage content.</strong> No dosing, reconstitution, cycling, stacking or protocol information appears anywhere on the site, in emails, or in support replies. We decline those questions.</li>
          <li><strong>No outcome language.</strong> Product and compound pages carry identity data (sequence, mass, CAS, lot report) and literature context only. Supplier marketing categories were replaced by chemistry-based classes.</li>
          <li><strong>Access controls.</strong> A {site.minimumAge}+ gate at entry. A four-part researcher attestation at checkout, recorded with timestamp and IP, including an undertaking not to administer materials to any human or animal.</li>
          <li><strong>Labeling.</strong> Every vial and every applied label carries: "{RUO_STATEMENT}"</li>
          <li><strong>Lab reports.</strong> No SKU ships without a lot-specific certificate of analysis published at <Link href="/coa">/coa</Link>.</li>
          <li><strong>Accessories.</strong> Bacteriostatic water, syringes and needles are listed under laboratory supplies, are never cross-sold or bundled with peptides in the interface, and carry the same research-only terms.</li>
          <li><strong>No reviews, testimonials or user content.</strong></li>
          <li><strong>Geography.</strong> {site.shipsTo}. We decline orders to jurisdictions where a listed compound is restricted by state law, and we review that list quarterly.</li>
          <li><strong>Counsel.</strong> Site content and catalog changes are reviewed against this page before publication.</li>
        </ul>

        <h2>4. Compounds with specific notes</h2>
        <p>
          Several catalog items correspond to approved prescription drugs (semaglutide, tirzepatide, tesamorelin, oxytocin,
          bremelanotide) or to investigational drugs (retatrutide, cagrilintide, elamipretide, cibinetide). Research-grade
          material sold here is not any of those products, is not manufactured under cGMP, and is not interchangeable
          with them. Each compound page lists its own regulatory notes.
        </p>

        <h2>5. Questions and reports</h2>
        <p>
          Regulatory correspondence: <a href={`mailto:${site.email}`}>{site.email}</a>. We respond to agency inquiries
          within the stated window and remove any listing on request while a question is open.
        </p>
        <p className="text-fg-3">
          This page is a statement of policy and a summary of public record. It is not legal advice.
        </p>
      </div>
    </>
  );
}
