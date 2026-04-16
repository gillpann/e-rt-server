-- Jalankan file ini sekali di PostgreSQL untuk membuat semua tabel
-- Bisa lewat psql, pgAdmin, atau TablePlus

-- ─────────────────────────────
-- TABEL USERS (warga & admin)
-- ─────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  nama       VARCHAR(100)        NOT NULL,
  nik        VARCHAR(16) UNIQUE  NOT NULL,
  no_hp      VARCHAR(15),
  alamat     TEXT,
  password   VARCHAR(255)        NOT NULL,  -- disimpan sebagai bcrypt hash
  role       VARCHAR(10)         NOT NULL DEFAULT 'warga', -- 'warga' atau 'admin'
  status     VARCHAR(10)         NOT NULL DEFAULT 'aktif',  -- 'aktif' atau 'nonaktif'
  created_at TIMESTAMP           DEFAULT NOW()
);

-- ─────────────────────────────
-- TABEL SURAT (pengajuan)
-- ─────────────────────────────
CREATE TABLE IF NOT EXISTS surat (
  id          SERIAL PRIMARY KEY,
  kode        VARCHAR(20) UNIQUE NOT NULL,  -- contoh: SRT-2025-001
  user_id     INT REFERENCES users(id) ON DELETE CASCADE,
  jenis       VARCHAR(100) NOT NULL,
  keperluan   VARCHAR(150) NOT NULL,
  keterangan  TEXT,
  status      VARCHAR(15)  NOT NULL DEFAULT 'menunggu', -- menunggu/diproses/selesai/ditolak
  catatan     TEXT,        -- catatan admin jika ditolak
  created_at  TIMESTAMP    DEFAULT NOW(),
  updated_at  TIMESTAMP    DEFAULT NOW()
);

-- ─────────────────────────────
-- TABEL KAS (keuangan RT)
-- ─────────────────────────────
CREATE TABLE IF NOT EXISTS kas (
  id          SERIAL PRIMARY KEY,
  keterangan  VARCHAR(200) NOT NULL,
  tipe        VARCHAR(10)  NOT NULL, -- 'masuk' atau 'keluar'
  nominal     BIGINT       NOT NULL,
  tanggal     DATE         NOT NULL,
  created_by  INT REFERENCES users(id),
  created_at  TIMESTAMP    DEFAULT NOW()
);

-- ─────────────────────────────
-- SEED: akun admin default
-- password: admin123 (sudah di-hash dengan bcrypt)
-- ─────────────────────────────
INSERT INTO users (nama, nik, no_hp, alamat, password, role)
VALUES (
  'Pak RT Supratman',
  '0000000000000000',
  '081200000000',
  'Jl. Ketua RT No. 3',
  '$2b$10$tAU./Doe9DDN0Mn.GUPuD.nGJarsLKzwlA/c0EXRBqvm9qf7JUmOa', -- password: password
  'admin'
)
ON CONFLICT (nik) DO NOTHING;