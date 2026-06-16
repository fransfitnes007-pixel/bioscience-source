// Product label images keyed by slug + strength.
// Strength keys are normalized: lowercased, spaces removed (e.g. "5mg", "1500mg", "10iu").
// As batches of label artwork come in, add new asset imports + entries below.

import glutathione1500mg from "@/assets/product-labels/glutathione-1500mg.png.asset.json";
import nad100mg from "@/assets/product-labels/nad-100mg.png.asset.json";
import nad500mg from "@/assets/product-labels/nad-500mg.png.asset.json";
import nad1000mg from "@/assets/product-labels/nad-1000mg.png.asset.json";
import amino5mg from "@/assets/product-labels/5-amino-1mq-5mg.png.asset.json";
import amino50mg from "@/assets/product-labels/5-amino-1mq-50mg.png.asset.json";

type StrengthMap = Record<string, string>;

export const productLabelImages: Record<string, StrengthMap> = {
  glutathione: {
    "1500mg": glutathione1500mg.url,
  },
  nad: {
    "100mg": nad100mg.url,
    "500mg": nad500mg.url,
    "1000mg": nad1000mg.url,
  },
  "5-amino-1mq": {
    "5mg": amino5mg.url,
    "50mg": amino50mg.url,
  },
};

const normalizeStrength = (s: string) =>
  s.toLowerCase().replace(/\s+/g, "").replace(/\/.*$/, "");

export const getLabelImage = (slug: string, strength?: string | null): string | undefined => {
  const map = productLabelImages[slug];
  if (!map) return undefined;
  if (!strength) {
    // Return first available variant as fallback
    return Object.values(map)[0];
  }
  return map[normalizeStrength(strength)];
};
