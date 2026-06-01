import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import CreateTicket from "./pages/CreateTicket";
import TicketDetail from "./pages/TicketDetail";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tickets/new" element={<CreateTicket />} />
        <Route path="/tickets/:ticketId" element={<TicketDetail />} />
      </Routes>
    </Layout>
  );
}
