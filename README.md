# Xnote - AI-Powered Notes Application

Xnote is a full-stack note-taking application that uses machine learning (NLP) to analyze the sentiment of notes. Built with FastAPI, Next.js, and SQLite, it provides a modern and secure way to manage your notes with real-time sentiment analysis.


## Features

- Create and manage notes with title and content
- View all your notes in a clean, responsive interface
- Analyze the sentiment of notes (positive, neutral, or negative)
- JWT authentication for API security
- Responsive design that works on desktop and mobile
- Containerized with Docker for easy deployment

## Tech Stack

### Backend
- FastAPI - High-performance Python framework
- SQLite - Lightweight database
- TextBlob - NLP library for sentiment analysis
- JWT Authentication - Secure API access
- Pytest - Testing framework

### Frontend
- Next.js - React framework
- Tailwind CSS - Utility-first CSS framework
- Axios - HTTP client
- React Hook Form - Form validation
- Jest - Testing framework

### DevOps
- Docker - Containerization
- Docker Compose - Multi-container orchestration
- GitHub Actions - CI/CD pipeline

## Getting Started

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/en/) (v18 or later)
- [Python](https://www.python.org/downloads/) (v3.10 or later)

### Running with Docker Compose (Recommended)

The easiest way to run the application is with Docker Compose:

```bash
# Clone the repository
git clone https://github.com/muraleekrishnahs/Xnote
cd xnote

# Start the application
docker-compose up
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Running Locally (Development)

#### Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Run the application
uvicorn app.main:app --reload
```

#### Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

## API Documentation

When the backend is running, you can access the Swagger UI documentation at:
- http://localhost:8000/docs

The API provides the following endpoints:

- `POST /token` - Get authentication token
- `POST /notes/` - Create a new note
- `GET /notes/` - Get all notes
- `GET /notes/{id}` - Get a note by ID
- `GET /notes/{id}/analyze` - Analyze sentiment of a note
- `PUT /notes/{id}` - Update a note by ID
- `DELETE /notes/{id}` - Delete a note by ID


## Authentication

Use these demo credentials to log in:
- Username: `admin`
- Password: `password`

## Testing

### Backend Tests

```bash
cd backend
python -m pytest -v app/tests/
```

### Frontend Tests

```bash
cd frontend
npm test
```

## CI/CD Pipeline

The project includes a GitHub Actions workflow that:
1. Runs backend tests
2. Runs frontend tests
3. Builds and validates Docker images

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/)
- [Next.js](https://nextjs.org/)
- [TextBlob](https://textblob.readthedocs.io/)
- [Tailwind CSS](https://tailwindcss.com/)