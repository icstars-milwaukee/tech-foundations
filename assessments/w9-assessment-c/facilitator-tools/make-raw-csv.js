// Regenerates task-3-pipeline/data/raw.csv with exact bytes.
//
//   node facilitator-tools/make-raw-csv.js
//
// The file is dirty ON PURPOSE. Planted issues:
//   - header: 4th column has no name (it holds the neighborhood); last column
//     has no name and no data
//   - sessions_attended: "12", "twelve", "", " 7 ", "NULL"
//   - start_date: 2026-09-08, 09/15/2026, Sep 22 2026, 9/29/26, 2026/10/06, N/A
//   - completed: yes / Y / TRUE / no / N/A / blank
//   - a row of only commas and a fully empty line
//   - missing first_name and missing neighborhood
//   - "José" written as Latin-1 bytes (0xE9), which is invalid UTF-8 and shows
//     as "Jos�" in VS Code. "Zoë" is correct UTF-8, so decoding the whole file
//     as Latin-1 breaks a different row.
//   - Windows (CRLF) line endings
// task-3-pipeline/.gitattributes marks raw.csv as binary so git keeps every byte.

const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "..", "task-3-pipeline", "data", "raw.csv");
const LATIN1 = Symbol("latin1");

const lines = [
  "participant_id,first_name,program,,start_date,sessions_attended,completed,",
  "P001,Maya,Teen Coding Club,Washington Park,2026-09-08,12,yes,",
  "P002,Darnell,Adult Digital Skills,Mitchell Street,09/15/2026,twelve,no,",
  [LATIN1, "P003,José,Homework Help,Sherman Park,Sep 22 2026,10,Y,"],
  "P004,Keisha,Senior Tech Help,Bay View,2026-09-08,,no,",
  "P005,Zoë,Teen Coding Club,Washington Park,9/29/26,8,TRUE,",
  ",,,,,,,",
  "P006,Andre,Adult Digital Skills,Mitchell Street,2026/10/06,NULL,N/A,",
  "",
  "P007,Lena,Homework Help,Sherman Park,2026-09-15, 7 ,yes,",
  "P008,Marcus,Teen Coding Club,,10/06/2026,11,no,",
  "P009,Tasha,Senior Tech Help,Bay View,2026-09-22,9,yes,",
  "P010,,Homework Help,Sherman Park,2026-09-29,6,no,",
  "P011,Rosa,Adult Digital Skills,Mitchell Street,Oct 13 2026,5,yes,",
  "P012,Kevin,Senior Tech Help,Bay View,N/A,3,,",
  "P013,Imani,Teen Coding Club,Washington Park,2026-10-13,4,no,",
  "P014,Luis,Homework Help,Sherman Park,10/13/2026,twelve,Y,",
];

const buffers = lines.map((line) =>
  Array.isArray(line) ? Buffer.from(line[1] + "\r\n", "latin1") : Buffer.from(line + "\r\n", "utf8")
);
fs.writeFileSync(OUT, Buffer.concat(buffers));
console.log(`Wrote ${path.relative(process.cwd(), OUT)} (${lines.length} lines)`);
