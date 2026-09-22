# Business Context

> The stable, business-model-level truth of THIS client project. The CEO fills
> this during onboarding (fork protocol) and checks every new Founder idea
> against it. Updated only when the business itself changes (Founder-approved).
> Never copied between client repos.

## Client & Project
*(name, industry, what we're building for them)*
- Self/product build (not a third-party agency client): "starter-ecommerce" — a production-ready multi-vendor e-commerce platform. **Inferred from repo contents (CLAUDE.md feature map, PRODUCTION_PLAN.md, ENDPOINT_TRACKER.md) — not yet confirmed line-by-line with the Founder. Correct anything below that's wrong.**

## Target Customers
- Vendors (create stores, list products, manage inventory, need an active subscription package)
- Shoppers/customers (browse, cart, checkout, track orders)
- Platform admins (user/role/permission management, analytics, content, orders, shipping/tax/promotions)

## Value Proposition
- A turnkey multi-vendor marketplace: vendors sell, customers buy, admins run the platform end-to-end (payments, analytics, CMS).

## Product Scope — IN
- Everything in CLAUDE.md's Application Feature Map: auth (register/login/logout), cart/checkout (Stripe + PayPal), vendor stores + packages/subscriptions, product/inventory management, order history, admin dashboard (users, roles, permissions, orders, stores, categories, shipping, taxes, promotions, articles/blog, returns, comments), analytics.

## Product Scope — explicitly OUT
- Not yet defined by the Founder — none excluded on record. Ask before assuming a feature is out of scope.

## Stack Deviations from Template Default
*(default: npm/yarn workspace monorepo — Next.js Pages Router + Redux Toolkit + Axios (`client`) / Express + Sequelize + PostgreSQL + cookie-JWT + Stripe/PayPal + Helmet/Winston/Swagger (`server`) / `@project/shared` (Zod schemas, DTOs, enums — `packages/shared`) — full detail in `AGENTS.md`; note anything different here)*
*(listing .NET or Java/Spring here ACTIVATES the conditional backend-dotnet / backend-springboot agents; listing a Next.js App Router API surface here ACTIVATES the conditional backend-nextjs agent instead of the default backend-node)*
- None — matches template default exactly (confirmed via CLAUDE.md: Next.js 14 Pages Router client on :3001, Express/Sequelize/Postgres server on :3000, cookie-based JWT, Stripe + PayPal, Swagger at `/api-docs`).

## Optional Execution Tiers (DeepSeek, Jules)
*(Nothing to configure here for either — activation is automatic when `DEEPSEEK_API_KEY` / `JULES_API_KEY` is set. Check with `node .claude/setup/deepseek-status.mjs` / `node .claude/setup/jules-status.mjs`. Record only the DATA-FLOW decisions below, which are Founder calls and are NOT automatic.)*
- Client data may be sent to DeepSeek: **no** (default — change only on written Founder approval; DeepSeek is a third-party subprocessor)
- Client data may be sent to Jules: **no** (default — change only on written Founder approval; Jules operates on the repo it's pointed at — never a repo mixing multiple clients' code)

## Platforms in Use
*(which skills are relevant: whatsapp / brevo / ecommerce-crm / cloudflare / aws / heroku)*
- Stripe, PayPal (payments). No hosting/CDN platform confirmed yet.

## Constraints (budget, timeline, tech, legal, data residency)
- Not yet stated by the Founder.

## Standing Founder Preferences
- Founder gives goals in plain language; the team translates to technical work.
- LOW/MEDIUM work proceeds autonomously; HIGH work and Always-Stop items come back for approval.
