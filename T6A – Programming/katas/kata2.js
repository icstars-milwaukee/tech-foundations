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

for (let n = 1; n <= 30; n++) {
  console.log(n);
}



for (let n = 1; n <= 30; n++) {
  if (n % 3 === 0 && n % 5 === 0) {
    console.log("FizzBuzz");
  } else if (n % 3 === 0) {
    console.log("Fizz");
  } else if (n % 5 === 0) {
    console.log("Buzz");
  } else {
    console.log(n);
  }
}

const START = 1;
const END = 30;
const FIZZ_NUMBER = 3;
const BUZZ_NUMBER = 5;

for (let number = START; number <= END; number++) {

  // Check FizzBuzz first because numbers like 15
  // are evenly divisible by both 3 and 5.
  if (number % FIZZ_NUMBER === 0 && number % BUZZ_NUMBER === 0) {
    console.log("FizzBuzz");
  } else if (number % FIZZ_NUMBER === 0) {
    console.log("Fizz");
  } else if (number % BUZZ_NUMBER === 0) {
    console.log("Buzz");
  } else {
    console.log(number);
  }
}