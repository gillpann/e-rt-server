CREATE TABLE IF NOT EXISTS users (
  id         INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nama       VARCHAR(40)   NOT NULL,
  nik        VARCHAR(16)   NOT NULL UNIQUE,
  no_hp      VARCHAR(15),
  alamat     TEXT,
  password   VARCHAR(255)  NOT NULL,
  role       VARCHAR(10)   NOT NULL DEFAULT 'warga',
  status     VARCHAR(10)   NOT NULL DEFAULT 'aktif',
  created_at TIMESTAMP     DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS surat (
  id                   INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  kode                 VARCHAR(20)   NOT NULL UNIQUE,
  user_id              INT           REFERENCES users(id) ON DELETE CASCADE,
  jenis                VARCHAR(100)  NOT NULL,
  keperluan            VARCHAR(150)  NOT NULL,
  keterangan           TEXT,
  status               VARCHAR(15)   NOT NULL DEFAULT 'menunggu',
  catatan              TEXT,
  created_at           TIMESTAMP     DEFAULT NOW(),
  updated_at           TIMESTAMP     DEFAULT NOW(),
  nama_pemohon         VARCHAR(40),
  ttl                  VARCHAR(80),
  jenis_kelamin        VARCHAR(15),
  agama                VARCHAR(20),
  pekerjaan            VARCHAR(50),
  nama_kepala_keluarga VARCHAR(40),
  tanggal_selesai      TIMESTAMP
);

INSERT INTO users (nama, nik, no_hp, alamat, password, role)
VALUES (
  'Pak RT Supratman',
  '0000000000000000',
  '081200000000',
  'Jl. Ketua RT No. 3',
  '$2b$10$tAU./Doe9DDN0Mn.GU', // Hash password 
  'admin'
)
ON CONFLICT (nik) DO NOTHING;