export default {
  promotionsRouteSchema: {
    get: {
      tags: ['Promotions'],
      summary: 'Get all promotions',
      responses: {
        200: {
          description: 'Successfully retrieved promotions',
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
                        code: { type: 'string' },
                        type: { type: 'string', enum: ['PERCENTAGE', 'FIXED'] },
                        value: { type: 'number' },
                        minCartValue: { type: 'number' },
                        validFrom: { type: 'string', format: 'date-time' },
                        validTo: { type: 'string', format: 'date-time' }
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
      tags: ['Promotions'],
      summary: 'Create new promotion',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['code', 'type', 'value'],
              properties: {
                code: { type: 'string' },
                type: { type: 'string', enum: ['PERCENTAGE', 'FIXED'] },
                value: { type: 'number' },
                minCartValue: { type: 'number' },
                validFrom: { type: 'string', format: 'date-time' },
                validTo: { type: 'string', format: 'date-time' }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Promotion created successfully'
        }
      }
    },
    put: {
      tags: ['Promotions'],
      summary: 'Update promotion',
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
                code: { type: 'string' },
                type: { type: 'string', enum: ['PERCENTAGE', 'FIXED'] },
                value: { type: 'number' },
                minCartValue: { type: 'number' },
                validFrom: { type: 'string', format: 'date-time' },
                validTo: { type: 'string', format: 'date-time' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Promotion updated successfully'
        }
      }
    },
    delete: {
      tags: ['Promotions'],
      summary: 'Delete promotion',
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
          description: 'Promotion deleted successfully'
        }
      }
    }
  }
};
