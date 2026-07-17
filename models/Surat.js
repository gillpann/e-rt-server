const pool = require("../db/pool");

const Surat = {
  create: async ({
    kode, user_id, jenis, keperluan, keterangan,
    nama_pemohon, ttl, jenis_kelamin,
    agama, pekerjaan, nama_kepala_keluarga,
  }) => {
    const res = await pool.query(
      `INSERT INTO surat
        (kode, user_id, jenis, keperluan, keterangan,
         nama_pemohon, ttl, jenis_kelamin, agama, pekerjaan, nama_kepala_keluarga)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [
        kode, user_id, jenis, keperluan, keterangan || null,
        nama_pemohon, ttl, jenis_kelamin, agama, pekerjaan,
        nama_kepala_keluarga || null,
      ]
    );
    return res.rows[0];
  },

  getNextSeq: async () => {
    const res = await pool.query("SELECT nextval('surat_nomor_seq') AS seq");
    return parseInt(res.rows[0].seq);
  },

  findById: async (id) => {
    const res = await pool.query(
      `SELECT s.*, u.alamat
       FROM surat s JOIN users u ON s.user_id = u.id
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

  findAll: async ({ page = 1, limit = 10, search = "", status = "" } = {}) => {
    const offset = (page - 1) * limit;
    const params = [];
    const conditions = [];

    if (search) {
      params.push(`%${search}%`);
      const idx = params.length;
      conditions.push(
        `(u.nama ILIKE $${idx} OR s.nama_pemohon ILIKE $${idx} OR s.kode ILIKE $${idx} OR s.jenis ILIKE $${idx})`
      );
    }

    // Filter status
    if (status) {
      params.push(status);
      conditions.push(`s.status = $${params.length}`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    // Query data
    params.push(limit, offset);
    const dataRes = await pool.query(
      `SELECT s.*, u.nama, u.nik, u.no_hp, u.alamat
       FROM surat s JOIN users u ON s.user_id = u.id
       ${whereClause}
       ORDER BY s.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    // Query total — params tanpa limit & offset
    const countParams = params.slice(0, params.length - 2);
    const countRes = await pool.query(
      `SELECT COUNT(*) FROM surat s JOIN users u ON s.user_id = u.id ${whereClause}`,
      countParams
    );

    return {
      rows:  dataRes.rows,
      total: parseInt(countRes.rows[0].count),
    };
  },

  countMenunggu: async () => {
    const res = await pool.query(
      "SELECT COUNT(*) FROM surat WHERE status = 'menunggu'"
    );
    return parseInt(res.rows[0].count);
  },

  countByStatus: async () => {
    const res = await pool.query(
      `SELECT status, COUNT(*) as count FROM surat GROUP BY status`
    );
    const result = { menunggu: 0, diproses: 0, selesai: 0, sudah_diambil: 0 };
    res.rows.forEach(r => { result[r.status] = parseInt(r.count); });
    return result;
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
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );
    return res.rows[0] || null;
  },
};

module.exports = Surat;