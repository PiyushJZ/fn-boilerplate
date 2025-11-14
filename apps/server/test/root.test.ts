import Fastify, { FastifyInstance } from "fastify";
import app from "@/app";

// Testing the root module
describe("Root module APIs", () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = Fastify({ logger: false });
    await server.register(app);
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  describe("GET /api/ping", () => {
    it("should respond with status code 200 and text 'pong'", async () => {
      const res = await server.inject({ method: "GET", url: "/api/ping" });
      expect(res.statusCode).toBe(200);
      expect(res.payload).toBe("pong");
    });
  });
});
