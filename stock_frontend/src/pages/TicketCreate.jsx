// src/pages/TicketCreate.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/TicketCreate.css";
import Sidebar from "./components/Sidebar";
import Headerbar from "./components/Headerbar";

function TicketCreate() {
  const navigate = useNavigate();

  // State สำหรับเก็บข้อมูลฟอร์ม
  const [part, setPart] = useState("");
  const [serial, setSerial] = useState("");
  const [use_location, setUseLocation] = useState("");
  const [use_date, setUseDate] = useState("");
  const [use_time, setUseTime] = useState("");

  // ฟังก์ชันกดปุ่ม Next
  const handleNext = async (e) => {
    e.preventDefault();
    try {
      // เรียก API ดึงข้อมูล product, warranty จาก DB
      const response = await fetch(
        `http://localhost:5000/api/inventory/info?part=${part}&serial=${serial}`
      );
      const result = await response.json();
      if (result.success) {
        const { product, warranty } = result.data;
        // product, warranty ที่ได้จาก DB

        // ส่งข้อมูลทั้งหมดไป Step 2
        navigate("/ticket/create/step2", {
          state: {
            part,
            serial,
            use_location,
            use_date,
            use_time,
            product,
            warranty,
          },
        });
      } else {
        alert(result.message || "ไม่พบข้อมูลใน DB");
      }
    } catch (error) {
      console.error(error);
      alert("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
    }
  };

  return (
    <div className="home-container">
      <Sidebar />
      <div className="main-content">
        <Headerbar />
        <div className="content-area">
          <h1 className="page-title">TICKET / Create ticket</h1>

          <div className="ticket-box">
            <h3>กรอกรายละเอียด ticket</h3>

            <div className="form-row">
              <label>Part :</label>
              <input
                type="text"
                placeholder="Part"
                value={part}
                onChange={(e) => setPart(e.target.value)}
              />
            </div>

            <div className="form-row">
              <label>Serial :</label>
              <input
                type="text"
                placeholder="Serial"
                value={serial}
                onChange={(e) => setSerial(e.target.value)}
              />
            </div>

            <div className="form-row">
              <label>สถานที่ใช้งาน :</label>
              <input
                type="text"
                placeholder="Use location"
                value={use_location}
                onChange={(e) => setUseLocation(e.target.value)}
              />
            </div>

            <div className="form-row">
              <label>วันที่ใช้งาน :</label>
              <input
                type="date"
                value={use_date}
                onChange={(e) => setUseDate(e.target.value)}
              />
            </div>

            <div className="form-row">
              <label>เวลา :</label>
              <input
                type="time"
                value={use_time}
                onChange={(e) => setUseTime(e.target.value)}
              />
            </div>

            <button className="next-button" onClick={handleNext}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketCreate;
