// src/pages/TicketCompletedView.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./styles/TicketCompletedView.css";
import Sidebar from "./components/Sidebar";
import Headerbar from "./components/Headerbar";

function TicketCompletedView() {
  const { ticketNumber } = useParams(); // /ticket/inprogress/view/:ticketNumber หรือ /ticket/completed/view/:ticketNumber

  // State สำหรับเก็บข้อมูล Ticket
  const [ticket, setTicket] = useState(null);

  // ฟังก์ชัน Print
  const handlePrint = () => {
    window.print(); // สั่งพิมพ์หน้า
  };

  // สมมติว่า fetch จาก backend หรือใช้ dummy data
  useEffect(() => {
    // ตัวอย่าง dummy data สำหรับ Ticket ที่เสร็จแล้ว
    const dummyTicket = {
      ticket_number: "A0001",
      part: "5569888",
      serial: "KBN2123",
      product: "Dell R370",
      use_location: "UTAC",
      warranty: "2.0",
      type: "HDD",
      start_date: "01/05/2025",
      start_time: "14:00",
      end_date: "15/05/2025",
      end_time: "17:00",
      file_path: "/uploads/testfile.png", // สมมติว่ามีไฟล์แนบ
      status: "completed",
    };
    setTicket(dummyTicket);

    // ถ้าเชื่อมต่อ backend จริง:
    // fetch(`http://localhost:5000/api/ticket/completed/${ticketNumber}`)
    //   .then(res => res.json())
    //   .then(result => setTicket(result.data))
    //   ...
  }, [ticketNumber]);

  if (!ticket) {
    return <div>กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="home-container">
      <Sidebar />

      <div className="main-content">
        <Headerbar />
        <div className="content-area">
          <div className="ticket-detail-header">
            <h1 className="page-title">TICKET / In progress / View</h1>
            <button className="print-link" onClick={handlePrint}>
              Print
            </button>
          </div>
          {/* กล่องใหญ่ครอบทั้งหมด */}
          <div className="ticket-box">
            {/* คอนเทนต์ 2 คอลัมน์ */}
            <div className="ticket-box-content">
              {/* คอลัมน์ซ้าย: รายละเอียด Ticket */}
              <div className="detail-left">
                <p>Ticket number : {ticket.ticket_number}</p>
                <p>Part : {ticket.part}</p>
                <p>S/N : {ticket.serial}</p>
                <p>Product : {ticket.product}</p>
                <p>Use location : {ticket.use_location}</p>
                <p>Warranty : {ticket.warranty}</p>
                <p>Type : {ticket.type}</p>
                <hr />
                <p>Start date : {ticket.start_date}</p>
                <p>Start time : {ticket.start_time}</p>
                <p>End date : {ticket.end_date}</p>
                <p>End time : {ticket.end_time}</p>
              </div>

              {/* คอลัมน์ขวา: ไฟล์แนบ */}
              <div className="detail-right">
                <p>ไฟล์ที่แนบ:</p>
                {ticket.file_path ? (
                  <div className="file-preview">
                    {/* ถ้าต้องการโชว์เป็นรูป: 
                      <img src={ticket.file_path} alt="attached" style={{ maxWidth: "100%" }} /> 
                    */}
                    <p>{ticket.file_path}</p>
                  </div>
                ) : (
                  <p>ไม่มีไฟล์แนบ</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketCompletedView;
