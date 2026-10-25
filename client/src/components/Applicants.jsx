import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../style/List.css";

export default function Applicants() {
  const [applicants, setApplicants] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const { id } = useParams();

  useEffect(() => {
    getApplicants();
  }, []);

  const getApplicants = async () => {
    let result = await fetch("http://localhost:3200/applicants/" + id, {
      credentials: "include",
    });
    result = await result.json();

    if (result.success) {
      setApplicants(result.result);
      setJobTitle(result.job.title);
    } else {
      alert(result.message || "try after some time");
    }
  };

  return (
    <div>
      <h1>Applicants for: {jobTitle}</h1>

      <ul className="my-list four-col">
        <li className="List-header">S.No</li>
        <li className="List-header">Name</li>
        <li className="List-header">Email</li>
        <li className="List-header">Applied on</li>

        {applicants.map((item, index) => (
          <Fragment key={item._id}>
            <li className="List-item">{index + 1}</li>
            <li className="List-item">{item.applicant?.name}</li>
            <li className="List-item">{item.applicant?.email}</li>
            <li className="List-item">{new Date(item.createdAt).toLocaleDateString()}</li>
          </Fragment>
        ))}
      </ul>

      {applicants.length === 0 && <p className="empty">Abhi kisi ne apply nahi kiya</p>}
    </div>
  );
}
