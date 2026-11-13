# Tap Track – Updated Risk Register

**Date:** November 13, 2026  
**Project:** Tap Track

**Probability / Impact:** Low · Medium · High  
**Status:** Open · Mitigated · Happened · Closed  
**Source options:** T9B · Rehearsal round 1 · Rehearsal round 2 · Client · Trainer · Peer team

| ID | Risk (If ___, then ___) | Probability | Impact | Mitigation | Owner | Status | Source | What changed since last update |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| R-1 | If change request data does not load correctly, then users may not see accurate information in dashboard widgets. | Medium | High | Verify database connections, check queries, and test change request data in widgets. | Development Team | Open | T9B | Dashboard functionality has improved, but data accuracy and display still need testing. |
| R-2 | If dashboard widgets do not resize or move correctly, then users may have difficulty viewing and organizing information. | High | Medium | Fix widget layout, improve responsiveness, and test dragging and resizing. | Frontend Team | Happened | Rehearsal round 1 | Some widgets are cut off, and dragging or resizing has been inconsistent. |
| R-3 | If dark mode makes text difficult to read, then users may struggle to navigate and use certain features. | High | Medium | Adjust text colors, backgrounds, and contrast across the application. | Frontend Team | Happened | Peer team | Dark mode has expanded across the app, but some widget areas still have readability issues. |
| R-4 | If team members cannot run the application locally, then testing and troubleshooting may be delayed. | Medium | High | Verify environment setup, database connections, dependencies, and server configuration. | Development Team | Happened | Peer team | A team member encountered a server connection issue while testing Hypercare locally. |
| R-5 | If dashboard charts display incomplete or incorrect information, then users may make decisions based on inaccurate data. | Medium | High | Validate chart calculations, improve labels and tooltips, and test different widget sizes. | Development Team | Open | Rehearsal round 2 | Chart readability and percentage calculations have been improved in some areas, but display issues still need verification. |

## Notes

- **R-1** continues the original T9B risk involving change request data.
- **R-2, R-3, and R-4** are marked **Happened** because the issues have already been observed.
- **R-5** remains **Open** until chart accuracy and rendering are verified.
- **Before submitting:** Confirm the sources for R-2 and R-5. The rehearsal-round sources are placeholders if those issues were discovered during development rather than in those rehearsals. Confirm assigned owners as well.
