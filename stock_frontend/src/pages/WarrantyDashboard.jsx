// src/pages/WarrantyDashboard.jsx
import { useState, useEffect } from "react";
import "./styles/WarrantyDashboard.css"; // ไฟล์ CSS สำหรับหน้า warranty dashboard
import Sidebar from "./components/Sidebar";
import Headerbar from "./components/Headerbar";

function WarrantyDashboard() {
  // State เก็บรายการ warranty
  const [warranties, setWarranties] = useState([]);
  // State เก็บข้อความค้นหา
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    // สมมติ fetch หรือ mock data
    // ตัวอย่าง dummy data
    const dummyData = [
      {
        id: 1,
        part: "sty5489",
        serial: "sty5489",
        startDate: "15/07/2025",
        endDate: "15/07/2026",
        conditions: "ประกัน 1 ปี ครอบคลุมทุกอย่างของHDD",
        provider: "Axentel",
        status: "Active", // อาจเป็น "Active", "Expiring Soon", "Expired"
      },
      {
        id: 2,
        part: "637875",
        serial: "637875",
        startDate: "15/07/2025",
        endDate: "15/07/2026",
        conditions: "ประกัน 1 ปี",
        provider: "Axentel",
        status: "Expired",
      },
    ];
    setWarranties(dummyData);
  }, []);

  // ฟังก์ชันค้นหา
  const handleSearch = () => {
    // ในระบบจริงอาจ fetch("/api/warranty?search=...") จาก backend
    // ตัวอย่าง: filter ใน memory
    setWarranties((prev) =>
      prev.filter(
        (w) =>
          w.part.toLowerCase().includes(searchText.toLowerCase()) ||
          w.serial.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  };

  return (
    <div className="home-container">
      <Sidebar />
      <div className="main-content">
        <Headerbar />
        <div className="content-area">
          <h1 className="page-title">WARRANTY / Dashboard</h1>

          {/* แถบ Search มุมขวา */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by Part, S/N..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </div>

          {/* ตารางแสดงข้อมูล */}
          <table className="warranty-table">
            <thead>
              <tr>
                <th>Part</th>
                <th>Serial</th>
                <th>เริ่มประกัน</th>
                <th>สิ้นสุดประกัน</th>
                <th>เงื่อนไข</th>
                <th>ผู้ให้บริการ</th>
                <th>สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {warranties.map((item) => (
                <tr key={item.id}>
                  <td>{item.part}</td>
                  <td>{item.serial}</td>
                  <td>{item.startDate}</td>
                  <td>{item.endDate}</td>
                  <td>{item.conditions}</td>
                  <td>{item.provider}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default WarrantyDashboard;

/*
useEffect(() => {
  fetch("/api/warranty/dashboard")
    .then((res) => res.json())
    .then((result) => {
      if (result.success) {
        setWarranties(result.data); // data คือ array
      } else {
        alert(result.message || "Error");
      }
    })
    .catch((err) => {
      console.error(err);
      alert("Cannot connect server");
    });
}, []);
*/

/*
function handleSearch() {
    fetch("/api/warranty/dashboard?search=" + searchText)
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setWarranties(result.data);
        } else {
          alert(result.message || "Error");
        }
      })
      .catch(...);
  }
  */
