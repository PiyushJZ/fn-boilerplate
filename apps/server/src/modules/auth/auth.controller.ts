import { FastifyRequest, FastifyReply } from "fastify";
import { APIError } from "better-auth";
import { auth } from "@/auth";
import { LoginBody, SignupBody } from "@/schemas/auth";

export const login = async (request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) => {
  const { email, password } = request.body;
  const headers = request.headers;
  try {
    const data = await auth.api.signInEmail({
      body: { email, password, rememberMe: true },
      headers,
    });
    if (!data.user.emailVerified) {
      return reply.forbidden("EMAIL_NOT_VERIFIED");
    }
    console.log("Login successful:", data);
    return reply.code(200).setCookie("fn_boilerplate.session_token", data.token).send({
      email: data.user.email,
      name: data.user.name,
      image: data.user.image,
    });
  } catch (error) {
    console.error(`Login Error: ${error}`);
    if (error instanceof APIError) {
      return reply.code(error.statusCode).send({ message: error.message });
    }
    return reply.internalServerError("INTERNAL_SERVER_ERROR");
  }
};

export const logout = async (request: FastifyRequest, reply: FastifyReply) => {
  const headers = request.headers;
  try {
    await auth.api.signOut({ headers });
    return reply.code(200).send({ message: "LOGOUT_SUCCESSFUL" });
  } catch (error) {
    console.error(`Logout Error: ${error}`);
    if (error instanceof APIError) {
      return reply.code(error.statusCode).send({ message: error.message });
    }
    return reply.internalServerError("INTERNAL_SERVER_ERROR");
  }
};

export const signup = async (
  request: FastifyRequest<{ Body: SignupBody }>,
  reply: FastifyReply,
) => {
  const { email, name, password } = request.body;
  try {
    await auth.api.signUpEmail({
      body: { email, name, password },
    });
    await request.server.prisma.user.update({ where: { email }, data: { emailVerified: true } });
    return reply.code(201).send({ message: "SIGNUP_SUCCESSFUL" });
  } catch (error) {
    console.error(`Signup Error: ${error}`);
    if (error instanceof APIError) {
      return reply.code(error.statusCode).send({ message: error.message });
    }
    return reply.internalServerError("INTERNAL_SERVER_ERROR");
  }
};
