export default {
  packagesRouteSchema: {
    get: {
      tags: ['Packages'],
      summary: 'Get all packages',
      responses: {
        200: {
          description: 'Successfully retrieved packages',
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
                        name: { type: 'string' },
                        description: { type: 'string' },
                        storeLimit: { type: 'number' },
                        categoryLimit: { type: 'number' },
                        price: { type: 'number' }
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
      tags: ['Packages'],
      summary: 'Create new package',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name', 'storeLimit', 'categoryLimit'],
              properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                storeLimit: { type: 'number' },
                categoryLimit: { type: 'number' },
                price: { type: 'number' }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Package created successfully'
        }
      }
    },
    put: {
      tags: ['Packages'],
      summary: 'Update package',
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
                name: { type: 'string' },
                description: { type: 'string' },
                storeLimit: { type: 'number' },
                categoryLimit: { type: 'number' },
                price: { type: 'number' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Package updated successfully'
        }
      }
    },
    delete: {
      tags: ['Packages'],
      summary: 'Delete package',
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
          description: 'Package deleted successfully'
        }
      }
    }
  }
};
