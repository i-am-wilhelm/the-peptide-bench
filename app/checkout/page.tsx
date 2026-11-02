"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Crumbs from "@/components/Crumbs";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/catalog";
import { site, RUO_STATEMENT } from "@/lib/site";
import { activeProvider } from "@/lib/payments";

type Step = 1 | 2 | 3;

export default function CheckoutPage() {
  const { items, subtotal, clear, hydrated } = useCart();
  const router = useRouter();
  const shipping = subtotal >= site.supplier.freeShippingOver ? 0 : site.supplier.shippingFlat;
  const [step, setStep] = useState<Step>(1);
  const [att, setAtt] = useState({ age: false, ruo: false, human: false, terms: false, organization: "", purpose: "" });
  const [ship, setShip] = useState({ name: "", organization: "", address1: "", address2: "", city: "", state: "", postal: "", email: "", phone: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const attOk = att.age && att.ruo && att.human && att.terms;
  const shipOk = ship.name && ship.address1 && ship.city && ship.state.length === 2 && ship.postal.length >= 5 && /.+@.+\..+/.test(ship.email);

  async function submit() {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          items: items.map((l) => ({ sku: l.sku, qty: l.qty, unitPrice: l.product.price })),
          subtotal,
          shipping,
          total: subtotal + shipping,
          attestation: {
            ageConfirmed: att.age,
            researchUseConfirmed: att.ruo,
            noHumanUseConfirmed: att.human,
            termsAccepted: att.terms,
            organization: att.organization || undefined,
            purpose: att.purpose || undefined,
            timestamp: new Date().toISOString(),
          },
          shipTo: { ...ship, state: ship.state.toUpperCase() },
        }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.message || "Order failed.");
      clear();
      router.push(data.redirectUrl ?? `/checkout/confirmation?order=${data.orderId}`);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (hydrated && items.length === 0) {
    return (
      <>
        <Crumbs items={[{ href: "/cart", label: "cart" }, { label: "checkout" }]} />
        <p className="mono text-sm text-fg-3">∅ nothing to check out</p>
        <Link href="/compounds" className="btn mt-6">browse compounds</Link>
      </>
    );
  }

  return (
    <>
      <Crumbs items={[{ href: "/cart", label: "cart" }, { label: "checkout" }]} />
      <h1 className="display text-3xl">Checkout</h1>

      <ol className="mono mt-6 flex gap-4 text-[11px] uppercase tracking-wider">
        {(["attestation", "shipping", "payment"] as const).map((s, i) => (
          <li key={s} className={i + 1 === step ? "text-accent" : i + 1 < step ? "text-fg-2" : "text-fg-3"}>
            {String(i + 1).padStart(2, "0")} {s}
          </li>
        ))}
      </ol>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {step === 1 && (
            <section className="rounded-lg border border-line bg-bg-1 p-6">
              <h2 className="display text-lg">Researcher attestation</h2>
              <p className="mt-2 text-sm text-fg-2">{RUO_STATEMENT}</p>
              <div className="mt-5 space-y-3 text-sm">
                {[
                  ["age", `I am ${site.minimumAge} years of age or older.`],
                  ["ruo", "I am purchasing these materials solely for in-vitro laboratory research."],
                  ["human", "I will not administer, or permit the administration of, these materials to any human or animal."],
                  ["terms", "I have read and accept the terms of sale, including the no-return policy on temperature-sensitive materials."],
                ].map(([k, label]) => (
                  <label key={k} className="flex cursor-pointer items-start gap-3">
                    <input type="checkbox" className="mt-1 accent-[var(--accent)]" checked={att[k as keyof typeof att] as boolean} onChange={(e) => setAtt({ ...att, [k]: e.target.checked })} />
                    <span>
                      {label}
                      {k === "terms" && (
                        <>
                          {" "}
                          <Link href="/terms" className="underline underline-offset-4" target="_blank">terms</Link>
                        </>
                      )}
                    </span>
                  </label>
                ))}
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="label">institution or organization (optional)</span>
                  <input className="input mt-1" value={att.organization} onChange={(e) => setAtt({ ...att, organization: e.target.value })} />
                </label>
                <label className="block">
                  <span className="label">research context (optional)</span>
                  <input className="input mt-1" placeholder="e.g. in-vitro receptor binding assay" value={att.purpose} onChange={(e) => setAtt({ ...att, purpose: e.target.value })} />
                </label>
              </div>
              <div className="mt-6 flex justify-end">
                <button className="btn btn-primary" disabled={!attOk} onClick={() => setStep(2)}>continue</button>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="rounded-lg border border-line bg-bg-1 p-6">
              <h2 className="display text-lg">Shipping</h2>
              <p className="mt-1 text-sm text-fg-3">{site.shipsTo}. Street addresses only; no PO boxes for temperature-sensitive items.</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {([
                  ["name", "full name", "sm:col-span-2"],
                  ["organization", "organization (optional)", "sm:col-span-2"],
                  ["address1", "address", "sm:col-span-2"],
                  ["address2", "suite / lab / room (optional)", "sm:col-span-2"],
                  ["city", "city", ""],
                  ["state", "state (2 letters)", ""],
                  ["postal", "zip", ""],
                  ["phone", "phone (optional)", ""],
                  ["email", "email", "sm:col-span-2"],
                ] as const).map(([k, label, span]) => (
                  <label key={k} className={`block ${span}`}>
                    <span className="label">{label}</span>
                    <input className="input mt-1" value={ship[k]} maxLength={k === "state" ? 2 : undefined} type={k === "email" ? "email" : "text"} onChange={(e) => setShip({ ...ship, [k]: e.target.value })} />
                  </label>
                ))}
              </div>
              <div className="mt-6 flex justify-between">
                <button className="btn" onClick={() => setStep(1)}>back</button>
                <button className="btn btn-primary" disabled={!shipOk} onClick={() => setStep(3)}>continue</button>
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="rounded-lg border border-line bg-bg-1 p-6">
              <h2 className="display text-lg">Payment</h2>
              <p className="mt-2 text-sm text-fg-2">
                Method: <span className="mono text-fg">{activeProvider.label}</span>. {activeProvider.id === "manual-invoice" && "An invoice with payment instructions is emailed to the address on this order. Materials ship once payment clears."}
              </p>
              <dl className="mono mt-5 text-sm">
                <div className="flex justify-between py-1"><dt className="text-fg-2">ship to</dt><dd className="text-right">{ship.name}<br />{ship.address1}{ship.address2 ? `, ${ship.address2}` : ""}<br />{ship.city}, {ship.state.toUpperCase()} {ship.postal}</dd></div>
                <div className="flex justify-between py-1"><dt className="text-fg-2">email</dt><dd>{ship.email}</dd></div>
              </dl>
              {err && <p className="mt-4 text-sm text-danger">{err}</p>}
              <div className="mt-6 flex justify-between">
                <button className="btn" onClick={() => setStep(2)}>back</button>
                <button className="btn btn-primary" disabled={busy} onClick={submit}>{busy ? "placing…" : "place order"}</button>
              </div>
            </section>
          )}
        </div>

        <aside className="rounded-lg border border-line bg-bg-1 p-5">
          <p className="label mb-3">order</p>
          <ul className="mono space-y-2 text-[12.5px]">
            {items.map((l) => (
              <li key={l.sku} className="flex justify-between gap-3">
                <span className="text-fg-2">{l.qty} × {l.product.compound?.name ?? l.product.name} {l.product.size}</span>
                <span>{money((l.product.price ?? 0) * l.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mono mt-4 border-t border-line pt-3 text-sm">
            <div className="flex justify-between py-1"><dt className="text-fg-2">subtotal</dt><dd>{money(subtotal)}</dd></div>
            <div className="flex justify-between py-1"><dt className="text-fg-2">shipping</dt><dd>{shipping === 0 ? "included" : money(shipping)}</dd></div>
            <div className="flex justify-between border-t border-line py-2 text-base"><dt>total</dt><dd>{money(subtotal + shipping)}</dd></div>
          </dl>
        </aside>
      </div>
    </>
  );
}
