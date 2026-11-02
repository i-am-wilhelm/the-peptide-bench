import { NextResponse } from "next/server";
import { PRODUCTS } from "@/lib/catalog";
import { activeProvider, type OrderDraft } from "@/lib/payments";
import { site } from "@/lib/site";

const US_STATES = new Set("AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY DC".split(" "));

function orderId() {
  const d = new Date();
  const ymd = d.toISOString().slice(2, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `TPB-${ymd}-${rand}`;
}

export async function POST(req: Request) {
  let draft: OrderDraft;
  try {
    draft = (await req.json()) as OrderDraft;
  } catch {
    return NextResponse.json({ ok: false, message: "Malformed order." }, { status: 400 });
  }

  const a = draft.attestation;
  if (!a?.ageConfirmed || !a.researchUseConfirmed || !a.noHumanUseConfirmed || !a.termsAccepted) {
    return NextResponse.json({ ok: false, message: "All attestations are required." }, { status: 422 });
  }
  const s = draft.shipTo;
  if (!s?.name || !s.address1 || !s.city || !s.postal || !s.email || !US_STATES.has((s.state || "").toUpperCase())) {
    return NextResponse.json({ ok: false, message: `A complete ${site.shipsTo} address is required.` }, { status: 422 });
  }

  // Re-price server-side; never trust client totals.
  const items = (draft.items ?? []).map((l) => {
    const p = PRODUCTS.find((x) => x.sku === l.sku);
    if (!p || !p.available || p.price == null) throw new Error(`Unavailable SKU ${l.sku}`);
    return { sku: l.sku, qty: Math.max(1, Math.min(99, Math.floor(l.qty))), unitPrice: p.price };
  });
  if (!items.length) return NextResponse.json({ ok: false, message: "Cart is empty." }, { status: 422 });
  const subtotal = items.reduce((t, l) => t + l.qty * l.unitPrice, 0);
  const shipping = subtotal >= site.supplier.freeShippingOver ? 0 : site.supplier.shippingFlat;
  const order: OrderDraft = { ...draft, items, subtotal, shipping, total: subtotal + shipping };

  const id = orderId();

  // TODO(launch): persist `order` to Cloudflare D1 (orders table) and queue the supplier PO + invoice email.
  // Keep attestation record with timestamp and IP for the processor's underwriting file.
  console.log("order", id, JSON.stringify({ ...order, ip: req.headers.get("cf-connecting-ip") }));

  try {
    const result = await activeProvider.createPayment(order, id);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ ok: false, message: (e as Error).message }, { status: 500 });
  }
}
