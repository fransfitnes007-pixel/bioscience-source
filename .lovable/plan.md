Update the product label asset pointers for the 6 matching uploads so the real vial photos appear on `/products`.

What I’ll replace
- `glp1-triz-10mg`
- `glp1-triz-50mg`
- `hcg-10000iu`
- `cjc-1295-no-dac-5mg`
- `mots-c-40mg`
- `cjc-1295-ipa-10mg` (using the uploaded combo vial labeled “CJC-1295 WITHOUT DAC + IPA”)

Technical details
- Upload each provided PNG to the Lovable asset CDN.
- Overwrite the corresponding `src/assets/product-labels/*.png.asset.json` files with the new asset pointers.
- Verify the `/products` page resolves those existing label slots to the new images.

Notes
- I won’t touch dosages you didn’t upload in this batch.
- There are duplicate copies of several uploads; I’ll use one copy per matched product image.