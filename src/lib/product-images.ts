// Product image imports
import amino1mq from "@/assets/products/5-amino-1mq.png";
import aod from "@/assets/products/aod.png";

import bacWater from "@/assets/products/bac-water.png";
import bpc157 from "@/assets/products/bpc-157.png";
import bpc157Tb500 from "@/assets/products/bpc-157-tb500.png";
import cagrilintide from "@/assets/products/cagrilintide.png";

import cjc1295Ipamorelin from "@/assets/products/cjc-1295-ipamorelin.png";
import cjc1295NoDac from "@/assets/products/cjc-1295-no-dac.png";
import dsip from "@/assets/products/dsip.png";
import epithalon from "@/assets/products/epithalon.png";
import follistatin from "@/assets/products/follistatin.png";
import ghkCu from "@/assets/products/ghk-cu.png";
import ghrp6 from "@/assets/products/ghrp-6.png";
import glowStack from "@/assets/products/glow-stack.png";
import glp1Sema from "@/assets/products/glp1-sema.png";
import glp1Triz from "@/assets/products/glp1-triz.png";

import glp3Reta from "@/assets/products/glp3-reta.png";
import glutathione from "@/assets/products/glutathione.png";
import hcg from "@/assets/products/hcg.png";
import hghSomatropin from "@/assets/products/hgh-somatropin.png";
import hexarelin from "@/assets/products/hexarelin.png";

import igf1Lr3 from "@/assets/products/igf-1-lr3.png";
import igfDes from "@/assets/products/igf-des.png";
import insulin from "@/assets/products/insulin.png";
import ipamorelin from "@/assets/products/ipamorelin.png";
import kisspeptin10 from "@/assets/products/kisspeptin-10.png";
import klowStack from "@/assets/products/klow-stack.png";
import kpv from "@/assets/products/kpv.png";
import lCarnitine from "@/assets/products/l-carnitine.png";
import lemonBottle from "@/assets/products/lemon-bottle.png";
import ll37 from "@/assets/products/ll-37.png";
import mazdutide from "@/assets/products/mazdutide.png";
import motsC from "@/assets/products/mots-c.png";
import mt1 from "@/assets/products/mt-1.png";
import mt2 from "@/assets/products/mt-2.png";
import nad from "@/assets/products/nad.png";
import pinealon from "@/assets/products/pinealon.png";
import pt141 from "@/assets/products/pt-141.png";
import selank from "@/assets/products/selank.png";
import semax from "@/assets/products/semax.png";
import sermorelin from "@/assets/products/sermorelin.png";
import sluPp322 from "@/assets/products/slu-pp-322.png";
import snap8 from "@/assets/products/snap-8.png";
import ss31 from "@/assets/products/ss-31.png";
import survodutide from "@/assets/products/survodutide.png";
import tb500 from "@/assets/products/tb500.png";
import tesamorelin from "@/assets/products/tesamorelin.png";
import thymalin from "@/assets/products/thymalin.png";
import thymosinAlpha1 from "@/assets/products/thymosin-alpha-1.png";
import vip5mg from "@/assets/products/vip-5mg.png";

// Map product slugs to their images
export const productImages: Record<string, string> = {
  // GLP / Metabolic
  "glp1-sema": glp1Sema,
  "glp1-triz": glp1Triz,
  "glp3-reta": glp3Reta,
  "cagrilintide": cagrilintide,
  "mazdutide": mazdutide,
  "survodutide": survodutide,
  
  
  // Recovery & Regenerative
  "bpc-157": bpc157,
  "tb500": tb500,
  "thymosin-alpha-1": thymosinAlpha1,
  "ss-31": ss31,
  
  "thymalin": thymalin,
  "epithalon": epithalon,
  "aod": aod,
  "bpc-157-tb500": bpc157Tb500,
  
  // Cognitive & Neuro
  "semax": semax,
  "selank": selank,
  
  "dsip": dsip,
  "pinealon": pinealon,
  
  // Growth Hormone & Secretagogues
  "sermorelin": sermorelin,
  "ipamorelin": ipamorelin,
  "cjc-1295-ipamorelin": cjc1295Ipamorelin,
  "cjc-1295-ipa": cjc1295Ipamorelin,
  "cjc-1295-no-dac": cjc1295NoDac,
  "ghrp-6": ghrp6,
  "ghrp-6-acetate": ghrp6,
  "hexarelin": hexarelin,
  "tesamorelin": tesamorelin,
  "igf-1-lr3": igf1Lr3,
  "igf-des": igfDes,
  "kisspeptin-10": kisspeptin10,
  "mots-c": motsC,
  "pt-141": pt141,
  "vip": vip5mg,
  "hcg": hcg,
  "hgh-somatropin": hghSomatropin,
  
  // Aesthetic / Cosmetic + Supplies + Stacks
  "ghk-cu": ghkCu,
  "glutathione": glutathione,
  "snap-8": snap8,
  "ll-37": ll37,
  "nad": nad,
  "lemon-bottle": lemonBottle,
  "l-carnitine": lCarnitine,
  "mt-1": mt1,
  "mt-2": mt2,
  "5-amino-1mq": amino1mq,
  "slu-pp-322": sluPp322,
  "bac-water": bacWater,
  "insulin": insulin,
  
  "follistatin": follistatin,
  "glow": glowStack,
  "glow-stack": glowStack,
  "klow": klowStack,
  "klow-stack": klowStack,
  "kpv": kpv,
};

export const getProductImage = (slug: string): string | undefined => {
  return productImages[slug];
};
