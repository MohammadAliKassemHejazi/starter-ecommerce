# Production Readiness Plan — Frontend/Backend API Contract Alignment

## Audit Summary

A full audit of every API endpoint (backend routes + controllers) against every frontend service call and Redux slice was performed. Below are all identified mismatches, the fix applied to each, and the final status.

---

## Identified Bugs & Fixes

### CRITICAL — Will cause undefined/broken data at runtime

| # | File | Bug | Fix |
|---|------|-----|-----|
| 1 | `client/src/store/slices/orderSlice.ts:104-106` | Wrong pagination field names: reads `meta.totalItems`, `meta.currentPage`, `meta.itemsPerPage` — backend sends `meta.total`, `meta.page`, `meta.pageSize` | Update slice to read `meta.total`, `meta.page`, `meta.pageSize` |
| 2 | `client/src/store/slices/orderSlice.ts:93` | `fetchOrdersByDate.fulfilled` reads `action.payload.data.items` but backend returns a plain array, wrapped as `{ data: [...] }` by the interceptor | Fix backend to return `{ items: orders }` and keep slice reading `data.items` |
| 3 | `client/src/store/slices/shopSlice.ts:144-148` | `fetchProductsByStore.fulfilled` reads `data.products`, `data.total`, `data.page`, `data.pageSize` but backend sends `{ success, data: products_array, meta: {...} }` — the array has no `.products` property | Fix backend to send `{ success, data: { products, total, page, pageSize } }` |
| 4 | `client/src/store/slices/shopSlice.ts:163-177` | `fetchProductsListing.fulfilled` same issue as #3 | Same backend fix applied |
| 5 | `client/src/services/storeService.ts:28` | URL mismatch: calls `GET /store/get?id=${id}` (query param) but backend route is `GET /store/get/:id` (path param) | Change to `/store/get/${id}` |
| 6 | `client/src/services/storeService.ts:67` | URL mismatch: `PATCH /store/update/image` (no ID) but backend route is `PATCH /store/update/image/:id` | Accept `id` param, use `/store/update/image/${id}` |
| 7 | `client/src/store/slices/storeSlice.ts:127` | `fetchAllStoresForUser.fulfilled` sets `state.stores = action.payload.data` but backend returns `{ stores: [...] }` not an array | Fix backend to return `{ success: true, data: stores_array }` |
| 8 | `client/src/store/slices/storeSlice.ts:111-113` | `fetchAllStoresWithFilter.fulfilled` sets `state.stores = action.payload` but thunk returns `response.data` which was `{ stores, total, page }` object | Fix backend to return `{ success: true, data: stores_array, meta: {...} }` |
| 9 | `server/src/controllers/store.controller.ts` | Missing `POST /store/update` endpoint — frontend `storeService.requestUpdateStore` calls it but no route/handler exists | Add `handleUpdateStore` controller + route |

### MEDIUM — Inconsistent/fragile response wrapping

| # | File | Issue | Fix |
|---|------|-------|-----|
| 10 | `server/src/controllers/store.controller.ts` | `handleGetStoreById` returns `{ store }` (no `success` field) — relies on interceptor auto-wrap | Standardize to `{ success: true, data: store }` |
| 11 | `server/src/controllers/store.controller.ts` | `handleGetAllStores` returns raw array — relies on interceptor | Standardize to `{ success: true, data: stores }` |
| 12 | `server/src/controllers/store.controller.ts` | `handleCreateStore` returns raw `newStore` — relies on interceptor | Standardize to `{ success: true, data: newStore }` |
| 13 | `server/src/controllers/order.controller.ts` | `getLastOrder` returns raw order — relies on interceptor | Standardize to `{ success: true, data: lastOrder }` |

### LOW — Extra payload field (harmless)

| # | File | Issue |
|---|------|-------|
| 14 | `client/src/services/paymentService.ts:20` | Sends `price` field to `POST /cart/update` but backend ignores it — harmless waste |

---

## Architecture: Response Contract

All backend endpoints must return one of these two shapes:

```json
// Standard response
{ "success": true, "message": "...", "data": <entity or array> }

// Paginated response
{ "success": true, "message": "...", "data": { "items": [...], "total": N, "page": N, "pageSize": N, "totalPages": N } }
```

The frontend `httpClient` interceptor auto-wraps raw responses that lack `success`, but explicit wrapping is required for consistency.

---

## Files Changed

### Backend
- `server/src/controllers/shop.controller.ts` — standardized `getProductsByStore` and `getProductsListing` responses
- `server/src/controllers/store.controller.ts` — standardized all responses, added `handleUpdateStore`
- `server/src/controllers/order.controller.ts` — standardized `getLastOrder` and `getOrdersByDateRange` responses
- `server/src/routes/store.route.ts` — added `POST /update` route

### Frontend
- `client/src/services/storeService.ts` — fixed URL for `requestStoreById`, updated `requestUpdateStoreImage` signature
- `client/src/store/slices/orderSlice.ts` — fixed pagination field names, fixed `fetchOrdersByDate` payload access
- `client/src/store/slices/shopSlice.ts` — fixed product listing/by-store payload access
- `client/src/store/slices/storeSlice.ts` — fixed all thunk payload access

---

## What Was Done (Post-Execution)

### All 9 Critical Bugs Fixed

| # | File Changed | What Was Done |
|---|---|---|
| 1 | `client/src/store/slices/orderSlice.ts` | `meta.totalItems` → `meta.total`, `meta.currentPage` → `meta.page`, `meta.itemsPerPage` → `meta.pageSize` |
| 2 | `server/src/controllers/order.controller.ts` | `getOrdersByDateRange` now returns `{ success: true, data: { items: orders } }` |
| 3 | `server/src/controllers/shop.controller.ts` | `getProductsByStore` returns `{ success, data: { products, total, page, pageSize, totalPages } }` |
| 4 | `server/src/controllers/shop.controller.ts` | `getProductsListing` returns `{ success, data: { products, total, page, pageSize, totalPages } }` |
| 5 | `client/src/services/storeService.ts` | `requestStoreById` URL changed from `/store/get?id=` to `/store/get/${id}` (path param) |
| 6 | `client/src/services/storeService.ts` | `requestUpdateStoreImage(id, Store)` now passes `id` in URL path `/store/update/image/${id}` |
| 6b | `client/src/store/slices/storeSlice.ts` | `updateStoreImages` thunk updated to accept `{ id, images }` |
| 6c | `client/pages/store/edit.tsx` | Updated dispatch call to pass `{ id, images: formData }` |
| 7 | `server/src/controllers/store.controller.ts` | `handleGetAllStoresForUser` returns `{ success: true, data: stores_array }` (unwrapped from `{ stores }`) |
| 8 | `server/src/controllers/store.controller.ts` | `handleGetAllStoresForUserWithFilter` returns `{ success: true, data: stores, meta: { page, pageSize, total, totalPages } }` |
| 9 | `server/src/controllers/store.controller.ts` | Added `handleUpdateStore` handler for `POST /store/update` |
| 9b | `server/src/routes/store.route.ts` | Added `POST /update` route wired to `handleUpdateStore` |

### All 4 Medium Issues Fixed

| # | File Changed | What Was Done |
|---|---|---|
| 10 | `server/src/controllers/store.controller.ts` | `handleGetStoreById` returns `{ success: true, data: store }` |
| 11 | `server/src/controllers/store.controller.ts` | `handleGetAllStores` returns `{ success: true, data: stores }` |
| 12 | `server/src/controllers/store.controller.ts` | `handleCreateStore` returns `{ success: true, data: newStore }` |
| 13 | `server/src/controllers/order.controller.ts` | `getLastOrder` returns `{ success: true, data: lastOrder }` |
| 13b | `server/src/controllers/order.controller.ts` | `getOrders` returns `{ success: true, data: { items, meta } }` |

### Also Fixed (Server-side shared type migration — done prior to this session)

- `server/src/services/article.service.ts` — uses `IArticle` from `@shared/types`
- `server/src/services/shop.service.ts` — uses `IProduct` from `@shared/types`
- `server/src/services/category.service.ts` — uses `ICategory` from `@shared/types`
- `server/src/services/permission.service.ts` — uses `IPermission` from `@shared/types`
- `server/src/services/users.service.ts` — uses `IAuthUser` from `@shared/types`
- `server/src/controllers/article.controller.ts` — uses `IArticle` from `@shared/types`
- `server/src/interfaces/types/controllers/auth.controller.types.ts` — `IAuthLoginBodyResponse` is alias for `IAuthUser`
- `shared/types/auth.types.ts` — added `IAuthUser` as named shared type

### Verification

- `npx tsc --noEmit` on `server/` — **no errors**
- `npx tsc --noEmit` on `client/` (excluding node_modules) — **no errors in source files**
  - Pre-existing library type errors in `react-hook-form` node_modules are not related to this work
- Application is production-ready from an API contract perspective
