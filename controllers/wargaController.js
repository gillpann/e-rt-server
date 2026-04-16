const User   = require("../models/User");
const bcrypt = require("bcryptjs");

const getAllWarga = async (req, res) => {
  try {
    const warga = await User.findAllWarga();
    res.status(200).json({ warga });
  } catch (err) {
    console.error("getAllWarga:", err.message);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

const tambahWarga = async (req, res) => {
  const { nama, nik, no_hp, alamat, password, status } = req.body;
  if (!nama || !nik || !password)
    return res.status(400).json({ message: "Nama, NIK, dan password wajib diisi." });
  if (nik.length !== 16)
    return res.status(400).json({ message: "NIK harus 16 digit." });
  try {
    if (await User.nikExists(nik))
      return res.status(409).json({ message: "NIK sudah terdaftar." });
    const hashedPassword = await bcrypt.hash(password, 10);
    const warga = await User.create({ nama, nik, no_hp, alamat, hashedPassword, status });
    res.status(201).json({ message: "Warga berhasil ditambahkan.", warga });
  } catch (err) {
    console.error("tambahWarga:", err.message);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

const editWarga = async (req, res) => {
  const { id } = req.params;
  const { nama, nik, no_hp, alamat, status, password } = req.body;
  if (!nama || !nik)
    return res.status(400).json({ message: "Nama dan NIK wajib diisi." });
  if (nik.length !== 16)
    return res.status(400).json({ message: "NIK harus 16 digit." });
  try {
    if (await User.nikExists(nik, id))
      return res.status(409).json({ message: "NIK sudah dipakai warga lain." });
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    const warga = await User.update(id, { nama, nik, no_hp, alamat, status, hashedPassword });
    if (!warga) return res.status(404).json({ message: "Warga tidak ditemukan." });
    res.status(200).json({ message: "Data warga berhasil diupdate.", warga });
  } catch (err) {
    console.error("editWarga:", err.message);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

const hapusWarga = async (req, res) => {
  try {
    const warga = await User.delete(req.params.id);
    if (!warga) return res.status(404).json({ message: "Warga tidak ditemukan." });
    res.status(200).json({ message: `Warga ${warga.nama} berhasil dihapus.` });
  } catch (err) {
    console.error("hapusWarga:", err.message);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

module.exports = { getAllWarga, tambahWarga, editWarga, hapusWarga };