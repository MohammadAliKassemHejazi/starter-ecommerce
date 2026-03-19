# API Testing Script Generation Guide

This guide provides steps to create and run a comprehensive Node.js script that tests all API endpoints used by the frontend. The script authenticates using the provided admin credentials (`admin@admin.com` / `1234554321`), tests all flows, and logs the requests and responses to a text file.

## Prerequisites

- Ensure you have Node.js installed.
- Ensure the backend server is running locally (typically on `http://localhost:3000`).

## Step 1: Create the Test Script

Create a new file named `test_all_apis.js` in the root of your project:

```bash
touch test_all_apis.js
```

## Step 2: Add the Script Content

Copy and paste the following code into `test_all_apis.js`. This script uses the built-in `fetch` API (available in Node.js 18+) to sequentially call every API endpoint extracted from the frontend source code.

```javascript
const fs = require('fs');

const API_BASE_URL = 'http://localhost:3000/api';
const LOCAL_API_BASE_URL = 'http://localhost:3000/api'; // Or your next.js local API if applicable
const OUTPUT_FILE = 'api_test_results.txt';

// Credentials provided for testing
const credentials = {
  email: 'admin@admin.com',
  password: '1234554321'
};

// Global variables to store dynamically generated IDs for dependent requests
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

// Initialize output file
fs.writeFileSync(OUTPUT_FILE, 'API Test Results\n================\n\n');

function logResult(method, url, status, requestBody, responseBody) {
  const logEntry = `
--------------------------------------------------
[${new Date().toISOString()}] ${method} ${url}
Request Body: ${requestBody ? JSON.stringify(requestBody) : 'None'}
Response Status: ${status}
Response Body: ${JSON.stringify(responseBody, null, 2)}
--------------------------------------------------
`;
  console.log(`${method} ${url} - Status: ${status}`);
  fs.appendFileSync(OUTPUT_FILE, logEntry);
}

async function makeRequest(method, endpoint, body = null, isAuth = false) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const responseData = await response.json().catch(() => ({}));

    // Attempt to extract dynamic IDs if possible to use in subsequent requests
    extractDynamicIds(endpoint, method, responseData);

    logResult(method, url, response.status, body, responseData);
    return { status: response.status, data: responseData };
  } catch (error) {
    logResult(method, url, 'ERROR', body, { error: error.message });
    return { status: 500, error: error.message };
  }
}

// Very basic extraction of IDs for subsequent requests to prevent 404s
function extractDynamicIds(endpoint, method, responseData) {
  if (method === 'GET' && responseData && responseData.data) {
    const data = responseData.data;
    if (endpoint === '/categories' && Array.isArray(data) && data.length > 0) categoryId = data[0].id || categoryId;
    if (endpoint === '/admin/roles' && Array.isArray(data) && data.length > 0) roleId = data[0].id || roleId;
    if (endpoint === '/admin/permissions' && Array.isArray(data) && data.length > 0) permissionId = data[0].id || permissionId;
    if (endpoint === '/store/getall' && Array.isArray(data) && data.length > 0) storeId = data[0].id || storeId;
    if (endpoint === '/shop/getall' && Array.isArray(data) && data.length > 0) productId = data[0].id || productId;
    if (endpoint === '/packages' && Array.isArray(data) && data.length > 0) packageId = data[0].id || packageId;
    if (endpoint === '/users?createdById=me' && Array.isArray(data) && data.length > 0) userId = data[0].id || userId;
  }
}

async function runTests() {
  console.log('Starting API tests...');
  console.log(`Results will be written to ${OUTPUT_FILE}`);

  // 1. Authentication Flow
  console.log('\n--- Running Authentication Flow ---');
  const loginRes = await makeRequest('POST', '/user/auth/login', credentials);
  if (loginRes.data && loginRes.data.data && loginRes.data.data.token) {
    authToken = loginRes.data.data.token;
  } else if (loginRes.data && loginRes.data.token) { // Fallback based on API structure
    authToken = loginRes.data.token;
  }

  await makeRequest('GET', '/user/auth/session');
  await makeRequest('GET', '/auth/sessions');
  // Wait to test logout until the very end

  // 2. User & Admin Flows
  console.log('\n--- Running User & Admin Flows ---');
  await makeRequest('GET', '/users?createdById=me');
  await makeRequest('POST', '/users', { name: 'Test User', email: 'test_create@example.com', password: 'password123' });
  await makeRequest('PUT', `/users/${userId}`, { name: 'Updated User' });

  // Roles & Permissions
  await makeRequest('GET', '/admin/roles');
  await makeRequest('POST', '/admin/roles', { name: 'TestRole' });
  await makeRequest('PUT', `/admin/roles/${roleId}`, { name: 'UpdatedRole' });
  await makeRequest('GET', '/admin/permissions');
  await makeRequest('POST', '/admin/permissions', { name: 'TestPermission' });
  await makeRequest('PUT', `/admin/permissions/${permissionId}`, { name: 'UpdatedPermission' });
  await makeRequest('POST', `/admin/roles/${roleId}/permissions`, { permissionId });
  await makeRequest('POST', `/users/${userId}/roles`, { roleId });

  // 3. Store & Shop Flows
  console.log('\n--- Running Store & Shop Flows ---');
  await makeRequest('GET', '/store/getall');
  await makeRequest('GET', '/public/stores');
  await makeRequest('GET', '/store/getall/user');
  await makeRequest('GET', `/public/stores/${storeId}`);
  await makeRequest('GET', `/store/get?id=${storeId}`);
  await makeRequest('POST', '/store/create', { name: 'Test Store', description: 'Test Desc' });
  await makeRequest('POST', '/store/update', { id: storeId, name: 'Updated Store' });

  await makeRequest('GET', '/shop/getall');
  await makeRequest('GET', `/public/products/${productId}`);
  await makeRequest('GET', `/shop/get?id=${productId}`);
  await makeRequest('GET', '/public/get/productListing/?page=1&pageSize=10');
  await makeRequest('GET', `/public/stores/${storeId}/products?page=1&pageSize=10`);
  await makeRequest('GET', `/shop/get/storeProducts/${storeId}?page=1&pageSize=10&searchQuery=&orderBy=`);
  await makeRequest('POST', '/shop/create', { title: 'Test Product', price: 100, storeId });
  await makeRequest('PATCH', '/shop/update', { id: productId, title: 'Updated Product' });

  // 4. Categories & SubCategories Flows
  console.log('\n--- Running Category Flows ---');
  await makeRequest('GET', '/categories');
  await makeRequest('GET', '/public/categories');
  await makeRequest('GET', '/utile/categories');
  await makeRequest('POST', '/categories', { name: 'Test Category' });
  await makeRequest('PUT', `/categories/update/${categoryId}`, { name: 'Updated Category' });

  await makeRequest('GET', '/admin/subcategories');
  await makeRequest('GET', `/utile/getSubCategories?id=${categoryId}`);
  await makeRequest('POST', '/admin/subcategories', { name: 'Test SubCat', categoryId });
  await makeRequest('PUT', `/admin/subcategories/update/${subCategoryId}`, { name: 'Updated SubCat' });

  // 5. Cart, Favorites, & Orders Flows
  console.log('\n--- Running Cart & Favorites Flows ---');
  await makeRequest('GET', '/cart/get');
  await makeRequest('POST', '/cart/update', { productId, quantity: 1, sizeId });
  await makeRequest('PUT', '/cart/decrease', { productId, quantity: 1, sizeId });

  await makeRequest('GET', '/favorites');
  await makeRequest('POST', '/favorites', { productId });

  await makeRequest('GET', '/admin/inventory/orders/status');
  await makeRequest('GET', `/admin/orders/${orderId}/items`);
  await makeRequest('GET', '/admin/orders/last');
  await makeRequest('POST', '/admin/orders/date-range', { startDate: '2023-01-01', endDate: '2023-12-31' });

  // 6. Packages & Payments Flows
  console.log('\n--- Running Packages & Payments Flows ---');
  await makeRequest('GET', '/packages');
  await makeRequest('GET', '/packages/active');
  await makeRequest('GET', '/packages/limits');
  await makeRequest('GET', `/packages?id=${packageId}`);
  await makeRequest('POST', '/packages', { name: 'Test Package', price: 50 });
  await makeRequest('PATCH', '/packages/update/', { id: packageId, name: 'Updated Package' });
  await makeRequest('POST', '/packages/activate', { packageId });
  await makeRequest('POST', '/packages/assign', { packageId, userId });

  await makeRequest('POST', '/payment/charge', { amount: 100 });
  await makeRequest('POST', '/payment/charge/package', { packageId });
  // PayPal endpoints are external fetches, but listed if they are local proxies
  await makeRequest('POST', '/paypal/create-order', { amount: 100 });

  // 7. Analytics & Articles Flows
  console.log('\n--- Running Analytics & Articles Flows ---');
  await makeRequest('GET', '/analytics?startDate=2023-01-01');
  await makeRequest('GET', '/analytics/stats?startDate=2023-01-01');
  await makeRequest('POST', '/analytics/track', { event: 'test_event' });
  await makeRequest('GET', '/admin/inventory/alerts');
  await makeRequest('GET', '/admin/inventory/sales');

  await makeRequest('GET', '/articles');
  await makeRequest('GET', '/public/articles');
  await makeRequest('GET', '/articles/get/author');
  await makeRequest('GET', `/articles/get?id=1`);
  await makeRequest('POST', '/articles/create', { title: 'Test Article', content: 'Content' });
  await makeRequest('PATCH', '/articles/update/', { id: '1', title: 'Updated Article' });

  await makeRequest('GET', `/comments?productId=${productId}&page=1&limit=10`);
  await makeRequest('POST', '/comments/add', { productId, text: 'Test Comment' });

  await makeRequest('GET', '/utile/getSizes');

  // 8. Deletion Flows (Cleanup)
  console.log('\n--- Running Deletion Flows ---');
  await makeRequest('DELETE', `/favorites/${productId}`);
  await makeRequest('DELETE', `/cart/delete/${productId}/${sizeId}`);
  await makeRequest('DELETE', '/cart/delete');

  await makeRequest('DELETE', `/admin/roles/${roleId}/permissions/${permissionId}`);
  await makeRequest('DELETE', `/users/${userId}/roles/${roleId}`);
  await makeRequest('DELETE', `/admin/permissions/${permissionId}`);
  await makeRequest('DELETE', `/admin/roles/${roleId}`);

  await makeRequest('DELETE', `/admin/subcategories/delete/${subCategoryId}`);
  await makeRequest('DELETE', `/categories/delete/${categoryId}`);

  await makeRequest('DELETE', `/packages/${packageId}`);
  await makeRequest('DELETE', `/articles/delete/`); // Requires ID in body or query typically
  await makeRequest('DELETE', `/store/delete/`); // Requires ID in body typically
  await makeRequest('DELETE', `/shop/delete/`); // Requires ID in body typically
  await makeRequest('DELETE', `/users/${userId}`);

  // Finally, Logout
  console.log('\n--- Running Logout Flow ---');
  await makeRequest('POST', '/user/auth/logout');
  await makeRequest('POST', '/user/auth/register', { name: 'New User', email: `test_${Date.now()}@example.com`, password: 'password123' });

  console.log('\nAPI tests completed. Check api_test_results.txt for details.');
}

runTests();
```

## Step 3: Run the Script

Ensure your server is running (e.g., `npm run dev` in the `/server` folder) on port `3000`.
Then, execute the test script:

```bash
node test_all_apis.js
```

## Step 4: Review the Results

Open the generated `api_test_results.txt` file in your root directory. It contains the detailed Request URL, Method, Body, Response Status, and Response Body for every API call made.
