import { HOST_PREFIX, LAUNCHER_ID } from "./constants.js";
import { resolvePageConfig } from "./config.js";
import { getPanelHost, insertPanel } from "./panel.js";
import { getPanelState, rememberClosedPage, reopenStoredPage } from "./storage.js";
import { LAUNCHER_STYLES } from "./launcher-styles.js";

export function insertPanelLauncher(registry, extensionApi) {
  if (registry.config.launcher?.enabled === false || document.getElementById(LAUNCHER_ID)) return () => {};
  const host = document.createElement("div");
  host.id = LAUNCHER_ID;
  const shadow = host.attachShadow({ mode: "open" });
  shadow.innerHTML = `<style>${LAUNCHER_STYLES}</style><div class="launcher"><div class="menu" hidden><div class="list"></div></div><button class="trigger" type="button" aria-label="Open inserted pages" aria-expanded="false"><span class="menu-icon" aria-hidden="true"><span></span><span></span><span></span></span></button></div>`;

  const trigger = shadow.querySelector(".trigger");
  const menu = shadow.querySelector(".menu");
  const list = shadow.querySelector(".list");
  const launcher = shadow.querySelector(".launcher");
  const config = registry.config.launcher ?? {};
  const size = config.size ?? "48px";
  const offset = config.offset ?? "16px";
  const offsetX = config.offsetX ?? offset;
  const offsetY = config.offsetY ?? offset;
  const position = config.position ?? "bottom-right";

  trigger.style.width = size; trigger.style.height = size;
  trigger.style.borderRadius = config.borderRadius ?? "14px";
  launcher.style.margin = config.margin ?? "0px";
  menu.style.width = config.menuWidth ?? "260px";
  menu.style.maxHeight = config.menuMaxHeight ?? "280px";
  launcher.style.inset = "auto"; menu.style.inset = "auto";
  if (position.includes("top")) { launcher.style.top = offsetY; menu.style.top = `calc(${size} + 10px)`; }
  else { launcher.style.bottom = offsetY; menu.style.bottom = `calc(${size} + 10px)`; }
  if (position.includes("right")) { launcher.style.right = offsetX; menu.style.right = "0"; }
  else { launcher.style.left = offsetX; menu.style.left = "0"; }

  trigger.addEventListener("click", () => {
    menu.hidden = !menu.hidden;
    trigger.setAttribute("aria-expanded", String(!menu.hidden));
  });

  async function reopenPage(page, index) {
    if (getPanelHost(index)) return;
    const state = await getPanelState(extensionApi);
    const pageConfig = resolvePageConfig(registry.config, page);
    insertPanel({ page, config: pageConfig, index, savedBounds: state.positions[page.path], minimized: state.minimized.includes(page.path), extensionApi });
    update(await reopenStoredPage(extensionApi, page.path));
  }

  async function togglePage(page, index) {
    const existing = getPanelHost(index);
    const pageConfig = resolvePageConfig(registry.config, page);
    if (!existing) return reopenPage(page, index);
    if (pageConfig.closable === false) return;
    existing.remove();
    await rememberClosedPage(extensionApi, page.path);
  }

  function update() {
    list.replaceChildren();
    registry.pages.forEach((page, index) => {
      const pageConfig = resolvePageConfig(registry.config, page);
      if (pageConfig.enabled === false) return;
      const isOpen = Boolean(document.getElementById(`${HOST_PREFIX}${index}`));
      const button = document.createElement("button");
      button.className = "item"; button.type = "button";
      button.disabled = isOpen && pageConfig.closable === false;
      button.setAttribute("aria-pressed", String(isOpen));
      button.append(document.createTextNode(page.name));
      const icon = document.createElement("span");
      icon.setAttribute("aria-hidden", "true");
      if (isOpen) icon.className = "open-indicator"; else icon.textContent = "+";
      button.append(icon);
      button.addEventListener("click", () => togglePage(page, index));
      list.append(button);
    });
  }

  document.documentElement.append(host);
  return update;
}

