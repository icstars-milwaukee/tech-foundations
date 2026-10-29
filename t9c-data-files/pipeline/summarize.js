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
  const teams = new Map();
  for (const record of records) {
    const team = record.team || "unassigned";
    if (!teams.has(team)) {
      teams.set(team, {
        responses: 0,
        hoursTotal: 0,
        hoursCount: 0,
        confidenceTotal: 0,
        confidenceCount: 0,
        laptopIssues: 0,
      });
    }

    const summary = teams.get(team);
    summary.responses++;
    if (record.hours_coding_this_week !== null && record.hours_coding_this_week !== undefined) {
      summary.hoursTotal += record.hours_coding_this_week;
      summary.hoursCount++;
    }
    if (record.confidence_1_5 !== null && record.confidence_1_5 !== undefined) {
      summary.confidenceTotal += record.confidence_1_5;
      summary.confidenceCount++;
    }
    if (record.laptop_ok === false) summary.laptopIssues++;
  }

  const average = (total, count) => (count === 0 ? null : Math.round((total / count) * 100) / 100);
  return Object.fromEntries(
    [...teams].map(([team, summary]) => [
      team,
      {
        responses: summary.responses,
        avgHours: average(summary.hoursTotal, summary.hoursCount),
        avgConfidence: average(summary.confidenceTotal, summary.confidenceCount),
        laptopIssues: summary.laptopIssues,
      },
    ])
  );
}

module.exports = { summarizeByTeam };
