#!/usr/bin/env bash
set -euo pipefail

REMOTE_HOST="raccoon@raccoons-Pro.localdomain"
REMOTE_DIR="/Users/raccoon/Documents/caio.legal"
TUNNEL_ID="88b2983f-dde3-4bc0-a626-fe61d1709c67"

cd "$(dirname "$0")/.."

echo "Building caio.legal locally..."
npm run build

echo "Syncing source to raccoon..."
ssh "$REMOTE_HOST" "mkdir -p '$REMOTE_DIR'"
rsync -az --delete \
  --exclude '.git' \
  --exclude '.DS_Store' \
  --exclude 'node_modules' \
  --exclude 'dist' \
  ./ "$REMOTE_HOST:$REMOTE_DIR/"

echo "Building and restarting the origin..."
ssh "$REMOTE_HOST" "set -e; \
  export PATH=/Applications/OrbStack.app/Contents/MacOS/xbin:\$PATH; \
  cd '$REMOTE_DIR'; \
  docker build -t caio-legal:latest .; \
  docker rm -f caio-legal-web >/dev/null 2>&1 || true; \
  docker run -d --name caio-legal-web --restart unless-stopped \
    -p 127.0.0.1:3020:80 caio-legal:latest >/dev/null"

echo "Restarting the dedicated Cloudflare tunnel..."
ssh "$REMOTE_HOST" "set -e; \
  export PATH=/Applications/OrbStack.app/Contents/MacOS/xbin:\$PATH; \
  docker rm -f caio-legal-tunnel >/dev/null 2>&1 || true; \
  docker run -d --name caio-legal-tunnel --restart unless-stopped \
    -v '$REMOTE_DIR/deploy/cloudflared.config.yml:/etc/cloudflared/config.yml:ro' \
    -v '/Users/raccoon/.cloudflared/$TUNNEL_ID.json:/etc/cloudflared/credential.json:ro' \
    cloudflare/cloudflared:latest \
    tunnel --config /etc/cloudflared/config.yml run >/dev/null"

echo "Verifying the origin..."
ssh "$REMOTE_HOST" "curl --fail --silent --show-error http://127.0.0.1:3020/healthz && \
  curl --fail --silent --show-error http://127.0.0.1:3020/ | grep -q 'AI leadership for law firms'"

echo "caio.legal origin and tunnel are running on raccoon."
