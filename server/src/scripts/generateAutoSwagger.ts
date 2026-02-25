import config from '../config/config';
import fs from 'fs';
import path from 'path';

/**
 * Automatic Swagger Documentation Generator
 * This script automatically reads all schema files and generates complete OpenAPI 3.0 documentation
 */

const loadAllSchemas = async (schemaPath: string): Promise<any> => {
  const allSchemas: any = {};
  const files = fs.readdirSync(schemaPath);

  console.log(`📁 Found ${files.length} files in schema directory`);

  await Promise.all(
    files.map(async (file) => {
      if (file.endsWith('.ts') && !file.includes('index') && !file.includes('swagger.json')) {
        try {
          const filePath = path.join(schemaPath, file);
          const module = await import(filePath);

          // Handle both default exports and named exports
          const schemaExports = module.default || module;

          // If it's an object with multiple schemas, merge them
          if (typeof schemaExports === 'object' && schemaExports !== null) {
            Object.keys(schemaExports).forEach((key) => {
              if (key.includes('RouteSchema') || key.includes('Schema')) {
                allSchemas[key] = schemaExports[key];
              }
            });
          }

          console.log(`✅ Loaded schemas from ${file}`);
        } catch (error) {
          console.warn(`⚠️  Could not load ${file}:`, (error as Error).message);
        }
      }
    }),
  );

  return allSchemas;
};

const convertSchemaToOpenAPI = (schemaName: string, schema: any) => {
  // Determine HTTP method from schema name
  let method = 'get';
  if (schemaName.includes('create') || schemaName.includes('add') || schemaName.includes('register') || schemaName.includes('login')) {
    method = 'post';
  } else if (schemaName.includes('update') || schemaName.includes('edit')) {
    method = 'put';
  } else if (schemaName.includes('delete') || schemaName.includes('remove') || schemaName.includes('clear')) {
    method = 'delete';
  }

  // Determine path from schema name
  let path = '';
  const baseName = schemaName.replace('RouteSchema', '').replace('Schema', '');

  // Map schema names to API paths
  const pathMappings: { [key: string]: string } = {
    // Authentication
    loginRouteSchema: '/api/auth/login',
    registerRouteSchema: '/api/auth/register',
    isAuthenticatedRouteSchema: '/api/auth/isauthenticated',

    // Shop/Products
    createProductRouteSchema: '/api/shop/create',
    getAllProductsRouteSchema: '/api/shop/all',
    getSingleProductRouteSchema: '/api/shop/single',
    updateProductRouteSchema: '/api/shop/update',
    deleteProductRouteSchema: '/api/shop/delete/{id}',

    // Cart
    getCartRouteSchema: '/api/cart',
    addToCartRouteSchema: '/api/cart/add',
    decreaseCartRouteSchema: '/api/cart/decrease',
    removeFromCartRouteSchema: '/api/cart/remove',
    clearCartRouteSchema: '/api/cart/clear',

    // Orders
    getLastOrderRouteSchema: '/api/orders/last',
    getOrderItemsRouteSchema: '/api/orders/{orderId}/items',
    getOrdersByDateRangeRouteSchema: '/api/orders/date-range',
    createOrderRouteSchema: '/api/orders/create',
    updateOrderStatusRouteSchema: '/api/orders/{orderId}/status',

    // Stores
    createStoreRouteSchema: '/api/stores/create',
    getAllStoresRouteSchema: '/api/stores/all',
    getStoreByIdRouteSchema: '/api/stores/{id}',
    updateStoreRouteSchema: '/api/stores/{id}',
    deleteStoreRouteSchema: '/api/stores/{id}',

    // Categories
    createCategoryRouteSchema: '/api/categories/create',
    getAllCategoriesRouteSchema: '/api/categories/all',
    getCategoryByIdRouteSchema: '/api/categories/{id}',
    updateCategoryRouteSchema: '/api/categories/{id}',
    deleteCategoryRouteSchema: '/api/categories/{id}',

    // Users
    createUserRouteSchema: '/api/users/create',
    getAllUsersRouteSchema: '/api/users/all',
    getUserByIdRouteSchema: '/api/users/{id}',
    updateUserRouteSchema: '/api/users/{id}',
    deleteUserRouteSchema: '/api/users/{id}',
    getUserProfileRouteSchema: '/api/users/profile',

    // Payments
    createPaymentRouteSchema: '/api/payment/create',
    getAllPaymentsRouteSchema: '/api/payment/all',
    getPaymentByIdRouteSchema: '/api/payment/{id}',
    updatePaymentStatusRouteSchema: '/api/payment/{id}/status',
    processRefundRouteSchema: '/api/payment/{id}/refund',

    // Roles
    createRoleRouteSchema: '/api/admin/roles/create',
    getAllRolesRouteSchema: '/api/admin/roles/all',
    getRoleByIdRouteSchema: '/api/admin/roles/{id}',
    updateRoleRouteSchema: '/api/admin/roles/{id}',
    deleteRoleRouteSchema: '/api/admin/roles/{id}',
    assignRoleToUserRouteSchema: '/api/admin/roles/assign',

    // Articles
    createArticleRouteSchema: '/api/articles/create',
    getAllArticlesRouteSchema: '/api/articles/all',
    getArticleByIdRouteSchema: '/api/articles/{id}',
    updateArticleRouteSchema: '/api/articles/{id}',
    deleteArticleRouteSchema: '/api/articles/{id}',

    // Comments
    createCommentRouteSchema: '/api/comments/create',
    getAllCommentsRouteSchema: '/api/comments/all',
    getCommentByIdRouteSchema: '/api/comments/{id}',
    updateCommentRouteSchema: '/api/comments/{id}',
    deleteCommentRouteSchema: '/api/comments/{id}',

    // Favorites
    addToFavoritesRouteSchema: '/api/favorites/add',
    removeFromFavoritesRouteSchema: '/api/favorites/remove',
    getFavoritesRouteSchema: '/api/favorites',

    // Packages
    createPackageRouteSchema: '/api/packages/create',
    getAllPackagesRouteSchema: '/api/packages/all',
    getPackageByIdRouteSchema: '/api/packages/{id}',
    updatePackageRouteSchema: '/api/packages/{id}',
    deletePackageRouteSchema: '/api/packages/{id}',

    // Promotions
    createPromotionRouteSchema: '/api/promotions/create',
    getAllPromotionsRouteSchema: '/api/promotions/all',
    getPromotionByIdRouteSchema: '/api/promotions/{id}',
    updatePromotionRouteSchema: '/api/promotions/{id}',
    deletePromotionRouteSchema: '/api/promotions/{id}',

    // Returns
    createReturnRouteSchema: '/api/returns/create',
    getAllReturnsRouteSchema: '/api/returns/all',
    getReturnByIdRouteSchema: '/api/returns/{id}',
    updateReturnRouteSchema: '/api/returns/{id}',
    deleteReturnRouteSchema: '/api/returns/{id}',

    // RLS Schemas (with tenant context)
    rlsCreateProductRouteSchema: '/api/shop/create',
    rlsGetAllProductsRouteSchema: '/api/shop/all',
    rlsGetSingleProductRouteSchema: '/api/shop/single',
    rlsUpdateProductRouteSchema: '/api/shop/update',
    rlsDeleteProductRouteSchema: '/api/shop/delete/{id}',

    rlsCreateStoreRouteSchema: '/api/stores/create',
    rlsGetAllStoresRouteSchema: '/api/stores/all',
    rlsGetStoreByIdRouteSchema: '/api/stores/{id}',
    rlsUpdateStoreRouteSchema: '/api/stores/{id}',
    rlsDeleteStoreRouteSchema: '/api/stores/{id}',

    rlsGetCartRouteSchema: '/api/cart',
    rlsAddToCartRouteSchema: '/api/cart/add',
    rlsDecreaseCartRouteSchema: '/api/cart/decrease',
    rlsRemoveFromCartRouteSchema: '/api/cart/remove',
    rlsClearCartRouteSchema: '/api/cart/clear',

    rlsGetLastOrderRouteSchema: '/api/orders/last',
    rlsGetOrderItemsRouteSchema: '/api/orders/{orderId}/items',
    rlsGetOrdersByDateRangeRouteSchema: '/api/orders/date-range',
    rlsCreateOrderRouteSchema: '/api/orders/create',
    rlsUpdateOrderStatusRouteSchema: '/api/orders/{orderId}/status',
  };

  path = pathMappings[schemaName] || `/api/${baseName.toLowerCase()}`;

  // Convert schema to OpenAPI format
  const openAPISchema: any = {
    tags: schema.tags || ['API'],
    summary: schema.summary || `${method.toUpperCase()} ${path}`,
    description: schema.description || `API endpoint for ${path}`,
    security: schema.security || [{ apiKey: [] }],
    responses: {
      '200': {
        description: 'Success',
        content: {
          'application/json': {
            schema: schema.response?.[200] || { type: 'object' },
          },
        },
      },
      '400': {
        description: 'Bad Request',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
          },
        },
      },
      '401': {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
          },
        },
      },
      '404': {
        description: 'Not Found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
          },
        },
      },
    },
  };

  // Add parameters if they exist
  if (schema.params) {
    openAPISchema.parameters = Object.keys(schema.params.properties || {}).map((key) => ({
      name: key,
      in: 'path',
      required: schema.params.required?.includes(key) || false,
      schema: schema.params.properties[key],
    }));
  }

  // Add request body if it exists
  if (schema.body) {
    openAPISchema.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: schema.body,
        },
      },
    };
  }

  // Add query parameters if they exist
  if (schema.querystring) {
    if (!openAPISchema.parameters) openAPISchema.parameters = [];
    Object.keys(schema.querystring.properties || {}).forEach((key) => {
      openAPISchema.parameters.push({
        name: key,
        in: 'query',
        required: schema.querystring.required?.includes(key) || false,
        schema: schema.querystring.properties[key],
      });
    });
  }

  return { path, method, schema: openAPISchema };
};

export const generateAutoSwagger = async () => {
  console.log('🚀 Generating automatic Swagger documentation from all schema files...');

  const schemasPath = path.resolve(__dirname, '../routes/swaggerSchema/');
  const allSchemas = await loadAllSchemas(schemasPath);

  console.log(`📊 Loaded ${Object.keys(allSchemas).length} schemas`);

  const paths: Record<string, any> = {};

  // Convert each schema to OpenAPI format
  Object.keys(allSchemas).forEach((schemaName) => {
    const { path: apiPath, method, schema } = convertSchemaToOpenAPI(schemaName, allSchemas[schemaName]);

    if (apiPath) {
      if (!paths[apiPath]) {
        paths[apiPath] = {};
      }
      paths[apiPath][method] = schema;
    }
  });

  // Create comprehensive OpenAPI document
  const swaggerDoc = {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce Multi-Tenant API',
      description: 'Comprehensive API documentation for the E-Commerce platform with RLS-based multi-tenancy support',
      version: '2.0.0',
      contact: {
        name: 'API Support',
        email: 'support@ecommerce.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Development server',
      },
      {
        url: 'https://api.ecommerce.com',
        description: 'Production server',
      },
    ],
    security: [
      {
        apiKey: [],
      },
      {
        bearerAuth: [],
      },
    ],
    components: {
      securitySchemes: {
        apiKey: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
        },
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              description: 'Error message',
            },
            code: {
              type: 'string',
              description: 'Error code',
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              description: 'Success message',
            },
          },
        },
        TenantContext: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Tenant ID',
            },
            slug: {
              type: 'string',
              description: 'Tenant slug',
            },
            name: {
              type: 'string',
              description: 'Tenant name',
            },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: {
              type: 'number',
              description: 'Current page number',
            },
            limit: {
              type: 'number',
              description: 'Items per page',
            },
            total: {
              type: 'number',
              description: 'Total number of items',
            },
            pages: {
              type: 'number',
              description: 'Total number of pages',
            },
          },
        },
      },
    },
    paths,
  };

  // Write the swagger.json file
  const outputPath = path.resolve(__dirname, '../routes/swaggerSchema/swagger.json');
  fs.writeFileSync(outputPath, JSON.stringify(swaggerDoc, null, 2));

  console.log(`✅ Automatic Swagger documentation generated successfully!`);
  console.log(`📄 Output: ${outputPath}`);
  console.log(`📊 Total API endpoints: ${Object.keys(paths).length}`);
  console.log(`🔧 Total schemas processed: ${Object.keys(allSchemas).length}`);

  // Also create a comprehensive version
  const comprehensivePath = path.resolve(__dirname, '../routes/swaggerSchema/swagger-comprehensive.json');
  fs.writeFileSync(comprehensivePath, JSON.stringify(swaggerDoc, null, 2));

  console.log(`📄 Comprehensive version: ${comprehensivePath}`);

  return swaggerDoc;
};

// Run the script if called directly
if (require.main === module) {
  generateAutoSwagger().catch(console.error);
}

export default generateAutoSwagger;
