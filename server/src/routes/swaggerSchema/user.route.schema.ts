export const createUserRouteSchema = {
  tags: ["User"],
  summary: "Create a new user",
  security: [{ apiKey: [] }],
  body: {
    type: 'object',
    required: ['email', 'password', 'name'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        description: 'User email'
      },
      password: {
        type: 'string',
        minLength: 6,
        description: 'User password'
      },
      name: {
        type: 'string',
        description: 'User name'
      },
      surname: {
        type: 'string',
        description: 'User surname'
      },
      phone: {
        type: 'string',
        description: 'User phone number'
      },
      address: {
        type: 'string',
        description: 'User address'
      },
      roleId: {
        type: 'string',
        format: 'uuid',
        description: 'User role ID'
      }
    }
  },
  response: {
    201: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            surname: { type: 'string' },
            phone: { type: 'string' },
            address: { type: 'string' },
            roleId: { type: 'string', format: 'uuid' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  }
}

export const getAllUsersRouteSchema = {
  tags: ["User"],
  summary: "Get all users",
  security: [{ apiKey: [] }],
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'number', minimum: 1 },
      limit: { type: 'number', minimum: 1, maximum: 100 },
      roleId: { type: 'string', format: 'uuid' },
      search: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        users: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              email: { type: 'string', format: 'email' },
              name: { type: 'string' },
              surname: { type: 'string' },
              phone: { type: 'string' },
              address: { type: 'string' },
              roleId: { type: 'string', format: 'uuid' },
              role: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  name: { type: 'string' }
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

export const getUserByIdRouteSchema = {
  tags: ["User"],
  summary: "Get user by ID",
  security: [{ apiKey: [] }],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'User ID'
      }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            surname: { type: 'string' },
            phone: { type: 'string' },
            address: { type: 'string' },
            roleId: { type: 'string', format: 'uuid' },
            role: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                name: { type: 'string' },
                permissions: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      name: { type: 'string' }
                    }
                  }
                }
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

export const updateUserRouteSchema = {
  tags: ["User"],
  summary: "Update user",
  security: [{ apiKey: [] }],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'User ID to update'
      }
    }
  },
  body: {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
      name: { type: 'string' },
      surname: { type: 'string' },
      phone: { type: 'string' },
      address: { type: 'string' },
      roleId: { type: 'string', format: 'uuid' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            surname: { type: 'string' },
            phone: { type: 'string' },
            address: { type: 'string' },
            roleId: { type: 'string', format: 'uuid' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  }
}

export const deleteUserRouteSchema = {
  tags: ["User"],
  summary: "Delete user",
  security: [{ apiKey: [] }],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'User ID to delete'
      }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        deleted: { type: 'boolean' }
      }
    }
  }
}

export const getUserProfileRouteSchema = {
  tags: ["User"],
  summary: "Get current user profile",
  security: [{ apiKey: [] }],
  response: {
    200: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            surname: { type: 'string' },
            phone: { type: 'string' },
            address: { type: 'string' },
            roleId: { type: 'string', format: 'uuid' },
            role: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                name: { type: 'string' }
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

export default {
  createUserRouteSchema,
  getAllUsersRouteSchema,
  getUserByIdRouteSchema,
  updateUserRouteSchema,
  deleteUserRouteSchema,
  getUserProfileRouteSchema
}
