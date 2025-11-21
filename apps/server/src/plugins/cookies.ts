import fp from "fastify-plugin";
import fastifyCookie, { FastifyCookieOptions } from "@fastify/cookie";

export default fp<FastifyCookieOptions>(async (fastify) => {
  fastify.register(fastifyCookie, {
    secret: "fsadjfkhls", // Use a strong secret from env variables
    hook: "onRequest",
  });
});
