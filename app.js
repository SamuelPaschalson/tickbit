// Necessary packages
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("express").json;
const path = require("path");
const connectDB = require("./config");

const app = express();
connectDB();

// Middleware setup
app.use(cors());
app.use(bodyParser());

// Serve static files in "uploads" directory
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));

// Routes
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");

// API Endpoints
app.get("/api/", (req, res) =>
  res.status(200).json({ message: "This is a Ticket API service" })
);
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(400).json({ message: "Prohibited" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

module.exports = app;
