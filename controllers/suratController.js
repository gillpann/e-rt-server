const Surat = require("../models/Surat");

const ajukanSurat = async (req, res) => {
  const { jenis, keperluan, keterangan } = req.body;
  if (!jenis || !keperluan)
    return res.status(400).json({ message: "Jenis dan keperluan wajib diisi." });
  try {
    const surat = await Surat.create({ user_id: req.user.id, jenis, keperluan, keterangan });
    res.status(201).json({ message: "Pengajuan berhasil dikirim.", surat });
  } catch (err) {
    console.error("ajukanSurat:", err.message);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

const getRiwayatSaya = async (req, res) => {
  try {
    const surat = await Surat.findByUserId(req.user.id);
    res.status(200).json({ surat });
  } catch (err) {
    console.error("getRiwayatSaya:", err.message);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

const getAllSurat = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Akses ditolak" });
  }

  try {
    const surat = await Surat.findAll();
    res.status(200).json({ surat });
  } catch (err) {
    console.error("getAllSurat:", err.message);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

const getBadge = async (req, res) => {
  try {
    const count = await Surat.countMenunggu();
    res.status(200).json({ menunggu: count });
  } catch (err) {
    console.error("getBadge:", err.message);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

const updateStatus = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Akses ditolak" });
  }

  const { id } = req.params;
  const { status, catatan } = req.body;

  const validStatus = ["menunggu", "diproses", "selesai", "ditolak"];

  if (!validStatus.includes(status)) {
    return res.status(400).json({ message: "Status tidak valid." });
  }

  if (status === "ditolak" && !catatan) {
    return res.status(400).json({
      message: "Catatan wajib diisi jika status ditolak.",
    });
  }

  try {
    const surat = await Surat.updateStatus(id, { status, catatan });
    if (!surat) {
      return res.status(404).json({ message: "Surat tidak ditemukan." });
    }
    res.status(200).json({
      message: "Status berhasil diupdate.",
      surat,
    });
  } catch (err) {
    console.error("updateStatus:", err.message);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

module.exports = { ajukanSurat, getRiwayatSaya, getAllSurat, getBadge, updateStatus };