---
summary: "CLI reference for `rebootix reset` (reset local state/config)"
read_when:
  - You want to wipe local state while keeping the CLI installed
  - You want a dry-run of what would be removed
---

# `rebootix reset`

Reset local config/state (keeps the CLI installed).

```bash
rebootix reset
rebootix reset --dry-run
rebootix reset --scope config+creds+sessions --yes --non-interactive
```
