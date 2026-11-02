"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";

export default function AddToCart({ sku, disabled, small }: { sku: string; disabled?: boolean; small?: boolean }) {
  const { add } = useCart();
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className={`btn ${small ? "!py-1.5 !px-3" : "btn-primary"}`}
      disabled={disabled}
      onClick={() => {
        add(sku, 1);
        setDone(true);
        setTimeout(() => setDone(false), 1200);
      }}
    >
      {disabled ? "unavailable" : done ? "added" : "add to cart"}
    </button>
  );
}
