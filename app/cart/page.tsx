"use client";

import Link from "next/link";
import Crumbs from "@/components/Crumbs";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/catalog";
import { site } from "@/lib/site";

export default function CartPage() {
  const { items, setQty, remove, subtotal, hydrated } = useCart();
  const shipping = subtotal >= site.supplier.freeShippingOver ? 0 : site.supplier.shippingFlat;

  return (
    <>
      <Crumbs items={[{ label: "cart" }]} />
      <h1 className="display text-3xl">Cart</h1>
      {!hydrated ? null : items.length === 0 ? (
        <div className="mt-10 rounded-lg border border-line bg-bg-1 p-10 text-center">
          <p className="mono text-sm text-fg-3">∅ nothing in the cart</p>
          <Link href="/compounds" className="btn mt-6">browse compounds</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <table className="mono w-full text-[13px]">
              <thead>
                <tr className="label border-b border-line text-left">
                  <th className="py-2 font-medium">item</th>
                  <th className="py-2 font-medium">qty</th>
                  <th className="py-2 text-right font-medium">line</th>
                </tr>
              </thead>
              <tbody>
                {items.map((l) => (
                  <tr key={l.sku} className="border-b border-line align-top">
                    <td className="py-3">
                      <Link href={`/products/${l.sku}`} className="hover:text-accent">{l.product.title}</Link>
                      <div className="text-[11px] text-fg-3">{l.sku} · {money(l.product.price)} each</div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <button className="btn !px-2 !py-1" onClick={() => setQty(l.sku, l.qty - 1)} aria-label="decrease">−</button>
                        <span className="w-8 text-center">{l.qty}</span>
                        <button className="btn !px-2 !py-1" onClick={() => setQty(l.sku, l.qty + 1)} aria-label="increase">+</button>
                        <button className="ml-3 text-[11px] text-fg-3 hover:text-danger" onClick={() => remove(l.sku)}>remove</button>
                      </div>
                    </td>
                    <td className="py-3 text-right">{money((l.product.price ?? 0) * l.qty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <aside className="rounded-lg border border-line bg-bg-1 p-5">
            <dl className="mono text-sm">
              <div className="flex justify-between py-1"><dt className="text-fg-2">subtotal</dt><dd>{money(subtotal)}</dd></div>
              <div className="flex justify-between py-1"><dt className="text-fg-2">shipping</dt><dd>{shipping === 0 ? "included" : money(shipping)}</dd></div>
              <div className="flex justify-between border-t border-line py-2 text-base"><dt>total</dt><dd>{money(subtotal + shipping)}</dd></div>
            </dl>
            <p className="mt-2 text-[11px] text-fg-3">Shipping included on orders of {money(site.supplier.freeShippingOver)} or more. {site.shipsTo}.</p>
            <Link href="/checkout" className="btn btn-primary mt-5 w-full justify-center">checkout</Link>
          </aside>
        </div>
      )}
    </>
  );
}
