# When Next.js router changes, it updates the query object if dynamic.
# Here we have [router.isReady, router.query].
# Could `loadUserPackage()` updating state cause a re-render, which changes `router.query` reference?
# In Next.js, router object properties like router.query can change if you push, but usually not on re-render.
# But wait, in `client/pages/roles/Assignment/index.tsx`, the user also said "roles page iam having infinite called to backend".
# The user meant `client/pages/roles/index.tsx`. Let's check `client/pages/roles/index.tsx` `useEffect`.
