# T9A: APIs 101

**i.c.stars Tech Foundations · Week 9**

> An API is a promise between two systems. Your job is to handle it when the promise breaks.

In T7B you designed a data contract. Today you **call** real APIs, parse the JSON they send back, and turn it into a clean dataset. You'll also handle the things that go wrong in real life: rate limits, servers that are down, and secret keys. This is **directly assessed in Week 9 Performance Assessment C** (API.SK1–2).

**Standards:** API.KU1 · API.SK1 · API.SK2 · API.O1

---

## Setup (5 minutes)

- Node **18 or newer** (it has `fetch` built in). Check with `node -v`. No `npm install`.
- **Postman** (desktop app or https://web.postman.co). Import `postman/T9A-APIs-101.postman_collection.json`. Your trainer will model it live.
- If this folder isn't a git repo yet: `git init`, then commit the starter files.
- You'll use **two terminals**: one runs the mock server, the other runs your code.

## What's in here

| Path | What it's for | When |
|---|---|---|
| `mock-server/server.js` | Local CohortHub API. Always up, including on bad wifi. | Stages 1 + 3 |
| `postman/` | Postman collection for all three stages | Modeling |
| `src/client.js` | **Your code.** `fetchJson()` with error handling + retry | Guided Practice |
| `src/transform.js` | **Your code.** Raw events → clean dataset | Guided Practice |
| `practice/stage1-mock.js` | Stage 1: mock endpoint | Guided Practice |
| `practice/stage2-public.js` | Stage 2: public endpoint (finish one TODO) | Guided Practice |
| `practice/stage3-auth.js` | Stage 3: authenticated endpoint (finish one TODO) | Application |
| `src/env.js` + `.env.example` | How secrets get into your code without being *in* your code | Application |
| `src/logger.js` | The Week 7 logging standard | All session |
| `output/` | Your transformed datasets land here | All session |
| `API_NOTES.md` | Your notes for each stage | All session |

## Commands

| Command | Does |
|---|---|
| `npm run mock` | Starts the mock API on http://localhost:4000 (leave it running) |
| `npm run stage1` | Calls `/api/events`, writes `output/events.json` |
| `npm run stage1:flaky` | Same, but the server fails twice first |
| `npm run stage2` | Calls Open-Meteo, writes `output/weather.json` |
| `npm run stage3` | Calls the secure endpoint with your key, writes `output/attendance.json` |
| `npm test` | Checks your client (errors, retry) and your transform |
| `npm run check` | Shows which parts of your artifact are done, and checks for leaked keys |

---

## The staged endpoints

We go from safest to most realistic. If one stage breaks, you still have the one before it.

| Stage | Endpoint | Needs internet? | Needs a key? | Teaches |
|---|---|---|---|---|
| 1 | Mock: `localhost:4000/api/events` | No | No | Calling, parsing, transforming, retry |
| 2 | Public: Open-Meteo weather | Yes | No | Real-world APIs, reading docs, failure when offline |
| 3 | Authenticated: `localhost:4000/api/secure/attendance` | No | **Yes** | Headers, `.env`, secrets discipline |

## Reading a response

Every response has a **status code** and a **body**.

| Code | Means | Should you retry? |
|---|---|---|
| 200 | OK | No need |
| 400 | Your request is malformed | No. Fix the request. |
| 401 | No key / not logged in | No. Add the key. |
| 403 | Key is wrong or not allowed | No. Fix the key. |
| 404 | Nothing at that URL | No. Fix the URL. |
| **429** | Too many requests (rate limited) | **Yes**, after waiting (check `Retry-After`) |
| 500, 502, 503, 504 | The server had a problem | **Yes**, with backoff |

**Backoff** means waiting longer after each failure (500ms → 1s → 2s) so you don't hammer a server that's already struggling.

```js
const res = await fetch(url, { headers: { "x-api-key": key } });
res.ok;                       // true for 200-299
res.status;                   // 200, 404, 503 ...
res.headers.get("retry-after");
const body = await res.json(); // parse the JSON body
```

## Secrets discipline

API keys are passwords. Bots scan public GitHub repos for leaked keys within minutes.

1. Keys go in **`.env`**, never in code.
2. **`.env` is in `.gitignore`**, so git never sees it.
3. **`.env.example`** is committed with fake values, so teammates know what they need.
4. Before every commit: `git status`. If you see `.env`, **stop**.
5. If a key is ever committed, deleting the file isn't enough. It's still in git history. **Tell your trainer and rotate (replace) the key.**

```bash
cp .env.example .env         # then paste the real key into .env
git check-ignore -v .env     # proves git is ignoring it
```

---

## Guided Practice (pairs, 25 min)

**Stage 1 (15 min)**

1. Terminal 1: `npm run mock`. Open http://localhost:4000/api/events in your browser. Read the raw shape.
2. Run `npm test`. Most tests fail. That's your to-do list.
3. In `src/transform.js`, write `transformEvents()`. Run `npm run stage1` and look at the table.
4. In `src/client.js`, do TODO 1 (error branch), TODO 2 (retry with backoff), and TODO 3 (logging).
5. Run `npm run stage1:flaky`. You should see two `[WARN]` lines, then success.
6. `npm test` until **7 passing**. Commit: `feat: reliable API client with retry and backoff`.

**Stage 2 (10 min)**

1. Paste the Open-Meteo URL from `practice/stage2-public.js` into your browser. Read the raw shape.
2. Finish `transformWeather()`. Run `npm run stage2`.
3. Break it on purpose: put a typo in the URL, or turn wifi off. Does your error branch log calmly? Undo the break.

Fill in `API_NOTES.md` stages 1 and 2 as you go.

## Application (on your own, 10 min)

**Stage 3: authenticated endpoint.**

1. `cp .env.example .env`. Paste the key printed in your mock server's terminal.
2. `git status`: `.env` must **not** appear. Run `git check-ignore -v .env` to prove it.
3. Finish `transformAttendance()` in `practice/stage3-auth.js`. Run `npm run stage3`.
4. Try it with no key and with a wrong key (in Postman too). Note the status codes.
5. Commit your outputs and notes: `feat: transformed datasets from three API stages`.

## Before you leave

```bash
npm run check
```

Your **artifact** is:

- [ ] A working API call with error handling and retry (`npm test` passing)
- [ ] A transformed dataset: `output/events.json` (plus `weather.json` and `attendance.json`)
- [ ] `.env` ignored by git, no keys anywhere in your code or commits
- [ ] `API_NOTES.md` filled in

## How it's assessed

| Level | What the artifact shows |
|---|---|
| Limited | No successful call, or raw JSON dumped with no transformation. Key hard-coded or committed. |
| Emerging | One stage works. Errors crash the program. Transform is partial. |
| Developing | Stages 1 and 2 work. Errors are caught but not retried, or everything is retried. Dataset mostly clean. |
| **Proficient** | All three stages work. Client retries only the right failures, with backoff and Week 7 logs. Clean, sorted dataset. Key in `.env`, never committed. |
| Advanced | Respects `Retry-After`. Clear notes on why each status is or isn't retried. Could explain how to switch the demo to mock data if a real API goes down. |

Limited or Emerging? You'll join a 30-minute API clinic before Assessment C. That's practice, not punishment.

---

**Plan for the API to fail. Then it can't surprise you during a demo.**
