import fastify, { FastifyPluginOptions } from "fastify";
import fastifyWebsocket from "@fastify/websocket";

// import routes from './routes';

export const start = async function (opts: FastifyPluginOptions) {
  const server = await fastify(opts);
  server.register(fastifyWebsocket);

  server.get("/ping", async (req, reply) => {
    return "pong";
  });

  server.get('/throw', async (req, reply) => {
    req.connection._destroy(new Error("bad shit"),() => {})
    throw new Error("bad things abound")
  })

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

  server.setErrorHandler((err, req, reply) => {
    server.server.emit('error', err)
    reply.send(err)
  })

  return server;
};
