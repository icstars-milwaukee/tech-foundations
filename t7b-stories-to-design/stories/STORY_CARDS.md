# Story Cards: CohortHub

**CohortHub** is the (pretend) web app i.c.stars interns use every day. It has a frontend (the pages you see), a backend (APIs that do the work), and a database. The trainer designs **Login** with you live. Your team gets one of the cards below.

Each card has the story, what "done" looks like (acceptance criteria), and a nudge toward the hard part. The acceptance criteria are where your **inputs** and **outputs** hide.

---

## Card A: Reset Password

> As an intern who forgot my password, I want to request a reset link by email, so that I can get back into CohortHub without calling IT.

**Done looks like:**
- The intern types their email on a "Forgot password?" page.
- If an account exists, CohortHub emails a reset link that expires in 30 minutes.
- The page shows the **same message** whether or not the email has an account.
- The link opens a page where the intern sets a new password (at least 8 characters).

**Think about:** Why would the page show the same message either way? How many interfaces does this story really have?

---

## Card B: View My Profile

> As an intern, I want to view my profile, so that I can check that my name, cohort, and contact info are correct.

**Done looks like:**
- Only a logged-in intern can see their profile.
- The profile shows name, email, phone (optional), cohort name, and start date.
- If the intern isn't logged in, they're sent to the Login page.

**Think about:** The intern doesn't type anything. So what's the *input*? (Hint: what did Login give them?)

---

## Card C: Submit a Support Request

> As an intern, I want to submit a support request about my laptop, so that IT can fix it before it slows down my work.

**Done looks like:**
- The intern picks a category: hardware, software, account, or network.
- They describe the problem (at least 20 characters) and choose a priority: low, normal, or urgent.
- They get a ticket number right away.
- The IT team is notified.

**Think about:** "IT is notified" is a system part too. What is it? Where does the ticket number come from?

file:///C:/Users/CortezHale/Downloads/Dez%20&%20Tez%20T7b%20Card%20C.pdf 
---

## Card D: RSVP to a Cohort Event

> As an intern, I want to RSVP to a cohort event, so that the staff knows how many people to expect.

**Done looks like:**
- The intern sees the event (title, date, location) and picks **yes**, **no**, or **maybe**.
- They can change their RSVP any time before the event starts.
- After the event starts, RSVPs are closed and the page says so.
- Staff can see the count of yes / no / maybe.

**Think about:** Two different users touch this story. Does your diagram show both?

---

## How to read any story

| Part of the story | What it gives you in the design |
|---|---|
| **As a** [role] | Who starts the workflow (first box / swimlane) |
| **I want** [feature] | The process: the steps and the interfaces |
| **so that** [benefit] | The output: what success looks like at the end |
| Acceptance criteria | Inputs, outputs, rules, and failure paths |
