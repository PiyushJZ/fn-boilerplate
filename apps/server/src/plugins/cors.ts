import fp from "fastify-plugin";
import cors, { FastifyCorsOptions } from "@fastify/cors";
import Config from "@/config";
/**
 * This plugin adds important security headers
 * */
export default fp<FastifyCorsOptions>(async (fastify) => {
  fastify.register(cors, {
    origin: Config.ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  });
});
