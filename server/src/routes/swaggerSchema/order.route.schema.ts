export const getLastOrderRouteSchema = {
  tags: ["Order"],
  summary: "Get user's last order",
  security: [{ apiKey: [] }],
  response: {
    200: {
      type: 'object',
      properties: {
        order: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            orderNumber: { type: 'string' },
            status: { 
              type: 'string',
              enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
            },
            totalAmount: { type: 'number' },
            shippingAddress: { type: 'string' },
            paymentMethod: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  }
}

export const getOrderItemsRouteSchema = {
  tags: ["Order"],
  summary: "Get order items",
  security: [{ apiKey: [] }],
  params: {
    type: 'object',
    required: ['orderId'],
    properties: {
      orderId: {
        type: 'string',
        format: 'uuid',
        description: 'Order ID'
      }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        orderId: { type: 'string', format: 'uuid' },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              orderId: { type: 'string', format: 'uuid' },
              productId: { type: 'string', format: 'uuid' },
              sizeId: { type: 'string', format: 'uuid' },
              quantity: { type: 'number' },
              price: { type: 'number' },
              product: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  name: { type: 'string' },
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
                  size: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }
  }
}

export const getOrdersByDateRangeRouteSchema = {
  tags: ["Order"],
  summary: "Get orders by date range",
  security: [{ apiKey: [] }],
  body: {
    type: 'object',
    required: ['from', 'to'],
    properties: {
      from: {
        type: 'string',
        format: 'date',
        description: 'Start date (YYYY-MM-DD)'
      },
      to: {
        type: 'string',
        format: 'date',
        description: 'End date (YYYY-MM-DD)'
      }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        orders: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              userId: { type: 'string', format: 'uuid' },
              orderNumber: { type: 'string' },
              status: { 
                type: 'string',
                enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
              },
              totalAmount: { type: 'number' },
              shippingAddress: { type: 'string' },
              paymentMethod: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    }
  }
}

export const createOrderRouteSchema = {
  tags: ["Order"],
  summary: "Create new order",
  security: [{ apiKey: [] }],
  body: {
    type: 'object',
    required: ['items', 'shippingAddress', 'paymentMethod'],
    properties: {
      items: {
        type: 'array',
        items: {
          type: 'object',
          required: ['productId', 'quantity'],
          properties: {
            productId: { type: 'string', format: 'uuid' },
            quantity: { type: 'number', minimum: 1 },
            sizeId: { type: 'string', format: 'uuid' }
          }
        }
      },
      shippingAddress: {
        type: 'string',
        description: 'Shipping address'
      },
      paymentMethod: {
        type: 'string',
        description: 'Payment method'
      },
      notes: {
        type: 'string',
        description: 'Order notes (optional)'
      }
    }
  },
  response: {
    201: {
      type: 'object',
      properties: {
        order: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            orderNumber: { type: 'string' },
            status: { type: 'string' },
            totalAmount: { type: 'number' },
            shippingAddress: { type: 'string' },
            paymentMethod: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  }
}

export const updateOrderStatusRouteSchema = {
  tags: ["Order"],
  summary: "Update order status",
  security: [{ apiKey: [] }],
  params: {
    type: 'object',
    required: ['orderId'],
    properties: {
      orderId: {
        type: 'string',
        format: 'uuid',
        description: 'Order ID to update'
      }
    }
  },
  body: {
    type: 'object',
    required: ['status'],
    properties: {
      status: {
        type: 'string',
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        description: 'New order status'
      }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        order: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            status: { type: 'string' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  }
}

export default {
  getLastOrderRouteSchema,
  getOrderItemsRouteSchema,
  getOrdersByDateRangeRouteSchema,
  createOrderRouteSchema,
  updateOrderStatusRouteSchema
}
