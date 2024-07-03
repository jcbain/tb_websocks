# WebSocks

A Tugboat personal demo repository for proxying websocket requests to a websocket enable service.

### Instruction

Build the `main` branch, which should include 2 services:

1. `server`: a node websocket enabled server written using `Fastify`
2. `nginx`: a nginx reverse proxy to proxy requests to other services

Once built, you should be able to open up a Tugboat `nginx` terminal and proxy websocket requests to the `server` service via `nginx`.

```sh
wscat -c ws://${TUGBOAT_DEFAULT_SERVICE_URL_HOST}/server/ws

```

This is such a neat library.
I really consider this to be the best of works.
But it could still be better.
