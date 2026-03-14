import re

with open('client/pages/roles/index.tsx', 'r') as f:
    content = f.read()

# Make sure roles mapping isn't causing re-renders because `roles` is creating a new array.
# Roles is passed to `data={roles || []}`
