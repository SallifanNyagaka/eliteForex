-- Additive migration/seed for contact preferences, privacy policy, phone lists,
-- and editable hero image CTAs. This file is safe to run more than once.

alter table public.applications
  add column if not exists preferred_contact_method text not null default 'whatsapp';

alter table public.applications
  add column if not exists preferred_contact_detail text;

alter table public.applications
  add column if not exists confirmed_over_18 boolean not null default false;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'applications_preferred_contact_method_check'
      and conrelid = 'public.applications'::regclass
  ) then
    alter table public.applications
      add constraint applications_preferred_contact_method_check
      check (preferred_contact_method in ('whatsapp', 'email', 'phone'));
  end if;
end
$$;

insert into public.site_content (section_key, payload)
select
  'contact_settings',
  jsonb_build_object(
    'phoneNumbers', jsonb_build_array(
      jsonb_build_object(
        'label', 'WhatsApp',
        'number', coalesce(source.payload ->> 'whatsappNumber', '254708218368'),
        'display', coalesce(source.payload ->> 'whatsappDisplay', '+254 708 218 368')
      )
    ),
    'privacyPolicy', null
  )
from (
  select payload
  from public.site_content
  where section_key = 'site'
  union all
  select '{}'::jsonb
  limit 1
) as source
on conflict (section_key) do nothing;

with hero_defaults(section_key, actions) as (
  values
    ('hero', '[{"label":"Apply Now","href":"#apply","position":"auto"},{"label":"View Performance","href":"/performance","position":"auto"}]'::jsonb),
    ('about_hero', '[{"label":"Contact Us","href":"/contact","position":"auto"},{"label":"View Performance","href":"/performance","position":"auto"}]'::jsonb),
    ('services_hero', '[{"label":"Contact Us","href":"/contact","position":"auto"},{"label":"View Performance","href":"/performance","position":"auto"}]'::jsonb),
    ('packages_hero', '[{"label":"Make an Inquiry","href":"/contact","position":"auto"},{"label":"View Performance","href":"/performance","position":"auto"}]'::jsonb),
    ('contact_hero', '[{"label":"Send an Inquiry","href":"#contact-form","position":"auto"},{"label":"View Performance","href":"/performance","position":"auto"}]'::jsonb),
    ('faq_hero', '[{"label":"Contact Us","href":"/contact","position":"auto"},{"label":"View Performance","href":"/performance","position":"auto"}]'::jsonb)
)
update public.site_content as content
set
  payload = jsonb_set(content.payload, '{mediaActions}', hero_defaults.actions, true),
  updated_at = now()
from hero_defaults
where content.section_key = hero_defaults.section_key
  and not (content.payload ? 'mediaActions');
