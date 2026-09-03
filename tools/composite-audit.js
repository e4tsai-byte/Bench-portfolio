/**
 * tools/composite-audit.js
 *
 * The half of the contrast audit that cannot be done statically.
 *
 * DESIGN.md Section 3 item 1 requires contrast to be verified against the
 * actual composite, not a flat swatch. In this project a text element sits on
 * a translucent console, which sits on a BLURRED baked still. There is no
 * static equivalent of backdrop-filter, so the effective backdrop under a line
 * of text can only be measured in a live browser, against a real render.
 *
 * Two choices in here matter and must survive into any future automation:
 *
 *   1. It reports the WORST pixel under each text element, never the mean.
 *      The mean is what lets a bad render pass: a field averaging 220 that
 *      swings 190 to 250 reads as acceptable on average while a caption drifts
 *      from 7:1 to about 4:1 halfway through a sentence.
 *   2. It pads the sampled canvas. backdrop-filter samples OUTSIDE the
 *      element's bounds, so detail just beyond the console edge bleeds inward.
 *      Without the pad, the canvas edge contributes transparent black and
 *      produces false failures near the frame edge.
 *
 * HOW TO RUN
 *   1. npm run dev
 *   2. Put the app in the MICROSCOPE state (#microscope).
 *   3. Paste this whole file into the dev console.
 *   4. Repeat at 1440x900 and at 1920x1080 minimum. object-fit: cover crops
 *      differently by aspect ratio, so a different part of the render ends up
 *      under the console. A pass at one viewport is not a pass.
 *
 * REQUIREMENTS
 *   - The bench still must carry data-bench-still, and specimen cards must
 *     carry data-frost="2", or adjust the two selectors below.
 *   - Assets must be same-origin, or getImageData throws on a tainted canvas.
 *     Vite dev serves same-origin, which is another reason to audit there.
 */

(() => {
  const srgbToLinear = (c) => {
    const v = c / 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  }
  const lum = ([r, g, b]) =>
    0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b)
  const contrast = (f, b) => {
    const [x, y] = [lum(f), lum(b)]
    const [hi, lo] = x > y ? [x, y] : [y, x]
    return (hi + 0.05) / (lo + 0.05)
  }
  const rgb = (s) => s.match(/\d+/g).slice(0, 3).map(Number)

  // Floors keyed by the rendered colour, transcribed from DESIGN.md 2.2/2.3.
  const FLOORS = {
    '31,44,58': 12, // --ink-0
    '64,80,100': 7, // --ink-1
    '93,109,129': 4.5, // --ink-2
    '25,107,91': 4.5, // --accent-deep
  }

  const still = document.querySelector('[data-bench-still]') || document.querySelector('img')
  if (!still) {
    console.warn('composite-audit: no bench still found. Nothing to composite against yet.')
    return
  }

  const rect = still.getBoundingClientRect()
  const blur = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--frost-1-blur'),
  ) || 20
  const PAD = Math.ceil(blur * 3) // backdrop-filter pulls samples from outside

  const canvas = document.createElement('canvas')
  canvas.width = Math.ceil(rect.width) + PAD * 2
  canvas.height = Math.ceil(rect.height) + PAD * 2
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.filter = `blur(${blur}px)`

  // Reproduce object-fit: cover so we sample the same crop the browser shows.
  const scale = Math.max(rect.width / still.naturalWidth, rect.height / still.naturalHeight)
  const w = still.naturalWidth * scale
  const h = still.naturalHeight * scale
  ctx.drawImage(still, PAD + (rect.width - w) / 2, PAD + (rect.height - h) / 2, w, h)

  const worstBackdrop = (el, alpha) => {
    const r = el.getBoundingClientRect()
    if (r.width < 1 || r.height < 1) return null
    const data = ctx.getImageData(
      Math.round(r.left - rect.left) + PAD,
      Math.round(r.top - rect.top) + PAD,
      Math.ceil(r.width),
      Math.ceil(r.height),
    ).data
    let worst = null
    let worstLum = 2
    for (let i = 0; i < data.length; i += 4) {
      // Frost composited over the blurred bench, in sRGB, which is what the
      // compositor actually does.
      const px = [0, 1, 2].map((k) => alpha * 255 + (1 - alpha) * data[i + k])
      const l = lum(px)
      if (l < worstLum) {
        worstLum = l
        worst = px
      }
    }
    return worst
  }

  const results = []
  document.querySelectorAll('*').forEach((el) => {
    const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())
    if (!hasText) return
    const cs = getComputedStyle(el)
    const fg = rgb(cs.color)
    // Section 2.5 forbids frost on frost, so an element is on exactly one tier.
    const alpha = el.closest('[data-frost="2"]') ? 0.8 : 0.66
    const bg = worstBackdrop(el, alpha)
    if (!bg) return
    const got = contrast(fg, bg)
    const floor = FLOORS[fg.join(',')] ?? 4.5
    results.push({
      text: el.textContent.trim().slice(0, 38),
      color: cs.color,
      measured: +got.toFixed(2),
      floor,
      worstBackdrop: bg.map((v) => Math.round(v)).join(','),
      pass: got >= floor,
    })
  })

  const fails = results.filter((r) => !r.pass)
  console.table(results)
  if (fails.length) {
    console.error(`composite-audit: FAIL, ${fails.length} of ${results.length} element(s) below floor`)
  } else {
    console.log(`composite-audit: PASS, ${results.length} element(s) clear their floors`)
  }
  return fails
})()
