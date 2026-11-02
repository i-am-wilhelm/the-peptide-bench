import re, json, csv, sys

src, out_json, out_csv = sys.argv[1:4]
lines = open(src).read().splitlines()

TIERS = ["1-25", "26-100", "101-300", "301-749", "750-1000"]
SUPPLIER_CATS = ["Metabolism and Energy", "Recovery and Tissue Support", "Stress and Mood",
                 "Cognitive Reslilience", "Longevity and Cellular Health", "Immune and Food Sensitivity"]

CLASSES = [
    (r"semaglutide|tirzepatide|retatrutide|cagrilintide", "Incretin & amylin analogs"),
    (r"tesa|sermorelin|cjc|ipamorelin|ghrp|igf|aod", "GH secretagogues & GHRH analogs"),
    (r"glow|klow|wolverine|bpc/tb|bpc-157|tb-500", "Tissue repair peptides & blends"),
    (r"ghk|ahk", "Copper peptides"),
    (r"mots|ss-31|amino|nad\+|glutathione", "Mitochondrial & metabolic compounds"),
    (r"selank|semax|dsip|dihexa|oxytocin", "Neuropeptides"),
    (r"melanotan|pt-141", "Melanocortin analogs"),
    (r"epitalon|epithalon", "Bioregulator peptides"),
    (r"kpv|ll-37|thymosin|ara-290", "Immune & antimicrobial peptides"),
    (r"kisspeptin", "Neuroendocrine peptides"),
    (r"bac water|syringe|needle", "Laboratory supplies"),
]

def classify(name):
    n = name.lower()
    for pat, c in CLASSES:
        if re.search(pat, n):
            return c
    return "Unclassified"

def slug(s):
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", s.lower())).strip("-")

items, pending_cats, section = [], [], "vial"
for raw in lines:
    s = raw.strip()
    if not s:
        continue
    if s.startswith("NASAL SPRAYS"):
        section = "nasal_spray"; continue
    if s.startswith(("LIVE RUO", "NOTES", "*FREE", "RUO VIALS")):
        continue
    cols = [c.strip() for c in re.split(r"\s{2,}", s) if c.strip()]
    if all(c in SUPPLIER_CATS for c in cols):
        pending_cats += cols; continue
    prices = [float(c.replace("$", "")) for c in cols if re.fullmatch(r"\$[\d.]+", c)]
    rest = [c for c in cols if not re.fullmatch(r"\$[\d.]+", c)]
    name = rest[0]
    cats = pending_cats + [c for c in rest[1:] if c in SUPPLIER_CATS]
    coa = next((c for c in rest[1:] if c.endswith("COA")), None)
    pending_cats = []
    coming_soon = "COMING SOON" in name.upper()
    clean = re.sub(r"\s*-\s*COMING SOON", "", name, flags=re.I).strip()
    sprays = re.search(r"\((\d+) sprays\)", clean)
    sec = section
    if re.search(r"syringe|needle", clean, re.I): sec = "supply"
    if re.search(r"bac water", clean, re.I): sec = "supply"
    flags = []
    if not prices: flags.append("no price listed")
    if section == "vial" and not coa and sec != "supply": flags.append("no COA listed")
    if coa and clean.lower().split()[0] not in coa.lower() and "wolverine" not in clean.lower():
        flags.append(f"COA label mismatch: '{coa}'")
    if re.search(r"500mg", clean) and coa and "600mg" in coa:
        flags.append(f"COA label mismatch: '{coa}'")
    if prices and len(prices) == 5 and round(prices[1] / prices[0], 2) != 0.8:
        flags.append("tier-1 price off the usual 80% ladder; confirm with Aspen")
    items.append({
        "sku": slug(clean + ("-spray" if sec == "nasal_spray" else "")),
        "name": clean,
        "format": sec,
        "sprays": int(sprays.group(1)) if sprays else None,
        "research_class": classify(clean),
        "supplier_categories": cats,
        "coa_ref": coa,
        "coming_soon": coming_soon,
        "cost": dict(zip(TIERS, prices)) if prices else {},
        "flags": sorted(set(flags)),
    })

meta = {
    "supplier": "Aspen Wholesale", "phone": "678.900.3757", "email": "info@aspenwholesale.com",
    "shipping": "$35 per order; free over $300",
    "white_label": "+$5 per vial, MOQ 100+ vials per SKU",
    "nasal_spray_note": "Purchaser must use their own label",
    "source": "LIVE RUO PEPTIDE LIST (received 2026-10-28)",
}
json.dump({"meta": meta, "products": items}, open(out_json, "w"), indent=2)

with open(out_csv, "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["sku", "name", "format", "research_class", "supplier_categories", "coming_soon", "coa_ref"]
               + [f"cost_{t}" for t in TIERS] + ["flags"])
    for it in items:
        w.writerow([it["sku"], it["name"], it["format"], it["research_class"], "; ".join(it["supplier_categories"]),
                    it["coming_soon"], it["coa_ref"] or ""] + [it["cost"].get(t, "") for t in TIERS]
                   + ["; ".join(it["flags"])])

from collections import Counter
print(len(items), Counter(i["format"] for i in items), Counter(i["research_class"] for i in items))
for it in items:
    if it["flags"]: print(it["name"], "|", it["flags"])
