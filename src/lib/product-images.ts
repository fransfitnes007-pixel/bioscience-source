// Product image imports
import amino1mq from "@/assets/products/5-amino-1mq.png";
import aod from "@/assets/products/aod.png";
import ara290 from "@/assets/products/ara-290.png";
import bacWater from "@/assets/products/bac-water.png";
import bpc157 from "@/assets/products/bpc-157.png";
import cagrilintide from "@/assets/products/cagrilintide.png";
import cerebrolysin from "@/assets/products/cerebrolysin.png";
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
import glp1 from "@/assets/products/glp1.png";
import glp3Reta from "@/assets/products/glp3-reta.png";
import glutathione from "@/assets/products/glutathione.png";
import hexarelin from "@/assets/products/hexarelin.png";
import hghFragment from "@/assets/products/hgh-fragment-176-191.png";
import hyaluronicAcid from "@/assets/products/hyaluronic-acid.png";
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
  "5-amino-1mq": amino1mq,
  "aod": aod,
  "ara-290": ara290,
  "bac-water": bacWater,
  "bpc-157": bpc157,
  "cagrilintide": cagrilintide,
  "cerebrolysin": cerebrolysin,
  "cjc-1295-ipamorelin": cjc1295Ipamorelin,
  "cjc-1295-no-dac": cjc1295NoDac,
  "dsip": dsip,
  "epithalon": epithalon,
  "follistatin": follistatin,
  "ghk-cu": ghkCu,
  "ghrp-6": ghrp6,
  "glow": glowStack,
  "glp1-sema": glp1Sema,
  "glp1-triz": glp1Triz,
  "glp-1": glp1,
  "glp3-reta": glp3Reta,
  "glutathione": glutathione,
  "hexarelin": hexarelin,
  "hgh-fragment-176-191": hghFragment,
  "hyaluronic-acid": hyaluronicAcid,
  "igf-1-lr3": igf1Lr3,
  "igf-des": igfDes,
  "insulin": insulin,
  "ipamorelin": ipamorelin,
  "kisspeptin-10": kisspeptin10,
  "klow": klowStack,
  "kpv": kpv,
  "l-carnitine": lCarnitine,
  "lemon-bottle": lemonBottle,
  "ll-37": ll37,
  "mazdutide": mazdutide,
  "mt-1": mt1,
  "mt-2": mt2,
  "nad": nad,
  "pinealon": pinealon,
  "pt-141": pt141,
  "selank": selank,
  "semax": semax,
  "sermorelin": sermorelin,
  "slu-pp-322": sluPp322,
  "snap-8": snap8,
  "ss-31": ss31,
  "survodutide": survodutide,
  "tb500": tb500,
  "tesamorelin": tesamorelin,
  "thymalin": thymalin,
  "thymosin-alpha-1": thymosinAlpha1,
  "vip": vip5mg,
  // Products with missing dedicated images - using related fallbacks
  "bpc-157-tb500": bpc157,
  "mots-c": ss31,
  "hgh": hghFragment,
};

export const getProductImage = (slug: string): string | undefined => {
  return productImages[slug];
};
