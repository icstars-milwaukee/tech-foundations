# Prompt Cookbook

**Name:** Amir and Cortez 

A recipe is a prompt you can **reuse**: same structure, new ingredients. Write prompts you'll actually use for studying, writing, code, or your sprint project.

Every recipe needs all fields filled in. Keep private data out of the prompts and the sample results.

---

## Example recipe (already done, don't count this one)

- **Name:** Explain an error message
- **Goal:** Understand a confusing error before I try to fix it.
- **Prompt:**

```text
You are a patient JavaScript tutor for a beginner.
Explain the error message below in plain language.
Context: I'm running a Node.js script from the terminal. Here is the line
the error points to: <paste one line of code>
Format: 1) What it means in one sentence. 2) The two most common causes.
3) One thing I can check first.
Constraints: Don't rewrite my whole program. If you can't tell the cause
from what I gave you, say what else you need to see.

Error:
<paste the first line of the error>
```

- **Sample result (short):** "It means you tried to read a property of something that's undefined. Common causes: an array index past the end, or a typo in a property name. Check: log the value right before that line."
- **What I checked:** Added a `log.debug` before the line. The value was undefined, so the explanation was correct.
- **Risks to watch:** It may guess a cause that sounds right. The log proves it, the AI doesn't.
- **Peer test:** 

---

## Recipe 1

- **Name:** Start Working in VS Code
- **Goal:** Get step-by-step instructions for opening a project and saving changes in VS Code.
- **Prompt:**

```text
You are a technical coach helping a beginner developer.

Explain how to start working on a project in VS Code.

Context:
I am working on a project stored in a GitHub repository.

Format:
1. Open the project
2. Make changes
3. Save changes
4. Verify changes

Constraints:
- Use beginner-friendly language.
- Keep the instructions under 10 steps.
- Include how to clone the repository if it is not already on my computer.
```

- **Sample result (short):** Open VS Code, select File > Open Folder, choose the project folder, make your changes, save with Ctrl+S, and verify the files were updated.
- **What I checked:** Followed the steps and successfully opened the project folder.
- **Risks to watch:** The instructions may differ depending on the operating system or VS Code version.
- **Peer test:** Have a teammate follow the steps on their computer and confirm they work.

---

## Recipe 2

- **Name:** Create Project Documentation
- **Goal:** Turn project notes into clear documentation for my team.
- **Prompt:**

```text
You are a project documentation assistant.

Turn my project notes into organized documentation.

Context:
The notes are from my sprint project and will be shared with teammates.

Format:
1. Project Overview
2. Features
3. User Stories
4. Tasks Completed
5. Next Steps

Constraints:
- Use simple language.
- Do not add information that is not in the notes.
- If information is missing, state "Not specified".
- Keep the document concise.
```

- **Sample result (short):** Project Overview: CohortHub allows users to view tickets, incidents, and changes. Next Steps: Complete testing and prepare the demo.
- **What I checked:** Compared the documentation with the original notes to ensure accuracy.
- **Risks to watch:** AI may assume features or project requirements that were never discussed.
- **Peer test:** Have a teammate review the documentation and verify it matches the project notes.

---

## Recipe 3

- **Name:** Generate Standup Action Items
- **Goal:** Convert standup meeting notes into action items.
- **Prompt:**

```text
You are a project coordinator.

Convert the standup notes into action items.

Format:
| Owner | Task | Due Date |

Constraints:
- Only use information from the notes.
- Do not make up owners or due dates.
- Use "Not specified" if information is missing.
- Keep tasks clear and actionable.

Standup Notes:
<paste notes here>
```

- **Sample result (short):** Maya | Add RSVP closed message | Today; Priya | Fix failing login tests | Not specified; Unassigned | Create demo slides | Not specified.
- **What I checked:** Verified every action item came directly from the standup notes.
- **Risks to watch:** AI may infer deadlines or owners that were not explicitly stated.
- **Peer test:** Have a teammate compare the action items to the original standup notes and check for accuracy.