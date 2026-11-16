# omarchy-live-theme

A Claude Code mod that paints the Claude desktop app's Code tab in whatever Omarchy theme is active, and follows theme switches while a session is open.

- At session start it reads `~/.local/state/omarchy/current/theme/colors.toml` (Omarchy v4 named colors, or the older `color0`–`color15` keys) and builds the app's ~100 colors from it with the design system's `make-colors.js`.
- Every few seconds (option `poll_seconds`, default 5) it checks the theme again; after `omarchy theme set` the open session repaints and a toast names the new theme.
- If a theme's colors would fail the app's contrast floor, it retries with gentler settings (softer surfaces, deeper role fills, brighter text, a slightly darker page) until the app will paint it. All 69 themes it was tested on paint.
- The backdrop changes with the theme: one of eleven animated scenes (skyline, cosmos, launch, ridges, ink, waves, synth, geometric, embers, rain, and grapes for the Concord theme), chosen to match the style of the theme's own stock wallpapers. Its colors follow those wallpapers too: the hues they use, snapped to the theme's own nearest colors, and only as much color as they have, so a black and white theme gets a gray scene (measurements in `hooks/wallpaper-colors.ts`). The skyline is adapted from starryhope/omarchy-mods' `omarchy-theme` (MIT, see `LICENSE.starryhope`). Force one scene for every theme with the `scene_style` option, or turn the backdrop off with `scene`.

Desktop app only: the terminal is themed by Omarchy's own `claude.json`.
