# claude-mods

Claude Code mods by JMThomas00. Install them inside Claude Code:

```
/plugin marketplace add JMThomas00/claude-mods
/plugin install omarchy-live-theme@jmthomas00
```

Mods run with your permissions (they are code, not sandboxed), so read them before installing. Each is small.

## omarchy-live-theme

Paints the Claude desktop app's Code tab in whatever [Omarchy](https://omarchy.org) theme is active, and follows theme
switches while a session is open (it checks every few seconds; a toast names the new theme).

- **Colors:** read from the active theme's `~/.local/state/omarchy/current/theme/colors.toml` and built into the app's
  full palette. If a theme's colors would fail the app's contrast floor, it retries with gentler settings until the
  app will paint it.
- **Backdrop:** one of eleven animated scenes (skyline, cosmos, launch, ridges, ink, waves, synth, geometric, embers,
  rain, grapes), matched to the style of each theme's own stock wallpapers and drawn in the colors those wallpapers
  use. A black and white theme gets a gray scene.
- **Options** (`/plugin configure omarchy-live-theme@jmthomas00`): turn the backdrop off, force one scene for every
  theme, or change how often it checks for a switch.

It works with any Omarchy theme, installed or not, because it only reads the active theme's colors. No theme is
bundled here. The table below is just which scene each theme gets; a theme not listed gets the skyline, in its own
colors.

### Themes it is tuned for

This is an unofficial companion: the scenes are original art, inspired by these themes' wallpapers, not copies of
them. Thank you to the theme authors.

| Theme | Scene | Source |
| --- | --- | --- |
| amekoji | skyline | [atif-1402/omarchy-amekoji-theme](https://github.com/atif-1402/omarchy-amekoji-theme) |
| aonagi | skyline | [OldJobobo/omarchy-aonagi-theme](https://github.com/OldJobobo/omarchy-aonagi-theme) |
| ash | embers | [bjarneo/omarchy-ash-theme](https://github.com/bjarneo/omarchy-ash-theme) |
| banish | embers | [HANCORE-linux/omarchy-banish-theme](https://github.com/HANCORE-linux/omarchy-banish-theme) |
| batou | skyline | [HANCORE-linux/omarchy-batou-theme](https://github.com/HANCORE-linux/omarchy-batou-theme) |
| blackgold | embers | [HANCORE-linux/omarchy-blackgold-theme](https://github.com/HANCORE-linux/omarchy-blackgold-theme) |
| blackmoney | embers | [HANCORE-linux/omarchy-blackmoney-theme](https://github.com/HANCORE-linux/omarchy-blackmoney-theme) |
| blackturq | waves | [HANCORE-linux/omarchy-blackturq-theme](https://github.com/HANCORE-linux/omarchy-blackturq-theme) |
| blue-hour | ridges | [erikrjohansson/omarchy-blue-hour-theme](https://github.com/erikrjohansson/omarchy-blue-hour-theme) |
| catppuccin | waves | ships with Omarchy |
| catppuccin-latte | waves | ships with Omarchy |
| city-783 | skyline | [OldJobobo/omarchy-city-783-theme](https://github.com/OldJobobo/omarchy-city-783-theme) |
| cobalt-dunes | waves | [erikrjohansson/omarchy-cobalt-dunes-theme](https://github.com/erikrjohansson/omarchy-cobalt-dunes-theme) |
| concord | grapes | [JMThomas00/omarchy-theme-concord](https://github.com/JMThomas00/omarchy-theme-concord) |
| cumulus | ridges | [erikrjohansson/omarchy-cumulus-theme](https://github.com/erikrjohansson/omarchy-cumulus-theme) |
| demon | embers | [HANCORE-linux/omarchy-demon-theme](https://github.com/HANCORE-linux/omarchy-demon-theme) |
| dos-moos | geometric | [HANCORE-linux/omarchy-dos-moos-theme](https://github.com/HANCORE-linux/omarchy-dos-moos-theme) |
| dracula | ridges | [catlee/omarchy-dracula-theme](https://github.com/catlee/omarchy-dracula-theme) |
| dracula-reborn | ridges | [OldJobobo/omarchy-dracula-reborn-theme](https://github.com/OldJobobo/omarchy-dracula-reborn-theme) |
| ember-dunes | waves | [erikrjohansson/omarchy-ember-dunes-theme](https://github.com/erikrjohansson/omarchy-ember-dunes-theme) |
| ethereal | cosmos | ships with Omarchy |
| ethereal-nebula | cosmos | [bjarneo/omarchy-ethereal-nebula-theme](https://github.com/bjarneo/omarchy-ethereal-nebula-theme) |
| everforest | ridges | ships with Omarchy |
| flexoki-light | geometric | ships with Omarchy |
| greek-noir | embers | [HANCORE-linux/omarchy-greek-noir-theme](https://github.com/HANCORE-linux/omarchy-greek-noir-theme) |
| gruvbox | ridges | ships with Omarchy |
| hackerman | synth | ships with Omarchy |
| harbor | launch | [HANCORE-linux/omarchy-harbor-theme](https://github.com/HANCORE-linux/omarchy-harbor-theme) |
| harbordark | launch | [HANCORE-linux/omarchy-harbordark-theme](https://github.com/HANCORE-linux/omarchy-harbordark-theme) |
| hex | geometric | [OldJobobo/omarchy-hex-theme](https://github.com/OldJobobo/omarchy-hex-theme) |
| inkypinky | skyline | [HANCORE-linux/omarchy-inkypinky-theme](https://github.com/HANCORE-linux/omarchy-inkypinky-theme) |
| jade-horse | ink | ships with Omarchy |
| kanagawa | waves | ships with Omarchy |
| kanso | ridges | [HANCORE-linux/omarchy-kanso-theme](https://github.com/HANCORE-linux/omarchy-kanso-theme) |
| labra | embers | [HANCORE-linux/omarchy-labra-theme](https://github.com/HANCORE-linux/omarchy-labra-theme) |
| last-horizon | embers | ships with Omarchy |
| lumon | geometric | ships with Omarchy |
| lupine | ink | ships with Omarchy |
| matrix | rain | [bjarneo/omarchy-matrix-theme](https://github.com/bjarneo/omarchy-matrix-theme) |
| matte-black | waves | ships with Omarchy |
| mechanoonna | ink | [HANCORE-linux/omarchy-mechanoonna-theme](https://github.com/HANCORE-linux/omarchy-mechanoonna-theme) |
| miasma | embers | ships with Omarchy |
| midnight-slate-dark-mosaic | geometric | [erikrjohansson/omarchy-midnight-slate-dark-mosaic-theme](https://github.com/erikrjohansson/omarchy-midnight-slate-dark-mosaic-theme) |
| monolith | ridges | [OldJobobo/omarchy-monolith-theme](https://github.com/OldJobobo/omarchy-monolith-theme) |
| moodpeak | cosmos | [HANCORE-linux/omarchy-moodpeak-theme](https://github.com/HANCORE-linux/omarchy-moodpeak-theme) |
| motion-blur | skyline | [erikrjohansson/omarchy-motion-blur-theme](https://github.com/erikrjohansson/omarchy-motion-blur-theme) |
| nord | cosmos | ships with Omarchy |
| norrsken-amber | cosmos | [erikrjohansson/omarchy-norrsken-amber-theme](https://github.com/erikrjohansson/omarchy-norrsken-amber-theme) |
| oxford | synth | [HANCORE-linux/omarchy-oxford-theme](https://github.com/HANCORE-linux/omarchy-oxford-theme) |
| oxocarbon | geometric | [HANCORE-linux/omarchy-oxocarbon-theme](https://github.com/HANCORE-linux/omarchy-oxocarbon-theme) |
| retro-82 | synth | ships with Omarchy |
| ristretto | synth | ships with Omarchy |
| rose-pine | geometric | ships with Omarchy |
| rose-pine-dark | cosmos | [guilhermetk/omarchy-rose-pine-dark](https://github.com/guilhermetk/omarchy-rose-pine-dark) |
| roseofdune | waves | [HANCORE-linux/omarchy-roseofdune-theme](https://github.com/HANCORE-linux/omarchy-roseofdune-theme) |
| ryu | ink | [HANCORE-linux/omarchy-ryu-theme](https://github.com/HANCORE-linux/omarchy-ryu-theme) |
| saga | waves | [HANCORE-linux/omarchy-saga-theme](https://github.com/HANCORE-linux/omarchy-saga-theme) |
| sapphire | cosmos | [HANCORE-linux/omarchy-sapphire-theme](https://github.com/HANCORE-linux/omarchy-sapphire-theme) |
| shadesofjade | ink | [HANCORE-linux/omarchy-shadesofjade-theme](https://github.com/HANCORE-linux/omarchy-shadesofjade-theme) |
| solitude | ink | ships with Omarchy |
| starship | launch | ships with Omarchy |
| starship-to-orbit | launch | [erikrjohansson/omarchy-starship-to-orbit-theme](https://github.com/erikrjohansson/omarchy-starship-to-orbit-theme) |
| sunset-drive | synth | [tahayvr/omarchy-sunset-drive-theme](https://github.com/tahayvr/omarchy-sunset-drive-theme) |
| thegreek | ink | [HANCORE-linux/omarchy-thegreek-theme](https://github.com/HANCORE-linux/omarchy-thegreek-theme) |
| tokyo-night | launch | ships with Omarchy |
| vantablack | geometric | ships with Omarchy |
| velvetnight | embers | [HANCORE-linux/omarchy-velvetnight-theme](https://github.com/HANCORE-linux/omarchy-velvetnight-theme) |
| white | geometric | ships with Omarchy |
| whitegold | ridges | [HANCORE-linux/omarchy-whitegold-theme](https://github.com/HANCORE-linux/omarchy-whitegold-theme) |

### Credits

- The skyline scene is adapted from [starryhope/omarchy-mods](https://github.com/starryhope/omarchy-mods)'
  `omarchy-theme` (MIT, see `plugins/omarchy-live-theme/LICENSE.starryhope`).
- `hooks/make-colors.js` is the color builder Claude Code's mod tools ship for themes, included unchanged as they
  direct.

MIT licensed (see `LICENSE`).
