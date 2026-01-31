#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMAGE_NAME="${REBOOTIX_IMAGE:-${REBOOTIX_IMAGE:-rebootix:local}}"
CONFIG_DIR="${REBOOTIX_CONFIG_DIR:-${REBOOTIX_CONFIG_DIR:-$HOME/.rebootix}}"
WORKSPACE_DIR="${REBOOTIX_WORKSPACE_DIR:-${REBOOTIX_WORKSPACE_DIR:-$HOME/.rebootix/workspace}}"
PROFILE_FILE="${REBOOTIX_PROFILE_FILE:-${REBOOTIX_PROFILE_FILE:-$HOME/.profile}}"

PROFILE_MOUNT=()
if [[ -f "$PROFILE_FILE" ]]; then
  PROFILE_MOUNT=(-v "$PROFILE_FILE":/home/node/.profile:ro)
fi

echo "==> Build image: $IMAGE_NAME"
docker build -t "$IMAGE_NAME" -f "$ROOT_DIR/Dockerfile" "$ROOT_DIR"

echo "==> Run gateway live model tests (profile keys)"
docker run --rm -t \
  --entrypoint bash \
  -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
  -e HOME=/home/node \
  -e NODE_OPTIONS=--disable-warning=ExperimentalWarning \
  -e REBOOTIX_LIVE_TEST=1 \
  -e REBOOTIX_LIVE_GATEWAY_MODELS="${REBOOTIX_LIVE_GATEWAY_MODELS:-${REBOOTIX_LIVE_GATEWAY_MODELS:-all}}" \
  -e REBOOTIX_LIVE_GATEWAY_PROVIDERS="${REBOOTIX_LIVE_GATEWAY_PROVIDERS:-${REBOOTIX_LIVE_GATEWAY_PROVIDERS:-}}" \
  -e REBOOTIX_LIVE_GATEWAY_MODEL_TIMEOUT_MS="${REBOOTIX_LIVE_GATEWAY_MODEL_TIMEOUT_MS:-${REBOOTIX_LIVE_GATEWAY_MODEL_TIMEOUT_MS:-}}" \
  -v "$CONFIG_DIR":/home/node/.rebootix \
  -v "$WORKSPACE_DIR":/home/node/.rebootix/workspace \
  "${PROFILE_MOUNT[@]}" \
  "$IMAGE_NAME" \
  -lc "set -euo pipefail; [ -f \"$HOME/.profile\" ] && source \"$HOME/.profile\" || true; cd /app && pnpm test:live"
