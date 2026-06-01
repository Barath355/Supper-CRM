import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function CreateTicket() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    subject: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const result = await api.createTicket(form);
      navigate(`/tickets/${result.ticket_id}`);
    } catch (err) {
      setError(typeof err.message === "string" ? err.message : "Failed to create ticket");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <Link to="/" className="text-sm font-medium text-brand-600 hover:text-brand-700">
          &larr; Back to tickets
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Create New Ticket</h1>
        <p className="mt-1 text-sm text-slate-600">Submit a new customer support request.</p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="customer_name" className="label-field">
              Customer Name *
            </label>
            <input
              id="customer_name"
              name="customer_name"
              required
              className="input-field"
              value={form.customer_name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="customer_email" className="label-field">
              Customer Email *
            </label>
            <input
              id="customer_email"
              name="customer_email"
              type="email"
              required
              className="input-field"
              value={form.customer_email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="label-field">
            Issue Title *
          </label>
          <input
            id="subject"
            name="subject"
            required
            className="input-field"
            value={form.subject}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="description" className="label-field">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={5}
            className="input-field resize-y"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Creating..." : "Create Ticket"}
          </button>
          <Link to="/" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
