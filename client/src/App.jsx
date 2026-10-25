import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Protected from "./components/Protected";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import JobList from "./components/JobList";
import PostJob from "./components/PostJob";
import MyJobs from "./components/MyJobs";
import UpdateJob from "./components/UpdateJob";
import Applicants from "./components/Applicants";
import MyApplications from "./components/MyApplications";

function App() {
  return (
    <>
      <NavBar />

      <Routes>
        {/* sab logged-in users */}
        <Route path="/" element={<Protected><JobList /></Protected>} />

        {/* sirf recruiter */}
        <Route path="/post-job" element={<Protected role="recruiter"><PostJob /></Protected>} />
        <Route path="/my-jobs" element={<Protected role="recruiter"><MyJobs /></Protected>} />
        <Route path="/update-job/:id" element={<Protected role="recruiter"><UpdateJob /></Protected>} />
        <Route path="/applicants/:id" element={<Protected role="recruiter"><Applicants /></Protected>} />

        {/* sirf jobseeker */}
        <Route path="/my-applications" element={<Protected role="jobseeker"><MyApplications /></Protected>} />

        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
