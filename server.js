const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Connection Error:", err));

// Schema & Model
const RegistrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  topic: String,
  notes: String,
  submittedAt: Date
});

const Registration = mongoose.model("Registration", RegistrationSchema);

// Routes
app.get("/", (req, res) => {
  res.send("Registration API Running");
});

app.post("/register", async (req, res) => {
  try {
    const newEntry = new Registration(req.body);
    await newEntry.save();
    res.json({ message: "Data saved!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
