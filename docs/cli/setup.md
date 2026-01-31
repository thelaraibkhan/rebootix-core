---
summary: "CLI reference for `rebootix setup` (initialize config + workspace)"
read_when:
  - You’re doing first-run setup without the full onboarding wizard
  - You want to set the default workspace path
---

# `rebootix setup`

Initialize `~/.rebootix/rebootix.json` and the agent workspace.

Related:

- Getting started: [Getting started](/start/getting-started)
- Wizard: [Onboarding](/start/onboarding)

## Examples

```bash
rebootix setup
rebootix setup --workspace ~/.rebootix/workspace
```

To run the wizard via setup:

```bash
rebootix setup --wizard
```
