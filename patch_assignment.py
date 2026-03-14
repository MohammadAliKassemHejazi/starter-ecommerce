import re

with open('client/pages/roles/Assignment/index.tsx', 'r') as f:
    content = f.read()

# wait, loadUserPackage() inside Assignment/index.tsx doesn't have it as a dependency, so it's fine.
# Let's fix edit.tsx loadUserPackage dependency warning
new_content = content.replace(
    '  React.useEffect(() => {\n    dispatch(fetchPermissions());\n    dispatch(fetchRoles());\n    loadUserPackage();\n  }, [dispatch]);',
    '  React.useEffect(() => {\n    dispatch(fetchPermissions());\n    dispatch(fetchRoles());\n    loadUserPackage();\n    // eslint-disable-next-line react-hooks/exhaustive-deps\n  }, [dispatch]);'
)

with open('client/pages/roles/Assignment/index.tsx', 'w') as f:
    f.write(new_content)
