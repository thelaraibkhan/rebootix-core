#!/usr/bin/env bash
set -euo pipefail

cd /repo

export REBOOTIX_STATE_DIR="/tmp/rebootix-test"
export REBOOTIX_CONFIG_PATH="${REBOOTIX_STATE_DIR}/rebootix.json"

echo "==> Seed state"
mkdir -p "${REBOOTIX_STATE_DIR}/credentials"
mkdir -p "${REBOOTIX_STATE_DIR}/agents/main/sessions"
echo '{}' >"${REBOOTIX_CONFIG_PATH}"
echo 'creds' >"${REBOOTIX_STATE_DIR}/credentials/marker.txt"
echo 'session' >"${REBOOTIX_STATE_DIR}/agents/main/sessions/sessions.json"

echo "==> Reset (config+creds+sessions)"
pnpm rebootix reset --scope config+creds+sessions --yes --non-interactive

test ! -f "${REBOOTIX_CONFIG_PATH}"
test ! -d "${REBOOTIX_STATE_DIR}/credentials"
test ! -d "${REBOOTIX_STATE_DIR}/agents/main/sessions"

echo "==> Recreate minimal config"
mkdir -p "${REBOOTIX_STATE_DIR}/credentials"
echo '{}' >"${REBOOTIX_CONFIG_PATH}"

echo "==> Uninstall (state only)"
pnpm rebootix uninstall --state --yes --non-interactive

test ! -d "${REBOOTIX_STATE_DIR}"

echo "OK"
