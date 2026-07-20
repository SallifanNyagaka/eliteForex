# Form Email Setup

The application saves each form submission first, then processes the two queued emails after the HTTP response:

- An admin notification containing the complete submission.
- A confirmation email sent to the submitter.

## Setup

1. Run `supabase/seed_email_queue.sql` in the Supabase SQL editor.
2. Create a free Resend account and API key.
3. Add the following variables to `.env.local` and to the production deployment environment:

```dotenv
RESEND_API_KEY=re_your_api_key
FORM_NOTIFICATION_EMAIL=admin@example.com
RESEND_FROM_EMAIL="Elite Forex Fund <onboarding@resend.dev>"
CRON_SECRET=replace-with-a-long-random-value
```

4. Redeploy the application after setting the production variables.

## Development Sender Limitation

`onboarding@resend.dev` can only deliver to the email address associated with the Resend account. During development, use that address for `FORM_NOTIFICATION_EMAIL` and as the submitter email when testing.

Before production, verify a sending domain in Resend and change `RESEND_FROM_EMAIL`, for example:

```dotenv
RESEND_FROM_EMAIL="Elite Forex Fund <notifications@eliteforexfund.com>"
```

## Retry Behavior

Email failures do not affect saved applications or the success response shown to visitors. Failed jobs remain in `email_jobs` and use increasing retry delays. The protected `/api/cron/email-queue` route provides backup processing, and `vercel.json` invokes it daily on Vercel's free Hobby-compatible schedule.
