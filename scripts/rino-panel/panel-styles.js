export const PANEL_STYLES = `
  :host { all: initial; }
  .panel { display: grid; grid-template-rows: minmax(0, 1fr); overflow: hidden; border: 1px solid #dfe3ec; border-radius: 18px; color: #172033; background: #fff; box-shadow: 0 8px 24px rgb(15 23 42 / 18%); font: 14px/1.4 Inter, ui-sans-serif, system-ui, sans-serif; animation: rino-panel-in 220ms ease-out both; }
  .panel.minimized { height: 52px !important; min-height: 52px; }
  .viewport { position: relative; min-height: 0; background: #fff; }
  .floating-control { position: absolute; top: 12px; z-index: 1; display: grid; width: 28px; height: 28px; place-items: center; border: 0; border-radius: 9px; color: #fff; background: rgb(23 32 51 / 78%); cursor: pointer; }
  .floating-control[hidden], .resize-handle[hidden] { display: none !important; }
  .floating-move { left: 12px; cursor: move; touch-action: none; }
  .floating-minimize { left: 48px; }
  .floating-reset { left: 84px; }
  .floating-close { right: 12px; font-size: 18px; }
  .move-icon { display: block; width: 14px; height: 14px; background: currentColor; clip-path: polygon(50% 0, 70% 20%, 57% 20%, 57% 43%, 80% 43%, 80% 30%, 100% 50%, 80% 70%, 80% 57%, 57% 57%, 57% 80%, 70% 80%, 50% 100%, 30% 80%, 43% 80%, 43% 57%, 20% 57%, 20% 70%, 0 50%, 20% 30%, 20% 43%, 43% 43%, 43% 20%, 30% 20%); }
  .floating-move:hover, .floating-minimize:hover, .floating-reset:hover { background: rgb(23 32 51 / 78%); }
  .floating-minimize .minimize-icon { display: block; width: 11px; height: 2px; border-radius: 2px; background: currentColor; }
  .floating-minimize[aria-pressed="true"] .minimize-icon { width: 10px; height: 7px; border: 2px solid currentColor; border-top-width: 1px; background: transparent; }
  .floating-reset .reset-icon { position: relative; display: block; width: 13px; height: 13px; border: 2px solid currentColor; border-right-color: transparent; border-radius: 50%; transform: rotate(-35deg); }
  .floating-reset .reset-icon::after { content: ""; position: absolute; top: -1px; right: -4px; width: 0; height: 0; border-top: 3px solid transparent; border-bottom: 3px solid transparent; border-left: 4px solid currentColor; transform: rotate(50deg); transform-origin: left center; }
  .floating-close:hover { background: #172033; }
  .resize-handle { position: absolute; z-index: 2; touch-action: none; }
  .resize-n, .resize-s { left: 8px; right: 8px; height: 7px; cursor: ns-resize; }
  .resize-e, .resize-w { top: 8px; bottom: 8px; width: 7px; cursor: ew-resize; }
  .resize-n { top: -3px; } .resize-s { bottom: -3px; } .resize-e { right: -3px; } .resize-w { left: -3px; }
  .resize-ne, .resize-nw, .resize-se, .resize-sw { width: 12px; height: 12px; }
  .resize-ne { top: -3px; right: -3px; cursor: nesw-resize; }
  .resize-nw { top: -3px; left: -3px; cursor: nwse-resize; }
  .resize-se { right: -3px; bottom: -3px; cursor: nwse-resize; }
  .resize-sw { bottom: -3px; left: -3px; cursor: nesw-resize; }
  .panel.minimized .resize-handle { display: none; }
  iframe { width: 100%; height: 100%; border: 0; opacity: 0; transition: opacity 180ms ease; }
  iframe.loaded { opacity: 1; }
  .panel.minimized iframe { visibility: hidden; }
  @keyframes rino-panel-in { from { opacity: 0; translate: 0 10px; } to { opacity: 1; translate: 0 0; } }
  @media (max-width: 520px) { .panel { border-radius: 14px; } }
  @media (prefers-reduced-motion: reduce) { .panel { animation: none; } iframe { transition: none; } }
`;

