# Rino browser extension boilerplate

A Manifest V3 browser-extension starter built with [Rino.js](https://rinojs.com/). Rino generates the popup, inserted iframe pages, scripts, styles, public assets, and manifest into `www/`.

The current manifest targets Chrome, Edge, and Firefox 109 or newer.

## Setup

```sh
npm install
npm run generate
```

The generated unpacked extension is written to `www/`.

### Load in Chrome or Edge

1. Open the browser's extensions page.
2. Enable developer mode.
3. Choose **Load unpacked**.
4. Select this project's `www/` directory.
5. After rebuilding, reload the extension and refresh existing web pages.

### Load temporarily in Firefox

1. Open `about:debugging#/runtime/this-firefox`.
2. Choose **Load Temporary Add-on**.
3. Select `www/manifest.json`.

## Commands

```sh
npm run generate
```

Builds the complete extension and generates the inserted-page registry.

```sh
npm run dev
```

Runs Rino's development server. This is useful for basic page styling, but extension APIs, permissions, content scripts, and `chrome-extension://` behavior must be tested through an unpacked extension build.

## Project structure

```text
pages/
  popup/index.html           Extension toolbar popup
  inserted/*.html            Pages inserted into websites
scripts/export/
  popup/index.js             Popup behavior
  onload/rino-panel.js       Bundled panel entry point
  onclick/index.js           Optional active-tab script (disabled by default)
  inserted/index.js          Example inserted-page behavior
scripts/rino-panel/
  index.js                   Internal panel initialization
  panel*.js                  Panel layout, controls, drag and resize modules
  launcher*.js               Launcher behavior and Shadow DOM styles
  storage.js                 Persisted panel state operations
  synchronization.js         Cross-tab and visibility synchronization
styles/export/
  popup/index.css            Popup styles
  inserted/index.css         Example inserted-page styles
public/
  manifest.json              Manifest V3 configuration
  rino256.png                Current extension icon
rino-config.js               Rino and inserted-panel configuration
generate.js                  Extension build and page-registry generation
www/                         Generated unpacked extension
```

Files under `scripts/export/` and `styles/export/` are source files. Do not edit their generated counterparts under `www/` directly.

## Inserted pages

Every `.html` file under `pages/inserted/` is discovered during `npm run generate`. Nested directories are supported.

The page's `<title>` becomes its label in the launcher:

```html
<title>Recent Activity</title>
```

If `<title>` is missing or empty, the filename is formatted as a fallback. For example, `recent-activity.html` becomes `Recent Activity`.

Each inserted page is loaded in an isolated extension iframe, so it can load its own packaged CSS and JavaScript:

```html
<link rel="stylesheet" href="/styles/inserted/index.css" />
<script src="/scripts/inserted/index.js" defer></script>
```

Styles inside the iframe control the page content. Panel placement, outer dimensions, clipping, shadow, and close behavior are controlled by `rino-config.js`.

## Panel configuration

Global values act as defaults. Entries under `pages` override only the values needed for a specific page.

```js
extension: {
  insertedPages: {
    width: "320px",
    height: "360px",
    position: "bottom-right",
    offset: "16px",
    margin: "0px",
    fixed: true,
    zIndex: 2147483600,
    borderRadius: "14px",
    boxShadow: "0 8px 24px rgb(15 23 42 / 18%)",
    movable: true,
    minimizable: true,
    resettable: true,
    resizable: true,
    closable: true,

    launcher: {
      enabled: true,
      size: "48px",
      position: "bottom-right",
      offset: "16px",
      margin: "0px",
      borderRadius: "14px",
      menuWidth: "260px",
      menuMaxHeight: "280px"
    },

    pages: {
      "activity.html": {
        width: "330px",
        height: "340px",
        position: "top-right",
        borderRadius: "20px",
        enabled: true
      },
      "tools/settings.html": {
        width: "420px",
        position: "center"
      }
    }
  }
}
```

### Available panel settings

- `width`, `height`: outer iframe panel dimensions.
- `position`: `top-left`, `top-center`, `top-right`, `center-left`, `center-center`, `center-right`, `bottom-left`, `bottom-center`, or `bottom-right`. The older `center` value remains an alias for `center-center`.
- `offset`: fallback distance from both window axes.
- `offsetX`: optional left/right distance override.
- `offsetY`: optional top/bottom distance override.
- `margin`: standard CSS margin shorthand.
- `fixed`: `true` attaches the panel to the viewport; `false` positions it relative to the document.
- `zIndex`: outer panel stacking level.
- `borderRadius`: outer clipping radius.
- `boxShadow`: outer CSS shadow; use `"none"` to disable it.
- `movable`: when `false`, the drag control is hidden.
- `minimizable`: when `false`, the minimize control is hidden and saved minimized state is ignored.
- `resettable`: when `false`, the reset-position control is hidden.
- `resizable`: when `false`, edge and corner resizing is disabled.
- `closable`: when `false`, the close control is hidden and saved closed state is ignored.
- `enabled`: when `false`, the page remains in the build but is not inserted or listed.

All CSS dimensions accept values such as `px`, `rem`, `%`, `vw`, and `vh` where appropriate.

## Launcher behavior

The floating launcher lists all enabled inserted pages.

- A green dot means the panel is open.
- Hovering the green dot changes it to an X; clicking closes that panel.
- A plus means the panel is closed; clicking reopens it.
- Non-closable panels remain disabled with a green status dot.
- Closed state is stored in `storage.local` and synchronized across open tabs.
- Each panel has a CSS-drawn move control in its top-left corner. Drag that control to place the panel anywhere in the viewport; the exact position is saved and synchronized across existing and new tabs.
- The adjacent minimize control collapses the panel to its control bar and restores it when clicked again. Minimized state is also synchronized across tabs.
- The CSS-drawn circular-arrow control clears the panel's saved position and size, returning it to its configured placement across tabs.
- Drag any panel edge or corner to resize it like a desktop window. Its dimensions and adjusted position are saved and synchronized across tabs.
- Returning to a browser tab refreshes its panel state immediately, including position, minimized state, and open/closed state.
- The popup's **Restore inserted panels** button reopens all closable panels.

Set `launcher.enabled` to `false` to remove the floating launcher. Its `size`, `position`, `offset`, `offsetX`, `offsetY`, `margin`, `borderRadius`, `menuWidth`, and `menuMaxHeight` values are configurable.

## Popup

The toolbar popup is generated from `pages/popup/index.html` and configured in `public/manifest.json`:

```json
"action": {
  "default_popup": "popup/index.html",
  "default_icon": "rino256.png"
}
```

The current 256px icon is used directly. Exact 16, 32, 48, and 128px variants are still recommended before store publication.

## Browser and security notes

- The extension uses Manifest V3.
- Content scripts currently match all HTTP and HTTPS pages.
- Browser-protected pages such as `chrome://`, `edge://`, and privileged Firefox pages do not allow extension injection.
- Inserted pages cannot directly access the host website's DOM because they run in extension-origin iframes. Use a controlled content-script message bridge for page modifications.
- Do not use inline scripts, inline event handlers, `eval()`, or `new Function()`; Manifest V3 CSP blocks them.
- Keep extension JavaScript packaged locally.

## Build output

`www/` is generated and ignored by Git. Rebuild it rather than editing it directly:

```sh
npm run generate
```
