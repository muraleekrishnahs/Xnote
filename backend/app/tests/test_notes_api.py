import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from ..main import app
from ..models.database import Base, get_db
from ..auth.jwt_handler import create_access_token

# Setup test database
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override the get_db dependency
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

# Create test client
client = TestClient(app)

# Create test token
test_token = create_access_token(data={"sub": "testuser"})
headers = {"Authorization": f"Bearer {test_token}"}

@pytest.fixture(autouse=True)
def setup_database():
    # Create the database tables
    Base.metadata.create_all(bind=engine)
    yield
    # Drop the database tables
    Base.metadata.drop_all(bind=engine)

def test_create_note():
    response = client.post(
        "/notes/",
        json={"title": "Test Note", "content": "This is a test note content."},
        headers=headers
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Note"
    assert data["content"] == "This is a test note content."
    assert "id" in data
    assert "sentiment" in data

def test_get_notes():
    # First create a note
    client.post(
        "/notes/",
        json={"title": "Test Note", "content": "This is a test note content."},
        headers=headers
    )
    
    # Now get all notes
    response = client.get("/notes/", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert data[0]["title"] == "Test Note"

def test_get_note():
    # First create a note
    create_response = client.post(
        "/notes/",
        json={"title": "Test Note", "content": "This is a test note content."},
        headers=headers
    )
    note_id = create_response.json()["id"]
    
    # Now get the note by ID
    response = client.get(f"/notes/{note_id}", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == note_id
    assert data["title"] == "Test Note"

def test_analyze_note():
    # First create a note
    create_response = client.post(
        "/notes/",
        json={"title": "Happy Note", "content": "I am very happy with this note. It's great!"},
        headers=headers
    )
    note_id = create_response.json()["id"]
    
    # Now analyze the note
    response = client.get(f"/notes/{note_id}/analyze", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "sentiment" in data
    assert data["sentiment"] in ["positive", "negative", "neutral"] 