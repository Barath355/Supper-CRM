# 🎫 Support CRM

A full-stack customer support ticketing system built for the Datastraw Technologies Internship Assessment.

## Tech Stack

* Backend: FastAPI, SQLAlchemy, SQLite
* Frontend: React, Vite, Tailwind CSS
* Deployment: Railway

## Features

* Create support tickets with auto-generated IDs (`TKT-001`, ...)
* Search tickets by ID, customer name, email, or description
* Filter tickets by status
* View ticket details and note history
* Update ticket status and add comments
* Health check endpoint

## Project Structure

```text
support-crm/
├── app/
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   └── database.py
├── frontend/
├── requirements.txt
├── Dockerfile
└── railway.toml
```

## API Endpoints

| Method | Endpoint                   |
| ------ | -------------------------- |
| POST   | `/api/tickets`             |
| GET    | `/api/tickets`             |
| GET    | `/api/tickets/{ticket_id}` |
| PUT    | `/api/tickets/{ticket_id}` |
| GET    | `/api/health`              |

## Local Setup

### Backend

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```
