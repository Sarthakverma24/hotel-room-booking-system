# Sutreya Deployment Guide

## Backend (Railway)
Already configured at: https://unstop-production.up.railway.app

Set environment variables in Railway dashboard:
- SUPABASE_PROJECT_ID
- SUPABASE_DB_USER
- SUPABASE_DB_PASSWORD
- REVENUECAT_WEBHOOK_SECRET
- STRIPE_SECRET_KEY

## Frontend (Vercel)
Already configured at: https://frontend-murex-sigma.vercel.app

For React Native mobile app:
1. Build iOS: `cd frontend && npx expo build:ios`
2. Build Android: `cd frontend && npx expo build:android`
3. Submit to App Store / Play Store

## Database (Supabase)
1. Create project at supabase.com
2. Run database/schema.sql in SQL Editor
3. Enable Row Level Security
4. Copy connection string to Railway

## RevenueCat Setup
1. Create project at revenuecat.com
2. Add iOS/Android apps
3. Configure webhook: https://unstop-production.up.railway.app/api/v1/webhooks/revenuecat
4. Copy API keys to mobile app

## Stripe Setup
1. Create account at stripe.com
2. Configure webhook: https://unstop-production.up.railway.app/api/v1/webhooks/stripe
3. Copy secret keys to Railway
