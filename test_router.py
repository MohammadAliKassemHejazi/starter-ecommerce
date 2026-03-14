import re

with open('client/pages/roles/edit.tsx', 'r') as f:
    content = f.read()

# in edit.tsx:
new_content = content.replace(
    '  }, [router.isReady, router.query]);',
    '    // eslint-disable-next-line react-hooks/exhaustive-deps\n  }, [router.isReady, router.query]);'
)

with open('client/pages/roles/edit.tsx', 'w') as f:
    f.write(new_content)

with open('client/pages/roles/create.tsx', 'r') as f:
    content = f.read()

new_content = content.replace(
    '  useEffect(() => {\n    loadUserPackage();\n  }, []);',
    '  useEffect(() => {\n    loadUserPackage();\n    // eslint-disable-next-line react-hooks/exhaustive-deps\n  }, []);'
)
with open('client/pages/roles/create.tsx', 'w') as f:
    f.write(new_content)
