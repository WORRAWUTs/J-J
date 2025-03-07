import { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../auth/AuthContext";

function ManageUsers() {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/users")
            .then(res => setUsers(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h2>Manage Users</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id}>
                            <td>{u.username}</td>
                            <td>{u.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ManageUsers;
