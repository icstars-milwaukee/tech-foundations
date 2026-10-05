// ============================================================
// KATA 3 (Stretch) — Multiplication Table + Input Validation
// ------------------------------------------------------------
// Goal: Take a size from the command line and print that size
// of multiplication table. `node katas/kata3.js 5` prints a
// 5x5 table.
//
// Requirements:
//   - A nested loop (a loop inside a loop): outer = rows,
//     inner = the cells in that row.
//   - A guard clause that rejects bad input up front — not a
//     whole number, less than 1, or more than 12 — and exits
//     with a helpful message.
//   - Comments explaining your logic choices.
//
// Commit rhythm (3 commits — one after each step):
//   1. scaffold  – nested loop, hard-coded 3x3 table
//   2. feature   – read the size argument, add the guard clause
//   3. refactor  – better names, no magic numbers, comments
//
// Hints:
//   - `process.argv[2]` is the first thing typed after the
//     filename. It arrives as text, so convert it to a number.
//   - Build each row into a string, then print the row once.
//
// Run it:  node katas/kata3.js 5
// ============================================================

// Your code here

const MIN_SIZE = 1;
const MAX_SIZE = 12;
const CELL_WIDTH = String(MAX_SIZE * MAX_SIZE).length + 1;

// process.argv[2] is the first argument after the filename.
// It arrives as text, so convert it to a number.
const rawInput = process.argv[2];
const size = Number(rawInput);

// Guard clause: reject bad input up front so the rest of the
if (!Number.isInteger(size) || size < MIN_SIZE || size > MAX_SIZE) {
  console.error(
    `Invalid size "${rawInput ?? ""}". ` +
    `Please enter a whole number from ${MIN_SIZE} to ${MAX_SIZE}, ` +
    `e.g. node katas/kata3.js 5`
  );
  process.exit(1); // non-zero exit code signals failure
}

// Outer loop = one pass per row.
for (let row = 1; row <= size; row++) {
  // Build the whole row as one string and print it once.
  // This gives one console.log per row, not one per cell.
  let line = "";

  // Inner loop = one pass per cell in the current row.
  for (let col = 1; col <= size; col++) {
    const product = row * col;
    line += String(product).padStart(CELL_WIDTH);
  }

  console.log(line);
}
// I used a nested loop to generate the multiplication table.
// The outer loop iterates over the rows, and the inner loop iterates over the columns.
// I built each row into a string and printed it once per row to avoid multiple console.log calls.
// The guard clause ensures that the input is a whole number between 1 and 12, exiting with an error message if it is not.