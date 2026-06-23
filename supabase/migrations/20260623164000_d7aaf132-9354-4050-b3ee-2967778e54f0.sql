
-- B2B WHOLESALE PRICING SYSTEM
-- Cost/profit fields are admin-only. B2B users see catalog via SECURITY DEFINER function.

CREATE TABLE public.b2b_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku text NOT NULL UNIQUE,
  product_name text NOT NULL,
  display_name text NOT NULL,
  specification text,
  strength text,
  vials_per_kit integer NOT NULL DEFAULT 10,
  internal_buy_cost_cents integer NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  b2b_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.b2b_products TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.b2b_products TO authenticated;
ALTER TABLE public.b2b_products ENABLE ROW LEVEL SECURITY;

-- Admin-only direct access (cost is sensitive)
CREATE POLICY "Admins manage b2b_products" ON public.b2b_products
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TABLE public.b2b_pricing_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.b2b_products(id) ON DELETE CASCADE,
  vial_quantity integer NOT NULL,
  market_price_cents integer NOT NULL DEFAULT 0,
  our_price_cents integer NOT NULL DEFAULT 0,
  discount_percent numeric(5,2) NOT NULL DEFAULT 20,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, vial_quantity)
);

GRANT ALL ON public.b2b_pricing_tiers TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.b2b_pricing_tiers TO authenticated;
ALTER TABLE public.b2b_pricing_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage b2b_pricing_tiers" ON public.b2b_pricing_tiers
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE INDEX b2b_pricing_tiers_product_idx ON public.b2b_pricing_tiers (product_id);

CREATE TRIGGER trg_b2b_products_updated_at
  BEFORE UPDATE ON public.b2b_products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_b2b_pricing_tiers_updated_at
  BEFORE UPDATE ON public.b2b_pricing_tiers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- B2B-safe catalog (no cost/profit). Only B2B or admin users.
CREATE OR REPLACE FUNCTION public.get_b2b_catalog()
RETURNS TABLE (
  id uuid, sku text, product_name text, display_name text,
  specification text, strength text, vials_per_kit integer,
  sort_order integer,
  tier_id uuid, vial_quantity integer,
  market_price_cents integer, our_price_cents integer, discount_percent numeric
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT p.id, p.sku, p.product_name, p.display_name, p.specification,
         p.strength, p.vials_per_kit, p.sort_order,
         t.id, t.vial_quantity, t.market_price_cents, t.our_price_cents, t.discount_percent
  FROM public.b2b_products p
  JOIN public.b2b_pricing_tiers t ON t.product_id = p.id
  WHERE p.is_active = true AND p.b2b_enabled = true AND t.is_active = true
    AND t.our_price_cents > 0
    AND (
      private.has_role(auth.uid(), 'b2b'::public.app_role) OR
      private.has_role(auth.uid(), 'admin'::public.app_role)
    )
  ORDER BY p.sort_order, p.display_name, t.vial_quantity;
$$;

-- Admin view with cost & profit
CREATE OR REPLACE FUNCTION public.admin_get_b2b_catalog()
RETURNS TABLE (
  id uuid, sku text, product_name text, display_name text,
  specification text, strength text, vials_per_kit integer,
  internal_buy_cost_cents integer, is_active boolean, b2b_enabled boolean,
  sort_order integer,
  tier_id uuid, vial_quantity integer,
  market_price_cents integer, our_price_cents integer, discount_percent numeric,
  internal_profit_cents integer, profit_margin_percent numeric
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT p.id, p.sku, p.product_name, p.display_name, p.specification,
         p.strength, p.vials_per_kit,
         p.internal_buy_cost_cents, p.is_active, p.b2b_enabled, p.sort_order,
         t.id, t.vial_quantity, t.market_price_cents, t.our_price_cents, t.discount_percent,
         (t.our_price_cents - p.internal_buy_cost_cents * (t.vial_quantity/10)) AS internal_profit_cents,
         CASE WHEN t.our_price_cents > 0
           THEN ROUND(((t.our_price_cents - p.internal_buy_cost_cents * (t.vial_quantity/10))::numeric / t.our_price_cents) * 100, 2)
           ELSE 0 END AS profit_margin_percent
  FROM public.b2b_products p
  LEFT JOIN public.b2b_pricing_tiers t ON t.product_id = p.id
  WHERE private.has_role(auth.uid(), 'admin'::public.app_role)
  ORDER BY p.sort_order, p.display_name, t.vial_quantity;
$$;

REVOKE EXECUTE ON FUNCTION public.get_b2b_catalog() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_b2b_catalog() TO authenticated;
REVOKE EXECUTE ON FUNCTION public.admin_get_b2b_catalog() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_get_b2b_catalog() TO authenticated;

-- SEED DATA: 107 products, each with 3 pricing tiers (10/20/30 vials)
-- Columns: sku, product_name, display_name, specification, strength, cost_cents (10v cost), sort_order
-- Followed by 3 tiers per product

DO $$
DECLARE
  v_pid uuid;
  -- product: (sku, product_name, display_name, specification, strength, cost$, p10,p20,p30 our, m10,m20,m30 market)
  recs jsonb := '[
    ["SM5","Semaglutide","Semaglutide 5mg","5 mg/vial, 10vial/kits","5mg",36,640,1232,1800,800,1540,2250],
    ["SM10","Semaglutide","Semaglutide 10mg","10 mg/vial, 10vial/kits","10mg",48,736,1472,2160,920,1840,2700],
    ["SM15","Semaglutide","Semaglutide 15mg","15 mg/vial, 10vial/kits","15mg",60,816,1632,2400,1020,2040,3000],
    ["SM20","Semaglutide","Semaglutide 20mg","20 mg/vial, 10vial/kits","20mg",80,1008,2016,2976,1260,2520,3720],
    ["SM30","Semaglutide","Semaglutide 30mg","30 mg/vial, 10vial/kits","30mg",104,1168,2336,3936,1460,2920,4920],
    ["TR5","Tirzepatide","Tirzepatide 5mg","5 mg/vial, 10vial/kits","5mg",36,624,1248,1824,780,1560,2280],
    ["TR10","Tirzepatide","Tirzepatide 10mg","10 mg/vial, 10vial/kits","10mg",48,736,1472,2160,920,1840,2700],
    ["TR15","Tirzepatide","Tirzepatide 15mg","15 mg/vial, 10vial/kits","15mg",72,872,1744,2544,1090,2180,3180],
    ["TR20","Tirzepatide","Tirzepatide 20mg","20 mg/vial, 10vial/kits","20mg",84,1088,2176,3192,1360,2720,3990],
    ["TR30","Tirzepatide","Tirzepatide 30mg","30 mg/vial, 10vial/kits","30mg",112,1632,3264,4800,2040,4080,6000],
    ["TR40","Tirzepatide","Tirzepatide 40mg","40 mg/vial, 10vial/kits","40mg",132,1840,3520,5244,2300,4400,6555],
    ["TR50","Tirzepatide","Tirzepatide 50mg","50 mg/vial, 10vial/kits","50mg",164,2040,4200,6044,2550,5250,7555],
    ["TR60","Tirzepatide","Tirzepatide 60mg","60 mg/vial, 10vial/kits","60mg",192,2248,4496,6624,2810,5620,8280],
    ["RT5","Retatrutide","Retatrutide 5mg","5 mg/vial, 10vial/kits","5mg",56,896,1792,2616,1120,2240,3270],
    ["RT10","Retatrutide","Retatrutide 10mg","10 mg/vial, 10vial/kits","10mg",88,1008,2016,2976,1260,2520,3720],
    ["RT15","Retatrutide","Retatrutide 15mg","15 mg/vial, 10vial/kits","15mg",112,1400,2800,4104,1750,3500,5130],
    ["RT20","Retatrutide","Retatrutide 20mg","20 mg/vial, 10vial/kits","20mg",140,1520,3200,4928,1900,4000,6160],
    ["RT30","Retatrutide","Retatrutide 30mg","30 mg/vial, 10vial/kits","30mg",184,1960,3888,5720,2450,4860,7150],
    ["RT40","Retatrutide","Retatrutide 40mg","40 mg/vial, 10vial/kits","40mg",232,2480,4960,7296,3100,6200,9120],
    ["RT50","Retatrutide","Retatrutide 50mg","50 mg/vial, 10vial/kits","50mg",272,3760,5600,8120,4700,7000,10150],
    ["RT60","Retatrutide","Retatrutide 60mg","60 mg/vial, 10vial/kits","60mg",304,5312,10640,15640,6640,13300,19550],
    ["ML10","MT-2 (Melanotan 2 Acetate)","Melanotan 2 10mg","10 mg/vial, 10vial/kits","10mg",44,344,688,984,430,860,1230],
    ["IP5","Ipamorelin","Ipamorelin 5mg","5 mg/vial, 10vial/kits","5mg",40,384,768,1080,480,960,1350],
    ["IP10","Ipamorelin","Ipamorelin 10mg","10 mg/vial, 10vial/kits","10mg",76,456,912,1296,570,1140,1620],
    ["BC5","BPC-157","BPC-157 5mg","5 mg/vial, 10vial/kits","5mg",40,608,1216,1728,760,1520,2160],
    ["BC10","BPC-157","BPC-157 10mg","10 mg/vial, 10vial/kits","10mg",56,688,1376,1944,860,1720,2430],
    ["BT5","TB-500","TB-500 5mg","5 mg/vial, 10vial/kits","5mg",80,416,832,1200,520,1040,1500],
    ["BT10","TB-500","TB-500 10mg","10 mg/vial, 10vial/kits","10mg",140,568,1136,1672,710,1420,2090],
    ["BB10","BPC5mg+TB5mg","BPC 5mg + TB 5mg","10 mg/vial, 10vial/kits","10mg",100,584,1168,1656,730,1460,2070],
    ["BB20","BPC10mg+TB10mg","BPC 10mg + TB 10mg","20 mg/vial, 10vial/kits","20mg",200,880,1760,2640,1100,2200,3300],
    ["5AD","AOD-9604","AOD-9604 5mg","5 mg/vial, 10vial/kits","5mg",108,544,1088,1560,680,1360,1950],
    ["G5K","HCG","HCG 5000iu","5000iu, 10vial/kits","5000iu",72,320,640,960,400,800,1200],
    ["G10K","HCG","HCG 10000iu","10000iu, 10vial/kits","10000iu",144,688,1312,2032,860,1640,2540],
    ["P41","PT-141","PT-141 10mg","10 mg/vial, 10vial/kits","10mg",60,384,768,1080,480,960,1350],
    ["LEMON","Lemon bottle","Lemon Bottle 10ml","10 ml/vial, 10vial/kits","10ml",76,320,640,960,400,800,1200],
    ["DS5","DSIP","DSIP 5mg","5 mg/vial, 10vial/kits","5mg",44,264,528,768,330,660,960],
    ["DS15","DSIP","DSIP 15mg","15 mg/vial, 10vial/kits","15mg",92,640,1280,1840,800,1600,2300],
    ["SK5","Selank","Selank 5mg","5 mg/vial, 10vial/kits","5mg",40,232,464,672,290,580,840],
    ["SK10","Selank","Selank 10mg","10mg/vial, 10vial/kits","10mg",64,376,752,1056,470,940,1320],
    ["CP10","CJC-1295 no DAC 5mg + IPA 5mg","CJC-1295/IPA Blend 10mg","10mg/vial, 10vial/kits","10mg",104,480,928,1320,600,1160,1650],
    ["OT2","Oxytocin","Oxytocin 2mg","2 mg/vial, 10vial/kits","2mg",36,568,1120,1600,710,1400,2000],
    ["ET10","Epitalon","Epitalon 10mg","10 mg/vial, 10vial/kits","10mg",48,296,592,840,370,740,1050],
    ["ET50","Epitalon","Epitalon 50mg","50mg*10vials, 10vial/kits","50mg",136,416,832,1632,520,1040,2040],
    ["AE1","ACE-031","ACE-031 1mg","1 mg/vial, 10vial/kits","1mg",160,1248,2492,3736,1560,3115,4670],
    ["AP5-1","Adipotide","Adipotide 5mg","5 mg/vial, 10vial/kits","5mg",172,560,1120,1684,700,1400,2105],
    ["XA5","Semax","Semax 5mg","5 mg/vial, 10vial/kits","5mg",40,192,384,560,240,480,700],
    ["XA10","Semax","Semax 10mg","10mg/vial, 10vial/kits","10mg",56,232,464,672,290,580,840],
    ["2S10","SS-31","SS-31 10mg","10 mg/vial, 10vial/kits","10mg",92,384,768,1080,480,960,1350],
    ["2S50","SS-31","SS-31 50mg","50 mg/vial, 10vial/kits","50mg",360,1144,2288,3240,1430,2860,4050],
    ["CND5","CJC-1295 no dac","CJC-1295 no DAC 5mg","5 mg/vial, 10vial/kits","5mg",88,384,768,1080,480,960,1350],
    ["CND10","CJC-1295 no dac","CJC-1295 no DAC 10mg","10 mg/vial, 10vial/kits","10mg",164,568,1136,1632,710,1420,2040],
    ["CD5","CJC-1295 dac","CJC-1295 DAC 5mg","5 mg/vial, 10vial/kits","5mg",164,384,768,1080,480,960,1350],
    ["SMO5","Sermorelin","Sermorelin 5mg","5 mg/vial, 10vial/kits","5mg",68,384,768,1080,480,960,1350],
    ["SMO10","Sermorelin","Sermorelin 10mg","10 mg/vial, 10vial/kits","10mg",104,496,992,1416,620,1240,1770],
    ["F81","GDF-8","GDF-8 1mg","1 mg/vial, 10vial/kits","1mg",152,1848,3700,5504,2310,4625,6880],
    ["IG01","IGF-1LR3","IGF-1LR3 0.1mg","0.1 mg/vial, 10vial/kits","0.1mg",36,344,688,984,430,860,1230],
    ["IG1","IGF-1LR3","IGF-1LR3 1mg","1 mg/vial, 10vial/kits","1mg",196,576,1152,1632,720,1440,2040],
    ["TSM5","Tesamorelin","Tesamorelin 5mg","5 mg/vial, 10vial/kits","5mg",104,480,936,1328,600,1170,1660],
    ["TSM10","Tesamorelin","Tesamorelin 10mg","10 mg/vial, 10vial/kits","10mg",196,568,1136,1632,710,1420,2040],
    ["HX5","Hexarelin Acetate","Hexarelin 5mg","5 mg/vial, 10vial/kits","5mg",84,296,592,840,370,740,1050],
    ["CU50","GHK-CU","GHK-CU 50mg","50 mg/vial, 10vial/kits","50mg",36,352,688,1000,440,860,1250],
    ["CU100","GHK-CU","GHK-CU 100mg","100 mg/vial, 10vial/kits","100mg",44,608,1216,1728,760,1520,2160],
    ["SLU322","SLU-PP-322","SLU-PP-322 5mg","5 mg/vial, 10vial/kits","5mg",128,456,912,1296,570,1140,1620],
    ["KS5","KissPeptin-10","KissPeptin-10 5mg","5 mg/vial, 10vial/kits","5mg",64,416,832,1200,520,1040,1500],
    ["KS10","KissPeptin-10","KissPeptin-10 10mg","10 mg/vial, 10vial/kits","10mg",104,648,1296,1848,810,1620,2310],
    ["TA5","Thymosin Alpha-1","Thymosin Alpha-1 5mg","5 mg/vial, 10vial/kits","5mg",84,496,992,1416,620,1240,1770],
    ["TA10","Thymosin Alpha-1","Thymosin Alpha-1 10mg","10 mg/vial, 10vial/kits","10mg",160,648,1296,1848,810,1620,2310],
    ["MS10","MOTs-c","MOTs-c 10mg","10 mg/vial, 10vial/kits","10mg",64,416,832,1200,520,1040,1500],
    ["MS40","MOTs-c","MOTs-c 40mg","40mg*10vials, 10vial/kits","40mg",188,912,1824,2592,1140,2280,3240],
    ["LL37","LL37","LL37 5mg","5 mg/vial, 10vial/kits","5mg",84,344,688,984,430,860,1230],
    ["MT1","Melatonin","Melatonin 10mg","10 mg/vial, 10vial/kits","10mg",52,280,560,840,350,700,1050],
    ["GTT","Glutathione","Glutathione 1500mg","1500mg/vial, 10vial/kits","1500mg",80,680,1432,2080,850,1790,2600],
    ["NJ100","NAD+","NAD+ 100mg","100 mg/vial, 10vial/kits","100mg",40,576,1152,1712,720,1440,2140],
    ["NJ500","NAD+","NAD+ 500mg","500 mg/vial, 10vial/kits","500mg",84,688,1376,1944,860,1720,2430],
    ["NJ1000","NAD+","NAD+ 1000mg","1000 mg/vial, 10vial/kits","1000mg",160,960,1896,2848,1200,2370,3560],
    ["5AM","5-amino-1mq","5-Amino-1MQ 5mg","5 mg/10vial","5mg",68,456,912,1296,570,1140,1620],
    ["50AM","50-amino-1mq","50-Amino-1MQ 50mg","50mg/10vial","50mg",124,1672,3344,4752,2090,4180,5940],
    ["CGL5","Cagrilintide","Cagrilintide 5mg","5 mg/vial, 10vial/kits","5mg",108,912,1824,2592,1140,2280,3240],
    ["CGL10","Cagrilintide","Cagrilintide 10mg","10 mg/vial, 10vial/kits","10mg",164,1064,2128,3024,1330,2660,3780],
    ["NP810","Snap-8","Snap-8 10mg","10 mg/vial, 10vial/kits","10mg",44,496,992,1416,620,1240,1770],
    ["KPV5","LYSINE-PROLINE-VALINE","KPV 5mg","5 mg/vial, 10vial/kits","5mg",52,400,784,1168,500,980,1460],
    ["KPV10","LYSINE-PROLINE-VALINE","KPV 10mg","10 mg/vial, 10vial/kits","10mg",64,520,1024,1544,650,1280,1930],
    ["LC216","Lipo-C with vitamins B12","Lipo-C w/ B12 10ml","10 ml/vial, 10vial/kits","10ml",80,560,1120,1680,700,1400,2100],
    ["LC600","L-Carnitine","L-Carnitine 10ml","10 ml/vial, 10vial/kits","10ml",88,200,400,600,250,500,750],
    ["SUR10","Survodutide","Survodutide 10mg","10 mg/vial, 10vial/kits","10mg",240,1064,2128,3024,1330,2660,3780],
    ["CS10","Cagrilintide 5mg + Semaglutide 5mg","Cagrilintide + Semaglutide 10mg","10 mg/vial, 10vial/kits","10mg",204,880,1760,2640,1100,2200,3300],
    ["BBG70","Glow BPC-157 10mg + GHK-CU 50mg + TB500 10mg","Glow Blend 70mg","70mg/vial, 10vial/kits","70mg",196,1144,2288,3240,1430,2860,4050],
    ["H10","HGH 191AA(Somatropin)","HGH Somatropin 10iu","10iu*10vials","10iu",56,252,504,756,315,630,945],
    ["H15","HGH 191AA(Somatropin)","HGH Somatropin 15iu","15iu*10vials","15iu",72,308,616,924,385,770,1155],
    ["H24","HGH 191AA(Somatropin)","HGH Somatropin 24iu","24iu*10vials","24iu",120,420,840,1256,525,1050,1570],
    ["TRI2","Triptorelin Acetate/GnRH Triptorelin","Triptorelin 2mg","2mg*10vials","2mg",28,312,544,936,390,680,1170],
    ["KLOW80","CU50+TB10+BC10+KPV10","Klow Blend 80mg","80 mg/vial, 10vial/kits","80mg",240,672,1296,1896,840,1620,2370],
    ["PNC5","PNC 27","PNC-27 5mg","5 mg/vial, 10vial/kits","5mg",100,994,1987,2981,1242,2484,3726],
    ["PNC10","PNC 27","PNC-27 10mg","10 mg/vial, 10vial/kits","10mg",160,1568,3136,4704,1960,3920,5880],
    ["PI5","Pinealon","Pinealon 5mg","5 mg/vial, 10vial/kits","5mg",48,296,592,840,370,740,1050],
    ["PI10","Pinealon","Pinealon 10mg","10 mg/vial, 10vial/kits","10mg",68,416,832,1200,520,1040,1500],
    ["P20","Pinealon","Pinealon 20mg","20 mg/vial, 10vial/kits","20mg",93,536,1072,1512,670,1340,1890],
    ["VIP5","Vasoactive Intestinal Peptide","VIP 5mg","5 mg/vial, 10vial/kits","5mg",72,424,848,1248,530,1060,1560],
    ["VIP10","Vasoactive Intestinal Peptide","VIP 10mg","10 mg/vial, 10vial/kits","10mg",128,624,1248,1824,780,1560,2280],
    ["AP5","Adipotide","Adipotide 5mg (alt)","5 mg/vial, 10vial/kits","5mg",160,496,936,1320,620,1170,1650],
    ["MZ10","Mazdutide","Mazdutide 10mg","10mg*10vials","10mg",188,828,1656,2484,1035,2070,3105],
    ["BA3","Benzyl Alcohol 0.9%","Benzyl Alcohol 3ml","3 ml/vial, 10vial/kits","3ml",6,40,80,120,50,100,150],
    ["BA10","Benzyl Alcohol 0.9%","Benzyl Alcohol 10ml","10 ml/vial, 10vial/kits","10ml",10,96,192,288,120,240,360],
    ["G25","GHRP-2 Acetate","GHRP-2 5mg","5 mg/vial, 10vial/kits","5mg",50,264,528,768,330,660,960],
    ["G65","GHRP-6 Acetate","GHRP-6 5mg","5 mg/vial, 10vial/kits","5mg",50,264,528,768,330,660,960],
    ["G610","GHRP-6 Acetate","GHRP-6 10mg","10 mg/vial, 10vial/kits","10mg",70,416,832,1200,520,1040,1500],
    ["TY10","Thymalin","Thymalin 10mg","10 mg/vial, 10vial/kits","10mg",80,280,560,840,350,700,1050]
  ]'::jsonb;
  rec jsonb;
  i int := 0;
BEGIN
  FOR rec IN SELECT * FROM jsonb_array_elements(recs) LOOP
    i := i + 1;
    INSERT INTO public.b2b_products (sku, product_name, display_name, specification, strength, vials_per_kit, internal_buy_cost_cents, sort_order)
    VALUES (
      rec->>0,
      rec->>1,
      rec->>2,
      rec->>3,
      rec->>4,
      10,
      (rec->>5)::int * 100,
      i
    )
    RETURNING id INTO v_pid;

    INSERT INTO public.b2b_pricing_tiers (product_id, vial_quantity, our_price_cents, market_price_cents) VALUES
      (v_pid, 10, (rec->>6)::int * 100, (rec->>9)::int * 100),
      (v_pid, 20, (rec->>7)::int * 100, (rec->>10)::int * 100),
      (v_pid, 30, (rec->>8)::int * 100, (rec->>11)::int * 100);
  END LOOP;
END $$;
