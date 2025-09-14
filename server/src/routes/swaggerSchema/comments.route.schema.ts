export default {
  commentsRouteSchema: {
    get: {
      tags: ['Comments'],
      summary: 'Get product comments',
      parameters: [
        {
          name: 'productId',
          in: 'query',
          required: true,
          schema: { type: 'string', format: 'uuid' }
        }
      ],
      responses: {
        200: {
          description: 'Successfully retrieved comments',
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
                        text: { type: 'string' },
                        rating: { type: 'number', minimum: 1, maximum: 5 },
                        user: {
                          type: 'object',
                          properties: {
                            id: { type: 'string' },
                            name: { type: 'string' }
                          }
                        },
                        createdAt: { type: 'string', format: 'date-time' }
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
      tags: ['Comments'],
      summary: 'Add comment to product',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['productId', 'text', 'rating'],
              properties: {
                productId: { type: 'string', format: 'uuid' },
                text: { type: 'string' },
                rating: { type: 'number', minimum: 1, maximum: 5 }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Comment added successfully'
        }
      }
    },
    put: {
      tags: ['Comments'],
      summary: 'Update comment',
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
                text: { type: 'string' },
                rating: { type: 'number', minimum: 1, maximum: 5 }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Comment updated successfully'
        }
      }
    },
    delete: {
      tags: ['Comments'],
      summary: 'Delete comment',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' }
        }
      ],
      responses: {
        200: {
          description: 'Comment deleted successfully'
        }
      }
    }
  }
};
