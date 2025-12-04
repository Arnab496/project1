// ===== IMPORTS =====
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// ===== APP SETUP =====
const app = express();
app.use(cors());
app.use(express.json());

// ===== CONNECT TO MONGODB =====
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

// ===== SCHEMA =====
const RegistrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  topic: { type: String, required: true },
  notes: String,
  submittedAt: { type: Date, default: Date.now }
});

const Registration = mongoose.model("Registration", RegistrationSchema);

// ===== ROUTES =====

// Home route
app.get("/", (req, res) => {
  res.send("Registration API Running");
});

// POST — save registration
app.post("/register", async (req, res) => {
  try {
    const { name, email, phone, topic, notes, submittedAt } = req.body;

    if (!name || !email || !topic) {
      return res.status(400).json({ error: "Name, email and topic are required." });
    }

    const registration = new Registration({
      name,
      email,
      phone,
      topic,
      notes,
      submittedAt: submittedAt ? new Date(submittedAt) : new Date()
    });

    await registration.save();
    res.status(201).json({ message: "Registration saved successfully" });
  } catch (err) {
    console.error("Error saving registration:", err);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

// GET — fetch all registrations (admin panel)
app.get("/registrations", async (req, res) => {
  try {
    const data = await Registration.find().sort({ submittedAt: -1 });
    res.json(data);
  } catch (err) {
    console.error("Error fetching registrations:", err);
    res.status(500).json({ error: "Failed to fetch registrations" });
  }
});

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
