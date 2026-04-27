const pool = require("../db/pool");

const Surat = {

  create: async ({ user_id, jenis, keperluan, keterangan, nama_pemohon, ttl, jenis_kelamin, agama, pekerjaan, nama_kepala_keluarga }) => {
    const res = await pool.query(
      `INSERT INTO surat (kode, user_id, jenis, keperluan, keterangan, nama_pemohon, ttl, jenis_kelamin, agama, pekerjaan, nama_kepala_keluarga)
       VALUES (
         'SRT-' || EXTRACT(YEAR FROM NOW())::text || '-' || LPAD(nextval('surat_nomor_seq')::text, 3, '0'),
         $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
       ) RETURNING *`,
      [user_id, jenis, keperluan, keterangan || null, nama_pemohon, ttl, jenis_kelamin, agama, pekerjaan, nama_kepala_keluarga || null]
    );
    return res.rows[0];
  },

  findById: async (id) => {
    const res = await pool.query(
      `SELECT s.*, u.alamat
       FROM surat s
       JOIN users u ON s.user_id = u.id
       WHERE s.id = $1`,
      [id]
    );
    return res.rows[0] || null;
  },

  findByUserId: async (user_id) => {
    const res = await pool.query(
      "SELECT * FROM surat WHERE user_id = $1 ORDER BY created_at DESC",
      [user_id]
    );
    return res.rows;
  },

  findAll: async () => {
    const res = await pool.query(
      `SELECT s.*, u.nama, u.nik, u.no_hp, u.alamat
       FROM surat s JOIN users u ON s.user_id = u.id
       ORDER BY s.created_at DESC`
    );
    return res.rows;
  },

  countMenunggu: async () => {
    const res = await pool.query(
      "SELECT COUNT(*) FROM surat WHERE status = 'menunggu'"
    );
    return parseInt(res.rows[0].count);
  },

  updateStatus: async (id, { status }) => {
    const res = await pool.query(
      `UPDATE surat
      SET status = $1::text,
          tanggal_selesai = CASE 
            WHEN $1::text = 'selesai' THEN NOW() 
            ELSE tanggal_selesai 
          END,
          updated_at = NOW()
      WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return res.rows[0] || null;
  },
};

module.exports = Surat;