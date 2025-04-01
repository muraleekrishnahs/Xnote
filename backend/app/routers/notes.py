from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..models.database import Note, get_db
from ..schemas.note import NoteCreate, NoteResponse, NoteAnalysis
from ..services.sentiment_analyzer import SentimentAnalyzer
from ..auth.jwt_handler import get_current_user

router = APIRouter(
    prefix="/notes",
    tags=["notes"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
def create_note(
    note: NoteCreate, 
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Create a new note with title and content."""
    # Analyze sentiment immediately when creating note
    sentiment = SentimentAnalyzer.analyze(note.content)
    
    db_note = Note(
        title=note.title,
        content=note.content,
        sentiment=sentiment
    )
    
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    
    return db_note

@router.get("/", response_model=List[NoteResponse])
def read_notes(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Get all notes with pagination support."""
    notes = db.query(Note).offset(skip).limit(limit).all()
    return notes

@router.get("/{note_id}", response_model=NoteResponse)
def read_note(
    note_id: int, 
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Get a specific note by ID."""
    note = db.query(Note).filter(Note.id == note_id).first()
    if note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@router.get("/{note_id}/analyze", response_model=NoteAnalysis)
def analyze_note(
    note_id: int, 
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Analyze sentiment of a specific note."""
    note = db.query(Note).filter(Note.id == note_id).first()
    if note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    
    # Perform sentiment analysis
    sentiment = SentimentAnalyzer.analyze(note.content)
    
    # Update the note's sentiment in the database
    note.sentiment = sentiment
    db.commit()
    
    return {"sentiment": sentiment}

@router.put("/{note_id}", response_model=NoteResponse)
def update_note(
    note_id: int,
    note: NoteCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Update an existing note by ID."""
    db_note = db.query(Note).filter(Note.id == note_id).first()
    if db_note is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")

    # Update note fields
    db_note.title = note.title
    db_note.content = note.content
    
    # Re-analyze sentiment on update
    db_note.sentiment = SentimentAnalyzer.analyze(note.content)
    
    db.commit()
    db.refresh(db_note)
    return db_note

@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Delete a note by ID."""
    db_note = db.query(Note).filter(Note.id == note_id).first()
    if db_note is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")

    db.delete(db_note)
    db.commit()
    return None # Return None for 204 No Content status 