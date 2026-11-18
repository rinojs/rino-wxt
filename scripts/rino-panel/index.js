import { isInvalidatedExtensionContext } from "./errors.js";
import { insertPanelLauncher } from "./launcher.js";
import { synchronizePanelState } from "./synchronization.js";

export async function initializeRinoPanels() {
  const extensionApi = globalThis.browser ?? globalThis.chrome;
  const registry = globalThis.__RINO_INSERTED_PAGES__;
  if (!registry) throw new Error("The inserted-page registry was not loaded.");
  const updateLauncher = insertPanelLauncher(registry, extensionApi);
  await synchronizePanelState(registry, extensionApi, updateLauncher);
}

export function startRinoPanels() {
  initializeRinoPanels().catch((error) => {
    if (!isInvalidatedExtensionContext(error)) {
      console.error("Rino extension: inserted pages could not be loaded.", error);
    }
  });
}

