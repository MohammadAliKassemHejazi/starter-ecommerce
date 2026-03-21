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
- [ ] \`pages/favorites/\`
- [ ] \`pages/packages/\`
- [x] \`pages/permissions/\` -> PermissionResponse, PermissionsListResponse
- [ ] \`pages/plans.tsx\`
- [ ] \`pages/profile.tsx\`
- [ ] \`pages/promotions/\`
- [ ] \`pages/returns/\`
- [x] \`pages/roles/\` -> RoleResponse, RolesListResponse
- [ ] \`pages/settings.tsx\`
- [ ] \`pages/shipping/\`
- [ ] \`pages/sizes/\`
- [ ] \`pages/subcategories/\`
- [ ] \`pages/taxes/\`
- [x] \`pages/users/\` -> UserResponse, UsersListResponse
- [x] `pages/analytics/` -> AnalyticsEvent, AnalyticsStats, AnalyticsListResponse, AnalyticsStatsResponse
