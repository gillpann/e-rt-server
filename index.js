require("dotenv").config();
const express   = require("express");
const cors      = require("cors");
const helmet    = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes  = require("./routes/auth");
const suratRoutes = require("./routes/surat");
const wargaRoutes = require("./routes/warga");

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
}));
app.use(express.json());

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Terlalu banyak percobaan login. Coba lagi 15 menit lagi." },
});
app.use("/api/auth/login", loginLimiter);

// Routes
app.use("/api/auth",  authRoutes);
app.use("/api/surat", suratRoutes);
app.use("/api/warga", wargaRoutes);

app.get("/", (req, res) => {
  res.json({ message: "e-RT API berjalan ✅", version: "1.0.0" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan." });
});

app.use((err, req, res, next) => {
  console.error("Server error:", err.message);
  res.status(500).json({ message: "Terjadi kesalahan server." });
});

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});