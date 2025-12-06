import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ---------- MONGO CONNECTION (NEW SYNTAX) ----------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));


// ---------- SCHEMA ----------
const regSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  topic: String,
  notes: String,
  submittedAt: String,
});

const Registration = mongoose.model("Registration", regSchema);

// ---------- ROUTES ----------
app.get("/", (req, res) => {
  res.send("Backend API Running ✔");
});

// Save registration
app.post("/register", async (req, res) => {
  try {
    const newReg = new Registration(req.body);
    await newReg.save();
    res.json({ success: true, message: "Registration saved" });
  } catch (err) {
    console.error("❌ Error saving registration:", err);
    res.status(500).json({ error: "Failed to save registration" });
  }
});

// Fetch all registrations (admin)
app.get("/registrations", async (req, res) => {
  try {
    const allRegs = await Registration.find();
    res.json(allRegs);
  } catch (err) {
    console.error("❌ Error fetching registrations:", err);
    res.status(500).json({ error: "Failed to fetch registrations" });
  }
});

// ---------- SERVER ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
