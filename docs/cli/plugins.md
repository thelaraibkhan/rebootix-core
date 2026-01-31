---
summary: "CLI reference for `rebootix plugins` (list, install, enable/disable, doctor)"
read_when:
  - You want to install or manage in-process Gateway plugins
  - You want to debug plugin load failures
---

# `rebootix plugins`

Manage Gateway plugins/extensions (loaded in-process).

Related:

- Plugin system: [Plugins](/plugin)
- Plugin manifest + schema: [Plugin manifest](/plugins/manifest)
- Security hardening: [Security](/gateway/security)

## Commands

```bash
rebootix plugins list
rebootix plugins info <id>
rebootix plugins enable <id>
rebootix plugins disable <id>
rebootix plugins doctor
rebootix plugins update <id>
rebootix plugins update --all
```

Bundled plugins ship with Rebootix but start disabled. Use `plugins enable` to
activate them.

All plugins must ship a `rebootix.plugin.json` file with an inline JSON Schema
(`configSchema`, even if empty). Missing/invalid manifests or schemas prevent
the plugin from loading and fail config validation.

### Install

```bash
rebootix plugins install <path-or-spec>
```

Security note: treat plugin installs like running code. Prefer pinned versions.

Supported archives: `.zip`, `.tgz`, `.tar.gz`, `.tar`.

Use `--link` to avoid copying a local directory (adds to `plugins.load.paths`):

```bash
rebootix plugins install -l ./my-plugin
```

### Update

```bash
rebootix plugins update <id>
rebootix plugins update --all
rebootix plugins update <id> --dry-run
```

Updates only apply to plugins installed from npm (tracked in `plugins.installs`).
