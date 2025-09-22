export const createProductRouteSchema = {
  tags: ["RLS Shop"],
  summary: "Create a new product with tenant isolation",
  security: [{ apiKey: [] }],
  body: {
    type: 'object',
    required: ['name', 'description', 'price', 'categoryId'],
    properties: {
      name: {
        type: 'string',
        description: 'Product name'
      },
      description: {
        type: 'string',
        description: 'Product description'
      },
      price: {
        type: 'number',
        description: 'Product price'
      },
      categoryId: {
        type: 'string',
        format: 'uuid',
        description: 'Category ID'
      },
      sizes: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            size: { type: 'string' },
            quantity: { type: 'number' }
          }
        }
      },
      images: {
        type: 'array',
        items: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        product: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            categoryId: { type: 'string', format: 'uuid' },
            ownerId: { type: 'string', format: 'uuid' },
            tenantId: { type: 'string', format: 'uuid' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        tenant: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            slug: { type: 'string' }
          }
        }
      }
    }
  }
}

export const getAllProductsRouteSchema = {
  tags: ["RLS Shop"],
  summary: "Get all products with tenant isolation",
  security: [{ apiKey: [] }],
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'number', minimum: 1 },
      limit: { type: 'number', minimum: 1, maximum: 100 },
      categoryId: { type: 'string', format: 'uuid' },
      search: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        products: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string' },
              description: { type: 'string' },
              price: { type: 'number' },
              categoryId: { type: 'string', format: 'uuid' },
              ownerId: { type: 'string', format: 'uuid' },
              tenantId: { type: 'string', format: 'uuid' },
              images: {
                type: 'array',
                items: { type: 'string' }
              },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          }
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            pages: { type: 'number' }
          }
        },
        tenant: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            slug: { type: 'string' }
          }
        }
      }
    }
  }
}

export const getSingleProductRouteSchema = {
  tags: ["RLS Shop"],
  summary: "Get single product with tenant isolation",
  security: [{ apiKey: [] }],
  querystring: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Product ID'
      }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        product: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            categoryId: { type: 'string', format: 'uuid' },
            ownerId: { type: 'string', format: 'uuid' },
            tenantId: { type: 'string', format: 'uuid' },
            images: {
              type: 'array',
              items: { type: 'string' }
            },
            sizes: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  size: { type: 'string' },
                  quantity: { type: 'number' }
                }
              }
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        tenant: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            slug: { type: 'string' }
          }
        }
      }
    }
  }
}

export const updateProductRouteSchema = {
  tags: ["RLS Shop"],
  summary: "Update product with tenant isolation",
  security: [{ apiKey: [] }],
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      price: { type: 'number' },
      categoryId: { type: 'string', format: 'uuid' },
      sizes: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            size: { type: 'string' },
            quantity: { type: 'number' }
          }
        }
      }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        product: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            categoryId: { type: 'string', format: 'uuid' },
            ownerId: { type: 'string', format: 'uuid' },
            tenantId: { type: 'string', format: 'uuid' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        tenant: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            slug: { type: 'string' }
          }
        }
      }
    }
  }
}

export const deleteProductRouteSchema = {
  tags: ["RLS Shop"],
  summary: "Delete product with tenant isolation",
  security: [{ apiKey: [] }],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Product ID to delete'
      }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        deleted: { type: 'boolean' },
        tenant: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            slug: { type: 'string' }
          }
        }
      }
    }
  }
}

export default {
  createProductRouteSchema,
  getAllProductsRouteSchema,
  getSingleProductRouteSchema,
  updateProductRouteSchema,
  deleteProductRouteSchema
}
