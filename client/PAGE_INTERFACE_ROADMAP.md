# Page Interface Roadmap

This document tracks the status of creating view model interfaces and default fallback data for every page in `client/pages`.

## Objective
For each page:
1. Define an interface for the expected view object (e.g., `ProfileViewModel`).
2. Ensure the view interface matches the service and Redux store interface.
3. Create a default data object to be displayed if the server fails to get a response.
4. Update the component to use the interface and the default fallback data.

## Status

### Root Pages
pattern applied `client/pages/_app.tsx` (skip, entry point)
pattern applied `client/pages/_document.tsx` (skip, document)
pattern applied `client/pages/about.tsx`
pattern applied `client/pages/home.tsx`
pattern applied `client/pages/index.tsx`
pattern applied `client/pages/navigation-demo.tsx`
pattern applied `client/pages/permission-demo.tsx`
pattern applied `client/pages/plans.tsx`
- [x] `client/pages/profile.tsx`
pattern applied `client/pages/scss-test.tsx`
- [x] `client/pages/settings.tsx`
pattern applied `client/pages/style-test.tsx`
pattern applied `client/pages/table-demo.tsx`
pattern applied `client/pages/test-permissions.tsx`

### Articles
pattern applied `client/pages/articles/[pid].tsx`
pattern applied `client/pages/articles/create.tsx`
pattern applied `client/pages/articles/edit.tsx`
pattern applied `client/pages/articles/index.tsx`
pattern applied `client/pages/articles/list.tsx`

### Auth
pattern applied `client/pages/auth/forgot_password.tsx`
pattern applied `client/pages/auth/reset_password/[token].tsx`
pattern applied `client/pages/auth/signin.tsx`
pattern applied `client/pages/auth/signup.tsx`

### Cart, Categories, Comments, Favorites
pattern applied `client/pages/cart/index.tsx`
pattern applied `client/pages/categories/create.tsx`
pattern applied `client/pages/categories/edit.tsx`
pattern applied `client/pages/categories/index.tsx`
pattern applied `client/pages/comments/index.tsx`
pattern applied `client/pages/favorites/index.tsx`

### Dashboard, Orders, Packages, Payment
pattern applied `client/pages/dashboard/index.tsx`
pattern applied `client/pages/orders/index.tsx`
pattern applied `client/pages/orders/user/index.tsx`
pattern applied `client/pages/packages/index.tsx`
pattern applied `client/pages/payment/checkoutwithstripe.tsx`

### Permissions, Promotions, Returns, Roles
pattern applied `client/pages/permissions/create.tsx`
pattern applied `client/pages/permissions/edit.tsx`
pattern applied `client/pages/permissions/index.tsx`
pattern applied `client/pages/promotions/create.tsx`
pattern applied `client/pages/promotions/edit.tsx`
pattern applied `client/pages/promotions/index.tsx`
pattern applied `client/pages/returns/index.tsx`
pattern applied `client/pages/roles/Assignment/index.tsx`
pattern applied `client/pages/roles/Assignment/users.tsx`
pattern applied `client/pages/roles/create.tsx`
pattern applied `client/pages/roles/edit.tsx`
pattern applied `client/pages/roles/index.tsx`

### Settings, Shipping, Sizes, Taxes
pattern applied `client/pages/shipping/index.tsx`
pattern applied `client/pages/sizes/index.tsx`
pattern applied `client/pages/taxes/index.tsx`

### Shop, Store, Subcategories
pattern applied `client/pages/shop/index.tsx`
pattern applied `client/pages/shop/list.tsx`
- [x] `client/pages/shop/product/[pid].tsx`
pattern applied `client/pages/shop/product/create.tsx`
pattern applied `client/pages/shop/product/edit.tsx`
pattern applied `client/pages/store/[id].tsx`
pattern applied `client/pages/store/create.tsx`
pattern applied `client/pages/store/edit.tsx`
pattern applied `client/pages/store/index.tsx`
pattern applied `client/pages/subcategories/create.tsx`
pattern applied `client/pages/subcategories/edit.tsx`
pattern applied `client/pages/subcategories/index.tsx`

### Users, Analytics
- [x] `client/pages/users/create.tsx`
- [x] `client/pages/users/edit.tsx`
- [x] `client/pages/users/index.tsx`
pattern applied `client/pages/analytics/index.tsx`
