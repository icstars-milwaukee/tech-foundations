/*
 * EXERCISE 6 — Organize a messy folder
 * Hint level: CONCEPT ONLY
 *
 * Run it:        node exercises/06-organize-files.js data/messy-folder --dry-run
 *                node exercises/06-organize-files.js data/messy-folder
 * Check it:      node check.js 06     (works on a copy — your folder is safe)
 *
 * GOAL
 *   A script that takes a folder name from the command line and sorts the
 *   files inside it into subfolders by type:
 *
 *     documents     .pdf .txt .docx
 *     images        .jpg .jpeg .png .gif     (any capitalization: .JPG too)
 *     spreadsheets  .xlsx .csv
 *     other         anything else, including files with no extension
 *
 *   With --dry-run, it only PRINTS what it would do and moves nothing.
 *
 * EXPECTED OUTPUT (dry run — order of lines may differ on your computer)
 *   [dry run] README -> other/
 *   [dry run] budget.xlsx -> spreadsheets/
 *   [dry run] headshot.png -> images/
 *   [dry run] notes.txt -> documents/
 *   [dry run] photo.JPG -> images/
 *   [dry run] resume.pdf -> documents/
 *   [dry run] todo.txt -> documents/
 *   Would move 7 files
 *
 * Without --dry-run: same lines without "[dry run] ", ending in "Moved 7 files".
 *
 * ERRORS
 *   No folder given     -> print "Usage: node exercises/06-organize-files.js <folder> [--dry-run]"
 *                          and exit with code 1
 *   Folder doesn't exist -> print "Folder not found: <folder>" and exit with code 1
 *
 * Moved the real files and want them back?  Run:
 *   git restore data/messy-folder && git clean -fd data/messy-folder
 */


// STEP 1 — Read the words typed after the script name on the command line.
//   Concept: Node gives every script the full command as an array.
//   The first two items are not yours. Find out what they are.



// STEP 2 — Figure out whether --dry-run was given, and which argument is the folder.



// STEP 3 — Handle the two ERRORS above before doing anything else.
//   Concept: ending a program early with an "exit code". 0 means success;
//   anything else means something went wrong.



// STEP 4 — Describe the categories as DATA, not as a pile of if/else.
//   Concept: an object whose keys are folder names and whose values are
//   lists of extensions.



// STEP 5 — List everything in the folder. Skip anything that is itself a folder.
//   Concept: getting information ("stats") about a path.



// STEP 6 — For each file, get its extension, lowercase it, and find its category.
//   Concept: Node has a built-in module just for working with file paths.
//   Use it instead of chopping strings yourself.



// STEP 7 — Build the destination path and move the file (unless dry run).
//   Concept: joining path pieces. Never glue paths with "/" by hand —
//   Windows uses "\". Let the path module handle it.
//   Concept: the destination subfolder might not exist yet. Create it first.
//   Concept: in Node, "moving" a file is called renaming it.



// STEP 8 — Print one line per file, then the summary line.



/*
 * STRETCH (not checked)
 *   Add a --by-date flag that sorts files into folders named by the
 *   year-month they were last modified (e.g. 2026-11/).
 */
