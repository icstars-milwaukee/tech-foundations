// =====================================================================
// STAGE 2: Public endpoint (real internet, no key needed)
// =====================================================================
//
//   npm run stage2
//
// Open-Meteo is a free weather API. No account, no key.
// Docs: https://open-meteo.com/en/docs
//
// Real APIs can be slow, rate limited, or down. Your client from Stage 1
// handles that. If the wifi is down, this stage fails. That's the lesson.
// Your error branch should log it calmly.
//
// TODO: finish transformWeather() so output/weather.json looks like:
//   {
//     "city": "Milwaukee",
//     "observedAt": "2026-10-16T12:30",
//     "temperatureF": 51.5,
//     "windMph": 15
//   }
// Look at the raw response first (paste the URL below into your browser).
// =====================================================================

const fs = require("fs");
const path = require("path");
const { fetchJson } = require("../src/client");
const log = require("../src/logger");

const URL =
  "https://api.open-meteo.com/v1/forecast" +
  "?latitude=43.04&longitude=-87.91" +
  "&current=temperature_2m,wind_speed_10m" +
  "&temperature_unit=fahrenheit&wind_speed_unit=mph" +
  "&timezone=America%2FChicago";

function transformWeather(raw) {
  // TODO: pull the values out of raw.current
  return { city: "Milwaukee" };
}

async function main() {
  log.info(`GET ${URL}`);
  const raw = await fetchJson(URL);
  const weather = transformWeather(raw);

  const outFile = path.join(__dirname, "..", "output", "weather.json");
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(weather, null, 2) + "\n");
  log.info("Saved output/weather.json");
  console.log(weather);
}

main().catch((err) => {
  log.error(`Stage 2 failed: ${err.message}`);
  process.exitCode = 1;
});
