import fp from "fastify-plugin";
import swaggerUi, { FastifySwaggerUiOptions } from "@fastify/swagger-ui";

/**
 * Swagger UI plugin to enable documentation page auto creation
 * */
export default fp<FastifySwaggerUiOptions>(async (fastify) => {
  await fastify.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "full",
      deepLinking: true,
    },
    staticCSP: true,
    transformSpecificationClone: true,
  });
});
