/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RedirectIfAuthenticated = ({ children }) => {
    const isAuthenticated = useSelector((state) => !!state.user.isAuthenticated);

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default RedirectIfAuthenticated;
