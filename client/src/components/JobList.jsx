import { useEffect, useState } from "react";
import "../style/JobList.css";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const role = localStorage.getItem("role");

  useEffect(() => {
    getJobs();
  }, []);

  const getJobs = async () => {
    let result = await fetch(
      "http://localhost:3200/jobs?search=" + encodeURIComponent(search),
      { credentials: "include" }
    );
    result = await result.json();

    if (result.success) {
      setJobs(result.result);
    } else {
      alert(result.message || "try after some time");
    }
  };

  const applyJob = async (id) => {
    let result = await fetch("http://localhost:3200/apply/" + id, {
      method: "POST",
      credentials: "include",
    });
    result = await result.json();

    if (result.success) {
      getJobs(); // list refresh taki button "Applied" ho jaye
    } else {
      alert(result.message || "try after some time");
    }
  };

  return (
    <div>
      <h1>All Jobs</h1>

      <div className="search-box">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          type="text"
          placeholder="search by title, company or location"
        />
        <button onClick={getJobs} className="search-btn">Search</button>
      </div>

      <div className="job-grid">
        {jobs.length === 0 && <p className="empty">No jobs found</p>}

        {jobs.map((item) => (
          <div className="job-card" key={item._id}>
            <h3>{item.title}</h3>
            <p className="company">{item.company}</p>
            <p>📍 {item.location}</p>
            <p>💰 {item.salary}</p>
            <span className="badge">{item.type}</span>
            <p className="desc">{item.description}</p>

            {/* Apply button sirf jobseeker ko dikhega */}
            {role === "jobseeker" && (
              <button
                onClick={() => applyJob(item._id)}
                className="apply-btn"
                disabled={item.applied}
              >
                {item.applied ? "Applied ✓" : "Apply"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
