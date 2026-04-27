const puppeteer = require("puppeteer");
const { generateSuratHTML } = require("../templates/suratTemplate");

async function generateSuratPDF(surat) {
  const html = generateSuratHTML(surat);

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });

  try {
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        bottom: "20mm",
        left: "25mm",
        right: "20mm",
      },
    });

    return pdf;
  } finally {
    await browser.close();
  }
}

module.exports = { generateSuratPDF };