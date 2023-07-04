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
        connection.socket.send("Welcome to the server");
        connection.socket.on("message", (message: Buffer) => {
          const msg = message.toString();
          connection.socket.send(`🦜 squak! ${msg}`);
        });
      }
    );
  });

  server.register(async function (fastify) {
    fastify.get(
      "/ws-error",
      { websocket: true },
      (connection /* SocketStream */, req /* FastifyRequest */) => {
        connection.socket.on("message", () => {
          connection._destroy(new Error("BAD THINGS"), (err) =>
            console.log(err)
          );
        });
      }
    );
  });

  return server;
};
