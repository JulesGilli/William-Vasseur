# Shop backend — runbook

The storefront in `src/` is static (GitHub Pages). Everything dynamic — the
catalogue, stock, orders and payment — lives in a Supabase project plus
Stripe Checkout. This folder is the whole backend: two SQL migrations and two
edge functions. Nothing here runs until it is deployed to a Supabase project.

## Who owns what (freelance setup)

The infrastructure belongs to the client, not the developer:

- **Stripe** — account created by **William** in his name (his business, his
  IBAN, his tax obligations; sale proceeds must never transit through anyone
  else). William invites the developer from
  *Settings → Team* with the **Developer** role.
- **Supabase** — organization created by **William** (free, just an email).
  He invites the developer from *Organization settings → Team* as
  **Administrator**, not Developer: the Developer role is read-only on
  organization resources and cannot apply migrations, deploy functions or set
  secrets, which is the whole of the checklist below. Administrator can do all
  of that while William keeps Owner — billing, transferring the project, and
  removing members stay his alone. The shop project is created inside his
  organization, so when the engagement ends he keeps everything by removing
  one member.

  Note that on the Free plan roles are organization-wide; project-scoped roles
  need the Team plan. With one project in the org that makes no difference.

## What it costs

Stripe has no monthly fee; it takes a cut per sale. Supabase is free to build
on, but the Free plan pauses a project after about a week without database
activity — fine while we are working, not fine for a shop that must answer at
3am on a Sunday. Budget the Pro plan (about $25/month) at the moment the first
real payment can be taken, not before.

## Go-live checklist

1. **Create the Supabase project** (in William's org, region `eu-west-3`).
2. **Apply the migrations** in order:
   `20260809000001_shop_schema.sql`, then `20260809000002_shop_seed.sql`.
3. **Deploy both functions** (`shop` and `stripe-webhook`), each with
   `verify_jwt` disabled — `shop` is a public catalogue/checkout API and the
   webhook authenticates with Stripe's signature instead.
4. **Set the secrets** on the project:
   - `STRIPE_SECRET_KEY` — from Stripe *Developers → API keys*
     (`sk_test_…` first; swap for `sk_live_…` at launch).
   - `SITE_URL` — `https://julesgilli.github.io/William-Vasseur`
     (or the final domain).
5. **Register the webhook** in Stripe *Developers → Webhooks*:
   - endpoint `https://<project-ref>.supabase.co/functions/v1/stripe-webhook`
   - event `checkout.session.completed`
   - copy the signing secret into the `STRIPE_WEBHOOK_SECRET` project secret.
6. **Point the front at the backend**: set the repository variable
   `VITE_SHOP_API` (GitHub → repo *Settings → Secrets and variables →
   Actions → Variables*) to
   `https://<project-ref>.supabase.co/functions/v1/shop`.
   The deploy workflow passes it into the build; while it is unset the site
   keeps its current "storefront preview" behaviour.
7. **Test in Stripe test mode**: card `4242 4242 4242 4242`, any future date,
   any CVC. Check the order flips to `paid` in the `orders` table and stock
   drops in `variants`.

## Day-to-day for William

- **Stock and prices**: edit rows in the `variants` table
  (Supabase dashboard → Table Editor). `stock` empty = made to order;
  `0` = shows as sold out.
- **Orders**: the `orders` table, newest first; `paid` rows carry the buyer's
  email and the total. Shipping details live in the Stripe dashboard next to
  each payment.
- **Refunds / disputes**: handled entirely from the Stripe dashboard.
