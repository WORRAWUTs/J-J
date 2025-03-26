import { useNavigate } from "react-router-dom";
import "./styles/Ticket.css"; // หรือไฟล์ CSS ที่คุณใช้
import Sidebar from "./components/Sidebar";
import Headerbar from "./components/Headerbar";

function Ticket() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <Sidebar />
      <div className="main-content">
        <Headerbar />
        <div className="content-area">
          <h1 className="page-title">TICKET</h1>
          <div className="icon-grid">
            {/* ไอคอน History */}
            <div
              className="icon-item"
              onClick={() => navigate("/ticket/history")}
            >
              <img src="/image/hist.png" alt="history" className="icon-image" />
              <div className="icon-label">History</div>
            </div>
            {/* ไอคอน Create ticket */}
            <div
              className="icon-item"
              onClick={() => navigate("/ticket/Create ticket")}
            >
              <img
                src="/image/create.png"
                alt="create ticket"
                className="icon-image"
              />
              <div className="icon-label">Create ticket</div>
            </div>
            {/* ไอคอน In progress */}
            <div
              className="icon-item"
              onClick={() => navigate("/ticket/inprogress")}
            >
              <img
                src="/image/inpro.png"
                alt="in progress"
                className="icon-image"
              />
              <div className="icon-label">In progress</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ticket;
