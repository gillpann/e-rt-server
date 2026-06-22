const suratService = require("../services/suratService");

const LIMIT = 5; 

const ajukanSurat = async (req, res, next) => {
  const { jenis, keperluan, nama_pemohon, ttl, jenis_kelamin, agama, pekerjaan } = req.body;
  if (!jenis || !keperluan)
    return res.status(400).json({ message: "Jenis dan keperluan wajib diisi." });
  if (!nama_pemohon || !ttl || !jenis_kelamin || !agama || !pekerjaan)
    return res.status(400).json({ message: "Data diri wajib diisi lengkap." });
  try {
    const surat = await suratService.ajukanSurat(req.user.id, req.body);
    res.status(201).json({ message: "Pengajuan berhasil dikirim.", surat });
  } catch (err) { next(err); }
};

const getRiwayatSaya = async (req, res, next) => {
  try {
    const surat = await suratService.getRiwayatSaya(req.user.id);
    res.status(200).json({ surat });
  } catch (err) { next(err); }
};

const getAllSurat = async (req, res, next) => {
  const page   = Math.max(1, parseInt(req.query.page)   || 1);
  const search = (req.query.search  || "").trim();
  const status = (req.query.status  || "").trim();

  try {
    const result = await suratService.getAllSurat({ page, limit: LIMIT, search, status });
    const counts = await suratService.getCounts(); 
    res.status(200).json({ ...result, counts });   
  } catch (err) { next(err); }
};

const getBadge = async (req, res, next) => {
  try {
    const count = await suratService.getBadge();
    res.status(200).json({ menunggu: count });
  } catch (err) { next(err); }
};

const updateStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!id || isNaN(Number(id)))
    return res.status(400).json({ message: "ID surat tidak valid." });
  try {
    const surat = await suratService.updateStatus(id, status);
    res.status(200).json({ message: "Status berhasil diupdate.", surat });
  } catch (err) { next(err); }
};

const cetakSurat = async (req, res, next) => {
  const { id } = req.params;
  if (!id || isNaN(Number(id)))
    return res.status(400).json({ message: "ID surat tidak valid." });
  try {
    const { pdf, kode } = await suratService.cetakSurat(id);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="surat-${kode}.pdf"`);
    res.send(pdf);
  } catch (err) { next(err); }
};

module.exports = { ajukanSurat, getRiwayatSaya, getAllSurat, getBadge, updateStatus, cetakSurat };