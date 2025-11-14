import Fastify, { FastifyInstance } from "fastify";
import app from "@/app";

// Tests use Fastify's inject() (light-my-request under the hood) and Jest syntax.

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

  it("GET /api/ping should respond with 200 and 'pong'", async () => {
    const res = await server.inject({ method: "GET", url: "/api/ping" });
    expect(res.statusCode).toBe(200);
    expect(res.payload).toBe("pong");
  });
});
