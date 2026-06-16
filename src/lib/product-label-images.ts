// Product label images keyed by slug + strength.
// Strength keys are normalized: lowercased, spaces removed (e.g. "5mg", "1500mg", "10iu").
// As batches of label artwork come in, add new asset imports + entries below.

import glutathione1500mg from "@/assets/product-labels/glutathione-1500mg.png.asset.json";
import nad100mg from "@/assets/product-labels/nad-100mg.png.asset.json";
import nad500mg from "@/assets/product-labels/nad-500mg.png.asset.json";
import nad1000mg from "@/assets/product-labels/nad-1000mg.png.asset.json";
import amino5mg from "@/assets/product-labels/5-amino-1mq-5mg.png.asset.json";
import amino50mg from "@/assets/product-labels/5-amino-1mq-50mg.png.asset.json";
import motsC10mg from "@/assets/product-labels/mots-c-10mg.png.asset.json";
import motsC40mg from "@/assets/product-labels/mots-c-40mg.png.asset.json";
import sluPp322_5mg from "@/assets/product-labels/slu-pp-322-5mg.png.asset.json";
import vip5mg from "@/assets/product-labels/vip-5mg.png.asset.json";
import lemonBottle10ml from "@/assets/product-labels/lemon-bottle-10ml.png.asset.json";
import lCarnitine10ml from "@/assets/product-labels/l-carnitine-10ml.png.asset.json";
import vip10mg from "@/assets/product-labels/vip-10mg.png.asset.json";
import glowStack70mg from "@/assets/product-labels/glow-stack-70mg.png.asset.json";
import klowStack80mg from "@/assets/product-labels/klow-stack-80mg.png.asset.json";
import bacWater3ml from "@/assets/product-labels/bac-water-3ml.png.asset.json";
import bacWater10ml from "@/assets/product-labels/bac-water-10ml.png.asset.json";
import mt110mg from "@/assets/product-labels/mt-1-10mg.png.asset.json";
import pt14110mg from "@/assets/product-labels/pt-141-10mg.png.asset.json";
import ghkCu50mg from "@/assets/product-labels/ghk-cu-50mg.png.asset.json";
import ghkCu100mg from "@/assets/product-labels/ghk-cu-100mg.png.asset.json";
import snap810mg from "@/assets/product-labels/snap-8-10mg.png.asset.json";
import kpv5mg from "@/assets/product-labels/kpv-5mg.png.asset.json";
import kpv10mg from "@/assets/product-labels/kpv-10mg.png.asset.json";
import ll375mg from "@/assets/product-labels/ll-37-5mg.png.asset.json";
import ss3110mg from "@/assets/product-labels/ss-31-10mg.png.asset.json";
import ss3150mg from "@/assets/product-labels/ss-31-50mg.png.asset.json";
import hghSomatropin15iu from "@/assets/product-labels/hgh-somatropin-15iu.png.asset.json";
import hghSomatropin24iu from "@/assets/product-labels/hgh-somatropin-24iu.png.asset.json";
import hcg5000iu from "@/assets/product-labels/hcg-5000iu.png.asset.json";
import hcg10000iu from "@/assets/product-labels/hcg-10000iu.png.asset.json";
import follistatin1mg from "@/assets/product-labels/follistatin-1mg.png.asset.json";
import kisspeptin10_5mg from "@/assets/product-labels/kisspeptin-10-5mg.png.asset.json";

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
  "mots-c": {
    "10mg": motsC10mg.url,
    "40mg": motsC40mg.url,
  },
  "slu-pp-322": {
    "5mg": sluPp322_5mg.url,
  },
  "vip-5mg": {
    "5mg": vip5mg.url,
    "10mg": vip10mg.url,
  },
  "lemon-bottle": {
    "10ml": lemonBottle10ml.url,
  },
  "l-carnitine": {
    "10ml": lCarnitine10ml.url,
  },
  "glow-stack": {
    "70mg": glowStack70mg.url,
  },
  "klow-stack": {
    "80mg": klowStack80mg.url,
  },
  "bac-water": {
    "3ml": bacWater3ml.url,
    "10ml": bacWater10ml.url,
  },
  "mt-1": {
    "10mg": mt110mg.url,
  },
  "pt-141": {
    "10mg": pt14110mg.url,
  },
  "ghk-cu": {
    "50mg": ghkCu50mg.url,
    "100mg": ghkCu100mg.url,
  },
  "snap-8": {
    "10mg": snap810mg.url,
  },
  kpv: {
    "5mg": kpv5mg.url,
    "10mg": kpv10mg.url,
  },
  "ll-37": {
    "5mg": ll375mg.url,
  },
  "ss-31": {
    "10mg": ss3110mg.url,
    "50mg": ss3150mg.url,
  },
  "hgh-somatropin": {
    "15iu": hghSomatropin15iu.url,
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
