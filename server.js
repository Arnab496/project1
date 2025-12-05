// server.js (FINAL VERSION)
// --------------------------------------------
// IMPORTS
// --------------------------------------------
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// --------------------------------------------
// EXPRESS SETUP
// --------------------------------------------
const app = express();
app.use(express.json());

// ENABLE CORS FOR ALL FRONTENDS (GitHub Pages, Netlify, etc.)
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));

// --------------------------------------------
// MONGO CONNECTION
// --------------------------------------------
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// --------------------------------------------
// SCHEMA + MODEL
// --------------------------------------------
const regSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  topic: String,
  notes: String,
  submittedAt: String,
});

const Registration = mongoose.model("Registration", regSchema);

// --------------------------------------------
// ROUTES
// --------------------------------------------

// Test route – to check if backend is running
app.get("/", (req, res) => {
  res.send("Backend API Running ✔");
});

// POST /register — save registration
app.post("/register", async (req, res) => {
  try {
    const data = new Registration(req.body);
    await data.save();
    res.json({ success: true, message: "Registration Saved" });
  } catch (err) {
    console.error("❌ Error saving registration:", err);
    res.status(500).json({ error: "Failed to save registration" });
  }
});

// GET /registrations — list all registered people
app.get("/registrations", async (req, res) => {
  try {
    const list = await Registration.find().sort({ submittedAt: -1 });
    res.json(list);
  } catch (err) {
    console.error("❌ Error fetching registrations:", err);
    res.status(500).json({ error: "Failed to fetch registrations" });
  }
});

// --------------------------------------------
// START SERVER
// --------------------------------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
