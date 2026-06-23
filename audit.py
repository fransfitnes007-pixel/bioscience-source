import re
import os

# 1. Parse products-data.ts
with open('src/lib/products-data.ts', 'r') as f:
    content = f.read()

# Extract products more carefully
# Find everything inside products: [ ... ]
products_blocks = re.findall(r'products: \[(.*?)\]\n\s+\}', content, re.DOTALL)
all_products = []
for p_block in products_blocks:
    # Each product starts with { and ends with }
    items = re.findall(r'\{(.*?)\}', p_block, re.DOTALL)
    for item in items:
        # Extract slug
        slug_match = re.search(r'slug:\s*["\']([^"\']+)["\']', item)
        if not slug_match: continue
        slug = slug_match.group(1)
        
        # Extract display name
        dn_match = re.search(r'displayName:\s*["\']([^"\']+)["\']', item)
        display_name = dn_match.group(1) if dn_match else slug
        
        # Extract variations
        v_match = re.search(r'variations:\s*\[(.*?)\]', item, re.DOTALL)
        strengths = []
        if v_match:
            v_text = v_match.group(1)
            strengths = re.findall(r'strength:\s*["\']([^"\']+)["\']', v_text)
        
        all_products.append({'slug': slug, 'displayName': display_name, 'strengths': strengths})

# 2. Parse product-label-images.ts
with open('src/lib/product-label-images.ts', 'r') as f:
    mapping_content = f.read()

def normalize_strength(s):
    # s.toLowerCase().replace(/\s+/g, "").replace(/\/.*$/, "")
    # Note: the TS code also has .replace(/\/.*$/, "") but sometimes it has ( ... )
    # Let's look at the actual normalizeStrength in TS:
    # s.toLowerCase().replace(/\s+/g, "").replace(/\/.*$/, "");
    # Wait, the TS code I saw was:
    # const normalizeStrength = (s: string) => s.toLowerCase().replace(/\s+/g, "").replace(/\/.*$/, "");
    # If s is "10mg (5mg + 5mg)", replace(/\s+/g, "") -> "10mg(5mg+5mg)"
    # Then it doesn't have a slash / so it stays "10mg(5mg+5mg)"
    # BUT, in the mapping it is "10mg". 
    # Let's check the TS normalizeStrength again.
    # Ah! In the mapping it says:
    # "10mg": bpc157Tb500_10mg.url
    # If I pass "10mg (5mg + 5mg)" it won't match "10mg" unless I strip the parens.
    res = s.lower().replace(" ", "")
    # Does it strip parens? No, not in the TS code I saw.
    # Let's re-read the TS normalizeStrength:
    # s.toLowerCase().replace(/\s+/g, "").replace(/\/.*$/, "");
    # It doesn't strip parens.
    return res

# Extract mappings from productLabelImages
mappings = {}
# Find the object
obj_start = mapping_content.find('export const productLabelImages')
obj_text = mapping_content[obj_start:]
# Match keys and their nested objects
# Using a simpler approach: find "slug: {"
p_blocks = re.findall(r'["\']?([\w-]+)["\']?:\s*\{(.*?)\}', obj_text, re.DOTALL)
for p_slug, s_text in p_blocks:
    s_keys = re.findall(r'["\']([^"\']+)["\']:', s_text)
    mappings[p_slug] = s_keys

# 3. Assets
asset_dir = 'src/assets/product-labels'
assets = os.listdir(asset_dir)
imports = re.findall(r'import \w+ from "@/assets/product-labels/([^"]+)";', mapping_content)

# 4. Report
print("### Coverage Report ###\n")

product_slugs = [p['slug'] for p in all_products]

for p in all_products:
    slug = p['slug']
    dn = p['displayName']
    if slug not in mappings:
        print(f"Product: {dn} ({slug}) - ENTIRELY MISSING MAPPING")
        continue
    
    missing = []
    for s in p['strengths']:
        norm_s = normalize_strength(s)
        if norm_s not in mappings[slug]:
            # Maybe the normalization in TS is different than what I think?
            # Let's check if "10mg" is in mappings[slug] and norm_s starts with "10mg"
            # In TS: "10mg (5mg + 5mg)" -> "10mg(5mg+5mg)"
            # If the mapping key is "10mg", it's a mismatch.
            missing.append(f"'{s}' (normalized: '{norm_s}')")
    
    if missing:
        print(f"Product: {dn} ({slug}) - Missing strengths: {', '.join(missing)}")

print("\n### Suspicious Mappings ###")
for m_slug in mappings:
    if m_slug not in product_slugs:
        print(f"Mapping key '{m_slug}' has no corresponding product slug.")

print("\n### Unused Assets ###")
for asset in assets:
    if asset not in imports:
        print(f"Asset '{asset}' is not imported in product-label-images.ts")

