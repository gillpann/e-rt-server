require("dotenv").config();

// Pastikan semua env wajib tersedia sebelum server start
const REQUIRED_ENV = ["JWT_SECRET", "DB_HOST", "DB_PORT", "DB_NAME", "DB_USER", "DB_PASSWORD"];
const missingEnv = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error("❌ Environment variable tidak lengkap:", missingEnv.join(", "));
  process.exit(1);
}

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

// ── CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("CORS: Origin tidak diizinkan."));
    },
    credentials: true,
  })
);

// ── Body parser
app.use(express.json({ limit: "10kb" })); 

// ── Rate limiter khusus login (mencegah brute force)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Terlalu banyak percobaan login. Coba lagi 15 menit lagi." },
});
app.use("/api/auth/login", loginLimiter);

// ── Rate limiter global (mencegah spam ke semua endpoint)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Terlalu banyak request. Coba lagi sebentar." },
});
app.use(globalLimiter);

// ── Routes
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

  const isDev = process.env.NODE_ENV !== "production";
  res.status(err.status || 500).json({
    message: isDev ? err.message : "Terjadi kesalahan server.",
  });
});

// ── Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  console.log(`🌍 Mode: ${process.env.NODE_ENV || "development"}`);
});

const shutdown = (signal) => {
  console.log(`\n${signal} diterima. Menutup server...`);
  server.close(() => {
    console.log("✅ Server berhasil ditutup.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT",  () => shutdown("SIGINT"));

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Promise Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  process.exit(1);
});