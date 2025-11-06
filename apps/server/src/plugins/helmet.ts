import fp from "fastify-plugin";
import helmet, { FastifyHelmetOptions } from "@fastify/helmet";

/**
 * This plugin adds important security headers
 * */
export default fp<FastifyHelmetOptions>(async (fastify) => {
  fastify.register(helmet, { global: true });
});
