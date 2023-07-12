#!/bin/bash

curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm install -g wscat

cd $TUGBOAT_ROOT/revproxy
cp ./tugboat.conf /etc/nginx/conf.d/default.conf


