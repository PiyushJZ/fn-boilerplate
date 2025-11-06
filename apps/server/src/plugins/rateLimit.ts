import fp from "fastify-plugin";
import rateLimit, { FastifyRateLimitOptions } from "@fastify/rate-limit";

/**
 * This plugin adds important security headers
 * */
export default fp<FastifyRateLimitOptions>(async (fastify) => {
  fastify.register(rateLimit, {
    max: 100,
    global: true,
  });
});
