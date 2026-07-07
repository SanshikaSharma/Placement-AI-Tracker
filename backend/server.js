const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

// Routes
const profileRoutes = require("./routes/profileRoutes");
const authRoutes = require("./routes/authRoutes");
const placementRoutes = require("./routes/placementRoutes");
connectDB();

const app = express();

// ✅ MIDDLEWARE (VERY IMPORTANT)
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// Routes
app.use("/api/profile", profileRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/placement", placementRoutes);
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});