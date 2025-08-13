# SOrt-line Game (Config-Driven)

A tiny demo showing a conveyor “sort-line” with pallets and cases, driven by `game.config.json`. Change numbers, refresh, done.

## Run
- Open `index.html` directly, or use a simple static server.
- For quick dev: `python -m http.server 8080` then visit http://localhost:8080

## Edit without code
- Open `game.config.json`, tweak values (line width, speeds, sizes, trickle offset, destinations, levels).
- Or open the in-game Config Panel (gear icon) and move sliders; click **Save Preset** to `localStorage`.

## Deploy on GitHub Pages
- Settings → Pages → Deploy from branch → `main` / root.
- Your site becomes `https://<your-username>.github.io/<repo-name>/`.
