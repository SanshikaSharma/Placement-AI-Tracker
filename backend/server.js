const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

// Routes
const profileRoutes = require("./routes/profileRoutes");
const authRoutes = require("./routes/authRoutes");
const placementRoutes = require("./routes/placementRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const companyRoutes = require("./routes/companyRoutes");
const applicationRoutes = require("./routes/applicationRoutes");


connectDB();

const app = express();

// ✅ MIDDLEWARE (VERY IMPORTANT)
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test route
app.get("/", (req, res) => {
  res.send("API Running successfully");
});

// Routes
app.use("/api/profile", profileRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/placement", placementRoutes);
app.use("/api/resume", resumeRoutes);
console.log("Company Routes Loaded");
console.log(companyRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/application", applicationRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});