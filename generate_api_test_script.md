# Comprehensive API Testing Script Generation Guide

This guide breaks down the creation of a massive, exhaustive Node.js script into **10 manageable steps**. The resulting script will test *every single API endpoint and flow* used by the frontend, including edge cases and configurables.

It covers Categories, Subcategories, Stores (CRUD & Images), Products (CRUD & Images), Cart & Orders, Users, Roles & Permissions, Articles & Packages, Dashboard Analytics, and Configurables (Sizes, Taxes, Shipping, Promotions, Comments, Favorites, Translations, Returns).

---

### Step 1: Create the Test File
First, open your terminal at the root of your project and create a new JavaScript file:
```bash
touch test_all_apis.js
```
Open `test_all_apis.js` in your code editor.

---

### Step 2: Add Configuration & Variables
At the top of the file, we import `fs`, configure the target API, hardcode the admin credentials, and declare state variables that will hold dynamically generated IDs (preventing 404s when updating or deleting).
```javascript
const fs = require('fs');

const API_BASE_URL = 'http://localhost:3000/api';
const OUTPUT_FILE = 'api_test_results.txt';

// Authentication credentials
const credentials = { email: 'admin@admin.com', password: '1234554321' };

// Global variables for chaining requests dynamically
let authToken = '';
let userId = 'me';
let roleId = '1';
let permissionId = '1';
let categoryId = '1';
let subCategoryId = '1';
let storeId = '1';
let productId = '1';
let sizeId = '1';
let packageId = '1';
let orderId = '1';
let articleId = '1';

// Clear or create the output text file
fs.writeFileSync(OUTPUT_FILE, 'Comprehensive API Test Results\n================================\n\n');
```

---

### Step 3: Add Logging and Helper Functions
Add a robust fetch wrapper that handles JSON logging, extracts IDs automatically on `GET` requests, and cleanly writes to our text file.
```javascript
function logResult(method, url, status, requestBody, responseBody) {
  const logEntry = `\n--------------------------------------------------\n[${new Date().toISOString()}] ${method} ${url}\nRequest Body: ${requestBody ? JSON.stringify(requestBody) : 'None'}\nResponse Status: ${status}\nResponse Body: ${JSON.stringify(responseBody, null, 2)}\n--------------------------------------------------\n`;
  console.log(`${method} ${url} - Status: ${status}`);
  fs.appendFileSync(OUTPUT_FILE, logEntry);
}

function extractDynamicIds(endpoint, method, res) {
  if (method === 'GET' && res && res.data) {
    const d = res.data;
    if (endpoint.includes('/categories') && d.length) categoryId = d[0].id || categoryId;
    if (endpoint.includes('/admin/roles') && d.length) roleId = d[0].id || roleId;
    if (endpoint.includes('/admin/permissions') && d.length) permissionId = d[0].id || permissionId;
    if (endpoint.includes('/store/getall') && d.length) storeId = d[0].id || storeId;
    if (endpoint.includes('/shop/getall') && d.length) productId = d[0].id || productId;
    if (endpoint.includes('/packages') && d.length) packageId = d[0].id || packageId;
    if (endpoint.includes('/users?createdById=me') && d.length) userId = d[0].id || userId;
    if (endpoint.includes('/articles') && d.length) articleId = d[0].id || articleId;
    if (endpoint.includes('/utile/getSizes') && d.length) sizeId = d[0].id || sizeId;
  }
}

async function makeRequest(method, endpoint, body = null, customHeaders = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = { 'Accept': 'application/json', ...customHeaders };
  if (!body || !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

  const options = { method, headers };
  if (body) options.body = (body instanceof FormData) ? body : JSON.stringify(body);

  try {
    const response = await fetch(url, options);
    const responseData = await response.json().catch(() => ({}));
    extractDynamicIds(endpoint, method, responseData);
    logResult(method, url, response.status, body instanceof FormData ? '[FormData]' : body, responseData);
    return { status: response.status, data: responseData };
  } catch (error) {
    logResult(method, url, 'ERROR', body, { error: error.message });
    return { status: 500, error: error.message };
  }
}
```

---

### Step 4: Auth, Users, Roles & Permissions
Let's begin the main execution flow `runTests()`. We will log in, hit session endpoints, and run full CRUD on Users, Roles, and Permissions, including Audit Logs (if applicable).
```javascript
async function runTests() {
  console.log(`Starting massive API tests. Output: ${OUTPUT_FILE}`);

  // --- Auth Flow ---
  console.log('\n--- Auth Flow ---');
  const loginRes = await makeRequest('POST', '/user/auth/login', credentials);
  if (loginRes.data?.data?.token) authToken = loginRes.data.data.token;
  else if (loginRes.data?.token) authToken = loginRes.data.token;

  await makeRequest('GET', '/user/auth/session');
  await makeRequest('GET', '/auth/sessions');

  // --- Users, Roles, Permissions (Full CRUD) ---
  console.log('\n--- Users, Roles & Permissions ---');
  await makeRequest('GET', '/users?createdById=me');
  await makeRequest('POST', '/users', { name: 'Test User', email: 'test_crud@example.com', password: 'password123' });
  await makeRequest('PUT', `/users/${userId}`, { name: 'Updated User Name' });

  await makeRequest('GET', '/admin/roles');
  await makeRequest('POST', '/admin/roles', { name: 'ManagerRole' });
  await makeRequest('PUT', `/admin/roles/${roleId}`, { name: 'SuperManagerRole' });

  await makeRequest('GET', '/admin/permissions');
  await makeRequest('POST', '/admin/permissions', { name: 'ManageStores' });
  await makeRequest('PUT', `/admin/permissions/${permissionId}`, { name: 'ManageAllStores' });

  // Assignments
  await makeRequest('POST', `/admin/roles/${roleId}/permissions`, { permissionId });
  await makeRequest('POST', `/users/${userId}/roles`, { roleId });
```

---

### Step 5: Categories & Subcategories (Full CRUD)
Right under the previous block, add the comprehensive tests for the taxonomic data (Categories and Subcategories).
```javascript
  // --- Categories & Subcategories ---
  console.log('\n--- Categories & Subcategories ---');
  await makeRequest('GET', '/categories');
  await makeRequest('GET', '/public/categories');
  await makeRequest('GET', '/utile/categories');
  await makeRequest('POST', '/categories', { name: 'Electronics' });
  await makeRequest('PUT', `/categories/update/${categoryId}`, { name: 'Home Electronics' });

  await makeRequest('GET', '/admin/subcategories');
  await makeRequest('GET', `/utile/getSubCategories?id=${categoryId}`);
  await makeRequest('POST', '/admin/subcategories', { name: 'TVs', categoryId });
  await makeRequest('PUT', `/admin/subcategories/update/${subCategoryId}`, { name: 'Smart TVs' });
```

---

### Step 6: Stores & Products (Full CRUD + Images)
Add the logic to create, read, update, and upload images for both Stores and Products (Shop). We'll simulate image payload endpoints.
```javascript
  // --- Stores ---
  console.log('\n--- Stores (CRUD & Images) ---');
  await makeRequest('GET', '/store/getall');
  await makeRequest('GET', '/store/getall/user');
  await makeRequest('GET', '/public/stores');
  await makeRequest('GET', `/public/stores/${storeId}`);
  await makeRequest('GET', `/store/get?id=${storeId}`);
  await makeRequest('POST', '/store/create', { name: 'Tech Store', description: 'Best tech' });
  await makeRequest('POST', '/store/update', { id: storeId, name: 'Tech Store Plus' });
  await makeRequest('PATCH', '/store/update/image', { storeId, imageUrl: 'http://example.com/store.jpg' }); // Simulated image update

  // --- Products (Shop) ---
  console.log('\n--- Products (CRUD & Images) ---');
  await makeRequest('GET', '/shop/getall');
  await makeRequest('GET', '/public/get/productListing/?page=1&pageSize=10');
  await makeRequest('GET', `/public/stores/${storeId}/products?page=1&pageSize=10`);
  await makeRequest('GET', `/public/products/${productId}`);
  await makeRequest('GET', `/shop/get?id=${productId}`);
  await makeRequest('GET', `/shop/get/storeProducts/${storeId}?page=1&pageSize=10&searchQuery=&orderBy=`);
  await makeRequest('POST', '/shop/create', { title: 'Smartphone', price: 599, storeId });
  await makeRequest('PATCH', '/shop/update', { id: productId, title: 'Smartphone Pro' });
  await makeRequest('PATCH', '/shop/update/images', { productId, images: ['http://example.com/phone.jpg'] }); // Simulated image update
```

---

### Step 7: Cart, Orders & Favorites
Now, test user cart interactions, order retrievals, and favoriting products.
```javascript
  // --- Cart & Orders ---
  console.log('\n--- Cart & Orders ---');
  await makeRequest('GET', '/cart/get');
  await makeRequest('POST', '/cart/update', { productId, quantity: 2, sizeId }); // Add item
  await makeRequest('PUT', '/cart/decrease', { productId, quantity: 1, sizeId }); // Decrease item

  await makeRequest('GET', '/admin/inventory/orders/status');
  await makeRequest('GET', '/admin/orders/last');
  await makeRequest('GET', `/admin/orders/${orderId}/items`);
  await makeRequest('POST', '/admin/orders/date-range', { startDate: '2023-01-01', endDate: '2023-12-31' });

  // --- Favorites ---
  console.log('\n--- Favorites ---');
  await makeRequest('GET', '/favorites');
  await makeRequest('POST', '/favorites', { productId });
```

---

### Step 8: Articles, Packages, Dashboard & Comments
Add full CRUD for CMS articles, subscription packages, dashboard analytics (sales, alerts), and Product Comments.
```javascript
  // --- Articles ---
  console.log('\n--- Articles & Packages ---');
  await makeRequest('GET', '/articles');
  await makeRequest('GET', '/public/articles');
  await makeRequest('GET', '/articles/get/author');
  await makeRequest('GET', `/articles/get?id=${articleId}`);
  await makeRequest('POST', '/articles/create', { title: 'Tech News', content: 'News content' });
  await makeRequest('PATCH', '/articles/update/', { id: articleId, title: 'Tech News Update' });

  // --- Packages ---
  await makeRequest('GET', '/packages');
  await makeRequest('GET', '/packages/active');
  await makeRequest('GET', '/packages/limits');
  await makeRequest('GET', `/packages?id=${packageId}`);
  await makeRequest('POST', '/packages', { name: 'Premium', price: 99 });
  await makeRequest('PATCH', '/packages/update/', { id: packageId, name: 'Premium+' });
  await makeRequest('POST', '/packages/activate', { packageId });
  await makeRequest('POST', '/packages/assign', { packageId, userId });
  await makeRequest('POST', '/payment/charge/package', { packageId });

  // --- Dashboard Analytics ---
  console.log('\n--- Dashboard Analytics ---');
  await makeRequest('GET', '/analytics?startDate=2023-01-01');
  await makeRequest('GET', '/analytics/stats?startDate=2023-01-01');
  await makeRequest('POST', '/analytics/track', { event: 'page_view' });
  await makeRequest('GET', '/admin/inventory/alerts');
  await makeRequest('GET', '/admin/inventory/sales');

  // --- Comments ---
  console.log('\n--- Comments ---');
  await makeRequest('GET', `/comments?productId=${productId}&page=1&limit=10`);
  await makeRequest('POST', '/comments/add', { productId, text: 'Great product!' });
```

---

### Step 9: Configurables (Sizes, Taxes, Translations) & Cleanup
Here we request utilities like sizes. We also simulate endpoints for Taxes, Shipping, Promotions, Translations, and Returns (which may be placeholder endpoints depending on your backend). Finally, we delete everything to clean up.
```javascript
  // --- Configurables (Sizes, Taxes, Shipping, Promo, Translations, Returns) ---
  console.log('\n--- Configurables ---');
  await makeRequest('GET', '/utile/getSizes');
  // Simulated configurables endpoints based on typical setups:
  await makeRequest('GET', '/api/taxes');
  await makeRequest('GET', '/api/shipping-methods');
  await makeRequest('GET', '/api/promotions');
  await makeRequest('GET', '/api/translations/en');
  await makeRequest('GET', '/api/returns');

  // --- Deletion (Cleanup) ---
  console.log('\n--- Cleanup (Deletions) ---');
  await makeRequest('DELETE', `/favorites/${productId}`);
  await makeRequest('DELETE', `/cart/delete/${productId}/${sizeId}`);
  await makeRequest('DELETE', '/cart/delete'); // Clear Cart

  await makeRequest('DELETE', '/shop/delete/image/');
  await makeRequest('DELETE', '/shop/delete/', { id: productId }); // Assuming body/query
  await makeRequest('DELETE', '/store/delete/image/');
  await makeRequest('DELETE', '/store/delete/', { id: storeId });

  await makeRequest('DELETE', `/admin/roles/${roleId}/permissions/${permissionId}`);
  await makeRequest('DELETE', `/users/${userId}/roles/${roleId}`);
  await makeRequest('DELETE', `/admin/permissions/${permissionId}`);
  await makeRequest('DELETE', `/admin/roles/${roleId}`);

  await makeRequest('DELETE', `/admin/subcategories/delete/${subCategoryId}`);
  await makeRequest('DELETE', `/categories/delete/${categoryId}`);

  await makeRequest('DELETE', `/packages/${packageId}`);
  await makeRequest('DELETE', `/articles/delete/`, { id: articleId });
  await makeRequest('DELETE', `/users/${userId}`);

  // Logout
  await makeRequest('POST', '/user/auth/logout');
  console.log(`\nTests finished. See ${OUTPUT_FILE} for full details.`);
}

// Execute the test script
runTests();
```

---

### Step 10: Run the Script and View Results
Ensure your backend server is actively running on port 3000.
In your terminal, execute the script you just built:
```bash
node test_all_apis.js
```

Once the script finishes executing, open the newly created `api_test_results.txt` file in your editor. You will see a detailed log of every request method, URL, payload, and the raw server response for every single flow!
