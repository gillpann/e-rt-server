const fs   = require("fs");
const path = require("path");

const logoPath   = path.join(__dirname, "../assets/logo-bekasi.png");
const logoBase64 = fs.existsSync(logoPath)
  ? `data:image/png;base64,${fs.readFileSync(logoPath).toString("base64")}`
  : null;

function generateSuratHTML(surat) {
  const tanggal = new Date().toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });

  const alamatLengkap = surat.alamat
    ? `Perumahan Taman Kintamani ${surat.alamat}, RT. 03 RW. 08 Ds. Jejalen Jaya, Kec. Tambun Utara`
    : "-";

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 11pt;
      color: #000;
      background: #fff;
    }

    /* ── KOP ── */
    .kop {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
      border-bottom: 4px double #000;
      padding-bottom: 10px;
      margin-bottom: 18px;
    }
    .kop img {
      width: 70px;
      height: 70px;
      object-fit: contain;
      flex-shrink: 0;
    }
    .kop-text { text-align: center; }
    .kop-text .baris1 {
      font-size: 14pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .kop-text .baris2 {
      font-size: 11pt;
      font-weight: bold;
      margin-top: 2px;
    }
    .kop-text .baris3 {
      font-size: 12pt;
      font-weight: bold;
      margin-top: 2px;
    }

    /* ── JUDUL ── */
    .judul {
      text-align: center;
      margin: 20px 0 5px;
    }
    .judul p {
      font-size: 12pt;
      font-weight: bold;
      text-decoration: underline;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .nomor {
      text-align: center;
      font-size: 11pt;
      margin-bottom: 20px;
    }

    /* ── PEMBUKA ── */
    .pembuka {
      font-size: 11pt;
      margin-bottom: 12px;
      line-height: 1.6;
    }

    /* ── DATA DIRI ── */
    table.data {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      font-size: 11pt;
    }
    table.data td {
      padding: 3px 0;
      vertical-align: top;
      line-height: 1.6;
    }
    table.data td.label {
      font-weight: bold;
      width: 38%;
    }
    table.data td.titik-dua {
      width: 4%;
      text-align: center;
    }
    table.data td.value {
      width: 58%;
    }

    /* ── KEPERLUAN ── */
    .keperluan-block {
      font-size: 11pt;
      line-height: 1.7;
      margin-bottom: 10px;
    }
    .dotted-line {
      display: block;
      width: 100%;
      min-height: 22px;
      line-height: 22px;
      font-size: 11pt;
      border: none;
      border-bottom: 1px dashed #000;
      margin-bottom: 8px;
      padding-bottom: 2px;
    }

    /* ── PENUTUP ── */
    .penutup {
      font-size: 11pt;
      margin: 16px 0 24px;
      line-height: 1.7;
    }

    /* ── TTD ── */
    .ttd-wrapper {
      display: flex;
      justify-content: flex-end;
      margin-top: 6px;
    }
    .ttd-box {
      text-align: center;
      width: 46%;
      font-size: 11pt;
      line-height: 1.7;
    }
    .ttd-box .space { height: 70px; }
    .ttd-box .nama-ttd {
      font-weight: bold;
      border-top: 1px solid #000;
      padding-top: 4px;
      display: inline-block;
      width: 100%;
    }
    .ttd-box .jabatan {
      font-size: 10pt;
      margin-top: 2px;
    }
  </style>
</head>
<body>

  <!-- KOP SURAT -->
  <div class="kop">
    ${logoBase64 ? `<img src="${logoBase64}" alt="Logo Kabupaten Bekasi" />` : ""}
    <div class="kop-text">
      <div class="baris1">Pemerintah Kabupaten Bekasi</div>
      <div class="baris2">Desa Jejalen Jaya &ndash; Kecamatan Tambun Utara</div>
      <div class="baris3">RT. 03 RW. 08 Perumahan Taman Kintamani</div>
    </div>
  </div>

  <!-- JUDUL -->
  <div class="judul"><p>Surat Pengantar / Keterangan</p></div>
  <div class="nomor">Nomor &nbsp;: &nbsp;${surat.kode}</div>

  <!-- PEMBUKA -->
  <div class="pembuka">Yang bertandatangan di bawah ini, menerangkan bahwa :</div>

  <!-- DATA DIRI -->
  <table class="data">
    <tr>
      <td class="label">Nama</td>
      <td class="titik-dua">:</td>
      <td class="value">${surat.nama_pemohon || "-"}</td>
    </tr>
    <tr>
      <td class="label">Tempat/Tanggal Lahir</td>
      <td class="titik-dua">:</td>
      <td class="value">${surat.ttl || "-"}</td>
    </tr>
    <tr>
      <td class="label">Jenis Kelamin</td>
      <td class="titik-dua">:</td>
      <td class="value">${surat.jenis_kelamin || "-"}</td>
    </tr>
    <tr>
      <td class="label">Agama</td>
      <td class="titik-dua">:</td>
      <td class="value">${surat.agama || "-"}</td>
    </tr>
    <tr>
      <td class="label">Pekerjaan</td>
      <td class="titik-dua">:</td>
      <td class="value">${surat.pekerjaan || "-"}</td>
    </tr>
    <tr>
      <td class="label">Alamat/Domisili</td>
      <td class="titik-dua">:</td>
      <td class="value">${alamatLengkap}</td>
    </tr>
    <tr>
      <td class="label">Nama Kepala Keluarga</td>
      <td class="titik-dua">:</td>
      <td class="value">${surat.nama_kepala_keluarga || "-"}</td>
    </tr>
  </table>

  <!-- KEPERLUAN -->
  <div class="keperluan-block">
    Adalah benar warga kami yang berdomisili pada alamat tersebut di atas, dan surat
    pengantar / keterangan ini dibuat untuk keperluan :
  </div>
  <div class="dotted-line">
    ${surat.keperluan}${surat.keterangan ? " &mdash; " + surat.keterangan : ""}
  </div>
  <div class="dotted-line"></div>
  <div class="dotted-line"></div>
  <div class="dotted-line"></div>

  <!-- PENUTUP -->
  <div class="penutup">
    Demikian disampaikan, untuk dapat dipergunakan sebagaimana mestinya.
  </div>

  <!-- TTD -->
  <div class="ttd-wrapper">
    <div class="ttd-box">
      <div>Bekasi, ${tanggal}</div>
      <div>Pengurus RT. 03 /08 Taman Kintamani</div>
      <div>Ds. Jejalen Jaya Kec. Tambun Utara</div>
      <div class="space"></div>
      <div class="nama-ttd">Sufratman</div>
      <div class="jabatan">Ketua / Sekretaris</div>
    </div>
  </div>

</body>
</html>`;
}

module.exports = { generateSuratHTML };