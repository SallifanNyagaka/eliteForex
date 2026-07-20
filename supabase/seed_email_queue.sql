-- Additive migration for durable form-submission email delivery.
-- Run this file once in the Supabase SQL editor. It is safe to rerun.

create table if not exists public.email_jobs (
  id bigserial primary key,
  application_id bigint not null references public.applications(id) on delete cascade,
  email_type text not null check (email_type in ('admin_notification', 'user_confirmation')),
  status text not null default 'pending' check (status in ('pending', 'processing', 'failed', 'sent', 'dead')),
  attempts integer not null default 0 check (attempts >= 0),
  max_attempts integer not null default 5 check (max_attempts > 0),
  available_at timestamptz not null default now(),
  locked_at timestamptz,
  completed_at timestamptz,
  provider_message_id text,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (application_id, email_type)
);

create index if not exists email_jobs_ready_idx
  on public.email_jobs (status, available_at, created_at)
  where status in ('pending', 'failed');

alter table public.email_jobs enable row level security;

create or replace function public.enqueue_application_emails()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.email_jobs (application_id, email_type)
  values
    (new.id, 'admin_notification'),
    (new.id, 'user_confirmation')
  on conflict (application_id, email_type) do nothing;

  return new;
end;
$$;

drop trigger if exists enqueue_application_emails_after_insert on public.applications;
create trigger enqueue_application_emails_after_insert
after insert on public.applications
for each row execute function public.enqueue_application_emails();

create or replace function public.claim_email_jobs(batch_size integer default 10)
returns setof public.email_jobs
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.email_jobs as stale_job
  set
    status = 'dead',
    locked_at = null,
    last_error = coalesce(stale_job.last_error, 'Email worker timed out on the final attempt.'),
    updated_at = now()
  where stale_job.status = 'processing'
    and stale_job.attempts >= stale_job.max_attempts
    and stale_job.locked_at < now() - interval '10 minutes';

  return query
  with ready_jobs as (
    select job.id
    from public.email_jobs as job
    where (
        job.status in ('pending', 'failed')
        or (job.status = 'processing' and job.locked_at < now() - interval '10 minutes')
      )
      and job.attempts < job.max_attempts
      and job.available_at <= now()
    order by job.created_at asc
    for update skip locked
    limit least(greatest(batch_size, 1), 25)
  )
  update public.email_jobs as job
  set
    status = 'processing',
    attempts = job.attempts + 1,
    locked_at = now(),
    updated_at = now()
  from ready_jobs
  where job.id = ready_jobs.id
  returning job.*;
end;
$$;

revoke all on table public.email_jobs from public, anon, authenticated;
revoke all on function public.claim_email_jobs(integer) from public, anon, authenticated;
grant execute on function public.claim_email_jobs(integer) to service_role;
