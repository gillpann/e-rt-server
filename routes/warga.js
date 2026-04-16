const express = require("express");
const router  = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  getAllWarga,
  tambahWarga,
  editWarga,
  hapusWarga,
} = require("../controllers/wargaController");

router.get("/",       protect, adminOnly, getAllWarga);
router.post("/",      protect, adminOnly, tambahWarga);
router.put("/:id",    protect, adminOnly, editWarga);
router.delete("/:id", protect, adminOnly, hapusWarga);

module.exports = router;