import fp from "fastify-plugin";
import cors, { FastifyCorsOptions } from "@fastify/cors";

/**
 * This plugin adds important security headers
 * */
export default fp<FastifyCorsOptions>(async (fastify) => {
  fastify.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  });
});
