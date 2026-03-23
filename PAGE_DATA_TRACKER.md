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
- [ ] \`pages/categories/\`
- [ ] \`pages/comments/\`
- [ ] \`pages/dashboard/\`
- [ ] \`pages/favorites/\`
- [ ] \`pages/packages/\`
- [ ] \`pages/permissions/\`
- [ ] \`pages/plans.tsx\`
- [ ] \`pages/profile.tsx\`
- [ ] \`pages/promotions/\`
- [ ] \`pages/returns/\`
- [ ] \`pages/roles/\`
- [ ] \`pages/settings.tsx\`
- [ ] \`pages/shipping/\`
- [ ] \`pages/sizes/\`
- [ ] \`pages/subcategories/\`
- [ ] \`pages/taxes/\`
- [ ] \`pages/users/\`
- [x] `pages/analytics/` -> AnalyticsEvent, AnalyticsStats, AnalyticsListResponse, AnalyticsStatsResponse

- [x] `pages/dashboard/` -> Dashboard Analytics (SalesData, InventoryAlerts, OrderStatuses)

- [x] `pages/comments/` -> Comment (CommentViewModel), Product

- [x] `pages/auth/` -> Auth flows use standard SignInResponse/SignUpResponse matching auth controller outputs.
