#!/bin/bash

cd $TUGBOAT_ROOT/revproxy
cp ./tugboat.conf /etc/nginx/conf.d/default.conf
/usr/sbin/nginx -s reload
