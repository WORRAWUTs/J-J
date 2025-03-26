// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import {} from "react-router-dom";
import * as XLSX from "xlsx"; // ใช้ xlsx (npm install xlsx) เพื่อ export Excel
import "./styles/Dashboard.css";
import Sidebar from "./components/Sidebar";
import Headerbar from "./components/Headerbar";

function DashboardPage() {
  // State สำหรับเก็บตัวเลขสรุป
  const [partUsed, setPartUsed] = useState(0);
  const [partReturned, setPartReturned] = useState(0);
  const [faultyPart, setFaultyPart] = useState(0);
  const [warrantyNear, setWarrantyNear] = useState(0);
  const [warrantyExpired, setWarrantyExpired] = useState(0);

  useEffect(() => {
    // ตัวอย่าง Mock Data หรือ fetch จาก backend
    // สมมติเรียก /api/dashboard -> ส่งกลับ JSON { partUsed:..., partReturned:..., ...}
    // ตัวอย่าง mock
    const dummyData = {
      partUsed: 40,
      partReturned: 5,
      faultyPart: 23,
      warrantyNear: 10,
      warrantyExpired: 2,
    };

    setPartUsed(dummyData.partUsed);
    setPartReturned(dummyData.partReturned);
    setFaultyPart(dummyData.faultyPart);
    setWarrantyNear(dummyData.warrantyNear);
    setWarrantyExpired(dummyData.warrantyExpired);
  }, []);

  // ฟังก์ชัน Export Excel
  const handleExportExcel = () => {
    // สร้าง data ในรูปแบบ array of objects เพื่อใช้กับ XLSX
    const dataForExcel = [
      {
        label: "Part ที่ถูกใช้ไป",
        value: partUsed,
      },
      {
        label: "Part ที่ได้กลับคืน",
        value: partReturned,
      },
      {
        label: "Faulty part",
        value: faultyPart,
      },
      {
        label: "Part ใกล้หมดประกันใน 30 วัน",
        value: warrantyNear,
      },
      {
        label: "Part หมดประกันแล้ว",
        value: warrantyExpired,
      },
    ];

    // สร้าง Worksheet จาก data
    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    // สร้าง Workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dashboard");

    // แปลง workbook เป็น binary
    XLSX.writeFile(workbook, "dashboard_data.xlsx");
  };

  return (
    <div className="home-container">
      <Sidebar />
      <div className="main-content">
        <Headerbar />
        <div className="content-area">
          <h1 className="page-title">DASH BOARD</h1>

          <div className="summary-row">
            {/* กล่องสรุป Part ที่ถูกใช้ไป */}
            <div className="summary-card">
              <div className="summary-label">Part ที่ถูกใช้ไป</div>
              <div className="summary-value">{partUsed} ชิ้น</div>
            </div>

            {/* กล่องสรุป Part ที่ได้กลับคืน */}
            <div className="summary-card">
              <div className="summary-label">Part ที่ได้กลับคืน</div>
              <div className="summary-value">{partReturned} ชิ้น</div>
            </div>

            {/* กล่องสรุป Faulty part */}
            <div className="summary-card">
              <div className="summary-label">Faulty part</div>
              <div className="summary-value">{faultyPart} ชิ้น</div>
            </div>

            {/* กล่องสรุป Part ใกล้หมดประกันใน 30 วัน */}
            <div className="summary-card">
              <div className="summary-label">Part ใกล้หมดประกันใน 30 วัน</div>
              <div className="summary-value">{warrantyNear} ชิ้น</div>
            </div>

            {/* กล่องสรุป Part หมดประกันแล้ว */}
            <div className="summary-card">
              <div className="summary-label">Part หมดประกันแล้ว</div>
              <div className="summary-value">{warrantyExpired} ชิ้น</div>
            </div>
          </div>

          {/* ปุ่ม export Excel มุมขวาล่าง */}
          <button className="export-button" onClick={handleExportExcel}>
            Export to Excel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;

/*
useEffect(() => {
  fetch("/api/dashboard")
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        const data = result.data;
        setPartUsed(data.partUsed);
        setPartReturned(data.partReturned);
        setFaultyPart(data.faultyPart);
        setWarrantyNear(data.warrantyNear);
        setWarrantyExpired(data.warrantyExpired);
      } else {
        alert(result.message || "เกิดข้อผิดพลาด");
      }
    })
    .catch(err => {
      console.error(err);
      alert("ไม่สามารถติดต่อเซิร์ฟเวอร์");
    });
}, []);
*/
