# API Endpoint Testing Documentation

This document tracks the testing of backend endpoints to ensure their responses strictly adhere to the expected frontend interfaces (like `ApiResponse` and `PaginatedApiResponse`).

## Status Note

**Important.** The backend uses PostgreSQL, but the database connection (127.0.0.1:5432) is refused in the current sandbox environment. Therefore, actual endpoint testing via `curl` against the running server could not be completed. The global `responseStandardizer` middleware has been heavily tested in isolation and updated to dynamically capture paginated arrays (e.g. stores, products, orders) and `meta` (pagination) attributes and structure them precisely as expected by the frontend.

- The `data` property holds the array.
- The `meta` property at the top level holds pagination variables (`total`, `page`, etc.).
- `success` and `message` properties are automatically added to raw controller responses.

## Frontend Expected Format



```json
{
  "success": true,
  "message": "Operation successful",
  "data": { }
}
```

### Paginated Success Response


```json
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


## Endpoints Status



### 🏪 Store Endpoints


- [ ] `GET /api/store/getall` -> `StoresListResponse`
- [ ] `GET /api/store/getall/user` -> `StoresListResponse`
- [ ] `GET /api/store/getall/user/filter` -> `StoresListResponse`
- [ ] `GET /api/store/get/:id` -> `StoreResponse`
- [ ] `POST /api/store/create` -> `CreateStoreResponse`
- [ ] `POST /api/store/update` -> `UpdateStoreResponse`
- [ ] `PATCH /api/store/update/image` -> `UpdateStoreResponse`
- [ ] `DELETE /api/store/delete/:id` -> `DeleteStoreResponse`
- [ ] `DELETE /api/store/delete/image/:id` -> `DeleteStoreResponse`

### 🛒 Shop (Products) Endpoints

- [ ] `GET /api/shop/getall` -> `ProductsListResponse`
- [ ] `GET /api/shop/get/single?id=:id` -> `ProductResponse`
- [ ] `GET /api/shop/get/storeProducts/:storeId` -> `ProductsListResponse`
- [ ] `POST /api/shop/create` -> `CreateProductResponse`
- [ ] `PATCH /api/shop/update` -> `UpdateProductResponse`
- [ ] `PATCH /api/shop/update/images` -> `UpdateProductResponse`
- [ ] `DELETE /api/shop/delete/:id` -> `DeleteProductResponse`
- [ ] `DELETE /api/shop/delete/image/:id` -> `DeleteProductResponse`

### 📦 Order Endpoints

- [ ] `GET /api/admin/orders/last` -> `OrderResponse`
- [ ] `POST /api/admin/orders/date-range` -> `OrdersListResponse`
- [ ] `GET /api/admin/orders/:orderId/items` -> `OrderItemsResponse`

### 🏷️ Category Endpoints

- [ ] `GET /api/categories` -> `CategoriesListResponse`
- [ ] `POST /api/categories` -> `CreateCategoryResponse`
- [ ] `PUT /api/categories/update/:id` -> `UpdateCategoryResponse`
- [ ] `DELETE /api/categories/delete/:id` -> `DeleteCategoryResponse`

### 👥 User Endpoints

- [ ] `GET /api/users?createdById=me` -> `UsersListResponse`
- [ ] `POST /api/users` -> `CreateUserResponse`
- [ ] `PUT /api/users/:id` -> `UpdateUserResponse`
- [ ] `DELETE /api/users/:id` -> `DeleteUserResponse`
- [ ] `POST /api/users/:id/roles` -> `AssignRoleResponse`
- [ ] `DELETE /api/users/:id/roles/:roleId` -> `RemoveRoleResponse`

### 📝 Article Endpoints

- [ ] `GET /api/articles` -> `ArticlesListResponse`
- [ ] `GET /api/articles/get/author` -> `ArticlesListResponse`
- [ ] `POST /api/articles/create` -> `CreateArticleResponse`
- [ ] `PATCH /api/articles/update/:id` -> `UpdateArticleResponse`
- [ ] `DELETE /api/articles/delete/:id` -> `DeleteArticleResponse`

### 🎁 Package Endpoints

- [ ] `GET /api/packages` -> `PackagesListResponse`
- [ ] `GET /api/packages?id=:id` -> `PackageResponse`
- [ ] `GET /api/packages/active` -> `UserPackageResponse`
- [ ] `GET /api/packages/limits` -> `PackageLimitsResponse`
- [ ] `POST /api/packages/assign` -> `AssignPackageResponse`
- [ ] `POST /api/packages` -> `CreatePackageResponse`
- [ ] `PATCH /api/packages/update/:id` -> `UpdatePackageResponse`
- [ ] `DELETE /api/packages/:id` -> `DeletePackageResponse`
- [ ] `POST /api/packages/activate` -> `ActivatePackageResponse`

### 🌐 Public Endpoints

- [ ] `GET /api/public/stores` -> `PublicStoresListResponse`
- [ ] `GET /api/public/stores/:id` -> `PublicStoresListResponse`
- [ ] `GET /api/public/categories` -> `PublicCategoriesListResponse`
- [ ] `GET /api/public/products/:id` -> `PublicProductsListResponse`
- [ ] `GET /api/public/get/productListing/` -> `PublicProductsListResponse`
- [ ] `GET /api/public/articles` -> `ArticlesListResponse`

### 💳 Cart & Payment Endpoints

- [ ] `GET /api/cart/get` -> `CartResponse`
- [ ] `POST /api/cart/update` -> `AddToCartResponse`
- [ ] `PUT /api/cart/decrease` -> `UpdateCartResponse`
- [ ] `DELETE /api/cart/delete/:productId/:sizeId` -> `RemoveFromCartResponse`
- [ ] `DELETE /api/cart/delete` -> `ClearCartResponse`

### 🔒 Auth Endpoints

- [ ] `POST /api/user/auth/login` -> `SignIn`
- [ ] `POST /api/user/auth/logout` -> `LogoutResponse`
- [ ] `POST /api/user/auth/register` -> `SignUpResponse`
- [ ] `GET /api/user/auth/session` -> `SessionResponse`
- [ ] `GET /api/auth/sessions` -> `UserSessionsResponse`

- [ ] GET /api/store/getall -> StoresListResponse
- [ ] GET /api/store/getall/user -> StoresListResponse
- [ ] GET /api/store/getall/user/filter -> StoresListResponse
- [ ] GET /api/store/get/:id -> StoreResponse
- [ ] POST /api/store/create -> CreateStoreResponse
- [ ] POST /api/store/update -> UpdateStoreResponse
- [ ] PATCH /api/store/update/image -> UpdateStoreResponse
- [ ] DELETE /api/store/delete/:id -> DeleteStoreResponse
- [ ] DELETE /api/store/delete/image/:id -> DeleteStoreResponse
### 🛒 Shop (Products) Endpoints

- [ ] GET /api/shop/getall -> ProductsListResponse
- [ ] GET /api/shop/get/single?id=:id -> ProductResponse
- [ ] GET /api/shop/get/storeProducts/:storeId -> ProductsListResponse
- [ ] POST /api/shop/create -> CreateProductResponse
- [ ] PATCH /api/shop/update -> UpdateProductResponse
- [ ] PATCH /api/shop/update/images -> UpdateProductResponse
- [ ] DELETE /api/shop/delete/:id -> DeleteProductResponse
- [ ] DELETE /api/shop/delete/image/:id -> DeleteProductResponse

### 📦 Order Endpoints

- [ ] GET /api/admin/orders/last -> OrderResponse
- [ ] POST /api/admin/orders/date-range -> OrdersListResponse
- [ ] GET /api/admin/orders/:orderId/items -> OrderItemsResponse

### 🏷️ Category Endpoints

- [ ] GET /api/categories -> CategoriesListResponse
- [ ] POST /api/categories -> CreateCategoryResponse
- [ ] PUT /api/categories/update/:id -> UpdateCategoryResponse
- [ ] DELETE /api/categories/delete/:id -> DeleteCategoryResponse

### 👥 User Endpoints

- [ ] GET /api/users?createdById=me -> UsersListResponse
- [ ] POST /api/users -> CreateUserResponse
- [ ] PUT /api/users/:id -> UpdateUserResponse
- [ ] DELETE /api/users/:id -> DeleteUserResponse
- [ ] POST /api/users/:id/roles -> AssignRoleResponse
- [ ] DELETE /api/users/:id/roles/:roleId -> RemoveRoleResponse

### 📝 Article Endpoints

- [ ] GET /api/articles -> ArticlesListResponse
- [ ] GET /api/articles/get/author -> ArticlesListResponse
- [ ] POST /api/articles/create -> CreateArticleResponse
- [ ] PATCH /api/articles/update/:id -> UpdateArticleResponse
- [ ] DELETE /api/articles/delete/:id -> DeleteArticleResponse

### 🎁 Package Endpoints

- [ ] GET /api/packages -> PackagesListResponse
- [ ] GET /api/packages?id=:id -> PackageResponse
- [ ] GET /api/packages/active -> UserPackageResponse
- [ ] GET /api/packages/limits -> PackageLimitsResponse
- [ ] POST /api/packages/assign -> AssignPackageResponse
- [ ] POST /api/packages -> CreatePackageResponse
- [ ] PATCH /api/packages/update/:id -> UpdatePackageResponse
- [ ] DELETE /api/packages/:id -> DeletePackageResponse
- [ ] POST /api/packages/activate -> ActivatePackageResponse

### 🌐 Public Endpoints

- [ ] GET /api/public/stores -> PublicStoresListResponse
- [ ] GET /api/public/stores/:id -> PublicStoresListResponse
- [ ] GET /api/public/categories -> PublicCategoriesListResponse
- [ ] GET /api/public/products/:id -> PublicProductsListResponse
- [ ] GET /api/public/get/productListing/ -> PublicProductsListResponse
- [ ] GET /api/public/articles -> ArticlesListResponse

### 💳 Cart & Payment Endpoints


- [ ] GET /api/cart/get -> CartResponse
- [ ] POST /api/cart/update -> AddToCartResponse
- [ ] PUT /api/cart/decrease -> UpdateCartResponse
- [ ] DELETE /api/cart/delete/:productId/:sizeId -> RemoveFromCartResponse
- [ ] DELETE /api/cart/delete -> ClearCartResponse

### 🔒 Auth Endpoints


- [ ] POST /api/user/auth/login -> SignIn
- [ ] POST /api/user/auth/logout -> LogoutResponse
- [ ] POST /api/user/auth/register -> SignUpResponse
- [ ] GET /api/user/auth/session -> SessionResponse
- [ ] GET /api/auth/sessions -> UserSessionsResponse

