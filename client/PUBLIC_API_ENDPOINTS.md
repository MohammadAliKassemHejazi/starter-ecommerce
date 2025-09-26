# Public API Endpoints Documentation

This document outlines the public API endpoints that need to be implemented on the backend to support the public home page functionality.

## Overview

The home page now uses public APIs that don't require authentication, allowing all users (including anonymous visitors) to view stores and products.

## Required Public Endpoints

### 1. Get Public Stores
```
GET /public/stores
```
**Description**: Get all active stores for public display
**Authentication**: None required
**Response**: 
```json
{
  "success": true,
  "message": "Stores retrieved successfully",
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "imgUrl": "string",
      "categoryId": "string",
      "isActive": true,
      "createdAt": "string",
      "Category": {
        "id": "string",
        "name": "string"
      }
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### 2. Get Public Products
```
GET /public/products?page=1&pageSize=10
```
**Description**: Get paginated list of active products for public display
**Authentication**: None required
**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 10)

**Response**:
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": 100,
      "originalPrice": 120,
      "discount": 20,
      "stockQuantity": 50,
      "isActive": true,
      "ratings": 4.5,
      "commentsCount": 25,
      "createdAt": "string",
      "updatedAt": "string",
      "ProductImages": [
        {
          "id": "string",
          "url": "string",
          "alt": "string"
        }
      ],
      "Store": {
        "id": "string",
        "name": "string"
      },
      "Category": {
        "id": "string",
        "name": "string"
      },
      "Subcategory": {
        "id": "string",
        "name": "string"
      }
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### 3. Get Public Categories
```
GET /public/categories
```
**Description**: Get all active categories for public navigation
**Authentication**: None required
**Response**:
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "isActive": true,
      "createdAt": "string",
      "Subcategories": [
        {
          "id": "string",
          "name": "string",
          "description": "string",
          "isActive": true
        }
      ]
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### 4. Get Public Product by ID
```
GET /public/products/:id
```
**Description**: Get a specific product by ID for public viewing
**Authentication**: None required
**Response**: Same as single product in the products list

### 5. Get Public Products by Store
```
GET /public/stores/:storeId/products?page=1&pageSize=10
```
**Description**: Get products for a specific store
**Authentication**: None required
**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 10)

**Response**: Same as products list

### 6. Get Public Store by ID
```
GET /public/stores/:id
```
**Description**: Get a specific store by ID for public viewing
**Authentication**: None required
**Response**: Same as single store in the stores list

## Implementation Notes

### Security Considerations
1. **Data Filtering**: Only return active stores and products (`isActive: true`)
2. **Sensitive Data**: Exclude sensitive information like:
   - User IDs of store owners
   - Internal pricing data
   - Admin-only fields
3. **Rate Limiting**: Implement rate limiting to prevent abuse
4. **Caching**: Consider caching public data for better performance

### Data Privacy
- Don't expose user personal information
- Only show public store information
- Filter out inactive or deleted content

### Performance
- Implement pagination for all list endpoints
- Use database indexes on frequently queried fields
- Consider implementing caching for public data

## Frontend Integration

The frontend has been updated to use these public endpoints:

1. **Home Page**: Now public and accessible to all users
2. **Product List**: Uses public product API with infinite scroll
3. **Store Display**: Uses public store API for bubble animation
4. **Favorites**: Gracefully handles non-authenticated users

## Migration Steps

1. Implement the public API endpoints on the backend
2. Test the endpoints with the updated frontend
3. Update any existing authentication middleware to allow public access
4. Consider implementing caching for better performance
5. Monitor usage and adjust rate limiting as needed

## Testing

Test the following scenarios:
1. Anonymous user can view home page
2. Anonymous user can browse products
3. Anonymous user can view store information
4. Authenticated users still have full functionality
5. Rate limiting works correctly
6. Data filtering works (only active content shown)
