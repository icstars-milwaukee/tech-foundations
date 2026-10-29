# Week 9 Assessment C: Reflection

**Name:** Ventura Perez · **Date:** October 29, 2026

## What worked?

Checking things against the source instead of trusting how they looked.

In Task 1 the AI got all 32 numbers right, and I almost accepted it as-is. But when I lined it up against the baseline, I saw it had quietly dropped one row (31 attendees for 24 seats), and that one row changed which program came out on top. Correct math isn't the same thing as the right answer.

In Task 2, sorting failures into kinds (network, timeout, rate limit, server error) made everything after that easier. Each kind gets its own plain-English message, and only the ones that might fix themselves get retried.

Task 3 was the same story. VS Code showed "Jos�" for P003, and the obvious fix was to read the whole file as Latin-1. That would have broken "Zoë" in P005 instead. Looking at the actual bytes showed me the file mixed two encodings, so the pipeline decodes it one line at a time. There was also one date I couldn't be sure about, 10/06/2026. I checked the other start dates and every one was a Tuesday. October 6 is a Tuesday and June 10 isn't, so I had a real reason for reading it as October and wasn't just guessing.

## What could I improve next time?

My commits. Tasks 1 and 2 went in as "task 1" and "task 2," which doesn't tell anyone what changed. In Task 3 I didn't commit as I went, so the scaffold → feature → refactor history got split up at the end from finished code. Next time I'll commit at each step while I'm working, with a message that says what changed.

I'd also measure more and estimate less. Most of my time-saved numbers in Task 1 were estimates. Next time I'll time myself.

And I used Claude Code to help build the Task 3 pipeline. Next time I want to write more of the first version myself before I bring AI in, so I can explain every line without looking.

## What professional habit will I keep practicing?

Going back to the source before I trust an output, whether it came from an AI, a text editor, or my own code. In practice that means recomputing the numbers, opening the raw file, and writing down what I decided and why while I'm doing it, the way the cleaning log and evaluation log made me do. Once it's written down, someone else can check my reasoning, and so can I a week from now.
