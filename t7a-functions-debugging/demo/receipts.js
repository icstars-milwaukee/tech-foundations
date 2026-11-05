// T7A DEMO (trainer leads this one, you follow along)
//
// Three customer receipts. Each total is calculated "freestyle":
// the same loop is copied and pasted three times.
//
// Questions to ask yourself:
//   - How many places would I have to change if the tax rule changed?
//   - What happens if I fix a bug in one copy but forget the others?
//
// Run it:  npm run demo

const receiptA = [4.5, 3.25, 6];
const receiptB = [12, 2.75];
const receiptC = [8.5, 8.5, 1.25, 3];

let totalA = 0;
for (let i = 0; i < receiptA.length; i++) {
  totalA = totalA + receiptA[i];
}
console.log("Receipt A: " + receiptA.length + " items, total $" + totalA.toFixed(2));

let totalB = 0;
for (let i = 0; i < receiptB.length; i++) {
  totalB = totalB + receiptB[i];
}
console.log("Receipt B: " + receiptB.length + " items, total $" + totalB.toFixed(2));

let totalC = 0;
for (let i = 0; i < receiptC.length; i++) {
  totalC = totalC + receiptC[i];
}
console.log("Receipt C: " + receiptC.length + " items, total $" + totalC.toFixed(2));
