import type { Metadata } from "next";
import Crumbs from "@/components/Crumbs";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy", alternates: { canonical: "/privacy" } };

export default function Privacy() {
  return (
    <>
      <Crumbs items={[{ label: "privacy" }]} />
      <div className="prose max-w-3xl">
        <p className="label">effective 2026-10-31 · draft for counsel review</p>
        <h1 className="display text-3xl">Privacy</h1>
        <h2>What we collect</h2>
        <p>Order details (items, address, email, phone if given), the checkout attestation with its timestamp and IP address, and payment status from our payment provider. We do not store card numbers. We do not run advertising trackers. Analytics, if enabled, are first-party and aggregate.</p>
        <h2>Why</h2>
        <p>To fulfil orders, to maintain the attestation record our terms and our payment provider's underwriting require, to respond to regulatory inquiries, and to meet tax and accounting obligations.</p>
        <h2>Sharing</h2>
        <p>With the supplier that ships your order (name, address, items), with the carrier, with our payment provider, and with authorities where the law requires. We do not sell or rent personal data.</p>
        <h2>Retention</h2>
        <p>Order and attestation records are kept for seven years. Browser storage (cart contents, gate acknowledgement) stays on your device and can be cleared at any time.</p>
        <h2>Your rights</h2>
        <p>Residents of California and other states with privacy statutes may request access to, correction of or deletion of their data, subject to our retention obligations. We do not sell or share personal information as those terms are defined under the CCPA/CPRA. Write to <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
        <h2>Cookies and storage</h2>
        <p>We use browser local storage for the cart and the entry acknowledgement, and a session cookie if an account feature is enabled. No third-party cookies.</p>
      </div>
    </>
  );
}
