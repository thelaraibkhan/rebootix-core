---
summary: "CLI reference for `rebootix tui` (terminal UI connected to the Gateway)"
read_when:
  - You want a terminal UI for the Gateway (remote-friendly)
  - You want to pass url/token/session from scripts
---

# `rebootix tui`

Open the terminal UI connected to the Gateway.

Related:

- TUI guide: [TUI](/tui)

## Examples

```bash
rebootix tui
rebootix tui --url ws://127.0.0.1:18789 --token <token>
rebootix tui --session main --deliver
```
