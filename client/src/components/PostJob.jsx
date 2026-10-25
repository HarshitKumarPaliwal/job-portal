import { useState } from "react";
import { useNavigate } from "react-router-dom";
import JobForm from "./JobForm";

export default function PostJob() {
  const [jobdata, setJobdata] = useState({ type: "Full-time" });
  const navigate = useNavigate();

  const handleAddJob = async () => {
    let result = await fetch("http://localhost:3200/add-job", {
      method: "POST",
      body: JSON.stringify(jobdata),
      credentials: "include",
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
      heading="Post new job"
      jobdata={jobdata}
      setJobdata={setJobdata}
      onSubmit={handleAddJob}
      buttonText="Post job"
    />
  );
}
