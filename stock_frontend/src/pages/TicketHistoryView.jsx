// src/pages/TicketHistoryView.jsx
import { useState, useEffect } from "react";
import /*, useParams*/ "react-router-dom";
import "./styles/TicketHistoryView.css";
import Sidebar from "./components/Sidebar";
import Headerbar from "./components/Headerbar";

function TicketHistoryView() {
  /*const { ticketNumber } = useParams(); // รับพารามิเตอร์จาก URL: /ticket/history/view/:ticketNumber*/

  // State สำหรับเก็บข้อมูล ticket รายการเดียว
  const [ticket, setTicket] = useState([]);
  /*
  useEffect(() => {
    const fetchTicketDetail = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/ticket/history/${ticketNumber}`
        );
        const result = await response.json();
        if (result.success) {
          setTicket(result.data); // สมมติว่า result.data เป็น object ของ ticket
        } else {
          alert(result.message || "เกิดข้อผิดพลาด");
        }
      } catch (error) {
        console.error(error);
        alert("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
      }
    };

    if (ticketNumber) {
      fetchTicketDetail();
    }
  }, [ticketNumber]);

  
  if (!ticketNumber) {
    return <div>ไม่พบ ticketNumber ใน URL</div>;
  }

  if (!ticket) {
    return <div>กำลังโหลดข้อมูล Ticket...</div>;
  }
*/
  const handlePrint = () => {
    window.print(); // สั่งพิมพ์หน้า
  };

  useEffect(() => {
    // set dummy data เป็น object เดียว
    setTicket({
      ticket_number: 1,
      part: "Part1",
      serial: "S1234",
      use_location: "Location1",
      start_date: "2025-03-01",
      start_time: "09:00",
      end_date: "2025-03-02",
      end_time: "17:00",
      product: "Dell R370",
      warranty: "2.0",
      type: "HDD",
    });
  }, []);

  return (
    <div className="home-container">
      <Sidebar />
      <div className="main-content">
        <Headerbar />
        <div className="content-area">
          <div className="ticket-detail-header">
            <h1 className="page-title">TICKET / History / View</h1>
            <button className="print-link" onClick={handlePrint}>
              Print
            </button>
          </div>

          <div className="ticket-detail-box">
            <p>Ticket number : {ticket.ticket_number}</p>
            <p>Part : {ticket.part}</p>
            <p>Serial : {ticket.serial}</p>
            <p>Use location : {ticket.use_location}</p>
            <p>Start date : {ticket.start_date}</p>
            <p>Start time : {ticket.start_time}</p>
            <p>End date : {ticket.end_date}</p>
            <p>End time : {ticket.end_time}</p>
            <p>Product : {ticket.product}</p>
            <p>Warranty : {ticket.warranty}</p>
            <p>Type : {ticket.type}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketHistoryView;
