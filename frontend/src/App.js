import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import PrivateRoute from "./auth/PrivateRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ManageUsers from "./pages/ManageUsers";


function App() {

    console.log("App.js Loaded ✅");

    return (
      <AuthProvider>
          <Router>
              <Routes>
                  {/* ✅ กำหนดให้ "/" Redirect ไป "/login" */}
                  <Route path="/" element={<Navigate to="/login" />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/dashboard" element={<PrivateRoute requiredRole="Engineer"><Dashboard /></PrivateRoute>} />
                  <Route path="/users" element={<PrivateRoute requiredRole="Admin"><ManageUsers /></PrivateRoute>} />
              </Routes>
          </Router>
      </AuthProvider>
    );
}

export default App;
