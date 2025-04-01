from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime

class NoteBase(BaseModel):
    title: str = Field(..., min_length=1)
    content: str = Field(..., min_length=10)

    @validator('title')
    def title_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError('Title cannot be empty')
        return v

class NoteCreate(NoteBase):
    pass

class NoteResponse(NoteBase):
    id: int
    sentiment: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class NoteAnalysis(BaseModel):
    sentiment: str 