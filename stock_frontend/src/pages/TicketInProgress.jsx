// src/pages/TicketInProgress.jsx
import { useState, useEffect } from "react";
import {} from "react-router-dom";
import "./styles/TicketInProgress.css";
import { Link } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Headerbar from "./components/Headerbar";

function TicketInProgress() {
  // เก็บรายการ ticket
  const [tickets, setTickets] = useState([]);
  // เก็บข้อความค้นหา
  const [searchText, setSearchText] = useState("");

  // สมมติว่าจะ fetch จาก backend หรือใช้ dummy data
  useEffect(() => {
    // ตัวอย่าง dummy data
    // status: "in_progress" หรือ "completed"
    setTickets([
      {
        ticket_number: "A0001",
        part: "5569888",
        serial: "KBN2123",
        use_location: "UTAC",
        start_date: "01/05/2025",
        start_time: "14:00",
        status: "in_progress", // กำลังดำเนินการ
      },
      {
        ticket_number: "A0002",
        part: "5569888",
        serial: "KBN2123",
        use_location: "UTAC",
        start_date: "01/02/2025",
        start_time: "15:00",
        status: "completed", // เสร็จแล้ว
      },
      // ... เพิ่มได้ตามต้องการ ...
    ]);
  }, []);

  // ฟังก์ชัน Search
  const handleSearch = () => {
    // ถ้าเชื่อม backend จริง ก็ fetch ด้วย search param
    // ตัวอย่างการกรองแบบใน memory (dummy)
    // กรองเฉพาะ Part หรือ Serial
    const filtered = tickets.filter((t) => {
      const partMatch = t.part.toLowerCase().includes(searchText.toLowerCase());
      const serialMatch = t.serial
        .toLowerCase()
        .includes(searchText.toLowerCase());
      return partMatch || serialMatch;
    });
    setTickets(filtered);
  };
  /*
  // ฟังก์ชันกด View
  const handleView = (ticketNumber) => {
    // navigate ไปหน้า /ticket/inprogress/view/xxx
    // หรือ alert ทดสอบ
    alert(`View detail of Ticket: ${ticketNumber}`);
  };*/
  /*
  // ฟังก์ชันกด Return
  const handleReturn = (ticketNumber) => {
    alert(`Return ticket: ${ticketNumber}`);
    // ถ้าเชื่อม backend จริง อาจเรียก API ส่งคืน part แล้ว refresh list
  };*/

  return (
    <div className="home-container">
      <Sidebar />
      <div className="main-content">
        <Headerbar />
        <div className="content-area">
          <h1 className="page-title">TICKET / In progress</h1>

          {/* Search Bar */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search Part, Serial"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </div>

          <table className="ticket-table">
            <thead>
              <tr>
                <th></th> {/* สำหรับสัญลักษณ์ in-progress */}
                <th>Ticket number</th>
                <th>Part</th>
                <th>S/N</th>
                <th>Use location</th>
                <th>Start date</th>
                <th>Start time</th>
                <th>View</th>
                <th></th> {/* สำหรับ Return (ถ้ามี) */}
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.ticket_number}>
                  <td>
                    {ticket.status === "in_progress" && (
                      <img
                        src="/image/inpro2.png"
                        alt="in progress"
                        style={{ width: "20px", height: "20px" }}
                      />
                    )}
                  </td>
                  <td>{ticket.ticket_number}</td>
                  <td>{ticket.part}</td>
                  <td>{ticket.serial}</td>
                  <td>{ticket.use_location}</td>
                  <td>{ticket.start_date}</td>
                  <td>{ticket.start_time}</td>
                  <td>
                    {ticket.status === "in_progress" ? (
                      // ถ้า in_progress -> ไปหน้า /ticket/inprogress/view/:ticketNumber
                      <Link
                        to={`/ticket/inprogress/view/${ticket.ticket_number}`}
                        className="link-action"
                      >
                        View
                      </Link>
                    ) : (
                      // ถ้า completed -> ไปหน้า /ticket/completed/view/:ticketNumber
                      <Link
                        to={`/ticket/completed/view/${ticket.ticket_number}`}
                        className="link-action"
                      >
                        View
                      </Link>
                    )}
                  </td>
                  <td>
                    {ticket.status === "completed" && (
                      <Link
                        to={`/ticket/inprogress/return/${ticket.ticket_number}`}
                        className="link-action"
                      >
                        Return
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TicketInProgress;
