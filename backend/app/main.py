from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import notes, auth
from .models.database import create_tables

# Initialize app
app = FastAPI(
    title="Xnote API",
    description="An AI-powered note-taking application API",
    version="1.0.0"
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(notes.router)

@app.on_event("startup")
async def startup_event():
    # Create database tables if they don't exist
    try:
        create_tables()
        print("Database tables created successfully")
    except Exception as e:
        print(f"Error creating database tables: {e}")
        # Continue anyway to allow the API to start

@app.get("/")
async def root():
    # Super simple root endpoint for health check
    return {"status": "ok"} 