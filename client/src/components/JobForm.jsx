import "../style/App.css";

// PostJob aur UpdateJob dono ye same form use karte hain
export default function JobForm({ heading, jobdata, setJobdata, onSubmit, buttonText }) {
  return (
    <div className="container">
      <h1>{heading}</h1>

      <label>Job Title</label>
      <input
        value={jobdata.title || ""}
        onChange={(event) => setJobdata({ ...jobdata, title: event.target.value })}
        type="text"
        placeholder="e.g. MERN Stack Developer"
      />

      <label>Company</label>
      <input
        value={jobdata.company || ""}
        onChange={(event) => setJobdata({ ...jobdata, company: event.target.value })}
        type="text"
        placeholder="company name"
      />

      <label>Location</label>
      <input
        value={jobdata.location || ""}
        onChange={(event) => setJobdata({ ...jobdata, location: event.target.value })}
        type="text"
        placeholder="e.g. Noida / Remote"
      />

      <label>Salary</label>
      <input
        value={jobdata.salary || ""}
        onChange={(event) => setJobdata({ ...jobdata, salary: event.target.value })}
        type="text"
        placeholder="e.g. 3-5 LPA"
      />

      <label>Job Type</label>
      <select
        value={jobdata.type || "Full-time"}
        onChange={(event) => setJobdata({ ...jobdata, type: event.target.value })}
      >
        <option>Full-time</option>
        <option>Part-time</option>
        <option>Internship</option>
        <option>Remote</option>
      </select>

      <label>Description</label>
      <textarea
        value={jobdata.description || ""}
        onChange={(event) => setJobdata({ ...jobdata, description: event.target.value })}
        placeholder="job description"
        rows={4}
      ></textarea>

      <button onClick={onSubmit} className="submit">{buttonText}</button>
    </div>
  );
}
