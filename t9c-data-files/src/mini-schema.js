// A small, dependency-free JSON Schema checker (the same one from T7B).
//
// It supports the parts of JSON Schema you need for simple data contracts:
//   type, properties, required, additionalProperties, items, enum, const,
//   minLength, maxLength, pattern, format, minimum, maximum, minItems, maxItems
//
// It also understands SHORTHAND contracts, the quick version from the cheat sheet:
//   { "email": "string", "password": "string" }
// Every shorthand field is required unless its type ends with "?":
//   { "nickname": "string?" }
// Arrays use one example item:   { "tags": ["string"] }
// Nested objects just nest:      { "user": { "id": "string" } }

const TYPE_NAMES = ["string", "number", "integer", "boolean", "object", "array", "null"];
const SUPPORTED = new Set([
  "$schema", "$id", "title", "description", "examples", "default",
  "type", "properties", "required", "additionalProperties", "items",
  "enum", "const", "minLength", "maxLength", "pattern", "format",
  "minimum", "maximum", "minItems", "maxItems",
]);

function isShorthandValue(v) {
  if (typeof v === "string") return TYPE_NAMES.includes(v.replace(/\?$/, ""));
  if (Array.isArray(v)) return v.length === 1 && isShorthandValue(v[0]);
  if (v && typeof v === "object") return isShorthand(v);
  return false;
}

function isShorthand(schema) {
  if (!schema || typeof schema !== "object" || Array.isArray(schema)) return false;
  if (Object.keys(schema).length === 0) return false;
  // A real JSON Schema uses keywords like "type", "properties" or "$schema".
  if ("type" in schema || "properties" in schema || "$schema" in schema) return false;
  return Object.values(schema).every(isShorthandValue);
}

function fromShorthand(sh) {
  if (typeof sh === "string") return { type: sh.replace(/\?$/, "") };
  if (Array.isArray(sh)) return { type: "array", items: fromShorthand(sh[0]) };
  const properties = {};
  const required = [];
  for (const [key, value] of Object.entries(sh)) {
    properties[key] = fromShorthand(value);
    const optional = typeof value === "string" && value.endsWith("?");
    if (!optional) required.push(key);
  }
  return { type: "object", properties, required, additionalProperties: false };
}

function normalize(schema) {
  return isShorthand(schema) ? fromShorthand(schema) : schema;
}

function typeOf(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  if (typeof value === "number") return Number.isInteger(value) ? "integer" : "number";
  return typeof value;
}

function matchesType(value, type) {
  const actual = typeOf(value);
  if (type === "number") return actual === "number" || actual === "integer";
  return actual === type;
}

const FORMATS = {
  email: (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s),
  "date-time": (s) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/.test(s) && !isNaN(Date.parse(s)),
  date: (s) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(Date.parse(s)),
  uri: (s) => /^https?:\/\/[^\s]+$/.test(s),
  uuid: (s) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s),
};

// Returns keywords this checker ignores, so nobody thinks they were enforced.
function unsupportedKeywords(schema, path = "$", found = []) {
  if (!schema || typeof schema !== "object") return found;
  for (const key of Object.keys(schema)) {
    if (!SUPPORTED.has(key)) found.push(`${path} uses "${key}"`);
  }
  if (schema.properties) {
    for (const [k, sub] of Object.entries(schema.properties)) unsupportedKeywords(sub, `${path}.${k}`, found);
  }
  if (schema.items) unsupportedKeywords(schema.items, `${path}[]`, found);
  if (schema.additionalProperties && typeof schema.additionalProperties === "object") {
    unsupportedKeywords(schema.additionalProperties, `${path}.*`, found);
  }
  return found;
}

function validate(schema, value, path = "$", errors = []) {
  if (schema === true || schema === undefined) return errors;
  if (schema === false) {
    errors.push(`${path}: no value is allowed here`);
    return errors;
  }

  if (schema.type !== undefined) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (!types.some((t) => matchesType(value, t))) {
      errors.push(`${path}: expected ${types.join(" or ")}, got ${typeOf(value)} (${JSON.stringify(value)})`);
      return errors; // other checks don't make sense on the wrong type
    }
  }

  if (schema.const !== undefined && JSON.stringify(value) !== JSON.stringify(schema.const)) {
    errors.push(`${path}: must be exactly ${JSON.stringify(schema.const)}`);
  }
  if (Array.isArray(schema.enum) && !schema.enum.some((e) => JSON.stringify(e) === JSON.stringify(value))) {
    errors.push(`${path}: must be one of ${schema.enum.map((e) => JSON.stringify(e)).join(", ")}, got ${JSON.stringify(value)}`);
  }

  if (typeof value === "string") {
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      errors.push(`${path}: must be at least ${schema.minLength} characters (got ${value.length})`);
    }
    if (schema.maxLength !== undefined && value.length > schema.maxLength) {
      errors.push(`${path}: must be at most ${schema.maxLength} characters (got ${value.length})`);
    }
    if (schema.pattern !== undefined && !new RegExp(schema.pattern).test(value)) {
      errors.push(`${path}: does not match pattern ${schema.pattern}`);
    }
    if (schema.format !== undefined) {
      const check = FORMATS[schema.format];
      if (check && !check(value)) errors.push(`${path}: is not a valid ${schema.format} (${JSON.stringify(value)})`);
    }
  }

  if (typeof value === "number") {
    if (schema.minimum !== undefined && value < schema.minimum) errors.push(`${path}: must be >= ${schema.minimum}`);
    if (schema.maximum !== undefined && value > schema.maximum) errors.push(`${path}: must be <= ${schema.maximum}`);
  }

  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      errors.push(`${path}: needs at least ${schema.minItems} item(s)`);
    }
    if (schema.maxItems !== undefined && value.length > schema.maxItems) {
      errors.push(`${path}: allows at most ${schema.maxItems} item(s)`);
    }
    if (schema.items) value.forEach((item, i) => validate(schema.items, item, `${path}[${i}]`, errors));
  }

  if (value && typeof value === "object" && !Array.isArray(value)) {
    const props = schema.properties || {};
    for (const key of schema.required || []) {
      if (!(key in value)) errors.push(`${path}: missing required field "${key}"`);
    }
    for (const [key, sub] of Object.entries(value)) {
      if (key in props) {
        validate(props[key], sub, `${path}.${key}`, errors);
      } else if (schema.additionalProperties === false) {
        errors.push(`${path}: unexpected field "${key}" (it is not in the contract)`);
      } else if (schema.additionalProperties && typeof schema.additionalProperties === "object") {
        validate(schema.additionalProperties, sub, `${path}.${key}`, errors);
      }
    }
  }

  return errors;
}

module.exports = { validate, normalize, isShorthand, fromShorthand, unsupportedKeywords };
