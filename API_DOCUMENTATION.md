# Sutreya API Documentation

Base URL: `http://localhost:8080/api/v1`
Production: `https://your-backend.railway.app/api/v1`

## Authentication

All admin endpoints require JWT authentication via Supabase.

```
Authorization: Bearer <supabase-jwt-token>
```

---

## Public Endpoints

### List Products
```http
GET /products
```

**Query Parameters:**
- `category` (optional) - Filter by category
- `search` (optional) - Search by product name
- `page` (default: 0) - Page number
- `size` (default: 20) - Items per page
- `sort` (default: "createdAt,desc") - Sort field and direction

**Response:**
```json
{
  "content": [
    {
      "id": "uuid",
      "name": "Handmade Pottery Bowl",
      "slug": "handmade-pottery-bowl-abc123",
      "description": "Beautiful ceramic bowl...",
      "price": 45.00,
      "inventoryQuantity": 10,
      "images": "[\"url1\", \"url2\"]"
    }
  ],
  "totalElements": 100,
  "totalPages": 5,
  "number": 0,
  "size": 20
}
```

### Get Product by Slug
```http
GET /products/{slug}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Handmade Pottery Bowl",
  "slug": "handmade-pottery-bowl-abc123",
  "description": "Beautiful ceramic bowl made with love...",
  "price": 45.00,
  "compareAtPrice": 60.00,
  "inventoryQuantity": 10,
  "images": "[\"url1\", \"url2\"]"
}
```

---

## Admin Endpoints (Authenticated)

### Create Product
```http
POST /admin/products
```

**Request Body:**
```json
{
  "sellerId": "uuid",
  "name": "Handmade Pottery Bowl",
  "description": "Beautiful ceramic bowl...",
  "shortDescription": "Ceramic bowl",
  "price": 45.00,
  "compareAtPrice": 60.00,
  "inventoryQuantity": 10,
  "type": "PHYSICAL",
  "processingDays": 5,
  "materials": "Clay, glaze",
  "customizationAvailable": true
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "name": "Handmade Pottery Bowl",
  "slug": "handmade-pottery-bowl-abc123",
  "price": 45.00,
  "inventoryQuantity": 10
}
```

### Update Product
```http
PUT /admin/products/{id}
```

**Request Body:** Same as Create Product

**Response:** `200 OK`

### Delete Product (Soft Delete)
```http
DELETE /admin/products/{id}
```

**Response:** `204 No Content`

### Upload Product Media
```http
POST /admin/products/{id}/media
```

**Content-Type:** `multipart/form-data`

**Form Data:**
- `files` - Array of image/video files (max 5 per request)

**Response:**
```json
[
  "https://storage.supabase.co/products/uuid/image1.jpg",
  "https://storage.supabase.co/products/uuid/image2.jpg"
]
```

### List Seller Products
```http
GET /admin/products?sellerId={uuid}&page=0&size=20
```

**Response:** Paginated product list

---

## Analytics Endpoints

### Dashboard Metrics
```http
GET /admin/analytics/dashboard?sellerId={uuid}
```

**Response:**
```json
{
  "totalRevenue": 12450.00,
  "totalOrders": 87,
  "totalProducts": 24,
  "lowStockItems": 3,
  "topProducts": [
    {
      "name": "Handmade Pottery Bowl",
      "sales": 45,
      "revenue": 2250.00
    }
  ]
}
```

### Product Performance
```http
GET /admin/analytics/products/performance?sellerId={uuid}
```

**Response:**
```json
[
  {
    "productId": "uuid",
    "views": 1250,
    "conversionRate": 3.2,
    "revenue": 5600.00
  }
]
```

---

## WebSocket Endpoints

### Connect to WebSocket
```javascript
const socket = new SockJS('http://localhost:8080/ws');
const stompClient = Stomp.over(socket);

stompClient.connect({}, () => {
  console.log('Connected to WebSocket');
});
```

### Subscribe to Inventory Updates
```javascript
stompClient.subscribe('/topic/products/{productId}/inventory', (message) => {
  const update = JSON.parse(message.body);
  console.log('Inventory update:', update);
});
```

**Message Format:**
```json
{
  "productId": "uuid",
  "available": 15,
  "status": "IN_STOCK"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/v1/admin/products"
}
```

### 401 Unauthorized
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 401,
  "error": "Unauthorized",
  "message": "JWT token is missing or invalid"
}
```

### 404 Not Found
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Product not found"
}
```

### 500 Internal Server Error
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 500,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

---

## Rate Limits

- Public endpoints: 100 requests/minute
- Admin endpoints: 1000 requests/minute
- Media upload: 10 requests/minute

---

## Data Models

### Product
```typescript
interface Product {
  id: string;
  sellerId: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  inventoryQuantity: number;
  images: string; // JSON array
  type: 'PHYSICAL' | 'DIGITAL' | 'MADE_TO_ORDER';
  isActive: boolean;
  isFeatured: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}
```

### ProductVariant
```typescript
interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  name: string;
  price: number;
  inventoryQuantity: number;
  options: object; // JSON
  imageUrl?: string;
  createdAt: string;
}
```

### HandmadeAttributes
```typescript
interface HandmadeAttributes {
  processingDays: number;
  materials: string;
  customizationAvailable: boolean;
  customizationOptions?: string;
}
```

---

## Testing with cURL

### Create Product
```bash
curl -X POST http://localhost:8080/api/v1/admin/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sellerId": "user-uuid",
    "name": "Test Product",
    "description": "Test description",
    "price": 29.99,
    "inventoryQuantity": 5,
    "type": "PHYSICAL"
  }'
```

### Upload Images
```bash
curl -X POST http://localhost:8080/api/v1/admin/products/PRODUCT_ID/media \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "files=@image1.jpg" \
  -F "files=@image2.jpg"
```

### Search Products
```bash
curl "http://localhost:8080/api/v1/products?search=pottery&page=0&size=10"
```

---

## Frontend Integration Examples

### Fetch Products
```javascript
import { supabase } from './api/supabase';

const fetchProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  
  return data;
};
```

### Create Product with Backend API
```javascript
const createProduct = async (productData) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  const response = await fetch('http://localhost:8080/api/v1/admin/products', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
  
  return response.json();
};
```

### Upload Media
```javascript
const uploadMedia = async (productId, files) => {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  
  const { data: { session } } = await supabase.auth.getSession();
  
  const response = await fetch(`http://localhost:8080/api/v1/admin/products/${productId}/media`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: formData,
  });
  
  return response.json();
};
```

---

## Postman Collection

Import this collection to test all endpoints:

```json
{
  "info": {
    "name": "Sutreya API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Products",
      "item": [
        {
          "name": "List Products",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/products"
          }
        },
        {
          "name": "Get Product",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/products/{{slug}}"
          }
        }
      ]
    },
    {
      "name": "Admin",
      "item": [
        {
          "name": "Create Product",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/admin/products",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"sellerId\": \"{{sellerId}}\",\n  \"name\": \"Test Product\",\n  \"price\": 29.99\n}"
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:8080/api/v1"
    }
  ]
}
```
