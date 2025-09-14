export default {
  returnsRouteSchema: {
    get: {
      tags: ['Returns'],
      summary: 'Get return requests',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Successfully retrieved return requests',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        reason: { type: 'string' },
                        status: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED'] },
                        refundAmount: { type: 'number' },
                        resolutionNote: { type: 'string' },
                        order: {
                          type: 'object',
                          properties: {
                            id: { type: 'string' },
                            orderNumber: { type: 'string' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    post: {
      tags: ['Returns'],
      summary: 'Create return request',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['orderId', 'reason'],
              properties: {
                orderId: { type: 'string', format: 'uuid' },
                reason: { type: 'string' },
                refundAmount: { type: 'number' }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Return request created successfully'
        }
      }
    },
    put: {
      tags: ['Returns'],
      summary: 'Update return request status',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' }
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED'] },
                resolutionNote: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Return request updated successfully'
        }
      }
    }
  }
};
