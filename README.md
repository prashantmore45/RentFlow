# 🏠 RentFlow - Intelligent Rental Management Platform

> A full-stack real-time housing marketplace connecting tenants and landlords with a streamlined application workflow.

![RentFlow Banner](https://image2url.com/r2/default/images/1769262461584-a4efb513-2d7e-4981-b035-75f2981b5242.png)


<div align="center">

[![Netlify Status](https://api.netlify.com/api/v1/badges/b7d345-your-id/deploy-status)](https://roomfinder-v2.netlify.app)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

[**🚀 Live Demo**](https://roomfinder-v2.netlify.app) • [**⚙️ Backend API**](https://room-finder-api.onrender.com)

</div>

---

## 📖 Project Overview

**RentFlow** solves the chaos of unstructured rental hunting. Unlike standard listing sites where communication is lost in phone calls, RentFlow introduces a **"Job Board" style workflow** for housing.

Tenants apply to rooms with profiles and personalized messages. Landlords receive these applications in a dedicated **Dashboard**, where they can review candidate profiles and **Accept or Reject** them in real-time, functioning like an Applicant Tracking System (ATS) for real estate.

### ✨ Key Features

#### 🔐 **Identity & Security**
* **Secure Auth:** Full Login/Signup system using Supabase Auth.
* **Row Level Security (RLS):** Database policies ensure users can only edit their own listings and profiles.
* **User Profiles:** Custom profile management with Avatar uploads and Bios to build trust between parties.

#### 🏘️ **Property Management (CRUD)**
* **Post Listings:** Landlords can upload room details with **Real-time Image Uploads** (via Supabase Storage).
* **Manage Inventory:** Full control to **Edit** prices/details or **Delete** listings directly from the dashboard.
* **Smart Search:** Server-side filtering allows users to find rooms by **Location** (City/Area) and **Property Type**.

#### 📨 **Application Workflow**
* **One-Click Apply:** Tenants can send applications with a custom note.
* **Landlord Dashboard:** A centralized hub to view incoming applicants.
* **Status Tracking:** Real-time updates (Pending → Accepted/Rejected) visible to both parties.

#### 🎨 **Modern UI/UX**
* **Mobile-First Design:** Fully responsive layout optimized for all devices.
* **Glassmorphism:** Modern aesthetic using Tailwind CSS.
* **Robust Error Handling:** Smart fallbacks for broken images and protected route redirects.

---

## 🛠️ Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Frontend** | **React.js (Vite)**, Tailwind CSS, Lucide React (Icons), Axios |
| **Backend** | **Node.js**, Express.js (REST API Architecture) |
| **Database** | **Supabase** (PostgreSQL) + Row Level Security (RLS) |
| **Storage** | **Supabase Storage** (Image Buckets for Avatars & Rooms) |
| **Deployment** | Netlify (Frontend), Render (Backend) |

---

## 📸 Screenshots

| Home Page | Dashboard |
| :---: | :---: |
| <img src="https://willing-rose-3k8apctlwr.edgeone.app/Screenshot%202026-01-21%20220737.png" /> | <img src="https://front-tomato-awzqpzlv3q.edgeone.app/Screenshot%202026-01-21%20221508.png" /> |

| Room Details | Profile Page |
| :---: | :---: |
| <img src="https://alert-yellow-3j6c6njh6s.edgeone.app/Screenshot%202026-01-21%20221654.png" alt="Details" /> | <img src="https://img.sanishtech.com/u/fd143e3cb07ed66c6b1b0b5480f2d7fc.png" /> |

---

## ⚡ Setup Instructions (Run Locally)

### Prerequisites
* Node.js (v16+)
* A Supabase Project (Free Tier)

### 1. Clone the Repository
```bash
git clone [https://github.com/prashantmore45/RentFlow.git](https://github.com/prashantmore45/RentFlow.git)
cd RentFlow
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

🛡️ Security Implementation

This project follows strict security best practices:

- Environment Isolation: Sensitive Service Role keys are restricted to the backend.

- RLS Policies: PostgreSQL policies prevent users from modifying data they don't own.

- Input Validation: Frontend validation ensures clean data submission.

---

👨‍💻 Author 

Prashant More  
Full Stack Developer | Computer Engineering Student


<p> <a href="https://prashant-portfolio-pro.vercel.app/"> <img src="https://www.google.com/search?q=https://img.shields.io/badge/🌐_Portfolio-View_Site-blue?style=for-the-badge" alt="Portfolio" /> </a> <a href="https://linkedin.com/in/prashant-more-48b164287"> <img src="https://www.google.com/search?q=https://img.shields.io/badge/LinkedIn-Connect-blue%3Fstyle%3Dfor-the-badge%26logo%3Dlinkedin" alt="LinkedIn" /> </a> <a href="https://www.google.com/search?q=https://github.com/prashantmore45"> <img src="https://www.google.com/search?q=https://img.shields.io/badge/GitHub-Follow-black%3Fstyle%3Dfor-the-badge%26logo%3Dgithub" alt="GitHub" /> </a> </p>


© 2026 RentFlow. All Rights Reserved
