import re

with open('server/src/services/role.service.ts', 'r') as f:
    content = f.read()

new_content = content.replace(
    'const roles = await db.Role.findAll();',
    'const roles = await db.Role.findAll({ include: [{ model: db.Permission, as: "permissions", through: { attributes: [] } }] });'
)

with open('server/src/services/role.service.ts', 'w') as f:
    f.write(new_content)
