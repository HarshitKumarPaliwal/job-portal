import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../style/List.css";

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    getMyJobs();
  }, []);

  const getMyJobs = async () => {
    let result = await fetch("http://localhost:3200/my-jobs", {
      credentials: "include",
    });
    result = await result.json();

    if (result.success) {
      setJobs(result.result);
    } else {
      alert(result.message || "try after some time");
    }
  };

  const deleteJob = async (id) => {
    if (!window.confirm("Job delete karni hai?")) return;

    let result = await fetch("http://localhost:3200/delete-job/" + id, {
      method: "DELETE",
      credentials: "include",
    });
    result = await result.json();

    if (result.success) {
      getMyJobs();
    } else {
      alert(result.message || "try after some time");
    }
  };

  return (
    <div>
      <h1>My Posted Jobs</h1>

      <ul className="my-list five-col">
        <li className="List-header">S.No</li>
        <li className="List-header">Title</li>
        <li className="List-header">Company</li>
        <li className="List-header">Location</li>
        <li className="List-header">Actions</li>

        {jobs.map((item, index) => (
          <Fragment key={item._id}>
            <li className="List-item">{index + 1}</li>
            <li className="List-item">{item.title}</li>
            <li className="List-item">{item.company}</li>
            <li className="List-item">{item.location}</li>
            <li className="List-item actions">
              <Link to={`/applicants/${item._id}`} className="view-item">Applicants</Link>
              <Link to={`/update-job/${item._id}`} className="update-item">Update</Link>
              <button onClick={() => deleteJob(item._id)} className="delete-item">Delete</button>
            </li>
          </Fragment>
        ))}
      </ul>
    </div>
  );
}
