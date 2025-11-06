import fp from "fastify-plugin";
import swagger, { FastifySwaggerOptions } from "@fastify/swagger";
import Config from "@/config/config";

/**
 * This plugin adds important security headers
 * */
export default fp<FastifySwaggerOptions>(async (fastify) => {
  fastify.register(swagger, {
    openapi: {
      openapi: "3.0.0",
      info: {
        title: "Boilerplate Docs",
        description: "Documentation for the fastify server",
        version: "1.0.0",
      },
      servers: [
        {
          url: `${Config.FASTIFY_ADDRESS}:${Config.PORT}`,
          description: "Server",
        },
      ],
    },
  });
});
