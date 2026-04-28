#!/bin/bash
git pull
pnpm run build
pm2 stop 0
pm2 start 0
