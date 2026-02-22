# Production Deployment Checklist

## Pre-Deployment

### Database
- [ ] Run `database/schema.sql` in production Supabase
- [ ] Create storage bucket: `products`
- [ ] Set bucket to public
- [ ] Configure RLS policies
- [ ] Create indexes (already in schema.sql)
- [ ] Backup database
- [ ] Test database connection

### Backend Configuration
- [ ] Set `ddl-auto: validate` in production
- [ ] Configure production database URL
- [ ] Set strong JWT secret
- [ ] Configure CORS for production domain
- [ ] Set up Stripe production keys
- [ ] Set up RevenueCat production keys
- [ ] Configure file upload limits
- [ ] Enable HTTPS only
- [ ] Set up error logging (Sentry)
- [ ] Configure rate limiting

### Frontend Configuration
- [ ] Update API URL to production
- [ ] Set production Supabase URL
- [ ] Set production Supabase anon key
- [ ] Configure production CORS
- [ ] Enable production build optimizations
- [ ] Set up CDN for static assets
- [ ] Configure error tracking
- [ ] Set up analytics (Google Analytics)

### Security
- [ ] Review all environment variables
- [ ] Remove hardcoded credentials
- [ ] Enable HTTPS
- [ ] Configure security headers
- [ ] Set up WAF (Web Application Firewall)
- [ ] Enable DDoS protection
- [ ] Configure rate limiting
- [ ] Review RLS policies
- [ ] Enable audit logging
- [ ] Set up monitoring alerts

## Deployment Steps

### 1. Backend (Railway)

```bash
# Login to Railway
railway login

# Initialize project
cd backend
railway init

# Set environment variables
railway variables set SUPABASE_URL=https://xxx.supabase.co
railway variables set SUPABASE_ANON_KEY=xxx
railway variables set STRIPE_SECRET_KEY=sk_live_xxx
railway variables set REVENUECAT_WEBHOOK_SECRET=whsec_xxx

# Deploy
railway up
```

### 2. Frontend (Vercel)

```bash
# Login to Vercel
vercel login

# Deploy
cd frontend
vercel --prod

# Set environment variables in Vercel dashboard
REACT_APP_SUPABASE_URL=https://xxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=xxx
REACT_APP_API_URL=https://your-backend.railway.app
```

### 3. Database (Supabase)

```sql
-- Run in Supabase SQL Editor
-- Already done via schema.sql

-- Verify tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

## Post-Deployment

### Testing
- [ ] Test user registration
- [ ] Test user login
- [ ] Test product creation
- [ ] Test image upload
- [ ] Test product search
- [ ] Test product filtering
- [ ] Test WebSocket connection
- [ ] Test admin dashboard
- [ ] Test analytics endpoints
- [ ] Test mobile responsiveness

### Monitoring
- [ ] Set up uptime monitoring (UptimeRobot)
- [ ] Configure error alerts
- [ ] Set up performance monitoring
- [ ] Monitor database performance
- [ ] Track API response times
- [ ] Monitor storage usage
- [ ] Set up log aggregation

### Performance
- [ ] Enable CDN for images
- [ ] Configure caching headers
- [ ] Optimize database queries
- [ ] Add Redis caching
- [ ] Enable gzip compression
- [ ] Optimize bundle size
- [ ] Lazy load images
- [ ] Implement pagination

## Environment Variables

### Backend (.env)
```env
# Database
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_JWT_SECRET=xxx

# Payment
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Subscription
REVENUECAT_WEBHOOK_SECRET=whsec_xxx
REVENUECAT_API_KEY=xxx

# Server
PORT=5000
```

### Frontend (.env.production)
```env
REACT_APP_SUPABASE_URL=https://xxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=xxx
REACT_APP_API_URL=https://your-backend.railway.app
```

## Security Hardening

### Backend
```yaml
# application-prod.yml
spring:
  jpa:
    hibernate:
      ddl-auto: validate  # Never use 'update' in production
    show-sql: false       # Disable SQL logging
  
server:
  error:
    include-message: never
    include-stacktrace: never
```

### Headers
```java
// Add to SecurityConfig
http.headers()
  .contentSecurityPolicy("default-src 'self'")
  .and()
  .xssProtection()
  .and()
  .frameOptions().deny();
```

## Rollback Plan

### If deployment fails:

1. **Backend Rollback**
```bash
railway rollback
```

2. **Frontend Rollback**
```bash
vercel rollback
```

3. **Database Rollback**
- Restore from backup
- Run rollback migrations if needed

## Monitoring Checklist

### Daily
- [ ] Check error logs
- [ ] Monitor API response times
- [ ] Check database performance
- [ ] Review security alerts

### Weekly
- [ ] Review user feedback
- [ ] Analyze performance metrics
- [ ] Check storage usage
- [ ] Review cost optimization

### Monthly
- [ ] Security audit
- [ ] Performance optimization
- [ ] Database maintenance
- [ ] Backup verification

## Performance Targets

- [ ] API response time < 200ms
- [ ] Page load time < 2s
- [ ] Time to interactive < 3s
- [ ] Database query time < 50ms
- [ ] Image load time < 1s
- [ ] WebSocket latency < 100ms

## Scaling Considerations

### When to scale:
- CPU usage > 70%
- Memory usage > 80%
- Response time > 500ms
- Error rate > 1%
- Database connections > 80% of pool

### Scaling options:
1. Vertical scaling (increase resources)
2. Horizontal scaling (add instances)
3. Database read replicas
4. CDN for static assets
5. Redis for caching
6. Load balancer

## Backup Strategy

### Database
- Automated daily backups (Supabase)
- Weekly full backups
- Monthly archive backups
- Test restore quarterly

### Storage
- Replicate to multiple regions
- Backup to S3/GCS
- Version control for code

## Support & Maintenance

### Documentation
- [ ] API documentation updated
- [ ] User guide created
- [ ] Admin guide created
- [ ] Troubleshooting guide

### Training
- [ ] Train support team
- [ ] Create video tutorials
- [ ] Document common issues
- [ ] Set up help desk

## Launch Checklist

### Pre-Launch
- [ ] All tests passing
- [ ] Security audit complete
- [ ] Performance optimized
- [ ] Documentation complete
- [ ] Support team trained
- [ ] Monitoring configured
- [ ] Backups verified

### Launch Day
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Verify all services
- [ ] Monitor for issues
- [ ] Be ready for rollback
- [ ] Communicate with users

### Post-Launch
- [ ] Monitor closely for 24h
- [ ] Address any issues
- [ ] Collect user feedback
- [ ] Optimize based on metrics
- [ ] Plan next iteration

## Success Metrics

### Technical
- 99.9% uptime
- < 200ms API response time
- < 1% error rate
- < 2s page load time

### Business
- User registration rate
- Product creation rate
- Search usage
- Conversion rate
- User retention

## Emergency Contacts

- DevOps: [contact]
- Database Admin: [contact]
- Security Team: [contact]
- Support Lead: [contact]

## Useful Commands

### Check backend health
```bash
curl https://your-backend.railway.app/health
```

### Check database connection
```bash
psql -h db.xxx.supabase.co -U postgres -d postgres
```

### View logs
```bash
# Railway
railway logs

# Vercel
vercel logs
```

### Monitor resources
```bash
# Railway dashboard
railway status
```

---

## ✅ Ready for Production!

Once all items are checked, your Sutreya platform is ready to launch! 🚀
