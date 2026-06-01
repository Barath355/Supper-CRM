import { Link, useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
              SC
            </span>
            <span className="text-lg font-semibold text-slate-900">Support CRM</span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              to="/"
              className={`text-sm font-medium ${
                pathname === "/" ? "text-brand-600" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Tickets
            </Link>
            <Link to="/tickets/new" className="btn-primary">
              New Ticket
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
