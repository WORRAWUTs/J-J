import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "./AuthContext";

const PrivateRoute = ({ children, requiredRole }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (requiredRole && user.role !== requiredRole && user.role !== "Admin") {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default PrivateRoute;
