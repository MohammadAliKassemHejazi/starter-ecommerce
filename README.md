# E-Commerce Platform Architecture & Documentation

This repository contains a full-stack e-commerce solution built with a **Next.js** frontend and a **Node.js/Express** backend. This documentation aims to explain the architecture, design patterns, and key logic flows to facilitate the creation of similar projects.

## 📚 Table of Contents
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Architecture Overview](#-architecture-overview)
- [Backend Logic & Patterns](#-backend-logic--patterns)
  - [Service-Controller Pattern](#service-controller-pattern)
  - [Payment System (Dual Flow)](#payment-system-dual-flow)
  - [Authentication & Middleware](#authentication--middleware)
  - [Response Standardization](#response-standardization)
  - [Database & Seeding](#database--seeding)
- [Frontend Logic & Patterns](#-frontend-logic--patterns)
  - [State Management (Redux Toolkit)](#state-management-redux-toolkit)
  - [API Layer & Interceptors](#api-layer--interceptors)
  - [Theming & Styling](#theming--styling)
- [Setup & Installation](#-setup--installation)

---

## 🛠 Tech Stack

### Client (`/client`)
- **Framework:** Next.js 14 (Pages Router)
- **Language:** TypeScript
- **State Management:** Redux Toolkit
- **Styling:** SCSS, Bootstrap 5
- **HTTP Client:** Axios
- **Payments:** Stripe.js / React Stripe.js
- **Testing:** Playwright

### Server (`/server`)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Sequelize
- **Authentication:** JWT (JSON Web Tokens)
- **Payments:** Stripe SDK, PayPal SDK
- **Logging:** Winston
- **Documentation:** Swagger (Swagger UI Express)

---

## 📂 Project Structure

The project is a monorepo-style setup with distinct `client` and `server` directories.

### Backend (`/server/src`)
```
src/
├── config/         # Database and environment configuration (config.ts)
├── controllers/    # Request handlers (e.g., payment.controller.ts)
├── interfaces/     # TypeScript definitions for request/response/models
├── middlewares/    # Express middlewares (auth, error handling, standardizer)
├── models/         # Sequelize models and associations (index.ts)
├── routes/         # API route definitions
├── scripts/        # Database seeding and maintenance scripts
├── services/       # Business logic layer (e.g., payment.service.ts)
└── utils/          # Helper functions and custom error classes
```

### Frontend (`/client/src`)
```
src/
├── components/     # Reusable UI components
├── config/         # Client-side configuration
├── contexts/       # React Context providers (e.g., ToastContext)
├── hooks/          # Custom React hooks
├── i18n/           # Internationalization setup
├── interfaces/     # TypeScript definitions for API responses/State
├── services/       # API interaction layer (e.g., shopService.ts)
├── store/          # Redux store and slices
└── utils/          # Utilities (httpClient.ts, etc.)
```

---

## 🏗 Architecture Overview

The application follows a **Client-Server** architecture:
1.  **Client:** A Next.js application that renders pages server-side (SSR) or statically (SSG) and hydrates on the client. It communicates with the backend via RESTful APIs.
2.  **Server:** An Express.js REST API that handles business logic, interacts with the PostgreSQL database via Sequelize, and integrates with external payment gateways (Stripe/PayPal).

---

## 🔙 Backend Logic & Patterns

### Service-Controller Pattern
The backend strictly separates concerns:
-   **Controllers:** Handle HTTP requests, parse inputs, and send responses. They **never** contain business logic.
-   **Services:** Contain the core business logic, database interactions, and third-party API calls.
    -   *Example:* `payment.controller.ts` receives the request and calls `PaymentService.processCartPayment()`.

### Payment System (Dual Flow)
The system handles two distinct types of payments using **Stripe**:

1.  **Cart Checkout (`processCartPayment`):**
    -   Validates stock quantities in `CartItems`.
    -   Creates a Stripe `PaymentIntent` with metadata `type: 'cart'`.
    -   **Webhook:** On success, converts the Cart into an `Order`, creates `OrderItems`, decrements stock in `SizeItems`, and clears the Cart.

2.  **Package Subscription (`processPackagePayment`):**
    -   Used for purchasing membership plans (e.g., Pro Plan).
    -   Creates a Stripe `PaymentIntent` with metadata `type: 'package'` and `packageId`.
    -   **Webhook:** On success, creates or updates a `UserPackage` record, setting it to active.

**Webhooks:** The `handleWebhookEvent` in `payment.service.ts` uses the `metadata.type` field to determine which post-payment logic to execute within a database transaction.

### Authentication & Middleware
-   **JWT:** Access tokens are verified using `auth.middleware.ts`. The payload (decoded) is attached to the request (e.g., `req.UserId`).
-   **Rate Limiting:** Distinct rate limiters for general API routes vs. Auth routes (stricter).
-   **Role-Based Access:** Middleware checks user permissions before allowing access to admin routes.

### Response Standardization
A global middleware (`responseStandardizer.middleware.ts`) intercepts all JSON responses to ensure a consistent format:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```
If a controller returns raw data, this middleware wraps it automatically. It also standardizes pagination metadata (moving it inside `data`).

### Database & Seeding
-   **Sequelize:** Models are loaded dynamically in `models/index.ts`.
-   **Configuration:** `config/config.ts` handles SSL connection strings for production automatically.
-   **Seeding:** `scripts/seedData.ts` and `runScripts.ts` populate the database with initial data (users, roles, products) and ensure foreign key integrity.

---

## 🖥 Frontend Logic & Patterns

### State Management (Redux Toolkit)
-   **Store:** Located in `client/src/store/store.ts`.
-   **Slices:** Each feature has its own slice (e.g., `shopSlice`, `cartSlice`).
-   **Async Thunks:** Used for API calls (e.g., `fetchProductsListing`).
-   **Usage:** `useAppSelector` and `useAppDispatch` are typed hooks for accessing state.

### API Layer & Interceptors
-   **HttpClient:** An Axios instance (`client/src/utils/httpClient.ts`) is configured with the base URL.
-   **Interceptors:**
    -   **Response:** Automatically checks for the `success` flag. If the API returns raw data (rare, but possible), it wraps it in the standard success object structure to prevent frontend breakage.
    -   **Auth:** `setAuthHeaders` helper injects the JWT token into headers.

### Theming & Styling
-   **SCSS:** Global styles are imported in `_app.tsx`.
-   **Theme Switcher:** Uses CSS variables and a `data-theme` attribute on the `<html>` tag to switch between light and dark modes.

---

## 🚀 Setup & Installation

### Prerequisites
-   Node.js (v18+)
-   PostgreSQL
-   Stripe Account (for payments)

### Environment Variables
Create a `.env` file in **both** `client` and `server` directories.

**Server `.env` Example:**
```env
NODE_ENV=development
PORT=3000
# Database
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
DB_DATABASE_DEVELOPMENT=ecommerce_dev
DB_HOST=localhost
DB_PORT=5432
# Auth
JWT_SECRET=your_jwt_secret
# Payments
Stripe_Key=sk_test_...
WebhookSecret=whsec_...
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
# Client URL
CLIENT_URL=http://localhost:3001
```

**Client `.env` Example:**
```env
NEXT_PUBLIC_BASE_URL_API=http://localhost:3000/api
NEXT_PUBLIC_BASE_URL_Images=http://localhost:3000
```

### Installation

1.  **Install Dependencies:**
    ```bash
    cd server && npm install
    cd ../client && npm install
    ```

2.  **Database Setup:**
    -   Ensure PostgreSQL is running.
    -   Run the setup script (creates tables and seeds data):
    ```bash
    cd server
    npm run setup
    ```

3.  **Running the Project:**
    -   **Backend:** `cd server && npm run dev`
    -   **Frontend:** `cd client && npm run dev`

### Testing
To run End-to-End tests:
```bash
cd client
npx playwright test
```
