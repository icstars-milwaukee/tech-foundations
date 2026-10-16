# T8A: AI Fundamentals I

**i.c.stars Tech Foundations · Week 8**

> AI writes a fast first draft. You're still the one who signs it.

AI tools can save you hours, and they can also invent facts, leak private data, and repeat bias in a confident voice. Today you'll learn to write prompts that get useful results **and** to check those results before you trust them. Your prompt cookbook and checklist come back in **Week 12 Assessment D**, where you'll improve a task with AI and compare it to your own work.

**Standards:** AI.KU1 · AI.SK1 · AI.SK2 · AI.O1

---

## Setup (2 minutes)

- Open this folder in VS Code. Node 18+ is all you need. No `npm install`.
- Open the AI chat tool your program has approved. Use the approved one, not just whichever you like best. Approved tools have agreements about what happens to your data.
- **One rule all session:** never paste real personal data into an AI tool. That means no names tied to private details, phone numbers, emails, addresses, IDs, health info, or passwords. Use made-up data or remove it first.

## What's in here

| Path | What it's for | When |
|---|---|---|
| `case-studies/AI_MISTAKES.md` | Six real AI mistakes from the news | Concept |
| `case-studies/CASE_NOTES.md` | Your group's analysis of one case | Guided Practice |
| `checklist/RESPONSIBLE_USE.md` | **Your checklist.** Starter items + the ones you add | Guided Practice |
| `baseline/standup-notes.md` | Messy meeting notes for the baseline vs AI task | Guided Practice |
| `baseline/BASELINE_VS_AI.md` | Your work first, then AI, then a comparison | Guided Practice |
| `cookbook/PROMPT_COOKBOOK.md` | **Your prompt cookbook.** Reusable prompts that work | Application |

## Commands

| Command | Does |
|---|---|
| `npm run check` | Shows which parts of your artifact are done, and flags any personal data you may have pasted |

---

## The three risks

Every time you use AI, ask about these three:

| Risk | What it looks like | How you catch it |
|---|---|---|
| **Reliability** | Made-up facts, fake sources, wrong math, confident answers to questions it can't know | Check facts against a real source. Ask "how would I know if this is wrong?" |
| **Bias** | Outputs that favor or leave out groups of people. Stereotyped examples. Unequal treatment in rankings or screening. | Swap names or groups and see if the answer changes. Ask who is missing. |
| **Privacy** | Personal or company data pasted into a tool that stores it, trains on it, or repeats it | Remove or replace private data **before** you paste. When in doubt, leave it out. |

## Prompt anatomy: R-T-C-F-C

A strong prompt has five parts. You won't always need all five, but checking for them fixes most weak prompts.

| Part | Question it answers | Example |
|---|---|---|
| **Role** | Who should the AI act as? | "You are a project coordinator for a software team." |
| **Task** | What exactly should it do? | "Turn these meeting notes into a list of action items." |
| **Context** | What does it need to know? | "The team is 4 interns building a web app. The demo is Friday." |
| **Format** | What should the answer look like? | "A table with columns: Owner, Task, Due date." |
| **Constraints** | What are the rules and limits? | "Only use names that appear in the notes. If an owner or date is missing, write UNKNOWN. Don't guess." |

**Weak:** `summarize these notes`

**Strong:**

```text
You are a project coordinator for a 4-person intern software team.
Turn the meeting notes below into action items.
Format: a Markdown table with columns Owner | Task | Due date.
Rules: Only use names that appear in the notes. If the owner or due date
is not stated, write UNKNOWN. Don't invent anything. After the table,
list anything in the notes that was unclear.

Notes:
<paste notes here, with private details removed>
```

The last constraint matters most. **Asking AI to say what it doesn't know** is one of the best ways to catch made-up answers.

## The oversight loop

AI makes the draft. You make the decision.

```
Prompt → Review → Verify → Decide → Disclose
```

1. **Prompt** with R-T-C-F-C. Private data removed.
2. **Review** the output. Read all of it, not just the first line.
3. **Verify** facts, numbers, names, and sources against something real.
4. **Decide:** accept it, edit it, or reject it.
5. **Disclose** when it matters: "Drafted with AI, reviewed by me."

---

## Guided Practice (groups, then solo, 25 min)

**Part 1: AI mistake case studies (groups, 10 min)**

1. Your trainer assigns your group one case in `case-studies/AI_MISTAKES.md`.
2. Fill in your section of `case-studies/CASE_NOTES.md`: what went wrong, which risk, what human check would have stopped it.
3. Share your case with the room in 60 seconds.

**Part 2: Build your checklist (5 min)**

Open `checklist/RESPONSIBLE_USE.md`. Read the starter items, then **add at least two of your own** based on the cases you heard. A good item is something you could actually check off. "Be careful" doesn't count. "Every statistic has a source I opened" does.

**Part 3: Baseline vs AI (solo, 10 min)**

This is a preview of Week 12. Follow `baseline/BASELINE_VS_AI.md`:

1. **You first.** Set a timer. Turn `baseline/standup-notes.md` into action items **by hand**. No AI. Record your time.
2. **Clean the input.** The notes contain private details. Remove them before anything goes near an AI tool. Write down what you removed.
3. **Then AI.** Use an R-T-C-F-C prompt on the cleaned notes. Record the time.
4. **Compare.** What did AI get right, miss, or make up? What did *you* miss?

## Application (on your own, then swap, 10 min)

Fill in `cookbook/PROMPT_COOKBOOK.md` with **three recipes**: prompts you'll actually reuse (for studying, writing, coding, or your sprint project). Each recipe needs the prompt, a sample result, and what you checked.

Then swap with a partner. Run **one** of their recipes in your AI tool. Did it work without them explaining it? Write what happened in their recipe's **Peer test** line.

## Before you leave

```bash
npm run check
```

Your **artifact** is:

- [ ] A prompt cookbook with 3+ recipes, each with a prompt, result, and check
- [ ] A responsible-use checklist with 2+ items you added
- [ ] One baseline vs AI comparison, with private data removed before prompting
- [ ] Case study notes from your group

## How it's assessed

| Level | What the artifact shows |
|---|---|
| Limited | Prompts are one-liners. No checklist. Private data pasted into AI. No comparison to your own work. |
| Emerging | Some prompts have structure. Checklist is copied, not added to. Risks named but not tied to real outputs. |
| Developing | 3 recipes with structure. Checklist has your own items. Baseline vs AI done, but the comparison stays general ("AI was faster"). |
| **Proficient** | Recipes use R-T-C-F-C and say what was checked. Checklist items are specific and checkable. Comparison names real gaps, made-up details, and risks. Private data removed and logged. |
| Advanced | Recipes ask AI to flag what it doesn't know. Peer-tested and revised. Comparison shows where *you* were better and where AI was, with a clear decision on when to use each. |

Limited or Emerging? You'll join a 30-minute AI practice clinic this week. That's practice, not punishment.

---

**Rule of thumb: if you can't check it, you can't trust it.**
