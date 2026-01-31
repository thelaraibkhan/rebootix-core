---
summary: "CLI reference for `rebootix agents` (list/add/delete/set identity)"
read_when:
  - You want multiple isolated agents (workspaces + routing + auth)
---

# `rebootix agents`

Manage isolated agents (workspaces + auth + routing).

Related:

- Multi-agent routing: [Multi-Agent Routing](/concepts/multi-agent)
- Agent workspace: [Agent workspace](/concepts/agent-workspace)

## Examples

```bash
rebootix agents list
rebootix agents add work --workspace ~/.rebootix/workspace-work
rebootix agents set-identity --workspace ~/.rebootix/workspace --from-identity
rebootix agents set-identity --agent main --avatar avatars/rebootix.png
rebootix agents delete work
```

## Identity files

Each agent workspace can include an `IDENTITY.md` at the workspace root:

- Example path: `~/.rebootix/workspace/IDENTITY.md`
- `set-identity --from-identity` reads from the workspace root (or an explicit `--identity-file`)

Avatar paths resolve relative to the workspace root.

## Set identity

`set-identity` writes fields into `agents.list[].identity`:

- `name`
- `theme`
- `emoji`
- `avatar` (workspace-relative path, http(s) URL, or data URI)

Load from `IDENTITY.md`:

```bash
rebootix agents set-identity --workspace ~/.rebootix/workspace --from-identity
```

Override fields explicitly:

```bash
rebootix agents set-identity --agent main --name "Rebootix" --emoji "🦞" --avatar avatars/rebootix.png
```

Config sample:

```json5
{
  agents: {
    list: [
      {
        id: "main",
        identity: {
          name: "Rebootix",
          theme: "space lobster",
          emoji: "🦞",
          avatar: "avatars/rebootix.png",
        },
      },
    ],
  },
}
```
