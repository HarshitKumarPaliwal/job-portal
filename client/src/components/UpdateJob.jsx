import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import JobForm from "./JobForm";

export default function UpdateJob() {
  const [jobdata, setJobdata] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    getJob();
  }, []);

  // pehle purana data laao taki form me bhar jaye
  const getJob = async () => {
    let result = await fetch("https://job-portal-u8sg.onrender.com/jobs/" + id, {
      credentials: "include",
    });
    result = await result.json();
    if (result.success) {
      setJobdata(result.result);
    } else {
      alert(result.message || "try after some time");
    }
  };

  const handleUpdate = async () => {
    let result = await fetch("https://job-portal-u8sg.onrender.com/update-job", {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify(jobdata), // _id bhi isme hai
      headers: { "Content-Type": "application/json" },
    });
    result = await result.json();

    if (result.success) {
      navigate("/my-jobs");
    } else {
      alert(result.message || "try after some time");
    }
  };

  return (
    <JobForm
      heading="Update job"
      jobdata={jobdata}
      setJobdata={setJobdata}
      onSubmit={handleUpdate}
      buttonText="Update job"
    />
  );
}
