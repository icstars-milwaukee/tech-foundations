# T12A: Portfolio Artifacts & Technical Packaging

**i.c.stars Tech Foundations · Week 12**

> Your repo speaks for you when you're not in the room.

An employer will spend about a minute on your GitHub. In that minute they should be able to tell **what you built, that it works, and how you think**. Today you compare strong and weak repos, then package your best project so it passes that test: a clear README, documented decisions, organized code, data, and SQL, a tagged release, and a showcase station that's ready to go. This prepares you for the **Employer Showcase**.

**Standards:** PF.KU1 · PF.SK3 · PF.SK4 · PF.SK5 · PF.O1

---

## Setup (2 minutes)

- Choose the **one** project you'll show at the Employer Showcase. Clone it next to this folder:
  ```bash
  git clone https://github.com/<you>/<your-project>.git ../my-portfolio
  ```
- Open this folder in VS Code. Node 18+, no `npm install`.
- Make sure `gh` (GitHub CLI) is logged in (`gh auth status`), or be ready to use github.com.

## What's in here

| Path | What it's for | When |
|---|---|---|
| `examples/weak-repo/` + `examples/strong-repo/` | The same project, packaged two ways | Opening |
| `tools/audit-repo.js` | Scores any repo the way an employer skims it | All session |
| `templates/README.portfolio.md` | A portfolio README template | Guided Practice |
| `templates/DECISIONS.md` | A template for documenting decisions | Guided Practice |
| `templates/PULL_REQUEST.md` | Description for your before/after PR | Guided Practice |
| `CONTRAST_WORKSHEET.md` | Strong vs weak + your "before" score | Opening |
| `BEFORE_AFTER.md` | Your PR, scores, and what changed | Guided Practice |
| `QUICKSTART_VALIDATION.md` | A peer tests your quickstart on a fresh clone | Application |
| `SHOWCASE_STATION_CHECKLIST.md` | Showcase station setup | Application |

## Commands

| Command | Does |
|---|---|
| `npm run audit:examples` | Audits the weak and strong example repos |
| `npm run audit -- ../my-portfolio --label before` | Audits **your** repo, saves `evidence/audit-before.txt` |
| `npm run audit -- ../my-portfolio --label after` | Same after your changes, saves `evidence/audit-after.txt` |
| `npm run check` | Shows which parts of your artifact are done |

---

## What employers look for

| In 10 seconds | In 60 seconds | If they're interested |
|---|---|---|
| A one-sentence pitch, a screenshot | Quickstart, tech stack, organized folders | Decisions, tests, SQL, commit history, your role |

## Packaging code, data, and SQL

```
my-portfolio/
├── README.md          pitch, screenshot, quickstart, decisions, your role
├── LICENSE
├── .gitignore         node_modules/, .env, OS junk
├── .env.example       keys with fake values (never .env itself)
├── src/               the code
├── tests/             the tests
├── sql/               schema.sql → seed.sql → queries.sql (run in that order)
├── data/              small, made-up sample data so the quickstart works
└── docs/              DECISIONS.md, screenshots, diagrams
```

- **Data:** small and made-up. No real personal data, ever. Big files (over 5 MB) belong in a link, not the repo.
- **SQL:** split into schema, seed, and queries, and say in the README what order to run them.
- **Secrets:** if a `.env` or key was **ever** committed, deleting it isn't enough. It's still in the history. Rotate the key and ask your trainer how to clean the history.

## Tags and releases

A tag marks "this exact commit is the version I'm showing."

```bash
git tag -a v1.0.0 -m "Employer Showcase release"
git push origin v1.0.0
gh release create v1.0.0 --title "v1.0.0: Showcase release" --notes "What it does, how to run it, what changed."
```

No `gh`? On GitHub: **Releases → Draft a new release → choose the tag**.

---

## Opening: strong vs weak (10 min)

1. Open `examples/weak-repo/` and `examples/strong-repo/`. Same project, very different first impression.
2. Run `npm run audit:examples`.
3. Fill in the top of `CONTRAST_WORKSHEET.md`: the 60-second test and at least 4 problems.

## Guided Practice: improve your repo through a PR (30 min)

1. **Before (3 min).** `npm run audit -- ../my-portfolio --label before`. Put the score and your top 3 fixes in the worksheet.
2. **Branch (1 min).**
   ```bash
   cd ../my-portfolio
   git switch -c portfolio-polish
   ```
3. **Fix (20 min)**, most important first:
   - **README** from `templates/README.portfolio.md`: pitch, screenshot, quickstart, tech stack, your role.
   - **Decisions:** at least 2 in `docs/DECISIONS.md` (`templates/DECISIONS.md`).
   - **Package:** move code, data, and SQL into folders. Rename `final_v2` and `copy` files. Add `.gitignore` and `.env.example`.
   - Commit as you go, with clear messages: `docs: add quickstart and screenshot to README`.
4. **After (2 min).** Back here: `npm run audit -- ../my-portfolio --label after`.
5. **Pull request (4 min).** Push the branch and open a PR using `templates/PULL_REQUEST.md` as the description:
   ```bash
   git push -u origin portfolio-polish
   gh pr create --title "Portfolio polish: README, structure, decisions" --body-file ../t12a-portfolio-packaging/templates/PULL_REQUEST.md
   ```
   Then edit the PR description to fill in your real scores and checkboxes. Ask a peer to review it. Fill in `BEFORE_AFTER.md`.

## Application: validate and get showcase-ready (15 min)

1. **Quickstart validation (8 min).** Swap with a peer. They clone your repo **fresh** and follow only your Quickstart while you watch silently. They fill in `QUICKSTART_VALIDATION.md`. Fix what tripped them up.
2. **Release (2 min).** After the PR is merged: tag `v1.0.0` and create a release.
3. **Station (5 min).** Go through `SHOWCASE_STATION_CHECKLIST.md`. Whatever isn't checked yet is your to-do list before the showcase.

## Before you leave

```bash
npm run check
```

Your **artifact** is:

- [ ] A GitHub repo with a strong README: pitch, screenshot, quickstart, stack, decisions, your role
- [ ] Packaged assets: code, data, and SQL organized; no secrets or junk
- [ ] A merged (or open and reviewed) PR showing before → after, and a tagged release
- [ ] Quickstart validated by a peer, and a showcase station checklist

## How it's assessed

| Level | What the artifact shows |
|---|---|
| Limited | README missing or one line. Files dumped at the root. Secrets or `node_modules` committed. |
| Emerging | README describes the project but has no quickstart or screenshot. Some organization. No PR or release. |
| Developing | README mostly complete. Code organized, but data/SQL unexplained. PR opened. Quickstart untested. |
| **Proficient** | Clear pitch, screenshot, working quickstart validated by a peer. Code, data, and SQL packaged and explained. Decisions documented. Improvements visible in a reviewed PR. Tagged release. Station checklist done. |
| Advanced | Repo tells a story: architecture diagram, tests, thoughtful decisions, clean history. A stranger could run it and understand your thinking in five minutes. |

Limited or Emerging? You'll join a 30-minute portfolio clinic before the showcase. That's practice, not punishment.

---

**If they can't run it, they can't see it. Make the first five minutes effortless.**
