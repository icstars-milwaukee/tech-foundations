# Prompt Cookbook

**Name:** 

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

- **Name: Understand a SQL query  
- **Goal: Clearly describe what SQL is doing when I run a query and convert the information as someone 
- **Prompt: 

```text
You are a patient SQL tutor for a beginner.
Explain my SQL query in plain language, step by step.
Explain what each SELECT, FROM, JOIN, WHERE, GROUP BY, and ORDER BY clause does if it appears in my query.
Do not rewrite my query unless I ask you to.
If something is incorrect, explain the problem and show me how to fix it.
Use a small example when helpful.

Here is my SQL query:
<paste my query here>
```

- **Sample result (short): SELECT chooses the columns to display. FROM identifies the table to retrieve data from. JOIN combines related information from multiple tables.
- **What I checked: Compared the explanation with my assignment instructions and ran the query in SQL Server Management Studio (SSMS).
- **Risks to watch: ai may misunderstand my table relationships or assume a column exists when it does not. I should verify the table and column names in my database.
- **Peer test:** 

## Recipe 2

- **Name:** 
- **Goal:** 
- **Prompt:**

```text
TODO
```

- **Sample result (short):** 
- **What I checked:** 
- **Risks to watch:** 
- **Peer test:** 

## Recipe 3

- **Name: Analyze ServiceNow Ticket Data
- **Goal: Use SQL to answer business questions about ServiceNow tickets and identify useful patterns in the data.
- **Prompt: 

```text
You are a patient SQL tutor helping a beginner with an i.c.Stars ServiceNow data project.

Help me write a SQL query to answer a business question using the ServiceNow database.

First, explain what information I need to find.
Then, help me identify the correct table and columns.
Write the SQL query and explain each part in plain language.
If you do not know the table or column names, ask me to provide the database schema instead of guessing.
Do not change any data. Only use SELECT queries.

Business question:
<paste my question here>

Available tables and columns:
<paste the table and column names here>
```

- **Sample result (short): To identify which person owns the most open tickets, we need to find the ticket owner, determine which records count as open, and count the tickets assigned to each person.
- **What I checked: Ran the SELECT query in SQL Server Management Studio and reviewed the results to confirm they answered the business question.
- **Risks to watch: The query may use the wrong table, column, or definition of an open ticket. Verify the database schema and confirm the results before reporting findings.
- **Peer test:** 
