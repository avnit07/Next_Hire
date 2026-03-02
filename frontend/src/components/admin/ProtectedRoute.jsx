// Route wrapper that enforces authentication and strict role-based access control (student vs. recruiter)
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, requireStudent }) => {
    const { user } = useSelector(store => store.auth);
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requireStudent && user.role !== "student") {
        return <Navigate to="/" replace />;
    }

    if (!requireStudent && user.role !== "recruiter") {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
export default ProtectedRoute;