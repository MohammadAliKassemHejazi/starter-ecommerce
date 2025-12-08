# Testing Documentation

This project uses **Playwright** for end-to-end (E2E) testing. The tests cover critical user flows and admin management pages, using a mocked backend to ensure reliability and speed.

## Prerequisites

Before running the tests, ensure you have the following installed:

1.  **Node.js** (v18 or higher)
2.  **Playwright Browsers** (Chromium, Firefox, WebKit)

## Installation

Navigate to the `client` directory and install the dependencies:

```bash
cd client
npm install
npx playwright install --with-deps
```

**Note:** On Linux systems (like CI environments), you may need to install additional system dependencies. Use the `npx playwright install --with-deps` command, or refer to the [Playwright documentation](https://playwright.dev/docs/browsers#install-system-dependencies).

## Environment Setup

The tests are configured to use a mocked backend, but they expect the frontend to be buildable.
Ensure your `client/.env` file has the following variables (or similar):

```env
NEXT_PUBLIC_BASE_URL_API=http://localhost:5300/api
NEXT_PUBLIC_BASE_URL_LOCAL_API=http://localhost:3000/api
```

## Running Tests

To run all tests in headless mode:

```bash
cd client
npx playwright test
```

To run a specific test file:

```bash
npx playwright test tests/shop.spec.ts
```

To run tests with UI mode (interactive debugging):

```bash
npx playwright test --ui
```

## Viewing Reports

After running the tests, an HTML report is generated. You can view it using:

```bash
npx playwright show-report
```

## Test Suite Overview

| Test File | Description |
| :--- | :--- |
| `tests/auth.spec.ts` | Verifies the Login flow (`/auth/signin`), checking for successful redirection upon valid credentials. |
| `tests/shop.spec.ts` | Verifies the Shop page (`/shop`), ensuring products are listed and basic filtering logic works. |
| `tests/packages.spec.ts` | Verifies the Admin Packages page (`/packages`), ensuring subscription plans are listed. |
| `tests/permissions.spec.ts` | Verifies the Admin Permissions page (`/permissions`), checking that system permissions are rendered. |
| `tests/promotions.spec.ts` | Verifies the Admin Promotions page (`/promotions`), ensuring discount codes and values are displayed. |
| `tests/returns.spec.ts` | Verifies the Admin Returns page (`/returns`), checking for return requests and status badges. |
| `tests/roles.spec.ts` | Verifies the Admin Roles page (`/roles`), ensuring user roles (e.g., SUPER_ADMIN) are listed. |
| `tests/shipping.spec.ts` | Verifies the Admin Shipping page (`/shipping`), checking that shipping methods and costs are correct. |

## Mocks

The tests use `tests/mocks.ts` to simulate API responses. This allows us to test the frontend in isolation without needing a running backend server or a seeded database for every test run.
- **User Mock:** Simulates a "Super Admin" user with an active "Pro Plan".
- **API Interception:** Playwright intercepts requests to `/api/*` and returns predefined JSON responses.
