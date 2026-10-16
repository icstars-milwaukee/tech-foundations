// Detects text that looks like personal data. You don't need to edit this file.
//
// This is the INDEPENDENT check. Your redact() function in prototype/redact.js
// removes personal data; this detector double-checks that it worked.
// Two separate checks catch more than one.

const PATTERNS = [
  { kind: "email", re: /[\w.+-]+@[\w-]+(\.[\w-]+)+/g },
  { kind: "phone", re: /\(?\b\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b/g },
  { kind: "student ID", re: /\b\d{8}\b/g },
];

function findPersonalData(text) {
  const hits = [];
  for (const { kind, re } of PATTERNS) {
    for (const m of String(text).matchAll(re)) hits.push({ kind, value: m[0] });
  }
  return hits;
}

module.exports = { findPersonalData };
