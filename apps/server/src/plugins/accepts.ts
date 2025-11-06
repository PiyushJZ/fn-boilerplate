import fp from "fastify-plugin";
import accepts, { FastifyAcceptsOptions } from "@fastify/accepts";

export default fp<FastifyAcceptsOptions>(async (fastify) => {
  fastify.register(accepts);
});
