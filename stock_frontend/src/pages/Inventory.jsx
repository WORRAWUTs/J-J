// src/pages/Inventory.jsx
import { Link } from "react-router-dom";
import "./styles/Inventory.css";
import Sidebar from "./components/Sidebar";
import Headerbar from "./components/Headerbar";

function Inventory() {
  return (
    <div className="home-container">
      <Sidebar />
      <div className="main-content">
        <Headerbar />
        <div className="content-area">
          <h1 className="page-title">INVENTORY</h1>

          {/* ส่วนลิงก์ 3 ตัว: LOCATION, TEST, STATUS */}
          <div className="inventory-links">
            <Link to="/inventory/location" className="inventory-link">
              LOCATION
            </Link>
            <Link to="/inventory/test" className="inventory-link">
              TEST
            </Link>
            <Link to="/inventory/status" className="inventory-link">
              STATUS
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
