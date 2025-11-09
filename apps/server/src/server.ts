import Fastify from "fastify";
import { app, options } from "./app";
import Config from "@/config";

const server = Fastify(options);
server.register(app);

const start = async () => {
  try {
    console.log(`Server listening on ${Config.FASTIFY_ADDRESS}:${Config.PORT}`);
    await server.listen({
      port: Number(Config.PORT),
      host: Config.FASTIFY_ADDRESS,
    });
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
};

// Graceful shutdown
const signals = ["SIGINT", "SIGTERM"];
signals.forEach((signal) => {
  process.on(signal, async () => {
    server.log.info(`Received ${signal}, closing server...`);
    await server.close();
    process.exit(0);
  });
});

start();
