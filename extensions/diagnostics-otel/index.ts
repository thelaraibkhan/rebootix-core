import type { RebootixPluginApi } from "rebootix/plugin-sdk";
import { emptyPluginConfigSchema } from "rebootix/plugin-sdk";

import { createDiagnosticsOtelService } from "./src/service.js";

const plugin = {
  id: "diagnostics-otel",
  name: "Diagnostics OpenTelemetry",
  description: "Export diagnostics events to OpenTelemetry",
  configSchema: emptyPluginConfigSchema(),
  register(api: RebootixPluginApi) {
    api.registerService(createDiagnosticsOtelService());
  },
};

export default plugin;
