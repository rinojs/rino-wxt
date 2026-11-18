import { applyPanelConfig } from "./panel-position.js";
import { savePanelBounds } from "./storage.js";

export function attachPanelResize({ handles, panel, config, index, page, extensionApi }) {
  handles.forEach((handle) => {
    handle.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      const direction = handle.dataset.resize;
      const startRect = panel.getBoundingClientRect();
      const startX = event.clientX;
      const startY = event.clientY;
      const minimumWidth = Math.min(220, window.innerWidth);
      const minimumHeight = Math.min(120, window.innerHeight);
      handle.setPointerCapture(event.pointerId);

      function resizePanel(moveEvent) {
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;
        let { left, top, width, height } = startRect;
        if (direction.includes("e")) width = Math.min(window.innerWidth - left, Math.max(minimumWidth, startRect.width + deltaX));
        if (direction.includes("s")) height = Math.min(window.innerHeight - top, Math.max(minimumHeight, startRect.height + deltaY));
        if (direction.includes("w")) { left = Math.max(0, Math.min(startRect.right - minimumWidth, startRect.left + deltaX)); width = startRect.right - left; }
        if (direction.includes("n")) { top = Math.max(0, Math.min(startRect.bottom - minimumHeight, startRect.top + deltaY)); height = startRect.bottom - top; }
        applyPanelConfig(panel, config, index, { left, top, width, height });
      }

      async function finishResize(upEvent) {
        handle.removeEventListener("pointermove", resizePanel);
        handle.removeEventListener("pointerup", finishResize);
        handle.removeEventListener("pointercancel", finishResize);
        const rect = panel.getBoundingClientRect();
        await savePanelBounds(extensionApi, page.path, {
          left: Math.round(rect.left), top: Math.round(rect.top),
          width: Math.round(rect.width), height: Math.round(rect.height),
        });
        if (handle.hasPointerCapture(upEvent.pointerId)) handle.releasePointerCapture(upEvent.pointerId);
      }

      handle.addEventListener("pointermove", resizePanel);
      handle.addEventListener("pointerup", finishResize);
      handle.addEventListener("pointercancel", finishResize);
    });
  });
}

