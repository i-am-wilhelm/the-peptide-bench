-- Orders and the purchaser attestation captured at checkout.
-- JSON columns hold the validated, server-repriced payload from app/api/orders/route.ts.
CREATE TABLE IF NOT EXISTS orders (
  id          TEXT PRIMARY KEY,                -- TPB-YYMMDD-XXXXX
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  email       TEXT NOT NULL,
  ship_to     TEXT NOT NULL CHECK (json_valid(ship_to)),
  items       TEXT NOT NULL CHECK (json_valid(items)),
  subtotal    REAL NOT NULL,
  shipping    REAL NOT NULL,
  total       REAL NOT NULL,
  attestation TEXT NOT NULL CHECK (json_valid(attestation)),
  ip          TEXT,
  status      TEXT NOT NULL DEFAULT 'pending'
);

CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders (email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
