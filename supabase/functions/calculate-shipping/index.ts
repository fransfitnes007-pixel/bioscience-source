import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Ship-from origin (US). Override via SHIP_FROM_POSTAL_CODE / SHIP_FROM_COUNTRY env vars.
const SHIP_FROM_POSTAL = Deno.env.get("SHIP_FROM_POSTAL_CODE") || "33101";
const SHIP_FROM_COUNTRY = Deno.env.get("SHIP_FROM_COUNTRY") || "US";

// Country name -> ISO2
const COUNTRY_ISO: Record<string, string> = {
  "United States": "US", USA: "US", US: "US",
  Canada: "CA", "United Kingdom": "GB", UK: "GB",
  Australia: "AU", Germany: "DE", France: "FR",
};

interface ShippingRequest {
  items: Array<{ productName: string; quantity: number; price: number }>;
  destination: { country: string; state?: string; zip?: string; city?: string };
  subtotal: number;
}

interface ShippingRate {
  carrier: string;
  service: string; // ShipStation serviceCode (e.g. usps_priority_mail)
  label: string;
  cost: number;
  estimatedDaysMin: number;
  estimatedDaysMax: number;
  recommended: boolean;
}

// Fallback table used when ShipStation isn't reachable
const FALLBACK_RATES: Record<string, { baseCost: number; perLb: number; minDays: number; maxDays: number; label: string; carrier: string }> = {
  usps_first_class_mail: { baseCost: 5.0, perLb: 0.5, minDays: 5, maxDays: 7, label: "USPS First Class", carrier: "USPS" },
  usps_priority_mail: { baseCost: 8.5, perLb: 0.75, minDays: 2, maxDays: 5, label: "USPS Priority Mail", carrier: "USPS" },
  usps_priority_mail_express: { baseCost: 26.0, perLb: 1.5, minDays: 1, maxDays: 2, label: "USPS Priority Mail Express", carrier: "USPS" },
  ups_ground: { baseCost: 12.0, perLb: 1.1, minDays: 3, maxDays: 7, label: "UPS Ground", carrier: "UPS" },
  ups_2nd_day_air: { baseCost: 32.0, perLb: 2.5, minDays: 1, maxDays: 2, label: "UPS 2nd Day Air", carrier: "UPS" },
  fedex_ground: { baseCost: 11.5, perLb: 1.05, minDays: 3, maxDays: 7, label: "FedEx Ground", carrier: "FedEx" },
};

function estimateWeightLbs(items: ShippingRequest["items"]): number {
  let w = 0.5; // packaging
  for (const i of items) w += i.quantity * 0.3;
  return Math.max(1, Math.round(w * 10) / 10);
}

function toIso(country: string): string {
  return COUNTRY_ISO[country] || (country.length === 2 ? country.toUpperCase() : "US");
}

async function getShipstationRates(req: ShippingRequest, weightLbs: number): Promise<ShippingRate[]> {
  const apiKey = Deno.env.get("SHIPSTATION_API_KEY");
  const apiSecret = Deno.env.get("SHIPSTATION_API_SECRET");
  if (!apiKey || !apiSecret) return [];

  const auth = "Basic " + btoa(`${apiKey}:${apiSecret}`);
  const toCountry = toIso(req.destination.country);

  // Carriers to query. Each ShipStation account has these unless removed.
  const carriers = ["stamps_com", "ups", "fedex"];

  const allRates: ShippingRate[] = [];

  await Promise.all(
    carriers.map(async (carrierCode) => {
      try {
        const body = {
          carrierCode,
          fromPostalCode: SHIP_FROM_POSTAL,
          toState: req.destination.state || "",
          toCountry,
          toPostalCode: req.destination.zip || "",
          toCity: req.destination.city || "",
          weight: { value: weightLbs, units: "pounds" },
          confirmation: "none",
          residential: true,
        };
        const resp = await fetch("https://ssapi.shipstation.com/shipments/getrates", {
          method: "POST",
          headers: { Authorization: auth, "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!resp.ok) {
          console.warn(`ShipStation getrates ${carrierCode} failed:`, resp.status, await resp.text());
          return;
        }
        const data = await resp.json() as Array<{ serviceCode: string; serviceName: string; shipmentCost: number; otherCost: number }>;
        const carrierName = carrierCode === "stamps_com" ? "USPS" : carrierCode === "ups" ? "UPS" : "FedEx";
        for (const r of data) {
          const cost = Math.round((Number(r.shipmentCost || 0) + Number(r.otherCost || 0)) * 100) / 100;
          if (!cost || cost <= 0) continue;
          // Heuristic transit days from service name
          const name = r.serviceName.toLowerCase();
          let minD = 3, maxD = 7;
          if (name.includes("express") || name.includes("overnight") || name.includes("priority mail express")) { minD = 1; maxD = 2; }
          else if (name.includes("2") || name.includes("two")) { minD = 2; maxD = 3; }
          else if (name.includes("priority")) { minD = 2; maxD = 4; }
          else if (name.includes("first class") || name.includes("ground advantage")) { minD = 3; maxD = 6; }
          else if (name.includes("ground")) { minD = 3; maxD = 7; }
          allRates.push({
            carrier: carrierName,
            service: r.serviceCode,
            label: r.serviceName,
            cost,
            estimatedDaysMin: minD,
            estimatedDaysMax: maxD,
            recommended: false,
          });
        }
      } catch (e) {
        console.warn(`ShipStation getrates ${carrierCode} error:`, e);
      }
    }),
  );

  return allRates;
}

function fallbackRates(req: ShippingRequest, weight: number): ShippingRate[] {
  const out: ShippingRate[] = [];
  for (const [code, r] of Object.entries(FALLBACK_RATES)) {
    out.push({
      carrier: r.carrier,
      service: code,
      label: r.label,
      cost: Math.round((r.baseCost + r.perLb * weight) * 100) / 100,
      estimatedDaysMin: r.minDays,
      estimatedDaysMax: r.maxDays,
      recommended: false,
    });
  }
  return out;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = (await req.json()) as ShippingRequest;
    if (!body.items?.length) {
      return new Response(JSON.stringify({ error: "Items required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 });
    }
    if (!body.destination?.country) {
      return new Response(JSON.stringify({ error: "Destination country required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 });
    }

    const weight = estimateWeightLbs(body.items);
    let rates = await getShipstationRates(body, weight);
    let source: "shipstation" | "fallback" = "shipstation";

    if (rates.length === 0) {
      rates = fallbackRates(body, weight);
      source = "fallback";
    }

    rates.sort((a, b) => a.cost - b.cost);
    const recommended = rates.find((r) => r.estimatedDaysMax <= 7) || rates[0];
    if (recommended) recommended.recommended = true;

    const freeShippingThreshold = 2000;
    const qualifiesForFreeShipping = body.subtotal >= freeShippingThreshold;

    return new Response(
      JSON.stringify({
        rates,
        recommended: {
          ...recommended,
          cost: qualifiesForFreeShipping ? 0 : recommended.cost,
          freeShipping: qualifiesForFreeShipping,
          freeShippingReason: qualifiesForFreeShipping ? "Free shipping on orders over $2,000" : null,
        },
        estimatedWeight: weight,
        freeShippingThreshold,
        qualifiesForFreeShipping,
        source,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
    );
  } catch (e: any) {
    console.error("calculate-shipping error", e);
    return new Response(JSON.stringify({ error: "Failed to calculate shipping rates" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 });
  }
});
