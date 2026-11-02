import type { Metadata } from "next";
import Crumbs from "@/components/Crumbs";
import { site, RUO_STATEMENT } from "@/lib/site";

export const metadata: Metadata = { title: "Terms of sale", alternates: { canonical: "/terms" } };

export default function Terms() {
  return (
    <>
      <Crumbs items={[{ label: "terms of sale" }]} />
      <div className="prose max-w-3xl">
        <p className="label">effective 2026-10-31 · draft for counsel review</p>
        <h1 className="display text-3xl">Terms of sale</h1>
        <h2>1. Parties and acceptance</h2>
        <p>These terms govern every sale by {site.legalName} ("we") through {site.domain}. Placing an order is acceptance of these terms and of the attestations made at checkout.</p>
        <h2>2. Research use only</h2>
        <p>{RUO_STATEMENT} The purchaser represents that it is purchasing for in-vitro laboratory research, that it is at least {site.minimumAge} years of age, that it has the training and facilities to handle research chemicals, and that it will not administer or permit the administration of any material to any human or animal. We may refuse or cancel any order where these representations appear untrue.</p>
        <h2>3. No warranty of fitness</h2>
        <p>Materials are supplied as described on the lot certificate of analysis. We make no warranty of merchantability or fitness for any purpose beyond conformity with that certificate. Identity and purity figures are the issuing laboratory's statements about the lot.</p>
        <h2>4. Pricing, payment and taxes</h2>
        <p>Prices are in US dollars and may change without notice; the price at order time governs. Orders ship after payment clears. Applicable sales tax is the purchaser's responsibility where we are not required to collect it.</p>
        <h2>5. Shipping</h2>
        <p>{site.shipsTo}. Street addresses only for temperature-sensitive items. Risk of loss passes on delivery to the carrier. We are not responsible for delays after tender to the carrier or for refusal by a carrier to transport a restricted item to a given address.</p>
        <h2>6. Returns</h2>
        <p>Temperature-sensitive research materials are not returnable. Materials damaged in transit or not matching the enclosed certificate are replaced or refunded on report within 7 days of delivery with photographs of the vial, label and packaging. Unopened laboratory supplies may be returned within 14 days at the purchaser's shipping cost.</p>
        <h2>7. Indemnity and limitation</h2>
        <p>The purchaser indemnifies us against claims arising from its use, handling, storage or disposal of materials. Our total liability for any order is limited to the amount paid for that order. We are not liable for indirect or consequential loss.</p>
        <h2>8. Compliance and cancellation</h2>
        <p>We may cancel any order, suspend any account and decline future sales where we believe materials may be used outside the terms above, or where a shipment would be unlawful at the destination. Cancelled orders are refunded in full.</p>
        <h2>9. Governing law</h2>
        <p>These terms are governed by the laws of the State of {site.state}, with venue in its courts.</p>
        <h2>10. Contact</h2>
        <p><a href={`mailto:${site.email}`}>{site.email}</a></p>
      </div>
    </>
  );
}
