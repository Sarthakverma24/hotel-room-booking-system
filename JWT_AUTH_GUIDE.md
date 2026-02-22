# JWT Authentication Testing Guide

## ✅ JWT Authentication is NOW Working!

### What's Implemented:

**Backend:**
- ✅ JWT filter validates Supabase tokens
- ✅ Extracts user ID from JWT claims
- ✅ Stateless session management
- ✅ Protected endpoints require authentication

**Frontend:**
- ✅ Supabase handles JWT token generation
- ✅ Tokens automatically sent in Authorization header
- ✅ API client utility for authenticated requests

### How It Works:

1. **User logs in** → Supabase generates JWT token
2. **Token stored** → Supabase client stores in localStorage
3. **API requests** → Token sent as `Bearer {token}` in Authorization header
4. **Backend validates** → JWT filter verifies signature using Supabase JWT secret
5. **User authenticated** → Request proceeds with user context

### Test JWT Authentication:

**1. Login via frontend:**
```
http://localhost:3000
Click "Login" → Enter credentials
```

**2. Test protected endpoint:**
```javascript
import { apiClient } from './api/apiClient';

// This will send JWT token automatically
const profile = await apiClient.get('/api/v1/user/profile');
console.log(profile); // { authenticated: true, userId: "..." }
```

**3. Test with curl:**
```bash
# Get token from browser localStorage: supabase.auth.token
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5000/api/v1/user/profile
```

### Protected Endpoints:

- ✅ `/api/v1/user/profile` - Requires JWT
- ✅ `/api/v1/orders` - Requires JWT (future)
- ⚪ `/api/v1/products` - Public (no JWT needed)
- ⚪ `/api/v1/auth/**` - Public (no JWT needed)

### JWT Token Structure:

```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "authenticated",
  "iat": 1234567890,
  "exp": 1234571490
}
```

### Configuration:

**Backend (.env):**
```
SUPABASE_JWT_SECRET=6f52fb7d-3b0d-49af-b9d7-68d0671ba4f7
```

**Frontend:**
- Supabase client automatically handles JWT tokens
- No manual configuration needed

### Status: ✅ FULLY WORKING

JWT authentication is properly integrated between Supabase (frontend) and Spring Boot (backend)!
