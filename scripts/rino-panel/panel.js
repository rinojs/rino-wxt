import { HOST_PREFIX } from "./constants.js";
import { configurePanelControls } from "./panel-controls.js";
import { applyMinimizedState } from "./panel-minimize.js";
import { applyStoredPanelPosition } from "./panel-position.js";
import { PANEL_STYLES } from "./panel-styles.js";

const PANEL_MARKUP = `
  <section class="panel" aria-label="Inserted extension page">
    <div class="viewport">
      <button class="floating-control floating-move" type="button" aria-label="Drag panel" title="Drag panel"><span class="move-icon" aria-hidden="true"></span></button>
      <button class="floating-control floating-minimize" type="button"><span class="minimize-icon" aria-hidden="true"></span></button>
      <button class="floating-control floating-reset" type="button" aria-label="Reset panel position" title="Reset panel position"><span class="reset-icon" aria-hidden="true"></span></button>
      <button class="floating-control floating-close" type="button" aria-label="Close inserted page">×</button>
      <iframe></iframe>
    </div>
    <span class="resize-handle resize-n" data-resize="n"></span><span class="resize-handle resize-ne" data-resize="ne"></span><span class="resize-handle resize-e" data-resize="e"></span><span class="resize-handle resize-se" data-resize="se"></span><span class="resize-handle resize-s" data-resize="s"></span><span class="resize-handle resize-sw" data-resize="sw"></span><span class="resize-handle resize-w" data-resize="w"></span><span class="resize-handle resize-nw" data-resize="nw"></span>
  </section>`;

export function getPanelHost(index) {
  return document.getElementById(`${HOST_PREFIX}${index}`);
}

export function insertPanel({ page, config, index, savedBounds, minimized, extensionApi }) {
  if (getPanelHost(index) || config.enabled === false) return;
  const host = document.createElement("div");
  host.id = `${HOST_PREFIX}${index}`;
  const shadow = host.attachShadow({ mode: "open" });
  shadow.innerHTML = `<style>${PANEL_STYLES}</style>${PANEL_MARKUP}`;

  const panel = shadow.querySelector(".panel");
  const frame = shadow.querySelector("iframe");
  panel.setAttribute("aria-label", page.name);
  frame.title = page.name;
  frame.src = extensionApi.runtime.getURL(page.path);
  frame.addEventListener("load", () => frame.classList.add("loaded"));

  configurePanelControls({ shadow, host, panel, config, index, page, extensionApi });
  applyStoredPanelPosition(host, config, index, savedBounds);
  applyMinimizedState(host, minimized && config.minimizable !== false);
  document.documentElement.append(host);
}

