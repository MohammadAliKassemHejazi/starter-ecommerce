import re

with open('client/pages/roles/edit.tsx', 'r') as f:
    content = f.read()

# in edit.tsx, `loadUserPackage` modifies `isSuperAdmin` state. `useEffect` depends on `[router.isReady, router.query]`.
# If router.query updates when state changes? No, Next.js router.query does not update.
