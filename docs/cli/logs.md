---
summary: "CLI reference for `rebootix logs` (tail gateway logs via RPC)"
read_when:
  - You need to tail Gateway logs remotely (without SSH)
  - You want JSON log lines for tooling
---

# `rebootix logs`

Tail Gateway file logs over RPC (works in remote mode).

Related:

- Logging overview: [Logging](/logging)

## Examples

```bash
rebootix logs
rebootix logs --follow
rebootix logs --json
rebootix logs --limit 500
```
