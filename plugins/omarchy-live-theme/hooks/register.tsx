import type { Register } from 'claude-code'

import { buildLook } from './look'
import { parseToml, readPalette, sceneColors, type Palette } from './palette'
import { drawScene, SCENE_ALT, slug, styleFor, type SceneStyle } from './scenes'
import { WALLPAPER_COLORS } from './wallpaper-colors'

// Follows the active Omarchy theme: reads ~/.local/state/omarchy/current/theme/colors.toml at
// session start, paints the desktop app from it, and checks again every few seconds so a
// `omarchy theme set` repaints the open session too.

let palette: Palette | undefined
let signature = ''
let svg: string | undefined
let style: SceneStyle = 'skyline'
let themeSlug = ''
let busy = false

export const register: Register = (on, options) => {
  const showScene = options.scene !== false
  const pollMs = Math.max(2, Number(options.poll_seconds ?? 5)) * 1000
  const forced = typeof options.scene_style === 'string' && options.scene_style !== 'auto' ? options.scene_style : undefined

  on('session.start', async ($, e, next) => {
    const home = (await $.env.get('HOME')) ?? ''
    const dir = home + '/.local/state/omarchy/current'

    const apply = async (quiet: boolean): Promise<void> => {
      if (busy) return
      busy = true
      try {
        const [toml, name] = await Promise.all([
          $.fs.read(dir + '/theme/colors.toml'),
          $.fs.exists(dir + '/theme.name').then(has => (has ? $.fs.read(dir + '/theme.name') : 'Omarchy')),
        ])
        const nextSignature = name.trim() + '\n' + toml
        if (nextSignature === signature) return
        const read = readPalette(parseToml(toml))
        if (read === undefined) {
          if (!quiet) $.ui.status('Omarchy theme: no background/foreground in colors.toml')
          return
        }
        const label = name.trim() || 'Omarchy'
        const { look, problems, fallback } = buildLook(label, read, showScene)
        if (fallback < 0) {
          $.ui.toast('Omarchy theme "' + label + '" will not paint: ' + (problems[0] ?? 'unknown'))
          signature = nextSignature
          return
        }
        signature = nextSignature
        palette = read
        style = styleFor(label, forced)
        themeSlug = slug(label)
        svg = undefined
        const set = await $.theme.set(look)
        if (set.isDrawn) {
          $.ui.invalidate('ui.render')
          if (quiet) $.ui.toast('Theme now follows Omarchy: ' + label + ' (' + style + ')')
        } else if (!quiet) {
          $.ui.status(set.reason)
        }
      } catch (error) {
        if (!quiet) $.ui.status('Omarchy theme: ' + String(error))
      } finally {
        busy = false
      }
    }

    signature = ''
    await apply(false)
    $.clock.every(pollMs, () => {
      void apply(true)
    })

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || palette === undefined || !showScene) {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)
    svg ??= drawScene(style, sceneColors(palette, WALLPAPER_COLORS[themeSlug]))

    return <Svg source={svg} alt={SCENE_ALT[style]} isInteractive />
  })
}
