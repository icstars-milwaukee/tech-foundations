// The list of sessions shown on the site.
// To add a session: add its folder to the right week below. The site reads
// <folder>/README.md straight from the repo, so nothing else needs updating.

window.TF = {
  repo: "icstars-milwaukee/tech-foundations",
  branch: "main",
  weeks: [
    {
      week: 6,
      title: "Programming Basics",
      sessions: [
        { code: "T6A", folder: "T6A – Programming", title: "Programming Basics: Code Katas", minutes: 60, summary: "Loops, conditionals, and your first commit habit." },
      ],
    },
    {
      week: 7,
      title: "Functions & Design",
      sessions: [
        { code: "T7A", folder: "t7a-functions-debugging", title: "Functions, Errors & Debugging", minutes: 60, summary: "Refactor into functions and fix bugs with the Debug Ritual." },
        { code: "T7B", folder: "t7b-stories-to-design", title: "From Stories to Design", minutes: 60, summary: "Turn a user story into diagrams and a data contract." },
      ],
    },
    {
      week: 8,
      title: "SQL Depth + AI Basics",
      sessions: [
        { code: "T8A", folder: "t8a-ai-fundamentals", title: "AI Fundamentals I", minutes: 60, summary: "Write strong prompts, spot AI risks, and compare AI to your own work." },
        { code: "T8B", folder: "t8b-ai-integration", title: "AI Integration in Projects", minutes: 60, summary: "Put AI inside a workflow with guardrails and judge it with a rubric." },
      ],
    },
    {
      week: 9,
      title: "APIs & Sprint 2 Delivery",
      sessions: [
        { code: "T9A", folder: "t9a-apis-101", title: "APIs 101", minutes: 60, summary: "Call APIs, parse JSON, retry failures, and keep keys secret." },
        { code: "T9B", folder: "t9b-sprint2-rehearsal", title: "Sprint 2 Rehearsal & Risks", minutes: 60, summary: "Refine the backlog, register risks, and rehearse the demo." },
        { code: "T9C", folder: "t9c-data-files", title: "Data in the Real World: Files", minutes: 60, summary: "Clean a messy CSV into a clean CSV and JSON, with a log." },
      ],
      milestone: { title: "Performance Assessment C", detail: "Write a function, evaluate AI, refine a backlog, call an API, design a schema.", path: "assessments/w9-assessment-c/README.md" },
    },
    {
      week: 10,
      title: "Rollback & Deployment",
      sessions: [
        { code: "T10A", folder: "t10a-release-operate", title: "Release & Operate", minutes: 60, summary: "Success metrics, monitoring, and a rollback you've actually done." },
        { code: "T10B", folder: "t10b-docker-deployment", title: "Deployment with Docker", minutes: 90, summary: "Containerize, deploy, roll back, and document it for others." },
      ],
    },
    {
      week: 11,
      title: "Release Discipline",
      sessions: [
        { code: "T11A", folder: "t11a-demo-engineering", title: "Demo Engineering", minutes: 90, summary: "Offline fallbacks, failure injection, and a green quality gate." },
        { code: "T11B", folder: "t11b-rehearsal-risk", title: "Rehearsal & Risk Management", minutes: 60, summary: "Honest status updates and staying steady under pressure." },
      ],
    },
    {
      week: 12,
      title: "Portfolio & Showcase",
      sessions: [
        { code: "T12A", folder: "t12a-portfolio-packaging", title: "Portfolio Artifacts & Packaging", minutes: 60, summary: "A repo that speaks for you: README, decisions, release." },
      ],
      milestone: { title: "Performance Assessment D", detail: "Clean a dataset, design a schema, enhance a task with AI, write a release plan. Target: 80%." },
    },
    {
      week: 13,
      title: "Final Sprint Delivery",
      sessions: [],
      note: "No Tech Foundations sessions. Your team delivers the Final Sprint Client Presentation.",
    },
    {
      week: 14,
      title: "Tech Expo & Commencement",
      sessions: [],
      note: "No Tech Foundations sessions. Employer Showcase: your 60-second pitch and showcase table.",
    },
  ],
  resources: [
    { title: "Git for Teams", path: "gitforteams/README.md", summary: "Branches, pull requests, and merge conflicts as a team." },
  ],
};
