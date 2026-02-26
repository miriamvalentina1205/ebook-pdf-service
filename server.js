import express from "express";
import puppeteer from "puppeteer";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/generate-pdf", async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).send("URL não informada");
    }

    const browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu"
      ]
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

    res.set({
      "Content-Type": "application/pdf"
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
