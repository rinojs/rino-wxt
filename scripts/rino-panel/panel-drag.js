import { applyPanelConfig } from "./panel-position.js";
import { savePanelBounds } from "./storage.js";

export function attachPanelDrag({ button, panel, config, index, page, extensionApi }) {
  button.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    const startRect = panel.getBoundingClientRect();
    const startX = event.clientX;
    const startY = event.clientY;
    button.setPointerCapture(event.pointerId);

    function movePanel(moveEvent) {
      const maxLeft = Math.max(0, window.innerWidth - startRect.width);
      const maxTop = Math.max(0, window.innerHeight - startRect.height);
      const left = Math.min(maxLeft, Math.max(0, startRect.left + moveEvent.clientX - startX));
      const top = Math.min(maxTop, Math.max(0, startRect.top + moveEvent.clientY - startY));
      applyPanelConfig(panel, config, index, { left, top });
    }

    async function finishMove(upEvent) {
      button.removeEventListener("pointermove", movePanel);
      button.removeEventListener("pointerup", finishMove);
      button.removeEventListener("pointercancel", finishMove);
      const rect = panel.getBoundingClientRect();
      await savePanelBounds(extensionApi, page.path, {
        left: Math.round(rect.left), top: Math.round(rect.top),
      }, true);
      if (button.hasPointerCapture(upEvent.pointerId)) button.releasePointerCapture(upEvent.pointerId);
    }

    button.addEventListener("pointermove", movePanel);
    button.addEventListener("pointerup", finishMove);
    button.addEventListener("pointercancel", finishMove);
  });
}

