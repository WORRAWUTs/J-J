// src/pages/InventoryLocation1st.jsx
import { useState, useEffect } from "react";
import {} from "react-router-dom";
import "./styles/InventoryLocationDetail.css";
import Sidebar from "./components/Sidebar";
import Headerbar from "./components/Headerbar";
import * as XLSX from "xlsx"; // <-- เพิ่ม import xlsx

function InventoryLocation3rd() {
  // State สำหรับข้อมูล Part ที่อยู่ใน 1st floor
  const [parts, setParts] = useState([]);
  // State สำหรับค้นหา
  const [searchText, setSearchText] = useState("");

  // ดึงข้อมูล Part หรือใช้ dummy data
  useEffect(() => {
    // สมมติ fetch จาก backend หรือใช้ dummy
    const dummyData = [
      {
        id: 1,
        type: "Server",
        nameProduct: "Dell R370",
        productId: "556988",
        serial: "KBN2123",
        health: "OK",
        location: "3rd floor",
        subLocation: "C1", // เพิ่ม subLocation
      },
      {
        id: 2,
        type: "Switch",
        nameProduct: "Cisco 2960",
        productId: "SW-001",
        serial: "CS2960-1234",
        health: "Unknown",
        location: "3rd floor",
        subLocation: "A2",
      },
      // เพิ่มได้ตามต้องการ ...
    ];
    setParts(dummyData);
  }, []);

  // ฟังก์ชันค้นหา
  const handleSearch = () => {
    // ตัวอย่างกรองใน memory
    const filtered = parts.filter((p) => {
      const text = searchText.toLowerCase();
      return (
        p.type.toLowerCase().includes(text) ||
        p.nameProduct.toLowerCase().includes(text) ||
        p.productId.toLowerCase().includes(text) ||
        p.serial.toLowerCase().includes(text) ||
        p.health.toLowerCase().includes(text) ||
        p.location.toLowerCase().includes(text) ||
        (p.subLocation || "").toLowerCase().includes(text)
      );
    });
    setParts(filtered);
  };

  // ควบคุมการเปิด/ปิด Popup
  const [showAddPartPopup, setShowAddPartPopup] = useState(false);

  // เก็บข้อมูลในฟอร์ม Add Part
  const [addPartData, setAddPartData] = useState({
    nameProduct: "",
    part: "",
    serial: "",
    type: "",
    location: "",
    subLocation: "", // เพิ่ม subLocation
  });

  // ออปชันสำหรับ Dropdown "Type"
  const typeOptions = [
    "Hdd",
    "Ram",
    "Switch",
    "Server",
    "Storage",
    "Blade server",
    "Firewall",
    "Router",
    "Mainboard",
    "Other Module",
  ];

  // ออปชันสำหรับ Dropdown "Location" (ชั้นหลัก)
  const locationOptions = ["1st floor", "3rd floor", "faulty"];

  // ออปชันสำหรับ Dropdown "Sub location"
  const subLocationOptions = [
    "A1",
    "A2",
    "A3",
    "B1",
    "C1",
    "C2",
    "D1",
    "D2",
    "Rack001",
    "Rack002",
    // ... เพิ่มได้ตามจริง ...
  ];

  // ฟังก์ชันเปิด Popup
  const handleOpenAddPart = () => {
    // รีเซ็ตฟอร์มหรือจะตั้งค่าเริ่มต้นก็ได้
    setAddPartData({
      nameProduct: "",
      part: "",
      serial: "",
      type: "",
      location: "",
      subLocation: "",
    });
    setShowAddPartPopup(true);
  };

  // ฟังก์ชันปิด Popup
  const handleCloseAddPart = () => {
    setShowAddPartPopup(false);
  };

  // ฟังก์ชันเปลี่ยนค่าในฟอร์ม
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddPartData((prev) => ({ ...prev, [name]: value }));
  };

  // กดปุ่ม Engineer test
  const handleEngineerTest = () => {
    alert("Engineer test with data: " + JSON.stringify(addPartData, null, 2));
    // TODO: เรียก API หรือทำ logic อื่น
    setShowAddPartPopup(false);
  };

  // กดปุ่ม Add to stock
  const handleAddToStock = () => {
    alert("Add to stock with data: " + JSON.stringify(addPartData, null, 2));
    // TODO: เรียก API หรือทำ logic อื่น
    setShowAddPartPopup(false);
  };

  // ฟังก์ชัน Use Part
  const handleUsePart = (partId) => {
    alert(`Use part with id = ${partId}`);
    // หรือเรียก API หรือ navigate ไปหน้าอื่น
  };

  const handleExportExcel = () => {
    // แปลง parts ให้เป็น array ของ object ที่จะเขียนลง excel
    // เช่น เปลี่ยน key ให้เป็นภาษาไทยหรือสากลตามต้องการ
    const dataForExcel = parts.map((p) => ({
      Type: p.type,
      "Name Product": p.nameProduct,
      "Product ID": p.productId,
      "S/N": p.serial,
      Health: p.health,
      Location: p.location,
      "Sub Location": p.subLocation,
    }));

    // สร้าง worksheet จาก data
    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    // สร้าง workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "1st Floor");

    // เขียนไฟล์
    XLSX.writeFile(workbook, "inventory_1st_floor.xlsx");
  };

  return (
    <div className="home-container">
      <Sidebar />
      <div className="main-content">
        <Headerbar />
        <div className="content-area">
          <h1 className="page-title">INVENTORY / LOCATION / 3rd floor</h1>

          <div className="top-bar">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <button onClick={handleSearch}>Search</button>
            </div>
            <button className="add-part-btn" onClick={handleOpenAddPart}>
              ADD PART
            </button>
          </div>

          <table className="parts-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Name Product</th>
                <th>Product id</th>
                <th>S/N</th>
                <th>Health</th>
                <th>Location</th>
                <th>Sub location</th> {/* เพิ่มคอลัมน์ sub location */}
                <th></th> {/* สำหรับปุ่ม use part */}
              </tr>
            </thead>
            <tbody>
              {parts.map((p) => (
                <tr key={p.id}>
                  <td>{p.type}</td>
                  <td>{p.nameProduct}</td>
                  <td>{p.productId}</td>
                  <td>{p.serial}</td>
                  <td>{p.health}</td>
                  <td>{p.location}</td>
                  <td>{p.subLocation || "-"}</td> {/* แสดง subLocation ถ้ามี */}
                  <td>
                    <button onClick={() => handleUsePart(p.id)}>
                      USE PART
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* ปุ่ม Export to Excel มุมขวาล่าง */}
          <button className="export-excel-btn" onClick={handleExportExcel}>
            Export to Excel
          </button>

          {/* Popup ADD PART */}
          {showAddPartPopup && (
            <div className="popup-overlay">
              <div className="popup-content">
                <h2>ADD PART</h2>

                <div className="form-row">
                  <label>Name Product:</label>
                  <input
                    type="text"
                    name="nameProduct"
                    value={addPartData.nameProduct}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-row">
                  <label>Part:</label>
                  <input
                    type="text"
                    name="part"
                    value={addPartData.part}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-row">
                  <label>Serial:</label>
                  <input
                    type="text"
                    name="serial"
                    value={addPartData.serial}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-row">
                  <label>Type:</label>
                  <select
                    name="type"
                    value={addPartData.type}
                    onChange={handleChange}
                  >
                    <option value="">--Select Type--</option>
                    {typeOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <label>Location:</label>
                  <select
                    name="location"
                    value={addPartData.location}
                    onChange={handleChange}
                  >
                    <option value="">--Select Location--</option>
                    {locationOptions.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sub location */}
                <div className="form-row">
                  <label>Sub location:</label>
                  <select
                    name="subLocation"
                    value={addPartData.subLocation}
                    onChange={handleChange}
                  >
                    <option value="">--Select Sub location--</option>
                    {subLocationOptions.map((subloc) => (
                      <option key={subloc} value={subloc}>
                        {subloc}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="button-row">
                  <button onClick={handleEngineerTest}>Engineer test</button>
                  <button onClick={handleAddToStock}>Add to stock</button>
                </div>

                {/* ปุ่ม/เครื่องหมาย X มุมขวาบน */}
                <span className="close-icon" onClick={handleCloseAddPart}>
                  ×
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InventoryLocation3rd;

/*const handleSearch = async () => {
  try {
    const res = await fetch(`http://localhost:5000/api/inventory/location/1st?search=${searchText}`);
    const result = await res.json();
    if (result.success) {
      setParts(result.data);
    } else {
      alert(result.message || "Error fetching data");
    }
  } catch (error) {
    console.error(error);
    alert("Cannot connect to server");
  }
};*/
