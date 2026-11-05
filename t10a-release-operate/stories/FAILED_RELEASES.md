# Failed Releases: Real Stories

Every one of these teams was skilled. Every one had a process. Something still slipped through, and each failure left behind a **guardrail** the industry still uses.

Read your group's story. Then answer: **what guardrail would have stopped it, or made recovery fast?**

---

## Story 1: Knight Capital loses about $460 million in 45 minutes (2012)

Knight Capital, a major stock-trading firm, deployed new trading code by hand to eight servers. A technician missed **one** server. The new code reused an old setting (a "flag") that, on the old server, switched on retired code nobody had removed. When the market opened, that one server started placing millions of unintended orders. It took about 45 minutes to stop. The firm lost roughly $460 million and was sold within months.

**Guardrails this taught:** automated, repeatable deployment (no manual server-by-server steps) · verify every server got the release · delete dead code · a kill switch and a rollback plan ready **before** go-live.

---

## Story 2: GitLab deletes its production database (2017)

During a late-night incident, a GitLab engineer ran a delete command on what they thought was a backup database server. It was the **production** database. About 300 GB of live data was gone in seconds. Then the team found that several of their backup methods hadn't been working for a long time, and nobody knew. They recovered from a copy that was about six hours old. Hours of user data were lost. GitLab livestreamed the recovery and published a full, honest report.

**Guardrails this taught:** test restores, not just backups · make production look different from everything else (prompts, colors, names) · never do destructive work tired and alone · blameless, public incident reports.

---

## Story 3: A typo takes down a big piece of the internet (2017)

An Amazon Web Services engineer was following a playbook to remove a small number of servers from Amazon S3, a storage service thousands of websites depend on. One input was entered wrong, and the command removed far more servers than intended. S3 in AWS's biggest region (us-east-1) went down for about four hours, and many websites and apps broke with it. Even AWS's own status page had trouble showing the outage, because it relied on S3.

**Guardrails this taught:** tools that refuse dangerous inputs (minimum capacity limits) · make big changes slowly · your monitoring and status page must not depend on the thing they monitor.

---

## Story 4: Facebook disconnects itself from the internet (2021)

During routine maintenance, a command meant to check network capacity accidentally took down the connections between Facebook's data centers. An audit tool that should have blocked the command had a bug. Facebook, Instagram, and WhatsApp were unreachable worldwide for about six hours. Recovery was slow partly because the internal tools engineers needed were down too, and people had to get physical access to data center equipment.

**Guardrails this taught:** a rollback path that doesn't depend on the system you just broke · test the safety checks themselves · practice recovery before you need it.

---

## Story 5: One bad update crashes 8.5 million computers (2024)

CrowdStrike, a cybersecurity company, pushed a routine configuration update to its security software on Windows computers. The update had a flaw that made Windows crash on startup. About 8.5 million machines went down at once, including systems at airlines, hospitals, banks, and 911 centers. Because the computers crashed before they could receive a fix, many had to be repaired **one at a time, by hand**. CrowdStrike later committed to rolling out updates in stages instead of to everyone at once.

**Guardrails this taught:** staged / canary releases (a few users first, then more) · treat config changes as seriously as code changes · plan for the case where rollback can't be done remotely.

---

## The pattern

| Guardrail | Stories |
|---|---|
| Automate and verify the deployment | 1, 3 |
| Test your backups **and** your rollback | 2, 4, 5 |
| Release in stages, watch metrics, then continue | 3, 5 |
| Monitoring and rollback must not depend on the broken system | 3, 4 |
| A clear trigger for "roll back now" decided **ahead of time** | all |
