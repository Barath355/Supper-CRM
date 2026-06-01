import os
from datetime import datetime, timezone
from pathlib import Path

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.database import Base, engine, get_db
from app.models import Note, Ticket, utc_now
from app.schemas import (
    TicketCreate,
    TicketCreateResponse,
    TicketDetail,
    TicketListItem,
    TicketUpdate,
    TicketUpdateResponse,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Support CRM", version="1.0.0")

origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:8080").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def generate_ticket_id(db: Session) -> str:
    last = db.query(Ticket).order_by(Ticket.id.desc()).first()
    if last and last.ticket_id.startswith("TKT-"):
        try:
            next_num = int(last.ticket_id.split("-", 1)[1]) + 1
        except ValueError:
            next_num = last.id + 1
    else:
        next_num = 1
    return f"TKT-{next_num:03d}"


@app.post("/api/tickets", response_model=TicketCreateResponse, status_code=201)
def create_ticket(payload: TicketCreate, db: Session = Depends(get_db)):
    ticket_id = generate_ticket_id(db)
    now = utc_now()
    ticket = Ticket(
        ticket_id=ticket_id,
        customer_name=payload.customer_name.strip(),
        customer_email=str(payload.customer_email).strip(),
        subject=payload.subject.strip(),
        description=payload.description.strip(),
        status="Open",
        created_at=now,
        updated_at=now,
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return TicketCreateResponse(ticket_id=ticket.ticket_id, created_at=ticket.created_at)


@app.get("/api/tickets", response_model=list[TicketListItem])
def list_tickets(
    status: str | None = Query(None, description="Filter by status"),
    search: str | None = Query(None, description="Search across fields"),
    db: Session = Depends(get_db),
):
    query = db.query(Ticket)

    if status:
        query = query.filter(Ticket.status == status)

    if search:
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Ticket.ticket_id.ilike(term),
                Ticket.customer_name.ilike(term),
                Ticket.customer_email.ilike(term),
                Ticket.subject.ilike(term),
                Ticket.description.ilike(term),
            )
        )

    tickets = query.order_by(Ticket.created_at.desc()).all()
    return tickets


@app.get("/api/tickets/{ticket_id}", response_model=TicketDetail)
def get_ticket(ticket_id: str, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket


@app.put("/api/tickets/{ticket_id}", response_model=TicketUpdateResponse)
def update_ticket(ticket_id: str, payload: TicketUpdate, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    if payload.status is None and not payload.notes:
        raise HTTPException(status_code=400, detail="Provide status and/or notes to update")

    if payload.status is not None:
        ticket.status = payload.status

    if payload.notes and payload.notes.strip():
        note = Note(
            ticket_id=ticket.ticket_id,
            note_text=payload.notes.strip(),
            created_at=utc_now(),
        )
        db.add(note)

    ticket.updated_at = utc_now()
    db.commit()
    db.refresh(ticket)
    return TicketUpdateResponse(success=True, updated_at=ticket.updated_at)


@app.get("/api/health")
def health():
    return {"status": "ok"}


static_dir = Path(__file__).resolve().parent.parent / "frontend" / "dist"
if static_dir.exists():
    app.mount("/assets", StaticFiles(directory=static_dir / "assets"), name="assets")

    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        if full_path.startswith("api"):
            raise HTTPException(status_code=404, detail="Not found")
        file_path = static_dir / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(static_dir / "index.html")
