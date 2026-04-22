from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, users, resources, audit

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AccessGuard API",
    description="RBAC based access control system",
    version="1.0.0"
)

# CORS - must be before routers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(resources.router)
app.include_router(audit.router)

@app.get("/")
def root():
    return {"message": "AccessGuard API is running 🔐"}