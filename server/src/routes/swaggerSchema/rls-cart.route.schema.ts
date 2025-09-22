export const getCartRouteSchema = {
  tags: ["RLS Cart"],
  summary: "Get user cart with tenant isolation",
  security: [{ apiKey: [] }],
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        cart: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              userId: { type: 'string', format: 'uuid' },
              productId: { type: 'string', format: 'uuid' },
              sizeId: { type: 'string', format: 'uuid' },
              quantity: { type: 'number' },
              product: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  name: { type: 'string' },
                  price: { type: 'number' },
                  images: {
                    type: 'array',
                    items: { type: 'string' }
                  }
                }
              },
              size: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  size: { type: 'string' },
                  quantity: { type: 'number' }
                }
              },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
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

export const addToCartRouteSchema = {
  tags: ["RLS Cart"],
  summary: "Add item to cart with tenant isolation",
  security: [{ apiKey: [] }],
  body: {
    type: 'object',
    required: ['productId', 'quantity'],
    properties: {
      productId: {
        type: 'string',
        format: 'uuid',
        description: 'Product ID to add to cart'
      },
      quantity: {
        type: 'number',
        minimum: 1,
        description: 'Quantity to add'
      },
      sizeId: {
        type: 'string',
        format: 'uuid',
        description: 'Size ID (optional)'
      }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        cartItem: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            productId: { type: 'string', format: 'uuid' },
            sizeId: { type: 'string', format: 'uuid' },
            quantity: { type: 'number' },
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

export const decreaseCartRouteSchema = {
  tags: ["RLS Cart"],
  summary: "Decrease item quantity in cart with tenant isolation",
  security: [{ apiKey: [] }],
  body: {
    type: 'object',
    required: ['productId', 'quantity'],
    properties: {
      productId: {
        type: 'string',
        format: 'uuid',
        description: 'Product ID to decrease'
      },
      quantity: {
        type: 'number',
        minimum: 1,
        description: 'Quantity to decrease'
      },
      sizeId: {
        type: 'string',
        format: 'uuid',
        description: 'Size ID (optional)'
      }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        cartItem: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            productId: { type: 'string', format: 'uuid' },
            sizeId: { type: 'string', format: 'uuid' },
            quantity: { type: 'number' },
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

export const removeFromCartRouteSchema = {
  tags: ["RLS Cart"],
  summary: "Remove item from cart with tenant isolation",
  security: [{ apiKey: [] }],
  body: {
    type: 'object',
    required: ['productId'],
    properties: {
      productId: {
        type: 'string',
        format: 'uuid',
        description: 'Product ID to remove from cart'
      },
      sizeId: {
        type: 'string',
        format: 'uuid',
        description: 'Size ID (optional)'
      }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        result: { type: 'boolean' },
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

export const clearCartRouteSchema = {
  tags: ["RLS Cart"],
  summary: "Clear entire cart with tenant isolation",
  security: [{ apiKey: [] }],
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        result: { type: 'boolean' },
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
  getCartRouteSchema,
  addToCartRouteSchema,
  decreaseCartRouteSchema,
  removeFromCartRouteSchema,
  clearCartRouteSchema
}
