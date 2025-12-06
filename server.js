import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// ---------- FIXED CORS (IMPORTANT) ----------
app.use(cors({
  origin: [
    "https://arnab496.github.io",
    "http://localhost:5500",
    "http://127.0.0.1:5500"
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

// ---------- MONGO CONNECTION ----------
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

app.post("/register", async (req, res) => {
  try {
    const newReg = new Registration(req.body);
    await newReg.save();
    res.json({ success: true, message: "Registration saved" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save registration" });
  }
});

app.get("/registrations", async (req, res) => {
  try {
    const allRegs = await Registration.find();
    res.json(allRegs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch registrations" });
  }
});

// ---------- SERVER ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
