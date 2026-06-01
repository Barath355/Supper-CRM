# Support CRM

A full-stack customer support ticketing system built for the Datastraw Technologies intern assessment.

**Stack:** Python · FastAPI · SQLite · React · Tailwind CSS

## Features

- Create support tickets with auto-generated IDs (`TKT-001`, …)
- List all tickets with search (name, email, ID, description) and status filter
- View ticket details with notes history
- Update ticket status and add comments

## Project Structure

```
support-crm/
├── app/                 # FastAPI backend
│   ├── main.py          # API routes + static file serving
│   ├── models.py        # SQLAlchemy models (tickets, notes)
│   ├── schemas.py       # Pydantic request/response models
│   └── database.py      # DB connection
├── frontend/            # React + Vite + Tailwind
│   └── src/
├── requirements.txt
├── Dockerfile
└── railway.toml
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tickets` | Create ticket |
| GET | `/api/tickets` | List tickets (`?status=` `?search=`) |
| GET | `/api/tickets/{ticket_id}` | Ticket detail + notes |
| PUT | `/api/tickets/{ticket_id}` | Update status / add note |
| GET | `/api/health` | Health check |

## Local Development

### Prerequisites

- Python 3.11+
- Node.js 18+

### 1. Backend

```bash
cd "support - crm"
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend (separate terminal)

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** — Vite proxies `/api` to the backend.

### Production build (single server)

```bash
cd frontend && npm install && npm run build && cd ..
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Open **http://localhost:8000** — FastAPI serves the React build and API.

## Deploy to Railway

1. Push this repo to GitHub.
2. Create a project at [railway.app](https://railway.app) → **Deploy from GitHub**.
3. Railway uses `railway.toml` to install Python + Node, build the frontend, and start Uvicorn.
4. Set environment variable `CORS_ORIGINS` to your Railway URL if needed.
5. For persistent SQLite data, add a **Volume** mounted at `/app` (otherwise data resets on redeploy).

Alternative: deploy with Docker:

```bash
docker build -t support-crm .
docker run -p 8000:8000 support-crm
```

## Environment Variables

See `.env.example`:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | SQLite path (default: `sqlite:///./support_crm.db`) |
| `CORS_ORIGINS` | Allowed CORS origins (comma-separated) |
| `PORT` | Server port (set by Railway automatically) |

## Demo Video Checklist

1. Create a ticket
2. Search and filter on the home page
3. Open ticket detail, change status, add a note
4. Brief code walkthrough (API + DB + React pages)
5. Mention deployment URL and tech choices

## License

MIT — built for educational / assessment purposes.
