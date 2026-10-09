# Design: Log In to CohortHub

> **This is the worked example your trainer builds live.** Use it as a model for your own design in `my-design/`. Notice how every part points back to the user story.

**Team:** Trainer demo
**Story card:** Example (Login)

## 1. User Story

> As a returning intern, I want to log in with my email and password, so that I can see my CohortHub dashboard.

## 2. Design Checklist

- **Inputs:** email, password (typed by the intern on the Login page)
- **Process:** check both fields are filled in, send them to the Auth API, find the user by email, compare the password, create a session token
- **Outputs (success):** a session token and the intern's name; the browser opens the Dashboard
- **Outputs (failure):** a 401 error with the message "Invalid email or password"; the intern stays on the Login page
- **Interfaces:** Login Page → Auth API (`POST /api/auth/login`); Auth Service → Users DB (find user by email)
- **Contracts:** `LoginRequest`, `LoginResponse`, `ErrorResponse` (see `contract/`)

## 3. Workflow Diagram

Who does what, in what order. The failure path matters as much as the happy path.

```mermaid
flowchart TD
  start([Intern opens the Login page]) --> enter[Intern types email and password]
  enter --> filled{Both fields filled in?}
  filled -- No --> hint[Login page asks for both fields]
  hint --> enter
  filled -- Yes --> send[Login page sends POST /api/auth/login]
  send --> lookup[Auth API finds the user by email in Users DB]
  lookup --> match{User found and password matches?}
  match -- No --> fail[Auth API returns 401 Invalid email or password]
  fail --> showError[Login page shows the error]
  showError --> enter
  match -- Yes --> token[Auth API creates a session token]
  token --> ok[Auth API returns 200 with token and name]
  ok --> dash([Browser opens the Dashboard])
```

## 4. Component Diagram

The parts of the system, and which parts talk to each other. Arrow labels name the contract.

```mermaid
flowchart LR
  intern((Intern))
  subgraph Frontend
    login[Login Page]
    dashboard[Dashboard Page]
  end
  subgraph Backend
    api[Auth API<br/>POST /api/auth/login]
    service[Auth Service<br/>checks password, creates token]
  end
  db[(Users DB)]

  intern --> login
  login -- LoginRequest --> api
  api -- LoginResponse or ErrorResponse --> login
  api --> service
  service -- find user by email --> db
  login -- on success --> dashboard
```

## 5. Interfaces

| # | From → To | Method + Path (or name) | Request contract | Response contract |
|---|---|---|---|---|
| 1 | Login Page → Auth API | `POST /api/auth/login` | `login-request.schema.json` | `login-response.schema.json` (200), `error-response.schema.json` (400/401) |
| 2 | Auth Service → Users DB | find user by email | email | user row (id, name, email, password hash) |

## 6. Contract

See `contract/`. Run `npm run validate:example` to test it against the examples.

- `login-request.schema.json`: what the Login page sends
- `login-response.schema.json`: what comes back on success
- `error-response.schema.json`: what comes back on failure
- `../login.openapi.yaml`: the same interface written as OpenAPI (the Week 9 format)

## 7. Traceability

Every phrase in the story should land somewhere in the design.

| Story phrase | Workflow step | Component | Contract field |
|---|---|---|---|
| "a returning intern" | Intern opens the Login page | Users DB (the account already exists) | `user.id` |
| "with my email" | Intern types email and password | Login Page | `email` |
| "and password" | Auth API finds the user and compares the password | Auth Service | `password` |
| "log in" | Auth API creates a session token | Auth Service | `token` |
| "see my CohortHub dashboard" | Browser opens the Dashboard | Dashboard Page | `user.name` |
