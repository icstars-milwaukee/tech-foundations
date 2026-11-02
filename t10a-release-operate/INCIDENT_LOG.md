# Incident Log

An incident is any time users are (or could be) hurt by something the system did. Log it **while** it's happening. Fix the process afterwards, not the person.

## Incident: Backend Unable to Locate Database Tables

- **Date + time detected:** October 19, 2026
- **Detected by (alert, release check, user report):**  Amir Development testing. API requests returned a 404 error stating that the table could not be found in the configured schema.
- **Severity (SEV1 = everyone down, SEV2 = major feature broken, SEV3 = degraded):** SEV2 – Major feature broken because the dashboard could not retrieve database records.
- **Who was affected, and how:** The development team and anyone testing the Tap Track dashboard. Users could not retrieve incident records or view the database information through the API.
- **Version running:** Development version of Tap Track

### Timeline

| Time | What happened / what we did |
|---|---|
|12:30pm  |During development testing, API requests returned a 404 error when attempting to retrieve database tables. |
| 2pm | Investigated the backend routes and database configuration to identify why the tables could not be found.|
| 2:50pm | Discovered that the backend was searching the public schema, but the database tables were stored in the staging schema. |

### Resolution

- **What we did to stop the impact (rollback? fix forward?):** Fix forward. Identified the schema mismatch and worked on making the database schema configurable through an environment variable so the backend could connect to the correct schema. 
- **Time from detection to resolution:** 2 hours & 20 minutes 
- **Root cause (what actually went wrong, not who):**  The backend was configured to search for database tables in the public schema, but the imported ServiceNow tables were located in the staging schema. This caused the API to return 404 errors when trying to retrieve records.

### Follow-ups

Guardrails so this can't happen the same way again.

| Action | Owner | Due |
|---|---|---|
| Make the database schema configurable through environment variables instead of hardcoding it. | Cortez | 10/23/26 |
|Document the correct database configuration so teammates can set up the project consistently across laptops.| Amir | 10/23/26|
|Test API endpoints to confirm database tables can be located before testing dashboard features.| Cortez | 10/23/26 |
|Add a database connection and table availability check to the development setup process.| Cortez | 10/23/26 |
