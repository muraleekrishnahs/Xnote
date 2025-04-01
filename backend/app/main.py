from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import notes, auth
from .models.database import create_tables
from .services.sentiment_analyzer import download_nltk_data

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
    create_tables()
    
    # Download required NLTK data for TextBlob
    download_nltk_data()

@app.get("/")
async def root():
    return {
        "message": "Welcome to Xnote API", 
        "docs": "/docs",
        "version": "1.0.0"
    } 