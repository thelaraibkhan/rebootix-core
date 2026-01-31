---
summary: "CLI reference for `rebootix config` (get/set/unset config values)"
read_when:
  - You want to read or edit config non-interactively
---

# `rebootix config`

Config helpers: get/set/unset values by path. Run without a subcommand to open
the configure wizard (same as `rebootix configure`).

## Examples

```bash
rebootix config get browser.executablePath
rebootix config set browser.executablePath "/usr/bin/google-chrome"
rebootix config set agents.defaults.heartbeat.every "2h"
rebootix config set agents.list[0].tools.exec.node "node-id-or-name"
rebootix config unset tools.web.search.apiKey
```

## Paths

Paths use dot or bracket notation:

```bash
rebootix config get agents.defaults.workspace
rebootix config get agents.list[0].id
```

Use the agent list index to target a specific agent:

```bash
rebootix config get agents.list
rebootix config set agents.list[1].tools.exec.node "node-id-or-name"
```

## Values

Values are parsed as JSON5 when possible; otherwise they are treated as strings.
Use `--json` to require JSON5 parsing.

```bash
rebootix config set agents.defaults.heartbeat.every "0m"
rebootix config set gateway.port 19001 --json
rebootix config set channels.whatsapp.groups '["*"]' --json
```

Restart the gateway after edits.
