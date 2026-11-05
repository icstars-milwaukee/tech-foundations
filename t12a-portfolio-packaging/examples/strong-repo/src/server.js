// Serves the RSVP summary as JSON on http://localhost:3000/api/summary
const fs = require("fs");
const http = require("http");
const path = require("path");
const { countByEvent, parseCsv } = require("./rsvp");

const PORT = Number(process.env.PORT) || 3000;
const DATA = path.join(__dirname, "..", "data", "sample-rsvps.csv");

http
  .createServer((req, res) => {
    if (req.url !== "/api/summary") {
      res.writeHead(404).end();
      return;
    }
    const summary = countByEvent(parseCsv(fs.readFileSync(DATA, "utf8")));
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(summary, null, 2));
  })
  .listen(PORT, () => console.log(`RSVP Tracker on http://localhost:${PORT}/api/summary`));
