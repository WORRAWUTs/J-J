// src/pages/Notification.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Notification.css"; // ไฟล์ CSS สำหรับ Notification
import Sidebar from "./components/Sidebar";
import Headerbar from "./components/Headerbar";

function Notification() {
  const navigate = useNavigate();

  // State เก็บรายการ notification
  const [notifications, setNotifications] = useState([]);
  // State สำหรับค้นหา
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    // สมมติ fetch หรือ mock data
    // ตัวอย่าง dummy data
    const dummyData = [
      {
        id: 1,
        message: "You have 3 parts to test",
        link: "/inventory/test", // เส้นทางที่จะนำทาง
        time: "10:23",
        date: "Today",
      },
      {
        id: 2,
        message: "You have 5 faulty parts to test",
        link: "/inventory/test",
        time: "11:00",
        date: "Today",
      },
      {
        id: 3,
        message: "Ticket #A0001 is completed",
        link: "/ticket/history/view",
        time: "14:05",
        date: "Yesterday",
      },
    ];
    setNotifications(dummyData);
  }, []);

  // ฟังก์ชันกดปุ่ม Search
  const handleSearch = () => {
    // ในระบบจริงอาจ fetch("/api/notification?search=...")
    // ที่นี่ mock filter ใน memory
    // สมมติ notificationsOriginal เป็น state เก็บข้อมูลทั้งหมด
    // หรือตัวอย่างง่ายๆ filter จาก notifications เลย
    // *** ควรมี state เก็บข้อมูลเต็มก่อน filter
    // ตัวอย่างด้านล่าง: filter ทันที
    setNotifications((prev) =>
      prev.filter((n) =>
        n.message.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  };

  // ฟังก์ชันคลิก link ("click here")
  const handleClickLink = (linkPath) => {
    // นำทางไปหน้าอื่น
    navigate(linkPath);
  };

  return (
    <div className="home-container">
      <Sidebar />
      <div className="main-content">
        <Headerbar />
        <div className="content-area">
          <h1 className="page-title">NOTIFICATION</h1>
          <div className="top-bar">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <button onClick={handleSearch}>Search</button>
            </div>
          </div>

          <div className="notification-list">
            {/* ตัวอย่าง: group "Today" */}
            <h2 className="notification-date">Today</h2>
            {notifications
              .filter((n) => n.date === "Today")
              .map((noti) => (
                <div className="notification-item" key={noti.id}>
                  <div className="notification-message">
                    {noti.message}{" "}
                    <span
                      className="notification-link"
                      onClick={() => handleClickLink(noti.link)}
                    >
                      click here
                    </span>
                  </div>
                  <div className="notification-time">{noti.time}</div>
                </div>
              ))}

            {/* ตัวอย่าง: group "Yesterday" */}
            <h2 className="notification-date">Yesterday</h2>
            {notifications
              .filter((n) => n.date === "Yesterday")
              .map((noti) => (
                <div className="notification-item" key={noti.id}>
                  <div className="notification-message">
                    {noti.message}{" "}
                    <span
                      className="notification-link"
                      onClick={() => handleClickLink(noti.link)}
                    >
                      click here
                    </span>
                  </div>
                  <div className="notification-time">{noti.time}</div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notification;

/*
useEffect(() => {
  fetch("/api/notification")
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        setNotifications(data.data); // สมมติ state notifications
      } else {
        alert(data.message || "Error");
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
  fetch("/api/notification?search=" + searchText)
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        setNotifications(data.data);
      } else {
        alert(data.message || "Error");
      }
    })
    .catch(...);
}
*/

/*
function createNotification(msg, link) {
  fetch("/api/notification", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: msg, link: link })
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert("Notification created");
        // TODO: refresh list
      } else {
        alert(data.message);
      }
    })
    .catch(...);
}
*/

/*
function markRead(notiId) {
  fetch("/api/notification/" + notiId, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ is_read: true })
  })
    .then(...);
}

function deleteNotification(notiId) {
  fetch("/api/notification/" + notiId, { method: "DELETE" })
    .then(...);
}
*/
