# Baseline vs AI

**Name:** Jose & Fernando

**The task:** Turn `standup-notes.md` into a list of action items (Owner, Task, Due date).

In Week 12 you'll do this for a bigger task with a full rubric. Today is practice: **always do your own version first**, so you have something real to compare AI against.

---

## 1. Baseline (you, no AI)

Set a timer. Write the action items by hand. Stop at 5 minutes even if you aren't done.

- **Time taken (minutes):** 

| Owner | Task | Due date |
|---|---|---|
| Maya | Finish RSVP page layout | Tuesday |
| Andre & Luis | Complete events API | Thursday |
| Luis | Make demo slides | Wednesday|
| Priya | Fix the readme setup and login. | Tuesday |

## 2. Clean the input

Before anything goes near an AI tool, remove private details. List each one and what you replaced it with (or "removed").

- **Private details I removed:** The dentist appointment detail.
- **Did removing them change what the AI can do? How?:** Nah.

## 3. AI version

Paste the exact prompt you used (R-T-C-F-C). Use the **cleaned** notes.

```text
Please make action items based off the standup notes:

```
# CohortHub Team: Standup Notes (raw)

> These notes are made up for practice. Treat them as if they were real.
> **Before you paste any of this into an AI tool, remove the private details.**

---

standup tues. present: Maya, Andre, Priya, Luis (Jordan out)

Maya: finished the RSVP page layout yesterday. still needs the "RSVPs closed" message. said she'd do that today. also asked if someone can review her PR #14

Andre: blocked on the events API. the staff endpoint keeps returning 500. thinks it's the date format. he'll pair with Luis on it after lunch. if not fixed by Thursday we should switch the demo to mock data

Priya: wrote 3 tests for login. 2 failing. she'll fix and also update the README setup steps since new people can't get it running. her cell if anyone needs her tonight 414-555-0142

Luis: helping Andre. also we need someone to make the demo slides - nobody claimed it yet

misc:
- client check-in moved to next thursday 2pm
- Jordan's laptop needs IT ticket, Jordan's student ID is 20261187 for the form
- remember to not commit the .env file AGAIN
- Priya's email for the shared drive invite: priya.r@cohorthub.test
```

Make them in a markdown format with a table. The columns are "owner" "task" and "due date"
```

- **Time taken (minutes, including writing the prompt):** 

Paste the AI's output:

```text
| Owner | Task | Due date |
|---|---|---|
| Maya | Add the "RSVPs closed" message to the RSVP page | Today (Tue) |
| Unassigned | Review Maya's PR #14 | Not set |
| Andre + Luis | Pair on the events API: staff endpoint returns 500 (suspected date format issue) | Today, after lunch |
| Andre | If the endpoint isn't fixed, switch the demo to mock data | Thursday (decision point) |
| Priya | Fix the 2 failing login tests (3 written) | Not set |
| Priya | Update the README setup steps so new people can get it running | Not set |
| Unassigned | Make the demo slides (nobody has claimed it) | Not set, before the demo |
| Unassigned | File an IT ticket for Jordan's laptop (Jordan was out) | Not set |
| Unassigned | Send Priya the shared drive invite | Not set |
| Whole team | Don't commit the `.env` file (again) | Ongoing |
| Whole team | Client check-in, 2:00 PM | Next Thursday |
```

## 4. Compare

| | Baseline (me) | AI |
|---|---|---|
| **Accuracy**: anything wrong? |  |  |
| **Completeness**: anything missing? |  |  |
| **Made-up details**: owners or dates that weren't in the notes? |  |  |
| **Privacy**: any private data in the output? |  |  |
| **Time** |  |  |

- **Something AI caught that I missed:** 
- **Something I caught that AI missed or got wrong:** 
- **My decision (accept / edit / reject the AI version), and why:** 
