const pool = require("../db/pool");

const Dashboard = {
  getStats: async () => {
    const res = await pool.query(`
      SELECT
        COUNT(*) AS total_surat,
        COUNT(*) FILTER (WHERE status = 'menunggu') AS menunggu,
        COUNT(*) FILTER (WHERE status = 'diproses') AS diproses,
        COUNT(*) FILTER (
          WHERE status = 'selesai'
          AND DATE_TRUNC('month', tanggal_selesai) = DATE_TRUNC('month', NOW())
        ) AS selesai_bulan_ini,
        COUNT(*) FILTER (
          WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW())
        ) AS masuk_bulan_ini
      FROM surat
    `);
    return res.rows[0];
  },

  getWargaStats: async () => {
    const res = await pool.query(`
      SELECT
        COUNT(*) AS total_warga,
        COUNT(*) FILTER (WHERE status = 'aktif') AS aktif,
        COUNT(*) FILTER (WHERE status = 'nonaktif') AS nonaktif
      FROM users
      WHERE role = 'warga'
    `);
    return res.rows[0];
  },

  getRecentSurat: async () => {
    const res = await pool.query(`
      SELECT s.id, s.kode, s.jenis, s.status, s.created_at, u.nama
      FROM surat s
      JOIN users u ON s.user_id = u.id
      ORDER BY s.created_at DESC
      LIMIT 5
    `);
    return res.rows;
  },

  getSuratPerJenis: async () => {
    const res = await pool.query(`
      SELECT jenis, COUNT(*) AS total
      FROM surat
      GROUP BY jenis
      ORDER BY total DESC
      LIMIT 6
    `);
    return res.rows;
  },
};

module.exports = Dashboard;