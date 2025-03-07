import { useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            console.log("📤 Sending login request:", JSON.stringify({ username, password })); // ✅ Debug
    
            const res = await axios.post(
                "http://127.0.0.1:8000/auth/login", 
                JSON.stringify({ username, password }),  // ✅ แก้เป็น JSON string
                { headers: { "Content-Type": "application/json" } }
            );
    
            console.log("✅ Login success:", res.data);
            login(res.data.access_token);
            navigate("/dashboard");
        } catch (error) {
            console.error("❌ Login error:", error.response?.data || error.message);
            alert("Invalid credentials");
        }
    };
    
    return (
        <div>
            <h2>Login</h2>
            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default Login;
