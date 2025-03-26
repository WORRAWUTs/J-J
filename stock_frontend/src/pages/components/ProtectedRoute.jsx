import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // แสดง loading spinner หรือข้อความกำลังโหลด
    return <div>กำลังโหลด...</div>;
  }

  if (!isAuthenticated) {
    // ถ้ายังไม่ได้ล็อกอิน เปลี่ยนหน้าไปที่ Login
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;