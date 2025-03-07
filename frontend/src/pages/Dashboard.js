import { useContext } from "react";
import AuthContext from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <div>
            <h2>Dashboard</h2>
            <p>Welcome, {user?.username}! Your role: <strong>{user?.role}</strong></p>

            {/* ✅ แสดงเมนูตาม Role */}
            {user?.role === "Admin" && <button onClick={() => navigate("/users")}>Manage Users</button>}
            {user?.role === "Engineer" && <button onClick={() => navigate("/tests")}>Test Parts</button>}
            {user?.role === "Logistic" && <button onClick={() => navigate("/inventory")}>Manage Inventory</button>}
            {user?.role === "Sale" && <button onClick={() => navigate("/warranty")}>Manage Warranty</button>}

            <br /><br />
            <button onClick={() => { logout(); navigate("/login"); }}>Logout</button>
        </div>
    );
}

export default Dashboard;
