import fp from "fastify-plugin";
import rateLimit, { FastifyRateLimitOptions } from "@fastify/rate-limit";
import Redis from "ioredis";
import Config from "@/config";

const redis = new Redis(Config.REDIS_RATE_LIMIT);

/**
 * This plugin limits api calls from a single source
 * */
export default fp<FastifyRateLimitOptions>(async (fastify) => {
  // Ensure we connect only when Fastify is ready
  if (typeof redis.status === "string" && redis.status !== "ready") {
    await redis.connect().catch(() => undefined);
  }
  fastify.register(rateLimit, {
    global: true,
    max: 120,
    ban: 3,
    timeWindow: 1000 * 60,
    hook: "preHandler",
    cache: 5000,
    redis,
    nameSpace: "fb-boilerplate-rate-limit",
    continueExceeding: false,
  });
});
