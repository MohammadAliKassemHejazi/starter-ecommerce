export default {
  favoritesRouteSchema: {
    get: {
      tags: ['Favorites'],
      summary: 'Get user favorites',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Successfully retrieved favorites',
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
                        product: {
                          type: 'object',
                          properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            price: { type: 'number' },
                            description: { type: 'string' },
                            images: {
                              type: 'array',
                              items: { type: 'string' }
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
      }
    },
    post: {
      tags: ['Favorites'],
      summary: 'Add product to favorites',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['productId'],
              properties: {
                productId: { type: 'string', format: 'uuid' }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Product added to favorites successfully'
        }
      }
    },
    delete: {
      tags: ['Favorites'],
      summary: 'Remove product from favorites',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'productId',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' }
        }
      ],
      responses: {
        200: {
          description: 'Product removed from favorites successfully'
        }
      }
    }
  }
};
