import fastify, { FastifyPluginOptions } from "fastify";
import fastifyWebsocket from "@fastify/websocket";
import { createWriteStream, readFile } from "fs";

const file = createWriteStream("./big.file");

for (let i = 0; i <= 1e6; i++) {
  file.write(
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n"
  );
}

file.end();

// import routes from './routes';

export const start = async function (opts: FastifyPluginOptions) {
  const server = await fastify(opts);
  server.register(fastifyWebsocket);

  server.get("/stream", (req, reply) => {
    readFile("./big.file", (err, data) => {
      if (err) throw err;

      reply.send(data);
    });
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
