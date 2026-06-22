const {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} = require("@react-pdf/renderer");
const React = require("react");
const path  = require("path");


const S = StyleSheet.create({
  page: {
    fontFamily: "Times-Roman",
    fontSize:    11,
    color:       "#000",
    paddingTop:    22,
    paddingBottom: 22,
    paddingLeft:   30,
    paddingRight:  25,
    lineHeight:  1.4,
  },

  /* ── KOP ── */
  kop: {
    flexDirection:  "row",
    alignItems:     "center",
    paddingBottom:  8,
    marginBottom:   0,
    gap:            12,
  },
  logo: {
    width:  60,
    height: 60,
  },
  kopText: {
    flex:      1,
    textAlign: "center",
  },
  kopBaris1: {           // PEMERINTAH KABUPATEN BEKASI
    fontSize:       16,
    fontFamily: "Times-Bold",
    textTransform:  "uppercase",
    textAlign:      "center",
    letterSpacing:  0.5,
  },
  kopBaris2: {           // Desa Jejalen Jaya ...
    fontSize:       11,
    fontFamily: "Times-Bold",
    textAlign:      "center",
    marginTop:      3,
    textTransform:  "uppercase",
  },
  kopBaris3: {           // RT. RW. 08 ...
    fontSize:       12,
    fontFamily: "Times-Bold",
    textAlign:      "center",
    marginTop:      2,
    textTransform:  "uppercase",
  },

  /* garis bawah kop — tipis 1pt */
  garisBawahKop: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginTop:         8,
    marginBottom:      16,
  },

  /* ── JUDUL ── */
  judul: {
    textAlign:      "center",
    fontSize:       12,
    fontFamily: "Times-Bold",
    textDecoration: "underline",
    textTransform:  "uppercase",
    letterSpacing:  0.5,
    marginBottom:   4,
  },
  nomorText: {
    textAlign:    "center",
    fontSize:     11,
    marginBottom: 16,
  },

  /* ── PEMBUKA ── */
  pembuka: {
    fontSize:     11,
    marginBottom: 8,
  },

  /* ── TABEL DATA DIRI ── */
  row: {
    flexDirection: "row",
    marginBottom:  2,
  },
  colLabel: {
    width:      "36%",
    fontFamily: "Times-Bold",
    fontSize:   11,
  },
  colTitik: {
    width:     "5%",
    textAlign: "center",
    fontSize:  11,
  },
  colValue: {
    width:    "59%",
    fontSize: 11,
  },

  /* ── KEPERLUAN ── */
  keperluanPembuka: {
    fontSize:     11,
    marginTop:    12,
    marginBottom: 6,
  },

  dotLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "dotted",
    flex:              1,
    marginBottom:      1,
  },

  /* ── PENUTUP ── */
  penutup: {
    fontSize:     11,
    marginTop:    14,
    marginBottom: 20,
  },

  /* ── TTD — dua kolom kiri & kanan ── */
  ttdSection: {
    flexDirection: "row",
    marginTop:     4,
  },
  ttdKiri: {
    flex:      1,
    fontSize:  11,
    lineHeight: 1.6,
  },
  ttdKanan: {
    flex:       1,
    textAlign:  "center",
    fontSize:   11,
    lineHeight: 1.6,
  },
  ttdSpace: { height: 55 },
  /* garis TTD tipis */
  ttdGaris: {
    borderTopWidth: 1,
    borderTopColor: "#000",
    marginBottom:   2,
  },
  ttdNama: {
    fontFamily: "Times-Bold",
    fontSize:   11,
    textAlign:  "center",
  },
  ttdJabatan: {
    fontSize:  10,
    textAlign: "center",
  },

  /* ── PERTINGGAL ── */
  pertinggal: {
    fontSize:  9,
    marginTop: 18,
    lineHeight: 1.6,
  },
});

/* helper baris data diri */
const DataRow = ({ label, value }) =>
  React.createElement(View, { style: S.row },
    React.createElement(Text, { style: S.colLabel  }, label),
    React.createElement(Text, { style: S.colTitik  }, ":"),
    React.createElement(Text, { style: S.colValue  }, value || "-"),
  );

/* helper baris keperluan — selalu ada garis, teks di atas kalau ada isi */
const DotLine = ({ value }) =>
  React.createElement(View, { style: { marginBottom: 10 } },
    value ? React.createElement(Text, { style: { fontSize: 11, marginBottom: 2 } }, value) : null,
    React.createElement(View, { style: S.dotLine }),
  );

const fs = require("fs");

const SuratPDF = ({ surat }) => {
  const logoPath = path.join(__dirname, "../assets/logo-bekasi.png");
  const logoSrc = fs.existsSync(logoPath)
    ? `data:image/png;base64,${fs.readFileSync(logoPath).toString("base64")}`
    : null;

  const tanggal = surat.tanggal_selesai
  ? new Date(surat.tanggal_selesai).toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric",
    })
  : new Date().toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric",
    });

  const alamatLengkap = surat.alamat
    ? `Perumahan Taman Kintamani ${surat.alamat}, RT. 03 RW. 08 Ds. Jejalen Jaya, Kec. Tambun Utara`
    : "-";

  const keperluan = `${surat.keperluan}${surat.keterangan ? " — " + surat.keterangan : ""}`;

  return React.createElement(Document, null,
    React.createElement(Page, { size: "A4", style: S.page },

      /* ── KOP ── */
      React.createElement(View, { style: S.kop },
        logoSrc ? React.createElement(Image, { style: S.logo, src: logoSrc }) : null,
        React.createElement(View, { style: S.kopText },
          React.createElement(Text, { style: S.kopBaris1 }, "Pemerintah Kabupaten Bekasi"),
          React.createElement(Text, { style: S.kopBaris2 }, "Desa Jejalen Jaya - Kecamatan Tambun Utara"),
          React.createElement(Text, { style: S.kopBaris3 }, "RT. 03   RW. 08 Perumahan Taman Kintamani"),
        ),
      ),

      /* garis bawah kop tipis */
      React.createElement(View, { style: S.garisBawahKop }),

      /* ── JUDUL ── */
      React.createElement(Text, { style: S.judul }, "Surat Pengantar / Keterangan"),

      /* Nomor surat */
      React.createElement(Text, { style: S.nomorText }, `Nomor  :  ${surat.kode}`),

      /* ── PEMBUKA ── */
      React.createElement(Text, { style: S.pembuka },
        "Yang bertandatangan di bawah ini, menerangkan bahwa :"
      ),

      /* ── DATA DIRI ── */
      React.createElement(DataRow, { label: "Nama",                 value: surat.nama_pemohon }),
      React.createElement(DataRow, { label: "Tempat/Tanggal Lahir", value: surat.ttl }),
      React.createElement(DataRow, { label: "Jenis Kelamin",        value: surat.jenis_kelamin }),
      React.createElement(DataRow, { label: "Agama",                value: surat.agama }),
      React.createElement(DataRow, { label: "Pekerjaan",            value: surat.pekerjaan }),
      React.createElement(DataRow, { label: "Alamat/Domisili",      value: alamatLengkap }),
      React.createElement(DataRow, { label: "Nama Kepala Keluarga", value: surat.nama_kepala_keluarga || "-" }),

      /* ── KEPERLUAN ── */
      React.createElement(Text, { style: S.keperluanPembuka },
        "Adalah benar warga kami yang berdomisili pada alamat tersebut di atas, dan surat pengantar / keterangan ini dibuat untuk keperluan :"
      ),

      /* baris 1 isi keperluan, baris 2-4 kosong titik-titik */
      React.createElement(DotLine, { value: keperluan }),
      React.createElement(DotLine, { value: null }),
      React.createElement(DotLine, { value: null }),
      React.createElement(DotLine, { value: null }),

      /* ── PENUTUP ── */
      React.createElement(Text, { style: S.penutup },
        "Demikian disampaikan, untuk dapat dipergunakan sebagaimana mestinya."
      ),

      /* ── TTD KANAN SAJA ── */
      React.createElement(View, { style: S.ttdSection },
        React.createElement(View, { style: { flex: 1 } }),
        React.createElement(View, { style: S.ttdKanan },
          React.createElement(Text, null, `Bekasi, ${tanggal}`),
          React.createElement(Text, null, "Pengurus RT. 03 /08 Taman Kintamani"),
          React.createElement(Text, null, "Ds. Jejalen Jaya Kec. Tambun Utara"),
          React.createElement(View, { style: S.ttdSpace }),
          React.createElement(View, { style: { ...S.ttdGaris, width: "60%", alignSelf: "center" } }),
          React.createElement(Text, { style: S.ttdNama }, "Sufratman"),
          React.createElement(Text, { style: S.ttdJabatan }, "Ketua / Sekretaris"),
        ),
      ),
    )
  );
};

module.exports = SuratPDF;