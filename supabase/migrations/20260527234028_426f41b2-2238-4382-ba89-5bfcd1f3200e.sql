
-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Enums
do $$ begin create type affiliate_tier as enum ('bronze','silver','gold','platinum'); exception when duplicate_object then null; end $$;
do $$ begin create type commission_status as enum ('pending','approved','cleared','paid','denied','refunded','reversed'); exception when duplicate_object then null; end $$;
do $$ begin create type payout_status as enum ('queued','processing','paid','failed','cancelled'); exception when duplicate_object then null; end $$;
do $$ begin create type payout_method_type as enum ('stripe_connect','crypto_usdc_base','crypto_usdc_polygon','crypto_usdc_ethereum','ach_plaid','ach_mercury','paypal'); exception when duplicate_object then null; end $$;
do $$ begin create type code_type as enum ('tracking_only','discount_and_tracking'); exception when duplicate_object then null; end $$;
do $$ begin create type discount_type as enum ('percentage','fixed_amount'); exception when duplicate_object then null; end $$;
do $$ begin create type fraud_severity as enum ('info','low','medium','high','critical'); exception when duplicate_object then null; end $$;

create sequence if not exists affiliate_number_seq start with 1001;

-- Extend existing affiliates table
alter table public.affiliates
  add column if not exists user_id uuid references auth.users(id) on delete set null,
  add column if not exists affiliate_number bigint default nextval('affiliate_number_seq'),
  add column if not exists display_name text,
  add column if not exists legal_name text,
  add column if not exists country text,
  add column if not exists tier affiliate_tier not null default 'bronze',
  add column if not exists custom_commission_rate numeric(5,4),
  add column if not exists vanity_slug text unique,
  add column if not exists default_code_id uuid,
  add column if not exists primary_audience text,
  add column if not exists social_twitter text,
  add column if not exists follower_count_total integer,
  add column if not exists application_notes text,
  add column if not exists internal_notes text,
  add column if not exists payout_method_id uuid,
  add column if not exists payout_threshold_cents integer not null default 5000,
  add column if not exists tax_form_filed boolean not null default false,
  add column if not exists tax_form_type text,
  add column if not exists tax_form_url text,
  add column if not exists approved_at timestamptz,
  add column if not exists approved_by uuid references auth.users(id),
  add column if not exists last_activity_at timestamptz,
  add column if not exists total_clicks integer not null default 0,
  add column if not exists total_conversions integer not null default 0,
  add column if not exists total_gross_cents bigint not null default 0,
  add column if not exists total_commission_cents bigint not null default 0,
  add column if not exists total_paid_cents bigint not null default 0;

update public.affiliates set display_name = coalesce(display_name, name) where display_name is null;

create index if not exists idx_affiliates_user_id on public.affiliates(user_id);
create index if not exists idx_affiliates_tier on public.affiliates(tier);
create index if not exists idx_affiliates_vanity on public.affiliates(vanity_slug);

-- affiliate_codes
create table if not exists public.affiliate_codes (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references public.affiliates(id) on delete cascade,
  code text not null unique,
  code_type code_type not null default 'discount_and_tracking',
  is_default boolean not null default false,
  active boolean not null default true,
  discount_type discount_type,
  discount_value numeric(10,2),
  customer_discount_label text,
  stripe_promotion_code_id text,
  stripe_coupon_id text,
  max_uses integer,
  uses_count integer not null default 0,
  max_uses_per_customer integer not null default 1,
  minimum_order_cents integer,
  applies_to_product_ids text[],
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.affiliate_codes to authenticated;
grant all on public.affiliate_codes to service_role;
alter table public.affiliate_codes enable row level security;
create policy "codes admin all" on public.affiliate_codes for all to authenticated using (has_role(auth.uid(),'admin'::app_role)) with check (has_role(auth.uid(),'admin'::app_role));
create policy "codes affiliate read" on public.affiliate_codes for select to authenticated using (affiliate_id in (select id from public.affiliates where user_id = auth.uid()));

alter table public.affiliates drop constraint if exists fk_affiliates_default_code;
alter table public.affiliates add constraint fk_affiliates_default_code foreign key (default_code_id) references public.affiliate_codes(id) on delete set null;

create index if not exists idx_codes_affiliate on public.affiliate_codes(affiliate_id);

-- tracking_links
create table if not exists public.tracking_links (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references public.affiliates(id) on delete cascade,
  code_id uuid references public.affiliate_codes(id) on delete set null,
  short_slug text not null unique,
  destination_url text not null,
  label text,
  sub_id text,
  utm_source text default 'creator',
  utm_medium text default 'affiliate',
  utm_campaign text,
  utm_content text,
  click_count integer not null default 0,
  conversion_count integer not null default 0,
  revenue_cents bigint not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.tracking_links to authenticated;
grant select on public.tracking_links to anon;
grant all on public.tracking_links to service_role;
alter table public.tracking_links enable row level security;
create policy "links admin all" on public.tracking_links for all to authenticated using (has_role(auth.uid(),'admin'::app_role)) with check (has_role(auth.uid(),'admin'::app_role));
create policy "links affiliate own" on public.tracking_links for all to authenticated using (affiliate_id in (select id from public.affiliates where user_id = auth.uid())) with check (affiliate_id in (select id from public.affiliates where user_id = auth.uid()));
create policy "links public read active" on public.tracking_links for select to anon using (active = true);

-- affiliate_clicks
create table if not exists public.affiliate_clicks (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references public.affiliates(id) on delete cascade,
  code_id uuid references public.affiliate_codes(id),
  link_id uuid references public.tracking_links(id),
  visitor_id text not null,
  ip_hash text,
  user_agent_hash text,
  referrer text,
  landing_page text,
  country text, region text, city text,
  device_type text, browser text, os text,
  utm_source text, utm_medium text, utm_campaign text, utm_content text,
  sub_id text,
  converted boolean not null default false,
  conversion_id uuid,
  created_at timestamptz not null default now()
);
grant select on public.affiliate_clicks to authenticated;
grant all on public.affiliate_clicks to service_role;
alter table public.affiliate_clicks enable row level security;
create policy "clicks admin all" on public.affiliate_clicks for all to authenticated using (has_role(auth.uid(),'admin'::app_role)) with check (has_role(auth.uid(),'admin'::app_role));
create policy "clicks affiliate read" on public.affiliate_clicks for select to authenticated using (affiliate_id in (select id from public.affiliates where user_id = auth.uid()));
create index if not exists idx_clicks_affiliate on public.affiliate_clicks(affiliate_id);
create index if not exists idx_clicks_visitor on public.affiliate_clicks(visitor_id);
create index if not exists idx_clicks_created on public.affiliate_clicks(created_at desc);

-- affiliate_conversions
create table if not exists public.affiliate_conversions (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references public.affiliates(id) on delete cascade,
  code_id uuid references public.affiliate_codes(id),
  link_id uuid references public.tracking_links(id),
  click_id uuid references public.affiliate_clicks(id),
  visitor_id text,
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  stripe_customer_id text,
  customer_email text,
  order_id text,
  gross_amount_cents integer not null,
  discount_amount_cents integer not null default 0,
  net_amount_cents integer not null,
  commission_rate_used numeric(5,4) not null,
  commission_cents integer not null,
  status commission_status not null default 'pending',
  attribution_model text not null default 'last_touch',
  product_summary jsonb,
  hold_until timestamptz,
  approved_at timestamptz,
  cleared_at timestamptz,
  paid_at timestamptz,
  payout_id uuid,
  refunded_at timestamptz,
  refund_reason text,
  reversal_reason text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.affiliate_conversions to authenticated;
grant all on public.affiliate_conversions to service_role;
alter table public.affiliate_conversions enable row level security;
create policy "conv admin all" on public.affiliate_conversions for all to authenticated using (has_role(auth.uid(),'admin'::app_role)) with check (has_role(auth.uid(),'admin'::app_role));
create policy "conv affiliate read" on public.affiliate_conversions for select to authenticated using (affiliate_id in (select id from public.affiliates where user_id = auth.uid()));
create index if not exists idx_conv_affiliate on public.affiliate_conversions(affiliate_id);
create index if not exists idx_conv_status on public.affiliate_conversions(status);

-- payout_methods
create table if not exists public.payout_methods (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references public.affiliates(id) on delete cascade,
  method payout_method_type not null,
  is_default boolean not null default false,
  is_verified boolean not null default false,
  display_label text not null,
  stripe_connect_account_id text,
  stripe_connect_payouts_enabled boolean,
  crypto_address text,
  crypto_network text,
  plaid_account_id text,
  plaid_access_token_id text,
  mercury_account_id text,
  paypal_email text,
  metadata jsonb default '{}'::jsonb,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.payout_methods to authenticated;
grant all on public.payout_methods to service_role;
alter table public.payout_methods enable row level security;
create policy "pm admin all" on public.payout_methods for all to authenticated using (has_role(auth.uid(),'admin'::app_role)) with check (has_role(auth.uid(),'admin'::app_role));
create policy "pm affiliate own" on public.payout_methods for all to authenticated using (affiliate_id in (select id from public.affiliates where user_id = auth.uid())) with check (affiliate_id in (select id from public.affiliates where user_id = auth.uid()));
create unique index if not exists idx_methods_one_default on public.payout_methods(affiliate_id) where is_default = true;

alter table public.affiliates drop constraint if exists fk_affiliates_payout_method;
alter table public.affiliates add constraint fk_affiliates_payout_method foreign key (payout_method_id) references public.payout_methods(id) on delete set null;

-- affiliate_payouts
create table if not exists public.affiliate_payouts (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references public.affiliates(id) on delete cascade,
  payout_method_id uuid references public.payout_methods(id),
  method payout_method_type not null,
  amount_cents integer not null,
  fee_cents integer not null default 0,
  net_amount_cents integer not null,
  currency text not null default 'USD',
  status payout_status not null default 'queued',
  external_transaction_id text,
  external_metadata jsonb default '{}'::jsonb,
  conversion_ids uuid[] not null default '{}',
  scheduled_for timestamptz,
  initiated_at timestamptz,
  paid_at timestamptz,
  failed_at timestamptz,
  failure_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.affiliate_payouts to authenticated;
grant all on public.affiliate_payouts to service_role;
alter table public.affiliate_payouts enable row level security;
create policy "po admin all" on public.affiliate_payouts for all to authenticated using (has_role(auth.uid(),'admin'::app_role)) with check (has_role(auth.uid(),'admin'::app_role));
create policy "po affiliate read" on public.affiliate_payouts for select to authenticated using (affiliate_id in (select id from public.affiliates where user_id = auth.uid()));

-- commission_tiers
create table if not exists public.commission_tiers (
  id uuid primary key default gen_random_uuid(),
  tier affiliate_tier not null unique,
  display_name text not null,
  commission_rate numeric(5,4) not null,
  recurring_commission_rate numeric(5,4),
  monthly_volume_threshold_cents integer not null,
  rolling_window_days integer not null default 30,
  bonus_per_milestone_cents integer,
  perks text[],
  badge_color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.commission_tiers to anon, authenticated;
grant all on public.commission_tiers to service_role;
alter table public.commission_tiers enable row level security;
create policy "tiers public read" on public.commission_tiers for select using (true);
create policy "tiers admin write" on public.commission_tiers for all to authenticated using (has_role(auth.uid(),'admin'::app_role)) with check (has_role(auth.uid(),'admin'::app_role));

insert into public.commission_tiers (tier, display_name, commission_rate, recurring_commission_rate, monthly_volume_threshold_cents, bonus_per_milestone_cents, perks, badge_color) values
  ('bronze','Bronze',0.10,0.05,0,0,array['Default tracking','Standard support'],'#cd7f32'),
  ('silver','Silver',0.15,0.075,100000,5000,array['Custom vanity slug','Quarterly bonus drops'],'#c0c0c0'),
  ('gold','Gold',0.20,0.10,500000,15000,array['Custom code prefix','Early product access','Priority support'],'#ffd700'),
  ('platinum','Platinum',0.25,0.125,1500000,50000,array['Free product seeding','Co-marketing','Dedicated manager'],'#22c55e')
on conflict (tier) do nothing;

-- affiliate_program_settings (singleton)
create table if not exists public.affiliate_program_settings (
  id smallint primary key default 1,
  default_commission_rate numeric(5,4) not null default 0.15,
  default_cookie_window_days integer not null default 90,
  default_attribution_model text not null default 'last_touch',
  default_hold_period_days integer not null default 30,
  minimum_payout_cents integer not null default 5000,
  auto_payout_enabled boolean not null default true,
  auto_payout_day_of_month integer not null default 10,
  auto_approve_commissions boolean not null default true,
  auto_approve_threshold_cents integer not null default 50000,
  refund_grace_period_days integer not null default 30,
  fraud_velocity_clicks_per_hour integer not null default 200,
  fraud_self_purchase_check boolean not null default true,
  application_questions jsonb default '[]'::jsonb,
  brand_kit_url text,
  support_email text default 'affiliates@resurrectedlabs.com',
  reply_to_email text,
  terms_url text default '/affiliate/terms',
  updated_at timestamptz not null default now(),
  constraint aps_singleton check (id = 1)
);
grant select on public.affiliate_program_settings to anon, authenticated;
grant all on public.affiliate_program_settings to service_role;
alter table public.affiliate_program_settings enable row level security;
create policy "aps public read" on public.affiliate_program_settings for select using (true);
create policy "aps admin write" on public.affiliate_program_settings for all to authenticated using (has_role(auth.uid(),'admin'::app_role)) with check (has_role(auth.uid(),'admin'::app_role));
insert into public.affiliate_program_settings (id) values (1) on conflict (id) do nothing;

-- affiliate_applications (creator sign-ups; separate from existing B2B applications)
create table if not exists public.affiliate_applications (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  display_name text not null,
  legal_name text,
  country text,
  phone text,
  social_instagram text,
  social_tiktok text,
  social_youtube text,
  social_twitter text,
  follower_count_total integer,
  primary_audience text,
  niche text,
  pitch text,
  why_resurrected_labs text,
  referred_by_affiliate_id uuid references public.affiliates(id),
  status text not null default 'pending',
  review_notes text,
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id),
  approved_affiliate_id uuid references public.affiliates(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant insert on public.affiliate_applications to anon, authenticated;
grant select, update, delete on public.affiliate_applications to authenticated;
grant all on public.affiliate_applications to service_role;
alter table public.affiliate_applications enable row level security;
create policy "aa public insert" on public.affiliate_applications for insert with check (true);
create policy "aa admin all" on public.affiliate_applications for all to authenticated using (has_role(auth.uid(),'admin'::app_role)) with check (has_role(auth.uid(),'admin'::app_role));

-- fraud_events
create table if not exists public.fraud_events (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid references public.affiliates(id) on delete cascade,
  conversion_id uuid references public.affiliate_conversions(id),
  click_id uuid references public.affiliate_clicks(id),
  event_type text not null,
  severity fraud_severity not null default 'low',
  details jsonb not null,
  status text not null default 'open',
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id),
  action_taken text,
  created_at timestamptz not null default now()
);
grant select, update on public.fraud_events to authenticated;
grant all on public.fraud_events to service_role;
alter table public.fraud_events enable row level security;
create policy "fraud admin" on public.fraud_events for all to authenticated using (has_role(auth.uid(),'admin'::app_role)) with check (has_role(auth.uid(),'admin'::app_role));

-- ledger_entries
create table if not exists public.ledger_entries (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references public.affiliates(id),
  entry_type text not null,
  amount_cents integer not null,
  balance_after_cents bigint not null,
  conversion_id uuid references public.affiliate_conversions(id),
  payout_id uuid references public.affiliate_payouts(id),
  description text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);
grant select on public.ledger_entries to authenticated;
grant all on public.ledger_entries to service_role;
alter table public.ledger_entries enable row level security;
create policy "ledger admin" on public.ledger_entries for all to authenticated using (has_role(auth.uid(),'admin'::app_role)) with check (has_role(auth.uid(),'admin'::app_role));
create policy "ledger affiliate read" on public.ledger_entries for select to authenticated using (affiliate_id in (select id from public.affiliates where user_id = auth.uid()));
create index if not exists idx_ledger_affiliate_time on public.ledger_entries(affiliate_id, created_at desc);

-- affiliate_notifications
create table if not exists public.affiliate_notifications (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid references public.affiliates(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  link_url text,
  read_at timestamptz,
  email_sent_at timestamptz,
  created_at timestamptz not null default now()
);
grant select, update on public.affiliate_notifications to authenticated;
grant all on public.affiliate_notifications to service_role;
alter table public.affiliate_notifications enable row level security;
create policy "notif admin" on public.affiliate_notifications for all to authenticated using (has_role(auth.uid(),'admin'::app_role)) with check (has_role(auth.uid(),'admin'::app_role));
create policy "notif affiliate read" on public.affiliate_notifications for select to authenticated using (affiliate_id in (select id from public.affiliates where user_id = auth.uid()));
create policy "notif affiliate update" on public.affiliate_notifications for update to authenticated using (affiliate_id in (select id from public.affiliates where user_id = auth.uid()));

-- affiliate_resources
create table if not exists public.affiliate_resources (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  title text not null,
  description text,
  file_url text not null,
  thumbnail_url text,
  file_size_bytes bigint,
  mime_type text,
  download_count integer not null default 0,
  active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.affiliate_resources to anon, authenticated;
grant all on public.affiliate_resources to service_role;
alter table public.affiliate_resources enable row level security;
create policy "res public read" on public.affiliate_resources for select using (active = true);
create policy "res admin write" on public.affiliate_resources for all to authenticated using (has_role(auth.uid(),'admin'::app_role)) with check (has_role(auth.uid(),'admin'::app_role));

-- updated_at trigger across new tables
do $$ declare t text;
begin
  foreach t in array array['affiliate_codes','tracking_links','affiliate_conversions','payout_methods','affiliate_payouts','commission_tiers','affiliate_applications']
  loop
    execute format('drop trigger if exists set_updated_at on public.%I;', t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.update_updated_at_column();', t);
  end loop;
end $$;
