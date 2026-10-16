// =====================================================================
// T9C APPLICATION: Summarize the clean data
// =====================================================================
//
// TODO 6: summarizeByTeam(records)
//   Group the clean records by team. People with no team go under "unassigned".
//   For each team, return:
//     responses        how many records
//     avgHours         average of hours_coding_this_week, SKIPPING nulls
//     avgConfidence    average of confidence_1_5, SKIPPING nulls
//     laptopIssues     how many have laptop_ok === false
//   Round averages to 2 decimal places:  Math.round(x * 100) / 100
//   If a team has no numbers for an average, use null (not 0, not NaN).
//
//   Expected shape:
//   {
//     "Atlas": { "responses": 3, "avgHours": 11.5, "avgConfidence": 4.33, "laptopIssues": 0 },
//     ...
//   }
//
//   Why skip nulls? If Keisha didn't answer, counting her as 0 hours makes
//   Atlas look like it practiced less than it did.
// =====================================================================

function summarizeByTeam(records) {
  return {};
}

module.exports = { summarizeByTeam };
