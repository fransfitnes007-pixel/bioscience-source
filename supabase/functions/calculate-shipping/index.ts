import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Weight-based shipping rate tables (per lb) for domestic US
// These serve as fallback rates when no external shipping API is configured
const CARRIER_RATES: Record<string, { baseCost: number; perLb: number; minDays: number; maxDays: number; label: string }> = {
  usps_priority: { baseCost: 8.50, perLb: 0.75, minDays: 2, maxDays: 5, label: "USPS Priority Mail" },
  usps_ground: { baseCost: 5.00, perLb: 0.50, minDays: 5, maxDays: 10, label: "USPS Ground Advantage" },
  ups_ground: { baseCost: 12.00, perLb: 1.10, minDays: 3, maxDays: 7, label: "UPS Ground" },
  ups_3day: { baseCost: 22.00, perLb: 1.80, minDays: 2, maxDays: 3, label: "UPS 3-Day Select" },
  ups_2day: { baseCost: 32.00, perLb: 2.50, minDays: 1, maxDays: 2, label: "UPS 2nd Day Air" },
  fedex_ground: { baseCost: 11.50, perLb: 1.05, minDays: 3, maxDays: 7, label: "FedEx Ground" },
  fedex_express: { baseCost: 28.00, perLb: 2.20, minDays: 1, maxDays: 3, label: "FedEx Express Saver" },
  fedex_2day: { baseCost: 30.00, perLb: 2.40, minDays: 1, maxDays: 2, label: "FedEx 2Day" },
  dhl_express: { baseCost: 35.00, perLb: 3.00, minDays: 1, maxDays: 3, label: "DHL Express" },
};

// International surcharges by region
const INTERNATIONAL_SURCHARGE: Record<string, number> = {
  CA: 15, // Canada
  GB: 25, // UK
  AU: 35, // Australia
  DE: 25, // Germany
  FR: 25, // France
  default: 40,
};

// Zone-based domestic adjustments (simplified - based on distance from origin)
const ZONE_MULTIPLIER: Record<string, number> = {
  local: 1.0,    // Same state
  regional: 1.15, // Neighboring states
  national: 1.35, // Cross-country
};

interface ShippingRequest {
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
  destination: {
    country: string;
    state?: string;
    zip?: string;
    city?: string;
  };
  subtotal: number;
}

interface ShippingRate {
  carrier: string;
  service: string;
  label: string;
  cost: number;
  estimatedDaysMin: number;
  estimatedDaysMax: number;
  recommended: boolean;
}

function estimateWeight(items: ShippingRequest["items"]): number {
  // Estimate weight based on item count and price (B2B bulk = heavier)
  // Average peptide vial: ~0.3 lbs, packaging adds ~0.5 lbs per order
  let totalWeight = 0.5; // base packaging
  for (const item of items) {
    totalWeight += item.quantity * 0.3; // ~0.3 lbs per vial
  }
  return Math.max(1, totalWeight); // minimum 1 lb
}

function getZone(destinationState?: string): string {
  // Origin assumed: Central US (for simplicity)
  const localStates = ["TX", "OK", "LA", "AR", "NM"];
  const regionalStates = ["MO", "KS", "CO", "MS", "AL", "TN", "GA", "FL", "AZ", "NE", "IA"];
  
  if (!destinationState) return "national";
  const state = destinationState.toUpperCase().trim();
  if (localStates.includes(state)) return "local";
  if (regionalStates.includes(state)) return "regional";
  return "national";
}

function calculateRates(req: ShippingRequest): ShippingRate[] {
  const weight = estimateWeight(req.items);
  const isInternational = req.destination.country !== "United States" && req.destination.country !== "US";
  const zone = isInternational ? "national" : getZone(req.destination.state);
  const zoneMultiplier = ZONE_MULTIPLIER[zone] || 1.35;

  // Get country code for international surcharge
  const countryMap: Record<string, string> = {
    "Canada": "CA", "United Kingdom": "GB", "Australia": "AU",
    "Germany": "DE", "France": "FR",
  };
  const countryCode = countryMap[req.destination.country] || req.destination.country;
  const intlSurcharge = isInternational
    ? (INTERNATIONAL_SURCHARGE[countryCode] || INTERNATIONAL_SURCHARGE.default)
    : 0;

  const rates: ShippingRate[] = [];

  // Filter carriers for international (only UPS, FedEx, DHL ship internationally)
  const validCarriers = isInternational
    ? Object.entries(CARRIER_RATES).filter(([key]) => 
        key.startsWith("ups_") || key.startsWith("fedex_") || key.startsWith("dhl_"))
    : Object.entries(CARRIER_RATES);

  for (const [key, carrier] of validCarriers) {
    const baseCost = (carrier.baseCost + carrier.perLb * weight) * zoneMultiplier + intlSurcharge;
    // Round to 2 decimal places
    const cost = Math.round(baseCost * 100) / 100;

    // Add extra days for international
    const extraDays = isInternational ? 5 : 0;

    rates.push({
      carrier: key.split("_")[0].toUpperCase(),
      service: key,
      label: carrier.label + (isInternational ? " (International)" : ""),
      cost,
      estimatedDaysMin: carrier.minDays + extraDays,
      estimatedDaysMax: carrier.maxDays + extraDays,
      recommended: false,
    });
  }

  // Sort by cost
  rates.sort((a, b) => a.cost - b.cost);

  // Auto-select best rate: cheapest option that arrives within 7 days
  const bestRate = rates.find(r => r.estimatedDaysMax <= 7) || rates[0];
  if (bestRate) {
    bestRate.recommended = true;
  }

  return rates;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json() as ShippingRequest;

    // Validate
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return new Response(
        JSON.stringify({ error: "Items are required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    if (!body.destination?.country) {
      return new Response(
        JSON.stringify({ error: "Destination country is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const rates = calculateRates(body);
    const recommended = rates.find(r => r.recommended) || rates[0];

    // Free shipping threshold for high-value orders
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
        estimatedWeight: estimateWeight(body.items),
        freeShippingThreshold,
        qualifiesForFreeShipping,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: any) {
    console.error("Shipping calculation error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to calculate shipping rates" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
