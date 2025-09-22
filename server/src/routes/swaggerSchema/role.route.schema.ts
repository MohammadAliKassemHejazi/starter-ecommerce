export const createRoleRouteSchema = {
  tags: ["Role"],
  summary: "Create a new role",
  security: [{ apiKey: [] }],
  body: {
    type: 'object',
    required: ['name'],
    properties: {
      name: {
        type: 'string',
        description: 'Role name'
      },
      description: {
        type: 'string',
        description: 'Role description'
      },
      permissions: {
        type: 'array',
        items: {
          type: 'string',
          format: 'uuid'
        },
        description: 'Array of permission IDs'
      }
    }
  },
  response: {
    201: {
      type: 'object',
      properties: {
        role: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            permissions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  name: { type: 'string' }
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

export const getAllRolesRouteSchema = {
  tags: ["Role"],
  summary: "Get all roles",
  security: [{ apiKey: [] }],
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'number', minimum: 1 },
      limit: { type: 'number', minimum: 1, maximum: 100 },
      search: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        roles: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string' },
              description: { type: 'string' },
              permissions: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                    name: { type: 'string' }
                  }
                }
              },
              userCount: { type: 'number' },
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

export const getRoleByIdRouteSchema = {
  tags: ["Role"],
  summary: "Get role by ID",
  security: [{ apiKey: [] }],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Role ID'
      }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        role: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            permissions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  name: { type: 'string' },
                  description: { type: 'string' }
                }
              }
            },
            users: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  name: { type: 'string' },
                  email: { type: 'string', format: 'email' }
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

export const updateRoleRouteSchema = {
  tags: ["Role"],
  summary: "Update role",
  security: [{ apiKey: [] }],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Role ID to update'
      }
    }
  },
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      permissions: {
        type: 'array',
        items: {
          type: 'string',
          format: 'uuid'
        }
      }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        role: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            permissions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  name: { type: 'string' }
                }
              }
            },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  }
}

export const deleteRoleRouteSchema = {
  tags: ["Role"],
  summary: "Delete role",
  security: [{ apiKey: [] }],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Role ID to delete'
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

export const assignRoleToUserRouteSchema = {
  tags: ["Role"],
  summary: "Assign role to user",
  security: [{ apiKey: [] }],
  body: {
    type: 'object',
    required: ['userId', 'roleId'],
    properties: {
      userId: {
        type: 'string',
        format: 'uuid',
        description: 'User ID'
      },
      roleId: {
        type: 'string',
        format: 'uuid',
        description: 'Role ID'
      }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            roleId: { type: 'string', format: 'uuid' }
          }
        }
      }
    }
  }
}

export default {
  createRoleRouteSchema,
  getAllRolesRouteSchema,
  getRoleByIdRouteSchema,
  updateRoleRouteSchema,
  deleteRoleRouteSchema,
  assignRoleToUserRouteSchema
}
