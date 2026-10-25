const mongoose = require("mongoose");

// ---------- User ----------
// role: "jobseeker" (job dhundne wala) ya "recruiter" (job dene wala)
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["jobseeker", "recruiter"], default: "jobseeker" },
});

// ---------- Job ----------
// postedBy = kis recruiter ne job daali
const jobSchema = new mongoose.Schema(
  {
    title: String,
    company: String,
    location: String,
    salary: String,
    type: { type: String, default: "Full-time" },
    description: String,
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// ---------- Application ----------
// job + applicant = kisne kis job pe apply kiya
const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, default: "Applied" },
  },
  { timestamps: true }
);
// ek banda ek job pe sirf ek baar apply kar sakta hai
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = {
  User: mongoose.model("User", userSchema),
  Job: mongoose.model("Job", jobSchema),
  Application: mongoose.model("Application", applicationSchema),
};
