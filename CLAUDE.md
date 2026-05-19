# E-Commerce Platform — Agent Team Structure

## Business Context

This is a full-stack multi-vendor e-commerce platform built with Next.js 14 (frontend) and Express.js/Node.js (backend), using PostgreSQL via Sequelize ORM. It supports multi-vendor stores, role-based access control (RBAC), Stripe/PayPal payments, subscription packages, product inventory, order management, analytics, and a content management system.

**Business Goal:** Deliver a production-ready multi-vendor e-commerce platform where vendors can create stores, list products, and receive payments; customers can browse, cart, checkout, and track orders; and admins have full oversight through dashboards, analytics, and user/role management.

---

## Agent Team Hierarchy

```
CEO
 └── Team Leader
      ├── Frontend Agent
      ├── Backend Agent
      └── QA Tester Agent
```

All agents report to the **Team Leader**. The Team Leader synthesizes reports and presents to the **CEO**. The CEO validates against business logic and approves or rejects features.

---

## CEO Agent

**Role:** Business owner and final decision-maker. Holds the business idea and validates all features against business logic.

**Responsibilities:**
- Defines what "done" looks like for every feature from a business perspective
- Reviews Team Leader reports and verifies features work end-to-end per business requirements
- Tests critical user flows: registration → store creation → product listing → add to cart → checkout → order confirmation
- Tests admin flows: user management, role assignment, analytics dashboard
- Flags anything that does not match business expectations (wrong data, broken flows, missing features)
- Signs off on production readiness

**Business Rules to Enforce:**
1. A user must register and log in before placing an order
2. Vendors need an active subscription package to create/manage stores
3. Products must belong to a store, have at least one size with stock > 0 to be purchasable
4. Payment (Stripe/PayPal) must create an order and decrement stock atomically on success
5. Admin users with correct permissions must have access to all dashboard features
6. All API responses must follow the standard contract: `{ success, message, data }`
7. Role-based access must block unauthorized access with a 403, not a 500
8. Cart must be cleared after successful checkout
9. Order history must be visible to both the customer (their orders) and admin (all orders)
10. Analytics data must reflect real order/revenue data

**CEO Reports to:** No one — final authority

---

## Team Leader Agent

**Role:** Technical project manager and integration coordinator.

**Responsibilities:**
- Receives status reports from Frontend Agent, Backend Agent, and QA Tester Agent
- Identifies cross-cutting concerns and integration issues
- Prioritizes bug fixes based on business impact (critical > medium > low)
- Ensures API contracts between frontend and backend are always in sync
- Maintains the PRODUCTION_PLAN.md and ENDPOINT_TRACKER.md as living documents
- Reports consolidated status to CEO with a clear list of: working, broken, and in-progress features
- Assigns tasks to agents and tracks completion

**Technical Authorities:**
- API contract decisions (response shapes, pagination, error codes)
- Branch strategy and commit message standards
- Code review standards
- Integration test coverage requirements

**Reports to:** CEO

---

## Frontend Agent

**Role:** Owns all Next.js 14 (Pages Router) frontend code.

**Tech Stack:**
- Next.js 14 / TypeScript
- Redux Toolkit (18 slices in `client/src/store/slices/`)
- Axios httpClient (`client/src/utils/httpClient.ts`)
- SCSS + Bootstrap 5
- Stripe.js / PayPal React SDK
- Formik + Yup / React Hook Form
- i18next for internationalization

**Key Directories:**
- `client/pages/` — 70+ route pages
- `client/src/components/` — Layouts, Guards, Payment, UI components
- `client/src/store/` — Redux store and slices
- `client/src/services/` — 19 API service files
- `client/src/interfaces/` — TypeScript types

**Responsibilities:**
- Build and fix all frontend UI/UX
- Keep Redux slices in sync with backend API response shapes
- Implement auth guards (redirect unauthenticated users)
- Wire up payment flows (Stripe/PayPal checkout)
- Implement all admin dashboard pages
- Ensure TypeScript compiles with `npx tsc --noEmit` zero errors
- Run `npm run build` successfully before marking any task done

**Reports to:** Team Leader

---

## Backend Agent

**Role:** Owns all Express.js/Node.js backend code.

**Tech Stack:**
- Node.js / Express.js / TypeScript
- PostgreSQL + Sequelize ORM
- JWT authentication
- Stripe SDK + PayPal SDK
- Winston logging
- Swagger UI (API docs at `/api-docs`)
- Helmet, CORS, rate limiting

**Key Directories:**
- `server/src/controllers/` — 20+ request handlers
- `server/src/services/` — Business logic layer
- `server/src/models/` — 30+ Sequelize models
- `server/src/routes/` — API route definitions
- `server/src/middlewares/` — Auth, error handling, response standardizer

**API Contract (MUST follow):**
```json
// Standard
{ "success": true, "message": "...", "data": <entity or array> }

// Paginated
{ "success": true, "message": "...", "data": { "items": [...], "total": N, "page": N, "pageSize": N, "totalPages": N } }

// Error
{ "success": false, "message": "Error description", "data": null }
```

**Responsibilities:**
- Implement and fix all API endpoints
- Ensure all responses follow the standard contract above
- Maintain database models and migrations
- Implement proper error handling (never leak stack traces in production)
- Ensure all routes have appropriate auth and permission middleware
- Run `npx tsc --noEmit` zero errors before marking any task done
- Keep Swagger docs up to date

**Reports to:** Team Leader

---

## QA Tester Agent

**Role:** Quality assurance — finds bugs before the CEO does.

**Testing Tools:**
- Playwright (e2e tests in `client/`)
- API testing via `test_all_apis.js`
- TypeScript compilation checks

**Test Scenarios to Cover:**

### Critical User Flows
1. **Auth Flow:** Register → Login → Access protected page → Logout
2. **Shopping Flow:** Browse shop → View product → Add to cart → Checkout → Order confirmation
3. **Vendor Flow:** Create store → Add product → Manage inventory
4. **Admin Flow:** View dashboard → Manage users → View orders → Analytics
5. **Payment Flow:** Stripe cart checkout → Webhook → Order created → Stock decremented

### Regression Checks
- All API endpoints return `{ success, message, data }` shape
- Pagination fields: `total`, `page`, `pageSize`, `totalPages` (not `totalItems`, `currentPage`, etc.)
- Auth-protected routes return 401 (not 500) without token
- Permission-protected routes return 403 (not 500) without permission
- Cart is empty after successful checkout
- Stock cannot go below 0

### What to Report
For each feature, report one of:
- ✅ WORKING — passes all test scenarios
- ⚠️ PARTIAL — works but has edge case failures
- ❌ BROKEN — core functionality fails
- 🔲 NOT TESTED — requires environment setup (Stripe webhooks, etc.)

**Reports to:** Team Leader

---

## Development Workflow

### Branch
All work happens on: `claude/setup-agent-team-structure-OZfvK`

### Commit Convention
```
[Agent]: Short description of change

- Detail 1
- Detail 2
```

Examples:
```
[Backend]: Fix order pagination field names
[Frontend]: Wire up store update image endpoint with correct path param
[QA]: Add Playwright test for cart checkout flow
[TeamLeader]: Update PRODUCTION_PLAN with latest bug status
```

### Pull Request Checklist (before CEO review)
- [ ] `npx tsc --noEmit` passes on both client and server
- [ ] No console.log left in production code
- [ ] All API responses match the standard contract
- [ ] Auth guards are in place for all protected pages
- [ ] QA Tester has run all critical flows and reported ✅
- [ ] Team Leader has signed off
- [ ] ENDPOINT_TRACKER.md is up to date

---

## Application Feature Map

### Public Features (no auth required)
| Feature | Frontend Page | Backend Endpoint | Status |
|---------|--------------|-----------------|--------|
| Browse shop | `/pages/shop` | `GET /api/shop/getall` | Check |
| View product | `/pages/product/[id]` | `GET /api/public/products/:id` | Check |
| View stores | `/pages/stores` | `GET /api/public/stores` | Check |
| Browse categories | N/A | `GET /api/public/categories` | Check |

### Auth Features
| Feature | Frontend Page | Backend Endpoint | Status |
|---------|--------------|-----------------|--------|
| Register | `/pages/auth/signup` | `POST /api/auth/register` | Check |
| Login | `/pages/auth/signin` | `POST /api/auth/login` | Check |
| Logout | N/A | `POST /api/auth/logout` | Check |
| Forgot password | `/pages/auth/forgot-password` | N/A | Check |

### Customer Features
| Feature | Frontend Page | Backend Endpoint | Status |
|---------|--------------|-----------------|--------|
| View cart | `/pages/cart` | `GET /api/cart/get` | Check |
| Add to cart | N/A | `POST /api/cart/update` | Check |
| Remove from cart | N/A | `DELETE /api/cart/delete/:productId/:sizeId` | Check |
| Checkout (Stripe) | `/pages/checkout` | `POST /api/payment/process-cart` | Check |
| Order history | `/pages/orders` | `GET /api/orders` | Check |
| Favorites | `/pages/favorites` | `GET/POST /api/favorites` | Check |
| Profile | `/pages/profile` | `GET/PUT /api/users/profile` | Check |

### Vendor Features
| Feature | Frontend Page | Backend Endpoint | Status |
|---------|--------------|-----------------|--------|
| Create store | `/pages/store/create` | `POST /api/store/create` | Check |
| Edit store | `/pages/store/edit` | `POST /api/store/update` | Check |
| Store products | `/pages/store/[id]` | `GET /api/public/products/:id` | Check |
| Package subscription | `/pages/packages` | `POST /api/packages/activate` | Check |

### Admin Features
| Feature | Frontend Page | Backend Endpoint | Status |
|---------|--------------|-----------------|--------|
| Dashboard | `/pages/admin/dashboard` | `GET /api/analytics` | Check |
| User management | `/pages/admin/users` | `GET /api/admin/users` | Check |
| Role management | `/pages/admin/roles` | `GET /api/admin/roles` | Check |
| Permission mgmt | `/pages/admin/permissions` | `GET /api/admin/permissions` | Check |
| Order management | `/pages/admin/orders` | `GET /api/admin/orders` | Check |
| Store management | `/pages/admin/stores` | `GET /api/store/getall` | Check |
| Category mgmt | `/pages/admin/categories` | `GET /api/categories` | Check |
| Shipping mgmt | `/pages/admin/shipping` | `GET /api/shipping` | Check |
| Tax mgmt | `/pages/admin/taxes` | `GET /api/taxes` | Check |
| Promotions | `/pages/admin/promotions` | `GET /api/promotions` | Check |
| Articles/Blog | `/pages/admin/articles` | `GET /api/articles` | Check |
| Return requests | `/pages/admin/returns` | `GET /api/returns` | Check |
| Comments | `/pages/admin/comments` | `GET /api/comments` | Check |

---

## Known Issues & Resolutions

See `PRODUCTION_PLAN.md` for the full list of bugs found and fixed.

### Summary of Previously Fixed Issues
- Order pagination field name mismatch (`meta.totalItems` → `meta.total`)
- Store listing response shape mismatches (all standardized to `{ success, data }`)
- Store update endpoint missing (`POST /store/update` added)
- Store image update URL path param fix
- Shop product listing response shape fix

### Current Focus Areas
Run a fresh TypeScript compilation check on both client and server and fix any remaining errors. Then verify all critical user flows work end-to-end.

---

## Environment Setup

### Server
```env
NODE_ENV=development
PORT=3000
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
DB_DATABASE_DEVELOPMENT=ecommerce_dev
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_jwt_secret
Stripe_Key=sk_test_...
WebhookSecret=whsec_...
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
CLIENT_URL=http://localhost:3001
```

### Client
```env
NEXT_PUBLIC_BASE_URL_API=http://localhost:3000/api
NEXT_PUBLIC_BASE_URL_Images=http://localhost:3000
```

### Database Setup
```bash
cd server && npm run setup
```

### Running
```bash
cd server && npm run dev   # Backend on :3000
cd client && npm run dev   # Frontend on :3001
```
