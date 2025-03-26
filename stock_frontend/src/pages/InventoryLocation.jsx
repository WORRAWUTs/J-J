// src/pages/InventoryLocation.jsx
import { Link } from "react-router-dom";
import "./styles/InventoryLocation.css";
import Sidebar from "./components/Sidebar";
import Headerbar from "./components/Headerbar";

function InventoryLocation() {
  return (
    <div className="home-container">
      <Sidebar />
      <div className="main-content">
        <Headerbar />
        <div className="content-area">
          <h1 className="page-title">INVENTORY / LOCATION</h1>

          <div className="location-links">
            <Link to="/inventory/location/1st" className="location-link">
              1st floor
            </Link>
            <Link to="/inventory/location/3rd" className="location-link">
              3rd floor
            </Link>
            <Link to="/inventory/location/faulty" className="location-link">
              Faulty
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InventoryLocation;
