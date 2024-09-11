import fastify, { FastifyPluginOptions } from "fastify";
import fastifyWebsocket from "@fastify/websocket";
import { Readable } from "stream";

const createReadStream = () => {
  const data = ["some", "data", "to", "read"];
  return new Readable({
    async read() {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (data.length === 0) this.push(null);
      else {
        this.push(data.shift());
      }
    },
  });
};

// import routes from './routes';

export const start = async function (opts: FastifyPluginOptions) {
  const server = await fastify(opts);
  server.register(fastifyWebsocket);

  server.get("/stream", (req, reply) => {
    const stream = createReadStream();
    return reply.send(stream);
  });

  server.get("/long", async (req, reply) => {
    await new Promise((resolve) => setTimeout(resolve, 100000));
    return "wowee";
  });

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
