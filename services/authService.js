const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const User   = require("../models/User");

const login = async (nik, password) => {
  const user = await User.findByNik(nik);

  if (!user) {
    const err = new Error("NIK atau password salah.");
    err.status = 401;
    throw err;
  }

  if (user.status === "nonaktif") {
    const err = new Error("Akun kamu dinonaktifkan. Hubungi pengurus RT.");
    err.status = 403;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error("NIK atau password salah.");
    err.status = 401;
    throw err;
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  return {
    token,
    user: {
      id:     user.id,
      nama:   user.nama,
      nik:    user.nik,
      role:   user.role,
      no_hp:  user.no_hp,
      alamat: user.alamat,
    },
  };
};

const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error("User tidak ditemukan.");
    err.status = 404;
    throw err;
  }
  return user;
};

module.exports = { login, getMe };