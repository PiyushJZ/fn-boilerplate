import fp from "fastify-plugin";
import rateLimit, { FastifyRateLimitOptions } from "@fastify/rate-limit";
import Redis from "ioredis";
import Config from "@/config";

// Config.REDIS_RATE_LIMIT is expected to be "host:port"
const [rateHost, ratePortStr] = Config.REDIS_RATE_LIMIT.split(":");
const ratePort = Number(ratePortStr || 6379);
const redis = new Redis({
  host: rateHost,
  port: ratePort,
  lazyConnect: true,
});

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

  // Close redis on server shutdown to avoid Jest open handle leaks
  fastify.addHook("onClose", async () => {
    try {
      await redis.quit();
    } catch {
      // ignore
    }
  });
});
