const express = require("express");
const router  = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { ajukanSurat, getRiwayatSaya, getAllSurat, getBadge, updateStatus } = require("../controllers/suratController");

// Warga
router.post("/",       protect, ajukanSurat);
router.get("/saya",    protect, getRiwayatSaya);

// Admin
router.get("/badge",   protect, adminOnly, getBadge);
router.get("/",        protect, adminOnly, getAllSurat);
router.patch("/:id",   protect, adminOnly, updateStatus);

module.exports = router;