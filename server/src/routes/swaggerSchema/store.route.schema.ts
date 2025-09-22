export const createStoreRouteSchema = {
  tags: ["Store"],
  summary: "Create a new store",
  security: [{ apiKey: [] }],
  body: {
    type: 'object',
    required: ['name', 'categoryId'],
    properties: {
      name: {
        type: 'string',
        description: 'Store name'
      },
      description: {
        type: 'string',
        description: 'Store description'
      },
      categoryId: {
        type: 'string',
        format: 'uuid',
        description: 'Category ID'
      },
      address: {
        type: 'string',
        description: 'Store address'
      },
      phone: {
        type: 'string',
        description: 'Store phone number'
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
        store: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            categoryId: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            address: { type: 'string' },
            phone: { type: 'string' },
            images: {
              type: 'array',
              items: { type: 'string' }
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  }
}

export const getAllStoresRouteSchema = {
  tags: ["Store"],
  summary: "Get all stores",
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
        stores: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string' },
              description: { type: 'string' },
              categoryId: { type: 'string', format: 'uuid' },
              userId: { type: 'string', format: 'uuid' },
              address: { type: 'string' },
              phone: { type: 'string' },
              images: {
                type: 'array',
                items: { type: 'string' }
              },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    }
  }
}

export const getStoreByIdRouteSchema = {
  tags: ["Store"],
  summary: "Get store by ID",
  security: [{ apiKey: [] }],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Store ID'
      }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        store: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            categoryId: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            address: { type: 'string' },
            phone: { type: 'string' },
            images: {
              type: 'array',
              items: { type: 'string' }
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  }
}

export const updateStoreRouteSchema = {
  tags: ["Store"],
  summary: "Update store",
  security: [{ apiKey: [] }],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Store ID to update'
      }
    }
  },
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      categoryId: { type: 'string', format: 'uuid' },
      address: { type: 'string' },
      phone: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        store: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            categoryId: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            address: { type: 'string' },
            phone: { type: 'string' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  }
}

export const deleteStoreRouteSchema = {
  tags: ["Store"],
  summary: "Delete store",
  security: [{ apiKey: [] }],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Store ID to delete'
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
  createStoreRouteSchema,
  getAllStoresRouteSchema,
  getStoreByIdRouteSchema,
  updateStoreRouteSchema,
  deleteStoreRouteSchema
}
