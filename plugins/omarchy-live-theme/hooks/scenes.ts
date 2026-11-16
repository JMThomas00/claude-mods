// Animated backdrops, one per wallpaper style found across Omarchy's themes.
// Each scene is original vector art drawn from the theme's colors: it takes the
// spirit of a theme's stock wallpapers (ink painting, a launch at dusk, a hex
// field...) without copying any of them. All share one 1600x1000 sheet, sliced
// to fill any window, with the art kept to the margins and faint behind the
// reading column. CSS animation only: the frame runs no script.

import { mix, type SceneColors } from './palette'
import { omarchySvg } from './scene'

export type SceneStyle =
  | 'skyline'
  | 'cosmos'
  | 'launch'
  | 'ridges'
  | 'ink'
  | 'waves'
  | 'synth'
  | 'geometric'
  | 'embers'
  | 'rain'
  | 'grapes'

export const SCENE_STYLES: readonly SceneStyle[] = ['skyline', 'cosmos', 'launch', 'ridges', 'ink', 'waves', 'synth', 'geometric', 'embers', 'rain', 'grapes']

/** Theme slug (the theme folder's name) to the scene its stock wallpapers suggest. */
export const THEME_SCENES: Record<string, SceneStyle> = {
  // Night cities, streets and stations
  amekoji: 'skyline', aonagi: 'skyline', 'city-783': 'skyline', batou: 'skyline', 'motion-blur': 'skyline',
  inkypinky: 'skyline',
  // Nebulae, planets, auroras
  ethereal: 'cosmos', 'ethereal-nebula': 'cosmos', sapphire: 'cosmos', 'rose-pine-dark': 'cosmos',
  moodpeak: 'cosmos', 'norrsken-amber': 'cosmos', nord: 'cosmos',
  // Rockets in clouds of exhaust
  starship: 'launch', 'starship-to-orbit': 'launch', 'tokyo-night': 'launch', harbor: 'launch', harbordark: 'launch',
  // Layered hills, forests, mist and a moon
  everforest: 'ridges', 'blue-hour': 'ridges', dracula: 'ridges', 'dracula-reborn': 'ridges', kanso: 'ridges',
  monolith: 'ridges', cumulus: 'ridges', whitegold: 'ridges', gruvbox: 'ridges',
  // Sumi-e: brush mountains, dragons, koi, sketches
  'jade-horse': 'ink', ryu: 'ink', thegreek: 'ink', shadesofjade: 'ink', mechanoonna: 'ink', solitude: 'ink',
  lupine: 'ink',
  // Flowing lines, seas and dunes
  kanagawa: 'waves', catppuccin: 'waves', 'catppuccin-latte': 'waves', blackturq: 'waves', 'matte-black': 'waves',
  saga: 'waves', 'cobalt-dunes': 'waves', 'ember-dunes': 'waves', roseofdune: 'waves',
  // Retro sun, grids, 70s stripes, vinyl
  'sunset-drive': 'synth', hackerman: 'synth', ristretto: 'synth', 'retro-82': 'synth', oxford: 'synth',
  // Hex cells, cubes, dots, logos on flat grounds
  hex: 'geometric', oxocarbon: 'geometric', vantablack: 'geometric', white: 'geometric', lumon: 'geometric',
  'midnight-slate-dark-mosaic': 'geometric', 'rose-pine': 'geometric', 'flexoki-light': 'geometric', 'dos-moos': 'geometric',
  // Dark figures, smoke, embers
  ash: 'embers', banish: 'embers', demon: 'embers', labra: 'embers', blackgold: 'embers', blackmoney: 'embers',
  'greek-noir': 'embers', miasma: 'embers', 'last-horizon': 'embers', velvetnight: 'embers',
  // Falling code
  matrix: 'rain',
  // concordchat.cc's hero: grapes rising through a violet glow
  concord: 'grapes',
}

/** `omarchy theme set` names ("Tokyo Night") and folder names ("tokyo-night") to one slug. */
export function slug(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function styleFor(themeName: string, override?: string): SceneStyle {
  if (override !== undefined && (SCENE_STYLES as readonly string[]).includes(override)) return override as SceneStyle
  return THEME_SCENES[slug(themeName)] ?? 'skyline'
}

// ---------------------------------------------------------------------------
// Shared pieces

const W = 1600
const H = 1000

function r(value: number): number {
  return Math.round(value * 10) / 10
}

/** Deterministic stand-in for a random number, so a theme always draws the same. */
function hash(seed: number): number {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return value - Math.floor(value)
}

/** A point in the margins: left or right band, never the reading column. */
function marginX(seed: number, inner = 0.3): number {
  const side = hash(seed) > 0.5
  const t = hash(seed + 1) * inner
  return r(side ? W * t : W * (1 - t))
}

function radial(id: string, color: string, strength: number): string {
  return `<radialGradient id="${id}"><stop offset="0" stop-color="${color}" stop-opacity="${strength}"/><stop offset=".45" stop-color="${color}" stop-opacity="${r(strength * 0.5)}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`
}

function columnRamp(inside: number): string {
  return `<stop offset="0" stop-color="#fff"/><stop offset=".12" stop-color="#fff"/><stop offset=".33" stop-color="#fff" stop-opacity="${inside}"/><stop offset=".67" stop-color="#fff" stop-opacity="${inside}"/><stop offset=".88" stop-color="#fff"/><stop offset="1" stop-color="#fff"/>`
}

/** Ridge line across the sheet: smooth noise from a few sines, as polygon points down to the foot. */
function ridge(seed: number, base: number, height: number, roughness: number, foot = H): string {
  let d = `M-20 ${foot}`
  for (let x = -20; x <= W + 20; x += 20) {
    const t = x / W
    const n =
      Math.sin(t * 6.3 + seed) * 0.5 +
      Math.sin(t * 13.7 + seed * 2.1) * 0.3 * roughness +
      Math.sin(t * 31.1 + seed * 3.7) * 0.15 * roughness +
      Math.sin(t * 71.3 + seed * 5.3) * 0.05 * roughness
    // Taller at the margins, low behind the reading column.
    const edge = Math.pow(Math.abs(t - 0.5) * 2, 1.4)
    const y = base - height * (0.35 + 0.65 * edge) * (0.6 + 0.4 * n)
    d += `L${x} ${r(y)}`
  }
  return d + `L${W + 20} ${foot}Z`
}

function stars(c: SceneColors, count: number, top: number, bottom: number, seed = 1): string {
  let still = ''
  let twinkle = ''
  for (let i = 0; i < count; i += 1) {
    const x = r(hash(seed + i * 3) * W)
    const y = r(top + hash(seed + i * 3 + 1) * (bottom - top))
    const radius = hash(seed + i * 3 + 2) > 0.85 ? 1.4 : 0.8
    if (i % 5 === 0) {
      twinkle += `<circle class="tw" style="animation-duration:${6 + (i % 6) * 1.5}s;animation-delay:-${i % 9}s" cx="${x}" cy="${y}" r="${radius}" fill="${c.star}"/>`
    } else {
      still += `M${x - radius} ${y}a${radius} ${radius} 0 1 0 ${radius * 2} 0a${radius} ${radius} 0 1 0 ${-radius * 2} 0`
    }
  }
  return `<path d="${still}" fill="${c.star}" opacity=".35"/>${twinkle}`
}

const BASE_STYLE = `
.tw{animation:tw 8s ease-in-out infinite}
@keyframes tw{0%,100%{opacity:.12}50%{opacity:.8}}
.drift{animation:drift 60s ease-in-out infinite alternate}
@keyframes drift{from{transform:translateX(-40px)}to{transform:translateX(40px)}}
.breathe{animation:breathe 9s ease-in-out infinite}
@keyframes breathe{0%,100%{opacity:.45}50%{opacity:1}}
@media (prefers-reduced-motion: reduce){*{animation:none!important}}`

/** Wraps a scene: ground, two soft washes in the corners, the art masked faint behind the column. */
function sheet(c: SceneColors, art: { defs?: string; style?: string; body: string; under?: string; columnFade?: number }): string {
  const light = c.mode === 'light'
  const washA = light ? 0.22 : 0.4
  const washB = light ? 0.16 : 0.26
  const defs = `${radial('wA', c.secondary, washA)}${radial('wB', c.primary, washB)}
<linearGradient id="colRamp">${columnRamp(art.columnFade ?? 0.3)}</linearGradient>
<mask id="col" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="url(#colRamp)"/></mask>
${art.defs ?? ''}`
  const washes = `<ellipse cx="-40" cy="-40" rx="720" ry="520" fill="url(#wA)"/><ellipse cx="${W + 60}" cy="-60" rx="640" ry="460" fill="url(#wA)"/><ellipse cx="-80" cy="${H + 80}" rx="640" ry="460" fill="url(#wB)"/><ellipse cx="${W + 80}" cy="${H + 80}" rx="640" ry="460" fill="url(#wB)"/>`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"><style>${BASE_STYLE}${art.style ?? ''}</style><defs>${defs}</defs>
<rect width="${W}" height="${H}" fill="${c.ground}"/>${art.under ?? ''}${washes}
<g mask="url(#col)">${art.body}</g></svg>`
}

// ---------------------------------------------------------------------------
// Scenes

/** Nebula clouds drifting in the upper corners, a ringed planet, stars and a shooting star now and then. */
function cosmos(c: SceneColors): string {
  const clouds = [
    [180, 220, 420, 230, c.secondary, 0.5, 70],
    [360, 120, 300, 160, c.primary, 0.35, 90],
    [1380, 260, 440, 220, c.primary, 0.45, 80],
    [1240, 140, 280, 150, c.secondary, 0.4, 100],
    [120, 760, 320, 160, c.primary, 0.22, 110],
    [1500, 820, 360, 170, c.secondary, 0.25, 95],
  ] as const
  const nebula = clouds
    .map(([x, y, rx, ry, col, op, dur], i) => `<ellipse class="neb" style="animation-duration:${dur}s;animation-delay:-${i * 13}s" cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${col}" opacity="${op}" filter="url(#soft)"/>`)
    .join('')
  const planet = `<g transform="translate(1370 330)"><circle r="62" fill="url(#planet)"/><ellipse rx="118" ry="22" fill="none" stroke="${c.ink}" stroke-opacity=".45" stroke-width="2" transform="rotate(-18)"/><path d="M-62 0a62 62 0 0 0 124 0" fill="url(#planet)" transform="rotate(-18)"/></g>`
  const shoot = [0, 1, 2]
    .map(i => `<line class="shoot" style="animation-delay:-${i * 7 + 2}s" x1="${200 + i * 520}" y1="${80 + i * 50}" x2="${80 + i * 520}" y2="${150 + i * 50}" stroke="${c.star}" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="140" stroke-dashoffset="140"/>`)
    .join('')
  return sheet(c, {
    defs: `<filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="46"/></filter>
<radialGradient id="planet" cx=".35" cy=".35"><stop offset="0" stop-color="${mix(c.primary, c.star, 0.35)}"/><stop offset=".7" stop-color="${mix(c.primary, c.ground, 0.4)}"/><stop offset="1" stop-color="${mix(c.secondary, c.ground, 0.6)}"/></radialGradient>`,
    style: `.neb{animation:neb 80s ease-in-out infinite alternate}@keyframes neb{0%{transform:translate(-30px,10px) scale(.95)}100%{transform:translate(30px,-12px) scale(1.06)}}
.shoot{animation:shoot 21s linear infinite}@keyframes shoot{0%,88%{stroke-dashoffset:140;opacity:0}90%{opacity:.9}96%{stroke-dashoffset:-140;opacity:0}100%{stroke-dashoffset:-140;opacity:0}}`,
    body: `${nebula}${stars(c, 150, 10, 990, 3)}${planet}${shoot}`,
    columnFade: 0.25,
  })
}

/** A rocket climbing out of billowing exhaust at dusk, at the left margin; a launch tower beside it. */
function launch(c: SceneColors): string {
  const horizon = 880
  let puffs = ''
  for (let i = 0; i < 26; i += 1) {
    const side = i % 2 === 0 ? -1 : 1
    const spread = hash(i + 7) * 260
    const x = r(300 + side * spread)
    const y = r(horizon - 20 - hash(i + 11) * 150 * (1 - spread / 320))
    const rad = r(46 + hash(i + 13) * 70)
    const tone = mix(c.star, c.warmer, hash(i + 17) * 0.55)
    puffs += `<circle class="puff" style="transform-origin:${x}px ${y}px;animation-duration:${7 + hash(i + 19) * 6}s;animation-delay:-${r(hash(i + 23) * 8)}s" cx="${x}" cy="${y}" r="${rad}" fill="${tone}" opacity="${r(0.45 + hash(i + 29) * 0.35)}"/>`
  }
  const rocket = `<g class="rocket"><path d="M300 450c-14 22-18 60-18 120v170h36V570c0-60-4-98-18-120z" fill="${mix(c.ink, c.ground, 0.15)}"/><path d="M282 700l-22 46h22zM318 700l22 46h-22z" fill="${mix(c.ink, c.ground, 0.35)}"/><path d="M287 742h26l-6 30h-14z" fill="${c.warm}"/><ellipse class="flame" cx="300" cy="790" rx="16" ry="44" fill="url(#flame)"/></g>`
  const tower = `<path d="M372 ${horizon}V400h26V${horizon}M372 440h26M372 500h26M372 560h26M372 620h26M372 680h26M372 740h26M372 800h26M372 440l26 60M398 500l-26 60M372 560l26 60M398 620l-26 60M372 680l26 60M398 740l-26 60M398 470h-80" fill="none" stroke="${c.ink}" stroke-opacity=".55" stroke-width="2"/>`
  const ground = `<rect y="${horizon}" width="${W}" height="${H - horizon}" fill="${mix(c.ground, c.shade, 0.5)}"/><path d="M0 ${horizon}H${W}" stroke="${c.warm}" stroke-opacity=".35"/>`
  const glow = `<ellipse cx="300" cy="${horizon}" rx="420" ry="120" fill="url(#glow)"/>`
  return sheet(c, {
    defs: `${radial('glow', c.warmer, 0.6)}<linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.ground}" stop-opacity="0"/><stop offset=".65" stop-color="${c.secondary}" stop-opacity="${c.mode === 'light' ? 0.12 : 0.22}"/><stop offset=".88" stop-color="${c.warmer}" stop-opacity="${c.mode === 'light' ? 0.18 : 0.32}"/></linearGradient>
<radialGradient id="flame" cy=".3"><stop offset="0" stop-color="${mix(c.warm, c.star, 0.5)}"/><stop offset=".5" stop-color="${c.warmer}" stop-opacity=".8"/><stop offset="1" stop-color="${c.beacon}" stop-opacity="0"/></radialGradient>`,
    style: `.puff{animation:puff 9s ease-in-out infinite}@keyframes puff{0%,100%{transform:scale(.92)}50%{transform:scale(1.1)}}
.rocket{animation:climb 36s ease-in infinite}@keyframes climb{0%,30%{transform:translateY(0);opacity:1}88%{transform:translateY(-760px);opacity:1}92%,100%{transform:translateY(-900px);opacity:0}}
.flame{animation:flame .35s ease-in-out infinite alternate;transform-origin:300px 760px}@keyframes flame{from{transform:scaleY(.85)}to{transform:scaleY(1.15)}}`,
    under: `<rect width="${W}" height="${H}" fill="url(#dusk)"/>`,
    body: `${stars(c, 60, 10, 420, 5)}${glow}${tower}${rocket}${puffs}${ground}<path d="${ridge(4, horizon + 4, 120, 0.6, horizon + 6)}" fill="${mix(c.ground, c.shade, 0.3)}" opacity=".9"/>`,
  })
}

/** Five ridges fading into mist, pines on the nearest, a moon breathing behind them, fog drifting through. */
function ridges(c: SceneColors): string {
  const light = c.mode === 'light'
  const far = light ? mix(c.ground, c.secondary, 0.25) : mix(c.ground, c.secondary, 0.35)
  const near = light ? mix(c.ground, c.ink, 0.55) : mix(c.ground, c.shade, 0.75)
  let layers = ''
  for (let i = 0; i < 5; i += 1) {
    const t = i / 4
    const fill = mix(far, near, t)
    layers += `<path d="${ridge(i * 2.3 + 1, 620 + i * 80, 300 - i * 30, 0.5 + t, H + 10)}" fill="${fill}"/>`
    if (i < 4) {
      layers += `<rect class="fog" style="animation-duration:${50 + i * 12}s;animation-delay:-${i * 9}s" x="-200" y="${560 + i * 80}" width="${W + 400}" height="70" fill="url(#fogband)" opacity="${light ? 0.55 : 0.4}"/>`
    }
  }
  let pines = ''
  for (let i = 0; i < 46; i += 1) {
    const x = marginX(i * 5 + 3, 0.34)
    const h = r(26 + hash(i * 5 + 9) * 54)
    const y = r(H - 30 - hash(i * 5 + 11) * 90)
    pines += `M${x} ${y - h}l${r(h * 0.28)} ${h}h${r(-h * 0.56)}z`
  }
  const moon = `<circle class="breathe" cx="1260" cy="230" r="150" fill="url(#halo)"/><circle cx="1260" cy="230" r="54" fill="${light ? mix(c.ground, c.warm, 0.35) : mix(c.star, c.warm, 0.25)}" opacity=".9"/>`
  return sheet(c, {
    defs: `${radial('halo', light ? c.warm : c.primary, light ? 0.35 : 0.45)}<linearGradient id="fogband" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${light ? '#ffffff' : c.ink}" stop-opacity="0"/><stop offset=".5" stop-color="${light ? '#ffffff' : c.ink}" stop-opacity=".22"/><stop offset="1" stop-color="${light ? '#ffffff' : c.ink}" stop-opacity="0"/></linearGradient>`,
    style: `.fog{animation:fog 60s ease-in-out infinite alternate}@keyframes fog{from{transform:translateX(-120px)}to{transform:translateX(120px)}}`,
    body: `${light ? '' : stars(c, 50, 10, 380, 9)}${moon}${layers}<path d="${pines}" fill="${near}"/>`,
    columnFade: 0.4,
  })
}

/** Sumi-e: brush-washed peaks rising from mist, a few birds crossing, petals falling, a red seal. */
function ink(c: SceneColors): string {
  const light = c.mode === 'light'
  const inkColor = light ? mix(c.ink, c.ground, 0.1) : mix(c.star, c.ground, 0.25)
  let peaks = ''
  const spots = [[150, 0.9], [360, 0.6], [1280, 1], [1470, 0.7], [1080, 0.45]] as const
  spots.forEach(([x, s], i) => {
    const h = 520 * s
    const w = 180 * s + 80
    const top = 900 - h
    peaks += `<path d="M${x - w} 900C${x - w * 0.6} ${r(top + h * 0.45)} ${x - w * 0.25} ${r(top + 30)} ${x} ${r(top)}C${x + w * 0.2} ${r(top + 40)} ${x + w * 0.55} ${r(top + h * 0.5)} ${x + w} 900Z" fill="url(#wash${i % 2})"/>`
    peaks += `<path d="M${x} ${r(top)}C${x - w * 0.25} ${r(top + 30)} ${x - w * 0.6} ${r(top + h * 0.45)} ${x - w} 900" fill="none" stroke="${inkColor}" stroke-width="${r(2 + s * 3)}" stroke-linecap="round" opacity=".55"/>`
  })
  let birds = ''
  for (let i = 0; i < 7; i += 1) {
    const x = r(980 + hash(i + 40) * 380)
    const y = r(160 + hash(i + 41) * 160)
    const s = r(6 + hash(i + 42) * 8)
    birds += `<path d="M${x - s} ${y}q${r(s / 2)} ${r(-s / 2)} ${s} 0q${r(s / 2)} ${r(-s / 2)} ${s} 0" fill="none" stroke="${inkColor}" stroke-width="1.6"/>`
  }
  let petals = ''
  for (let i = 0; i < 18; i += 1) {
    const x = marginX(i * 7 + 51, 0.32)
    petals += `<ellipse class="petal" style="animation-duration:${18 + hash(i + 60) * 16}s;animation-delay:-${r(hash(i + 61) * 30)}s" cx="${x}" cy="-20" rx="5" ry="3" fill="${c.primary}" opacity=".7"/>`
  }
  const seal = `<rect x="1490" y="840" width="44" height="44" rx="4" fill="${c.beacon}" opacity=".75"/><path d="M1500 852h24M1512 852v24M1500 876h24" stroke="${c.ground}" stroke-width="3" opacity=".8"/>`
  return sheet(c, {
    defs: `<linearGradient id="wash0" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${inkColor}" stop-opacity=".55"/><stop offset=".6" stop-color="${inkColor}" stop-opacity=".12"/><stop offset="1" stop-color="${inkColor}" stop-opacity="0"/></linearGradient>
<linearGradient id="wash1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(inkColor, c.primary, 0.3)}" stop-opacity=".4"/><stop offset=".7" stop-color="${inkColor}" stop-opacity=".06"/><stop offset="1" stop-color="${inkColor}" stop-opacity="0"/></linearGradient>
<linearGradient id="mist" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.ground}" stop-opacity="0"/><stop offset="1" stop-color="${c.ground}"/></linearGradient>`,
    style: `.birds{animation:birds 70s linear infinite}@keyframes birds{from{transform:translate(120px,20px)}to{transform:translate(-260px,-30px)}}
.petal{animation:petal 24s linear infinite}@keyframes petal{0%{transform:translate(0,0) rotate(0);opacity:0}8%{opacity:.75}100%{transform:translate(-160px,1080px) rotate(540deg);opacity:0}}`,
    body: `${peaks}<rect y="700" width="${W}" height="300" fill="url(#mist)"/><g class="birds">${birds}</g>${petals}${seal}`,
    columnFade: 0.35,
  })
}

/** Bands of flowing lines rolling across the foot and the head, like wind over dunes or swell on water. */
function waves(c: SceneColors): string {
  const line = (seed: number, y: number, amp: number, len: number): string => {
    let d = `M0 ${y}`
    for (let x = 0; x <= len; x += 40) {
      const t = x / 800
      d += `L${x} ${r(y + Math.sin(t * Math.PI * 2 + seed) * amp + Math.sin(t * Math.PI * 4 + seed * 1.7) * amp * 0.35)}`
    }
    return d
  }
  let low = ''
  for (let i = 0; i < 26; i += 1) {
    low += `<path d="${line(i * 0.22, 760 + i * 9, 50 + i * 2, 3200)}" stroke="url(#lineGrad)" stroke-opacity="${r(0.28 + (i / 26) * 0.6)}"/>`
  }
  let high = ''
  for (let i = 0; i < 12; i += 1) {
    high += `<path d="${line(2 + i * 0.3, 90 + i * 10, 34, 3200)}" stroke="url(#lineGrad)" stroke-opacity="${r(0.16 + (i / 12) * 0.34)}"/>`
  }
  return sheet(c, {
    defs: `<linearGradient id="lineGrad" x1="0" x2="1600" gradientUnits="userSpaceOnUse" spreadMethod="reflect"><stop offset="0" stop-color="${c.primary}"/><stop offset=".5" stop-color="${c.secondary}"/><stop offset="1" stop-color="${c.warm}"/></linearGradient>`,
    style: `.roll{animation:roll 48s linear infinite}@keyframes roll{from{transform:translateX(0)}to{transform:translateX(-1600px)}}
.rollSlow{animation:roll 90s linear infinite reverse}`,
    body: `<g fill="none" stroke-width="1.6"><g class="roll">${low}</g><g class="rollSlow">${high}</g></g>`,
    columnFade: 0.3,
  })
}

/** A striped retro sun over low peaks and a grid floor that rolls toward you. */
function synth(c: SceneColors): string {
  const horizon = 760
  let cuts = ''
  for (let i = 0; i < 7; i += 1) {
    const y = 300 + i * 26
    cuts += `<rect x="1050" y="${y}" width="460" height="${4 + i * 2}" fill="#000"/>`
  }
  const sun = `<g mask="url(#sunCut)"><circle cx="1280" cy="330" r="190" fill="url(#sunGrad)"/></g>`
  let verticals = ''
  for (let i = -16; i <= 16; i += 1) {
    verticals += `M${800 + i * 30} ${horizon}L${800 + i * 220} ${H + 40}`
  }
  let rows = ''
  for (let i = 0; i < 12; i += 1) {
    rows += `<path class="row" style="animation-delay:-${r(i * (6 / 12))}s" d="M-200 ${horizon}H${W + 200}"/>`
  }
  const peaks = `<path d="M-20 ${horizon}L120 640L210 700L330 590L450 ${horizon}ZM1130 ${horizon}L1240 670L1330 712L1450 610L1620 ${horizon}Z" fill="${mix(c.ground, c.secondary, 0.25)}" stroke="${c.secondary}" stroke-opacity=".7" stroke-width="1.5"/>`
  return sheet(c, {
    defs: `<linearGradient id="sunGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.warm}"/><stop offset=".55" stop-color="${c.warmer}"/><stop offset="1" stop-color="${c.primary}"/></linearGradient>
<mask id="sunCut" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#fff"/>${cuts}</mask>
${radial('sunHalo', c.warmer, 0.45)}
<linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.secondary}" stop-opacity=".25"/><stop offset="1" stop-color="${c.ground}" stop-opacity="0"/></linearGradient>`,
    style: `.row{stroke:${c.secondary};stroke-opacity:.6;animation:row 6s linear infinite}@keyframes row{0%{transform:translateY(0) scaleY(1);stroke-opacity:.15}100%{transform:translateY(${H - horizon + 40}px);stroke-opacity:.8}}
.sunBob{animation:bob 14s ease-in-out infinite alternate}@keyframes bob{from{transform:translateY(-6px)}to{transform:translateY(8px)}}`,
    body: `${stars(c, 40, 10, 520, 13)}<g class="sunBob"><circle cx="1280" cy="330" r="330" fill="url(#sunHalo)"/>${sun}</g>${peaks}<rect y="${horizon}" width="${W}" height="${H - horizon}" fill="url(#floor)"/><g fill="none" stroke-width="1.2"><path d="${verticals}" stroke="${c.secondary}" stroke-opacity=".45"/>${rows}</g><path d="M0 ${horizon}H${W}" stroke="${c.primary}" stroke-width="2" opacity=".8"/>`,
    columnFade: 0.3,
  })
}

/** A honeycomb across the margins, a few cells lighting in the theme's colors, dots drifting. */
function geometric(c: SceneColors): string {
  const size = 44
  const hexW = size * Math.sqrt(3)
  const hexPath = (cx: number, cy: number): string => {
    let d = ''
    for (let k = 0; k < 6; k += 1) {
      const a = (Math.PI / 3) * k + Math.PI / 6
      d += `${k === 0 ? 'M' : 'L'}${r(cx + size * 0.92 * Math.cos(a))} ${r(cy + size * 0.92 * Math.sin(a))}`
    }
    return d + 'Z'
  }
  let grid = ''
  let lit = ''
  let n = 0
  for (let row = 0; row < 16; row += 1) {
    for (let col = 0; col < 18; col += 1) {
      const cx = r(col * hexW + (row % 2 ? hexW / 2 : 0))
      const cy = r(row * size * 1.5)
      const fromCentre = Math.abs(cx - W / 2) / (W / 2)
      if (fromCentre < 0.36) continue
      const d = hexPath(cx, cy)
      grid += d
      n += 1
      if (hash(row * 31 + col * 7) > 0.84) {
        const color = [c.primary, c.secondary, c.warm][n % 3]!
        lit += `<path class="cell" style="animation-duration:${8 + hash(n) * 10}s;animation-delay:-${r(hash(n + 3) * 12)}s" d="${d}" fill="${color}"/>`
      }
    }
  }
  let dots = ''
  for (let i = 0; i < 30; i += 1) {
    dots += `<circle class="dot" style="animation-duration:${20 + hash(i + 90) * 30}s;animation-delay:-${r(hash(i + 91) * 30)}s" cx="${marginX(i + 95, 0.3)}" cy="${r(hash(i + 97) * H)}" r="${r(1.5 + hash(i + 99) * 2.5)}" fill="${c.ink}" opacity=".4"/>`
  }
  return sheet(c, {
    style: `.cell{animation:cell 12s ease-in-out infinite}@keyframes cell{0%,100%{opacity:.03}45%,55%{opacity:.5}}
.dot{animation:dot 30s ease-in-out infinite alternate}@keyframes dot{from{transform:translateY(-30px)}to{transform:translateY(30px)}}`,
    body: `${lit}<path d="${grid}" fill="none" stroke="${c.ink}" stroke-opacity="${c.mode === 'light' ? 0.18 : 0.12}" stroke-width="1.4"/>${dots}`,
    columnFade: 0.2,
  })
}

/** Near-dark, a low glow, smoke curling up the margins and embers rising and winking out. */
function embers(c: SceneColors): string {
  let smoke = ''
  for (let i = 0; i < 10; i += 1) {
    const x = marginX(i * 11 + 5, 0.28)
    smoke += `<ellipse class="smoke" style="animation-duration:${26 + hash(i + 1) * 20}s;animation-delay:-${r(hash(i + 2) * 30)}s" cx="${x}" cy="1000" rx="${r(70 + hash(i + 3) * 80)}" ry="${r(120 + hash(i + 4) * 90)}" fill="${c.ink}" opacity=".2" filter="url(#blur)"/>`
  }
  let sparks = ''
  for (let i = 0; i < 96; i += 1) {
    const x = marginX(i * 13 + 21, 0.34)
    const color = [c.warm, c.warmer, c.beacon, c.primary][i % 4]!
    sparks += `<circle class="ember" style="animation-duration:${9 + hash(i + 30) * 12}s;animation-delay:-${r(hash(i + 31) * 20)}s" cx="${x}" cy="${r(980 + hash(i + 32) * 40)}" r="${r(1.6 + hash(i + 33) * 2.8)}" fill="${color}"/>`
  }
  return sheet(c, {
    defs: `<filter id="blur" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="30"/></filter>${radial('ember', c.warmer, c.mode === 'light' ? 0.3 : 0.55)}<radialGradient id="vignette" r=".75"><stop offset=".55" stop-color="${c.shade}" stop-opacity="0"/><stop offset="1" stop-color="${c.shade}" stop-opacity="${c.mode === 'light' ? 0.15 : 0.55}"/></radialGradient>`,
    style: `.smoke{animation:smoke 30s ease-in infinite}@keyframes smoke{0%{transform:translateY(0) scale(.8);opacity:0}25%{opacity:.24}100%{transform:translateY(-900px) scale(1.6);opacity:0}}
.ember{animation:ember 14s linear infinite}@keyframes ember{0%{transform:translate(0,0);opacity:0}10%{opacity:.95}70%{opacity:.7}100%{transform:translate(40px,-820px);opacity:0}}`,
    under: `<ellipse cx="200" cy="1040" rx="520" ry="260" fill="url(#ember)"/><ellipse cx="1400" cy="1040" rx="520" ry="260" fill="url(#ember)"/>`,
    body: `${smoke}${sparks}<rect width="${W}" height="${H}" fill="url(#vignette)"/>`,
    columnFade: 0.25,
  })
}

/** Columns of glyph-like marks falling down the margins, the lead mark brightest. */
function rain(c: SceneColors): string {
  let cols = ''
  const pitch = 26
  for (let i = 0; i < Math.floor(W / pitch); i += 1) {
    const x = i * pitch + 6
    if (Math.abs(x - W / 2) < W * 0.2) continue
    const len = 10 + Math.floor(hash(i + 3) * 16)
    let marks = ''
    for (let k = 0; k < len; k += 1) {
      const w = hash(i * 50 + k) > 0.5 ? 9 : 6
      const op = r(((k + 1) / len) * 0.75)
      marks += `<rect x="${x + (9 - w) / 2}" y="${k * 22}" width="${w}" height="${hash(i * 50 + k + 1) > 0.6 ? 12 : 8}" fill="${k === len - 1 ? c.star : c.primary}" opacity="${k === len - 1 ? 0.95 : op}"/>`
    }
    cols += `<g class="fall" style="animation-duration:${6 + hash(i + 7) * 10}s;animation-delay:-${r(hash(i + 9) * 14)}s">${marks}</g>`
  }
  return sheet(c, {
    style: `.fall{animation:fall 10s linear infinite}@keyframes fall{from{transform:translateY(-600px)}to{transform:translateY(1100px)}}`,
    body: cols,
    columnFade: 0.15,
  })
}

/**
 * concordchat.cc's hero: grapes rise slowly at their own depth, nearer ones bigger, brighter and
 * quicker, swaying as they go. The grapes are always the emoji, as on the site; color stays in the glow.
 */
function grapes(c: SceneColors): string {
  let field = ''
  for (let i = 0; i < 56; i += 1) {
    const z = 0.3 + hash(i * 7 + 3) * 0.7
    const x = r(hash(i * 7 + 1) * W)
    const size = r(11 + z * 13) // about an emoji's own size, as on the site
    const alpha = r((0.07 + z * 0.2) * 2.2 * 100) / 100 // stronger than the site: small grapes would vanish
    const rise = r(70 - z * 40)
    field += `<text class="up" style="animation-duration:${rise}s;animation-delay:-${r(hash(i * 7 + 2) * rise)}s" x="${x}" y="${H + 30}" font-size="${size}" opacity="${alpha}">🍇</text>`
  }
  return sheet(c, {
    defs: `${radial('corner', c.primary, c.mode === 'light' ? 0.18 : 0.32)}`,
    style: `.up{animation:up 50s linear infinite;font-family:"Noto Color Emoji","Apple Color Emoji","Segoe UI Emoji",sans-serif}
@keyframes up{0%{transform:translate(0,0) rotate(-8deg)}25%{transform:translate(10px,-275px) rotate(4deg)}50%{transform:translate(-7px,-550px) rotate(-6deg)}75%{transform:translate(8px,-825px) rotate(5deg)}100%{transform:translate(0,-1100px) rotate(-8deg)}}`,
    under: `<ellipse cx="60" cy="-80" rx="820" ry="620" fill="url(#corner)"/>`,
    body: field,
    columnFade: 0.35,
  })
}

/** The scene for a style, in a theme's colors. */
export function drawScene(style: SceneStyle, c: SceneColors): string {
  switch (style) {
    case 'cosmos':
      return cosmos(c)
    case 'launch':
      return launch(c)
    case 'ridges':
      return ridges(c)
    case 'ink':
      return ink(c)
    case 'waves':
      return waves(c)
    case 'synth':
      return synth(c)
    case 'geometric':
      return geometric(c)
    case 'embers':
      return embers(c)
    case 'rain':
      return rain(c)
    case 'grapes':
      return grapes(c)
    case 'skyline':
      return omarchySvg(c)
  }
}

export const SCENE_ALT: Record<SceneStyle, string> = {
  skyline: 'A city skyline in thin outlines, a few windows lighting up',
  cosmos: 'Nebula clouds drifting past a ringed planet and twinkling stars',
  launch: 'A rocket climbing out of billowing exhaust at dusk',
  ridges: 'Misty mountain ridges under a glowing moon, fog drifting through',
  ink: 'An ink-wash landscape with birds crossing and petals falling',
  waves: 'Bands of flowing lines rolling slowly across the margins',
  synth: 'A striped retro sun over a grid floor rolling toward you',
  geometric: 'A honeycomb at the margins with cells softly lighting',
  embers: 'Smoke and embers rising through the dark',
  rain: 'Columns of glyphs falling down the margins',
  grapes: 'Grapes rising slowly through a soft violet glow',
}
