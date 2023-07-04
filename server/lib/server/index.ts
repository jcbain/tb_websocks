import fastify, { FastifyPluginOptions } from "fastify";
import fastifyWebsocket from "@fastify/websocket";

// import routes from './routes';

export const start = async function (opts: FastifyPluginOptions) {
  const server = await fastify(opts);
  server.register(fastifyWebsocket);

  server.get("/ping", async (req, reply) => {
    return "pong";
  });

  server.register(async function (fastify) {
    fastify.get(
      "/ws",
      { websocket: true },
      (connection /* SocketStream */, req /* FastifyRequest */) => {
        connection.socket.on("message", () => {
          // message.toString() === 'hi from client'
          connection.socket.send("hi from server");
        });
      }
    );
  });

  server.register(async function (fastify) {
    fastify.get(
      "/ws-error",
      { websocket: true },
      (connection /* SocketStream */, req /* FastifyRequest */) => {
        throw new Error("REALLY BAD");
        connection.socket.on("message", () => {
          // message.toString() === 'hi from client'
          throw new Error("BAD BAD BAD");
        });
      }
    );
  });

  // await server.register(routes, { prefix: '/' });

  return server;
};
