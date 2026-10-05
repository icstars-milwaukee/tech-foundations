// ============================================================
// KATA 1 (Baseline) — First 10 Even Numbers
// ------------------------------------------------------------
// Goal: Print the first 10 even numbers (2, 4, 6 ... 20).
//
// Requirements:
//   - Use a loop. Do not write 10 separate console.log lines.
//   - Add comments that explain WHY you wrote it that way,
//     not just what the line does.
//
// Commit rhythm (3 commits — one after each step):
//   1. scaffold  – a loop that just prints 1 through 10
//   2. feature   – make it print even numbers instead
//   3. refactor  – better names, no magic numbers, comments
//
// Run it:  node katas/kata1.js
// ============================================================

// We use a loop because we need to generate a pattern, not write
// 10 separate log statements by hand. The loop runs 10 times,
// and each pass calculates the next even number by adding 2.
const firstEvenNumber = 2;
const totalEvenNumbers = 10;
const evenStep = 2;

for (let count = 0; count < totalEvenNumbers; count++) {
  // We start at 2 so the first value is even, then we add 2 each time
  // to keep every value in the sequence even.
  const evenNumber = firstEvenNumber + count * evenStep;
  console.log(evenNumber);
}