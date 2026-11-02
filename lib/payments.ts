/**
 * Payment provider adapter.
 *
 * Stripe, Shopify Payments, PayPal and Square prohibit this category, so the processor will be a
 * high-risk gateway chosen after underwriting. Every gateway integrates differently; this interface
 * keeps the checkout page independent of that choice.
 *
 * Until a gateway is live, `manualInvoice` records the order and tells the purchaser an invoice
 * with payment instructions follows by email. No card data touches this codebase.
 */

export interface OrderDraft {
  items: Array<{ sku: string; qty: number; unitPrice: number }>;
  subtotal: number;
  shipping: number;
  total: number;
  attestation: {
    ageConfirmed: boolean;
    researchUseConfirmed: boolean;
    noHumanUseConfirmed: boolean;
    termsAccepted: boolean;
    organization?: string;
    purpose?: string;
    timestamp: string;
  };
  shipTo: {
    name: string;
    organization?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postal: string;
    email: string;
    phone?: string;
  };
}

export interface PaymentResult {
  ok: boolean;
  orderId?: string;
  /** Where to send the purchaser next (hosted payment page, or our confirmation). */
  redirectUrl?: string;
  message?: string;
}

export interface PaymentProvider {
  id: string;
  label: string;
  createPayment(order: OrderDraft, orderId: string): Promise<PaymentResult>;
}

export const manualInvoice: PaymentProvider = {
  id: "manual-invoice",
  label: "Invoice by email",
  async createPayment(_order, orderId) {
    return {
      ok: true,
      orderId,
      redirectUrl: `/checkout/confirmation?order=${orderId}`,
      message: "An invoice with payment instructions is sent to the email on the order.",
    };
  },
};

export const activeProvider: PaymentProvider = manualInvoice;
