# Plan

Replace the existing product label asset pointers for the six matched products in this upload batch so the product pages show the new vial photos.

## Products matched from this batch
- TB500 5mg → `src/assets/product-labels/tb500-5mg.png.asset.json`
- DSIP 15mg → `src/assets/product-labels/dsip-15mg.png.asset.json`
- GLP1-SEMA 30mg → `src/assets/product-labels/glp1-sema-30mg.png.asset.json`
- GLP3-RETA 5mg → `src/assets/product-labels/glp3-reta-5mg.png.asset.json`
- PT-141 10mg → `src/assets/product-labels/pt-141-10mg.png.asset.json`
- EPITHALON 50mg → `src/assets/product-labels/epithalon-50mg.png.asset.json`
- SERMORELIN 10mg → `src/assets/product-labels/sermorelin-10mg.png.asset.json`

## What I’ll do
1. Upload each matching PNG from your attachments to the Lovable asset CDN.
2. Overwrite only the corresponding `.asset.json` files above with the new asset pointers.
3. Leave all other product dosages and product mappings unchanged.
4. Verify the existing image map still points to these files so the updated photos appear automatically on the product pages.

## Notes
- Your upload contains duplicate copies for DSIP, GLP1-SEMA, and EPITHALON; I’ll use one copy per product.
- No product code changes should be needed because these dosage slots already exist in the catalog and image map.

## Technical details
The project already imports these label pointers through `src/lib/product-label-images.ts`, so replacing the pointer files is enough. This is the same pattern used for the previous vial-image batch.