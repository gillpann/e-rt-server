const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");

const login = async (req, res) => {
  const { nik, password } = req.body;
  if (!nik || !password)
    return res.status(400).json({ message: "NIK dan password wajib diisi." });
  if (nik.length !== 16)
    return res.status(400).json({ message: "NIK harus 16 digit." });
  try {
    const user = await User.findByNik(nik);
    if (!user)
      return res.status(401).json({ message: "NIK atau password salah." });
    if (user.status === "nonaktif")
      return res.status(403).json({ message: "Akun kamu dinonaktifkan. Hubungi pengurus RT." });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "NIK atau password salah." });
    const token = jwt.sign(
      { id: user.id, nama: user.nama, nik: user.nik, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.status(200).json({
      message: "Login berhasil.",
      token,
      user: { id: user.id, nama: user.nama, nik: user.nik, role: user.role, no_hp: user.no_hp, alamat: user.alamat },
    });
  } catch (err) {
    console.error("login:", err.message);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan." });
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

module.exports = { login, getMe };