---
name: rebootixhub
description: Use the RebootixHub CLI to search, install, update, and publish agent skills from rebootixhub.com. Use when you need to fetch new skills on the fly, sync installed skills to latest or a specific version, or publish new/updated skill folders with the npm-installed rebootixhub CLI.
metadata:
  {
    "rebootix":
      {
        "requires": { "bins": ["rebootixhub"] },
        "install":
          [
            {
              "id": "node",
              "kind": "node",
              "package": "rebootixhub",
              "bins": ["rebootixhub"],
              "label": "Install RebootixHub CLI (npm)",
            },
          ],
      },
  }
---

# RebootixHub CLI

Install

```bash
npm i -g rebootixhub
```

Auth (publish)

```bash
rebootixhub login
rebootixhub whoami
```

Search

```bash
rebootixhub search "postgres backups"
```

Install

```bash
rebootixhub install my-skill
rebootixhub install my-skill --version 1.2.3
```

Update (hash-based match + upgrade)

```bash
rebootixhub update my-skill
rebootixhub update my-skill --version 1.2.3
rebootixhub update --all
rebootixhub update my-skill --force
rebootixhub update --all --no-input --force
```

List

```bash
rebootixhub list
```

Publish

```bash
rebootixhub publish ./my-skill --slug my-skill --name "My Skill" --version 1.2.0 --changelog "Fixes + docs"
```

Notes

- Default registry: https://rebootixhub.com (override with REBOOTIXHUB_REGISTRY or --registry)
- Default workdir: cwd (falls back to Rebootix workspace); install dir: ./skills (override with --workdir / --dir / REBOOTIXHUB_WORKDIR)
- Update command hashes local files, resolves matching version, and upgrades to latest unless --version is set
