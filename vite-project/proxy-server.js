const express = require("express");
const request = require("request");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());

app.get("/proxy", (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).send("Missing URL parameter");
  }

  request
    .get(targetUrl)
    .on("error", (err) => {
      console.error("Proxy error:", err);
      res.status(500).send("Proxy error");
    })
    .pipe(res);
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
