import { Fragment, useEffect, useState } from "react";
import "../style/List.css";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    getApplications();
  }, []);

  const getApplications = async () => {
    let result = await fetch("https://job-portal-u8sg.onrender.com/my-applications", {
      credentials: "include",
    });
    result = await result.json();

    if (result.success) {
      setApplications(result.result);
    } else {
      alert(result.message || "try after some time");
    }
  };

  return (
    <div>
      <h1>My Applications</h1>

      <ul className="my-list five-col">
        <li className="List-header">S.No</li>
        <li className="List-header">Job</li>
        <li className="List-header">Company</li>
        <li className="List-header">Applied on</li>
        <li className="List-header">Status</li>

        {applications.map((item, index) => (
          <Fragment key={item._id}>
            <li className="List-item">{index + 1}</li>
            <li className="List-item">{item.job?.title}</li>
            <li className="List-item">{item.job?.company}</li>
            <li className="List-item">{new Date(item.createdAt).toLocaleDateString()}</li>
            <li className="List-item">{item.status}</li>
          </Fragment>
        ))}
      </ul>

      {applications.length === 0 && <p className="empty">Aapne abhi tak kisi job pe apply nahi kiya</p>}
    </div>
  );
}
