#!/bin/bash

cd $TUGBOAT_ROOT/server
npm run build
exec node index.js &
