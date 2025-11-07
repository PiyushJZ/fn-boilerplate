import { join } from "node:path";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyPluginAsync, FastifyServerOptions } from "fastify";
import { logger } from "@/config/logger";
// import fs from "node:fs";

export interface AppOptions extends FastifyServerOptions, Partial<AutoloadPluginOptions> {}
// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {
  logger: logger,
  requestIdHeader: "x-request-id",
  requestIdLogLabel: "reqId",
  genReqId: (req) => {
    const reqId = Array.isArray(req.headers["x-request-id"])
      ? req.headers["x-request-id"][0]
      : req.headers["x-request-id"];
    return reqId || `req-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  },
  trustProxy: true,
  ignoreTrailingSlash: true,
};

const app: FastifyPluginAsync<AppOptions> = async (fastify, opts): Promise<void> => {
  // Place here your custom code!
  fastify.addHook("onResponse", async (request, reply) => {
    request.log.info(
      {
        url: request.url,
        userAgent: request.headers["user-agent"],
        payload: request.body,
        method: request.method,
        statusCode: reply.statusCode,
        contentLength: reply.getHeader("content-length"),
      },
      "Request completed",
    );
  });

  fastify.setErrorHandler((error, request, reply) => {
    const statusCode = error.statusCode || 500;

    request.log.error(
      {
        err: {
          type: error.name,
          message: error.message,
          stack: error.stack,
        },
        url: request.url,
        userAgent: request.headers["user-agent"],
        payload: request.body,
        method: request.method,
        statusCode: statusCode,
      },
      "Request error occurred",
    );

    reply.status(statusCode).send({
      error: error.message,
      statusCode: statusCode,
    });
  });

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  // eslint-disable-next-line no-void
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "plugins"),
    options: opts,
  });

  // This loads all plugins defined in modules
  // define your modules in one of these
  // eslint-disable-next-line no-void
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "modules"),
    options: { ...opts, prefix: "/api" },
  });

  // await fastify.ready();
  // const yamlDocs = fastify.swagger({ yaml: true });
  // fs.writeFileSync("docs/docs.yaml", yamlDocs);
};

export default app;
export { app, options };
