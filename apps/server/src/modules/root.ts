import { FastifyPluginAsync } from "fastify";

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/ping", async function (request, reply) {
    return reply.code(200).send("pong");
  });
};

export default root;
