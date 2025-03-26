// src/components/Sidebar.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/Home.css";

function Sidebar() {
  const navigate = useNavigate();

  // State สำหรับ popup Setting
  const [showSetting, setShowSetting] = useState(false);

  // State สำหรับ Dark mode
  const [darkMode, setDarkMode] = useState(false);

  // เปิดป๊อปอัพ Setting
  const handleOpenSetting = () => {
    setShowSetting(true);
  };

  // ปิดป๊อปอัพ Setting
  const handleCloseSetting = () => {
    setShowSetting(false);
  };

  // Toggle Dark Mode จริง ๆ
  const handleToggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    // ถ้าเปิด darkMode -> เพิ่ม class "dark-mode" ให้ <body>
    // ถ้าปิด -> ลบ class
    if (newDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  };

  return (
    <div className="home-container">
      {/* Sidebar ด้านซ้าย */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <img src="/image/axentel logo.png" alt="logo" />
        </div>
        <ul className="sidebar-menu">
          <li className="menu-item active" onClick={() => navigate("/home")}>
            <img src="/image/hom.png" alt="home icon" className="menu-icon" />
            <span>HOME</span>
          </li>
          <li className="menu-item" onClick={() => navigate("/dashboard")}>
            <img
              src="/image/dashboard.png"
              alt="dashboard"
              className="menu-icon"
            />
            <span>DASHBOARD</span>
          </li>
          <li className="menu-item" onClick={() => navigate("/notification")}>
            <img
              src="/image/noti.png"
              alt="notification"
              className="menu-icon"
            />
            <span>NOTIFICATION</span>
          </li>
          <li className="menu-item" onClick={handleOpenSetting}>
            <img src="/image/set.png" alt="setting" className="menu-icon" />
            <span>SETTING</span>
          </li>
        </ul>
      </div>
      {/* Popup Setting */}
      {showSetting && (
        <div className="popup-overlay">
          <div className="popup-content setting-popup">
            {/* ปุ่มกากบาทปิด */}
            <span className="close-icon" onClick={handleCloseSetting}>
              ×
            </span>
            <h2 className="popup-title">Setting</h2>

            <div className="darkmode-row">
              <label className="darkmode-label">Dark mode</label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={handleToggleDarkMode}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
