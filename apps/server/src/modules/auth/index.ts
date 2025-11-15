import { FastifyPluginAsync } from "fastify";
import { login, logout, signup } from "./auth.controller";
import { loginBodySchema, signupBodySchema } from "@/schemas/auth";

const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post(
    "/login",
    {
      schema: {
        description: "Login user with email and password",
        tags: ["auth"],
        body: loginBodySchema,
        response: {},
      },
    },
    login,
  );

  fastify.post(
    "/logout",
    {
      schema: {
        description: "Logout user",
        tags: ["auth"],
      },
    },
    logout,
  );

  fastify.post(
    "/signup",
    {
      schema: {
        description: "Signup user with email and password",
        tags: ["auth"],
        body: signupBodySchema,
      },
    },
    signup,
  );
};

export default auth;
