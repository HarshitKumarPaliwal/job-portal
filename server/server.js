const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const { User, Job, Application } = require("./models");

const app = express();
const SECRET = process.env.JWT_SECRET || "mysecretkey";

// ---------- Middlewares ----------
app.use(express.json());
app.use(cookieParser());
// credentials:true => cookie frontend se aa/ja sakti hai
//app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGO_URL || "mongodb://127.0.0.1:27017/jobportal")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// ---------- Login check (cookie se token padhta hai) ----------
function verifyToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).send({ success: false, message: "Please login" });

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).send({ success: false, message: "Please login" });
    req.user = decoded; // { id, role }
    next();
  });
}

// ---------- Role check ----------
function onlyRecruiter(req, res, next) {
  if (req.user.role !== "recruiter")
    return res.status(403).send({ success: false, message: "Only recruiter allowed" });
  next();
}
function onlyJobseeker(req, res, next) {
  if (req.user.role !== "jobseeker")
    return res.status(403).send({ success: false, message: "Only jobseeker allowed" });
  next();
}

// token banake cookie me daalna (signup aur login dono me use hota hai)
function sendToken(res, user) {
  const token = jwt.sign({ id: user._id, role: user.role }, SECRET, { expiresIn: "1d" });
  res.cookie("token", token, { httpOnly: true, sameSite: "lax", maxAge: 24 * 60 * 60 * 1000 });
}

// ================= AUTH =================
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res.send({ success: false, message: "Sab fields bharo" });

    const old = await User.findOne({ email });
    if (old) return res.send({ success: false, message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10); // password kabhi plain save nahi karte
    const user = await User.create({ name, email, password: hashed, role });

    sendToken(res, user);
    res.send({ success: true, user: { name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.send({ success: false, message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.send({ success: false, message: "Wrong email or password" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.send({ success: false, message: "Wrong email or password" });

    sendToken(res, user);
    res.send({ success: true, user: { name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.send({ success: false, message: "Server error" });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.send({ success: true });
});

// ================= JOBS =================

// sabhi jobs (search ke saath). Jobseeker ko "applied" bhi milta hai
app.get("/jobs", verifyToken, async (req, res) => {
  try {
    const search = (req.query.search || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(search, "i");

    const jobs = await Job.find({
      $or: [{ title: regex }, { company: regex }, { location: regex }],
    }).sort({ createdAt: -1 });

    let appliedIds = [];
    if (req.user.role === "jobseeker") {
      const mine = await Application.find({ applicant: req.user.id });
      appliedIds = mine.map((a) => a.job.toString());
    }

    const result = jobs.map((j) => ({
      ...j.toObject(),
      applied: appliedIds.includes(j._id.toString()),
    }));
    res.send({ success: true, result });
  } catch (err) {
    res.send({ success: false, message: "Server error" });
  }
});

// recruiter ki apni jobs
app.get("/my-jobs", verifyToken, onlyRecruiter, async (req, res) => {
  const result = await Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
  res.send({ success: true, result });
});

// ek job (update page ke liye)
app.get("/jobs/:id", verifyToken, onlyRecruiter, async (req, res) => {
  try {
    const result = await Job.findOne({ _id: req.params.id, postedBy: req.user.id });
    if (!result) return res.send({ success: false, message: "Job not found" });
    res.send({ success: true, result });
  } catch (err) {
    res.send({ success: false, message: "Server error" });
  }
});

app.post("/add-job", verifyToken, onlyRecruiter, async (req, res) => {
  try {
    const { title, company, location, salary, type, description } = req.body;
    if (!title || !company) return res.send({ success: false, message: "Title aur company zaroori hai" });

    await Job.create({ title, company, location, salary, type, description, postedBy: req.user.id });
    res.send({ success: true });
  } catch (err) {
    res.send({ success: false, message: "Server error" });
  }
});

app.put("/update-job", verifyToken, onlyRecruiter, async (req, res) => {
  try {
    const { _id, title, company, location, salary, type, description } = req.body;
    // postedBy check: sirf apni job update kar sakte ho
    const result = await Job.findOneAndUpdate(
      { _id, postedBy: req.user.id },
      { title, company, location, salary, type, description }
    );
    if (!result) return res.send({ success: false, message: "Job not found" });
    res.send({ success: true });
  } catch (err) {
    res.send({ success: false, message: "Server error" });
  }
});

app.delete("/delete-job/:id", verifyToken, onlyRecruiter, async (req, res) => {
  try {
    const result = await Job.findOneAndDelete({ _id: req.params.id, postedBy: req.user.id });
    if (!result) return res.send({ success: false, message: "Job not found" });
    await Application.deleteMany({ job: req.params.id }); // us job ki applications bhi hata do
    res.send({ success: true });
  } catch (err) {
    res.send({ success: false, message: "Server error" });
  }
});

// ================= APPLICATIONS =================

app.post("/apply/:id", verifyToken, onlyJobseeker, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.send({ success: false, message: "Job not found" });

    await Application.create({ job: job._id, applicant: req.user.id });
    res.send({ success: true });
  } catch (err) {
    if (err.code === 11000) return res.send({ success: false, message: "Already applied" });
    res.send({ success: false, message: "Server error" });
  }
});

app.get("/my-applications", verifyToken, onlyJobseeker, async (req, res) => {
  const result = await Application.find({ applicant: req.user.id })
    .populate("job")
    .sort({ createdAt: -1 });
  res.send({ success: true, result });
});

// recruiter apni job ke applicants dekhe
app.get("/applicants/:id", verifyToken, onlyRecruiter, async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, postedBy: req.user.id });
    if (!job) return res.send({ success: false, message: "Job not found" });

    const result = await Application.find({ job: job._id }).populate("applicant", "name email");
    res.send({ success: true, job, result });
  } catch (err) {
    res.send({ success: false, message: "Server error" });
  }
});

app.listen(3200, () => console.log("Server running on http://localhost:3200"));
