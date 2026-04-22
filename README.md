# AccessGuard 🔐

A role-based access control (RBAC) system built with FastAPI and React TypeScript.
Supports three permission levels with JWT authentication, audit logging, and an 
admin dashboard.

## Live Demo
- Frontend: https://access-guard-pied.vercel.app
- API Docs: https://access-guard-n38c.onrender.com/docs

## Features
- JWT authentication with bcrypt password hashing
- Three role levels: Admin, Member, Viewer
- Role-aware UI — components render based on user permissions
- Audit logging — every action is recorded with timestamp and user
- Admin panel for user management and role assignment
- SQLite database with SQLAlchemy ORM

## Tech Stack
**Backend:** Python, FastAPI, SQLAlchemy, SQLite, JWT, bcrypt  
**Frontend:** React, TypeScript, Vite, React Router, Axios

## API Endpoints
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /auth/register | Public | Register new user |
| POST | /auth/login | Public | Login, returns JWT |
| GET | /users | Admin | Get all users |
| PUT | /users/{id}/role | Admin | Update user role |
| GET | /audit-logs | Admin | View all audit logs |
| GET | /resources | Member+ | View resources |

## Run Locally
### Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

### Frontend
cd frontend
npm install
npm run dev

## Why I Built This
Access control is a core concept in cloud security products. I built this to 
understand how real-world permission systems work — from token-based auth to 
role-aware frontends.
