// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/Register.css";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    nameLastname: "",
    email: "",
    phone: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // แยกชื่อและนามสกุล
    let firstName = formData.nameLastname;
    let lastName = "";
    
    // ถ้ามีการใส่ทั้งชื่อและนามสกุล ให้แยกด้วยช่องว่าง
    if (formData.nameLastname.includes(" ")) {
      const nameParts = formData.nameLastname.split(" ");
      firstName = nameParts[0];
      lastName = nameParts.slice(1).join(" ");
    }

    try {
      // เตรียมข้อมูลตามที่ API ต้องการ
      const requestData = {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        first_name: firstName,
        last_name: lastName,
        phone: formData.phone,
        role: "user" // กำหนดค่าเริ่มต้นเป็น user
      };

      console.log("Sending data to API:", requestData);

      // เรียก API ลงทะเบียน
      const response = await axios.post("http://localhost:8000/users/", requestData);
      console.log("API Response:", response.data);
      
      // แสดงแจ้งเตือนลงทะเบียนสำเร็จ
      alert("ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบ");
      
      // เปลี่ยนหน้าไปที่ Login
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      
      // แสดงข้อผิดพลาดในคอนโซลเพื่อการดีบัก
      console.log("Error details:", err.response?.data);
      
      if (err.code === "ERR_NETWORK") {
        setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่อ");
      } else {
        // จัดการกับข้อผิดพลาดต่างๆ
        let errorMessage = "เกิดข้อผิดพลาดในการลงทะเบียน";
        
        if (err.response?.data?.detail) {
          if (typeof err.response.data.detail === 'object') {
            errorMessage = JSON.stringify(err.response.data.detail);
          } else {
            errorMessage = err.response.data.detail;
          }
        }
        
        setError(errorMessage);
        alert(`เกิดข้อผิดพลาด: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleRegister} className="register-form">
        <label>User name</label>
        <input
          type="text"
          className="register-input"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          type="password"
          className="register-input"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label>Name - Lastname</label>
        <input
          type="text"
          className="register-input"
          name="nameLastname"
          value={formData.nameLastname}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          className="register-input"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Phone number</label>
        <input
          type="text"
          className="register-input"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <button type="submit" className="register-button" disabled={loading}>
          {loading ? "กำลังลงทะเบียน..." : "ลงทะเบียน"}
        </button>
      </form>
    </div>
  );
}

export default Register;