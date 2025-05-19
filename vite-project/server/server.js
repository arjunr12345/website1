// server/server.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = 4000;

app.use(cors());

app.get("/proxy", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send("Missing URL");

  try {
    const response = await fetch(targetUrl);
    const text = await response.text();
    res.send(text);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).send("Failed to fetch the URL.");
  }
});

app.listen(PORT, () => {
  console.log(`CORS Proxy running at http://localhost:${PORT}`);
});
