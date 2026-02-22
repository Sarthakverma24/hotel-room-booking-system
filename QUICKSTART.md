# Quick Setup Guide

## ✅ Database Already Configured!

Your Supabase project: https://dyscxlxkrvmjgdvhdyaq.supabase.co

### Next: Run the SQL Schema

1. Go to: https://dyscxlxkrvmjgdvhdyaq.supabase.co/project/dyscxlxkrvmjgdvhdyaq/sql/new
2. Copy all content from `database/schema.sql`
3. Paste and click "Run"

## Start Backend

```bash
cd backend
mvn spring-boot:run
```

Test: http://localhost:5000/api/v1/products/health

## Start Frontend

```bash
cd frontend
npm install
npm start
```

## Environment Files Created

✅ `backend/.env` - Backend configuration
✅ `frontend/.env` - Frontend configuration

Both files are already configured with your Supabase credentials!

## Deploy to Railway (Backend)

Add these environment variables in Railway dashboard:
- SUPABASE_PROJECT_ID=dyscxlxkrvmjgdvhdyaq
- SUPABASE_DB_USER=postgres.dyscxlxkrvmjgdvhdyaq
- SUPABASE_DB_PASSWORD=sarrthak verma
- SUPABASE_URL=https://dyscxlxkrvmjgdvhdyaq.supabase.co
- SUPABASE_ANON_KEY=sb_publishable_GKd4awcHH07ujbyIdCFIcw_5hnZr12x

## What's Working

✅ Supabase database connection configured
✅ Backend API ready to start
✅ Frontend React Native app ready
✅ Database schema ready to deploy

## Next Steps

1. Run SQL schema in Supabase (link above)
2. Start backend: `cd backend && mvn spring-boot:run`
3. Start frontend: `cd frontend && npm start`
