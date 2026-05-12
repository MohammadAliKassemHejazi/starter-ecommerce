# Page Data Tracker

This file tracks the analysis of each frontend page and the expected data structure it consumes.
Since this is a large task, I have completed the initial round focusing on the most complex entities.

## Completed Pages / Entities

- [x] \`pages/index.tsx (or home.tsx)\` -> IStoreResponseModel
- [x] \`pages/about.tsx\` -> IArticleModelWithUser (refactored text->content, user->author)
- [x] \`pages/articles/\` -> IArticleModel (refactored text->content)
- [x] \`pages/cart/\` -> CartItem (refactored cartQuantity->quantity)
- [x] \`pages/orders/\` -> IOrderModel (refactored orderItems->items)
- [x] \`pages/shop/\` -> IProductModel
- [x] \`pages/store/\` -> IStoreModel, IStoreResponseModel
- [x] \`pages/payment/\` -> CheckoutFormViewModel, CheckoutPageViewModel

## Pending Pages to Analyze

- [ ] \`pages/analytics/\`
- [ ] \`pages/auth/\`
- [x] \`pages/categories/\` -> CategoryResponse, CategoriesListResponse
- [ ] \`pages/comments/\`
- [ ] \`pages/dashboard/\`
- [x] \`pages/favorites/\` -> Favorite
- [x] \`pages/packages/\` -> PackageResponse
- [x] \`pages/permissions/\` -> PermissionResponse, PermissionsListResponse
- [x] \`pages/plans.tsx\` -> PackageResponse
- [x] \`pages/profile.tsx\` -> ProfileViewModel
- [x] \`pages/promotions/\` -> Promotion
- [x] \`pages/returns/\` -> ReturnRequest
- [x] \`pages/roles/\` -> RoleResponse, RolesListResponse
- [x] \`pages/settings.tsx\` -> SettingsViewModel
- [x] \`pages/shipping/\` -> ShippingMethod, OrderShipping
- [x] \`pages/sizes/\` -> Size, SizeItem
- [x] \`pages/subcategories/\` -> ISubCategories (refactored isActive->removed)
- [x] \`pages/taxes/\` -> TaxRule
- [x] \`pages/users/\` -> UserResponse, UsersListResponse
- [x] `pages/analytics/` -> AnalyticsEvent, AnalyticsStats, AnalyticsListResponse, AnalyticsStatsResponse

- [x] `pages/dashboard/` -> Dashboard Analytics (SalesData, InventoryAlerts, OrderStatuses)

- [x] `pages/comments/` -> Comment (CommentViewModel), Product

- [x] `pages/auth/` -> Auth flows use standard SignInResponse/SignUpResponse matching auth controller outputs.
