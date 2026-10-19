# Baseline vs AI

**Name:** 

**The task:** Turn `standup-notes.md` into a list of action items (Owner, Task, Due date).

In Week 12 you'll do this for a bigger task with a full rubric. Today is practice: **always do your own version first**, so you have something real to compare AI against.

---

## 1. Baseline (you, no AI)

Set a timer. Write the action items by hand. Stop at 5 minutes even if you aren't done.

- **Time taken (minutes):** 

| Owner | Task | Due date |
|---|---|---|
|Maya  |Add the "RSVPs closed" message to the RSVP page  |Today  |
|Team Member (not assigned)  |Review Maya's PR #14  |Not specified  |
|Andre & Luis  |Investigate and fix the events API staff endpoint issue  |Thursday  |
|Priya  |Fix the 2 failing login tests  |Not specified  |
|Priya  |Update README setup steps  |Not specified  |

## 2. Clean the input

Before anything goes near an AI tool, remove private details. List each one and what you replaced it with (or "removed").

- **Private details I removed:** Priya's phone number, email address, student ID number (removed)
- **Did removing them change what the AI can do? How?:** No. The private details were not needed to identify action items, owners, or due dates. Removing them protects privacy without affecting the task.

## 3. AI version

Paste the exact prompt you used (R-T-C-F-C). Use the **cleaned** notes.

```text
Role:
You are a project coordinator.

Task:
Turn the standup notes into a list of action items.

Context:
The notes come from a team standup meeting. Private information has already been removed.

Format:
Return a table with Owner, Task, and Due Date.

Constraints:
Only use information from the notes.
Do not invent owners or dates.
Use "Not specified" if information is missing.

Standup Notes:

Present: Maya, Andre, Priya, Luis.

Maya finished the RSVP page layout. She still needs to add the "RSVPs closed" message and asked for a review of PR #14.

Andre is blocked on the events API staff endpoint returning 500 errors. He will pair with Luis after lunch. If not fixed by Thursday, the team should switch the demo to mock data.

Priya wrote 3 login tests. 2 are failing. She will fix them and update the README setup steps.

Luis is helping Andre. The demo slides still need an owner.

Misc:
- Client check-in moved to next Thursday at 2 PM.
- Jordan's laptop needs an IT ticket.
- Remember not to commit the .env file.
```

- **Time taken (minutes, including writing the prompt):**  2

Paste the AI's output:

```text
| Owner | Task | Due Date |
|--------|--------|--------|
| Maya | Add the "RSVPs closed" message to the RSVP page | Today |
| Unassigned | Review PR #14 | Not specified |
| Andre and Luis | Troubleshoot the events API staff endpoint issue | Thursday |
| Priya | Fix the two failing login tests | Not specified |
| Priya | Update README setup instructions | Not specified |
| Unassigned | Create demo slides | Not specified |
| Jordan | Submit an IT ticket for laptop issue | Not specified |
| Team | Avoid committing the .env file | Ongoing |
```

## 4. Compare

| | Baseline (me) | AI |
|---|---|---|
| **Accuracy**: anything wrong? |Mostly accurate; assumed Thursday as a target for the API issue.  |Mostly accurate; added "Ongoing" for .env reminder.  |
| **Completeness**: anything missing? |Included all major action items.  |Included all major action items and the .env reminder.  |
| **Made-up details**: owners or dates that weren't in the notes? |"Before demo" for slides was inferred.  |"Ongoing" for .env reminder was inferred.  |
| **Privacy**: any private data in the output? |No.  |No.  |
| **Time** |4 minutes  |2 minutes  |

- **Something AI caught that I missed:** The reminder to avoid committing the .env file was turned into an action item.
- **Something I caught that AI missed or got wrong:** I noted that the demo slides should be completed before the demo, while AI left the date unspecified.
- **My decision (accept / edit / reject the AI version), and why:** The AI version is mostly correct and faster, but I would review it before using it because it inferred an "Ongoing" due date and may add details that were not explicitly stated in the notes.
