export const createPaymentRouteSchema = {
  tags: ["Payment"],
  summary: "Create a new payment",
  security: [{ apiKey: [] }],
  body: {
    type: 'object',
    required: ['orderId', 'amount', 'paymentMethod'],
    properties: {
      orderId: {
        type: 'string',
        format: 'uuid',
        description: 'Order ID'
      },
      amount: {
        type: 'number',
        description: 'Payment amount'
      },
      paymentMethod: {
        type: 'string',
        enum: ['credit_card', 'debit_card', 'paypal', 'stripe', 'bank_transfer'],
        description: 'Payment method'
      },
      currency: {
        type: 'string',
        default: 'USD',
        description: 'Payment currency'
      },
      description: {
        type: 'string',
        description: 'Payment description'
      },
      metadata: {
        type: 'object',
        description: 'Additional payment metadata'
      }
    }
  },
  response: {
    201: {
      type: 'object',
      properties: {
        payment: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            orderId: { type: 'string', format: 'uuid' },
            amount: { type: 'number' },
            paymentMethod: { type: 'string' },
            currency: { type: 'string' },
            status: { 
              type: 'string',
              enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded']
            },
            transactionId: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  }
}

export const getAllPaymentsRouteSchema = {
  tags: ["Payment"],
  summary: "Get all payments",
  security: [{ apiKey: [] }],
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'number', minimum: 1 },
      limit: { type: 'number', minimum: 1, maximum: 100 },
      orderId: { type: 'string', format: 'uuid' },
      status: { 
        type: 'string',
        enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded']
      },
      paymentMethod: { 
        type: 'string',
        enum: ['credit_card', 'debit_card', 'paypal', 'stripe', 'bank_transfer']
      }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        payments: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              orderId: { type: 'string', format: 'uuid' },
              amount: { type: 'number' },
              paymentMethod: { type: 'string' },
              currency: { type: 'string' },
              status: { type: 'string' },
              transactionId: { type: 'string' },
              order: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  orderNumber: { type: 'string' },
                  totalAmount: { type: 'number' }
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

export const getPaymentByIdRouteSchema = {
  tags: ["Payment"],
  summary: "Get payment by ID",
  security: [{ apiKey: [] }],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Payment ID'
      }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        payment: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            orderId: { type: 'string', format: 'uuid' },
            amount: { type: 'number' },
            paymentMethod: { type: 'string' },
            currency: { type: 'string' },
            status: { type: 'string' },
            transactionId: { type: 'string' },
            description: { type: 'string' },
            metadata: { type: 'object' },
            order: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                orderNumber: { type: 'string' },
                totalAmount: { type: 'number' },
                status: { type: 'string' }
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

export const updatePaymentStatusRouteSchema = {
  tags: ["Payment"],
  summary: "Update payment status",
  security: [{ apiKey: [] }],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Payment ID to update'
      }
    }
  },
  body: {
    type: 'object',
    required: ['status'],
    properties: {
      status: {
        type: 'string',
        enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
        description: 'New payment status'
      },
      transactionId: {
        type: 'string',
        description: 'Transaction ID (optional)'
      },
      notes: {
        type: 'string',
        description: 'Status update notes (optional)'
      }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        payment: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            status: { type: 'string' },
            transactionId: { type: 'string' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  }
}

export const processRefundRouteSchema = {
  tags: ["Payment"],
  summary: "Process payment refund",
  security: [{ apiKey: [] }],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Payment ID to refund'
      }
    }
  },
  body: {
    type: 'object',
    required: ['refundAmount', 'reason'],
    properties: {
      refundAmount: {
        type: 'number',
        description: 'Refund amount'
      },
      reason: {
        type: 'string',
        description: 'Refund reason'
      },
      notes: {
        type: 'string',
        description: 'Additional refund notes (optional)'
      }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        refund: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            paymentId: { type: 'string', format: 'uuid' },
            refundAmount: { type: 'number' },
            reason: { type: 'string' },
            status: { 
              type: 'string',
              enum: ['pending', 'processing', 'completed', 'failed']
            },
            refundId: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  }
}

export default {
  createPaymentRouteSchema,
  getAllPaymentsRouteSchema,
  getPaymentByIdRouteSchema,
  updatePaymentStatusRouteSchema,
  processRefundRouteSchema
}
