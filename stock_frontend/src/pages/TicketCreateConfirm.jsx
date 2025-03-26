import { useLocation, useNavigate } from "react-router-dom";
import "./styles/TicketCreate.css";
import Sidebar from "./components/Sidebar";
import Headerbar from "./components/Headerbar";

function TicketCreateConfirm() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const { part, serial, use_location, use_date, use_time, product, warranty } =
    state || {};

  if (!state) {
    return <div>ไม่มีข้อมูล (กรุณากรอกขั้นตอนแรกก่อน)</div>;
  }

  const handleCreate = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          part,
          serial,
          use_location,
          use_date,
          use_time,
          product,
          warranty,
        }),
      });
      const result = await response.json();
      if (result.success) {
        alert("สร้าง Ticket สำเร็จ!");
        // navigate กลับหน้า /ticket หรืออื่นๆ
        navigate("/ticket");
      } else {
        alert(result.message || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      console.error(error);
      alert("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
    }
  };

  return (
    <div className="home-container">
      <Sidebar />
      <div className="main-content">
        <Headerbar />
        <div className="content-area">
          <h1 className="page-title">TICKET / Create ticket</h1>

          <div className="ticket-box">
            <p>Part : {part}</p>
            <p>S/N : {serial}</p>
            <p>สถานที่ใช้งาน : {use_location}</p>
            <p>วันที่ใช้งาน : {use_date}</p>
            <p>เวลา : {use_time}</p>
            <p>Product : {product}</p>
            <p>Warranty : {warranty}</p>

            <button onClick={handleCreate}>Create</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketCreateConfirm;
