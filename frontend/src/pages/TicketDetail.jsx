import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";
import StatusBadge from "../components/StatusBadge";

const STATUSES = ["Open", "In Progress", "Closed"];

function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function TicketDetail() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Open");
  const [noteText, setNoteText] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const loadTicket = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.getTicket(ticketId);
      setTicket(data);
      setStatus(data.status);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    loadTicket();
  }, [loadTicket]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg("");
    setError("");
    try {
      await api.updateTicket(ticketId, {
        status,
        notes: noteText.trim() || undefined,
      });
      setNoteText("");
      setSaveMsg("Ticket updated successfully.");
      await loadTicket();
    } catch (err) {
      setError(typeof err.message === "string" ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center text-sm text-slate-500">Loading ticket...</div>;
  }

  if (error && !ticket) {
    return (
      <div>
        <Link to="/" className="text-sm font-medium text-brand-600 hover:text-brand-700">
          &larr; Back to tickets
        </Link>
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Link to="/" className="text-sm font-medium text-brand-600 hover:text-brand-700">
          &larr; Back to tickets
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <h1 className="font-mono text-2xl font-bold text-slate-900">{ticket.ticket_id}</h1>
          <StatusBadge status={ticket.status} />
        </div>

        <p className="mt-1 text-lg font-medium text-slate-800">{ticket.subject}</p>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Customer
          </h2>
          <p className="mt-2 font-medium text-slate-900">{ticket.customer_name}</p>
          <a
            href={`mailto:${ticket.customer_email}`}
            className="text-sm text-brand-600 hover:text-brand-700"
          >
            {ticket.customer_email}
          </a>

          <h2 className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Description
          </h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
            {ticket.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-500">
            <span>Created: {formatDate(ticket.created_at)}</span>
            <span>Updated: {formatDate(ticket.updated_at)}</span>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-slate-900">Notes & Comments</h2>
          {ticket.notes.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">No notes yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {ticket.notes.map((note, i) => (
                <li
                  key={`${note.created_at}-${i}`}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm"
                >
                  <p className="text-sm text-slate-700">{note.note_text}</p>
                  <p className="mt-1 text-xs text-slate-400">{formatDate(note.created_at)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div>
        <form
          onSubmit={handleUpdate}
          className="sticky top-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-900">Update Ticket</h2>

          {error && (
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          {saveMsg && (
            <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {saveMsg}
            </div>
          )}

          <div className="mt-4">
            <label htmlFor="status" className="label-field">
              Status
            </label>
            <select
              id="status"
              className="input-field"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label htmlFor="note" className="label-field">
              Add Note
            </label>
            <textarea
              id="note"
              rows={4}
              className="input-field resize-y"
              placeholder="Internal note or comment..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary mt-4 w-full" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
