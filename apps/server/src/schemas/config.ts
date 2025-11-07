import { ajv, JSONSchemaType } from "./index";

export interface Config {
  NODE_ENV: string;
  PORT: number | string;
  DB_URL: string;
  FASTIFY_ADDRESS: string;
  FASTIFY_LOG_LEVEL: string;
  LOKI_URL: string;
  LOGS_PATH: string;
}

const schema: JSONSchemaType<Config> = {
  type: "object",
  properties: {
    NODE_ENV: {
      type: "string",
      enum: ["dev", "prod", "staging", "test"],
    },
    PORT: { type: "number" },
    DB_URL: { type: "string", format: "uri" },
    FASTIFY_ADDRESS: { type: "string" },
    FASTIFY_LOG_LEVEL: {
      type: "string",
      enum: ["debug", "info", "warn", "error"],
    },
    LOKI_URL: { type: "string", format: "uri" },
    LOGS_PATH: { type: "string" },
  },
  required: [
    "NODE_ENV",
    "PORT",
    "DB_URL",
    "FASTIFY_ADDRESS",
    "FASTIFY_LOG_LEVEL",
    "LOKI_URL",
    "LOGS_PATH",
  ],
  additionalProperties: false,
};

export const validate = ajv.compile(schema);
