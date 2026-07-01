
## Deliverable

Three files in `/mnt/documents/` that another platform can consume to place every product image against the correct product/strength:

1. **`product-images-manifest.csv`** — one row per image (~102 rows). Columns:
   `sku, category, product_name, display_name, slug, strength, image_url, image_filename`
   - `sku` = `{DISPLAY_NAME}-{STRENGTH}` (e.g. `GLP1-SEMA-5MG`, `BPC-157-10MG`) — this is the convention already used in the B2B catalog.
   - `image_url` = full CDN URL from the `.asset.json` pointer (e.g. `https://resurrectedlabz.com/__l5e/assets-v1/<uuid>/glp1-sema-5mg.png`).

2. **`product-images-manifest.pdf`** — branded, human-readable version. Each row also embeds a thumbnail of the actual image (downloaded from the CDN), so the other platform / a human can visually confirm the match before wiring it up. Grouped by category, sorted by product then strength.

3. **`product-images-README.md`** — plain-English instructions for the other builder:
   - How the CSV is keyed (slug + normalized strength).
   - The exact normalization rule (`lowercase, strip spaces, drop anything after "/"`, so `"0.1 mg"` → `"0.1mg"`, `"10mg / vial"` → `"10mg"`).
   - Pseudo-code for the lookup: `getImage(slug, strength)`.
   - Note that CDN URLs are immutable and safe to hard-code / mirror.
   - List of any product/strength combos in `products-data.ts` that do **not** yet have an image (so the other side knows what's still label-only).

## How I'll build it

1. Parse `src/lib/products-data.ts` to enumerate every `(category, product, slug, strength)` tuple.
2. Walk `src/assets/product-labels/*.asset.json`, read each pointer's `url` + `original_filename`.
3. Cross-reference against `src/lib/product-label-images.ts` (the source of truth for slug↔file mapping) to attach the right image to the right product.
4. Emit CSV + Markdown.
5. Download each CDN image to `/tmp` and render the PDF with `reportlab`, embedding thumbnails. Visually QA every page (convert to JPGs, inspect) before delivering.
6. Report to you: total images, total products with images, any gaps.

No source-code changes. Purely a spec/export bundle for handoff.

## One confirm

Is the SKU convention `{DISPLAYNAME}-{STRENGTH}` (uppercase, hyphen — e.g. `GLP1-SEMA-5MG`, `NAD-100MG`, `HGH-SOMATROPIN-15IU`) fine for the other platform, or do you already have a different SKU format you want me to use?
