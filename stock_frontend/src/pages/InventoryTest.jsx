// src/pages/InventoryTest.jsx
import { useState, useEffect } from "react";
import {} from "react-router-dom";
import "./styles/InventoryTest.css";
import Sidebar from "./components/Sidebar";
import Headerbar from "./components/Headerbar";

function InventoryTest() {
  // State สำหรับเก็บรายการที่ต้องทดสอบ
  const [testItems, setTestItems] = useState([]);
  // State สำหรับ search
  const [searchText, setSearchText] = useState("");

  // State สำหรับ Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({
    id: null,
    nameProduct: "",
    part: "",
    serial: "",
    type: "",
    health: "",
    status: "Pending test",
    attachFile: null,
  });

  // ดึงข้อมูล dummy หรือ fetch จาก backend
  useEffect(() => {
    const dummyData = [
      {
        id: 1,
        type: "HDD",
        nameProduct: "Dell 12 TB 15K",
        productId: "507985-111",
        serial: "UUR15338",
        status: "Pending test",
      },
      {
        id: 2,
        type: "HDD",
        nameProduct: "Dell 12 TB 15K",
        productId: "507985-111",
        serial: "UUR1528",
        status: "Pending test",
      },
    ];
    setTestItems(dummyData);
  }, []);

  // ฟังก์ชัน Search
  const handleSearch = () => {
    const text = searchText.toLowerCase();
    const filtered = testItems.filter(
      (item) =>
        item.type.toLowerCase().includes(text) ||
        item.nameProduct.toLowerCase().includes(text) ||
        item.productId.toLowerCase().includes(text) ||
        item.serial.toLowerCase().includes(text)
    );
    setTestItems(filtered);
  };

  // ฟังก์ชัน Add Part
  // ควบคุมการเปิด/ปิด Popup
  const [showAddPartPopup, setShowAddPartPopup] = useState(false);

  // เก็บข้อมูลในฟอร์ม Add Part
  const [addPartData, setAddPartData] = useState({
    nameProduct: "",
    part: "",
    serial: "",
    type: "",
    location: "",
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

  // ออปชันสำหรับ Dropdown "Location"
  const locationOptions = [
    "1st(A1)",
    "1st(A2)",
    "1st(A3)",
    "1st(C1)",
    "1st(C2)",
    "1st(E1)",
    "1st(E2)",
    "1st(B)",
    "1st(D1)",
    "1st(D2)",
    "1st(D3)",
    "1st(F1)",
    "1st(F2)",
    "1st(F3)",
    "1st(L)",
    "1st(J)",
    "1st(H)",
    "1st(S001-1)",
    "1st(S001-2G)",
    "1st(S001-3G)",
    "1st(S001-4)",
    "1st(S002-1)",
    "1st(S002-2)",
    "1st(S002-3)",
    "1st(S002-4)",
    "1st(Asus)",
    "1st(Faulty-G)",
    "3rd(Rack24)",
    "3rd(Rack23)",
    "faulty",
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

  // ปุ่ม Active -> เปิด Popup
  const handleActive = (item) => {
    // ส่ง object ทั้งตัว ไม่ใช่แค่ item.id
    setPopupData({
      id: item.id,
      nameProduct: item.nameProduct,
      part: item.productId, // ในที่นี้ใช้ productId เป็น "Part"
      serial: item.serial,
      type: item.type,
      health: "",
      status: item.status, // สมมติ "Pending test"
      attachFile: null,
    });
    setShowPopup(true);
  };

  // เปลี่ยนค่า health ใน popup
  const handleHealthChange = (e) => {
    setPopupData({ ...popupData, health: e.target.value });
  };

  // เปลี่ยนค่า status (Good / Not good)
  const handleStatusChange = (newStatus) => {
    setPopupData({ ...popupData, status: newStatus });
  };

  // เปลี่ยนไฟล์แนบ
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPopupData({ ...popupData, attachFile: file });
  };

  // กดปุ่ม Success -> บันทึกผล
  const handleSuccess = () => {
    // TODO: เรียก API อัปเดต DB หรือ logic อื่น
    alert(`
      Success test result:
      nameProduct = ${popupData.nameProduct}
      part = ${popupData.part}
      serial = ${popupData.serial}
      type = ${popupData.type}
      health = ${popupData.health}
      status = ${popupData.status}
      attachFile = ${
        popupData.attachFile ? popupData.attachFile.name : "no file"
      }
    `);
    setShowPopup(false);
  };

  return (
    <div className="home-container">
      <Sidebar />
      <div className="main-content">
        <Headerbar />
        <div className="content-area">
          <h1 className="page-title">INVENTORY / TEST</h1>

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

          <table className="test-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Name Product</th>
                <th>Product id</th>
                <th>S/N</th>
                <th>Status</th>
                <th></th> {/* Active */}
              </tr>
            </thead>
            <tbody>
              {testItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.type}</td>
                  <td>{item.nameProduct}</td>
                  <td>{item.productId}</td>
                  <td>{item.serial}</td>
                  <td>{item.status}</td>
                  <td>
                    {/* ส่ง item ทั้งตัว ไม่ใช่ item.id */}
                    <button onClick={() => handleActive(item)}>Active</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <span className="popup-close" onClick={() => setShowPopup(false)}>
              ✕
            </span>
            <h2 className="popup-title">Result</h2>

            {/* Name Product */}
            <div className="popup-row">
              <div className="popup-label">Name Product</div>
              <div className="popup-colon">:</div>
              <div className="popup-value">{popupData.nameProduct}</div>
            </div>

            {/* Part */}
            <div className="popup-row">
              <div className="popup-label">Part</div>
              <div className="popup-colon">:</div>
              <div className="popup-value">{popupData.part}</div>
            </div>

            {/* S/N */}
            <div className="popup-row">
              <div className="popup-label">S/N</div>
              <div className="popup-colon">:</div>
              <div className="popup-value">{popupData.serial}</div>
            </div>

            {/* Type */}
            <div className="popup-row">
              <div className="popup-label">Type</div>
              <div className="popup-colon">:</div>
              <div className="popup-value">{popupData.type}</div>
            </div>

            {/* Health (input) */}
            <div className="popup-row">
              <div className="popup-label">Health</div>
              <div className="popup-colon">:</div>
              <div className="popup-value">
                <input
                  type="text"
                  value={popupData.health}
                  onChange={handleHealthChange}
                />
              </div>
            </div>

            {/* Status (Good / Not good) */}
            <div className="popup-row">
              <div className="popup-label">Status</div>
              <div className="popup-colon">:</div>
              <div className="popup-value">
                <button
                  className={
                    popupData.status === "Good"
                      ? "status-btn active"
                      : "status-btn"
                  }
                  onClick={() => handleStatusChange("Good")}
                >
                  Good
                </button>
                <button
                  className={
                    popupData.status === "Not good"
                      ? "status-btn active"
                      : "status-btn"
                  }
                  onClick={() => handleStatusChange("Not good")}
                >
                  Not good
                </button>
              </div>
            </div>

            {/* Attach file */}
            <div className="popup-row">
              <div className="popup-label">Attach file</div>
              <div className="popup-colon">:</div>
              <div className="popup-value">
                <input type="file" onChange={handleFileChange} />
              </div>
            </div>

            {/* Success button */}
            <button className="success-btn" onClick={handleSuccess}>
              Success
            </button>
          </div>
        </div>
      )}
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
  );
}

export default InventoryTest;

/*useEffect(() => {
  const fetchTestItems = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/inventory/test");
      const result = await res.json();
      if (result.success) {
        setTestItems(result.data);
      } else {
        alert(result.message || "Error fetching test items");
      }
    } catch (error) {
      console.error(error);
      alert("Cannot connect to server");
    }
  };
  fetchTestItems();
}, []);

const handleSearch = async () => {
  try {
    const res = await fetch(`http://localhost:5000/api/inventory/test?search=${searchText}`);
    const result = await res.json();
    if (result.success) {
      setTestItems(result.data);
    } else {
      alert(result.message || "Error fetching test items");
    }
  } catch (error) {
    console.error(error);
    alert("Cannot connect to server");
  }
};
*/
