import dotenv from "dotenv";
import { validate, Config } from "@/schemas/config";

dotenv.config();

const config: Config = {
  NODE_ENV: process.env.NODE_ENV ?? "dev",
  PORT: process.env.PORT ?? "8080",
  DB_URL: process.env.DB_URL ?? "postgresql://localhost:5432/fn_boilerplate_db",
  FASTIFY_ADDRESS: process.env.FASTIFY_ADDRESS ?? "http://localhost",
  FASTIFY_LOG_LEVEL: process.env.FASTIFY_LOG_LEVEL ?? "info",
  LOKI_URL: process.env.LOKI_URL ?? "http://localhost:3100",
  LOGS_PATH: process.env.LOGS_PATH ?? "tmp/logs/server.log",
  ORIGIN: process.env.ORIGIN ?? "*",
  // Prefer specific vars if provided; fall back to REDIS_URL; use host:port format (no http scheme)
  REDIS_CACHE: process.env.REDIS_CACHE || process.env.REDIS_URL || "redis:6379",
  REDIS_RATE_LIMIT: process.env.REDIS_RATE_LIMIT || process.env.REDIS_URL || "redis:6380",
};

if (!validate(config)) {
  console.error("Config validation failed. All env variables are required");
  console.error(`Validation Error: ${JSON.stringify(validate.errors)}`);
  throw new Error("Config Missing. Provide all env variables");
}

export default config;
