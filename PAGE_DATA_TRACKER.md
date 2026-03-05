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

## Completed Pages to Analyze

- [x] \`pages/analytics/\` -> AnalyticsEvent
- [x] \`pages/auth/\` -> Auth (N/A, no domain model used directly in components)
- [x] \`pages/categories/\` -> ICategories
- [x] \`pages/comments/\` -> Comment
- [x] \`pages/dashboard/\` -> SalesData
- [x] \`pages/favorites/\` -> Favorite
- [x] \`pages/packages/\` -> Package
- [x] \`pages/permissions/\` -> Permission
- [x] \`pages/plans.tsx\` -> Package
- [x] \`pages/profile.tsx\` -> ProfileViewModel
- [x] \`pages/promotions/\` -> Promotion
- [x] \`pages/returns/\` -> ReturnRequest
- [x] \`pages/roles/\` -> RoleModel
- [x] \`pages/settings.tsx\` -> SettingsViewModel
- [x] \`pages/shipping/\` -> OrderShipping, ShippingMethod
- [x] \`pages/sizes/\` -> Size, SizeItem
- [x] \`pages/subcategories/\` -> ISubCategories
- [x] \`pages/taxes/\` -> TaxRule
- [x] \`pages/users/\` -> UserModel

- [x] `pages/index.tsx` -> IHomePageViewModel
- [x] `pages/home.tsx` -> IHomePageViewModel
- [x] `pages/plans.tsx` -> Package, IPlansPageViewModel
- [x] `pages/profile.tsx` -> IProfilePageViewModel
- [x] `pages/settings.tsx` -> ISettingsPageViewModel
- [x] `pages/analytics/index.tsx` -> AnalyticsEvent, IAnalyticsPageViewModel
- [x] `pages/articles/index.tsx` -> Props, IArticlesPageViewModel
- [x] `pages/articles/create.tsx` -> IArticlesCreatePageViewModel
- [x] `pages/articles/edit.tsx` -> Props, IArticlesEditPageViewModel
- [x] `pages/articles/list.tsx` -> Props, IArticlesListPageViewModel
- [x] `pages/auth/forgot_password.tsx` -> Props, IAuthForgotPasswordPageViewModel
- [x] `pages/auth/signin.tsx` -> IAuthSigninPageViewModel
- [x] `pages/auth/signup.tsx` -> Props, IAuthSignupPageViewModel
- [x] `pages/cart/index.tsx` -> ICartPageViewModel
- [x] `pages/categories/index.tsx` -> ICategoriesPageViewModel
- [x] `pages/categories/edit.tsx` -> ICategoriesEditPageViewModel
- [x] `pages/comments/index.tsx` -> Comment, Product, ICommentsPageViewModel
- [x] `pages/dashboard/index.tsx` -> IDashboardPageViewModel
- [x] `pages/favorites/index.tsx` -> Favorite, IFavoritesPageViewModel
- [x] `pages/orders/index.tsx` -> IOrdersPageViewModel
- [x] `pages/packages/index.tsx` -> Package, IPackagesPageViewModel
- [x] `pages/payment/checkoutwithstripe.tsx` -> CheckoutFormProps, CheckoutPageProps, IPaymentCheckoutwithstripePageViewModel
- [x] `pages/permissions/index.tsx` -> IPermissionsPageViewModel
- [x] `pages/permissions/edit.tsx` -> IPermissionsEditPageViewModel
- [x] `pages/promotions/index.tsx` -> Promotion, IPromotionsPageViewModel
- [x] `pages/promotions/edit.tsx` -> IPromotionsEditPageViewModel
- [x] `pages/returns/index.tsx` -> ReturnRequest, IReturnsPageViewModel
- [x] `pages/roles/index.tsx` -> IRolesPageViewModel
- [x] `pages/roles/edit.tsx` -> IRolesEditPageViewModel
- [x] `pages/shipping/index.tsx` -> ShippingMethod, OrderShipping, IShippingPageViewModel
- [x] `pages/shop/index.tsx` -> IShopPageViewModel
- [x] `pages/shop/list.tsx` -> Props, IShopListPageViewModel
- [x] `pages/sizes/index.tsx` -> Size, SizeItem, ISizesPageViewModel
- [x] `pages/store/index.tsx` -> IStorePageViewModel
- [x] `pages/store/create.tsx` -> IStoreCreatePageViewModel
- [x] `pages/store/edit.tsx` -> IStoreEditPageViewModel
- [x] `pages/subcategories/index.tsx` -> ISubcategoriesPageViewModel
- [x] `pages/subcategories/edit.tsx` -> ISubcategoriesEditPageViewModel
- [x] `pages/taxes/index.tsx` -> TaxRule, ITaxesPageViewModel
- [x] `pages/users/index.tsx` -> IUsersPageViewModel
- [x] `pages/users/edit.tsx` -> IUsersEditPageViewModel
- [x] `pages/auth/reset_password/[token].tsx` -> Props, IAuthResetPasswordTokenPageViewModel
- [x] `pages/orders/user/index.tsx` -> IOrdersUserPageViewModel
- [x] `pages/roles/Assignment/index.tsx` -> IRolesAssignmentPageViewModel
- [x] `pages/roles/Assignment/users.tsx` -> IRolesAssignmentUsersPageViewModel
- [x] `pages/shop/product/[pid].tsx` -> Props, IShopProductPidPageViewModel
- [x] `pages/shop/product/create.tsx` -> IShopProductCreatePageViewModel
- [x] `pages/shop/product/edit.tsx` -> IShopProductEditPageViewModel