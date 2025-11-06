import fp from "fastify-plugin";
import websockets, { WebsocketPluginOptions } from "@fastify/websocket";

export default fp<WebsocketPluginOptions>(async (fastify) => {
  fastify.register(websockets);
});
