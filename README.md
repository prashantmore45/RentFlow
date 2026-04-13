# 🏠 RentFlow - Room Rental Management Platform

> Full-stack rental marketplace: Browse, apply, chat, manage rooms.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

[🚀 Live App](https://rent-flow-rouge.vercel.app) • [📚 Architecture](ARCHITECTURE.md) • [🔒 Security](SECURITY.md)

---

## Features

**Tenants:** Browse rooms → Apply → Add to favorites → Chat with landlords → Leave reviews

**Landlords:** Post rooms → Manage applications → Verify tenants

**Security:** JWT auth, RLS policies, input validation, CORS protection

---

## Quick Start

```bash
# Backend
cd server && npm install
echo 'PORT=5000
SUPABASE_URL=your_url
SUPABASE_KEY=your_key
JWT_SECRET=32_char_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development' > .env
npm run dev

# Frontend (new terminal)
cd client && npm install
echo 'VITE_API_URL=http://localhost:5000' > .env
npm run dev
```

Visit http://localhost:5173

---

## Tech Stack

| Component | Tech |
|-----------|------|
| Frontend | React 18, Vite, Tailwind, Axios |
| Backend | Express.js, Node.js, JWT, Joi |
| Database | Supabase (PostgreSQL + RLS) |
| Deploy | Vercel (frontend), Render (backend) |

---

## API Quick Reference

```
GET    /api/rooms                      List all rooms
POST   /api/applications               Apply for room
GET    /api/applications/tenant/:id    Your applications
GET    /api/applications/landlord/:id  Received applications
POST   /api/favorites                  Save room
POST   /api/chat                       Send message
POST   /api/reviews                    Leave review
```

---

## Deployment

- **Frontend:** https://rent-flow-rouge.vercel.app (Vercel auto-deploy)
- **Backend:** https://room-finder-app.onrender.com (Render auto-deploy)

Push to `main` branch for auto-deployment.

---

## Security ✅

✅ JWT authentication  
✅ Role-based authorization  
✅ Row Level Security (database)  
✅ Input validation with Joi  
✅ CORS protection  
✅ API keys rotated & secured  
✅ Secrets never committed

---

## Project Status

- ✅ Full-stack working
- ✅ 100+ rooms live
- ✅ Real-time messaging
- ✅ Deployed to production
- ✅ Security audit completed

---

## Documentation

For detailed information, see:
- [**ARCHITECTURE.md**](ARCHITECTURE.md) - System design, database schema, API flows
- [**SECURITY.md**](SECURITY.md) - Authentication, authorization, best practices

---

## Setup & Deployment

### Local Development
1. Clone repo: `git clone https://github.com/prashantmore45/RentFlow.git`
2. Backend: `cd server && npm install && npm run dev`
3. Frontend: `cd client && npm install && npm run dev`
4. Set up Supabase account & get API keys

### Environment Variables

**Backend (.env)**
```
PORT=5000
SUPABASE_URL=https://...
SUPABASE_KEY=sb_secret_...
JWT_SECRET=32+ char random string
CLIENT_URL=https://rent-flow-rouge.vercel.app
NODE_ENV=production
```

**Frontend (.env)**
```
VITE_API_URL=https://room-finder-app.onrender.com
```

---

## Project Structure

```
RentFlow/
├── client/              # React frontend
│   ├── src/components/  # Reusable components
│   ├── src/pages/       # Route pages
│   └── src/supabase.js  # Supabase config
├── server/              # Express backend
│   ├── middleware/      # Auth, validation
│   ├── routes/          # API routes
│   ├── controllers/     # Business logic
│   └── index.js         # App setup
├── ARCHITECTURE.md      # System design
├── SECURITY.md          # Security details
└── README.md            # This file
```

---

## Author

**Prashant More** - Full Stack Developer

[GitHub](https://github.com/prashantmore45) • [LinkedIn](https://linkedin.com/in/prashant-more-48b164287) • [Portfolio](https://prashant-portfolio-pro.vercel.app/)

---

## License

MIT License - Open Source
