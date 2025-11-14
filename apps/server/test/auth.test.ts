import Fastify, { FastifyInstance } from "fastify";
import app from "@/app";

describe("Auth APIs", () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = Fastify({ logger: false });
    await server.register(app);
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  describe("Login", () => {
    test.skip("POST /api/login authenticates and returns session/cookies", async () => {
      // Example (replace when actual contract is confirmed):
      // const res = await server.inject({
      //   method: "POST",
      //   url: "/api/login",
      //   payload: { email: "user@example.com", password: "pass1234" },
      // });
      // expect(res.statusCode).toBe(200);
      // expect(res.json()).toMatchObject({ user: expect.any(Object) });
      // expect(res.cookies?.some(c => c.name.includes("session"))).toBeTruthy();
    });
  });

  describe("Logout", () => {
    test.skip("POST /api/logout terminates the session", async () => {
      // Example flow (replace when actual contract is confirmed):
      // const login = await server.inject({
      //   method: "POST",
      //   url: "/api/login",
      //   payload: { email: "user@example.com", password: "pass1234" },
      // });
      // const cookies = login.cookies?.map(c => `${c.name}=${c.value}`).join("; ") ?? "";
      // const res = await server.inject({ method: "POST", url: "/api/logout", headers: { cookie: cookies } });
      // expect(res.statusCode).toBe(200);
    });
  });
});
