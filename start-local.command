#!/bin/bash

cd "$(dirname "$0")" || exit 1

if lsof -iTCP:5173 -sTCP:LISTEN >/dev/null 2>&1; then
  echo "饱了么已经运行：http://localhost:5173/"
  open "http://localhost:5173/"
  exit 0
fi

echo "正在启动饱了么：http://localhost:5173/"
npm run dev
