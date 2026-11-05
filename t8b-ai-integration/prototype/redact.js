// =====================================================================
// T8B GUARDRAIL: Remove personal data BEFORE anything goes to an AI tool
// =====================================================================
//
// redact(text) takes a ticket description and returns a copy with
// personal data replaced by a label the AI can still understand:
//
//   "Email me at dana@cohorthub.test"  ->  "Email me at [EMAIL]"
//
// Emails already work. Your job:
//   TODO 1  Phone numbers  -> [PHONE]
//           Must catch: 414-555-0199   (414) 555-0142   414.555.0199
//   TODO 2  Student IDs (exactly 8 digits) -> [STUDENT_ID]
//           Must catch: 20261187
//
// Don't over-redact. "2 hours", "room 204", "Node 18", and "10%" must
// stay as they are. The AI needs them to triage correctly.
//
// Check your work:  npm test
// =====================================================================

const EMAIL = /[\w.+-]+@[\w-]+(\.[\w-]+)+/g;

function redact(text) {
  let clean = String(text);
  clean = clean.replace(EMAIL, "[EMAIL]");

  // TODO 1: replace phone numbers with [PHONE]

  // TODO 2: replace 8-digit student IDs with [STUDENT_ID]

  return clean;
}

module.exports = { redact };
