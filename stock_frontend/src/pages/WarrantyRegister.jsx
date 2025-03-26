// src/pages/WarrantyRegister.jsx
import { useState } from "react";
import "./styles/WarrantyRegister.css";
import Sidebar from "./components/Sidebar";
import Headerbar from "./components/Headerbar";

function WarrantyRegister() {
  // สร้าง state สำหรับเก็บข้อมูลแต่ละฟิลด์
  const [part, setPart] = useState("");
  const [serial, setSerial] = useState("");
  const [condition, setCondition] = useState("");
  const [provider, setProvider] = useState("");

  // ฟังก์ชันกดปุ่ม ADD
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/warranty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          part,
          serial,
          condition,
          provider,
        }),
      });
      const result = await response.json();
      if (result.success) {
        alert("บันทึก Warranty สำเร็จ!");
        // หากต้องการนำทางไปหน้าอื่น เช่น /warranty ก็ทำได้
        // navigate("/warranty");
      } else {
        alert(result.message || "เกิดข้อผิดพลาด");
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
          <h2 className="page-title">WARRANTY / ลงทะเบียน warranty</h2>

          {/* กล่องกรอบฟอร์ม */}
          <div className="register-box">
            <div className="form-row">
              <label>Part :</label>
              <input
                type="text"
                placeholder="637875"
                value={part}
                onChange={(e) => setPart(e.target.value)}
              />
            </div>

            <div className="form-row">
              <label>Serial :</label>
              <input
                type="text"
                placeholder="sty5489"
                value={serial}
                onChange={(e) => setSerial(e.target.value)}
              />
            </div>

            <div className="form-row">
              <label>เงื่อนไขการรับประกัน :</label>
              <textarea
                placeholder="ประกัน 1 ปี ครอบคลุมทุกอย่างของ HDD"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              />
            </div>

            <div className="form-row">
              <label>ผู้ให้บริการรับประกัน :</label>
              <input
                type="text"
                placeholder="Axentel"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
              />
            </div>

            <button className="add-button" onClick={handleAdd}>
              ADD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WarrantyRegister;
