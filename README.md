# 🏠 RoomFinder - Modern Accommodation Platform

> A full-stack application connecting landlords with tenants through a "Job Board" style interface.

![RoomFinder Banner](https://environmental-teal-ecruipczrq.edgeone.app/roomfinder.png)

## 🚀 Live Demo
**Frontend:** [https://roomfinder-v2.netlify.app](https://roomfinder-v2.netlify.app)  
**Backend API:** [https://room-finder-api.onrender.com](https://room-finder-api.onrender.com)

---

## 📖 Project Overview
RoomFinder solves the problem of unstructured rental hunting. Instead of just listing a phone number, landlords can manage "Applications" from tenants. 
Tenants apply to rooms with a message, and landlords get a dashboard to **Accept** or **Reject** applicants, similar to an Applicant Tracking System (ATS).


### ✨ Key Features
- **Auth & Security:** Full authentication (Login/Signup) using Supabase Auth with Row Level Security (RLS).
- **Listing Management:** Users can post rooms with detailed attributes (Price, Location, Type).
- **Smart Search:** Server-side filtering for Location and Property Type.
- **Application System:** - Tenants can apply to rooms with a personal message.
  - Landlords have a dashboard to view received applications.
  - **Accept/Reject Logic:** Real-time status updates for applications.
- **Responsive UI:** Built with Tailwind CSS, featuring Glassmorphism and Mobile-First design.

---

## 🛠️ Tech Stack

|    Domain      |                     Technology                      |
|     :---       |                        :---                         |
| **Frontend**   | React.js (Vite), Tailwind CSS, Framer Motion, Axios |
| **Backend**    | Node.js, Express.js                                 |
| **Database**   | Supabase (PostgreSQL)                               |
| **Deployment** | Netlify (Client), Render (Server)                   |

---

## ⚡ Setup Instructions (Run Locally)

### Prerequisites
- Node.js installed
- A Supabase account

### 1. Clone the Repository

```bash
git clone [https://github.com/YOUR_USERNAME/room-finder-v2.git](https://github.com/YOUR_USERNAME/room-finder-v2.git)
cd room-finder-v2
```

### 2. Backend SetupBashcd server

```bash
npm install
```
- Create a .env file in the server folder:
  * PORT=5000
  * SUPABASE_URL=your_supabase_url
  * SUPABASE_KEY=your_service_role_secret_key

- Run the server:
```Bash 
    npm run dev
 ```
### 3. Frontend SetupOpen a new terminal:Bashcd client

```bash
npm install
```
- Create a .env file in the client folder:
    * VITE_SUPABASE_URL=your_supabase_url
    * VITE_SUPABASE_ANON_KEY=your_anon_public_key
    * VITE_API_URL=http://localhost:5000

- Run the client:
```Bash
    npm run dev
```
---

📡 API Endpoints

Method  |         Endpoint       |                   Description                     |
 :---   |           :---         |                      :---                         |
GET     |  /api/rooms            |  Fetch all rooms (supports ?location= & ?type=)   |  
POST    |  /api/rooms            |  Post a new room                                  |
POST    |  /api/applications     |  Apply for a room                                 |
GET     |  /api/applications/    |  landlord/:id,Get applications received by a user |
PATCH   |  /api/applications/:id |  Update status (Accept/Reject)                    |

---

🛡️ Security Note

This project implements Environment Variable isolation. Database service keys are restricted to the backend server, while the frontend interacts only with the public API and restricted Supabase client keys.

---

## 👨‍💻 Developed by Prashant More
<p><a href="https://prashant-portfolio-pro.vercel.app/">🌐 View Portfolio</a></p> 

<p></p><a href="https://linkedin.com/in/prashant-more-48b164287" target="blank"><img src="https://img.shields.io/badge/-LinkedIn-blue?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a></p>
