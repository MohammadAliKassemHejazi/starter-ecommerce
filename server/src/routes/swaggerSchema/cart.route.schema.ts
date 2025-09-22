export const getCartRouteSchema = {
  tags: ["Cart"],
  summary: "Get user cart",
  security: [{ apiKey: [] }],
  response: {
    200: {
      type: 'object',
      properties: {
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
        }
      }
    }
  }
}

export const addToCartRouteSchema = {
  tags: ["Cart"],
  summary: "Add item to cart",
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
        }
      }
    }
  }
}

export const decreaseCartRouteSchema = {
  tags: ["Cart"],
  summary: "Decrease item quantity in cart",
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
        }
      }
    }
  }
}

export const removeFromCartRouteSchema = {
  tags: ["Cart"],
  summary: "Remove item from cart",
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
        result: { type: 'boolean' }
      }
    }
  }
}

export const clearCartRouteSchema = {
  tags: ["Cart"],
  summary: "Clear entire cart",
  security: [{ apiKey: [] }],
  response: {
    200: {
      type: 'object',
      properties: {
        result: { type: 'boolean' }
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
