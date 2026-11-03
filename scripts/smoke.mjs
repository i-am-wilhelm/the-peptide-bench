/**
 * Smoke test. Starts the production server, hits the routes that matter, exits non-zero on any miss.
 * Run after `npm run build`: `npm run smoke`.
 */
import { spawn } from "node:child_process";

const PORT = process.env.SMOKE_PORT || "3987";
const BASE = `http://localhost:${PORT}`;

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function up() {
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(BASE + "/robots.txt");
      if (r.ok) return true;
    } catch {}
    await wait(500);
  }
  return false;
}

const checks = [];
function check(name, fn) {
  checks.push({ name, fn });
}

check("home renders brand", async () => {
  const r = await fetch(BASE + "/");
  const t = await r.text();
  return r.status === 200 && t.includes("The Peptide Bench");
});
check("compound page carries MolecularEntity schema", async () => {
  const r = await fetch(BASE + "/compounds/tissue-repair-peptides/bpc-157");
  const t = await r.text();
  return r.status === 200 && t.includes("MolecularEntity");
});
check("product page carries Product schema", async () => {
  const r = await fetch(BASE + "/products/retatrutide-30mg");
  const t = await r.text();
  return r.status === 200 && t.includes('"@type":"Product"');
});
check("llms.txt is plain text and branded", async () => {
  const r = await fetch(BASE + "/llms.txt");
  const t = await r.text();
  return r.status === 200 && (r.headers.get("content-type") || "").includes("text/plain") && t.startsWith("# The Peptide Bench");
});
check("sitemap lists 190+ urls", async () => {
  const r = await fetch(BASE + "/sitemap.xml");
  const t = await r.text();
  return r.status === 200 && (t.match(/<loc>/g) || []).length > 190;
});
check("robots disallows transactional routes", async () => {
  const t = await (await fetch(BASE + "/robots.txt")).text();
  return ["/cart", "/checkout", "/api/orders"].every((p) => t.includes(`Disallow: ${p}`));
});
const goodOrder = {
  items: [{ sku: "bpc-157-10mg", qty: 1, unitPrice: 0 }],
  subtotal: 0,
  shipping: 0,
  total: 0,
  attestation: { ageConfirmed: true, researchUseConfirmed: true, noHumanUseConfirmed: true, termsAccepted: true, timestamp: new Date().toISOString() },
  shipTo: { name: "Smoke Test", address1: "1 Bench St", city: "Gilbert", state: "AZ", postal: "85234", email: "smoke@example.com" },
};
check("order API accepts a complete order", async () => {
  const r = await fetch(BASE + "/api/orders", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(goodOrder) });
  const j = await r.json();
  return r.status === 200 && j.ok === true && /^TPB-/.test(j.orderId || "");
});
check("order API rejects a missing attestation", async () => {
  const bad = { ...goodOrder, attestation: { ...goodOrder.attestation, termsAccepted: false } };
  const r = await fetch(BASE + "/api/orders", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(bad) });
  return r.status === 422;
});
check("order API rejects a non-US address", async () => {
  const bad = { ...goodOrder, shipTo: { ...goodOrder.shipTo, state: "ON" } };
  const r = await fetch(BASE + "/api/orders", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(bad) });
  return r.status === 422;
});
check("404 page renders", async () => {
  const r = await fetch(BASE + "/this-does-not-exist");
  const t = await r.text();
  return r.status === 404 && t.includes("No such residue");
});
check("no usage language leaks into product pages", async () => {
  const pages = ["/products/semaglutide-10mg", "/products/bpc-157-10mg", "/compounds/incretin-amylin-analogs/retatrutide"];
  const banned = /\b(dosage|dosing|dose|reconstitut|inject|weight loss|fat loss|muscle|healing|recovery|anti-aging|cycle)\b/i;
  for (const p of pages) {
    const t = await (await fetch(BASE + p)).text();
    const body = t.replace(/<script[\s\S]*?<\/script>/g, "");
    if (banned.test(body)) {
      console.error(`  banned term on ${p}: ${body.match(banned)[0]}`);
      return false;
    }
  }
  return true;
});

const win = process.platform === "win32";
const server = spawn(win ? "npx.cmd" : "npx", ["next", "start", "-p", PORT], { stdio: ["ignore", "ignore", "inherit"], detached: !win, shell: win });
function stopServer() {
  try {
    if (win) spawn("taskkill", ["/pid", String(server.pid), "/T", "/F"], { stdio: "ignore" });
    else process.kill(-server.pid, "SIGTERM");
  } catch {}
}
let failed = 0;
try {
  if (!(await up())) throw new Error("server did not start");
  for (const c of checks) {
    let ok = false;
    try {
      ok = await c.fn();
    } catch (e) {
      console.error(`  ${c.name}: ${e.message}`);
    }
    console.log(`${ok ? "PASS" : "FAIL"}  ${c.name}`);
    if (!ok) failed++;
  }
} finally {
  stopServer();
}
console.log(`\n${checks.length - failed}/${checks.length} passed`);
process.exit(failed ? 1 : 0);
