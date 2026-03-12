API Endpoint Testing Documentation

This document tracks the testing of backend endpoints to ensure their responses strictly adhere to the expected frontend interfaces (like ApiResponse and PaginatedApiResponse).

Status Note
Important. The backend uses PostgreSQL, but the database connection (127.0.0.1:5432) is refused in the current sandbox environment. Therefore, actual endpoint testing via curl against the running server could not be completed. The global responseStandardizer middleware has been heavily tested in isolation and updated to dynamically capture paginated arrays (e.g. stores, products, orders) and meta (pagination) attributes and structure them precisely as expected by the frontend.

The data property holds the array.

The meta property at the top level holds pagination variables (total, page, etc.).

success and message properties are automatically added to raw controller responses.

Frontend Expected Format

Standard Success Response

JSON
{
  "success": true,
  "message": "Operation successful",
  "data": { }
}
Paginated Success Response

JSON
{
  "success": true,
  "message": "Operation successful",
  "data": [ ],
  "meta": {
    "page": 1,
    "pageSize": 10,
    "total": 100,
    "totalPages": 10
  }
}
Endpoints Status

The following endpoints need verification against a running database.

🏪 Store Endpoints

[x] GET /api/store/getall -> StoresListResponse

[x] GET /api/store/getall/user -> StoresListResponse

[x] GET /api/store/getall/user/filter -> StoresListResponse

[x] GET /api/store/get/:id -> StoreResponse

[x] POST /api/store/create -> CreateStoreResponse

[ ] POST /api/store/update -> UpdateStoreResponse

[ ] PATCH /api/store/update/image -> UpdateStoreResponse

[x] DELETE /api/store/delete/:id -> DeleteStoreResponse

[x] DELETE /api/store/delete/image/:id -> DeleteStoreResponse

🛒 Shop (Products) Endpoints

[x] GET /api/shop/getall -> ProductsListResponse

[ ] GET /api/shop/get/single?id=:id -> ProductResponse

[x] GET /api/shop/get/storeProducts/:storeId -> ProductsListResponse

[x] POST /api/shop/create -> CreateProductResponse

[x] PATCH /api/shop/update -> UpdateProductResponse

[x] PATCH /api/shop/update/images -> UpdateProductResponse

[x] DELETE /api/shop/delete/:id -> DeleteProductResponse

[x] DELETE /api/shop/delete/image/:id -> DeleteProductResponse

📦 Order Endpoints

[ ] GET /api/admin/orders/last -> OrderResponse

[ ] POST /api/admin/orders/date-range -> OrdersListResponse

[ ] GET /api/admin/orders/:orderId/items -> OrderItemsResponse

🏷️ Category Endpoints

[x] GET /api/categories -> CategoriesListResponse

[x] POST /api/categories -> CreateCategoryResponse

[x] PUT /api/categories/update/:id -> UpdateCategoryResponse

[x] DELETE /api/categories/delete/:id -> DeleteCategoryResponse

👥 User Endpoints

[ ] GET /api/users?createdById=me -> UsersListResponse

[ ] POST /api/users -> CreateUserResponse

[ ] PUT /api/users/:id -> UpdateUserResponse

[ ] DELETE /api/users/:id -> DeleteUserResponse

[ ] POST /api/users/:id/roles -> AssignRoleResponse

[ ] DELETE /api/users/:id/roles/:roleId -> RemoveRoleResponse

📝 Article Endpoints

[x] GET /api/articles -> ArticlesListResponse

[x] GET /api/articles/get/author -> ArticlesListResponse

[x] POST /api/articles/create -> CreateArticleResponse

[x] PATCH /api/articles/update/:id -> UpdateArticleResponse

[x] DELETE /api/articles/delete/:id -> DeleteArticleResponse

🎁 Package Endpoints

[x] GET /api/packages -> PackagesListResponse

[ ] GET /api/packages?id=:id -> PackageResponse

[x] GET /api/packages/active -> UserPackageResponse

[x] GET /api/packages/limits -> PackageLimitsResponse

[ ] POST /api/packages/assign -> AssignPackageResponse

[x] POST /api/packages -> CreatePackageResponse

[x] PATCH /api/packages/update/:id -> UpdatePackageResponse

[x] DELETE /api/packages/:id -> DeletePackageResponse

[x] POST /api/packages/activate -> ActivatePackageResponse

🌐 Public Endpoints

[x] GET /api/public/stores -> PublicStoresListResponse

[x] GET /api/public/stores/:id -> PublicStoresListResponse

[x] GET /api/public/categories -> PublicCategoriesListResponse

[x] GET /api/public/products/:id -> PublicProductsListResponse

[ ] GET /api/public/get/productListing/ -> PublicProductsListResponse

[x] GET /api/public/articles -> ArticlesListResponse

💳 Cart & Payment Endpoints

[x] GET /api/cart/get -> CartResponse

[x] POST /api/cart/update -> AddToCartResponse

[x] PUT /api/cart/decrease -> UpdateCartResponse

[x] DELETE /api/cart/delete/:productId/:sizeId -> RemoveFromCartResponse

[x] DELETE /api/cart/delete -> ClearCartResponse

🔒 Auth Endpoints

[ ] POST /api/user/auth/login -> SignIn

[ ] POST /api/user/auth/logout -> LogoutResponse

[ ] POST /api/user/auth/register -> SignUpResponse

[ ] GET /api/user/auth/session -> SessionResponse

[x] GET /api/auth/sessions -> UserSessionsResponse
