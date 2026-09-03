/**
 * palette.ts
 *
 * The token bridge (CLAUDE.md Invariant 1.6, extended by D21).
 *
 * Materials and lights are set in JavaScript, where nothing stops a colour
 * drifting off-palette the way a raw hex in a component would be caught. This
 * module is the scene's ONLY source of colour: it reads the CSS custom
 * properties that `tokens.css` already defines, so `tokens.css` stays the
 * single source of truth for the whole product rather than just the DOM half.
 *
 * A literal colour in a material is the same defect as a raw hex in a
 * component. If the scene needs a colour that is not here, add the token to
 * DESIGN.md and tokens.css first, then read it.
 */

const read = (name: string): string => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  if (!value) {
    // Loud, not silent. A missing token means tokens.css did not load first,
    // which is the load-order invariant failing, and a scene rendered in
    // fallback colours would look plausible while being off-palette.
    throw new Error(
      `palette: token ${name} is not defined. tokens.css must load before the scene mounts.`,
    )
  }
  return value
}

export interface Palette {
  ground0: string
  ground1: string
  ground2: string
  ink0: string
  ink1: string
  ink2: string
  ink3: string
  accent: string
  accentDeep: string
}

/**
 * Read once at mount. Tokens do not change at runtime in this project (there is
 * no theme switch, by law: Invariant 1.1), so re-reading per frame would cost a
 * layout flush for nothing.
 */
export function readPalette(): Palette {
  return {
    ground0: read('--ground-0'),
    ground1: read('--ground-1'),
    ground2: read('--ground-2'),
    ink0: read('--ink-0'),
    ink1: read('--ink-1'),
    ink2: read('--ink-2'),
    ink3: read('--ink-3'),
    accent: read('--accent'),
    accentDeep: read('--accent-deep'),
  }
}

/** Motion durations, also from tokens, so a camera move matches a CSS move. */
export function readDurations(): { fast: number; move: number; settle: number } {
  const ms = (name: string) => parseFloat(read(name)) / 1000
  return { fast: ms('--dur-fast'), move: ms('--dur-move'), settle: ms('--dur-settle') }
}
