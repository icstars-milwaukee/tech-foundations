# API Notes

**Name:** 

Short answers. Be specific: real status codes, real field names, real log lines.

---

## Stage 1: Mock endpoint

- **Endpoint (method + URL):** 
- **Status code you got:** 
- **Three raw fields you used, and what you turned them into:** 
- **What happened with `npm run stage1:flaky` (paste your WARN log lines):** 

## Stage 2: Public endpoint

- **Endpoint (method + URL):** 
- **Status code you got:** 
- **One thing in the raw response you didn't need:** 
- **What would happen to your program if this API was down? (try it with wifi off, or a typo in the URL):** 

## Stage 3: Authenticated endpoint

- **Endpoint (method + URL):** 
- **Where the key lives (file name) and how the code reads it:** 
- **Status code with NO key, and with a WRONG key:** 
- **Proof .env is not committed (paste the output of `git status --short` or `git check-ignore -v .env`):** 

## Error handling

- **Which status codes does your client retry, and why only those:** 
- **What your client logs when it finally gives up (paste the ERROR line):** 
