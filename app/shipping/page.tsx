import type { Metadata } from "next";
import Crumbs from "@/components/Crumbs";
import { money } from "@/lib/catalog";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Shipping and handling", alternates: { canonical: "/shipping" } };

export default function Shipping() {
  return (
    <>
      <Crumbs items={[{ label: "shipping" }]} />
      <div className="prose max-w-3xl">
        <h1 className="display text-3xl">Shipping and handling</h1>
        <dl className="not-prose mt-6">
          <div className="spec"><dt>ships to</dt><dd>{site.shipsTo}</dd></div>
          <div className="spec"><dt>rate</dt><dd>{money(site.supplier.shippingFlat)} flat · included on orders of {money(site.supplier.freeShippingOver)} or more</dd></div>
          <div className="spec"><dt>dispatch</dt><dd>1–2 business days after payment clears, from the supplier's US facility</dd></div>
          <div className="spec"><dt>packaging</dt><dd>Insulated mailer; cold packs for solutions and in warm months; plain outer carton</dd></div>
          <div className="spec"><dt>enclosed</dt><dd>Lot certificate of analysis for every item</dd></div>
          <div className="spec"><dt>addresses</dt><dd>Street addresses only for temperature-sensitive items</dd></div>
        </dl>
        <h2>On arrival</h2>
        <p>Match each vial's lot number to the enclosed certificate, inspect seals, and move lyophilized vials to cold storage. Report any mismatch or damage within 7 days with photographs.</p>
        <h2>Restricted destinations</h2>
        <p>We do not ship outside the United States. Where a state restricts a listed compound, that compound is withheld from orders to that state and the order is adjusted or refunded with notice.</p>
      </div>
    </>
  );
}
