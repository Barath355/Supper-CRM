from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field

StatusType = Literal["Open", "In Progress", "Closed"]


class TicketCreate(BaseModel):
    customer_name: str = Field(..., min_length=1, max_length=255)
    customer_email: EmailStr
    subject: str = Field(..., min_length=1, max_length=500)
    description: str = Field(..., min_length=1)


class TicketCreateResponse(BaseModel):
    ticket_id: str
    created_at: datetime

    model_config = {"from_attributes": True}


class TicketListItem(BaseModel):
    ticket_id: str
    customer_name: str
    subject: str
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class NoteItem(BaseModel):
    note_text: str
    created_at: datetime

    model_config = {"from_attributes": True}


class TicketDetail(BaseModel):
    ticket_id: str
    customer_name: str
    customer_email: str
    subject: str
    description: str
    status: str
    created_at: datetime
    updated_at: datetime
    notes: list[NoteItem]

    model_config = {"from_attributes": True}


class TicketUpdate(BaseModel):
    status: StatusType | None = None
    notes: str | None = None


class TicketUpdateResponse(BaseModel):
    success: bool
    updated_at: datetime
