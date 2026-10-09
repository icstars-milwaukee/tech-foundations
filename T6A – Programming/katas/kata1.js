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

// We start at 2 because the first even number is 2, and we stop after
// 10 values so the loop prints exactly the first 10 even numbers.

const totalEvenNumbers = 10;
const firstEvenNumber = 2;

for (let count = 0; count < totalEvenNumbers; count++) {
  // Even numbers always increase by 2, so each pass moves to the next one
  // in the sequence without writing out every number by hand.
  const evenNumber = firstEvenNumber + (count * 2);
  console.log(evenNumber);
}




