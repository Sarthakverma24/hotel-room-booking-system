# Quick Start Guide - Sutreya E-Commerce Platform

## Prerequisites
- Java 17+
- Node.js 16+
- Maven 3.8+
- Supabase account

## 1. Database Setup

### Create Supabase Project
1. Go to https://supabase.com
2. Create new project
3. Copy Project URL and anon key

### Run Schema
1. Open Supabase SQL Editor
2. Copy contents of `database/schema.sql`
3. Execute the SQL script

### Create Storage Bucket
```sql
-- In Supabase SQL Editor
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true);
```

## 2. Backend Setup

### Configure Environment
Create `backend/.env`:
```env
SUPABASE_PROJECT_ID=your-project-id
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=your-db-password
SUPABASE_DB_HOST=db.your-project.supabase.co
SUPABASE_DB_PORT=5432
SUPABASE_DB_NAME=postgres
REVENUECAT_WEBHOOK_SECRET=whsec_xxx
STRIPE_SECRET_KEY=sk_test_xxx
```

### Update application.yml
Edit `backend/src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://${SUPABASE_DB_HOST}:${SUPABASE_DB_PORT}/${SUPABASE_DB_NAME}
    username: ${SUPABASE_DB_USER}
    password: ${SUPABASE_DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
```

### Build & Run
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend will start on http://localhost:8080

## 3. Frontend Setup

### Configure Environment
Create `frontend/.env`:
```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
REACT_APP_API_URL=http://localhost:8080
```

### Install & Run
```bash
cd frontend
npm install
npm start
```

Frontend will start on http://localhost:3000

## 4. Test the Implementation

### Create Test User
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Enter email and password
4. Verify email in Supabase Auth dashboard

### Add Test Product
1. Login to the app
2. Click "Dashboard" tab
3. Click "Add Product"
4. Fill in product details:
   - Name: "Handmade Pottery Bowl"
   - Description: "Beautiful ceramic bowl"
   - Price: 45.00
   - Inventory: 10
5. Upload images
6. Click "Submit"

### Test Product Search
1. Go to "Shop" tab
2. Search for products
3. Filter by price range
4. Sort by different criteria

### Test Admin Features
1. Go to "Dashboard" tab
2. View product list
3. Edit product
4. Update inventory
5. View analytics (placeholder data)

## 5. API Testing

### Test Public Endpoints
```bash
# List products
curl http://localhost:8080/api/v1/products

# Get product by slug
curl http://localhost:8080/api/v1/products/handmade-pottery-bowl-abc123
```

### Test Admin Endpoints (requires JWT)
```bash
# Get JWT token from Supabase
TOKEN="your-jwt-token"

# Create product
curl -X POST http://localhost:8080/api/v1/admin/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sellerId": "user-uuid",
    "name": "Test Product",
    "description": "Test description",
    "price": 29.99,
    "inventoryQuantity": 5
  }'

# Get dashboard analytics
curl http://localhost:8080/api/v1/admin/analytics/dashboard?sellerId=user-uuid \
  -H "Authorization: Bearer $TOKEN"
```

## 6. WebSocket Testing

### Connect to WebSocket
```javascript
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const socket = new SockJS('http://localhost:8080/ws');
const stompClient = Stomp.over(socket);

stompClient.connect({}, () => {
  stompClient.subscribe('/topic/products/product-id/inventory', (message) => {
    console.log('Inventory update:', JSON.parse(message.body));
  });
});
```

## 7. Common Issues

### Backend won't start
- Check Java version: `java -version` (should be 17+)
- Verify database connection in .env
- Check if port 8080 is available

### Frontend won't start
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node version: `node -v` (should be 16+)
- Verify Supabase credentials in .env

### Database connection error
- Verify Supabase project is active
- Check database password
- Ensure IP is whitelisted in Supabase

### Images not uploading
- Check Supabase Storage bucket exists
- Verify bucket is public
- Check file size limits (max 100MB)

## 8. Production Deployment

### Backend (Railway)
```bash
cd backend
railway login
railway init
railway up
```

### Frontend (Vercel)
```bash
cd frontend
vercel login
vercel --prod
```

### Environment Variables
Set production environment variables in:
- Railway dashboard (backend)
- Vercel dashboard (frontend)

## 9. Next Steps

1. **Add Payment Integration**
   - Configure Stripe webhooks
   - Implement checkout flow

2. **Enable RevenueCat**
   - Set up subscription products
   - Configure webhook handlers

3. **Implement Search**
   - Set up Elasticsearch
   - Index products

4. **Add Caching**
   - Configure Redis
   - Cache product catalog

5. **Enable Monitoring**
   - Set up error tracking (Sentry)
   - Add performance monitoring

## Support

For issues or questions:
- Check IMPLEMENTATION.md for detailed documentation
- Review database/schema.sql for schema details
- See README.md for architecture overview
