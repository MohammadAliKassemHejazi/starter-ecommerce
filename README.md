# Multi-Vendor E-Commerce Platform — System, File & Cleanup Reference

> **Scope of this document.** Everything here was verified against the actual working tree
> (`main`, commit `c819ada`) — file paths, ports, scripts, dependencies and usage counts were read
> from the code, not copied from `AGENTS.md` / `CLAUDE.md`. Those two files describe the *template*
> this repo descends from and **drift from reality in several places**; every divergence is listed in
> [§10 Template drift](#10-template-drift-agentsmd--claudemd-vs-reality).
>
> It also contains the part most repositories never write down: a **file-by-file verdict** on what
> is real source, what is generated, and what is throwaway debris left by earlier debugging sessions
> ([§9 File inventory](#9-file-inventory-what-to-keep-what-to-delete)).

## Contents

1. [What this project is](#1-what-this-project-is)
2. [Repository at a glance](#2-repository-at-a-glance)
3. [Verified tech stack](#3-verified-tech-stack)
4. [Repository map](#4-repository-map)
5. [Architecture](#5-architecture)
6. [Environment variables](#6-environment-variables)
7. [Setup, run, seed, test](#7-setup-run-seed-test)
8. [Documentation index](#8-documentation-index-what-to-believe-and-what-not)
9. [**File inventory: what to keep, what to delete**](#9-file-inventory-what-to-keep-what-to-delete)
10. [Template drift: AGENTS.md / CLAUDE.md vs reality](#10-template-drift-agentsmd--claudemd-vs-reality)
11. [Known gaps & risks](#11-known-gaps--risks)
12. [How these claims were checked](#12-how-these-claims-were-checked)

---

## 1. What this project is

A multi-vendor e-commerce platform: a Next.js storefront/admin front end talking to an Express +
PostgreSQL API. From the code, the delivered feature set is:

| Area | Delivered |
|---|---|
| **Storefront** | Home (stores + featured products), shop listing with category/search/pagination, product detail, articles/blog, about, cart, favorites, checkout, order history |
| **Payments** | Stripe (PaymentIntents + webhook) and PayPal (create/capture order) — two independent flows, plus a separate package-subscription flow |
| **Vendor** | Store CRUD with image upload, product CRUD with multi-image upload, vendor dashboard (sales/inventory/orders), package subscription & limits |
| **Admin / RBAC** | Users, roles, permissions, role↔user & role↔permission assignment, audit logs, analytics, user sessions, packages, shipping methods, taxes, sizes/size-items, promotions, comments, return requests, translations |
| **Platform** | JWT auth, tiered rate limiting, Winston logging, Swagger/OpenAPI docs, i18n (en/ar/fr/es), light/dark themes, RBAC-aware navigation |

## 2. Repository at a glance

| Metric | Value |
|---|---|
| Tracked files (git) | **593** |
| Source trees | **3** — `client/` (Next.js), `server/` (Express), `shared/` (TS contracts) |
| Root `package.json` | **absent** → this is *not* an npm workspace; `client/` and `server/` install separately |
| Client pages (`client/pages/**/*.tsx`) | **66** |
| Redux slices | **18** (+ `store.ts`, `cartSelectors.ts`) |
| Client services (API layer) | **19** |
| Server route modules (`src/routes/*.route.ts`) | **27**, declaring **136** endpoints |
| Sequelize models | **32** (`src/models/*.ts` + `index.ts`) |
| Server controllers / services | **26** / **21** (each `+ index.ts`; services also has 2 test files) |
| `shared/` contract files | **28** (`types/` 17 + `types/requests/` 11) |
| E2E spec files (Playwright) | **10** |
| Backend test files | **5** (run with `bun test`) |
| Runtime deps | client **29**, server **26** |

## 3. Verified tech stack

### Client (`client/`) — Next.js **Pages Router** (`client/pages`)

| Purpose | Library | Version (from `package.json`) |
|---|---|---|
| Framework | `next` | `^14.2.35` |
| UI | `react`, `react-dom` | `^18.2.0` |
| Language | `typescript` | `^5.9.3` (strict) |
| State | `@reduxjs/toolkit` `^2.2.1`, `react-redux` `^9.1.0` | |
| HTTP | `axios` `^1.2.1` | |
| Styling | `sass` `^1.93.2`, `bootstrap` `^5.3.8`, `react-bootstrap` `^2.10.10` | |
| Payments | `@stripe/stripe-js` `^4.9.0`, `@stripe/react-stripe-js` `^2.8.1`, `@paypal/react-paypal-js` `^8.9.1` | |
| Forms | `formik` `^2.4.5` (used in 15 files) | |
| Charts | `chart.js` `^4.4.7`, `react-chartjs-2` `^5.3.0` | |
| i18n | `i18next` `^23.7.6`, `react-i18next` `^13.5.0`, `i18next-browser-languagedetector` | |
| UI extras | `sweetalert2`, `swiper`, `lucide-react`, `react-image-crop`, `react-images-uploading`, `react-datepicker`, `moment` / `react-moment` | |
| E2E tests | `@playwright/test` `^1.57.0` | |

### Server (`server/`) — Express

| Purpose | Library | Version |
|---|---|---|
| Framework | `express` | `^4.18.3` |
| Language | `typescript` `^4.9.5` (strict), `ts-node`, `nodemon` | |
| DB | `sequelize` `^6.21.2` + `pg` `^8.7.3` (PostgreSQL; `dialect: 'postgres'` is hard-coded in `src/config/config.ts`) | |
| Tests | `bun` (`npm test` → `bun test`), with `sqlite3` `^5.1.7` as a dev dep for a SQLite test database | |
| Auth | `jsonwebtoken` `^9.0.2`, `bcrypt` `^5.0.1` | |
| Security | `helmet` `^7.1.0`, `cors` `^2.8.5`, `express-rate-limit` `^7.2.0` (3 tiers), `express-validator` `^7.2.1` | |
| Payments | `stripe` `^16.12.0`, `@paypal/checkout-server-sdk` `^1.0.3`, `@paypal/paypal-server-sdk` `^1.1.0` | |
| Uploads | `multer` `^1.4.5-lts.1` + `sharp` `^0.33.3` (resize/compress into `compressed/`) | |
| Ops | `winston` `^3.12.0`, `morgan`, `compression`, `pm2`, `swagger-ui-express` `^5.0.0`, `uuid` | |

### `shared/` — the contract layer

Plain `.ts` files only — no `package.json`, no runtime code, no build step. Response/entity types
live in `shared/types/`, request DTO types in `shared/types/requests/`. Both sides consume them
through the TypeScript path alias **`@shared/*`** (`client/tsconfig.json` → `["../../shared/*"]`,
`server/tsconfig.json` → `["../../shared/*"]`), used in **99** import sites. This is the mechanism
that keeps front-end and back-end shapes honest at compile time.

### Declared but effectively unused (verified by search)

| Dependency | Finding |
|---|---|
| `zod` | **0** references anywhere — the template expects Zod schemas in `shared/`; this repo validates with `express-validator` instead (8 files) |
| `yup` (client) | **0** source references; forms are built with `formik` |
| `pino-pretty` (server) | `pino` itself is not a dependency |
| `@types/lodash.debounce` (client) | no `lodash.debounce` runtime dependency exists |
| `@paypal/checkout-server-sdk` | the newer `@paypal/paypal-server-sdk` is what `paypal.service.ts` imports |
| `spdy` (server) | no reference in `server/` source |

## 4. Repository map

```
starter-ecommerce/
├── client/                      Next.js 14 (Pages Router) front end
│   ├── pages/                   ← the actual router root (66 .tsx)
│   │   ├── api/user/[...AUTH].ts  BFF proxy: login/register/logout/session
│   │   ├── auth/ shop/ store/ cart/ orders/ articles/ packages/ payment/
│   │   ├── users/ roles/ permissions/ promotions/ returns/ shipping/ sizes/ taxes/
│   │   ├── categories/ subcategories/ comments/ favorites/ analytics/ dashboard/
│   │   └── index.tsx home.tsx about.tsx profile.tsx settings.tsx plans.tsx + demo pages
│   ├── src/
│   │   ├── components/          Layouts, Guards, UI/General, UI/ModernTable, Vendor, Payment,
│   │   │                        Package, permissions, User, Error, examples/
│   │   ├── config/              config.ts, navigation.ts (RBAC-aware nav tree)
│   │   ├── constants/           permissions.ts
│   │   ├── contexts/            ToastContext.tsx
│   │   ├── features/            profile/, settings/ (+ types/utils)
│   │   ├── hooks/               usePageData, usePermissions, useTableActions,
│   │   │                        useFormValidation, useAnalyticsTracker, useRunOnce
│   │   ├── i18n/                index.ts + locales/{en,ar,fr,es}.json
│   │   ├── interfaces/          api/, types/, viewModels/  (client-side mirrors)
│   │   ├── mocks/               mockDatabase.ts, pageMocks.ts   ← currently unused
│   │   ├── models/              per-entity view models
│   │   ├── services/            one *Service.ts per API area (Axios calls)
│   │   ├── store/               store.ts + slices/ (18 slices, cartSelectors.ts)
│   │   └── utils/               httpClient.ts, apiUtils.ts, cookiesUtil.ts, validation.ts, …
│   ├── styles/                  scss/ theme system (_theme-variables, themes/_normal|_christmas|_black-friday)
│   ├── public/                  favicon, logo, product/demo imagery (see §9.8)
│   ├── tests/                   Playwright specs + tests/mocks.ts
│   ├── next.config.js           SCSS includePaths + remotePatterns for the API on :5300
│   └── playwright.config.ts     baseURL http://localhost:3000
│
├── server/                      Express + Sequelize API
│   ├── index.ts                 ← application entry point (routes, helmet, CORS, rate limits,
│   │                              multer, static /uploads + /compressed, swagger, error handler)
│   ├── src/
│   │   ├── config/              config.ts, db.config.ts, logger.ts, swagger/
│   │   ├── controllers/         HTTP request/response only (26)
│   │   ├── interfaces/types/    controller / middleware / model type definitions
│   │   ├── middlewares/         auth, permission, validation, errorHandler, cache,
│   │   │                        protectedRoutes, responseStandardizer, shop, store
│   │   ├── models/              Sequelize models + associations (32 + index.ts)
│   │   ├── routes/              27 route modules + swaggerSchema/ (typed + generated JSON)
│   │   ├── scripts/             runScripts.ts, seedData.ts, permissions.ts, generateAutoSwagger.ts
│   │   ├── services/            business logic + transactions (21)
│   │   ├── tests/               service-level tests (bun)
│   │   ├── utils/               customError.ts, responseFormatter.ts, errors/*.errors.ts
│   │   └── benchmarks/          perf scripts (bulk create, image update)
│   ├── benchmarks/              benchmark.ts
│   ├── logs/                    Winston output — runtime artifacts, see §9.2
│   └── tsconfig.json            outDir ./dist, strict, @shared/* → ../../shared/*
│
├── shared/types/                ← cross-boundary contracts (17 files)
│   └── requests/                request DTOs (11 files)
│
├── .claude/                     agent-team tooling (agents, skills, hooks, templates, setup, company)
├── .devcontainer/               optional dev container definition
├── .jules/bolt.md               Jules agent learning log
├── .vscode/launch.json          "Next: Client" debug config
├── scripts/whats-next.mjs       cross-tool sprint orientation script
├── AGENTS.md / CLAUDE.md        template-level agent instructions (see §10 for drift)
└── .mcp.json, repomix.config.json, .gitignore
```

## 5. Architecture

### 5.1 End-to-end request path

```
Browser
  └─ Next.js page (client/pages/**)            SSR/CSR React, RBAC-aware navigation
       └─ Redux thunk (client/src/store/slices/*Slice.ts)   createAsyncThunk
            └─ client/src/services/*Service.ts              one module per API area
                 └─ client/src/utils/httpClient.ts          Axios instance
                      • baseURL = process.env.NEXT_PUBLIC_BASE_URL_API
                      • request interceptor is commented out (token comes from the cookie, see below)
                      • response interceptor: if a body has no `success` key it is wrapped
                        into `{ success: true, message: 'Success', data: <body> }`
                      • error interceptor → handleApiError() → normalized error object
                           ↓ HTTP (JSON)
Express (server/index.ts)
  helmet → compression → express.json → urlencoded → cors() → morgan → rate limiter
  → /uploads + /compressed static → GET /health → responseStandardizer
  → router (/api/...) → controller → service → Sequelize model → PostgreSQL
                           ↑
                    responseStandardizer rewrites res.json() on the way out
```

**Auth is proxied through Next.js, not called directly.** `client/pages/api/user/[...AUTH].ts` is a
Next.js API route (BFF): it forwards `login` / `register` / `logout` / `session` to the Express API
and stores the access token in a cookie set with `httpOnly: true`,
`secure: NODE_ENV !== 'development'`, `sameSite: 'strict'` (lines 35–38 of that file).
The Express server itself never sets cookies — it returns the token in the JSON body.
`server/src/middlewares/auth.middleware.ts` verifies the JWT on protected routes and attaches the
decoded payload to the request; `permission.middleware.ts` + `protectedRoutes.middleware.ts` enforce
RBAC and return **403** (not 500) on denial.

### 5.2 Server layering (strict direction: `routes → controllers → services → models`)

| Layer | Responsibility | Location |
|---|---|---|
| `routes/` | URL ↔ controller wiring, per-route middleware (`express-validator` rules, auth guards) | `server/src/routes/*.route.ts` |
| `controllers/` | Request parsing + HTTP status/response shape. **No business logic.** | `server/src/controllers/*.controller.ts` |
| `services/` | Business logic, multi-model transactions, external SDKs (Stripe/PayPal), response shaping | `server/src/services/*.service.ts` |
| `models/` | Sequelize definitions + associations, loaded centrally by `models/index.ts`. Never imported by the client. | `server/src/models/*.ts` |
| Cross-cutting | `middlewares/` (auth, permission, validation, error handler, cache, response standardizer, upload-specific), `utils/` (`customError.ts` + per-domain `errors/*.errors.ts`), `config/` (`config.ts`, `db.config.ts`, `logger.ts`, `swagger/`), `scripts/` (seed/bootstrap), `interfaces/types/` | |

### 5.3 API surface (mount table from `server/index.ts`)

| Mounted path | Router module | Notes |
|---|---|---|
| `/api-docs` | Swagger UI | `swagger-ui-express` + generated spec |
| `/api/auth` | `auth.route.ts` | mounted with the **strict** auth rate limiter |
| `/api/cart` | `cart.route.ts` | |
| `/api/orders` | `order.route.ts` | |
| `/api/payment` | `payment.route.ts` | Stripe intents + webhook |
| `/api/paypal` | `paypal.routes.ts` | create/capture order |
| `/api/utile` | `utile.route.ts` | countries/currencies-style helpers |
| `/api/users` | `user.route.ts` | user profile endpoints |
| `/api/articles`, `/api/categories`, `/api/comments`, `/api/promotions`, `/api/analytics`, `/api/translations`, `/api/packages`, `/api/shipping`, `/api/sizes`, `/api/taxes`, `/api/returns`, `/api/favorites` | one module each | |
| `/api/public` | `public.route.ts` | anonymous storefront reads, mounted with the **generous** public rate limiter |
| `/api/admin/users` | `users.route.ts` | admin user management |
| `/api/admin/orders` | `order.route.ts` **re-used** | alias: the same router object is exported twice in `routes/index.ts`, so `/api/admin/orders/*` and `/api/orders/*` are the same handlers |
| `/api/admin/permissions`, `/api/admin/roles`, `/api/admin/subcategories`, `/api/admin/inventory`, `/api/admin/audit-logs` | `permission`, `role`, `subcategory`, `dashboard`, `auditLog` | |
| `/api/shop` | `shop.route.ts` | precedes `shopUploadMiddleware` + `shopMiddleWare` (product images/ownership) |
| `/api/store` | `store.route.ts` | preceded by `storeUploadMiddleware` + `storeMiddleWear` |
| `/uploads`, `/compressed` | `express.static` | original vs. `sharp`-optimized images |
| `/health` | inline handler | skipped by the rate limiter; checked before the standardizer |

Rate limiting is **tiered** in `server/index.ts`: general (`1000`/15 min dev, `100` prod), auth
(`50` dev / `5` prod) and public API (`1000` dev / `200` prod).

### 5.4 The response envelope (the contract that holds the two halves together)

Every endpoint returns one of two shapes. `server/src/middlewares/responseStandardizer.middleware.ts`
is mounted **after** `/health` and **before** every router, so it is impossible to bypass:

```json
{ "success": true,  "message": "Success", "data": { } }
{ "success": true,  "message": "Success", "data": [ ], "meta": { "page": 1, "pageSize": 10, "total": 100, "totalPages": 10 } }
{ "success": false, "message": "…",       "errors": [ { "field": "quantity", "issue": "…" } ] }
```

What the standardizer actually does (read the file before changing any controller):

1. Skips `/api-docs`.
2. Monkey-patches `res.json`, so **every** JSON response passes through it.
3. If the body already has a `success` key, it keeps it, but **hoists stray top-level fields**:
   `page`, `pageSize`, `total`, `totalPages`, `limit`, `offset` and `meta` are pulled into
   `meta`; any remaining stray fields are merged into `data` (or, if `data` is an array,
   the array is wrapped as `{ items: [...] , ...rest }`).
4. If the body has no `success` key (a raw controller return), it is wrapped as
   `{ success: true, message: 'Success', data: <body> }`, with the same pagination-hoisting logic.

Practical consequence for controller authors: returning `{ data: rows, total, page }` yields
`{ success, message, data: rows, meta: { total, page } }`; a bare array yields
`{ success, message, data: [...] }`. The client's Axios interceptor has a matching fallback that
wraps any legacy body lacking `success`, so a forgotten `res.json({ … })` degrades gracefully
instead of crashing the UI. `server/src/utils/responseFormatter.ts` is the helper used for the
explicit form.

### 5.5 Client architecture

| Concern | Where | How it works |
|---|---|---|
| Routing | `client/pages/**` | Next.js **Pages Router** (not App Router). 66 page files; `_app.tsx` wires Redux `Provider`, i18n and global SCSS; `_document.tsx` sets the `data-theme` attribute used by the theme system |
| Pages vs. `src/` | `client/pages` + `client/src` | Pages are thin: they read the view model from Redux and render components |
| State | `client/src/store/store.ts`, `slices/` | Redux Toolkit; network calls are `createAsyncThunk`; state typed through `client/src/interfaces/types/store/slices/*` |
| API layer | `client/src/services/*Service.ts` | One module per domain, all going through `httpClient` |
| Auth guard | `client/src/components/Guards/` + `hooks/usePermissions.ts` + `constants/permissions.ts` | Route-level role/permission gates; `config/navigation.ts` builds the whole nav tree per role (admin/vendor/user), including a "Demo Pages" group |
| View models & fallbacks | `client/src/interfaces/viewModels/`, `hooks/usePageData.ts` | Each page declares its view model and a default/fallback object so a failed API call still renders |
| Styling | `client/styles/scss/` | Bootstrap 5 SCSS with overrides, CSS variables for theming, three shipped themes (`_normal`, `_christmas`, `_black-friday`) |
| i18n | `client/src/i18n/` | `i18next` + language detector; `en`/`ar`/`fr`/`es` JSON in `locales/` (`es`/`fr` are ~3.5× larger than `en`/`ar`) |
| Uploads | `components/UI/General/ImageUploadComponent`, `dynamicSizeImage`, `imageViewer`, `ImagesSlider` | Crop/compress client-side, `multer`+`sharp` server-side |
| Tables & charts | `components/UI/ModernTable`, `chart.js` + `react-chartjs-2` | Shared admin table with actions + analytics/vendor charts |

### 5.6 Data model (32 Sequelize models)

`Users`, `UserSessions`, `UserPackages`, `Role`, `Permission`, `RolePermission`, `RoleUser`,
`Stores`, `Products`, `ProductImage`, `Sizes`, `SizeItem`, `Categories`, `Subcategories`, `Tax`,
`Orders`, `OrderItem`, `Carts`, `CartItem`, `Payment`, `Package`, `Promotion`, `Comments`,
`Favorites`, `FavoriteItem`, `Articles`, `Returns`, `Shipment`, `ShippmentMethod`, `Analytics`,
`AuditLog`, `MultiLan` (translations). All are registered and associated in
`server/src/models/index.ts`; `server/src/scripts/seedData.ts` (≈57 KB) seeds a full demo dataset,
and `permissions.ts` seeds the permission catalogue.

### 5.7 Payments

Two independent lifecycles, both driven by **server-side** confirmation (Stripe webhook / PayPal
capture) — never by a client redirect:

1. **Cart checkout** — `payment.controller.ts` → `payment.service.ts` (Stripe PaymentIntent, stock
   decrement on success) or `paypal.service.ts` + `routes/paypal.routes.ts`
   (`create-order` → `capture-order` → `GET /order/:orderId`).
2. **Package subscription** — `package.controller/service.ts`: `activate`, `assign`, `limits`,
   `active`, enforcing per-vendor store/product limits.

Front end: `client/pages/payment/checkoutwithstripe.tsx`, `components/Payment/*`,
`@paypal/react-paypal-js`, `store/slices/paymentSlice.ts`. Environment keys:
`Stripe_Key`, `WebhookSecret`, `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_ENVIRONMENT`
(see `PAYPAL_SETUP.md`).

## 6. Environment variables

There is **no `.env.example` in the repo** — the variable names below were extracted from
`server/src/config/config.ts`, `client/src/utils/httpClient.ts`, `client/pages/api/user/[...AUTH].ts`
and `PAYPAL_SETUP.md`. Create `.env` in each package (`server/.env` and `client/.env`); both are
git-ignored.

### `server/.env`

| Variable | Read by | Notes |
|---|---|---|
| `NODE_ENV` | `config.ts`, `index.ts` | **Required** — `index.ts` exits with code 1 if missing |
| `PORT` | `index.ts` | Falls back to `config.port` → **5300** |
| `DB_USERNAME`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` | `config.ts` | `DB_PORT` defaults to `5432` |
| `DB_DATABASE_DEVELOPMENT`, `DB_DATABASE_PRODUCTION`, `DB_DATABASE_TEST` | `config.ts` | dialect is hard-coded `postgres`; SSL auto-enabled when `NODE_ENV === 'production'` |
| `JWT_SECRET` | `config.webtoken` | |
| `Stripe_Key` | `config.Stripekey` | note the capitals: `Stripe_Key`, not `STRIPE_KEY` |
| `WebhookSecret` | `config.stripeWebhookSecret` | Stripe webhook signing secret |
| `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_ENVIRONMENT` | `config.paypal` | `sandbox` (default) or `live` |
| `CLIENT_URL` | `config.client` | intended CORS/redirect origin — note `cors()` is currently called with no options (§11) |
| `FRONTEND_URL` | PayPal redirect flows | documented in `PAYPAL_SETUP.md` |

`server/src/config/db.config.ts` reads the same `DB_*` values for the Sequelize CLI path, so keep both
consistent. Tests additionally use a SQLite storage env (see `server/testing.py` and the
`README_SUBMISSION.md` note about `DB_DIALECT=sqlite`, `DB_STORAGE=:memory:`).

### `client/.env`

| Variable | Used in | Notes |
|---|---|---|
| `NEXT_PUBLIC_BASE_URL_API` | `client/src/utils/httpClient.ts` (`baseURL`) | e.g. `http://localhost:5300/api` |
| `NEXT_PUBLIC_BASE_URL_Images` | image URL composition | e.g. `http://localhost:5300` |
| `NEXT_PUBLIC_Stripe_Key` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe.js | `NEXT_PUBLIC_Stripe_Key` is what the checkout page reads |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | `@paypal/react-paypal-js` | |
| `NEXT_PUBLIC_BASE_URL_LOCAL_API` | Playwright tests | `http://localhost:3000/api` |

## 7. Setup, run, seed, test

> **Not an npm workspace.** There is no root `package.json`, so run installs inside each package.

```bash
# 1. Install (two separate installs — shared/ needs none, it is .ts source only)
cd server && npm install
cd ../client && npm install

# 2. Configure  →  create server/.env and client/.env  (see §6)

# 3. Database: create an empty PostgreSQL database, then seed tables + demo data
cd server && npm run setup          # → ts-node src/scripts/runScripts.ts

# 4. Run (two terminals)
cd server && npm run dev            # nodemon index.ts   → http://localhost:5300
cd client && npm run dev            # next dev           → http://localhost:3000

# 5. API docs → http://localhost:5300/api-docs
```

**Ports (verified):** the Express API defaults to **5300** (`config.port`), the Next.js app to
**3000** (`next dev`, and `playwright.config.ts` `baseURL`). The previous README claimed 3000/3001 —
that is wrong for this tree; `next.config.js` additionally whitelists remote images from **:5300**.

### Available scripts

| Package | Script | Effect |
|---|---|---|
| `client` | `dev` / `build` / `start` / `lint` | `next dev` / `next build` / `next start` / `next lint` |
| `server` | `dev` | `nodemon index.ts` (works) |
| `server` | `build` | `tsc` → `dist/` (`outDir: ./dist`) |
| `server` | `start` | `node dist/index.js` (run `build` first) |
| `server` | `setup` / `seed-data` | `ts-node src/scripts/runScripts.ts` (seed) |
| `server` | `test` | `bun test` — **requires the Bun runtime** |
| `server` | `create-admin`, `assign-admin-role`, `build-dev` | ❌ **broken** — see §11 |
| `server` | `prettier`, `prettier:fix`, `eslint:fix` | ❌ **broken** — `eslint`/`prettier` are not installed |

### Tests

* **Client (Playwright, 10 specs):** `cd client && npx playwright test` (headless),
  `npx playwright test --ui`, `npx playwright show-report`. Specs: `auth`, `home`, `shop`,
  `packages`, `permissions`, `promotions`, `returns`, `roles`, `shipping`, `users` — all driven by
  API mocks in `client/tests/mocks.ts`, so a running backend is not required. See `client/TESTING.md`.
* **Server (bun, 5 files):** `store.service.test.ts`, `store.service.spec.ts`,
  `src/tests/services/shop.service.test.ts`, `utils/customError.test.ts`, `routes/user.route.spec.ts`
  → `cd server && npm test` (or `bun test`).
* **Client unit-ish tests:** `src/utils/permissionUtils.test.ts`, `src/utils/validation.test.ts`
  (excluded from `tsconfig.json`, so no runner is wired up for them).

## 8. Documentation index (what to believe, and what not)

| File | Status | What it is |
|---|---|---|
| `README.md` | ✅ authoritative | This document |
| `AGENTS.md` | ⚠️ template-level | Agent/engineering rules for the *template*; several stack claims do not match this tree (§10) |
| `CLAUDE.md` | ⚠️ template-level | Agent roster + feature/endpoint tables; useful as intent, verify paths before trusting |
| `.claude/docs/CONVENTIONS.md` | ✅ policy | The binding coding standard for agent-assisted changes (20 KB) |
| `DATA_CONTRACT.md` | ✅ useful | Explains the client↔server contract philosophy and the service-layer mapping approach |
| `PRODUCTION_PLAN.md` | ⚠️ historical | Audit of 14 contract bugs found + how each was fixed. Valuable history, but it is a past-sprint changelog, not current state |
| `ADMIN_SETUP.md` | ⚠️ partly stale | Admin credentials, RBAC + navigation model. Documents `npm run create-admin`, which is broken (§11) |
| `PAYPAL_SETUP.md` | ✅ useful | PayPal env vars, developer-dashboard steps, endpoint list, go-live checklist |
| `ENDPOINT_TRACKER.md` | ⚠️ stale notes | Manually ticked endpoint checklist with per-endpoint response types. Paths use the *BFF* prefix (`/api/user/auth/…`), not the Express prefix (`/api/auth/…`) |
| `PAGE_DATA_TRACKER.md` | ⚠️ stale notes | Which page consumes which interface; written by an agent, partly malformed |
| `API-Endpoint-Testing-Documentation.md` | ⚠️ unverified | Its own opening note says endpoints were never tested live (Postgres refused connections in that sandbox). The `[x]` ticks were written by `check-routes.js` scanning source, not by running tests |
| `client/PAGE_INTERFACE_ROADMAP.md` | ⚠️ corrupted | A `sed` script replaced every `- [ ]` with the literal string `pattern applied`; hard to read now |
| `client/TESTING.md` | ✅ useful | Playwright install/run instructions, spec inventory, mock explanation |
| `client/TEST_SCENARIOS.md` | ✅ useful | Manual/QA scenario list per page |
| `client/PUBLIC_API_ENDPOINTS.md` | ✅ useful | Contract spec for the anonymous storefront endpoints |
| `README_SUBMISSION.md` | ❌ delete | A submitter's "what I did / what is missing" note — superseded, see §9.1 |
| `ENHANCEMENT_SUMMARY.md` | ❌ move | Changelog of the **agent-team package**, not of this app — see §9.4 |
| `generate_api_test_script.md` | ❌ delete | A prompt-style guide that generated the throwaway `test_all_apis.js` — see §9.1 |

## 9. File inventory: what to keep, what to delete

Everything in this section was classified by reading the file, then confirming it with a
search for usages (`required`/`imported` anywhere in `client/`, `server/`, `shared/`) and with
`git ls-files` for tracked status. Legend:

| Verdict | Meaning |
|---|---|
| 🔴 **DELETE** | Throwaway investigative debris. Nothing imports it, nothing documents it as a tool, and it is not part of any build/test command. Safe to remove. |
| 🟠 **DELETE (after 1 check)** | Looks like debris, but verify one named thing first (stated in the row). |
| 🟡 **REVIEW** | Real code/config, but orphaned or duplicated. Removing is a code change, not a cleanup. |
| 🟢 **KEEP** | Load-bearing. Deleting breaks the build, the docs, or the team workflow. |

**All of the files below are committed to git** (`git ls-files`), which is exactly why the repo feels
cluttered: generated logs, screenshots and one-off patch scripts were never excluded. `git checkout
HEAD -- <path>` restores any of them.

### 9.1 🔴 Root-level one-off scripts and their outputs — DELETE

These were written by an agent/human debugging session in 2026-03; **none** is referenced by any
`package.json` script, test suite, or document. Several have revealing names but do not test
anything: `test_*.py` / `test_router_query.js` are *patch scripts* that rewrite other source files.

| Path | Size | What it actually is | Why it is debris |
|---|---|---|---|
| `check-routes.js` | 2.6 KB | Regex-scans `server/src/routes/*.ts` and ticks `[x]` in `API-Endpoint-Testing-Documentation.md` | Mutates a documentation file; not a check, not a test, no caller |
| `dummy.js` | ~20 B | `console.log("Checking project context...")` | Nothing else |
| `generate_script.py` | 0.3 KB | Extracts fenced `javascript` blocks out of `generate_api_test_script.md` into `test_all_apis.js` | One-shot generator |
| `generate_api_test_script.md` | 13.8 KB | The prompt/guide that produced `test_all_apis.js` | One-shot scaffolding description |
| `test_all_apis.js` | 10.9 KB | Smoke-tests every endpoint against `http://localhost:3000/api` (wrong port — the API is on **5300**), writes `api_test_results.txt` | Superseded; wrong config; needs a live server |
| `api_test_results.txt` | 26.3 KB | Its output: every single call recorded `"error": "fetch failed"` | Pure noise |
| `test_files.sh` | 0.1 KB | `cd client && npx tsc --noEmit; cd ../server && bun test` | Two commands you can type; no CI references it |
| `test_roles.py` | 0.6 KB | Comments out `editPath` / `deleteAction` in `client/pages/roles/index.tsx` | Source rewriting done once; the change is already in the tree |
| `test_router.py` | 0.7 KB | Injects `eslint-disable-next-line react-hooks/exhaustive-deps` into two `roles/*.tsx` files | Same: already applied, file never needed again |
| `test_router_query.js` | 0.6 KB | A file of **only comments** — investigation notes about `router.query` | Not executable code at all |
| `verify.py` | 0.4 KB | Playwright script that screenshots `http://localhost:3000/permissions` → `permissions.png` | One-shot visual check |
| `patch_dashboard.py` | 0.4 KB | Reads `dashboard.controller.ts` and then does **nothing** (only comments) | Dead |
| `patch_vendorDashboardSlice.py` | 0.6 KB | String-replaces `salesData` typing in `vendorDashboardSlice.ts` | One-shot patch |
| `README_SUBMISSION.md` | 1.4 KB | "What I did / What is missing" submission note, mentions failing promotion + image tests and mocked-SQLite setup | Historical; contradicts current code |

### 9.2 🔴 Generated run artifacts — DELETE

| Path | Size | What it is |
|---|---|---|
| `server/logs/combined.log` | **5.1 MB** | Winston request/event log |
| `server/logs/combined1.log` | **4.3 MB** | Rotated copy of the above |
| `server/logs/error.log` | **1.6 MB** | Winston error log |
| `server/logs/exceptions.log`, `server/logs/rejections.log` | 0 B | Empty Winston handlers |
| `server/127.0.0.1` | **217 KB** | A **SQLite database file** left behind by a test run that used the host string as the DB path. It contains real table DDL (`AuditLogs`, `FavoriteItems`, `Comments`, …) and is referenced by nothing |
| `error.png` | 125 KB | Debugging screenshot |
| `permissions.png` | 184 KB | Output of `verify.py` |
| `npm_install.log` | 1.1 KB | Install log |
| `client_output.log`, `client_output_profile.log` | 4.6 / 6.5 KB | Captured dev-server output (`client_output_2.log` is already gone from the working tree but still tracked in HEAD → `git rm` it to record the deletion) |
| `npm_output_profile.log` | 0.4 KB | Install log |
| `server_output_profile.log`, `server_output_profile_2.log`, `server_output_profile_3.log` | 56.3 / 51 / 20.7 KB | Captured server boot output |
| `server_output_sqlite.log`, `server_output_sqlite_2.log` | 9.1 / 28.2 KB | Captured boot output from the SQLite test runs |
| `client/npm_output.log` | 8.9 KB | Install log |
| `server/testing.py` | 5.1 KB | `requests`-based API test script with **hard-coded credentials** (`admin@store.com` / `admin123`) against `localhost:5300` |
| `.claude/settings.json.graphify-bak` | ~4 KB | Tool-generated backup of `settings.json` (untracked) |

Total reclaimed by §9.1 + §9.2 alone: **≈ 12 MB across ~34 files.** Two of the artifacts are mildly
sensitive (`server/testing.py` embeds credentials; `server/127.0.0.1` embeds the full schema and
therefore implicitly data) — another reason not to keep them in a public history.

### 9.3 🟠 Duplicate / non-standard configuration — DELETE after a sanity check

| Path | Size | Finding | Action |
|---|---|---|---|
| `client/.eslintrc.json` | 50 B | Duplicate of `client/.eslintrc.js` (which holds the real customized rule set). ESLint resolves **one** config per directory and `.js` wins, so this file is dead | Delete the `.json` one |
| `client/.eslintrc.js` | 1.8 KB | **Actually used** by `next lint` | Keep |
| `server/.eslintrc.ts` | 0.3 KB | ESLint config with a `.ts` extension — and `eslint` is **not** in `server`'s dependencies at all | Keep only if you add `eslint` + a TS config loader; otherwise delete |
| `server/.prettierrc.ts` | 0.1 KB | Same problem with `prettier`; the `prettier` / `eslint:fix` npm scripts currently fail | Same |
| `server/bun.lock` (148 KB) **+** `server/package-lock.json` (303 KB) | 451 KB | Two lockfiles for two package managers. `test` uses `bun test`, installs are documented with `npm install` | Pick one; delete the other; never commit both |
| `client/scripts/update-roadmap.sh` | 0.2 KB | `sed -i 's/- \[ \]/pattern applied/g'` — the script that **corrupted** `client/PAGE_INTERFACE_ROADMAP.md` | Delete |
| `server/src/services/store.service.spec.ts` (1.7 KB) **+** `store.service.test.ts` (7.2 KB) | 8.9 KB | Two test files for the same service; `bun test` picks up both patterns | Keep the richer one, delete the other |

### 9.4 🟡 Stale working-notes documents — review, then delete or archive

These are not generated junk, but they describe a **past** state of the project and actively mislead
new readers (wrong ports, wrong route prefixes, "couldn't be tested" caveats). Recommendation:

| Path | Recommendation |
|---|---|
| `API-Endpoint-Testing-Documentation.md` | **Delete or date-stamp.** Its checkboxes were machine-written by `check-routes.js` from source scanning, and its own intro admits no live testing happened |
| `PAGE_DATA_TRACKER.md` | **Delete** once §5.5/§5.6 here is trusted — it is a half-finished agent work-queue |
| `ENDPOINT_TRACKER.md` | **Keep only if genuinely maintained**; otherwise delete. It is the only per-endpoint response-type inventory besides the Swagger schema |
| `PRODUCTION_PLAN.md` | **Archive** (e.g. `docs/history/`): excellent history of the contract-alignment sprint, misleading as current status |
| `client/PAGE_INTERFACE_ROADMAP.md` | **Delete** — already corrupted by `update-roadmap.sh` (every unchecked box became the literal text `pattern applied`) |
| `client/TEST_SCENARIOS.md` | **Keep** — the only human-readable QA plan |
| `ENHANCEMENT_SUMMARY.md` | **Move** next to the agent tooling (e.g. `.claude/`): it is the changelog of the *agent-team package*, not of this e-commerce app |

### 9.5 🟡 Orphaned code — real code, but nothing uses it

Deleting these is a *code* change, so do it deliberately (and re-run the client type-check after):

| Path | Evidence | Note |
|---|---|---|
| `client/src/mocks/` — `mockDatabase.ts`, `pageMocks.ts` | **0** references anywhere in `client/` (including `client/tests/`, which uses its own `tests/mocks.ts`) | Dead weight from an earlier "fallback data" idea; `hooks/usePageData.ts` is what is actually used |
| `client/pages/scss-test.tsx`, `client/pages/style-test.tsx` | **0** references; not in `navigation.ts` | Ship as unreachable routes in production builds |
| `client/pages/table-demo.tsx` | Referenced only from `components/Layouts/Navigation.tsx` | Decide: keep as a dev page, or drop the page *and* the nav link |
| `client/pages/navigation-demo.tsx`, `permission-demo.tsx`, `test-permissions.tsx` | **Wired into `navigation.ts`** as a "Demo Pages" group (3 nav entries + quick actions, lines ~298–355 and ~687–706) | Deliberate for development, **not** for production. Removing means editing `client/src/config/navigation.ts` |
| `client/src/components/examples/PermissionExample.tsx` | Used only by `permission-demo.tsx` | Goes away with the demo pages |
| `client/src/features/` (`profile/`, `settings/`) | Used by `pages/profile.tsx` and `pages/settings.tsx` only | Legitimate feature folders — keep |
| `client/src/interfaces/**` vs `shared/types/**` | Both define the same entities; `shared/` is what is imported cross-boundary | **Do not** delete either blindly — see §10 |

### 9.6 🟡 Static assets — check before deleting

| Path | Size | Finding |
|---|---|---|
| `client/public/resources/static/img/logo.png` | 113 KB | **Used** by 4 auth pages (`auth/signin`, `auth/signup`, `auth/forgot_password`, `auth/reset_password/[token]`) — keep |
| `client/public/resources/static/img/login.png` | 113 KB | **0** references, and byte-size-identical to `logo.png` → delete candidate |
| `client/public/products/f1.png … f6.png` | ~20 KB each | **0** filename references in `client/src`, `client/pages`, `server/src` → demo/seed imagery; delete only after checking `server/src/scripts/seedData.ts` for hard-coded image paths |
| `client/public/fakeimages/shoes.jpg` | 201 KB | **0** references; the folder name says "fake" → delete candidate |
| `client/public/placeholder-image.png` | 4.4 KB | **0** references; keep if you intend to use it as an upload fallback |
| `client/public/vercel.svg` | 1.1 KB | create-next-app leftover, **0** references → delete |

### 9.7 🟢 KEEP — do not delete

Application source: `client/pages/**`, `client/src/**`, `client/styles/**`, `client/tests/**`,
`server/index.ts`, `server/src/**`, every `.ts` file under `shared/**`.
Build/config: `client/package.json`, `client/package-lock.json`, `server/package.json` (+ **one**
lockfile), `client/tsconfig.json`, `server/tsconfig.json`, `client/next.config.js`,
`client/playwright.config.ts`, `client/.eslintrc.js`, `.gitignore`.
Generated-but-served: `server/src/routes/swaggerSchema/**` (the spec behind `/api-docs`).
Tooling/workflow: `.claude/**`, `AGENTS.md`, `CLAUDE.md`, `.devcontainer/`, `.vscode/launch.json`,
`.jules/bolt.md`, `scripts/whats-next.mjs`, `repomix.config.json`, `.mcp.json`.
Docs worth keeping: `client/README.md`, `client/TESTING.md`, `client/TEST_SCENARIOS.md`,
`client/PUBLIC_API_ENDPOINTS.md`, `ADMIN_SETUP.md`, `PAYPAL_SETUP.md`, `DATA_CONTRACT.md`.
Optional-but-intentional: `server/benchmarks/**`, `server/src/benchmarks/**`.

### 9.8 The cleanup command (review first — it deletes, it does not move to a bin)

Run from the repository root. These files are git-tracked, so the change stays reviewable as a diff
and is recoverable with `git checkout HEAD -- <path>`; commit it in one
`chore: remove debugging debris and generated artifacts` commit.

```powershell
# --- Root: one-off scripts + their outputs (9.1) ---
Remove-Item -Force check-routes.js, dummy.js, generate_script.py, generate_api_test_script.md, `
  patch_dashboard.py, patch_vendorDashboardSlice.py, test_all_apis.js, test_files.sh, test_roles.py, `
  test_router.py, test_router_query.js, verify.py, api_test_results.txt, README_SUBMISSION.md

# --- Root: generated artifacts (9.2) ---
Remove-Item -Force error.png, permissions.png, npm_install.log, client_output.log, `
  client_output_profile.log, npm_output_profile.log, server_output_profile.log, `
  server_output_profile_2.log, server_output_profile_3.log, server_output_sqlite.log, `
  server_output_sqlite_2.log

# --- Server: logs, stray DB, throwaway test script (9.2) ---
Remove-Item -Force server\127.0.0.1, server\testing.py
Remove-Item -Force server\logs\*.log

# --- Client / server: dead config duplicates (9.3) ---
Remove-Item -Force client\.eslintrc.json, client\scripts\update-roadmap.sh
#   choose ONE of these two lockfiles (example keeps npm):
Remove-Item -Force server\bun.lock

# --- Tool backup artifact ---
Remove-Item -Force .claude\settings.json.graphify-bak

# --- Already deleted in the working tree, still tracked in HEAD ---
git rm --cached client_output_2.log

# Show exactly what changed
git status --porcelain
```

Deliberately **not** in the command above (do these as separate, considered changes):
the demo pages and their `navigation.ts` entries, `client/src/mocks/**`, the duplicate
`store.service.spec.ts`, the stale trackers in §9.4, and the unused images in §9.6.

### 9.9 Backstop: `.gitignore` was updated so these do not come back

The audit added these patterns to the root `.gitignore` (previously nothing ignored logs,
screenshots, build output or stray database files, which is how 12 MB of them got committed):

```gitignore
# Runtime / build output
*.log
logs/
server/dist/
client/.next/
client/out/
client/test-results/
client/playwright-report/
coverage/

# Stray local database files (SQLite artifacts from test runs)
*.sqlite
*.sqlite3
*.db
server/127.0.0.1

# Screenshots dumped at the repo root while debugging
/*.png

# Tool-generated backups
*.graphify-bak
```

Note: adding a pattern does **not** untrack files already in the index — that is why §9.8 deletes
them explicitly.

## 10. Template drift: `AGENTS.md` / `CLAUDE.md` vs reality

Both files are the *template's* instructions (`.claude/README.md` literally says "copy this `.claude/`
folder into a client repository"). Treat them as policy for **new** work, not as a description of
this tree:

| Claim in `AGENTS.md` / `CLAUDE.md` | Reality in this repo |
|---|---|
| npm/yarn **workspace monorepo** with `"@project/shared": "workspace:*"`; root `npm install` covers everything | **No root `package.json`.** `client/` and `server/` are independent npm projects installed separately |
| Shared package at **`packages/shared`** exporting `contracts/`, `schemas/`, `enums/` | Shared code is at **`shared/`** (repo root) and contains only `types/` + `types/requests/` — **no** `schemas/`, **no** `enums/`, no `package.json` |
| Import specifier `@project/shared` | Actual alias is **`@shared/*`** (tsconfig `paths` in both packages; 99 import sites) |
| Zod schemas in shared, imported by server middleware | **Zod is not used at all**; validation is `express-validator` in routes/controllers |
| Client structure fixed as `client/src/{components,config,contexts,hooks,i18n,interfaces,pages,services,store/slices,styles,utils}` | Pages live in **`client/pages`** and styles in **`client/styles`** (Next.js conventions); `client/src` additionally has `constants/`, `features/`, `mocks/`, `models/` |
| Tailwind CSS | **Bootstrap 5 + SCSS** (`client/styles/scss`) — no Tailwind dependency |
| `npm run check` (typecheck + lint + test) must exist and pass in each package | **No package defines a `check` script**; client has `lint`, and server's lint/prettier scripts are broken (§11) |
| Enums such as `OrderStatus`, `UserRole` live in shared `enums/` | No enum modules exist; status/role values are string literals in types and models |
| `scripts/whats-next.mjs` reads `.claude/company/sprints/current/tasks.json` + `RESUME-POINT.md` | **Neither file exists** — only `backlog.md`, `daily-log.md`, `sprint-goal.md` placeholders ("currently no active sprint"), so the script has no queue to print |
| Server layering `routes → controllers → services → models`; controllers hold no logic | ✅ **Accurate** — the one structural claim that holds exactly |
| Standardized `{success, message, data}` envelope enforced by middleware | ✅ **Accurate** — see §5.4 |
| JWT in `httpOnly` / `secure` / `sameSite: 'strict'` cookies | ✅ Accurate, **but the cookie is set by the Next.js BFF** (`client/pages/api/user/[...AUTH].ts`), not by Express |

**Guidance:** keep following the structural rules (layering, envelope, shared contracts) — they match.
Do not follow the build/packaging instructions literally; use §7 here instead.

## 11. Known gaps & risks

All of the following is verifiable in the tree; none of it was "fixed" during this documentation pass.

### Broken commands

1. `server` → `npm run create-admin` targets `src/scripts/createAdminUser.ts`, which **does not
   exist** (only `runScripts.ts`, `seedData.ts`, `permissions.ts`, `generateAutoSwagger.ts` are
   present) — yet `ADMIN_SETUP.md` tells users to run exactly this.
2. `server` → `npm run assign-admin-role` targets `src/scripts/assignAdminRole.ts` — **missing**.
3. `server` → `npm run build-dev` runs `nodemon src/index.ts`, but the entry point is
   `server/index.ts` (`src/index.ts` does not exist).
4. `server` → `eslint:fix` / `prettier` / `prettier:fix` cannot work: neither `eslint` nor `prettier`
   is in `server/package.json`.

### Security — review before any production deployment

5. `cors()` is called with **no options** in `server/index.ts` (`Access-Control-Allow-Origin: *`)
   while the browser sends auth cookies. `CLIENT_URL` exists in config but is never used for CORS.
   Restrict the origin allow-list.
6. **The Stripe webhook cannot verify signatures — two independent defects** (confirmed by reading
   `server/index.ts` lines 334–348 + `payment.controller.ts` + `payment.route.ts`):
   * `app.use(express.json({ limit: … }))` has **no `verify` callback**, so `req.rawBody` is never
     populated anywhere in the codebase — yet `handleWebhook` reads `req.rawBody` and passes it to
     `PaymentService.verifyWebhook(rawBody, signature)`. It will always be `undefined`.
   * `payment.route.ts` applies `express.raw({ type: 'application/json' })` at the route level, but the
     global JSON parser already ran (and consumed the stream) because routers are mounted *after*
     `express.json()` — so even the intended raw buffer would be empty.
   * Fix: capture the buffer globally with
     `express.json({ verify: (req, _res, buf) => { (req as any).rawBody = buf } })`, or mount a
     `express.raw()` webhook route **before** `express.json()`. Verify with a Stripe CLI replay.
7. Default credentials exist and are documented (`ADMIN_SETUP.md`: `admin@admin.com` / `admin`;
   `server/testing.py`: `admin@store.com` / `admin123`). Rotate and remove the test script (§9.2).
8. No CSRF token strategy for cookie-authenticated writes; `sameSite: 'strict'` is the only
   mitigation. `helmet()` is enabled, but CSP is explicitly **disabled in development**
   (`contentSecurityPolicy: false`) and left at helmet's default in production rather than configured.
9. **Price tampering: the charge amount comes from the client.** `payment.controller.ts` destructures
   `{ amount, currency, paymentMethodId } = req.body` and passes them straight into
   `stripeClient.paymentIntents.create({ amount: Math.round(amount * 100), … })`. `payment.service.ts`
   fetches the cart and validates **stock**, but never re-derives the amount from the cart/product
   prices — so a caller can post any `amount` for the same cart. Recompute the total server-side
   (and derive `currency` from server config) before creating the intent.

### Consistency / maintenance

10. `order.route.ts` is mounted twice (`/api/orders` **and** `/api/admin/orders`), so the "admin"
    prefix adds no authorization by itself — admin-only handlers must enforce it internally.
11. `NEXT_PUBLIC_Stripe_Key` vs `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — two spellings documented, only
    the first is read by the checkout page.
12. Port confusion across docs (3000/3001 in the old README, 5300 in `TESTING.md` and
    `next.config.js`). Verified truth: **API 5300**, **client 3000**.
13. `client/src/interfaces/**` and `shared/types/**` still define overlapping entity shapes. The whole
    point of `shared/` is to have exactly one definition; consolidating is the highest-value refactor
    available here, but it is a large, test-covered change — do it deliberately, not inside a cleanup.
14. Client unit tests (`client/src/utils/*.test.ts`) are excluded by `client/tsconfig.json` and no
    runner is configured, so they never execute.
15. Server tests need **Bun** (`bun test`) while installs and docs use npm — either document Bun as a
    required tool or migrate the tests to a Node runner.
16. `client/src/i18n/locales/es.json` and `fr.json` are ~21 KB each versus ~6 KB for `en`/`ar`, so the
    non-English locales are partial and will fall back to English often.
17. `client/pages/index.tsx` (817 B) and `client/pages/home.tsx` (1.9 KB) are two competing landing
    pages; decide which is canonical.

## 12. How these claims were checked

| Claim type | Method |
|---|---|
| File existence, sizes, tree shape | `Get-ChildItem -Recurse` (excluding `node_modules`, `.next`, `dist`) |
| Tracked vs. untracked, and "was this really committed?" | `git ls-files` compared path-by-path against candidates; `git status --porcelain -uall`; `git check-ignore -v` |
| "Nothing uses this file" | Full-text search for the filename/export across `client/src`, `client/pages`, `server/src`, `client/tests`, plus the file's own imports — e.g. `mockDatabase` → 0 hits, `pageMocks` → 0 hits, `f1.png` → 0 hits, `login.png` → 0 hits, `logo.png` → 4 hits |
| Tech stack & versions | `client/package.json`, `server/package.json`, `client/tsconfig.json`, `server/tsconfig.json` |
| Ports, middleware order, mounts | `server/index.ts`, `server/src/config/config.ts`, `client/playwright.config.ts`, `client/next.config.js` |
| Envelope semantics | `server/src/middlewares/responseStandardizer.middleware.ts` read line by line |
| Auth/cookie flags | `client/pages/api/user/[...AUTH].ts` lines 35–38 + `server/src/middlewares/auth.middleware.ts` |
| Counts (66 pages, 136 endpoints, 32 models, 18 slices, 99 `@shared` imports) | Direct counting commands over the respective globs |
| Broken npm scripts | Each script's target file tested with `Test-Path`; `eslint`/`prettier` absence checked in `server/package.json` |
| Unused dependencies | Full-text search for the package name; e.g. `zod` → 0, `yup` → 0 |

Not verified (stated as unknown rather than assumed): runtime behaviour of the payment flows, the
Playwright suite passing, `npm run build` succeeding, and whether `server/seedData.ts` references the
`client/public/products/f*.png` assets.











