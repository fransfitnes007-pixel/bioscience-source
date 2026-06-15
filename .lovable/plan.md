## Goal
Use Lovable Emails (built-in) to send branded transactional emails from `resurrectedlabz.com` — no third-party setup needed.

## Step 1 — Set up email domain (required first)
You need to add `resurrectedlabz.com` as a verified sender. This puts emails in inboxes as `notify@resurrectedlabz.com` instead of a generic address.

I'll trigger the setup dialog at the end of this plan. After you complete DNS, I continue automatically.

## Step 2 — Email infrastructure
Provision the queue, send function, suppression list, unsubscribe handler, and cron worker (one-time, automatic).

## Step 3 — Branded email templates
Three React Email templates in the Resurrected Labs black/white luxury theme with your logo:

1. **order-confirmation** — Logo, "Order Confirmed", line items with product images & strength, totals, shipping address, tracking number + "Track Package" CTA.
2. **welcome-10-off** — For SMS opt-in & email signups. Logo, hero "Welcome to the Lab", their 10% discount code in a copy-style box, CTA to shop.
3. **shipping-update** — Triggered when tracking is added. Logo, "Your order is on the way", tracking number, static map preview (Google Static Maps grayscale to match theme) showing route, "Track Live" CTA to carrier's page.

Note on the Shopify-style animated map: that's Shopify Shop app proprietary. Standard approach (what every brand uses outside Shop) is a **static grayscale map image** of the route with a CTA to the carrier's live tracker. That's what I'll build.

## Step 4 — Wire triggers
- Order confirmation → fires from `verify-payment` edge function on successful checkout.
- Welcome 10% off → fires from `ComingSoonGate` form submission (already collects name/email/phone).
- Shipping update → fires when admin adds a tracking number on an order in `/admin/orders/:id`.

Each uses an idempotency key so retries don't double-send.

## Technical details
- Templates: `supabase/functions/_shared/transactional-email-templates/*.tsx` using React Email v0.0.22.
- Registered in `registry.ts`. Single `send-transactional-email` function handles all sends.
- Static map: `https://maps.googleapis.com/maps/api/staticmap` with `style=feature:all|invert_lightness:true|saturation:-100` for B&W theme. Requires a Google Maps Static API key (free tier covers thousands/month). I'll ask for it when wiring shipping update — not blocking for the other two.
- Logo: hosted from `/resurrected-logo-full.png` (already in `public/`).

## What I need from you
1. Approve this plan.
2. Complete the email domain setup dialog (DNS records — takes ~5 min, verification can take up to 72h but I can scaffold immediately).
3. Later: a Google Maps Static API key for the shipping map (optional — can launch without it and add later).

<presentation-actions>
<presentation-open-email-setup>Set up email domain</presentation-open-email-setup>
</presentation-actions>
