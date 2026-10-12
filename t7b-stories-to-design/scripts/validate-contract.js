// Contract checker for T7B. Run:  npm run validate
//
// For every *.schema.json in a contract folder, it:
//   1. checks the file is valid JSON
//   2. tells you what the contract requires
//   3. tests every example in contract/examples/:
//        <name>.valid*.json    must PASS the contract
//        <name>.invalid*.json  must FAIL the contract (proves your contract catches bad data)
//
// Usage:
//   npm run validate                         checks my-design/contract
//   npm run validate:example                 checks examples/login/contract
//   node scripts/validate-contract.js <dir>  checks any contract folder

const fs = require("fs");
const path = require("path");
const { validate, normalize, isShorthand, unsupportedKeywords } = require("./lib/mini-schema");

const ROOT = path.join(__dirname, "..");

function readJson(file) {
  const raw = fs.readFileSync(file, "utf8");
  try {
    return { value: JSON.parse(raw) };
  } catch (err) {
    return { error: err.message };
  }
}

function describe(schema, indent = "    ") {
  const lines = [];
  if (schema.type === "object" && schema.properties) {
    const required = new Set(schema.required || []);
    for (const [key, sub] of Object.entries(schema.properties)) {
      const t = Array.isArray(sub.type) ? sub.type.join("|") : sub.type || "any";
      const extras = [];
      if (sub.format) extras.push(sub.format);
      if (sub.enum) extras.push("one of " + sub.enum.join("/"));
      if (sub.minLength !== undefined) extras.push("min " + sub.minLength + " chars");
      if (sub.maxLength !== undefined) extras.push("max " + sub.maxLength + " chars");
      lines.push(`${indent}${key}: ${t}${extras.length ? " (" + extras.join(", ") + ")" : ""}${required.has(key) ? "  [required]" : ""}`);
      if (sub.type === "object" && sub.properties) lines.push(...describe(sub, indent + "  "));
    }
  }
  return lines;
}

function checkFolder(dir) {
  const abs = path.isAbsolute(dir) ? dir : path.join(ROOT, dir);
  let problems = 0;
  console.log(`\nChecking contracts in ${path.relative(ROOT, abs) || "."}`);
  console.log("=".repeat(50));

  if (!fs.existsSync(abs)) {
    console.log(`[TODO] Folder not found. Create it and add a <name>.schema.json file.`);
    return 1;
  }

  const schemaFiles = fs.readdirSync(abs).filter((f) => f.endsWith(".schema.json")).sort();
  if (schemaFiles.length === 0) {
    console.log("[TODO] No *.schema.json files yet. Name your contract like reset-request.schema.json");
    return 1;
  }

  const examplesDir = path.join(abs, "examples");
  const exampleFiles = fs.existsSync(examplesDir) ? fs.readdirSync(examplesDir).filter((f) => f.endsWith(".json")) : [];

  for (const file of schemaFiles) {
    const base = file.replace(/\.schema\.json$/, "");
    console.log(`\n${file}`);
    const parsed = readJson(path.join(abs, file));
    if (parsed.error) {
      console.log(`  [FIX]  Not valid JSON: ${parsed.error}`);
      console.log("         Common causes: a trailing comma, a missing comma, or single quotes instead of double quotes.");
      problems++;
      continue;
    }
    const shorthand = isShorthand(parsed.value);
    const schema = normalize(parsed.value);
    console.log(`  [OK]   Valid JSON (${shorthand ? "shorthand contract" : "JSON Schema"})`);
    const fields = describe(schema);
    if (fields.length) {
      console.log("  The contract says:");
      fields.forEach((l) => console.log(l));
    } else {
      console.log("  [TODO] No fields found. A contract needs at least one field with a type.");
      problems++;
    }
    const ignored = unsupportedKeywords(schema);
    if (ignored.length) {
      console.log("  [NOTE] This checker does not enforce: " + ignored.join("; "));
    }

    const mine = exampleFiles.filter((f) => f.startsWith(base + ".valid") || f.startsWith(base + ".invalid")).sort();
    if (mine.length === 0) {
      console.log(`  [TODO] No examples. Add examples/${base}.valid.json (and ideally examples/${base}.invalid.json)`);
      problems++;
      continue;
    }
    for (const ex of mine) {
      const shouldPass = ex.startsWith(base + ".valid");
      const data = readJson(path.join(examplesDir, ex));
      if (data.error) {
        console.log(`  [FIX]  examples/${ex} is not valid JSON: ${data.error}`);
        problems++;
        continue;
      }
      const errors = validate(schema, data.value);
      if (shouldPass && errors.length === 0) {
        console.log(`  [PASS] examples/${ex} matches the contract`);
      } else if (shouldPass) {
        console.log(`  [FAIL] examples/${ex} should match the contract, but:`);
        errors.forEach((e) => console.log("           - " + e));
        problems++;
      } else if (errors.length > 0) {
        console.log(`  [PASS] examples/${ex} was correctly rejected: ${errors[0]}`);
      } else {
        console.log(`  [FAIL] examples/${ex} is supposed to be bad data, but the contract accepted it.`);
        console.log("           Tighten the contract (required fields, types, formats) so it catches this.");
        problems++;
      }
    }
  }

  const orphans = exampleFiles.filter((f) => !schemaFiles.some((s) => f.startsWith(s.replace(/\.schema\.json$/, "") + ".")));
  if (orphans.length) {
    console.log(`\n[NOTE] These examples don't match any schema name: ${orphans.join(", ")}`);
  }
  return problems;
}

const dirs = process.argv.slice(2);
const targets = dirs.length ? dirs : ["my-design/contract"];
let total = 0;
for (const d of targets) total += checkFolder(d);
console.log("");
console.log(total === 0 ? "All contracts check out." : `${total} thing(s) to fix or finish. Each one is a next step, not a failure.`);
console.log("");
process.exitCode = total === 0 ? 0 : 1;
