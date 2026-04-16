const pool = require("../db/pool");

const User = {
  findByNik: async (nik) => {
    const res = await pool.query("SELECT * FROM users WHERE nik = $1", [nik]);
    return res.rows[0] || null;
  },

  findById: async (id) => {
    const res = await pool.query(
      "SELECT id, nama, nik, role, no_hp, alamat, status FROM users WHERE id = $1",
      [id]
    );
    return res.rows[0] || null;
  },

  findAllWarga: async () => {
    const res = await pool.query(
      `SELECT id, nama, nik, no_hp, alamat, status, created_at
       FROM users WHERE role = 'warga' ORDER BY created_at DESC`
    );
    return res.rows;
  },

  nikExists: async (nik, excludeId = null) => {
    const res = excludeId
      ? await pool.query("SELECT id FROM users WHERE nik = $1 AND id != $2", [nik, excludeId])
      : await pool.query("SELECT id FROM users WHERE nik = $1", [nik]);
    return res.rows.length > 0;
  },

  create: async ({ nama, nik, no_hp, alamat, hashedPassword, status }) => {
    const res = await pool.query(
      `INSERT INTO users (nama, nik, no_hp, alamat, password, role, status)
       VALUES ($1, $2, $3, $4, $5, 'warga', $6)
       RETURNING id, nama, nik, no_hp, alamat, status, created_at`,
      [nama, nik, no_hp || null, alamat || null, hashedPassword, status || "aktif"]
    );
    return res.rows[0];
  },

  update: async (id, { nama, nik, no_hp, alamat, status, hashedPassword }) => {
    let res;
    if (hashedPassword) {
      res = await pool.query(
        `UPDATE users SET nama=$1, nik=$2, no_hp=$3, alamat=$4, status=$5, password=$6
         WHERE id=$7 AND role='warga'
         RETURNING id, nama, nik, no_hp, alamat, status`,
        [nama, nik, no_hp || null, alamat || null, status, hashedPassword, id]
      );
    } else {
      res = await pool.query(
        `UPDATE users SET nama=$1, nik=$2, no_hp=$3, alamat=$4, status=$5
         WHERE id=$6 AND role='warga'
         RETURNING id, nama, nik, no_hp, alamat, status`,
        [nama, nik, no_hp || null, alamat || null, status, id]
      );
    }
    return res.rows[0] || null;
  },

  delete: async (id) => {
    const res = await pool.query(
      "DELETE FROM users WHERE id = $1 AND role = 'warga' RETURNING id, nama",
      [id]
    );
    return res.rows[0] || null;
  },
};

module.exports = User;