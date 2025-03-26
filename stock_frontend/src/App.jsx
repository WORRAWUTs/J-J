// ตัวอย่าง App.jsx
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Warranty from "./pages/Warranty";
import WarrantyRegister from "./pages/WarrantyRegister";
import WarrantyDashboard from "./pages/WarrantyDashboard";
import Ticket from "./pages/Ticket";
import TicketCreate from "./pages/TicketCreate";
import TicketCreateConfirm from "./pages/TicketCreateConfirm";
import TicketHistory from "./pages/TicketHistory";
import TicketHistoryView from "./pages/TicketHistoryView";
import TicketInProgress from "./pages/TicketInProgress";
import TicketInProgressView from "./pages/TicketInProgressView";
import TicketCompletedView from "./pages/TicketCompletedView";
import TicketReturn from "./pages/TicketReturn";
import Inventory from "./pages/Inventory";
import InventoryLocation from "./pages/InventoryLocation";
import InventoryLocation1st from "./pages/InventoryLocation1st";
import InventoryLocation3rd from "./pages/InventoryLocation3rd";
import InventoryLocationFaulty from "./pages/InventoryLocationFaulty";
import InventoryTest from "./pages/InventoryTest";
import InventoryStatus from "./pages/InventoryStatus";
import User from "./pages/User";
import Notification from "./pages/Notification";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route path="/home" element={<Home />} />
      <Route path="/warranty" element={<Warranty />} />
      <Route path="/warranty/WarrantyRegister" element={<WarrantyRegister />} />
      <Route path="/ticket" element={<Ticket />} />
      <Route path="/ticket/Create ticket" element={<TicketCreate />} />
      <Route path="/ticket/create/confirm" element={<TicketCreateConfirm />} />
      <Route path="/ticket/history" element={<TicketHistory />} />
      <Route path="/ticket/history/view" element={<TicketHistoryView />} />
      <Route path="/ticket/inprogress" element={<TicketInProgress />} />
      <Route
        path="/ticket/inprogress/view/:ticketNumber"
        element={<TicketInProgressView />}
      />
      <Route
        path="/ticket/completed/view/:ticketNumber"
        element={<TicketCompletedView />}
      />
      <Route
        path="/ticket/inprogress/return/:ticketNumber"
        element={<TicketReturn />}
      />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/inventory/location" element={<InventoryLocation />} />
      <Route
        path="/inventory/location/1st"
        element={<InventoryLocation1st />}
      />
      <Route
        path="/inventory/location/3rd"
        element={<InventoryLocation3rd />}
      />
      <Route
        path="/inventory/location/faulty"
        element={<InventoryLocationFaulty />}
      />
      <Route path="/inventory/test" element={<InventoryTest />} />
      <Route path="/inventory/status" element={<InventoryStatus />} />
      <Route path="/user" element={<User />} />
      <Route path="/notification" element={<Notification />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route
        path="/warranty/WarrantyDashboard"
        element={<WarrantyDashboard />}
      />
    </Routes>
  );
}

export default App;
