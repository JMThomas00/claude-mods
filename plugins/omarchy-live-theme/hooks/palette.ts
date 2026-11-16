// Reads an Omarchy colors.toml and turns it into the few colors a look needs.
// Pure functions only, so the tests can feed it any theme's file.

export type Hex = string

/** The Omarchy theme, reduced to what the look and the scene use. */
export type Palette = {
  mode: 'dark' | 'light'
  background: Hex
  foreground: Hex
  /** The theme's strongest text: bright_foreground or light_foreground where those read better than foreground. */
  strong: Hex
  accent: Hex
  red: Hex
  green: Hex
  yellow: Hex
  orange: Hex
  blue: Hex
  magenta: Hex
  cyan: Hex
  /** Every non-surface color in colors.toml, accent and brights included. */
  swatches: Hex[]
}

const HEX = /^#[0-9a-fA-F]{6}$/

/** `key = "value"` lines of a flat TOML file. Comments, tables and non-strings are skipped. */
export function parseToml(text: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const raw of text.split('\n')) {
    const line = raw.trim()
    if (line === '' || line.startsWith('#') || line.startsWith('[')) continue
    const match = /^([A-Za-z0-9_]+)\s*=\s*"([^"]*)"/.exec(line)
    if (match !== null) out[match[1]!] = match[2]!
  }
  return out
}

function rgb(hex: Hex): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function toHex([r, g, b]: [number, number, number]): Hex {
  const part = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')
  return '#' + part(r) + part(g) + part(b)
}

/** `amount` of the way from `from` to `to`. */
export function mix(from: Hex, to: Hex, amount: number): Hex {
  const a = rgb(from)
  const b = rgb(to)
  return toHex([a[0] + (b[0] - a[0]) * amount, a[1] + (b[1] - a[1]) * amount, a[2] + (b[2] - a[2]) * amount])
}

/** Relative luminance, 0 to 1. */
export function luminance(hex: Hex): number {
  const [r, g, b] = rgb(hex).map(v => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  }) as [number, number, number]
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrast(a: Hex, b: Hex): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number]
  return (hi + 0.05) / (lo + 0.05)
}

/** Hue in degrees and saturation 0 to 1. */
export function hueSat(hex: Hex): { hue: number; sat: number } {
  const [r, g, b] = rgb(hex).map(v => v / 255) as [number, number, number]
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  if (d === 0) return { hue: 0, sat: 0 }
  const light = (max + min) / 2
  const sat = d / (1 - Math.abs(2 * light - 1))
  let hue = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4
  hue *= 60
  return { hue: hue < 0 ? hue + 360 : hue, sat }
}

function hueGap(a: Hex, b: Hex): number {
  const d = Math.abs(hueSat(a).hue - hueSat(b).hue) % 360
  return d > 180 ? 360 - d : d
}

/**
 * The palette from a colors.toml's keys. Omarchy v4 themes name their colors
 * (`red`, `blue`, `mode`); older ones carry only `color0`–`color15`, so those fill in.
 */
export function readPalette(keys: Record<string, string>): Palette | undefined {
  const pick = (...names: string[]): Hex | undefined => {
    for (const name of names) {
      const value = keys[name]
      if (value !== undefined && HEX.test(value)) return value.toLowerCase()
    }
    return undefined
  }
  const background = pick('background', 'color0')
  const foreground = pick('foreground', 'color15', 'color7')
  if (background === undefined || foreground === undefined) return undefined

  const mode = keys.mode === 'light' || keys.mode === 'dark' ? keys.mode : luminance(background) > 0.4 ? 'light' : 'dark'
  const red = pick('red', 'color1') ?? '#e05561'
  const green = pick('green', 'color2') ?? '#59a869'
  const yellow = pick('yellow', 'color3') ?? '#d6a644'
  const blue = pick('blue', 'color4') ?? '#5c8fd6'
  const magenta = pick('magenta', 'color5') ?? '#b46bd6'
  const cyan = pick('cyan', 'color6') ?? '#4fb3bf'
  const orange = pick('orange') ?? mix(yellow, red, 0.45)
  const accent = pick('accent', 'color4') ?? blue

  const strong = [pick('bright_foreground'), pick('light_foreground'), foreground]
    .filter((c): c is Hex => c !== undefined)
    .reduce((best, c) => (contrast(c, background) > contrast(best, background) ? c : best), foreground)

  // Every color the theme defines, for snapping a wallpaper's hue to the theme's own nearest color.
  const surfaces = /background|foreground|cursor|selection/
  const swatches = Object.entries(keys)
    .filter(([key, value]) => HEX.test(value) && !surfaces.test(key))
    .map(([, value]) => value.toLowerCase())

  return { mode, background, foreground, strong, accent, red, green, yellow, orange, blue, magenta, cyan, swatches }
}

/** What a theme's own stock wallpapers look like: how colorful (0 = black and white) and their dominant hues. */
export type WallpaperColors = { chroma: number; hues: Hex[] }

/** The same hue and saturation, `by` lighter (or darker when negative), in HSL. */
function shiftLightness(hex: Hex, by: number): Hex {
  const [r, g, b] = rgb(hex).map(v => v / 255) as [number, number, number]
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = Math.max(0, Math.min(1, (max + min) / 2 + by))
  const { hue, sat } = hueSat(hex)
  const c = (1 - Math.abs(2 * l - 1)) * sat
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1))
  const m = l - c / 2
  const [r1, g1, b1] =
    hue < 60 ? [c, x, 0] : hue < 120 ? [x, c, 0] : hue < 180 ? [0, c, x] : hue < 240 ? [0, x, c] : hue < 300 ? [x, 0, c] : [c, 0, x]
  return toHex([(r1 + m) * 255, (g1 + m) * 255, (b1 + m) * 255])
}

/** The same lightness with no color. */
function gray(hex: Hex): Hex {
  const [r, g, b] = rgb(hex)
  const y = 0.299 * r + 0.587 * g + 0.114 * b
  return toHex([y, y, y])
}

/** The scene's colors: a second hue far from the accent, so the halos and washes have two. */
export type SceneColors = {
  mode: 'dark' | 'light'
  ground: Hex
  ink: Hex
  star: Hex
  shade: Hex
  primary: Hex
  secondary: Hex
  warm: Hex
  warmer: Hex
  beacon: Hex
}

/**
 * The scene's colors. With the theme's wallpaper measurements, the scene uses the hues its wallpapers
 * use (each snapped to the theme's nearest own color) and only as much color as they have: a black and
 * white theme gets a gray scene. Without them, the accent plus a second hue far from it.
 */
export function sceneColors(p: Palette, wallpaper?: WallpaperColors): SceneColors {
  const base = {
    mode: p.mode,
    ground: p.background,
    ink: mix(p.foreground, p.background, 0.15),
    star: p.foreground,
    shade: p.mode === 'dark' ? mix(p.background, '#000000', 0.6) : mix(p.background, p.foreground, 0.5),
  }

  if (wallpaper === undefined) {
    const candidates = [p.magenta, p.blue, p.cyan, p.orange, p.green]
    const secondary = candidates.reduce((best, c) => (hueGap(c, p.accent) > hueGap(best, p.accent) && hueSat(c).sat > 0.2 ? c : best), candidates[0]!)
    return { ...base, primary: p.accent, secondary, warm: p.yellow, warmer: p.orange, beacon: p.red }
  }

  // How much color to allow: none for black and white wallpapers, full from about 7% chroma.
  const amount = Math.max(0, Math.min(1, (wallpaper.chroma - 0.006) / 0.06))

  // A wallpaper hue becomes the theme's own nearest color when one is within 35 degrees.
  const chromatic = p.swatches.filter(c => hueSat(c).sat > 0.18)
  const snap = (hue: Hex): Hex => {
    const nearest = chromatic.reduce<Hex | undefined>((best, c) => (best === undefined || hueGap(c, hue) < hueGap(best, hue) ? c : best), undefined)
    return nearest !== undefined && hueGap(nearest, hue) <= 35 ? nearest : hue
  }
  // Distinct colors only: two wallpaper hues can snap to the same theme color.
  const hues = (wallpaper.hues.length > 0 ? wallpaper.hues.map(snap) : [p.accent]).filter((c, i, all) => all.indexOf(c) === i)
  const first = hues[0]!
  const second = hues[1] ?? mix(first, p.foreground, 0.35)
  const third = hues[2] ?? mix(first, second, 0.5)

  // Pull each toward gray by how little color the wallpapers have, then make sure it reads on the ground.
  const tone = (hex: Hex): Hex => {
    let out = mix(gray(hex), hex, amount)
    // Lighten (or darken, on a light ground) keeping the hue, so a deep violet stays violet.
    const toward = p.mode === 'dark' ? 1 : -1
    for (let i = 0; i < 8 && contrast(out, p.background) < 2.4; i += 1) out = shiftLightness(out, 0.07 * toward)
    return out
  }

  return {
    ...base,
    primary: tone(first),
    secondary: tone(second),
    warm: tone(third),
    warmer: tone(mix(first, third, 0.5)),
    beacon: tone(amount >= 1 && wallpaper.hues.length > 1 ? p.red : first),
  }
}
