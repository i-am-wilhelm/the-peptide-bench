import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { PRODUCTS } from "@/lib/catalog";
import { activeProvider, type OrderDraft } from "@/lib/payments";
import { site } from "@/lib/site";

const US_STATES = new Set("AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY DC".split(" "));

/** Minimal D1 surface used here; avoids a hard dependency on generated Cloudflare types. */
interface D1Like {
  prepare(sql: string): { bind(...values: unknown[]): { run(): Promise<unknown> } };
}

/** The D1 `DB` binding when running on Cloudflare with it configured; otherwise null. */
function ordersDb(): D1Like | null {
  try {
    const env = getCloudflareContext().env as unknown as { DB?: D1Like };
    return env.DB ?? null;
  } catch {
    // Not running under the Cloudflare adapter (e.g. plain `next dev`).
    return null;
  }
}

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

  const ip = req.headers.get("cf-connecting-ip");

  // Attestation is kept with timestamp and IP for the processor's underwriting file.
  // TODO(launch): queue the supplier PO + invoice email.
  const db = ordersDb();
  if (db) {
    try {
      await db
        .prepare(
          `INSERT INTO orders (id, email, ship_to, items, subtotal, shipping, total, attestation, ip, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
        )
        .bind(
          id,
          order.shipTo.email,
          JSON.stringify(order.shipTo),
          JSON.stringify(order.items),
          order.subtotal,
          order.shipping,
          order.total,
          JSON.stringify(order.attestation),
          ip,
        )
        .run();
    } catch (e) {
      console.error("order persist failed", id, (e as Error).message);
      return NextResponse.json({ ok: false, message: "Order could not be recorded. Try again." }, { status: 500 });
    }
  } else {
    console.log("order", id, JSON.stringify({ ...order, ip }));
  }

  try {
    const result = await activeProvider.createPayment(order, id);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ ok: false, message: (e as Error).message }, { status: 500 });
  }
}
