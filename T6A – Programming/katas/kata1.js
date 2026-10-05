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

// Your code here
// This loops is going to just iterate from 1 to 1o and print all the numbers
// I wrote it this way because it's just a straight shot from 1 to 10.

for (let num=1; num <= 10; num++) {
    console.log(num);
}


// This loop uses the modulus operator to check if a number is even 
// or odd, and if it is even, it will print i, otherwise, it will not.
for (let num=1; num <= 10; num++) {
    if (num % 2 == 0) {
        console.log(num);
    }
}

// I refactored the code to use the iterator variable num instead of i