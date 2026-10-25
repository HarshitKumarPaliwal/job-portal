import { Navigate } from "react-router-dom";

// role de diya to sirf usi role wale andar aa sakte hain
export default function Protected({ children, role }) {
  if (!localStorage.getItem("login")) {
    return <Navigate to="/login" replace />;
  }
  if (role && localStorage.getItem("role") !== role) {
    return <Navigate to="/" replace />;
  }
  return children;
}
