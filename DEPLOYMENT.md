# 🚀 Deployment Guide

## Backend Deployment (Railway)

### 1. Setup Railway Account
- Go to [railway.app](https://railway.app)
- Sign up with GitHub account
- Install Railway CLI: `npm install -g @railway/cli`

### 2. Deploy Backend
```bash
cd backend
railway login
railway init
railway up
```

### 3. Get Backend URL
- After deployment, Railway will provide a URL like: `https://your-app-name.railway.app`
- Note this URL for frontend configuration

## Frontend Deployment (Vercel)

### 1. Setup Vercel Account
- Go to [vercel.com](https://vercel.com)
- Sign up with GitHub account
- Install Vercel CLI: `npm install -g vercel`

### 2. Configure Environment
Create `.env.production` in frontend folder:
```
REACT_APP_API_URL=https://your-backend-url.railway.app/api
```

### 3. Deploy Frontend
```bash
cd frontend
vercel login
vercel --prod
```

## Alternative: One-Click Deployment

### Railway (Backend)
1. Push code to GitHub
2. Go to Railway dashboard
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository and `backend` folder
5. Set environment variable: `FRONTEND_URL=https://your-frontend-url.vercel.app`

### Vercel (Frontend)
1. Go to Vercel dashboard
2. Click "New Project" → Import from GitHub
3. Select your repository and `frontend` folder
4. Add environment variable: `REACT_APP_API_URL=https://your-backend-url.railway.app/api`
5. Deploy

## Environment Variables

### Backend (Railway)
```
FRONTEND_URL=https://your-frontend-url.vercel.app
PORT=5000
```

### Frontend (Vercel)
```
REACT_APP_API_URL=https://your-backend-url.railway.app/api
```

## Post-Deployment

1. Test the live application
2. Update README with live URLs
3. Test all features (login, booking, admin controls)

## Troubleshooting

- **CORS Issues**: Ensure FRONTEND_URL is set correctly in Railway
- **API Not Found**: Check REACT_APP_API_URL in Vercel
- **Build Fails**: Check logs in respective platforms

## Live URLs Template
```
Frontend: https://your-app.vercel.app
Backend: https://your-app.railway.app
API: https://your-app.railway.app/api
```