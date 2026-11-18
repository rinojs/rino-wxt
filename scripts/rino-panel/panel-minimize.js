export function applyMinimizedState(host, minimized) {
  const panel = host.shadowRoot?.querySelector(".panel");
  const button = host.shadowRoot?.querySelector(".floating-minimize");
  if (!panel || !button) return;
  panel.classList.toggle("minimized", minimized);
  button.setAttribute("aria-label", minimized ? "Restore panel" : "Minimize panel");
  button.title = minimized ? "Restore panel" : "Minimize panel";
  button.setAttribute("aria-pressed", String(minimized));
}

