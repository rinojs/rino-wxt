const extensionApi = globalThis.browser ?? globalThis.chrome;
const hostPrefix = "rino-inserted-page-";
const storageKey = "closedInsertedPages";
const restoreRevisionKey = "insertedPanelsRestoreRevision";

async function rememberClosedPage(pagePath) {
  const state = await extensionApi.storage.local.get({ [storageKey]: [] });
  const closedPages = new Set(state[storageKey]);
  closedPages.add(pagePath);
  await extensionApi.storage.local.set({ [storageKey]: [...closedPages] });
}

function resolvePageConfig(config, page) {
  const pagePath = page.path.replace(/^inserted\//, "");
  const pageConfig = config.pages?.[pagePath] ?? {};
  return { ...config, ...pageConfig };
}

function applyPanelConfig(panel, config, index) {
  const offset = config.offset ?? "16px";
  const offsetX = config.offsetX ?? offset;
  const offsetY = config.offsetY ?? offset;
  const position = config.position ?? "bottom-right";

  panel.style.position = config.fixed === false ? "absolute" : "fixed";
  panel.style.width = config.width ?? "420px";
  panel.style.height = config.height ?? "520px";
  panel.style.maxWidth = `calc(100vw - ${offsetX} - ${offsetX})`;
  panel.style.maxHeight = `calc(100vh - ${offsetY} - ${offsetY})`;
  panel.style.zIndex = String(config.zIndex ?? (2147483600 + index));
  panel.style.margin = config.margin ?? "0px";
  panel.style.borderRadius = config.borderRadius ?? "14px";
  panel.style.boxShadow = config.boxShadow ?? "0 8px 24px rgb(15 23 42 / 18%)";
  panel.style.inset = "auto";
  panel.style.transform = "none";

  if (position.includes("top")) panel.style.top = offsetY;
  if (position.includes("bottom")) panel.style.bottom = offsetY;
  if (position.includes("left")) panel.style.left = offsetX;
  if (position.includes("right")) panel.style.right = offsetX;
  if (position === "center") {
    panel.style.top = "50%";
    panel.style.left = "50%";
    panel.style.transform = "translate(-50%, -50%)";
  }
}

function insertPage(page, config, index) {
  const hostId = `${hostPrefix}${index}`;
  if (document.getElementById(hostId) || config.enabled === false) return;

  const host = document.createElement("div");
  host.id = hostId;
  const shadow = host.attachShadow({ mode: "open" });

  shadow.innerHTML = `
    <style>
      :host { all: initial; }
      .panel {
        display: grid; grid-template-rows: minmax(0, 1fr);
        overflow: hidden; border: 1px solid #dfe3ec; border-radius: 18px;
        color: #172033; background: #fff;
        box-shadow: 0 8px 24px rgb(15 23 42 / 18%);
        font: 14px/1.4 Inter, ui-sans-serif, system-ui, sans-serif;
        animation: rino-panel-in 220ms ease-out both;
      }
      .viewport { position: relative; min-height: 0; background: #fff; }
      .floating-close { position: absolute; top: 12px; right: 12px; z-index: 1; display: grid; width: 28px; height: 28px; place-items: center; border: 0; border-radius: 9px; color: #fff; background: rgb(23 32 51 / 78%); cursor: pointer; font-size: 18px; }
      .floating-close:hover { background: #172033; }
      .floating-close[hidden] { display: none; }
      iframe { width: 100%; height: 100%; border: 0; opacity: 0; transition: opacity 180ms ease; }
      iframe.loaded { opacity: 1; }
      @keyframes rino-panel-in { from { opacity: 0; translate: 0 10px; } to { opacity: 1; translate: 0 0; } }
      @media (max-width: 520px) { .panel { border-radius: 14px; } }
      @media (prefers-reduced-motion: reduce) { .panel { animation: none; } iframe { transition: none; } }
    </style>
    <section class="panel" aria-label="Inserted extension page">
      <div class="viewport"><button class="floating-close" type="button" aria-label="Close inserted page">×</button><iframe></iframe></div>
    </section>
  `;

  const panel = shadow.querySelector(".panel");
  const frame = shadow.querySelector("iframe");
  const floatingClose = shadow.querySelector(".floating-close");
  floatingClose.hidden = config.closable === false;
  panel.setAttribute("aria-label", page.name);
  frame.title = page.name;
  frame.src = extensionApi.runtime.getURL(page.path);
  frame.addEventListener("load", () => frame.classList.add("loaded"));
  function closePanel() {
    host.remove();
    rememberClosedPage(page.path).catch((error) => {
      console.error("Rino extension: closed state could not be saved.", error);
    });
  }
  floatingClose.addEventListener("click", closePanel);
  applyPanelConfig(panel, config, index);
  document.documentElement.append(host);
}

function insertPanelLauncher(registry) {
  const launcherId = "rino-panel-launcher";
  if (registry.config.launcher?.enabled === false) return () => {};
  const existingLauncher = document.getElementById(launcherId);
  if (existingLauncher) return () => {};

  const host = document.createElement("div");
  host.id = launcherId;
  const shadow = host.attachShadow({ mode: "open" });

  shadow.innerHTML = `
    <style>
      :host { all: initial; }
      .launcher { position: fixed; z-index: 2147483647; font: 13px/1.4 Inter, ui-sans-serif, system-ui, sans-serif; }
      .trigger { display: grid; width: 48px; height: 48px; place-items: center; border: 0; border-radius: 14px; color: #fff; background: #c62828; box-shadow: 0 10px 28px rgb(198 40 40 / 30%); cursor: pointer; }
      .trigger:hover { background: #b71c1c; transform: translateY(-1px); }
      .menu-icon { display: grid; gap: 4px; width: 18px; }
      .menu-icon span { display: block; height: 2px; border-radius: 999px; background: currentColor; transition: transform 180ms ease, opacity 140ms ease; transform-origin: center; }
      .trigger[aria-expanded="true"] .menu-icon span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
      .trigger[aria-expanded="true"] .menu-icon span:nth-child(2) { opacity: 0; transform: scaleX(0); }
      .trigger[aria-expanded="true"] .menu-icon span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }
      .menu { position: absolute; display: grid; grid-template-rows: minmax(0, 1fr); width: 260px; max-height: 280px; overflow: hidden; border: 1px solid #dfe3ec; border-radius: 14px; color: #172033; background: #fff; box-shadow: 0 18px 46px rgb(15 23 42 / 24%); }
      .menu[hidden] { display: none; }
      .list { display: grid; gap: 4px; overflow-y: auto; overscroll-behavior: contain; padding: 7px; scrollbar-gutter: stable; }
      .item { display: flex; width: 100%; height: 40px; flex: 0 0 40px; align-items: center; justify-content: space-between; border: 0; border-radius: 9px; padding: 0 10px; color: #27334b; background: #f6f7fa; cursor: pointer; font: inherit; font-weight: 700; line-height: 1; text-align: left; }
      .item:hover { color: #b71c1c; background: #fff1f1; }
      .item:disabled { color: #7d879b; background: #f6f7fa; cursor: default; }
      .item span { display: grid; flex: 0 0 auto; place-items: center; color: #c62828; font-size: 16px; line-height: 1; }
      .item .open-indicator { position: relative; width: 8px; height: 8px; border-radius: 50%; background: #1f9d61; box-shadow: 0 0 0 3px #dcf7e9; transition: background 140ms ease, box-shadow 140ms ease; }
      .item .open-indicator::before, .item .open-indicator::after { content: ""; position: absolute; top: 3px; left: -1px; width: 10px; height: 2px; border-radius: 999px; background: #c62828; opacity: 0; transition: opacity 140ms ease, transform 160ms ease; }
      .item:not(:disabled):hover .open-indicator { background: transparent; box-shadow: none; }
      .item:not(:disabled):hover .open-indicator::before { opacity: 1; transform: rotate(45deg); }
      .item:not(:disabled):hover .open-indicator::after { opacity: 1; transform: rotate(-45deg); }
      @media (prefers-reduced-motion: reduce) { .menu-icon span { transition: none; } }
    </style>
    <div class="launcher">
      <div class="menu" hidden>
        <div class="list"></div>
      </div>
      <button class="trigger" type="button" aria-label="Open inserted pages" aria-expanded="false"><span class="menu-icon" aria-hidden="true"><span></span><span></span><span></span></span></button>
    </div>
  `;

  const trigger = shadow.querySelector(".trigger");
  const menu = shadow.querySelector(".menu");
  const list = shadow.querySelector(".list");
  const launcher = shadow.querySelector(".launcher");
  const launcherConfig = registry.config.launcher ?? {};
  const launcherSize = launcherConfig.size ?? "48px";
  const launcherOffset = launcherConfig.offset ?? "16px";
  const launcherOffsetX = launcherConfig.offsetX ?? launcherOffset;
  const launcherOffsetY = launcherConfig.offsetY ?? launcherOffset;
  const launcherPosition = launcherConfig.position ?? "bottom-right";

  trigger.style.width = launcherSize;
  trigger.style.height = launcherSize;
  trigger.style.borderRadius = launcherConfig.borderRadius ?? "14px";
  launcher.style.margin = launcherConfig.margin ?? "0px";
  menu.style.width = launcherConfig.menuWidth ?? "260px";
  menu.style.maxHeight = launcherConfig.menuMaxHeight ?? "280px";
  launcher.style.inset = "auto";
  menu.style.inset = "auto";
  if (launcherPosition.includes("top")) {
    launcher.style.top = launcherOffsetY;
    menu.style.top = `calc(${launcherSize} + 10px)`;
  } else {
    launcher.style.bottom = launcherOffsetY;
    menu.style.bottom = `calc(${launcherSize} + 10px)`;
  }
  if (launcherPosition.includes("right")) {
    launcher.style.right = launcherOffsetX;
    menu.style.right = "0";
  } else {
    launcher.style.left = launcherOffsetX;
    menu.style.left = "0";
  }

  trigger.addEventListener("click", () => {
    const willOpen = menu.hidden;
    menu.hidden = !willOpen;
    trigger.setAttribute("aria-expanded", String(willOpen));
  });

  async function reopenPage(page, index) {
    if (document.getElementById(`${hostPrefix}${index}`)) return;

    insertPage(page, resolvePageConfig(registry.config, page), index);
    const state = await extensionApi.storage.local.get({ [storageKey]: [] });
    const closedPages = state[storageKey].filter((closedPath) => closedPath !== page.path);
    await extensionApi.storage.local.set({
      [storageKey]: closedPages,
    });
    update(closedPages);
  }

  async function togglePage(page, index) {
    const existingHost = document.getElementById(`${hostPrefix}${index}`);
    const pageConfig = resolvePageConfig(registry.config, page);

    if (existingHost) {
      if (pageConfig.closable === false) return;
      existingHost.remove();
      await rememberClosedPage(page.path);
      return;
    }

    await reopenPage(page, index);
  }

  function update(closedPagePaths) {
    list.replaceChildren();

    for (const [index, page] of registry.pages.entries()) {
      const pageConfig = resolvePageConfig(registry.config, page);
      if (pageConfig.enabled === false) continue;
      const isOpen = Boolean(document.getElementById(`${hostPrefix}${index}`));
      const button = document.createElement("button");
      button.className = "item";
      button.type = "button";
      button.disabled = isOpen && pageConfig.closable === false;
      button.setAttribute("aria-pressed", String(isOpen));
      button.append(document.createTextNode(page.name));
      const icon = document.createElement("span");
      icon.setAttribute("aria-hidden", "true");
      if (isOpen) {
        icon.className = "open-indicator";
      } else {
        icon.textContent = "+";
      }
      button.append(icon);
      button.addEventListener("click", () => togglePage(page, index));
      list.append(button);
    }
  }

  document.documentElement.append(host);
  return update;
}

async function insertRinoPages() {
  const registry = globalThis.__RINO_INSERTED_PAGES__;
  if (!registry) {
    throw new Error("The inserted-page registry was not loaded.");
  }
  const updateLauncher = insertPanelLauncher(registry);

  function synchronizePanels(closedPagePaths) {
    const closedPages = new Set(closedPagePaths);

    registry.pages.forEach((page, index) => {
      const existingHost = document.getElementById(`${hostPrefix}${index}`);
      const pageConfig = resolvePageConfig(registry.config, page);
      if (closedPages.has(page.path) && pageConfig.closable !== false) {
        existingHost?.remove();
      } else {
        insertPage(page, pageConfig, index);
      }
    });

    updateLauncher(closedPagePaths);
  }

  const state = await extensionApi.storage.local.get({ [storageKey]: [] });
  synchronizePanels(state[storageKey]);

  extensionApi.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local") return;
    if (changes[storageKey]) {
      synchronizePanels(changes[storageKey].newValue ?? []);
    } else if (changes[restoreRevisionKey]) {
      synchronizePanels([]);
    }
  });
}

insertRinoPages().catch((error) => {
  console.error("Rino extension: inserted pages could not be loaded.", error);
});
