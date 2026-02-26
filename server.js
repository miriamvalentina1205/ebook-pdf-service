import express from "express";
import puppeteer from "puppeteer";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

async function generatePdfFromUrl(url) {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: "networkidle0"
  });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    scale: 1,
    margin: {
      top: "0mm",
      bottom: "0mm",
      left: "0mm",
      right: "0mm"
    }
  });

  await browser.close();
  return pdf;
}

// POST
app.post("/generate-pdf", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).send("URL não informada");

    const pdf = await generatePdfFromUrl(url);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Length": pdf.length
    });

    res.send(pdf);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao gerar PDF");
  }
});

// GET (para teste no navegador)
app.get("/generate-pdf", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).send("URL não informada");

    const pdf = await generatePdfFromUrl(url);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Length": pdf.length
    });

    res.send(pdf);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao gerar PDF");
  }
});

app.listen(3000, () => {
  console.log("PDF service rodando na porta 3000");
});
