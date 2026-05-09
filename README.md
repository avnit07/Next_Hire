# NextHire — Full‑Stack Job Portal (MERN)

NextHire is a full-stack job portal that connects **applicants** and **recruiters** with role-based access, job search, structured application workflows, and recruiter tooling (company/job management).

- Live: https://next-hire-phi-ten.vercel.app
- Repo: https://github.com/avnit07/Next_Hire

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [High-Level Architecture](#high-level-architecture)
- [Repository Structure](#repository-structure)
- [How Components Are Linked (End-to-End Flow)](#how-components-are-linked-end-to-end-flow)
- [Environment Variables](#environment-variables)
- [Run Locally](#run-locally)
- [API + Data Model (Conceptual)](#api--data-model-conceptual)
- [Claude Prompt (Major Project Documentation)](#claude-prompt-major-project-documentation)
- [Roadmap](#roadmap)
- [License](#license)

---

## Features

### Applicant
- Browse and search jobs
- Apply to jobs (with resume/file upload support)
- Track applications

### Recruiter / Admin
- Company profile management
- Create and manage job postings
- View applicants per job

### Platform
- Role-based authentication & authorization
- Secure REST APIs
- Cloudinary-backed file storage
- Security middleware (Helmet, rate limiting, CORS)

---

## Tech Stack

**Frontend**
- React (Vite)
- Redux Toolkit + redux-persist
- React Router
- Tailwind CSS + UI primitives (Radix)

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT auth (HTTP-only cookies)

**Infra / Utilities**
- Cloudinary for file storage
- Multer for uploads
- Helmet + express-rate-limit + compression

---

## High-Level Architecture

```text
Browser (React SPA)
  └── React Router (pages/routes)
        └── UI Components
              └── Redux Store (auth/job/application)
                    └── API Client (Axios)
                          └── Express REST API
                                ├── Routes
                                ├── Auth Middleware (JWT)
                                ├── Controllers (business logic)
                                ├── Models (Mongoose)
                                └── MongoDB

File Uploads
  └── Multer -> Cloudinary -> URL stored in MongoDB
```

---

## Repository Structure

> Note: This structure is based on the repository layout in `main`.

```text
.
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
│   ├── index.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home/        # Landing sections (Hero, LatestJobs, etc.)
│   │   │   ├── admin/       # Recruiter dashboard components
│   │   │   ├── auth/        # Login/Signup
│   │   │   └── shared/      # Navbar/Footer/etc.
│   │   ├── hooks/           # Custom hooks (data fetching / UX helpers)
│   │   ├── redux/           # slices + store
│   │   └── utils/           # constants/helpers (API endpoints, etc.)
│   ├── package.json
│   └── package-lock.json
│
├── README.md
├── commit_msg.txt
└── .gitignore
```

---

## How Components Are Linked (End-to-End Flow)

This section explains **how the frontend and backend are wired together**, and how data moves through the app.

### 1) Frontend routing → page/component
- The React app uses **React Router** to map URLs to screens.
- Each screen is composed from `frontend/src/components/**`.

### 2) UI interaction → Redux action / thunk → API call
- UI components dispatch actions to the **Redux store** (`frontend/src/redux`).
- Async flows typically:
  1. set loading state
  2. call backend using Axios
  3. store the response in Redux slices (e.g., auth/job/application)
  4. render based on updated state

### 3) API request → Express route → controller
- The frontend calls the backend base URL (`VITE_API_BASE_URL`).
- Backend route files in `backend/routes/**` map endpoints to controller functions in `backend/controllers/**`.

### 4) Auth-protected endpoints
- Protected endpoints use `backend/middlewares/isAuthenticated.js`.
- Authentication uses **JWT** stored in **HTTP-only cookies**.

### 5) Controller → Mongoose model → MongoDB
- Controllers implement business logic and read/write via models in `backend/models/**`.
- DB connection is handled via `backend/utils/db.js`.

### 6) File uploads (resume/logo/etc.)
- Upload requests pass through `backend/middlewares/multer.js`.
- Files are uploaded to Cloudinary via `backend/utils/cloudinary.js`.
- The resulting Cloudinary URL (and metadata if needed) is stored in MongoDB.

---

## Environment Variables

### Backend (`backend/.env`)

Create `backend/.env` (you can start from `backend/.env.example`).

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

## Run Locally

### Prerequisites
- Node.js >= 18
- MongoDB (Atlas or local)
- Cloudinary account (for uploads)

### 1) Clone

```bash
git clone https://github.com/avnit07/Next_Hire.git
cd Next_Hire
```

### 2) Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Backend will run on: `http://localhost:3000`

### 3) Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Frontend will run on: `http://localhost:5173`

---

## API + Data Model (Conceptual)

The backend is organized around four core resources (matching the models/controllers):

- **User**: authentication + role (applicant/recruiter)
- **Company**: recruiter-owned organization profile
- **Job**: job postings associated with a company
- **Application**: applicant → job relationship (status, resume, etc.)

> For exact endpoints, see `backend/routes/*.route.js`.

---

## Claude Prompt (Major Project Documentation)

Copy/paste the following prompt into Claude to generate a **complete “Major Project File”** (project report) for NextHire.

```text
You are a senior software engineer and technical writer.

Generate a professional “Major Project File / Project Report” for the project described below.
The report must be suitable for academic submission and include diagrams (ASCII/mermaid), module explanations, and clear step-by-step working.

PROJECT CONTEXT
- Name: NextHire
- Type: Full-stack job portal (MERN)
- Roles: Applicant and Recruiter (role-based access)
- Frontend: React (Vite), Redux Toolkit, React Router, Tailwind CSS, Radix UI
- Backend: Node.js, Express, MongoDB (Mongoose)
- Auth: JWT stored in HTTP-only cookies; protected routes via middleware
- Uploads: Multer + Cloudinary
- Security: Helmet, CORS, express-rate-limit; compression
- Live URL: https://next-hire-phi-ten.vercel.app

REPOSITORY STRUCTURE (HIGH LEVEL)
- backend/
  - routes/ -> controllers/ -> models/ -> MongoDB
  - middlewares/: isAuthenticated, multer, errorHandler
  - utils/: db connection and cloudinary config
- frontend/
  - src/components/: Home, admin, auth, shared
  - src/redux/: slices + store
  - src/hooks/, src/utils/

REQUIREMENTS FOR THE REPORT
1) Title page content (project title, author placeholder, date)
2) Abstract
3) Problem statement + objectives
4) Scope (in-scope / out-of-scope)
5) Literature/market survey (brief)
6) System requirements (H/W, S/W)
7) Architecture
   - Provide a clear architecture diagram (mermaid preferred)
   - Explain frontend-backend integration
8) Modules
   - Authentication module
   - Job module
   - Company module
   - Application module
   - Admin/Recruiter dashboard module
   For each: purpose, key components, data flow
9) Database design
   - Entities and relationships
   - Sample schemas (high level)
10) API design
   - Provide a representative endpoint list and request/response examples (generic but realistic)
11) Working / Execution flow
   - End-to-end flows: signup/login, post job, apply job, view applicants
12) Testing strategy (unit/integration/e2e) + sample test cases table
13) Security considerations
14) Deployment
   - Local setup
   - Production deployment overview (Vercel/Render/etc. as assumptions if needed)
15) Limitations
16) Future enhancements
17) Conclusion
18) References

STYLE
- Use clear headings and professional formatting.
- Use bullet lists and tables where useful.
- Keep it self-contained.

If any detail is missing, make reasonable assumptions and clearly label them as assumptions.
```

---

## Roadmap

Planned improvements (from the project notes):
- Short-lived access tokens + refresh rotation
- Redis caching for job listings
- Async uploads via background queue
- Structured logging (Winston/Pino)
- MongoDB indexes for filters
- TypeScript migration
- SSR migration (Next.js) for SEO

---

## License

No license file is present in this repository yet. If you plan to open-source the project, consider adding an OSI-approved license (e.g., MIT).
