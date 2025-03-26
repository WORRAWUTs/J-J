import { useState, useEffect } from "react";
import {} from "react-router-dom";
import "./styles/InventoryStatus.css";
import Sidebar from "./components/Sidebar";
import Headerbar from "./components/Headerbar";

function InventoryStatus() {
  // State สำหรับรายการ Status
  const [statusItems, setStatusItems] = useState([]);
  // State สำหรับ search
  const [searchText, setSearchText] = useState("");

  // Popup สำหรับแสดงข้อมูล "i"
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [infoData, setInfoData] = useState(null);

  // Popup สำหรับ "Confirm parts addition"
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [addPopupData, setAddPopupData] = useState({
    nameProduct: "",
    part: "",
    serial: "",
    type: "",
    location: "",
    subLocation: "", // เพิ่ม subLocation
  });
  // ควบคุมโหมดแก้ไขใน Popup ADD
  const [editMode, setEditMode] = useState(false);

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
        health: "N/A",
        attachedImages: [],
        testBy: "Mr.Tommy (Engineer)",
      },
      {
        id: 2,
        type: "HDD",
        nameProduct: "Netapp",
        productId: "S7660",
        serial: "87909-00",
        status: "Test success",
        health: "20%",
        attachedImages: ["/images/test-img1.jpg", "/images/test-img2.jpg"],
        testBy: "Mr.Bobby (Engineer)",
      },
      {
        id: 3,
        type: "HDD",
        nameProduct: "Dell 12 TB 15K",
        productId: "507985-111",
        serial: "UUR1529",
        status: "Test success",
        health: "100%",
        attachedImages: ["/images/hdd1.jpg"],
        testBy: "Mr.Bobby (Engineer)",
      },
    ];
    setStatusItems(dummyData);
  }, []);

  // ฟังก์ชัน Search
  const handleSearch = () => {
    const text = searchText.toLowerCase();
    const filtered = statusItems.filter((item) => {
      return (
        item.type.toLowerCase().includes(text) ||
        item.nameProduct.toLowerCase().includes(text) ||
        item.productId.toLowerCase().includes(text) ||
        item.serial.toLowerCase().includes(text) ||
        item.status.toLowerCase().includes(text)
      );
    });
    setStatusItems(filtered);
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
    subLocation: "",
  });

  // ออปชันสำหรับ Dropdown "Type"
  const typeOptions = [
    "HDD",
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
  const handleAddToStock2 = () => {
    alert("Add to stock with data: " + JSON.stringify(addPartData, null, 2));
    // TODO: เรียก API หรือทำ logic อื่น
    setShowAddPartPopup(false);
  };

  // ปุ่ม ADD (ในตาราง) -> เปิด Popup "Confirm parts addition"
  const handleAdd = (id) => {
    // หา item จาก statusItems โดย id
    const item = statusItems.find((i) => i.id === id);
    if (!item) return;

    // ตั้งค่าข้อมูลใน Popup
    setAddPopupData({
      nameProduct: item.nameProduct,
      part: item.productId, // สมมติว่าคิดว่า productId = part
      serial: item.serial,
      type: item.type,
      location: "1st floor", // ตัวอย่าง location เริ่มต้น
      subLocation: "A1",
    });
    setEditMode(false); // เริ่มต้นเป็นอ่านอย่างเดียว
    setShowAddPopup(true);
  };

  // ปุ่ม Delete
  const handleDelete = (id) => {
    alert(`Delete item id = ${id}`);
  };

  // ฟังก์ชันกดปุ่ม "i" -> เปิด popup แสดงข้อมูล
  const handleShowInfo = (item) => {
    setInfoData(item);
    setShowInfoPopup(true);
  };

  const handleCloseInfoPopup = () => {
    setShowInfoPopup(false);
    setInfoData(null);
  };

  // เปลี่ยนค่าใน Popup "Confirm parts addition" (เมื่อ editMode = true)
  const handleChangePopup = (e) => {
    const { name, value } = e.target;
    setAddPopupData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditPopup = () => {
    setEditMode(true);
  };

  const handleAddToStock = () => {
    alert(`Add to stock with data:
      Name Product = ${addPopupData.nameProduct}
      Part = ${addPopupData.part}
      Serial = ${addPopupData.serial}
      Type = ${addPopupData.type}
      Location = ${addPopupData.location}
      Sub location = ${addPopupData.subLocation}
    `);
    setShowAddPopup(false);
  };

  return (
    <div className="home-container">
      <Sidebar />
      <div className="main-content">
        <Headerbar />
        <div className="content-area">
          <h1 className="page-title">INVENTORY / STATUS</h1>

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

          <table className="status-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Name Product</th>
                <th>Product id</th>
                <th>S/N</th>
                <th>Status</th>
                <th></th> {/* Add */}
                <th></th> {/* Delete */}
              </tr>
            </thead>
            <tbody>
              {statusItems.map((item) => (
                <tr key={item.id}>
                  {/* จุดสีหน้า Type ถ้าสถานะเป็น test success */}
                  <td>
                    <div className="type-cell">
                      {item.status.toLowerCase().includes("test success") ? (
                        <span
                          className="type-circle"
                          style={{ backgroundColor: "green" }}
                        ></span>
                      ) : (
                        <span className="type-circle placeholder"></span>
                      )}
                      <span className="type-text">{item.type}</span>
                    </div>
                  </td>

                  <td>{item.nameProduct}</td>
                  <td>{item.productId}</td>
                  <td>{item.serial}</td>

                  <td>
                    <div className="status-cell">
                      <span className="status-text">{item.status}</span>
                      {item.status.toLowerCase().includes("test success") ? (
                        <button
                          className="info-icon"
                          onClick={() => handleShowInfo(item)}
                        >
                          i
                        </button>
                      ) : (
                        <button className="info-icon placeholder">i</button>
                      )}
                    </div>
                  </td>

                  <td>
                    {item.status
                      .toLowerCase()
                      .includes("pending test") ? null : ( // ถ้าเป็น pending test -> ไม่แสดงปุ่ม
                      // ถ้าไม่ใช่ -> แสดงปุ่ม ADD
                      <button onClick={() => handleAdd(item.id)}>ADD</button>
                    )}
                  </td>
                  <td>
                    {item.status
                      .toLowerCase()
                      .includes("pending test") ? null : ( // ถ้าเป็น pending test -> ไม่แสดงปุ่ม
                      // ถ้าไม่ใช่ -> แสดงปุ่ม DELETE
                      <button onClick={() => handleDelete(item.id)}>
                        DELETE
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup แสดงข้อมูลรายละเอียด เมื่อกดไอคอน "i" */}
      {showInfoPopup && infoData && (
        <div className="popup-overlay">
          <div className="popup-content info-popup">
            <span className="popup-close" onClick={handleCloseInfoPopup}>
              ✕
            </span>
            <h2 className="popup-title">Result Detail</h2>

            <div className="popup-row">
              <div className="popup-label">Name Product</div>
              <div className="popup-colon">:</div>
              <div className="popup-value">{infoData.nameProduct}</div>
            </div>

            <div className="popup-row">
              <div className="popup-label">Part</div>
              <div className="popup-colon">:</div>
              <div className="popup-value">{infoData.productId}</div>
            </div>

            <div className="popup-row">
              <div className="popup-label">S/N</div>
              <div className="popup-colon">:</div>
              <div className="popup-value">{infoData.serial}</div>
            </div>

            <div className="popup-row">
              <div className="popup-label">Type</div>
              <div className="popup-colon">:</div>
              <div className="popup-value">{infoData.type}</div>
            </div>

            <div className="popup-row">
              <div className="popup-label">Health</div>
              <div className="popup-colon">:</div>
              <div className="popup-value">{infoData.health}</div>
            </div>

            <div className="image-row">
              {infoData.attachedImages && infoData.attachedImages.length > 0 ? (
                infoData.attachedImages.map((imgSrc, idx) => (
                  <img
                    key={idx}
                    src={imgSrc}
                    alt={`attached-${idx}`}
                    className="attached-img"
                  />
                ))
              ) : (
                <p>No images attached</p>
              )}
            </div>

            <div className="popup-row" style={{ marginTop: "20px" }}>
              <div className="popup-label">Test by</div>
              <div className="popup-colon">:</div>
              <div className="popup-value">{infoData.testBy}</div>
            </div>
          </div>
        </div>
      )}

      {/* Popup "Confirm parts addition" */}
      {showAddPopup && (
        <div className="popup-overlay">
          <div className="popup-content add-popup">
            <h2>Confirm parts addition</h2>

            {/* Name Product */}
            <div className="popup-row">
              <div className="popup-label">Name Product</div>
              <div className="popup-colon">:</div>
              <div className="popup-value">
                {editMode ? (
                  <input
                    name="nameProduct"
                    value={addPopupData.nameProduct}
                    onChange={handleChangePopup}
                  />
                ) : (
                  addPopupData.nameProduct
                )}
              </div>
            </div>

            {/* Part */}
            <div className="popup-row">
              <div className="popup-label">Part</div>
              <div className="popup-colon">:</div>
              <div className="popup-value">
                {editMode ? (
                  <input
                    name="part"
                    value={addPopupData.part}
                    onChange={handleChangePopup}
                  />
                ) : (
                  addPopupData.part
                )}
              </div>
            </div>

            {/* Serial */}
            <div className="popup-row">
              <div className="popup-label">S/N</div>
              <div className="popup-colon">:</div>
              <div className="popup-value">
                {editMode ? (
                  <input
                    name="serial"
                    value={addPopupData.serial}
                    onChange={handleChangePopup}
                  />
                ) : (
                  addPopupData.serial
                )}
              </div>
            </div>

            {/* Type (dropdown เมื่อ editMode=true) */}
            <div className="popup-row">
              <div className="popup-label">Type</div>
              <div className="popup-colon">:</div>
              <div className="popup-value">
                {editMode ? (
                  <select
                    name="type"
                    value={addPopupData.type}
                    onChange={handleChangePopup}
                  >
                    <option value="">--Select Type--</option>
                    {typeOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  addPopupData.type
                )}
              </div>
            </div>

            {/* Location (dropdown เมื่อ editMode=true) */}
            <div className="popup-row">
              <div className="popup-label">Location</div>
              <div className="popup-colon">:</div>
              <div className="popup-value">
                {editMode ? (
                  <select
                    name="location"
                    value={addPopupData.location}
                    onChange={handleChangePopup}
                  >
                    <option value="">--Select Location--</option>
                    {locationOptions.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                ) : (
                  addPopupData.location
                )}
              </div>
            </div>

            {/* Sub location (dropdown เมื่อ editMode=true) */}
            <div className="popup-row">
              <div className="popup-label">Sub location</div>
              <div className="popup-colon">:</div>
              <div className="popup-value">
                {editMode ? (
                  <select
                    name="subLocation"
                    value={addPopupData.subLocation}
                    onChange={handleChangePopup}
                  >
                    <option value="">--Select Sub location--</option>
                    {subLocationOptions.map((subloc) => (
                      <option key={subloc} value={subloc}>
                        {subloc}
                      </option>
                    ))}
                  </select>
                ) : (
                  addPopupData.subLocation || "-"
                )}
              </div>
            </div>

            {/* ปุ่ม Edit / Add to stock */}
            <div className="popup-buttons">
              {!editMode && (
                <button className="edit-btn" onClick={handleEditPopup}>
                  Edit
                </button>
              )}
              <button className="add-stock-btn" onClick={handleAddToStock}>
                Add to stock
              </button>
            </div>
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
              <button onClick={handleAddToStock2}>Add to stock</button>
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

export default InventoryStatus;

/*
useEffect(() => {
  const fetchStatusItems = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/inventory/status");
      const result = await res.json();
      if (result.success) {
        setStatusItems(result.data);
      } else {
        alert(result.message || "Error fetching data");
      }
    } catch (error) {
      console.error(error)
;
      alert("Cannot connect to server");
    }
  };
  fetchStatusItems();
}, []);
*/

/*
const handleDelete = async (id) => {
  try {
    const res = await fetch(`http://localhost:5000/api/inventory/status/${id}`, {
      method: "DELETE",
    });
    const result = await res.json();
    if (result.success) {
      // refresh list หรือลบ item จาก state
    } else {
      alert(result.message || "Delete failed");
    }
  } catch (error) {
    console.error(error);
    alert("Cannot connect to server");
  }
};
*/

/*const formData = new FormData();
formData.append("file", fileInput.files[0]);
// เรียก fetch ด้วย method POST และ headers ให้ไม่ตั้ง Content-Type (จะถูกตั้งโดย Browser)
*/

/*const handleAddToStock = async () => {
  const res = await fetch("/api/inventory/addToStock", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(addPopupData),
  });
  const result = await res.json();
  if (result.success) {
    // อัปเดต state หรือปิด popup
  } else {
    alert("Error: " + result.message);
  }
};
*/
