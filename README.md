# Tech Foundations — The Technical Curriculum Track

**Interns: browse every session at https://icstars-milwaukee.github.io/tech-foundations/**

The living notebook of the Tech Foundations track: the hands-on technical problem
and answering it — discovery, requirements, business analysis, solution
cycle goes deep on. Every cycle documents its
learning here, module by module, one Cornell guide per lesson.

## Architecture

```
templates/
└── module/                ← copy this per module, per cycle
    ├── README.md          ← module overview + lesson index + retro
    └── lessons/
        └── lesson-template.md   ← the Cornell guide, one per lesson
cycles/
└── cycle-21-fall-2026/    ← one folder per cohort
    ├── 01-module-name/    ← modules copied from templates/module
    └── 02-module-name/
```

Start a new cycle: add `cycles/<cycle-name>/` and copy `templates/module/`
in for each module as the cohort reaches it (keep number prefixes so
modules sort in order).

## The Cornell method (why every lesson has a guide)

A lesson is complete when its guide is filled through the Summary:

1. **Cues** turn content into questions you can quiz yourself with.
2. **Notes** are the capture, in your own words.
3. **Apply it** proves you can do the thing, not just describe it.
4. **Summary within 24 hours** is where retention actually happens.

## House rules

1. Everything enters through a **pull request** with one teammate's
   review — that's the git training, from week one.
2. Write **for the next cycle** — could an intern six months from now
   skip a dead end because of your entry?
3. Never commit secrets, personal data, client material, or big binaries
   (link those from Drive).

## The website (GitHub Pages)

`index.html` + `site/` turn the session READMEs into a simple site for interns.
To add a session to it, add one entry to `site/sessions.js`. Nothing to build:
the page reads each `<folder>/README.md` straight from the repo.
