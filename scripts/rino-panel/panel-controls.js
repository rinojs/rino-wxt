import { attachPanelDrag } from "./panel-drag.js";
import { attachPanelResize } from "./panel-resize.js";
import { rememberClosedPage, resetPanelBounds, toggleMinimizedPage } from "./storage.js";

export function configurePanelControls(context) {
  const { shadow, host, panel, config, page, extensionApi } = context;
  const move = shadow.querySelector(".floating-move");
  const minimize = shadow.querySelector(".floating-minimize");
  const reset = shadow.querySelector(".floating-reset");
  const close = shadow.querySelector(".floating-close");
  const handles = shadow.querySelectorAll(".resize-handle");

  move.hidden = config.movable === false;
  minimize.hidden = config.minimizable === false;
  reset.hidden = config.resettable === false;
  close.hidden = config.closable === false;
  handles.forEach((handle) => { handle.hidden = config.resizable === false; });

  attachPanelDrag({ ...context, button: move });
  attachPanelResize({ ...context, handles });
  minimize.addEventListener("click", () => toggleMinimizedPage(extensionApi, page.path));
  reset.addEventListener("click", () => resetPanelBounds(extensionApi, page.path));
  close.addEventListener("click", () => {
    host.remove();
    rememberClosedPage(extensionApi, page.path).catch((error) => {
      console.error("Rino extension: closed state could not be saved.", error);
    });
  });
}

