## NextHire — Full-Stack Job Portal

NextHire is a full-stack job portal built with the MERN stack.  
It connects job seekers with recruiters through role-based access, job search, and structured application management.

---

## 🚀 Tech Stack

**Frontend:** React 18, Redux Toolkit, React Router v6, Tailwind CSS  
**Backend:** Node.js, Express.js  
**Database:** MongoDB (Mongoose ODM)  
**Authentication:** JWT (HTTP-only cookies)  
**File Storage:** Cloudinary  
**Security:** Helmet, express-rate-limit, CORS  
**Performance:** compression middleware  

---

## Architecture

```
Client (React SPA)
    │
    ├── Redux Store (auth, job, application)
    │
    └── REST API (Express)
            │
            ├── Auth Middleware (JWT via HTTP-only cookie)
            │
            ├── Controllers (user, job, company, application)
            │
            ├── Mongoose Models (User, Job, Company, Application)
            │
            └── MongoDB Atlas
                    │
                    └── Cloudinary (file storage)
```
---

## Folder Structure

```
Job_Portal/
├── backend/
│   ├── controllers/
│   │   ├── application.controller.js
│   │   ├── company.controller.js
│   │   ├── job.controller.js
│   │   └── user.controller.js
│   ├── middlewares/
│   │   ├── errorHandler.js
│   │   ├── isAuthenticated.js
│   │   └── multer.js
│   ├── models/
│   │   ├── application.model.js
│   │   ├── company.model.js
│   │   ├── job.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── application.route.js
│   │   ├── company.route.js
│   │   ├── job.route.js
│   │   └── user.route.js
│   ├── utils/
│   │   ├── cloudinary.js
│   │   └── db.js
│   ├── .env.example
│   └── index.js
│
└── frontend/
    └── src/
        ├── components/
        │   ├── Home/           # Hero, LatestJobs, Features, RecruiterCTA, FinalCTA
        │   ├── admin/          # Recruiter dashboard: Companies, Jobs, PostJob, Applicants
        │   ├── auth/           # Login, Signup
        │   └── shared/         # Navbar, Footer
        ├── hooks/              # Custom data-fetching hooks
        ├── redux/              # authSlice, jobSlice, applicationSlice, store
        └── utils/              # API endpoint constants
```

---


## Running Locally

### Prerequisites

- Node.js ≥ 18
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account

### 1. Clone the repository

```bash
git clone https://github.com/your-username/nexthire.git
cd nexthire
```

### 2. Set up the backend

```bash
cd backend
cp .env.example .env
# Fill in your values in .env
npm install
npm run dev
```

### 3. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

The backend runs on `http://localhost:3000` and the frontend on `http://localhost:5173`.

---

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=3000
MONGO_URI=
SECRET_KEY=your_jwt_secret_key_here
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:3000
```
---

##  🛠 Production Improvements (Planned)

- Short-lived access tokens + refresh token rotation
- Redis caching for job listings
- Async file uploads via background queue
- Structured logging (Winston/Pino)
- Compound MongoDB indexes for multi-field filters
- TypeScript migration
-SSR migration (Next.js) for SEO
