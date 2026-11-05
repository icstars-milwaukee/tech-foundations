// =====================================================================
// T7A GUIDED PRACTICE: Brew & Build Pop-Up, Weekly Sales Report
// =====================================================================
//
// This program reads a week of sales from data/sales.json and prints a
// report. It is messy, it has bugs, and it crashes on bad data.
//
// With your partner:
//   1. REFACTOR  Week 1 and Week 2 are the same code copied twice.
//                Turn the repeated work into reusable functions
//                (you need at least two).
//   2. DEBUG     Week 2's numbers are wrong. Use the Debug Ritual
//                (it's on the poster and in DEBUG_LOG.md) to find the
//                ROOT CAUSE. There is more than one bug.
//   3. HANDLE    Run `npm run start:broken`. The program crashes with a
//                scary stack trace. Add try/catch so it logs a clear
//                [ERROR] message with src/logger.js and exits calmly.
//
// Rules:
//   - Keep the report labels the same ("Week 1 total:", etc.).
//     `npm test` reads them to verify your work.
//   - Mark every fix with a comment that starts with  // FIX:
//   - Commit each bug fix:  git commit -m "fix: root cause ..."
//
// Commands:
//   npm start             run the report with good data
//   npm run start:broken  run it with a broken data file
//   npm test              verify the numbers and the error handling
//   npm run check         see if your artifact is ready to submit
// =====================================================================

const fs = require("fs");
const path = require("path");

const dataFile = process.argv[2] || path.join(__dirname, "..", "data", "sales.json");
const raw = fs.readFileSync(dataFile, "utf8");
const data = JSON.parse(raw);

console.log("=== " + data.shop + " Weekly Sales Report ===");
console.log("");

// // ----- Week 1 -----
// let week1Total = 0;
// for (let i = 0; i < data.week1.length; i++) {
//   week1Total = week1Total + data.week1[i];
// }
// const week1Average = week1Total / data.week1.length;
// let week1Best = data.week1[0];
// for (let i = 0; i < data.week1.length; i++) {
//   if (data.week1[i] > week1Best) {
//     week1Best = data.week1[i];
//   }
// }
// console.log("Week 1 total: $" + week1Total.toFixed(2));
// console.log("Week 1 average: $" + week1Average.toFixed(2));
// console.log("Week 1 best day: $" + week1Best.toFixed(2));
// console.log("");

// // ----- Week 2 -----
// let week2Total = 0;
// for (let i = 0; i < data.week2.length; i++) {
//   week2Total = week2Total + data.week2[i];
// }
// const week2Average = week2Total / data.week2.length;
// let week2Best = data.week2[0];
// for (let i = 0; i < data.week2.length; i++) {
//   if (data.week2[i] > week2Best) {
//     week2Best = data.week2[i];
//   }
// }
// console.log("Week 2 total: $" + week2Total.toFixed(2));
// console.log("Week 2 average: $" + week2Average.toFixed(2));
// console.log("Week 2 best day: $" + week2Best.toFixed(2));
// console.log("");

// console.log("Two-week total: $" + (week1Total + week2Total).toFixed(2));


// Function 1: Calculates stats (total, average, best) for a given array of numbers
function calculateStats(numbers) {
  let total = 0;
  let best = numbers[0];

  for (let i = 0; i < numbers.length; i++) {
    total += numbers[i];
    if (numbers[i] > best) {
      best = numbers[i];
    }
  }

  const average = numbers.length > 0 ? total / numbers.length : 0;
  return { total, average, best };
}

// Function 2: Prints formatted weekly stats to the console and returns the week total
function printWeekSummary(weekLabel, numbers) {
  const stats = calculateStats(numbers);

  console.log(`${weekLabel} total: $${stats.total.toFixed(2)}`);
  console.log(`${weekLabel} average: $${stats.average.toFixed(2)}`);
  console.log(`${weekLabel} best day: $${stats.best.toFixed(2)}`);
  console.log("");

  return stats.total;
}

// Main Execution
const week1Total = printWeekSummary("Week 1", data.week1);
const week2Total = printWeekSummary("Week 2", data.week2);

console.log("Two-week total: $" + (week1Total + week2Total).toFixed(2));