export const LAUNCHER_STYLES = `
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
`;

