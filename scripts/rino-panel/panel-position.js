export function applyPanelConfig(panel, config, index, savedBounds) {
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

  if (Number.isFinite(savedBounds?.left) && Number.isFinite(savedBounds?.top)) {
    panel.style.position = "fixed";
    if (Number.isFinite(savedBounds.width)) panel.style.width = `${savedBounds.width}px`;
    if (Number.isFinite(savedBounds.height)) panel.style.height = `${savedBounds.height}px`;
    panel.style.left = `${savedBounds.left}px`;
    panel.style.top = `${savedBounds.top}px`;
    return;
  }

  if (position === "top-center") {
    panel.style.top = offsetY; panel.style.left = "50%"; panel.style.transform = "translateX(-50%)";
  } else if (position === "bottom-center") {
    panel.style.bottom = offsetY; panel.style.left = "50%"; panel.style.transform = "translateX(-50%)";
  } else if (position === "center-right") {
    panel.style.top = "50%"; panel.style.right = offsetX; panel.style.transform = "translateY(-50%)";
  } else if (position === "center-left") {
    panel.style.top = "50%"; panel.style.left = offsetX; panel.style.transform = "translateY(-50%)";
  } else if (position === "center" || position === "center-center") {
    panel.style.top = "50%"; panel.style.left = "50%"; panel.style.transform = "translate(-50%, -50%)";
  } else {
    if (position.includes("top")) panel.style.top = offsetY;
    if (position.includes("bottom")) panel.style.bottom = offsetY;
    if (position.includes("left")) panel.style.left = offsetX;
    if (position.includes("right")) panel.style.right = offsetX;
  }
}

export function applyStoredPanelPosition(host, config, index, savedBounds) {
  const panel = host.shadowRoot?.querySelector(".panel");
  if (panel) applyPanelConfig(panel, config, index, savedBounds);
}

