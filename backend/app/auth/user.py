from passlib.context import CryptContext
from fastapi import HTTPException, status
from pydantic import BaseModel
from typing import Optional

# Hardcoded dummyyy user. Ideally, this would be stored in a database
DUMMY_USER = {
    "username": "admin",
    "email": "admin@example.com",
    "hashed_password": "$2b$12$b.97.L2k3LM0A0uY07WsE.0aI244izRBMtEq9PFxgO3OTU2p3.D9y" 
}

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserInDB(BaseModel):
    username: str
    email: str
    hashed_password: str

class User(BaseModel):
    username: str
    email: str

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user(username: str):
    if username == DUMMY_USER["username"]:
        return UserInDB(**DUMMY_USER)
    return None

def authenticate_user(username: str, password: str):
    user = get_user(username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user 