# Prompt Cookbook

**Name:** Jose and Fernando

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

- **Name:** Explain how a function works
- **Goal:** Understand what a function does, step by step, before I change it or build on it.
- **Prompt:**

```text
You are a patient programming tutor for a beginner.
Explain how the function below works in plain language.
Context: <language and framework, e.g., JavaScript in a Node.js app>. This
function is part of <one sentence on the feature, e.g., the RSVP page>.
Here is the function (no passwords, keys, or real user data):
<paste the function>
Format: 1) What the function does in one sentence. 2) A numbered
walkthrough of what happens line by line (group simple lines together).
3) What it takes in and what it returns. 4) One example input with the
output you'd expect.
Constraints: Don't rewrite or "improve" the function. Only explain what is
in the code I pasted. If it calls other functions you can't see, list them
and say what you'd need to see instead of guessing what they do.
```

- **Sample result (short):** "This function checks whether an RSVP deadline has passed. Step 1: it reads the deadline date. Step 2: it compares it to today's date. Step 3: it returns true if the deadline is earlier. Example: a deadline of yesterday returns true. It calls `parseDate()`, which I can't see."
- **What I checked:** Ran the function with the example input in the console and got the same output. Then I traced the line-by-line steps against the code to confirm none were skipped.
- **Risks to watch:** It may describe what a function with that name usually does instead of what my code actually does, especially for helper functions it can't see. Running the code is the proof.
- **Peer test:** Fernando used it on a sorting helper. The explanation was accurate, but it was too long, so I added "keep the walkthrough under 8 steps."

## Recipe 2

- **Name:** Tell me how the API works
- **Goal:** Get a clear picture of what an API does, how to call it, and what comes back, so I can use it without trial and error.
- **Prompt:**

```text
You are a backend developer explaining an API to a teammate who is new to it.
Explain how the API below works.
Context: <language and framework>. I want to use it to <goal, e.g., load the
list of events for the demo page>.
Here is the API code or documentation (remove API keys, tokens, and real
user data first): <paste routes, handlers, or docs>
Format: 1) A one-paragraph overview of what the API is for. 2) A table with
columns "Endpoint", "Method", "What it does", "Needs (inputs)", "Returns".
3) One example request and one example response using fake data.
4) The most common reason a call would fail.
Constraints: Only describe what appears in what I pasted. Don't invent
endpoints, fields, or status codes. If something is unclear or missing,
list it as a question for me to check.
```

- **Sample result (short):** An overview paragraph, a table with 3 endpoints (`GET /events`, `GET /events/:id`, `POST /rsvp`), a sample request with fake data, and a note that a missing or badly formatted date is the most likely cause of a 500 error. It also asked, "Does `GET /staff` require authentication? The code doesn't say."
- **What I checked:** Called two of the endpoints with fake data and compared the real responses to the sample. Checked the unclear question against the code and found the answer.
- **Risks to watch:** It may invent fields or endpoints that sound reasonable but don't exist, or guess how authentication works. Real calls and the real docs are the source of truth, not the AI.
- **Peer test:** Jose gave it to a teammate who had never seen our events API. They made a working request on the first try, but it listed one field the API doesn't return, so I added "mark anything you're inferring."

## Recipe 3

- **Name:** Explain how the code creates MFA in the application
- **Goal:** Understand how multi-factor authentication is set up in our code so I can describe it, test it, and spot gaps before the demo.
- **Prompt:**

```text
You are a security-minded developer explaining code to a student.
Explain how the code below creates and enforces MFA (multi-factor
authentication) in the application.
Context: <language and framework>. MFA method: <e.g., a one-time code from an
authenticator app / an emailed code>.
Here is the relevant code (replace all secrets, keys, tokens, and real user
data with placeholders like <SECRET>): <paste the MFA code>
Format: 1) A short overview of the MFA flow from setup to login.
2) A numbered walkthrough of each step: what triggers it, which part of the
code handles it, and what gets stored. 3) A list of what the code does NOT
appear to handle (for example: backup codes, rate limiting, expired codes).
Constraints: Only explain code I pasted. Don't write new security code and
don't tell me it is "secure." If a step depends on code you can't see, say
which part and what you'd need to see.
```

- **Sample result (short):** "Setup: when a user enables MFA, the code generates a secret and shows a QR code. Login: after the password is checked, the user enters a 6-digit code, which is verified against the stored secret. Not handled (in the code you pasted): backup codes and limits on repeated wrong codes."
- **What I checked:** Followed the flow in the app using a test account, turning MFA on and logging in with a code, and confirmed each step matched the walkthrough. I also checked that the "not handled" items were really missing and not just in a file I didn't paste.
- **Risks to watch:** Security is a high-stakes topic, and the AI may sound more certain than it should or miss a flaw. I should never paste real secrets, and a person who knows security should review it before it's treated as safe.
- **Peer test:** Fernando ran it on his login code. It explained the flow well, but it called one step "secure," so I added "don't say whether anything is secure or safe."
