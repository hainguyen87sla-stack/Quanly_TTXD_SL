#!/bin/zsh
cd "$(dirname "$0")" || exit 1
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
export NEXT_TELEMETRY_DISABLED=1
if curl --fail --silent http://127.0.0.1:3100/api/health >/dev/null 2>&1; then
  open http://127.0.0.1:3100
  exit 0
fi
if [ ! -f .next/BUILD_ID ]; then
  npm run build || exit 1
fi
(sleep 3; open http://127.0.0.1:3100) &
npm start
