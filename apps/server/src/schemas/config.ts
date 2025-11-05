import { ajv, JSONSchemaType } from "./index";

export interface Config {
  NODE_ENV: string;
  LOKI_URL: string;
  LOGS_PATH: string;
}

const schema: JSONSchemaType<Config> = {
  type: "object",
  properties: {
    NODE_ENV: { type: "string", enum: ["dev", "prod", "staging", "test"] },
    LOKI_URL: { type: "string", format: "uri" },
    LOGS_PATH: { type: "string" },
  },
  required: ["NODE_ENV", "LOKI_URL", "LOGS_PATH"],
  additionalProperties: false,
};

export const validate = ajv.compile(schema);
