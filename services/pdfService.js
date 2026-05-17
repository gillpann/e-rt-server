const { renderToBuffer } = require("@react-pdf/renderer");
const React   = require("react");
const path    = require("path");
const SuratPDF = require("../pdf/SuratPDF");

async function generateSuratPDF(surat) {
  const logoPath = path.join(__dirname, "../assets/logo-bekasi.png");

  const element = React.createElement(SuratPDF, {
    surat,
    logoPath,
  });

  const buffer = await renderToBuffer(element);
  return buffer;
}

module.exports = { generateSuratPDF };