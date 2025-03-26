// src/pages/Home.jsx
import "./styles/Home.css";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Headerbar from "./components/Headerbar";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <Sidebar />
      {/* Header + Content ส่วนขวา */}
      <div className="main-content">
        <Headerbar />
        <div className="content-area">
          {/* โซนบน */}
          <div className="top-section">
            <h1 className="page-title">HOME</h1>
          </div>

          {/* โซนล่าง */}
          <div className="bottom-section">
            <div className="icon-grid">
              <div className="icon-item" onClick={() => navigate("/Inventory")}>
                <img
                  src="/image/inv.png"
                  alt="inventory"
                  className="icon-image"
                />
                <div className="icon-label">INVENTORY</div>
              </div>
              <div className="icon-item" onClick={() => navigate("/ticket")}>
                <img src="/image/tic.png" alt="ticket" className="icon-image" />
                <div className="icon-label">TICKET</div>
              </div>
              <div className="icon-item" onClick={() => navigate("/user")}>
                <img src="/image/user.png" alt="user" className="icon-image" />
                <div className="icon-label">USER</div>
              </div>
              <div className="icon-item" onClick={() => navigate("/warranty")}>
                <img
                  src="/image/war.png"
                  alt="warranty"
                  className="icon-image"
                />
                <div className="icon-label">WARRANTY</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
