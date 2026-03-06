const fs = require('fs');
const path = require('path');

const ROUTES_DIR = path.join(__dirname, 'server/src/routes');
const DOC_PATH = path.join(__dirname, 'API-Endpoint-Testing-Documentation.md');

function extractRoutes(content) {
  const routes = [];
  const regex = /router\.(get|post|put|patch|delete)\(\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    routes.push({ method: match[1].toUpperCase(), path: match[2] });
  }
  return routes;
}

function scanRoutesDir() {
  const files = fs.readdirSync(ROUTES_DIR).filter(file => file.endsWith('.ts'));
  const allRoutes = {};

  for (const file of files) {
    const filePath = path.join(ROUTES_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const routes = extractRoutes(content);
    if (routes.length > 0) {
        allRoutes[file] = routes;
    }
  }
  return allRoutes;
}

function getPrefix(fileName) {
   switch (fileName) {
       case 'store.route.ts': return '/api/store';
       case 'shop.route.ts': return '/api/shop';
       case 'order.route.ts': return '/api/orders';
       case 'category.route.ts': return '/api/categories';
       case 'user.route.ts': return '/api/user';
       case 'users.route.ts': return '/api/users';
       case 'article.route.ts': return '/api/articles';
       case 'package.route.ts': return '/api/packages';
       case 'public.route.ts': return '/api/public';
       case 'cart.route.ts': return '/api/cart';
       case 'auth.route.ts': return '/api/auth';
       default: return '';
   }
}

function main() {
  const foundRoutes = scanRoutesDir();
  let docContent = fs.readFileSync(DOC_PATH, 'utf-8');

  let updated = false;

  for (const [file, routes] of Object.entries(foundRoutes)) {
      const prefix = getPrefix(file);
      for (const route of routes) {
          const fullPath = `${prefix}${route.path}`.replace(/\/+/g, '/').replace(/\/$/, '');
          const searchPattern = new RegExp(`\\[ \\] ${route.method} ${fullPath} `);
          const replacePattern = `[x] ${route.method} ${fullPath} `;

          if (docContent.match(searchPattern)) {
              docContent = docContent.replace(searchPattern, replacePattern);
              console.log(`Updated: ${route.method} ${fullPath}`);
              updated = true;
          }
      }
  }

  if (updated) {
      fs.writeFileSync(DOC_PATH, docContent, 'utf-8');
      console.log('API-Endpoint-Testing-Documentation.md updated.');
  } else {
      console.log('No updates needed.');
  }
}

main();