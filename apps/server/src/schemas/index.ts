import Ajv, { JSONSchemaType } from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ useDefaults: true, allErrors: true });
addFormats(ajv, [
  "date-time",
  "iso-date-time",
  "date",
  "time",
  "duration",
  "email",
  "uri",
  "password",
  "binary",
  "ipv4",
  "regex",
  "uuid",
  "float",
  "int32",
  "int64",
]);

export { ajv, type JSONSchemaType };
