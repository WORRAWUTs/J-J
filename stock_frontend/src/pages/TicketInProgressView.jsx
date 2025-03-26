import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./styles/TicketInProgressView.css";
import Sidebar from "./components/Sidebar";
import Headerbar from "./components/Headerbar";

function TicketInProgressView() {
  const { ticketNumber } = useParams(); // /ticket/inprogress/view/:ticketNumber (ถ้าใช้ param)

  // เก็บข้อมูล Ticket
  const [ticket, setTicket] = useState(null);

  // เก็บสถานะการแนบไฟล์ (ถ้าแนบแล้ว, ถือว่าเสร็จ)
  const [isCompleted, setIsCompleted] = useState(false);

  // เก็บเวลาเริ่มต้น (startDateTime) และเวลาปัจจุบัน (currentDateTime) สำหรับแสดงการนับไปเรื่อย ๆ
  const [startDateTime, setStartDateTime] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // ดึงข้อมูล Ticket (หรือใช้ Dummy ถ้าต้องการดู UI)
  useEffect(() => {
    // ตัวอย่าง: fetch จาก backend
    // หรือใช้ Dummy Data
    const dummyTicket = {
      ticket_number: "A0001",
      part: "5569888",
      serial: "KBN2123",
      product: "Dell R370",
      use_location: "UTAC",
      warranty: "2.0",
      start_date: "01/05/2025",
      start_time: "14:00",
      // สมมติว่าเรารวม date+time เป็น Date object
      // แต่ในตัวอย่าง จะเก็บเป็น string แล้ว parse เอง
    };
    setTicket(dummyTicket);

    // สมมติ startDateTime เป็น 2025-05-01 14:00
    // สร้าง Date object สำหรับ start
    const start = new Date("2025-05-01T14:00:00");
    setStartDateTime(start);
  }, [ticketNumber]);

  // ใช้ interval เพื่ออัปเดต currentDateTime ทุก 1 วินาที (ถ้ายังไม่เสร็จ)
  useEffect(() => {
    if (!isCompleted && startDateTime) {
      const timer = setInterval(() => {
        setCurrentDateTime(new Date());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isCompleted, startDateTime]);

  // ฟังก์ชันแนบไฟล์ (เมื่อแนบแล้วถือว่าเสร็จ -> หยุดนับเวลา)
  const handleAttachFile = () => {
    // ในระบบจริง อาจมีการ upload file
    // ที่นี่เราจำลองว่าแนบแล้ว -> ticket เสร็จ
    alert("แนบไฟล์แล้ว -> Ticket เสร็จสิ้น");
    setIsCompleted(true);
  };

  if (!ticket) {
    return <div>กำลังโหลดข้อมูล...</div>;
  }

  // แปลง startDateTime และ currentDateTime เป็น string โชว์
  // หรือจะแสดงเฉพาะเวลาปัจจุบัน (currently in use)
  // ตัวอย่างแสดง currentDateTime (ถ้ายังไม่ completed)
  let currentlyInUseDate = "";
  let currentlyInUseTime = "";

  if (!isCompleted && startDateTime) {
    // currentDateTime
    // อาจจะแสดงแบบ Date.toLocaleString() หรือ format อื่น
    currentlyInUseDate = currentDateTime.toLocaleDateString("en-CA"); // yyyy-mm-dd
    currentlyInUseTime = currentDateTime.toLocaleTimeString("en-GB"); // HH:mm:ss
  }

  return (
    <div className="home-container">
      <Sidebar />
      <div className="main-content">
        <Headerbar />
        <div className="content-area">
          <h1 className="page-title">TICKET / In progress / View</h1>

          <div className="ticket-inprogress-box">
            <p>Ticket number : {ticket.ticket_number}</p>
            <p>Part : {ticket.part}</p>
            <p>Serial : {ticket.serial}</p>
            <p>Product : {ticket.product}</p>
            <p>Use location : {ticket.use_location}</p>
            <p>Warranty : {ticket.warranty}</p>
            <hr />
            <div className="ticket-row-container">
              <div className="start-info">
                <p>Start date : {ticket.start_date}</p>
                <p>Start time : {ticket.start_time}</p>
              </div>

              {!isCompleted ? (
                <div className="current-info">
                  <p>Currently in use :</p>
                  <p>Date : {currentlyInUseDate}</p>
                  <p>Time : {currentlyInUseTime}</p>
                  <button
                    onClick={handleAttachFile}
                    style={{ marginTop: "10px" }}
                  >
                    แนบไฟล์
                  </button>
                </div>
              ) : (
                <div className="current-info">
                  <p>Ticket นี้เสร็จสิ้นแล้ว</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketInProgressView;
