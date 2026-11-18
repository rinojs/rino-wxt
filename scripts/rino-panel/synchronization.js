import { STORAGE_KEYS } from "./constants.js";
import { resolvePageConfig } from "./config.js";
import { reportRefreshError } from "./errors.js";
import { insertPanel, getPanelHost } from "./panel.js";
import { applyMinimizedState } from "./panel-minimize.js";
import { applyStoredPanelPosition } from "./panel-position.js";
import { getPanelState } from "./storage.js";

export async function synchronizePanelState(registry, extensionApi, updateLauncher) {
  let state = { closed: [], positions: {}, minimized: [] };

  function synchronizePanels() {
    const closed = new Set(state.closed);
    registry.pages.forEach((page, index) => {
      const host = getPanelHost(index);
      const config = resolvePageConfig(registry.config, page);
      if (closed.has(page.path) && config.closable !== false) {
        host?.remove();
      } else if (host) {
        applyStoredPanelPosition(host, config, index, state.positions[page.path]);
        applyMinimizedState(host, config.minimizable !== false && state.minimized.includes(page.path));
      } else {
        insertPanel({ page, config, index, savedBounds: state.positions[page.path], minimized: state.minimized.includes(page.path), extensionApi });
      }
    });
    updateLauncher();
  }

  async function refresh() {
    state = await getPanelState(extensionApi);
    synchronizePanels();
  }

  await refresh();
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") refresh().catch(reportRefreshError);
  });
  window.addEventListener("focus", () => refresh().catch(reportRefreshError));
  extensionApi.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local") return;
    if (changes[STORAGE_KEYS.closed]) state.closed = changes[STORAGE_KEYS.closed].newValue ?? [];
    if (changes[STORAGE_KEYS.positions]) state.positions = changes[STORAGE_KEYS.positions].newValue ?? {};
    if (changes[STORAGE_KEYS.minimized]) state.minimized = changes[STORAGE_KEYS.minimized].newValue ?? [];
    if (changes[STORAGE_KEYS.restoreRevision]) state.closed = [];
    synchronizePanels();
  });
}

