# 🏗️ RentFlow - Architecture

## System Design

```
Frontend (Vercel)  →  Backend (Render)  →  Database (Supabase)
React + Vite       →  Express.js        →  PostgreSQL + RLS
Tailwind + Axios      JWT + Joi            Row Level Security
```

## Database Schema

| Table | Purpose |
|-------|---------|
| Profiles | User accounts (tenant/landlord) |
| Rooms | Rental listings |
| Applications | Room applications (pending/approved/rejected) |
| Favorites | Saved rooms |
| Reviews | Ratings & comments |
| Chat | Direct messages |

All tables have RLS policies - Users access only their own data.

---

## Authentication

```
Login → Supabase Auth → JWT Token → localStorage
→ Axios injects JWT in all requests
→ Backend middleware verifies JWT
→ Database RLS enforces access control
```

---

## API Endpoints

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| /api/rooms | GET | No | List rooms |
| /api/rooms | POST | Yes* | Create room |
| /api/applications | POST | Yes | Apply for room |
| /api/applications/tenant/:id | GET | Yes | View applications |
| /api/applications/landlord/:id | GET | Yes | Manage applications |
| /api/favorites | GET/POST | Yes | Save rooms |
| /api/chat | GET/POST | Yes | Messaging |
| /api/reviews | GET/POST | Yes | Reviews |

*Landlord only

---

## User Flows

**Tenant:** Browse rooms → View details → Sign up → Apply → Track status

**Landlord:** Post room → Review applications → Approve/reject → Chat with tenants

**Favorites:** Add to favorites → View saved rooms

---

## Data Validation

1. Client-side validation (UX)
2. Axios JWT injection
3. Express JWT verification middleware
4. Joi request body validation
5. Controller business logic checks
6. Database RLS enforcement

---

## Deployment

**Frontend (Vercel)**
- Auto-deploys on push to main branch
- Live: https://rent-flow-rouge.vercel.app

**Backend (Render)**
- Auto-deploys on push to main branch
- Live: https://room-finder-app.onrender.com

**Environment Variables**
```
Backend: PORT, SUPABASE_URL, SUPABASE_KEY, JWT_SECRET, CLIENT_URL, NODE_ENV
Frontend: VITE_API_URL
```

---

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Axios
- **Backend:** Express.js, Node.js (ESM), JWT, Joi
- **Database:** PostgreSQL (Supabase)
- **Authentication:** Supabase Auth + jsonwebtoken
- **Deployment:** Vercel + Render

---

**See [SECURITY.md](SECURITY.md) for security implementation.**

