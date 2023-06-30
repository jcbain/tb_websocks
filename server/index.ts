import { start } from './lib/server';

const port = 4000;

(async () => {
    const server = await start({ logger: true });
    await server.listen({ port, host: '0.0.0.0' });
    server.log.info(`🚀 server listening on ${port}`);
})();