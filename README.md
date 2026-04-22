# AccessGuard 🔐

A role-based access control (RBAC) system built with FastAPI and React.

## Features
- JWT Authentication (register/login)
- Role-based access: Admin, Member, Viewer
- Resource management with permission levels
- Audit logging for all actions
- Admin panel for user management

## Tech Stack
**Backend:** Python, FastAPI, SQLAlchemy, SQLite, JWT, bcrypt  
**Frontend:** React, TypeScript, Vite, React Router, Axios

## Running locally

### Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload


### Frontend
cd frontend
npm install
npm run dev
