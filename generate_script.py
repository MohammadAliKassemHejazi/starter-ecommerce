import re

with open('generate_api_test_script.md', 'r') as f:
    content = f.read()

code_blocks = re.findall(r'```javascript\n(.*?)```', content, re.DOTALL)

with open('test_all_apis.js', 'w') as f:
    for block in code_blocks:
        f.write(block)
        f.write('\n')
