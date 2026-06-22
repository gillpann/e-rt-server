const wargaService = require("../services/wargaService");

const LIMIT = 5;

const getAllWarga = async (req, res, next) => {
  const page   = Math.max(1, parseInt(req.query.page)  || 1);
  const search = (req.query.search || "").trim();
  const status = (req.query.status || "").trim();

  try {
    const result = await wargaService.getAllWarga({ page, limit: LIMIT, search, status });
    const counts = await wargaService.getCounts();
    res.status(200).json({ ...result, counts });
  } catch (err) { next(err); }
};

const tambahWarga = async (req, res, next) => {
  const { nama, nik, password } = req.body;
  if (!nama || !nik || !password)
    return res.status(400).json({ message: "Nama, NIK, dan password wajib diisi." });
  if (typeof nik !== "string" || nik.trim().length !== 16 || !/^\d{16}$/.test(nik))
    return res.status(400).json({ message: "NIK harus 16 digit angka." });
  if (password.length < 6)
    return res.status(400).json({ message: "Password minimal 6 karakter." });
  try {
    const warga = await wargaService.tambahWarga(req.body);
    res.status(201).json({ message: "Warga berhasil ditambahkan.", warga });
  } catch (err) { next(err); }
};

const editWarga = async (req, res, next) => {
  const { id } = req.params;
  const { nama, nik, password } = req.body;
  if (!id || isNaN(Number(id)))
    return res.status(400).json({ message: "ID warga tidak valid." });
  if (!nama || !nik)
    return res.status(400).json({ message: "Nama dan NIK wajib diisi." });
  if (typeof nik !== "string" || nik.trim().length !== 16 || !/^\d{16}$/.test(nik))
    return res.status(400).json({ message: "NIK harus 16 digit angka." });
  if (password && password.length < 6)
    return res.status(400).json({ message: "Password minimal 6 karakter." });
  try {
    const warga = await wargaService.editWarga(id, req.body);
    res.status(200).json({ message: "Data warga berhasil diupdate.", warga });
  } catch (err) { next(err); }
};

const hapusWarga = async (req, res, next) => {
  const { id } = req.params;
  if (!id || isNaN(Number(id)))
    return res.status(400).json({ message: "ID warga tidak valid." });
  try {
    const warga = await wargaService.hapusWarga(id);
    res.status(200).json({ message: `Warga ${warga.nama} berhasil dihapus.` });
  } catch (err) { next(err); }
};

module.exports = { getAllWarga, tambahWarga, editWarga, hapusWarga };