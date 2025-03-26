import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "./styles/Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const response = await axios.post("http://localhost:8000/token", formData);
      
      // บันทึก token ลงใน localStorage
      localStorage.setItem("token", response.data.access_token);
      
      // บันทึกเวลาหมดอายุ (ถ้าต้องการ)
      // const expiresIn = 60 * 60 * 1000; // 1 ชั่วโมง (ปรับตามความเหมาะสม)
      // localStorage.setItem("tokenExpiry", new Date().getTime() + expiresIn);
      
      // เปลี่ยนหน้าไปที่ Home
      navigate("/home");
    } catch (err) {
      console.error("Login error:", err);
      if (err.code === "ERR_NETWORK") {
        setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
      } else {
        setError(err.response?.data?.detail || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* โลโก้ */}
        <img src="/image/axentel logo.png" alt="logo" className="login-logo" />

        <h2 className="login-title">Login</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <input 
            type="text" 
            className="login-input" 
            placeholder="username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            className="login-input"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* ส่วนลิงก์ "ลืมรหัสผ่าน" */}
          <div className="forgot-container">
            <Link to="/forgot" className="forgot-link">
              ลืมรหัสผ่าน
            </Link>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>

          <div className="register-link-container">
            <Link to="/register" className="register-link">
              ลงทะเบียน
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;