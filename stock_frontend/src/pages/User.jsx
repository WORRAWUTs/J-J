// src/pages/User.jsx
import { useState, useEffect } from "react";
import {} from "react-router-dom";
import "./styles/User.css"; // ไฟล์ CSS สำหรับหน้า User
import Sidebar from "./components/Sidebar";
import Headerbar from "./components/Headerbar";

function UserPage() {
  // State เก็บรายการ user
  const [users, setUsers] = useState([]);
  // State สำหรับ search
  const [searchText, setSearchText] = useState("");

  // ดึงข้อมูล user (mock data หรือ fetch จาก backend)
  useEffect(() => {
    // ตัวอย่าง dummy data
    const dummyUsers = [
      { id: 1, name: "Mr.Abe", role: "USER", pic: "/image/abe.jpeg" },
      {
        id: 2,
        name: "Mr.somchai",
        role: "ENGINEER",
        pic: "/image/somchai.jpeg",
      },
      {
        id: 3,
        name: "Ms.somsrie",
        role: "LOGISTIC",
        pic: "/image/somsrie.jpeg",
      },
    ];
    setUsers(dummyUsers);
  }, []);

  // ฟังก์ชันค้นหา (ถ้าต้องการเชื่อม backend ให้เรียก API)
  const handleSearch = () => {
    // ตัวอย่างกรองใน memory
    const filtered = users.filter((u) =>
      u.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setUsers(filtered);
  };

  // ฟังก์ชันเปลี่ยน role (mock)
  const handleChangeRole = (id) => {
    alert(`Change role for user id = ${id}`);
    // TODO: เรียก API เปลี่ยน role ในระบบจริง
  };

  // ฟังก์ชันลบ user (mock)
  const handleDeleteUser = (id) => {
    alert(`Delete user id = ${id}`);
    // TODO: เรียก API ลบ user ในระบบจริง
  };

  return (
    <div className="home-container">
      <Sidebar />
      {/* Header + Content ส่วนขวา */}
      <div className="main-content">
        <Headerbar />
        <div className="content-area">
          <h1 className="page-title">USER</h1>
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
          </div>

          <div className="user-list">
            {users.map((user) => (
              <div className="user-row" key={user.id}>
                <img src={user.pic} alt="profile" className="user-pic" />
                <div className="user-name">
                  {user.name} ({user.role})
                </div>
                <div className="user-actions">
                  <button onClick={() => handleChangeRole(user.id)}>
                    Change role
                  </button>
                  <button onClick={() => handleDeleteUser(user.id)}>
                    Delete user
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPage;
/*
// ตัวอย่างใน React
useEffect(() => {
    fetch("/api/user")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUsers(data.data); // สมมติว่ามี state users
        } else {
          alert(data.message || "เกิดข้อผิดพลาด");
        }
      })
      .catch(err => {
        console.error(err);
        alert("ไม่สามารถติดต่อเซิร์ฟเวอร์");
      });
  }, []);
  */
/*
  function handleChangeRole(userId, newRole) {
    fetch("/api/user/" + userId + "/role", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Role updated");
          // TODO: refresh user list
        } else {
          alert(data.message || "เกิดข้อผิดพลาด");
        }
      })
      .catch(err => {
        console.error(err);
        alert("ไม่สามารถติดต่อเซิร์ฟเวอร์");
      });
  }
  */
/*
  function handleDeleteUser(userId) {
    fetch("/api/user/" + userId, { method: "DELETE" })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("User deleted");
          // TODO: refresh user list
        } else {
          alert(data.message || "เกิดข้อผิดพลาด");
        }
      })
      .catch(err => {
        console.error(err);
        alert("ไม่สามารถติดต่อเซิร์ฟเวอร์");
      });
  }
  */
