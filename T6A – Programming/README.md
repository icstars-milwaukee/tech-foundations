# T6A — Programming Basics (Code Katas)

Welcome! Today you'll write three short programs ("katas") that show clear
logic and structure. By the end you should be able to write a small program
and explain why it works.

## Your artifact

Three finished katas in the `katas/` folder:

| File | Kata | What it proves |
|------|------|----------------|
| `katas/kata1.js` | **Baseline** — first 10 even numbers | You can write a loop |
| `katas/kata2.js` | **Feature** — FizzBuzz, 1 to 30 | You can put a conditional inside a loop |
| `katas/kata3.js` | **Stretch** — multiplication table | You can nest loops and guard your input |

Open each file — the instructions are in the comments at the top. Write your
code under `// Your code here`.

## How to run your code

```bash
node katas/kata1.js       # kata 1
node katas/kata2.js       # kata 2
node katas/kata3.js 5     # kata 3 — the 5 is the table size
```

Run it early and often. A program you've never run is a program you don't
know works.

## Two rules for every kata

**1. Comment your logic choices.** Don't narrate the obvious:

```js
i++;  // add 1 to i          <- useless, we can read that
```

Explain the decision instead:

```js
// Check "both" first — if we checked Fizz first, 15 would never
// reach the FizzBuzz branch.
```

**2. Three commits per kata.** Commit at each step so your history shows how
you got there:

```bash
git add katas/kata1.js
git commit -m "Scaffold kata1: loop printing 1 to 10"
# ...now make it print even numbers...
git commit -am "Add even-number logic to kata1"
# ...now clean it up...
git commit -am "Refactor kata1: name the counter, drop magic number"
```

That's **scaffold → feature → refactor**, nine commits total across the three
katas. Messages say what changed and why — "fixed it", "update", and "asdf"
don't count.

## Before you call it done

- [ ] All three katas run without errors
- [ ] Kata 1 uses a loop (not 10 `console.log` lines)
- [ ] Kata 2 handles 15 correctly (prints `FizzBuzz`, not `Fizz`)
- [ ] Kata 3 has a nested loop and rejects bad input with a helpful message
- [ ] Every kata has comments explaining a logic choice
- [ ] `git log --oneline` shows 3 meaningful commits per kata
- [ ] Your work is pushed to your branch

## Stuck?

Stuck for more than ~10 minutes is a good time to ask. Say what you expected,
what actually happened, and what you've already tried — that's the habit, not
just the courtesy.

---

This artifact feeds directly into the **Week 96 Performance Assessment CB
(Programming Basics)**. Keep it.
