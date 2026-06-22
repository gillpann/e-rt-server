const bcrypt = require("bcryptjs");
const User   = require("../models/User");

const HASH_ROUNDS = 10;

const getAllWarga = async ({ page, limit, search, status }) => {
  const { rows, total } = await User.findAllWarga({ page, limit, search, status });
  return {
    warga:      rows,
    total,
    totalPages: Math.ceil(total / limit),
    page,
  };
};

const tambahWarga = async (data) => {
  const { nama, nik, no_hp, alamat, password, status } = data;

  const nikSudahAda = await User.nikExists(nik.trim());
  if (nikSudahAda) {
    const err = new Error("NIK sudah terdaftar.");
    err.status = 409;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, HASH_ROUNDS);

  return User.create({
    nama: nama.trim(), nik: nik.trim(),
    no_hp: no_hp?.trim() || null,
    alamat: alamat?.trim() || null,
    hashedPassword, status: status || "aktif",
  });
};

const editWarga = async (id, data) => {
  const { nama, nik, no_hp, alamat, status, password } = data;

  const nikDipakai = await User.nikExists(nik.trim(), id);
  if (nikDipakai) {
    const err = new Error("NIK sudah dipakai warga lain.");
    err.status = 409;
    throw err;
  }

  const hashedPassword = password ? await bcrypt.hash(password, HASH_ROUNDS) : null;

  const warga = await User.update(id, {
    nama: nama.trim(), nik: nik.trim(),
    no_hp: no_hp?.trim() || null,
    alamat: alamat?.trim() || null,
    status: status || "aktif", hashedPassword,
  });

  if (!warga) {
    const err = new Error("Warga tidak ditemukan.");
    err.status = 404;
    throw err;
  }
  return warga;
};

const hapusWarga = async (id) => {
  const warga = await User.delete(id);
  if (!warga) {
    const err = new Error("Warga tidak ditemukan.");
    err.status = 404;
    throw err;
  }
  return warga;
};

const getCounts = async () => {
  return User.countByStatus();
};

module.exports = { getAllWarga, tambahWarga, editWarga, hapusWarga, getCounts };