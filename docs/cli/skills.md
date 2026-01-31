---
summary: "CLI reference for `rebootix skills` (list/info/check) and skill eligibility"
read_when:
  - You want to see which skills are available and ready to run
  - You want to debug missing binaries/env/config for skills
---

# `rebootix skills`

Inspect skills (bundled + workspace + managed overrides) and see what’s eligible vs missing requirements.

Related:

- Skills system: [Skills](/tools/skills)
- Skills config: [Skills config](/tools/skills-config)
- RebootixHub installs: [RebootixHub](/tools/clawhub)

## Commands

```bash
rebootix skills list
rebootix skills list --eligible
rebootix skills info <name>
rebootix skills check
```
