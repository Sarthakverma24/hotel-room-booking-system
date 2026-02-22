# Sutreya E-Commerce Platform

A fullstack mobile marketplace for homemade products built with React Native and Java Spring Boot.

## Architecture

**Frontend:** React Native (iOS/Android)
- Supabase for authentication & real-time data
- RevenueCat for subscription management
- Stripe for one-time purchases

**Backend:** Java Spring Boot microservices
- PostgreSQL (Supabase)
- RevenueCat webhook integration
- Stripe payment processing

## Setup

### Database (Supabase)
1. Create Supabase project
2. Run `database/schema.sql` in SQL Editor
3. Copy project URL and anon key

### Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Environment Variables

**Backend (.env):**
```
SUPABASE_PROJECT_ID=your-project-id
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=your-password
REVENUECAT_WEBHOOK_SECRET=whsec_xxx
STRIPE_SECRET_KEY=sk_xxx
```

**Frontend (.env):**
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJxxx
REVENUECAT_IOS_KEY=appl_xxx
REVENUECAT_ANDROID_KEY=goog_xxx
```

## Deployment

- Backend: Railway (already configured)
- Frontend: Vercel (already configured)
- Database: Supabase (managed)

## Key Features

- Product catalog with real-time inventory
- Subscription paywalls (RevenueCat)
- Secure payments (Stripe)
- Seller dashboard
- Order management
