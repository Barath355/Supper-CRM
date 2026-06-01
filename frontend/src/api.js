const API_BASE = import.meta.env.VITE_API_URL || "";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    const detail = err.detail;
    const message = Array.isArray(detail)
      ? detail.map((d) => d.msg || JSON.stringify(d)).join(", ")
      : detail || "Request failed";
    throw new Error(message);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  listTickets: (params = {}) => {
    const q = new URLSearchParams();
    if (params.status) q.set("status", params.status);
    if (params.search) q.set("search", params.search);
    const qs = q.toString();
    return request(`/api/tickets${qs ? `?${qs}` : ""}`);
  },
  getTicket: (ticketId) => request(`/api/tickets/${encodeURIComponent(ticketId)}`),
  createTicket: (data) =>
    request("/api/tickets", { method: "POST", body: JSON.stringify(data) }),
  updateTicket: (ticketId, data) =>
    request(`/api/tickets/${encodeURIComponent(ticketId)}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};
