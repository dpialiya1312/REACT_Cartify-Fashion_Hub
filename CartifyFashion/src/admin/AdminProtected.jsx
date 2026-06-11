import { Navigate } from "react-router-dom";

function AdminProtected({ children }) {
  const isAdmin = localStorage.getItem("admin");

  if (!isAdmin) {
    return <Navigate to="/admin-login" />;
  }

  return children;
}

export default AdminProtected;