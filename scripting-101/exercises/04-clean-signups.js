/*
 * EXERCISE 4 — Clean up messy data
 * Hint level: SEARCH PHRASE
 *
 * Run it:        node exercises/04-clean-signups.js
 * Check it:      node check.js 04
 *
 * GOAL
 *   data/signups.csv came from a form people typed into by hand. It's a mess:
 *   extra spaces, random capitals, a missing email, a duplicate person,
 *   and "yes" written four different ways. Produce a clean list of who's
 *   actually coming in output/attendees.json.
 *
 * INPUT (data/signups.csv) — open it and look before you start!
 *   name,email,attending
 *     ava johnson ,AVA@Example.com,yes
 *   Marcus Lee,marcus@example.com,Yes
 *   Priya Patel,,yes
 *   ...
 *
 * RULES
 *   - Names:  trimmed, each word Capitalized          "  ava johnson " -> "Ava Johnson"
 *   - Emails: trimmed, all lowercase                  "AVA@Example.com" -> "ava@example.com"
 *   - Skip anyone with no email
 *   - Keep only people whose "attending" is yes (any capitalization, any spaces)
 *   - Skip duplicates — same email = same person. Keep the FIRST one.
 *   - Each object has only "name" and "email"
 *
 * EXPECTED (output/attendees.json) — 4 people:
 *   Ava Johnson, Marcus Lee, Sofia Ramirez, Jordan Kim  (in that order)
 *
 * EXPECTED PRINTED SUMMARY
 *   Read: 8
 *   Skipped (no email): 1
 *   Skipped (not attending): 2
 *   Skipped (duplicate): 1
 *   Kept: 4
 *
 * Check the rules in the order listed: no email first, then attending, then duplicate.
 */


// STEP 1 — Read the CSV and turn it into an array of objects.
//   You did this in Exercise 2. Reuse what you learned (don't copy-paste
//   blindly — re-type it and make sure you understand each line).



// STEP 2 — Write a function that cleans an email.
//   Search: "javascript string to lowercase"



// STEP 3 — Write a function that cleans a name into Title Case.
//   Think in small steps: trim -> lowercase everything -> split into words
//   -> capitalize the first letter of each word -> join back together.
//   Search: "javascript capitalize first letter of each word"
//   Watch out: "  ava johnson " has extra spaces. Do you get empty "words"?



// STEP 4 — Set up counters for each skip reason, an empty list for the
//   people you keep, and a way to remember emails you've already seen.
//   Search: "javascript Set has add"



// STEP 5 — Loop through each signup and apply the RULES in order.
//   If a rule says skip: add 1 to that counter and move to the next signup.
//   Search: "javascript continue statement in loop"



// STEP 6 — Write output/attendees.json (2-space indentation) and print the summary.



/*
 * STRETCH (not checked)
 *   Also write output/skipped.csv listing every skipped row and WHY it was skipped.
 */
