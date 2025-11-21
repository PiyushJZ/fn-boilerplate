import Fastify, { FastifyInstance } from "fastify";
import app from "@/app";

describe("Auth APIs", () => {
  let server: FastifyInstance;
  const loginInput = {
    email: "pj@gmail.com",
    password: "Passw0rd",
  };
  const loginResponse = {
    email: "test@example.com",
    name: "Test",
  };

  beforeAll(async () => {
    server = Fastify({ logger: false });
    await server.register(app);
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  describe("Login", () => {
    it("POST /api/auth/login authenticates and returns session/cookies", async () => {
      const res = await server.inject({
        method: "POST",
        url: "/api/auth/login",
        payload: loginInput,
      });
      expect(res.statusCode).toBe(200);
      expect(res.json()).toMatchObject(loginResponse);
      expect(res.cookies?.some((c) => c.name === "fn_boilerplate.session_token")).toBeTruthy();
    });
  });

  describe("Logout", () => {
    it("POST /api/auth/logout logs the user out and terminates the session", async () => {
      const login = await server.inject({
        method: "POST",
        url: "/api/auth/login",
        payload: loginInput,
      });
      const cookies = login.cookies?.map((c) => `${c.name}=${c.value}`).join("; ") ?? "";
      const res = await server.inject({
        method: "POST",
        url: "/api/auth/logout",
        headers: { cookie: cookies },
      });
      expect(res.statusCode).toBe(200);
    });
  });
});
