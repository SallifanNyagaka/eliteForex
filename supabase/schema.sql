create table if not exists public.site_content (
  id bigserial primary key,
  section_key text not null unique,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.applications (
  id bigserial primary key,
  full_name text not null,
  email text not null,
  whatsapp_number text not null,
  country text not null,
  broker text,
  account_size text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.site_content enable row level security;
alter table public.applications enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "public can read site content" on public.site_content;
create policy "public can read site content"
on public.site_content
for select
to anon, authenticated
using (true);

drop policy if exists "admins can modify site content" on public.site_content;
create policy "admins can modify site content"
on public.site_content
for all
to authenticated
using (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "public can submit applications" on public.applications;
create policy "public can submit applications"
on public.applications
for insert
to anon, authenticated
with check (true);

drop policy if exists "admins can read applications" on public.applications;
create policy "admins can read applications"
on public.applications
for select
to authenticated
using (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "admins can read own admin record" on public.admin_users;
create policy "admins can read own admin record"
on public.admin_users
for select
to authenticated
using (auth.uid() = user_id);

/*
Expected site_content rows:

section_key = 'site'
payload = {
  "brandName": "Elite Forex Fund",
  "tagline": "Professional forex account management",
  "whatsappNumber": "254708218368",
  "whatsappDisplay": "+254 708 218 368",
  "phone": "+254 708 218 368",
  "email": "support@eliteforexfund.com",
  "location": "Nairobi, Kenya",
  "footerBlurb": "Professional Forex Account Management for serious investors.",
  "disclaimer": "Forex trading involves significant risk..."
}

section_key = 'hero'
payload = {
  "eyebrow": "Elite Forex Fund",
  "title": "Professional Forex",
  "description": "Grow your capital...",
  "primaryCta": "Apply Now",
  "secondaryCta": "View Performance",
  "rating": "4.9/5 Excellent",
  "highlights": [
    { "title": "Disciplined", "text": "Risk management first", "iconKey": "shield-check" }
  ]
}
*/
