# Demo Runbook: When the API Is Down

**Team:** 

A runbook is instructions you write **before** the emergency, so nobody has to think during it. Someone who didn't build the project should be able to follow this.

## How we'll know

- **Signal that the API is down (what we'll see on screen or in the logs):** 
- **How long we wait before switching (seconds):** 
- **Who makes the call to switch:** 

## Rollback: switch to cached / mock data

Write the exact steps. Commands go in the code block.

- **Where the cached or mock data lives (file or mock server):** 
- **How the app switches to it (setting, flag, or command):** 

```bash
# TODO: exact commands, in order
```

- **How we check that the fallback is working:** 
- **What the narrator says to the audience while we switch:** 

## Getting back

- **How we switch back to the real API afterwards:** 

## Practice

- **Did we test this rollback in rehearsal? What happened?:** 
