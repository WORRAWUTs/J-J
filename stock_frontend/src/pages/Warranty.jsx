// src/pages/Warranty.jsx
import "./styles/Warranty.css"; // ถ้ามีไฟล์ CSS แยก หรือจะใช้ Home.css รวมกันก็ได้
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Headerbar from "./components/Headerbar";

function Warranty() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <Sidebar />
      <div className="main-content">
        <Headerbar />
        <div className="content-area">
          <h1 className="page-title">WARRANTY</h1>
          <div className="icon-grid">
            {/* ไอคอน Dashboard */}
            <div
              className="icon-item"
              onClick={() => navigate("/warranty/WarrantyDashboard")}
            >
              <img
                src="/image/dash war.jpg"
                alt="dashboard"
                className="icon-image"
              />
              <div className="icon-label">Dashboard warranty</div>
            </div>
            {/* ไอคอน ลงทะเบียน */}
            <div
              className="icon-item"
              onClick={() => navigate("/warranty/WarrantyRegister")}
            >
              <img
                src="/image/re war.png"
                alt="register"
                className="icon-image"
              />
              <div className="icon-label">ลงทะเบียน warranty</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Warranty;
