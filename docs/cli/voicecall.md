---
summary: "CLI reference for `rebootix voicecall` (voice-call plugin command surface)"
read_when:
  - You use the voice-call plugin and want the CLI entry points
  - You want quick examples for `voicecall call|continue|status|tail|expose`
---

# `rebootix voicecall`

`voicecall` is a plugin-provided command. It only appears if the voice-call plugin is installed and enabled.

Primary doc:

- Voice-call plugin: [Voice Call](/plugins/voice-call)

## Common commands

```bash
rebootix voicecall status --call-id <id>
rebootix voicecall call --to "+15555550123" --message "Hello" --mode notify
rebootix voicecall continue --call-id <id> --message "Any questions?"
rebootix voicecall end --call-id <id>
```

## Exposing webhooks (Tailscale)

```bash
rebootix voicecall expose --mode serve
rebootix voicecall expose --mode funnel
rebootix voicecall unexpose
```

Security note: only expose the webhook endpoint to networks you trust. Prefer Tailscale Serve over Funnel when possible.
