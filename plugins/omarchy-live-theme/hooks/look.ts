import type { ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { mix, type Palette } from './palette'

export const SCENE = 'omarchy-live-skyline'

/** One try at the app's colors: surfaces stepped from the background toward the text, text softened toward the background. */
function attempt(name: string, p: Palette, step: number, mutedMix: number, withRoles: 'all' | 'accent' | 'none', deepen: number, lift = 0, sink = 0) {
  // Sink darkens (dark) or lightens (light) the page itself, for themes whose ground is too close to mid-tone.
  const bg = sink > 0 ? mix(p.background, p.mode === 'dark' ? '#000000' : '#ffffff', sink) : p.background
  // Lift pushes the text toward pure white (dark) or black (light) for themes whose text is soft.
  const fg = lift > 0 ? mix(p.strong, p.mode === 'dark' ? '#ffffff' : '#000000', lift) : p.strong
  // A bright accent or role lightens the fills under text; deepening pulls them toward the page, hue kept.
  const role = (hex: string) => (deepen > 0 ? mix(hex, p.mode === 'dark' ? bg : fg, deepen) : hex)
  const text = {
    'text-primary': fg,
    'text-secondary': mix(fg, bg, 0.15),
    'text-muted': mix(fg, bg, mutedMix),
  }
  const roles =
    withRoles === 'none'
      ? undefined
      : withRoles === 'accent'
        ? { accent: role(p.accent) }
        : { accent: role(p.accent), danger: role(p.red), success: role(p.green), warning: role(p.yellow), pro: role(p.magenta) }

  const mode =
    p.mode === 'dark'
      ? {
          gray: {
            anchors: {
              'surface-0': bg,
              'surface-1': mix(bg, fg, step),
              'surface-2': mix(bg, fg, step * 2),
              'surface-3': mix(bg, fg, step * 3),
              ...text,
            },
          },
        }
      : {
          gray: {
            anchors: {
              // In light mode the page is the darkest surface and cards sit lighter; 2 and 3 must match.
              'surface-0': mix(bg, fg, step * 2),
              'surface-1': mix(bg, fg, step),
              'surface-2': bg,
              'surface-3': bg,
              ...text,
            },
          },
        }

  return makeColors({
    label: 'Omarchy · ' + name,
    only: p.mode,
    ...(roles === undefined ? {} : { roles }),
    ...(p.mode === 'dark' ? { dark: mode } : { light: mode }),
  })
}

const UNPAINTED = "Desktop won't paint"

/**
 * The whole look for a theme. Tries gentler settings until Desktop will paint it:
 * first the theme's own colors, then stronger muted text and tighter surfaces, then fewer roles.
 */
export function buildLook(name: string, p: Palette, scene: boolean): { look: ThemeSetArgs; problems: string[]; fallback: number } {
  const tries: Array<[number, number, 'all' | 'accent' | 'none', number, number, number?]> = [
    [0.035, 0.38, 'all', 0, 0],
    [0.025, 0.3, 'all', 0, 0],
    [0.035, 0.38, 'all', 0.25, 0],
    [0.025, 0.3, 'all', 0.4, 0],
    [0.025, 0.3, 'all', 0.25, 0.3],
    [0.02, 0.25, 'all', 0.55, 0.3],
    [0.02, 0.25, 'accent', 0.4, 0.3],
    [0.025, 0.3, 'all', 0, 0.3, 0.3],
    [0.02, 0.25, 'all', 0.25, 0.3, 0.45],
    [0.02, 0.22, 'none', 0, 0.5, 0.45],
  ]
  let last: string[] = []
  for (let index = 0; index < tries.length; index += 1) {
    const [step, muted, roles, deepen, lift, sink] = tries[index]!
    let built: ReturnType<typeof makeColors>
    try {
      built = attempt(name, p, step, muted, roles, deepen, lift, sink ?? 0)
    } catch (error) {
      last = [String(error)]
      continue
    }
    last = built.problems
    if (built.problems.some(line => line.startsWith(UNPAINTED))) continue
    const look: ThemeSetArgs = {
      colors: built.theme,
      ...(scene
        ? { backdrop: { scene: SCENE, glass: { blur: 14, tint: p.background, opacity: p.mode === 'dark' ? 0.46 : 0.58 } } }
        : {}),
    }
    return { look, problems: built.problems, fallback: index }
  }
  return { look: {}, problems: last, fallback: -1 }
}
