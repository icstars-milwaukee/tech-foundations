/*
 * EXERCISE 5 — Summarize data
 * Hint level: CONCEPT ONLY (you decide what to look up)
 *
 * Run it:        node exercises/05-summarize-hours.js
 * Check it:      node check.js 05
 *
 * GOAL
 *   data/hours.csv is a timesheet: one row per task an intern logged.
 *   Answer: how many hours did each intern log, and how many hours went to
 *   each kind of task?
 *
 * INPUT (data/hours.csv)
 *   intern,date,task,hours
 *   Ava,2026-11-02,Standup,0.5
 *   Marcus,2026-11-02,Standup,0.5
 *   ...
 *
 * EXPECTED OUTPUT (biggest first in each group, always 2 decimal places)
 *   Hours by intern
 *     Marcus: 11.00
 *     Priya: 8.25
 *     Ava: 7.00
 *   Hours by task
 *     Project work: 16.75
 *     Study hall: 5.50
 *     Code review: 2.50
 *     Standup: 1.50
 *   Total: 26.25
 *   Average per entry: 2.19
 */


// STEP 1 — Load the CSV into an array of objects. Make "hours" a number.



// STEP 2 — Total the hours PER INTERN.
//   Concept: "grouping" — keep a running total for each name in an object,
//   where the key is the name and the value is the total so far.
//   The first time you see a name, there's no total yet. Handle that.



// STEP 3 — Do the same thing PER TASK.
//   Concept: if you just wrote nearly the same code twice, turn it into ONE
//   function that takes the column name to group by.



// STEP 4 — Turn each group into a list you can sort, biggest total first.
//   Concept: objects don't have an order you control — arrays do.
//   Convert the object to an array of [key, value] pairs, then sort it.



// STEP 5 — Work out the overall total and the average hours per entry.
//   Concept: "reducing" a list down to one value.



// STEP 6 — Print everything to match EXPECTED OUTPUT exactly.
//   Concept: formatting a number to a fixed number of decimal places.



/*
 * STRETCH (not checked)
 *   Which DAY had the most hours logged? (You'll need this for the capstone.)
 */
