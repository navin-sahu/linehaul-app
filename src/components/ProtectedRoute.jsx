import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn =
    sessionStorage.getItem("user") || localStorage.getItem("user");

  if (!isLoggedIn) {
    return <Navigate to="*" replace />;
  }

  return children;
};

export default ProtectedRoute;
