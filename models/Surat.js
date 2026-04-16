const pool = require("../db/pool");

const Surat = {
  
  create: async ({ user_id, jenis, keperluan, keterangan }) => {
    const res = await pool.query(
      `INSERT INTO surat (kode, user_id, jenis, keperluan, keterangan)
       VALUES (
         'SRT-' || EXTRACT(YEAR FROM NOW())::text || '-' || LPAD(nextval('surat_nomor_seq')::text, 3, '0'),
         $1, $2, $3, $4
       ) RETURNING *`,
      [user_id, jenis, keperluan, keterangan || null]
    );
    return res.rows[0];
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

  updateStatus: async (id, { status, catatan }) => {
    const res = await pool.query(
      `UPDATE surat SET status=$1, catatan=$2, updated_at=NOW()
       WHERE id=$3 RETURNING *`,
      [status, catatan || null, id]
    );
    return res.rows[0] || null;
  },
};

module.exports = Surat;