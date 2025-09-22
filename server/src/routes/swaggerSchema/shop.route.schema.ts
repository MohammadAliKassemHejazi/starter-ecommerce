export const createProductRouteSchema = {
  tags: ["Shop"],
  summary: "Create a new product",
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
        product: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            categoryId: { type: 'string', format: 'uuid' },
            ownerId: { type: 'string', format: 'uuid' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  }
}

export const getAllProductsRouteSchema = {
  tags: ["Shop"],
  summary: "Get all products",
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
        }
      }
    }
  }
}

export const getSingleProductRouteSchema = {
  tags: ["Shop"],
  summary: "Get single product",
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
        product: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            categoryId: { type: 'string', format: 'uuid' },
            ownerId: { type: 'string', format: 'uuid' },
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
        }
      }
    }
  }
}

export const updateProductRouteSchema = {
  tags: ["Shop"],
  summary: "Update product",
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
        product: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            categoryId: { type: 'string', format: 'uuid' },
            ownerId: { type: 'string', format: 'uuid' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  }
}

export const deleteProductRouteSchema = {
  tags: ["Shop"],
  summary: "Delete product",
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
        deleted: { type: 'boolean' }
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
