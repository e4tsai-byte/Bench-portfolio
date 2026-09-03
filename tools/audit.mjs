#!/usr/bin/env node
/**
 * tools/audit.mjs
 *
 * The automated half of the audit that CLAUDE.md Section 3 lists as a KNOWN
 * GAP. Run with `npm run audit`. Exits non-zero on any FAIL.
 *
 * WHAT THIS CLOSES: the checks that can be made statically, from the token
 * definitions and the source tree, with no browser and no build.
 *
 * WHAT THIS DOES NOT CLOSE, and why: the composite check. Text in this project
 * sits on a translucent console over a blurred baked still, so the real
 * question is what the WORST pixel under each text element composites to. That
 * needs a live browser (backdrop-filter has no static equivalent) and a render
 * that does not exist yet. That half lives in tools/composite-audit.js and is
 * run by hand in the dev console. Do not describe the gap as closed while that
 * remains true (Invariant 1.9).
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const read = (p) => readFileSync(join(ROOT, p), 'utf8')

const C = { g: '\x1b[32m', r: '\x1b[31m', y: '\x1b[33m', d: '\x1b[90m', b: '\x1b[1m', x: '\x1b[0m' }

let failures = 0
let warnings = 0
const pass = (m) => console.log(`  ${C.g}PASS${C.x}  ${m}`)
const fail = (m) => { failures++; console.log(`  ${C.r}FAIL${C.x}  ${m}`) }
const warn = (m) => { warnings++; console.log(`  ${C.y}WARN${C.x}  ${m}`) }
const skip = (m) => console.log(`  ${C.d}SKIP${C.x}  ${m}`)
const head = (m) => console.log(`\n${C.b}${m}${C.x}`)

/* -- colour maths ------------------------------------------------------- */

const srgbToLinear = (c) => {
  const v = c / 255
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}
const luminance = ([r, g, b]) =>
  0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b)
const contrast = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)]
  const [hi, lo] = x > y ? [x, y] : [y, x]
  return (hi + 0.05) / (lo + 0.05)
}
const parseHex = (hex) => {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16))
}

/* -- 1. token contrast --------------------------------------------------- */
// Floors are transcribed from DESIGN.md Sections 2.2 and 2.3. If a floor
// changes there, change it here: this file ENFORCES the design system, it does
// not define it.

const FLOORS = {
  '--ink-0': 12,
  '--ink-1': 7,
  '--ink-2': 4.5,
  '--ink-3': null,
  '--accent': 3,
  '--accent-deep': 4.5,
}

const tokensCss = read('src/styles/tokens.css')
const tokens = Object.fromEntries(
  [...tokensCss.matchAll(/(--[\w-]+):\s*(#[0-9a-fA-F]{3,8})\s*;/g)].map((m) => [m[1], m[2]]),
)
const grounds = Object.keys(tokens).filter((t) => t.startsWith('--ground-'))

head('Token contrast (DESIGN.md 2.2, 2.3)')
if (grounds.length === 0) fail('no --ground-* tokens found in tokens.css')

for (const [token, floor] of Object.entries(FLOORS)) {
  if (!tokens[token]) { fail(`${token} is not defined in tokens.css`); continue }
  const fg = parseHex(tokens[token])
  const ratios = grounds.map((g) => ({ g, r: contrast(fg, parseHex(tokens[g])) }))
  const worst = ratios.reduce((a, b) => (a.r < b.r ? a : b))
  const label = `${token} ${tokens[token]} worst ${worst.r.toFixed(2)}:1 on ${worst.g}`
  if (floor === null) pass(`${label} (non-text, no floor)`)
  else if (worst.r >= floor) pass(`${label} (floor ${floor}:1)`)
  else fail(`${label} is BELOW its ${floor}:1 floor`)
}

/* -- 2. the high-key law ------------------------------------------------- */
// Invariant 1.1 is blocking, so it gets a mechanical check rather than trust.

head('High-key law (CLAUDE.md 1.1)')
for (const g of grounds) {
  const l = luminance(parseHex(tokens[g]))
  if (l >= 0.7) pass(`${g} ${tokens[g]} luminance ${l.toFixed(3)}`)
  else fail(`${g} ${tokens[g]} luminance ${l.toFixed(3)} is not a high-key ground`)
}

/* -- 3. source hygiene (Invariant 1.6) ----------------------------------- */

const walk = (dir, out = []) => {
  for (const entry of readdirSync(join(ROOT, dir))) {
    const rel = join(dir, entry)
    if (statSync(join(ROOT, rel)).isDirectory()) walk(rel, out)
    else out.push(rel)
  }
  return out
}
const srcFiles = walk('src')

head('Tokens only (CLAUDE.md 1.6)')
const HEX = /#[0-9a-fA-F]{3,8}\b/
const RGB = /\brgba?\(/
const PX = /\b\d+(\.\d+)?px\b/
const before = failures

for (const file of srcFiles) {
  if (file.endsWith('tokens.css')) continue
  const isComponent = file.endsWith('.tsx') || file.endsWith('.ts')
  const isCss = file.endsWith('.css')
  if (!isComponent && !isCss) continue
  read(file).split('\n').forEach((line, i) => {
    const at = `${file}:${i + 1}`
    // Comments describe values constantly, so only real declarations count.
    const code = line.replace(/\/\*.*?\*\//g, '').replace(/^\s*(\/\/|\*|\/\*).*$/, '')
    if (!code.trim()) return
    if (HEX.test(code)) fail(`${at} raw hex outside tokens.css: ${code.trim().slice(0, 56)}`)
    if (RGB.test(code)) fail(`${at} raw rgb/rgba outside tokens.css: ${code.trim().slice(0, 56)}`)
    if (isComponent && PX.test(code)) fail(`${at} raw px in a component: ${code.trim().slice(0, 56)}`)
    // A raw px in base/console CSS is usually a hairline with no token. Worth
    // seeing, not worth blocking on.
    if (isCss && PX.test(code)) warn(`${at} raw px in a stylesheet: ${code.trim().slice(0, 56)}`)
  })
}
if (failures === before) pass('no raw hex, rgb, or px in components')

/* -- 4. stylesheet load order (CLAUDE.md 2) ------------------------------ */

head('Stylesheet load order (CLAUDE.md 2, load-bearing)')
const main = read('src/main.tsx')
const order = ['tokens.css', 'base.css', 'console.css'].map((f) => main.indexOf(f))
if (order.some((i) => i === -1)) {
  fail('main.tsx does not import all three stylesheets')
} else if (order[0] < order[1] && order[1] < order[2]) {
  pass('tokens.css, then base.css, then console.css')
} else {
  fail('stylesheets imported out of order: tokens before base before console')
}

/* -- 5. tree drift (CLAUDE.md 2) ----------------------------------------- */

head('Structural drift (CLAUDE.md 2)')
const claude = read('CLAUDE.md')
const undeclared = srcFiles.filter((f) => !claude.includes(f.split('/').pop()))
if (undeclared.length === 0) pass(`all ${srcFiles.length} files under src/ are declared in the tree`)
else undeclared.forEach((f) => fail(`${f} is not listed in the CLAUDE.md Section 2 tree`))

/* -- 6. the half this cannot do ------------------------------------------ */

head('Composite contrast (DESIGN.md 3 item 1, 10.1, 10.2)')
let renders = []
try {
  renders = walk('src/assets').filter((f) => /\.(png|webp|jpg|jpeg)$/i.test(f))
} catch {
  // assets directory does not exist yet
}
if (renders.length === 0) {
  skip('no render or placeholder art exists yet, so there is no composite to measure')
} else {
  skip(`${renders.length} image(s) present, but static analysis cannot evaluate backdrop-filter`)
}
console.log(`        ${C.d}Run tools/composite-audit.js in the dev console against a live`)
console.log(`        MICROSCOPE state. CLAUDE.md Section 3 remains a KNOWN GAP until`)
console.log(`        that check runs automatically against a real render.${C.x}`)

/* -- summary ------------------------------------------------------------- */

console.log(`\n${'-'.repeat(66)}`)
if (failures > 0) {
  console.log(`${C.r}FAILED${C.x}  ${failures} failure(s), ${warnings} warning(s)`)
  process.exit(1)
}
console.log(`${C.g}OK${C.x}  0 failures, ${warnings} warning(s)`)
