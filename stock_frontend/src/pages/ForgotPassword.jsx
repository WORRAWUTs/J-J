import { useState } from "react";
import "./styles/ForgotPassword.css";

function ForgotPassword() {
  // State สำหรับแต่ละขั้นตอน
  const [step, setStep] = useState(1);

  // State สำหรับเก็บค่าของ input ในแต่ละขั้นตอน
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ---- Step 1: ใส่ Email หรือ เบอร์โทร ----
  const handleSubmitEmailPhone = (e) => {
    e.preventDefault();
    // TODO: เรียก API เพื่อส่ง OTP ไปยัง Email/Phone
    console.log("Sending OTP to:", emailOrPhone);
    // ไปหน้าถัดไป (OTP)
    setStep(2);
  };

  // ---- Step 2: ใส่ OTP ----
  const handleSubmitOtp = (e) => {
    e.preventDefault();
    // TODO: เรียก API เพื่อ verify OTP
    console.log("Verifying OTP:", otp);
    // ไปหน้าถัดไป (Set New Password)
    setStep(3);
  };

  // ---- Step 3: ตั้งรหัสผ่านใหม่ ----
  const handleSubmitNewPassword = (e) => {
    e.preventDefault();
    // ตรวจสอบ password ตรงกันไหม
    if (newPassword !== confirmPassword) {
      alert("Password ไม่ตรงกัน!");
      return;
    }
    // TODO: เรียก API เพื่ออัปเดต password ใหม่
    console.log("Updating new password:", newPassword);
    alert("เปลี่ยนรหัสผ่านสำเร็จ!");
    // อาจ redirect ไปหน้า Login
  };

  // แสดง UI ตามค่า step
  let content;
  if (step === 1) {
    // Step 1
    content = (
      <div className="box">
        <p className="box-text">
          ใส่ Email เพื่อรับลิงก์กู้คืนรหัสผ่าน <br />
          หรือใส่เบอร์โทรศัพท์เพื่อรับ OTP
        </p>
        <form onSubmit={handleSubmitEmailPhone} className="form-container">
          <label>Email / Phone number</label>
          <input
            type="text"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            className="input-line"
          />
          <button type="submit" className="orange-button">
            ตกลง
          </button>
        </form>
      </div>
    );
  } else if (step === 2) {
    // Step 2
    content = (
      <div className="box">
        <p className="otp-label">OTP</p>
        <form onSubmit={handleSubmitOtp} className="form-container">
          <div className="otp-container">
            {/* สมมติให้กรอก OTP ใน input เดียว หรือจะแยกเป็น 6 ช่องก็ได้ */}
            <input
              type="text"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="input-otp"
            />
          </div>
          <button type="submit" className="orange-button">
            ตกลง
          </button>
        </form>
      </div>
    );
  } else {
    // Step 3
    content = (
      <div className="box">
        <form onSubmit={handleSubmitNewPassword} className="form-container">
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input-line"
          />

          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-line"
          />

          <button type="submit" className="orange-button">
            ตกลง
          </button>
        </form>
      </div>
    );
  }

  return <div className="forgot-password-container">{content}</div>;
}

export default ForgotPassword;
