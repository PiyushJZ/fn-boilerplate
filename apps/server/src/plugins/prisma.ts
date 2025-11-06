import fp from "fastify-plugin";
import fastifyPrisma from "@joggr/fastify-prisma";
import { PrismaClient } from "@/generated/prisma/client";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

export default fp(async (fastify) => {
  fastify.register(fastifyPrisma, {
    client: new PrismaClient(),
  });
});
