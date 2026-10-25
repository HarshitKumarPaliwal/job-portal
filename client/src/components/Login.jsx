import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../style/App.css";

export default function Login() {
  const [useData, setData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("login")) {
      navigate("/");
    }
  }, []);

  const handleLogin = async () => {
    let result = await fetch("https://job-portal-u8sg.onrender.com/login", {
      method: "POST",
      body: JSON.stringify(useData),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    result = await result.json();

    if (result.success) {
      localStorage.setItem("login", result.user.email);
      localStorage.setItem("role", result.user.role);
      window.dispatchEvent(new Event("localStorage-change"));
      navigate("/");
    } else {
      alert(result.message || "Try after sometime");
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>

      <label>Email</label>
      <input
        onChange={(event) => setData({ ...useData, email: event.target.value })}
        type="email"
        placeholder="enter email"
      />

      <label>Password</label>
      <input
        onChange={(event) => setData({ ...useData, password: event.target.value })}
        type="password"
        placeholder="enter pass"
      />

      <button onClick={handleLogin} className="submit">Login</button>
      <Link className="Link" to="/signup">SignUp</Link>
    </div>
  );
}
