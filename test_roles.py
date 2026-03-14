import re

with open('client/pages/roles/index.tsx', 'r') as f:
    content = f.read()

# Make sure we commented editPath and deleteAction earlier, wait! My previous command was `sed -i 's|editPath="/roles/edit"|// editPath="/roles/edit"|g'`. Let's run it again, as `index.tsx` seems unmodified in the `run_in_bash_session` output (it still has `editPath="/roles/edit"`).

content = content.replace('editPath="/roles/edit"', '// editPath="/roles/edit"')
content = content.replace('deleteAction={handleDeleteRole}', '// deleteAction={handleDeleteRole}')

with open('client/pages/roles/index.tsx', 'w') as f:
    f.write(content)
