const Dashboard = require("../models/Dashboard");

const getDashboardData = async () => {
  const [stats, wargaStats, recentSurat, suratPerJenis] = await Promise.all([
    Dashboard.getStats(),
    Dashboard.getWargaStats(),
    Dashboard.getRecentSurat(),
    Dashboard.getSuratPerJenis(),
  ]);

  return {
    stats: {
      masuk_bulan_ini:  parseInt(stats.masuk_bulan_ini),
      menunggu:         parseInt(stats.menunggu),
      selesai_bulan_ini: parseInt(stats.selesai_bulan_ini),
      total_warga:      parseInt(wargaStats.total_warga),
      warga_aktif:      parseInt(wargaStats.aktif),
    },
    recentSurat,
    suratPerJenis: suratPerJenis.map((s) => ({
      jenis: s.jenis,
      total: parseInt(s.total),
    })),
  };
};

module.exports = { getDashboardData };