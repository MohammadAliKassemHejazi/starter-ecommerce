export const createCategoryRouteSchema = {
  tags: ["Category"],
  summary: "Create a new category",
  security: [{ apiKey: [] }],
  body: {
    type: 'object',
    required: ['name'],
    properties: {
      name: {
        type: 'string',
        description: 'Category name'
      },
      description: {
        type: 'string',
        description: 'Category description'
      },
      parentId: {
        type: 'string',
        format: 'uuid',
        description: 'Parent category ID (optional)'
      },
      image: {
        type: 'string',
        format: 'binary',
        description: 'Category image'
      }
    }
  },
  response: {
    201: {
      type: 'object',
      properties: {
        category: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            parentId: { type: 'string', format: 'uuid' },
            image: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  }
}

export const getAllCategoriesRouteSchema = {
  tags: ["Category"],
  summary: "Get all categories",
  security: [{ apiKey: [] }],
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'number', minimum: 1 },
      limit: { type: 'number', minimum: 1, maximum: 100 },
      parentId: { type: 'string', format: 'uuid' },
      search: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        categories: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string' },
              description: { type: 'string' },
              parentId: { type: 'string', format: 'uuid' },
              image: { type: 'string' },
              children: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                    name: { type: 'string' },
                    description: { type: 'string' }
                  }
                }
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

export const getCategoryByIdRouteSchema = {
  tags: ["Category"],
  summary: "Get category by ID",
  security: [{ apiKey: [] }],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Category ID'
      }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        category: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            parentId: { type: 'string', format: 'uuid' },
            image: { type: 'string' },
            children: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  name: { type: 'string' },
                  description: { type: 'string' }
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

export const updateCategoryRouteSchema = {
  tags: ["Category"],
  summary: "Update category",
  security: [{ apiKey: [] }],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Category ID to update'
      }
    }
  },
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      parentId: { type: 'string', format: 'uuid' },
      image: { type: 'string', format: 'binary' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        category: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            parentId: { type: 'string', format: 'uuid' },
            image: { type: 'string' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  }
}

export const deleteCategoryRouteSchema = {
  tags: ["Category"],
  summary: "Delete category",
  security: [{ apiKey: [] }],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Category ID to delete'
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
  createCategoryRouteSchema,
  getAllCategoriesRouteSchema,
  getCategoryByIdRouteSchema,
  updateCategoryRouteSchema,
  deleteCategoryRouteSchema
}
