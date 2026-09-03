/**
 * tools/composite-audit.js
 *
 * The half of the contrast audit that cannot be done statically.
 *
 * DESIGN.md Section 3 item 1 requires contrast to be verified against the
 * actual composite, not a flat swatch. In this project a text element sits on
 * a translucent console, which sits on a live-rendered WebGL scene (D20).
 * There is no static equivalent of backdrop-filter, so the effective backdrop
 * under a line of text can only be measured in a live browser.
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
 * ADAPTED 2026-09-03 for the live canvas (brand-designer review, ahead of the
 * microscope console build). What changed from the baked-<img> version:
 *
 *   - Selector targets the live canvas (`.scene__canvas canvas`), not a
 *     static <img>. Add `data-bench-canvas` to it for a more stable hook if
 *     the class name ever changes.
 *   - Dropped the object-fit:cover crop math entirely. The canvas draws at
 *     its own CSS size 1:1 (it is not object-fit cropped, it fills
 *     .scene__canvas directly), so there is no scale/letterbox to reproduce.
 *   - Per-element sampling (below) already handles the "sample the real
 *     shape, not a rectangle" concern that mattered when only a PRE-BUILD
 *     estimate existed (see DESIGN.md 10.2, and the camera-framing search
 *     logged in the build history). Once real DOM elements exist, each
 *     text-bearing element's own getBoundingClientRect() is exact by
 *     construction: a HUD mark positioned in a box corner is already sampled
 *     at its real position, whether that lands in the ring or the core, with
 *     no separate circle-vs-rectangle judgment call needed.
 *   - TIMING, a new requirement a static image never had. The canvas is a
 *     live, repainting WebGL surface with no `preserveDrawingBuffer`, so its
 *     buffer can be blank or stale outside the same tick as a paint. Before
 *     running this: temporarily add `preserveDrawingBuffer: true` to the
 *     Canvas `gl` prop in App.tsx (see the build history for the exact
 *     one-line diff used during development), reload, and wait for the
 *     camera transition to fully settle (`--dur-move` has elapsed and the
 *     scene is visibly still) before pasting this in. Revert the flag
 *     afterward: it has a real performance cost and is a debugging aid, not
 *     a shipped setting.
 *
 * HOW TO RUN
 *   1. npm run dev, with preserveDrawingBuffer set as above.
 *   2. Put the app in the MICROSCOPE state (#microscope) and let the camera
 *      settle.
 *   3. Paste this whole file into the dev console.
 *   4. Repeat at 1440x900 and at 1920x1080 minimum, treating each as a
 *      genuinely different composition, not a resize of the same one: a live
 *      camera at a fixed FOV shows more or less of the actual scene as the
 *      canvas aspect ratio changes, unlike the old object-fit:cover crop,
 *      which kept the same content centred at any size. A pass at one
 *      viewport says nothing about the other.
 *   5. Check Safari explicitly. backdrop-filter over a <canvas> specifically
 *      (not an <img>) has a history of being less reliable there than over
 *      Chromium; do not assume a Chrome pass generalises.
 *
 * REQUIREMENTS
 *   - Specimen cards carry data-frost="2" (or adjust the selector below) so
 *     they are sampled at the --frost-2 alpha rather than --frost-1.
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

  const live = document.querySelector('[data-bench-canvas]') || document.querySelector('.scene__canvas canvas')
  if (!live) {
    console.warn('composite-audit: no live canvas found. Nothing to composite against yet.')
    return
  }

  const rect = live.getBoundingClientRect()
  const ground0 = getComputedStyle(document.documentElement).getPropertyValue('--ground-0').trim()
  const blur = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--frost-1-blur'),
  ) || 20
  const PAD = Math.ceil(blur * 3) // backdrop-filter pulls samples from outside

  const canvas = document.createElement('canvas')
  canvas.width = Math.ceil(rect.width) + PAD * 2
  canvas.height = Math.ceil(rect.height) + PAD * 2
  const ctx = canvas.getContext('2d', { willReadFrequently: true })

  // The canvas is alpha:true with no scene background (deliberate, App.tsx),
  // so pixels outside the model silhouette are transparent, not the page
  // ground. Paint the real page background first, exactly as a real viewer's
  // compositor does, or transparent regions read as false-black.
  ctx.fillStyle = ground0 || '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.filter = `blur(${blur}px)`

  // Draws at its own CSS size, 1:1. The canvas is not object-fit cropped, it
  // fills .scene__canvas directly, so no scale/letterbox math is needed here
  // (unlike the earlier baked-still version of this file, which sampled a
  // static image and had to reproduce its object-fit: cover crop by hand).
  ctx.drawImage(live, PAD, PAD, rect.width, rect.height)

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
