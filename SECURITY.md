# 🔒 RentFlow - Security

## Security Overview

RentFlow implements defense-in-depth security across frontend, backend, and database layers.

---

## 🛡️ Security Layers

### Frontend Security
- ✅ Supabase-handled password hashing
- ✅ JWT stored in localStorage (auto-refreshed by Supabase)
- ✅ Protected routes redirect unauthenticated users
- ✅ Axios interceptor auto-injects JWT in all requests
- ✅ Client-side input validation

### Backend Security
- ✅ JWT verification middleware on all protected endpoints
- ✅ Joi schema validation on all request bodies
- ✅ Role-based access control (users can only modify own data)
- ✅ Generic error responses (no data leaks)
- ✅ CORS configured for Vercel frontend only

### Database Security
- ✅ Row Level Security (RLS) policies enforced
- ✅ Users can only access their own data
- ✅ Parameterized queries prevent SQL injection
- ✅ SSL/TLS for transport encryption
- ✅ PostgreSQL native data encryption

### Deployment Security
- ✅ HTTPS enforced on Vercel + Render
- ✅ Environment variables managed separately
- ✅ Secrets never logged or exposed
- ✅ API keys rotated after deployment

---

## 🔐 Authentication Flow

```
1. User Registration/Login
   → Supabase Auth (email/password)
   → Supabase validates & returns JWT

2. Token Storage
   → JWT stored in localStorage
   → Supabase auto-refreshes expiring tokens

3. API Requests
   → Axios interceptor adds JWT to Authorization header
   → Every request includes token

4. Backend Verification
   → Express middleware verifies JWT signature
   → Extract user_id from token
   → Allow/deny based on token validity

5. Data Access Control
   → RLS policies check user_id matches data owner
   → User can only access own data at database level
```

---

## Input Validation

**Frontend:**
- Basic validation for UX feedback

**Backend:**
```javascript
const schema = Joi.object({
  title: Joi.string().min(5).max(100).required(),
  price: Joi.number().positive().required(),
  bedrooms: Joi.number().integer().min(1).required(),
});
```

- Validates all request bodies
- Returns 400 if invalid

---

## Environment Variables

**Never commit .env files!**

**Backend (.env)**
```
PORT=5000
SUPABASE_URL=https://...
SUPABASE_KEY=sb_secret_... (PRODUCTION KEY)
JWT_SECRET=32+ char random string
CLIENT_URL=https://rent-flow-rouge.vercel.app
NODE_ENV=production
```

**Frontend (.env)**
```
VITE_API_URL=https://room-finder-app.onrender.com
```

---

## Authorization Matrix

| Action | Anonymous | Tenant | Landlord |
|--------|-----------|--------|----------|
| View rooms | ✅ | ✅ | ✅ |
| Post room | ❌ | ❌ | ✅ |
| Apply for room | ❌ | ✅ | ❌ |
| View own applications | ❌ | ✅ | ✅* |
| Leave review | ❌ | ✅ | ✅ |
| Send chat | ❌ | ✅ | ✅ |

*Landlord sees only applications for their rooms

---

## Common Vulnerabilities Mitigations

| Vulnerability | Mitigation |
|---------------|-----------|
| SQL Injection | Supabase parameterized queries |
| Cross-Site Scripting (XSS) | React auto-escapes by default |
| CSRF | JWT in Authorization header |
| Unauthorized Access | JWT + RLS policies |
| Weak Passwords | Supabase enforces strong passwords |
| Data Breach | RLS prevents accessing other user's data |

---

## .gitignore Protection

```
.env                 # Never commit secrets
*.md                 # Prevent .md files with secrets
node_modules/
dist/
build/
```

- Prevents accidental secret commits
- Git filter-branch removes secrets from history

---

## Security Checklist

- ✅ All secrets in .env (not in code)
- ✅ No hardcoded API keys
- ✅ Input validation on all endpoints
- ✅ JWT verification on protected routes
- ✅ Authorization checks for resource ownership
- ✅ CORS configured
- ✅ Error messages don't leak info
- ✅ HTTPS on all endpoints
- ✅ RLS policies enabled
- ✅ API keys rotated

---

## If Secrets Are Exposed

1. Immediately regenerate Supabase keys
2. Generate new JWT secret
3. Update environment variables on Render/Vercel
4. Remove secrets from git history
5. Force-push to GitHub

---

**For detailed security implementation, see source code in:**
- `server/middleware/auth.js` (JWT verification)
- `server/middleware/errorHandler.js` (Error handling)
- `server/controllers/` (Authorization checks)

