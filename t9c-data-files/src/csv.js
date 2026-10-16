// Read and write CSV. You don't need to edit this file.
//
// CSV looks simple ("values separated by commas") until a value contains a
// comma, a quote, or a line break. Then the value is wrapped in quotes:
//
//   name,comment
//   Maya,"Loved it, but need more time"       <- comma inside quotes
//   Luis,"Line one                            <- line break inside quotes
//   line two"
//   Ana,"She said ""hi"""                     <- a quote is written as ""
//
// That's why you use a real parser instead of line.split(",").

function parseCSV(text) {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') {
        value += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        value += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(value);
      value = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(value);
      rows.push(row);
      row = [];
      value = "";
    } else {
      value += ch;
    }
  }
  if (value !== "" || row.length) {
    row.push(value);
    rows.push(row);
  }
  return rows;
}

function quote(value) {
  const s = value === null || value === undefined ? "" : String(value);
  return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

// rows: array of objects. columns: the order to write them in.
function toCSV(rows, columns) {
  const lines = [columns.map(quote).join(",")];
  for (const r of rows) lines.push(columns.map((c) => quote(r[c])).join(","));
  return lines.join("\n") + "\n";
}

module.exports = { parseCSV, toCSV };
