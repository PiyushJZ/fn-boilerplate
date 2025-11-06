import fp from "fastify-plugin";
import swaggerUi, { FastifySwaggerUiOptions } from "@fastify/swagger-ui";

/**
 * Swagger UI plugin to enable documentation page auto creation
 * */
export default fp<FastifySwaggerUiOptions>(async (fastify) => {
  await fastify.register(swaggerUi, {
    routePrefix: "/documentation",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });
});
