import "../style/NavBar.css";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function NavBar() {
  const [login, setLogin] = useState(localStorage.getItem("login"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const navigate = useNavigate();

  const logout = async () => {
    localStorage.removeItem("login");
    localStorage.removeItem("role");
    setLogin(null);
    setRole(null);

    // server se cookie bhi delete karo
    await fetch("http://localhost:3200/logout", {
      method: "POST",
      credentials: "include",
    });
    navigate("/login");
  };

  useEffect(() => {
    const handleStorage = () => {
      setLogin(localStorage.getItem("login"));
      setRole(localStorage.getItem("role"));
    };
    window.addEventListener("localStorage-change", handleStorage);
    return () => window.removeEventListener("localStorage-change", handleStorage);
  }, []);

  return (
    <nav className="navbar">
      <div className="logo">Job Portal</div>

      <ul className="nav-links">
        {login ? (
          <>
            <li><Link to="/">Jobs</Link></li>

            {role === "recruiter" && (
              <>
                <li><Link to="/post-job">Post Job</Link></li>
                <li><Link to="/my-jobs">My Jobs</Link></li>
              </>
            )}

            {role === "jobseeker" && (
              <li><Link to="/my-applications">My Applications</Link></li>
            )}

            <li><Link to="/login" onClick={logout}>Logout</Link></li>
          </>
        ) : null}
      </ul>
    </nav>
  );
}
export default NavBar;
