# Vocabulary Review: Key Terms per Session

A draft for adding a **Key terms** section to each session README (the site
renders those READMEs, so the terms would show up on each session page).

**Legend**

- ✅ **Defined** — the lesson already explains it. Listed so the glossary is complete.
- ⚠️ **Used, not explained** — appears in the lesson (often in a command, rubric, or code comment) with no definition.
- ➕ **Missing** — the lesson depends on the idea but never names it. Interns will hear the word on the job.

Definitions are written for interns: one plain sentence, no jargon inside the definition.

---

## Cross-cutting terms (used in almost every session, never defined anywhere)

Consider one shared **Glossary** page in `resources` (in `site/sessions.js`), and link each session's Key terms to it.

| Term | Status | Plain-language definition |
|---|---|---|
| Terminal / command line | ⚠️ | A text window where you type commands instead of clicking. |
| Node.js | ⚠️ | The program that runs JavaScript outside a browser (`node file.js`). |
| npm / npm scripts | ⚠️ | Node's tool for running project commands (`npm test`, `npm run check`) and installing packages. |
| Dependency | ⚠️ | Someone else's code your project needs in order to run ("zero dependencies" = none). |
| Repository (repo) | ⚠️ | A project folder that git tracks, with its full history. |
| Commit | ⚠️ | A saved snapshot of your changes, with a message saying what and why. |
| Branch / push | ⚠️ | A branch is a separate line of work; pushing sends your commits to GitHub. |
| Conventional commit prefixes | ➕ | The `feat:`, `fix:`, `docs:`, `chore:`, `clean:` labels at the start of commit messages. Every session uses them; none explains them. |
| Artifact | ⚠️ | The finished work you hand in for a session (code, docs, logs). |
| Rubric levels | ✅ | Limited → Emerging → Developing → Proficient → Advanced. |
| CohortHub | ⚠️ | The fictional app used as the running example from T7B on. |

---

## T6A — Programming Basics: Code Katas

**Already defined:** kata, scaffold → feature → refactor.

| Term | Status | Plain-language definition |
|---|---|---|
| Loop | ⚠️ | Code that repeats a block of steps, usually a set number of times. |
| Conditional (`if / else`) | ⚠️ | Code that picks a path based on whether something is true. |
| Nested loop | ⚠️ | A loop inside another loop (rows × columns in the multiplication table). |
| Guard your input / input validation | ⚠️ | Checking the input is usable before you use it, and stopping with a clear message if it isn't. |
| Magic number | ⚠️ | A raw number in code with no name explaining what it means (used in the commit example, never explained). |
| Refactor | ⚠️ | Cleaning up code without changing what it does. |
| `console.log` | ⚠️ | Prints a value to the terminal. |
| Variable / counter | ➕ | A named box that holds a value; a counter is one that goes up each time through a loop. |
| Increment (`i++`) | ➕ | Add 1 to a variable. |
| Modulo (`%`) | ➕ | The remainder after division. `15 % 3` is `0`, which means 15 divides evenly by 3. FizzBuzz depends on it; it's only in a code comment. |
| Command-line argument (`process.argv`) | ➕ | A value typed after the command (`node kata3.js 5`) that the program can read. |
| String vs number | ➕ | Text (`"5"`) vs a value you can do math with (`5`). Command-line arguments arrive as strings. |

## T7A — Functions, Errors & Debugging

**Already defined:** function (as a recipe), Debug Ritual (reproduce, inspect, add logs, hypothesize, fix, verify, commit), logging standard.

| Term | Status | Plain-language definition |
|---|---|---|
| Define vs call | ⚠️ | Defining writes the function once; calling runs it. |
| Parameter / argument | ➕ | The input a function takes (`numbers` in `calculateTotal(numbers)`). |
| Return value | ➕ | What a function hands back to whoever called it. |
| DRY (Don't Repeat Yourself) | ➕ | The name for the refactor this lesson teaches: pull repeated code into one function. |
| Log levels (DEBUG, INFO, WARN, ERROR) | ⚠️ | How serious a log line is, from detail for developers up to "something failed". |
| Timestamp | ⚠️ | The exact date and time something happened. |
| Stack trace | ⚠️ | The error report listing the chain of function calls that led to a crash, with file and line numbers. |
| Exception / throw | ⚠️ | An error the program raises ("throws"); `try/catch` catches it so the program doesn't crash. |
| Exit code | ⚠️ | A number a program reports when it ends: `0` means success, anything else means failure. |
| Root cause | ⚠️ | The real underlying reason for a bug, not just the symptom you saw. |
| Automated test / passing | ⚠️ | Code that checks your code; "5 passing" means all 5 checks succeeded. |
| `undefined` | ➕ | JavaScript's value for "nothing was ever put here". It shows up in the log example. |
| Off-by-one error | ➕ | A loop that runs one time too many or too few (`<=` instead of `<`). Classic cause of `undefined` at the end of an array. |
| Array / index | ➕ | A list of values; the index is a position, starting at 0. |

## T7B — From Stories to Design

**Already defined:** traceability chain, interface ("where parts talk"), contract ("exact data"), Mermaid shapes, JSON Schema types and extras.

| Term | Status | Plain-language definition |
|---|---|---|
| User story | ⚠️ | A short need written from the user's view: who, what, and why. |
| Acceptance criteria | ⚠️ | The specific conditions that must be true for the story to count as done. |
| Workflow | ⚠️ | The steps, in order, someone takes to get something done. |
| Happy path / failure path | ⚠️ | The route where everything works vs. the route where something goes wrong. |
| Component | ⚠️ | One part of a system (a page, an API, a database). |
| Context diagram | ⚠️ | A diagram of your system as one box and the people and systems it talks to. |
| Frontend / backend | ⚠️ | What the user sees and clicks vs. the server-side code and data behind it. |
| API / endpoint | ⚠️ | Used here ("API endpoints in Week 9") but not defined until T9A. Add a one-line preview. |
| Request / response | ➕ | The data one part sends and the data it gets back (the `login-request` and `login-response` files). |
| Field / property | ➕ | One named piece of data in an object (`email`, `password`). |
| Required vs optional | ✅ | Shown in the shorthand (`?`); fine as is. |
| `additionalProperties: false` | ⚠️ | Rejects any field not listed in the schema, which catches typos like `passwrd`. |
| OpenAPI | ⚠️ | A standard format for describing a whole API: its endpoints, requests, and responses. |
| Validation | ⚠️ | Checking data against the rules in a schema. |
| Inputs → Process → Outputs | ⚠️ | A way to describe any feature: what goes in, what happens, what comes out. |

## T8A — AI Fundamentals I

**Already defined:** reliability, bias, privacy (the three risks), R-T-C-F-C, the oversight loop.

| Term | Status | Plain-language definition |
|---|---|---|
| Prompt | ⚠️ | The instructions and context you give an AI tool. |
| Large language model (LLM) / generative AI | ➕ | The kind of AI behind chat tools: it predicts likely next words, which is why it can sound sure and still be wrong. |
| Hallucination | ➕ | When AI makes up a fact, source, or number and states it confidently. The lesson describes it ("made-up facts") but never uses the word everyone else uses. |
| Training data / "trains on it" | ⚠️ | The text a model learned from; some tools also learn from what you paste. |
| Personal data / PII | ⚠️ | Information that identifies a real person. PII ("personally identifiable information") is the industry name, and T8B's code uses it. |
| Approved tool | ⚠️ | An AI tool your program has a data agreement with, covering what happens to what you paste. |
| Baseline | ⚠️ | Your own result without AI, used for comparison. |
| Human-in-the-loop | ➕ | The industry name for the oversight loop: a person reviews and decides before AI output is used. |
| Disclosure | ⚠️ | Saying openly that AI helped ("Drafted with AI, reviewed by me"). |

## T8B — AI Integration in Projects

**Already defined:** guardrail (input/output), data provenance, comparison rubric criteria, accept / edit / reject.

| Term | Status | Plain-language definition |
|---|---|---|
| Triage | ⚠️ | Sorting incoming items by type and urgency so the right ones get handled first. |
| Redact / redaction | ⚠️ | Replacing private details with a label (`[EMAIL]`) before data goes anywhere. |
| Support ticket | ⚠️ | One logged request for help. |
| Prototype | ⚠️ | A rough working version built to test an idea. |
| Regular expression (regex) | ➕ | A pattern for matching text, like "3 digits, a dash, 4 digits". `redact.js` is built on them and the TODOs need them. |
| Over-redaction / false positive | ➕ | Removing something that wasn't private ("room 204"); a false negative is missing something that was. |
| Non-deterministic output | ➕ | The same prompt can give different answers each time. This is the answer to the peer-share question "why did other pairs get different answers?" |
| Phishing | ⚠️ | A fake message that tricks someone into clicking a link or handing over a login. |
| Escalation (`needsHuman`) | ⚠️ | Flagging an item for a person to handle instead of the AI. |

## T9A — APIs 101

**Already defined:** status codes, rate limit (429), backoff, secrets discipline, rotate a key.

| Term | Status | Plain-language definition |
|---|---|---|
| API | ⚠️ | Only defined by the metaphor in the quote. Add: a way for one program to ask another for data or actions. |
| Endpoint | ⚠️ | One specific URL an API answers at (`/api/events`). |
| Client / server | ➕ | The program that asks vs. the program that answers. |
| HTTP request / method (GET, POST) | ➕ | A request is a message to a server; the method says what kind (GET = read, POST = send). |
| Headers / body | ⚠️ | Headers carry extra info about a request or response (like the API key); the body is the actual data. |
| JSON / parse | ⚠️ | A text format for data; parsing turns that text into objects your code can use. |
| Mock server | ⚠️ | A fake local API that returns realistic test data. |
| Query parameters | ➕ | The `?latitude=...&longitude=...` part of a URL, which passes options to an API (the Open-Meteo URL uses them). |
| Authentication | ⚠️ | Proving who you are to an API, here with an API key. |
| `localhost` / port | ⚠️ | Your own computer, and the numbered "door" a program listens on (`:4000`). |
| Environment variable | ➕ | A setting given to a program from outside its code. `.env` holds them. |
| Hard-coded | ⚠️ | Typed directly into the code (used in the rubric). |
| `async` / `await` / `fetch` | ➕ | `fetch` sends a request; `await` pauses until the answer arrives. The code uses both without explaining them. |
| Exponential backoff | ➕ | The industry name for doubling the wait after each failure (500ms → 1s → 2s). |
| Postman / collection | ⚠️ | An app for sending API requests by hand; a collection is a saved set of requests. |

## T9B — Sprint 2 Rehearsal & Risks

**Already defined:** story points, risk = probability × impact, "If ___, then ___" risks, demo flow.

| Term | Status | Plain-language definition |
|---|---|---|
| Sprint | ⚠️ | A short, fixed period (often 1–2 weeks) where a team commits to finishing a set of work. |
| Agile | ⚠️ | A way of working in small iterations, getting feedback, and adjusting. |
| Backlog / backlog refinement | ⚠️ | The to-do list of work; refining means clarifying, sizing, and ordering it. |
| Planning poker | ➕ | The name for the fingers-on-three estimating game the lesson describes. |
| Fibonacci scale | ➕ | Why the points are 1, 2, 3, 5, 8: the gaps grow because bigger work is less certain. |
| Mitigation | ⚠️ | What you'll do to make a risk less likely or less damaging. |
| Risk register | ⚠️ | A table tracking each risk's score, owner, mitigation, and status. |
| Fallback | ⚠️ | A backup plan you switch to when something fails. |
| Cached data | ⚠️ | A saved copy of earlier results you can show when the live source is down. |
| Rollback | ⚠️ | Going back to the last known-good version. |
| Runbook | ⚠️ | Step-by-step instructions for handling a specific situation. |
| QA (quality assurance) | ⚠️ | Checking work meets the standard before users see it (named in the standards line only). |
| Definition of Done / blocker | ➕ | The checklist that makes a task truly finished; a blocker is anything stopping work from moving. |

## T9C — Data in the Real World: Files

**Already defined:** CSV vs JSON, the kinds of mess (headers, encoding, mixed types, duplicates, date formats).

| Term | Status | Plain-language definition |
|---|---|---|
| Pipeline | ⚠️ | A fixed series of steps that turns raw data into finished output, the same way every time. |
| Raw vs clean data | ⚠️ | The original untouched file vs. the corrected copy. |
| Data type | ➕ | What kind of value something is: text, number, true/false, or empty. |
| Encoding / UTF-8 | ⚠️ | How text is stored as bytes. UTF-8 is the standard; a mismatch turns `José` into `JosÃ©`. |
| Byte-order mark (BOM) | ⚠️ | Invisible characters some programs add at the start of a file that can break the first header. |
| Dedupe | ⚠️ | Removing duplicate records. |
| ISO 8601 date | ⚠️ | The standard date format `2026-10-14`; `toISODate` uses it but the name isn't explained. |
| `null` / `NaN` | ⚠️ | `null` means "intentionally empty"; `NaN` means "not a number", usually from a failed conversion (used in the rubric). |
| Delimiter | ➕ | The character that separates columns (a comma in CSV). |
| Whitespace / trim | ➕ | Spaces and tabs; trimming removes them from the start and end. |
| Schema validation | ⚠️ | Checking every record against rules before export (stretch). |
| Reproducible / idempotent | ➕ | Running the pipeline again gives the same result. The Advanced row asks for this without naming it. |

## T10A — Release & Operate

**Already defined:** health check, error rate, p95 latency, monitoring signal, alert threshold, rollback trigger, incident log.

| Term | Status | Plain-language definition |
|---|---|---|
| Release / deploy | ⚠️ | Deploying puts a version on a server; releasing makes it available to users. |
| Pre-flight check | ⚠️ | An automated checklist run before releasing. |
| Latency | ⚠️ | How long a request takes. |
| 5xx | ⚠️ | Any status code from 500–599, meaning the server failed. |
| Environment (staging, production) | ⚠️ | Separate places an app runs: staging is for testing; production is what real users use. |
| Semantic versioning (SemVer) | ➕ | `MAJOR.MINOR.PATCH` (1.5.0): what each number change signals. |
| Known good | ⚠️ | The last version you've confirmed works. |
| Blameless postmortem | ➕ | The industry name for "blame the process, not the person". |
| Canary / staged rollout | ⚠️ | Releasing to a small group first and widening if it's healthy (Advanced row; never explained). |
| Roll forward / hotfix | ➕ | The alternative to rollback: shipping a quick fix instead of going back. |

## T10B — Deployment with Docker

**Already defined:** Dockerfile, image, tag, container, Dockerfile instructions.

| Term | Status | Plain-language definition |
|---|---|---|
| Containerize | ⚠️ | Package an app into a Docker image. |
| Base image | ⚠️ | The starting image you build on (`node:24-alpine`). |
| Pin a version | ⚠️ | Specify an exact version so builds don't change under you. |
| Alpine | ⚠️ | A very small Linux version used to keep images light. |
| Registry (Docker Hub) | ➕ | Where images are stored and downloaded from. `FROM` pulls from one. |
| Layer / build cache | ➕ | Each instruction makes a layer; unchanged layers are reused, which is why instruction order matters. |
| Root / non-root user | ⚠️ | Root can do anything on the system; running as a limited user reduces damage if the app is attacked. |
| Port publishing (`-p host:container`) | ⚠️ | Connecting a port on your computer to a port inside the container. |
| Detached mode (`-d`) | ✅ | Explained in the cheat-sheet comment. |
| Restart policy | ⚠️ | The rule for whether Docker restarts a crashed container (named in the Advanced row). |
| SIGTERM | ⚠️ | The signal asking a program to shut down cleanly. |
| devDependencies (`--omit=dev`) | ⚠️ | Packages needed only while developing, left out of production images. |
| WSL 2 | ⚠️ | Windows' built-in Linux layer that Docker Desktop uses. |
| Container vs virtual machine | ➕ | A VM fakes a whole computer; a container shares the host's system and is much lighter. Common interview question. |
| Environment parity | ➕ | Making every environment match, which fixes "it works on my machine". |

## T11A — Demo Engineering

**Already defined:** offline/mock fallback, emergency switch, seeded data, reset script, quality gate, failure injection, chaos proxy.

| Term | Status | Plain-language definition |
|---|---|---|
| Harden | ⚠️ | Make something hold up against failures. |
| Timeout | ⚠️ | The longest you'll wait for a response before giving up. |
| Proxy | ⚠️ | A program that sits between two others and passes traffic along (and here, can cut it). |
| Sandbox | ⚠️ | A safe, separate setup for practicing without touching real systems. |
| Credentials (creds) | ⚠️ | Keys, passwords, or tokens that prove access. |
| Base URL | ⚠️ | The start of every API address (`http://localhost:4000`). |
| Defect / severity | ⚠️ | A bug, and how bad it is. |
| Burndown | ⚠️ | A chart of open work or defects going down over time. |
| Demo-blocking | ⚠️ | A defect bad enough to stop the demo. |
| Chaos engineering | ➕ | The industry name for failure injection. |
| Feature flag | ➕ | The industry name for an "emergency switch": a setting that turns behavior on or off without code changes. |
| Graceful degradation | ➕ | Still working in a reduced way when part of the system fails (the saved-data banner). |
| Smoke test | ➕ | A quick check that the main things work before going further. |

## T11B — Rehearsal & Risk Management

**Already defined:** transparent status rules, Glow / Grow, SBI, staying-steady steps.

| Term | Status | Plain-language definition |
|---|---|---|
| RAG status (Red / Amber-Yellow / Green) | ➕ | The industry name for leading with a color. |
| Risk log | ⚠️ | The ongoing version of the risk register, updated as things change. |
| Mitigation | ⚠️ | (Same as T9B.) What reduces a risk. |
| Ask | ⚠️ | A specific request for help: who, what, by when. |
| Hand-off signal | ⚠️ | A pre-agreed cue that a teammate should take over. |
| Actionable feedback | ⚠️ | Feedback specific enough that someone knows what to change. |
| GitHub issue / label / issue template | ⚠️ | An issue is a tracked task or bug; labels group issues; a template pre-fills new ones. |
| `gh` (GitHub CLI) | ⚠️ | GitHub's command-line tool. |
| Stakeholder | ➕ | Anyone affected by or invested in the project (the client, trainers, users). |
| Escalate | ➕ | Raise a problem to someone who can help, early. |

## T12A — Portfolio Artifacts & Packaging

**Already defined:** tag ("this exact commit is the version I'm showing"), the packaged folder layout.

| Term | Status | Plain-language definition |
|---|---|---|
| README | ⚠️ | The front page of a repo: what it is, how to run it. |
| Pitch | ⚠️ | One sentence on what the project does and who it's for. |
| Quickstart | ⚠️ | The shortest set of steps to get the project running. |
| Tech stack | ⚠️ | The languages, frameworks, and tools a project uses. |
| Clone / fresh clone | ⚠️ | Download a full copy of a repo; "fresh" means a new copy with nothing set up yet. |
| `origin` / remote | ⚠️ | The name for the GitHub copy of your repo. |
| Pull request (PR) / merge | ⚠️ | A request to bring a branch's changes into main, reviewed first; merging accepts them. |
| Release | ⚠️ | A tagged version published on GitHub with notes. |
| LICENSE | ⚠️ | The file that says what others may do with your code (MIT is common). |
| `node_modules` | ⚠️ | The folder of installed dependencies. Never commit it; `npm install` recreates it. |
| Schema / seed / queries (SQL) | ⚠️ | Create the tables, fill them with sample data, then ask questions of the data. |
| Decision record (ADR) | ➕ | The industry name for what `DECISIONS.md` holds: a short note on a choice, the options, and why. |
| Architecture diagram | ⚠️ | A picture of a system's main parts and how they connect (Advanced row). |
| Audit | ⚠️ | A scored check of the repo against a standard. |

---

## Suggested format for each README

Put it just above **Before you leave**, so interns see it after the concepts and before the checklist:

```markdown
## Key terms

| Term | Means |
|---|---|
| **Stack trace** | The error report listing the chain of function calls that led to a crash, with file and line numbers. |
| **Root cause** | The real underlying reason for a bug, not just the symptom you saw. |
```
