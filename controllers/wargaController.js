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

  // Validasi wajib
  if (!nama || !nik || !password)
    return res.status(400).json({ message: "Nama, NIK, dan password wajib diisi." });
  if (typeof nama !== "string" || nama.trim().length === 0)
    return res.status(400).json({ message: "Nama tidak valid." });
  if (typeof nik !== "string" || nik.trim().length !== 16 || !/^\d{16}$/.test(nik))
    return res.status(400).json({ message: "NIK harus 16 digit angka." });
  if (password.length < 6)
    return res.status(400).json({ message: "Password minimal 6 karakter." });

  try {
    if (await User.nikExists(nik.trim()))
      return res.status(409).json({ message: "NIK sudah terdaftar." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const warga = await User.create({
      nama:           nama.trim(),
      nik:            nik.trim(),
      no_hp:          no_hp?.trim() || null,
      alamat:         alamat?.trim() || null,
      hashedPassword,
      status:         status || "aktif",
    });

    res.status(201).json({ message: "Warga berhasil ditambahkan.", warga });
  } catch (err) {
    console.error("tambahWarga:", err.message);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

const editWarga = async (req, res) => {
  const { id } = req.params;
  const { nama, nik, no_hp, alamat, status, password } = req.body;

  // Validasi id
  if (!id || isNaN(Number(id)))
    return res.status(400).json({ message: "ID warga tidak valid." });

  // Validasi wajib
  if (!nama || !nik)
    return res.status(400).json({ message: "Nama dan NIK wajib diisi." });
  if (typeof nik !== "string" || nik.trim().length !== 16 || !/^\d{16}$/.test(nik))
    return res.status(400).json({ message: "NIK harus 16 digit angka." });
  if (password && password.length < 6)
    return res.status(400).json({ message: "Password minimal 6 karakter." });

  try {
    if (await User.nikExists(nik.trim(), id))
      return res.status(409).json({ message: "NIK sudah dipakai warga lain." });

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    const warga = await User.update(id, {
      nama:   nama.trim(),
      nik:    nik.trim(),
      no_hp:  no_hp?.trim() || null,
      alamat: alamat?.trim() || null,
      status: status || "aktif",
      hashedPassword,
    });

    if (!warga)
      return res.status(404).json({ message: "Warga tidak ditemukan." });

    res.status(200).json({ message: "Data warga berhasil diupdate.", warga });
  } catch (err) {
    console.error("editWarga:", err.message);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

const hapusWarga = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id)))
    return res.status(400).json({ message: "ID warga tidak valid." });

  try {
    const warga = await User.delete(id);
    if (!warga)
      return res.status(404).json({ message: "Warga tidak ditemukan." });

    res.status(200).json({ message: `Warga ${warga.nama} berhasil dihapus.` });
  } catch (err) {
    console.error("hapusWarga:", err.message);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

module.exports = { getAllWarga, tambahWarga, editWarga, hapusWarga };