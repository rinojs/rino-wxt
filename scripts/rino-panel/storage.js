import { STORAGE_KEYS } from "./constants.js";

export async function getPanelState(extensionApi) {
  const state = await extensionApi.storage.local.get({
    [STORAGE_KEYS.closed]: [],
    [STORAGE_KEYS.positions]: {},
    [STORAGE_KEYS.minimized]: [],
  });
  return {
    closed: state[STORAGE_KEYS.closed] ?? [],
    positions: state[STORAGE_KEYS.positions] ?? {},
    minimized: state[STORAGE_KEYS.minimized] ?? [],
  };
}

export async function rememberClosedPage(extensionApi, pagePath) {
  const state = await extensionApi.storage.local.get({ [STORAGE_KEYS.closed]: [] });
  const closed = new Set(state[STORAGE_KEYS.closed] ?? []);
  closed.add(pagePath);
  await extensionApi.storage.local.set({ [STORAGE_KEYS.closed]: [...closed] });
}

export async function reopenStoredPage(extensionApi, pagePath) {
  const state = await extensionApi.storage.local.get({ [STORAGE_KEYS.closed]: [] });
  const closed = (state[STORAGE_KEYS.closed] ?? []).filter((path) => path !== pagePath);
  await extensionApi.storage.local.set({ [STORAGE_KEYS.closed]: closed });
  return closed;
}

export async function savePanelBounds(extensionApi, pagePath, bounds, preserveSize = false) {
  const state = await extensionApi.storage.local.get({ [STORAGE_KEYS.positions]: {} });
  const positions = state[STORAGE_KEYS.positions] ?? {};
  const previous = preserveSize ? positions[pagePath] ?? {} : {};
  await extensionApi.storage.local.set({
    [STORAGE_KEYS.positions]: { ...positions, [pagePath]: { ...previous, ...bounds } },
  });
}

export async function resetPanelBounds(extensionApi, pagePath) {
  const state = await extensionApi.storage.local.get({ [STORAGE_KEYS.positions]: {} });
  const positions = { ...(state[STORAGE_KEYS.positions] ?? {}) };
  delete positions[pagePath];
  await extensionApi.storage.local.set({ [STORAGE_KEYS.positions]: positions });
}

export async function toggleMinimizedPage(extensionApi, pagePath) {
  const state = await extensionApi.storage.local.get({ [STORAGE_KEYS.minimized]: [] });
  const minimized = new Set(state[STORAGE_KEYS.minimized] ?? []);
  minimized.has(pagePath) ? minimized.delete(pagePath) : minimized.add(pagePath);
  await extensionApi.storage.local.set({ [STORAGE_KEYS.minimized]: [...minimized] });
}

