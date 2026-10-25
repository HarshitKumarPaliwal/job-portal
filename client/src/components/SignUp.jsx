import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../style/App.css";

export default function SignUp() {
  // role by default jobseeker
  const [useData, setData] = useState({ role: "jobseeker" });
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("login")) {
      navigate("/");
    }
  }, []);

  const handleSignUp = async () => {
    let result = await fetch("http://localhost:3200/signup", {
      method: "POST",
      body: JSON.stringify(useData),
      headers: { "Content-Type": "application/json" },
      credentials: "include", // cookie save hone ke liye zaroori
    });
    result = await result.json();

    if (result.success) {
      localStorage.setItem("login", result.user.email);
      localStorage.setItem("role", result.user.role);
      window.dispatchEvent(new Event("localStorage-change"));
      navigate("/");
    } else {
      alert(result.message || "try after some time");
    }
  };

  return (
    <div className="container">
      <h1>Sign up</h1>

      <label>Name</label>
      <input
        onChange={(event) => setData({ ...useData, name: event.target.value })}
        type="text"
        placeholder="enter name"
      />

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

      <label>I am a</label>
      <select
        value={useData.role}
        onChange={(event) => setData({ ...useData, role: event.target.value })}
      >
        <option value="jobseeker">Job Seeker</option>
        <option value="recruiter">Recruiter</option>
      </select>

      <button onClick={handleSignUp} className="submit">SignUp</button>
      <Link className="Link" to="/login">Login</Link>
    </div>
  );
}
