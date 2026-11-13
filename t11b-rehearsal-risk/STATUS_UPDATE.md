# Tap Track — Status Update

**Team:** Tap Track – IBIS  
**Date:** November 13, 2026  
**Audience (who's reading this):** Tech client, trainers, mentors, and project team

## Overall status

- **Status:** **Yellow** (at risk, we have a plan)
- **Why (one sentence with a fact, not a feeling):** The dashboard and core data features are built, but widget resizing, dark-mode readability, chart display, and local Hypercare testing still have reported issues ahead of the presentation.

## Since last update

- **Done:** Built the dashboard foundation, added configurable widgets and the Data Explorer, expanded dark mode across the application, moved Profile into Settings, and continued testing the Hypercare workspace.
- **Not done that we said we'd do, and why:** We have not fully resolved widget dragging/resizing and clipped chart content, or confirmed that all chart values and the local Hypercare setup work consistently; layout, data-validation, and environment issues still need troubleshooting.

## Next, before the presentation

- **Next:** Prioritize fixes for cut-off or unresponsive widgets; verify dashboard counts, percentages, and change request data against database records; check text contrast in dark mode; reproduce and resolve the teammate's Hypercare local-server issue; then conduct an end-to-end presentation rehearsal using the working features.

## Top risks

The three highest-priority items from `RISK_LOG.md`. Trend: ↑ worse · → same · ↓ better.

| Risk | Impact if it happens | Mitigation | Owner | Trend |
|---|---|---|---|---|
| **R-2 — Widget movement and resizing fail** | Users cannot comfortably organize or view dashboard information. | Repair responsive layout, drag-and-resize behavior, and test multiple widget sizes. | Frontend Team | → same |
| **R-5 — Charts display incomplete or incorrect information** | Users may rely on misleading reports or metrics. | Compare chart counts and percentages with underlying records; test labels and tooltips. | Development Team | → same |
| **R-4 — Local Hypercare environment does not work for a teammate** | Team testing and presentation preparation may be delayed. | Check local server health, environment variables, dependencies, ports, and database connectivity together. | Development Team | ↑ worse |

## Asks

- **What we need, from whom, by when:** We need the development team to verify the remaining display and data issues, and the teammate testing Hypercare to share server logs and environment details **before the final presentation rehearsal**. We also need a trainer or mentor to review the presentation flow during that rehearsal.
- **The thing we're most worried about that we haven't said out loud yet:** Even if the app runs during the presentation, unresolved widget or data issues could make its reporting feel less reliable to the client.

---

*Draft based on issues reported through November 13, 2026. Confirm risk trends, task completion, and specific deadlines with the team before submitting.*
