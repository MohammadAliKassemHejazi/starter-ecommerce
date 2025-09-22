export const getLastOrderRouteSchema = {
  tags: ["RLS Order"],
  summary: "Get user's last order with tenant isolation",
  security: [{ apiKey: [] }],
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        order: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            tenantId: { type: 'string', format: 'uuid' },
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

export const getOrderItemsRouteSchema = {
  tags: ["RLS Order"],
  summary: "Get order items with tenant isolation",
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
        success: { type: 'boolean' },
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

export const getOrdersByDateRangeRouteSchema = {
  tags: ["RLS Order"],
  summary: "Get orders by date range with tenant isolation",
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
        success: { type: 'boolean' },
        orders: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              userId: { type: 'string', format: 'uuid' },
              tenantId: { type: 'string', format: 'uuid' },
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

export const createOrderRouteSchema = {
  tags: ["RLS Order"],
  summary: "Create new order with tenant isolation",
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
        success: { type: 'boolean' },
        order: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            tenantId: { type: 'string', format: 'uuid' },
            orderNumber: { type: 'string' },
            status: { type: 'string' },
            totalAmount: { type: 'number' },
            shippingAddress: { type: 'string' },
            paymentMethod: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
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

export const updateOrderStatusRouteSchema = {
  tags: ["RLS Order"],
  summary: "Update order status with tenant isolation",
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
        success: { type: 'boolean' },
        order: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            status: { type: 'string' },
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

export default {
  getLastOrderRouteSchema,
  getOrderItemsRouteSchema,
  getOrdersByDateRangeRouteSchema,
  createOrderRouteSchema,
  updateOrderStatusRouteSchema
}
