// ============================================================
// KATA 2 (Feature) — FizzBuzz, 1 to 30
// ------------------------------------------------------------
// Goal: Count from 1 to 30. For each number print:
//   - "FizzBuzz" if it divides evenly by both 3 and 5
//   - "Fizz"     if it divides evenly by 3
//   - "Buzz"     if it divides evenly by 5
//   - the number itself otherwise
//
// Requirements:
//   - A conditional INSIDE a loop.
//   - Comment on your branch order and why it matters.
//
// Commit rhythm (3 commits — one after each step):
//   1. scaffold  – a loop that prints 1 through 30
//   2. feature   – add the Fizz / Buzz / FizzBuzz rules
//   3. refactor  – better names, no magic numbers, comments
//
// Hint: `%` gives you the remainder. `n % 3 === 0` means
// "n divides evenly by 3."
//
// Watch out: think carefully about which condition you check
// FIRST. Try your code on 15 and see what happens.
//
// Run it:  node katas/kata2.js
// ============================================================

// Your code here

for (let i = 1; i <= 30; i++) {
  if (i % 3 === 0 && i % 5 === 0) {
    console.log("FizzBuzz");
  } else if (i % 3 === 0) {
    console.log("Fizz");
  } else if (i % 5 === 0) {
    console.log("Buzz");
  } else {
    console.log(i);
  }
}