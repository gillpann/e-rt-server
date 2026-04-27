const Surat = require("../models/Surat");
const { generateSuratPDF } = require("../services/pdfService");

const ajukanSurat = async (req, res) => {
  const {
    jenis, keperluan, keterangan,
    nama_pemohon, ttl, jenis_kelamin,
    agama, pekerjaan, nama_kepala_keluarga,
  } = req.body;

  if (!jenis || !keperluan)
    return res.status(400).json({ message: "Jenis dan keperluan wajib diisi." });
  if (!nama_pemohon || !ttl || !jenis_kelamin || !agama || !pekerjaan)
    return res.status(400).json({ message: "Data diri wajib diisi lengkap." });

  try {
    const surat = await Surat.create({
      user_id:              req.user.id,
      jenis:                jenis.trim(),
      keperluan:            keperluan.trim(),
      keterangan:           keterangan?.trim() || null,
      nama_pemohon:         nama_pemohon.trim(),
      ttl:                  ttl.trim(),
      jenis_kelamin:        jenis_kelamin.trim(),
      agama:                agama.trim(),
      pekerjaan:            pekerjaan.trim(),
      nama_kepala_keluarga: nama_kepala_keluarga?.trim() || null,
    });
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
  const { id } = req.params;
  const { status } = req.body;

  if (!id || isNaN(Number(id)))
    return res.status(400).json({ message: "ID surat tidak valid." });

  const validStatus = ["menunggu", "diproses", "selesai"];
  if (!validStatus.includes(status))
    return res.status(400).json({ message: "Status tidak valid." });

  try {
    const surat = await Surat.updateStatus(id, { status });
    if (!surat)
      return res.status(404).json({ message: "Surat tidak ditemukan." });

    res.status(200).json({ message: "Status berhasil diupdate.", surat });
  } catch (err) {
    console.error("updateStatus:", err.message);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

const cetakSurat = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id)))
    return res.status(400).json({ message: "ID surat tidak valid." });

  try {
    const surat = await Surat.findById(id);

    if (!surat)
      return res.status(404).json({ message: "Surat tidak ditemukan." });
    if (surat.status !== "diproses")
      return res.status(400).json({ message: "Surat hanya bisa dicetak saat status diproses." });

    const pdf = await generateSuratPDF(surat);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="surat-${surat.kode}.pdf"`
    );
    res.send(pdf);
  } catch (err) {
    console.error("cetakSurat:", err.message);
    res.status(500).json({ message: "Gagal generate PDF." });
  }
};

module.exports = {
  ajukanSurat,
  getRiwayatSaya,
  getAllSurat,
  getBadge,
  updateStatus,
  cetakSurat,
};