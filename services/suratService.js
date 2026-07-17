const Surat = require("../models/Surat");
const { generateSuratPDF } = require("./pdfService");

const VALID_STATUS = ["menunggu", "diproses", "selesai", "sudah_diambil"];

const generateKodeSurat = async () => {
  const year = new Date().getFullYear();
  const seq  = await Surat.getNextSeq();
  return `SRT-${year}-${String(seq).padStart(3, "0")}`;
};

const ajukanSurat = async (userId, data) => {
  const {
    jenis, keperluan, keterangan,
    nama_pemohon, ttl, jenis_kelamin,
    agama, pekerjaan, nama_kepala_keluarga,
  } = data;

  const kode = await generateKodeSurat();

  return Surat.create({
    kode,
    user_id:              userId,
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
};

const getRiwayatSaya = async (userId) => {
  return Surat.findByUserId(userId);
};

const getAllSurat = async ({ page, limit, search, status }) => {
  const { rows, total } = await Surat.findAll({ page, limit, search, status });
  return {
    surat: rows,
    total,
    totalPages: Math.ceil(total / limit),
    page,
  };
};

const getBadge = async () => {
  return Surat.countMenunggu();
};

const updateStatus = async (id, status) => {
  if (!VALID_STATUS.includes(status)) {
    const err = new Error("Status tidak valid.");
    err.status = 400;
    throw err;
  }
  const surat = await Surat.updateStatus(id, { status });
  if (!surat) {
    const err = new Error("Surat tidak ditemukan.");
    err.status = 404;
    throw err;
  }
  return surat;
};

const cetakSurat = async (id) => {
  const surat = await Surat.findById(id);
  if (!surat) {
    const err = new Error("Surat tidak ditemukan.");
    err.status = 404;
    throw err;
  }
  if (surat.status !== "diproses") {
    const err = new Error("Surat hanya bisa dicetak saat status diproses.");
    err.status = 400;
    throw err;
  }
  const pdf = await generateSuratPDF(surat);
  return { pdf, kode: surat.kode };
};

const getCounts = async () => {
  return Surat.countByStatus();
};

module.exports = {
  ajukanSurat, getRiwayatSaya, getAllSurat,
  getBadge, updateStatus, cetakSurat, getCounts
};