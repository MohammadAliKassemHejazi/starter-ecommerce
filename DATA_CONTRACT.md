# Data Contract Architecture

This repository perfectly embodies the idea of the "contract breaking at the boundaries." It uses a clear Client-Server architecture where the contract is the API.

## 1. Backend (Source of Truth)
The database models (Sequelize in PostgreSQL) define the source data. The Service-Controller Pattern ensures controllers don't contain business logic; they are responsible for preparing the HTTP response.

- **Controllers** handle HTTP requests and invoke services. They do not hold business logic.
- **Services** retrieve data from the database and transform it into the agreed-upon shape defined by interfaces (e.g., `IProductResponse`).

## 2. Frontend (Consumer)
The Next.js app consumes this API. It uses a dedicated API Layer (`client/src/services/`) and Redux Toolkit (`client/src/store/`) to manage state, which then feeds the UI components.

## 3. Identifying and Solving Mismatches
This project proactively addresses common "shape" issues:

- **Naming Conventions**: TypeScript interfaces are used on both sides (`server/src/interfaces/`, `client/src/interfaces/`) to enforce a consistent shared type language (e.g., camelCase for frontend models).
- **Nesting**: The project uses a global `responseStandardizer.middleware.ts`. It ensures every API response has a consistent wrapper (`{ success, message, data }`). The frontend always knows where to find the payload, eliminating guesswork.
- **Type Consistency**: TypeScript usage across the entire stack prevents the "string in one place, number in another" problem. Primitives like IDs are strictly typed.

## 4. The Unified Shape (Frontend-First)
The project strongly implements a "Frontend-First" or shared contract approach:

- **View Requirement**: The UI dictates the necessary data for components (e.g., Product Cards require `name`, `thumbnail`, etc.).
- **Interface Definition**: `ProductResponse` is defined on the frontend and exactly matched by `IProductResponse` on the backend.
- **Backend Mapping**: Mappings occur explicitly in the Service layer. For example, `server/src/services/shop.service.ts` queries the database and transforms the raw Sequelize output into the `IProductResponse` shape before sending it to the controller.

### Example Mapping in `shop.service.ts`

```typescript
const formatProduct = (json: any): IProductResponse => {
  // ... (calculations for stock, ratings, etc.)
  return {
    id: json.id,
    name: json.name,
    price: json.price,
    thumbnail: mappedImages.length > 0 ? mappedImages[0].url : undefined,
    // ... mapped camelCase properties matching the frontend contract
  };
};
```

This single, consistent contract for product data ensures a robust and reliable architecture from the database all the way to the user view.
