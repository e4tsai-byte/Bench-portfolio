# Bench Portfolio Design System

The interface is governed by one law, stated once here and inherited everywhere: **the experience is high-key. There is no dark mode anywhere in this project.** Every token, component, and console below is a consequence of that law. A surface that goes dark is not a style choice, it is a defect.

A raw hex or px value living in a component is also a defect. Everything is a token, defined once in `styles/tokens.css`, verified in a live browser against the actual baked bench imagery.

---

## 1. Design philosophy: specimen under glass, in daylight

The bench is a pristine, near-monochrome lab in cool blues and sterile whites. Objects are sharp, precise, and slightly alien, like specimens under glass. The reason the ground stays luminous rather than dark is not fashion, it is legibility and mood: contrast comes from near-black ink on luminous white, never from inverting the ground. "Glow" means an element becomes brighter and whiter with a cold rim-light, never a neon emission against black.

The original idea doc (`IDEA.md`, archival) borrows several references that describe dark "command center" aesthetics for the microscope and calendar. Those are reinterpreted, not implemented: every dark reference becomes its inverted high-key equivalent (a luminous white console with cold rim-light and a single cool accent). The doc itself instructs this in its Theme paragraph, and this file makes it binding.

---

## 2. Design tokens

All values are defined in `styles/tokens.css` and referenced by name. The tables below are the source of truth for those definitions.

### 2.1 Grounds

Three cool near-whites, deliberately not cream, sand, or parchment. Warm neutrals are prohibited: they break the clinical, slightly-alien read.

| Token | Value (target) | Role |
|---|---|---|
| `--ground-0` | `#f4f7fa` | Page ground behind the bench |
| `--ground-1` | `#eef2f6` | Console and panel ground |
| `--ground-2` | `#ffffff` | Raised card ground |

### 2.2 Ink

Four ink tiers with verified contrast against the grounds. Do not lighten ink for elegance: light grey text on a tinted near-white is the single most common reason an interface becomes hard to read.

| Token | Value | Role | Min contrast | Measured (worst ground) |
|---|---|---|---|---|
| `--ink-0` | `#1f2c3a` | Primary text, data readouts | 12:1 | 12.62:1 |
| `--ink-1` | `#405064` | Secondary text, labels | 7:1 | 7.32:1 |
| `--ink-2` | `#5d6d81` | Tertiary, captions, HUD flavor | 4.5:1 | 4.70:1 |
| `--ink-3` | `#a0aec0` | Hairlines, dividers | non-text | 2.00:1 |

All four are one cool blue-grey family (hue 213), with saturation dropping as the tier lightens so the pale tiers stay cool without reading as blue. "Measured (worst ground)" is the ratio against `--ground-1` (`#eef2f6`), the darkest of the three grounds and therefore the worst case for dark ink. Every tier is verified against all three grounds, not just one. These are flat-swatch measurements: Section 3 still requires verifying against the actual blurred-bench composite once the render exists.

### 2.3 Accent

A single cool accent, in two tiers. Never introduce a second accent hue without retiring this one. The accent marks active and interactive state only, never decoration.

| Token | Value | Role | Floor | Measured (worst ground) |
|---|---|---|---|---|
| `--accent` | `#1b977f` | Graphical use: glow rims, active hotspot, focus marker | 3:1 non-text | 3.23:1 |
| `--accent-deep` | `#196b5b` | Text-safe use: accent text and small icons on light ground | 4.5:1 | 5.66:1 |

**The hue is committed: cold mint, hue 168, cyan-leaning so it never warms toward yellow-green.** It reads as instrument light against cool white without warming the palette. Recorded as D9 in `CLAUDE.md` Section 7; changing it requires retiring this accent, not adding a second one.

Note the consequence of a high-key ground: because `--accent` must clear 3:1 against a near-white ground to serve as the focus ring (Section 3, items 3 and 5), it lands as a deep instrument teal rather than a pale mint. The pale, bright quality of a "glow" comes from white per Section 1, with the accent as the cold tint at its rim, not from the accent being light itself.

### 2.4 Materials

Translucent white "frost" tiers for consoles and floating cards. Each material is an ambient field plus a specular sheen plus a bright cold edge and a soft shadow. There is no dark material in this project (the bench is never a camera feed, so nothing needs to sit over video).

| Token | Value | Role |
|---|---|---|
| `--frost-1` | `rgba(255,255,255,0.66)` | Console ground over the blurred bench |
| `--frost-1-blur` | `20px` | Backdrop blur for the console tier |
| `--frost-2` | `rgba(255,255,255,0.80)` | Floating specimen card |
| `--frost-2-blur` | `12px` | Backdrop blur for the card tier |
| `--frost-edge-inner` | `rgba(255,255,255,0.78)` | The bright cold rim, inset |
| `--frost-edge-outer` | `rgba(160,174,192,0.45)` | Cool hairline, `--ink-3` at alpha |
| `--frost-edge` | composite of the two above | The bright edge on every frosted surface |

The edge is two strokes, not one: a bright inset white rim that reads as specular sheen, plus a cool outer hairline so the surface still has a defined boundary where it sits against a light ground. The outer hairline is `--ink-3` at alpha rather than a new grey, so the edge cannot drift off-palette.

Shadows are a material property, so they are tokens too. They derive from `--ink-0` at low alpha, never from pure black: black shadows on a cool near-white ground read as muddy grey and warm the palette, which Section 2.1 prohibits.

| Token | Value | Role |
|---|---|---|
| `--shadow-1` | `0 1px 2px rgba(31,44,58,0.06), 0 2px 6px rgba(31,44,58,0.05)` | Resting card lift |
| `--shadow-2` | `0 2px 6px rgba(31,44,58,0.07), 0 8px 24px rgba(31,44,58,0.08)` | Floating specimen card |
| `--shadow-3` | `0 4px 12px rgba(31,44,58,0.09), 0 16px 48px rgba(31,44,58,0.10)` | Console shell |

### 2.5 The stacking rule

Never stack one light translucent surface directly on another: two frosts in a row turn to milk and lose their edges. A frosted card sits on the blurred bench render or on an opaque ground, never on another frost. Violations should be caught by a token/style audit, not by eye.

### 2.6 Type

A clean, compact sans-serif for headlines and navigation, paired with a monospace for data points (publication dates, patent numbers, coordinates, timeline years). The monospace is what sells the "research instrument" read. Telemetry-style numerals are always tabular so they do not jitter as they change.

| Token | Value | Use |
|---|---|---|
| `--font-sans` | `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` | Headlines, labels, body |
| `--font-mono` | `ui-monospace, "SF Mono", SFMono-Regular, "Cascadia Mono", "Roboto Mono", Menlo, Consolas, monospace` | Dates, IDs, coordinates, metrics |

**Committed as system stacks**, deliberately and reversibly. They cost no network request and cause no layout shift, which serves the "keep the bundle light" constraint in `PRODUCT.md` Section 6, and the mono stack is ordered to prefer the instrument-grade monospaces that are already installed (`SF Mono` on macOS, `Cascadia Mono` on Windows) before falling back. If the mono ever fails to sell the research-instrument read, swapping in a webfont is a one-line change to this token and nothing else.

**The type scale.** Seven steps on a roughly 1.25 ratio off a 16px base. Desktop-first per Section 6.

| Token | Value | Use |
|---|---|---|
| `--text-xs` | `0.75rem` (12px) | HUD flavor, micro-badges |
| `--text-sm` | `0.875rem` (14px) | Captions, tags, metadata |
| `--text-base` | `1rem` (16px) | Body |
| `--text-lg` | `1.25rem` (20px) | Card titles |
| `--text-xl` | `1.5625rem` (25px) | Panel headings |
| `--text-2xl` | `1.9375rem` (31px) | Console headings |
| `--text-3xl` | `2.4375rem` (39px) | Display |

| Token | Value | Use |
|---|---|---|
| `--lh-tight` | `1.15` | Display and headings |
| `--lh-snug` | `1.3` | Card titles, short labels |
| `--lh-normal` | `1.55` | Body copy |
| `--lh-mono` | `1.45` | Monospace readouts |
| `--fw-regular` | `400` | Body |
| `--fw-medium` | `500` | Labels, active states |
| `--fw-semibold` | `600` | Headings |
| `--tracking-wide` | `0.08em` | Small uppercase HUD labels only |

### 2.7 Motion

Motion is timeline-based (GSAP), not spring-based. Every transition uses fast-in, slow-out easing so a move starts quickly (a sense of travel) and settles gently (details resolve). There is no overshoot or bounce curve in this system, deliberately: instruments do not wobble.

| Token | Duration | Curve |
|---|---|---|
| `--dur-fast` | 180ms | `power2.out` |
| `--dur-move` | 700ms | `power3.out` (the object zoom) |
| `--dur-settle` | 900ms | `power3.out` (with DoF blur resolve) |

Not every move is a GSAP timeline. Hover glows and focus rings are CSS transitions, so the curves above have CSS equivalents that must match, or the same gesture would ease differently depending on which layer drew it.

| Token | Value | Mirrors |
|---|---|---|
| `--ease-out-2` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | GSAP `power2.out` |
| `--ease-out-3` | `cubic-bezier(0.215, 0.61, 0.355, 1)` | GSAP `power3.out` |

**The one documented exception to "everything is a token in `tokens.css`."** GSAP ease names are strings like `power3.out` and are not valid CSS, so they cannot live in a stylesheet. They live as one exported constant, `EASE` in `three/CameraRig.tsx` since D20, until a second consumer exists (the focus-knob and the calendar scrub, both Phase 2), at which point they earn a dedicated motion module. The durations stay in `tokens.css` and are read from there, so a duration is never stated twice.

### 2.8 Spacing

A 4px base grid, eight steps. Chosen to sit cleanly under the radius tiers in Section 8: at a 4px grid, the 8, 18, 24, and 32px radii all land on or between whole steps, so padding and corner never fight each other.

| Token | Value | Typical use |
|---|---|---|
| `--sp-1` | `0.25rem` (4px) | Hairline gaps, icon nudges |
| `--sp-2` | `0.5rem` (8px) | Tag and badge padding |
| `--sp-3` | `0.75rem` (12px) | Tight stacks |
| `--sp-4` | `1rem` (16px) | Default gap |
| `--sp-5` | `1.5rem` (24px) | Card padding |
| `--sp-6` | `2rem` (32px) | Panel padding |
| `--sp-7` | `3rem` (48px) | Console padding |
| `--sp-8` | `4rem` (64px) | Scene-level insets |

---

## 3. Accessibility floor

These are acceptance criteria, not aspirations.

1. All text meets its tier's minimum contrast against the actual composite it sits on (verify against the blurred bench, not a flat swatch).
2. `prefers-reduced-motion` cuts straight to the destination still: no zoom, no blur animation.
3. Every interactive element (hotspot, Back-to-Bench, card) has a visible cold-rim focus ring, reachable by keyboard.
4. Hotspot hit targets are at least 44x44 px of clickable area, even when the visible object edge is smaller.
5. Interactive state is never signaled by the accent hue alone: pair it with a rim-light, scale, or label change so it survives color-blindness and `prefers-contrast`.
6. The onboarding hint is dismissible by keyboard and does not trap focus.

---

## 4. Key components

Each component exists for a stated reason. Measurements live in tokens.

### 4.1 Bench (master scene)

The landing surface: the full bench, all four objects present and lit. **Amended by D20:** this is a live 3D canvas, not an image plus an interaction layer. It always offers a way out (there is no way to get "stuck" on the bench, it is the home), and it is the only state that is reachable with no hash.

### 4.2 Hotspot

An invisible interactive region positioned over each object. On hover it triggers a cold rim-glow on that object (the object becomes brighter and whiter, per the law) to signal interactivity without a "click here" label. Diegetic: prefer a small brass-plaque style label on the bench over floating UI text.

### 4.3 Transition (camera move)

**Amended by D20: this was a faked crossfade plus scale and is now a real camera move.** A GSAP timeline animates the camera position and its look-at target together, from the bench framing to the object's framing. Animating position alone and re-pointing at the end produces a visible snap at the finish, so both are tweened. Fast-in, slow-out, no overshoot, duration from the motion tokens. `prefers-reduced-motion` cuts straight to the destination, and so does the first paint, which is an arrival rather than a transition.

The old crossfade remains a documented fallback: stills can be captured from this same scene at any time if the live move disappoints.

### 4.4 Viewfinder mask

A circular lens-shaped mask framing the microscope console content, so the user feels they are looking through the scope rather than at a dashboard. High-key: luminous field inside the lens, cold vignette at the rim, not a dark scope.

### 4.5 Specimen card

A floating frosted-glass card (`--frost-2`) for a single research item, with a thin luminous border. On hover it pulses brighter (rim-light, per the law). Cards float inside the viewfinder as specimens.

### 4.6 HUD crosshairs

Static corner crosshairs and coordinate markers in the viewfinder. Pure flavor to make the console read as scientific equipment. Non-interactive, `--ink-2`, monospace.

### 4.7 Back-to-Bench

The persistent escape control, visible in every non-bench state, so a user never feels trapped in a zoomed view. Corner-anchored, always the same position.

### 4.8 Onboarding hint

A one-time, dismissible hint pointing at the glowing hotspots, teaching orbit/zoom/interact. Shown on first visit only, dismissal persisted in `localStorage` (`bench.onboarded`). It is a teacher, not a gate.

---

## 5. The one-focus rule

Exactly one object is in focus at a time. The bench is the neutral home; entering an object is a committed state with a single subject and a single way back. Nothing competes with the focused object for attention: secondary chrome drops to `--ink-2` and sits at the periphery.

---

## 6. Responsive

Desktop-first, by decision. Phase 1 targets a pointer and a large viewport.

| Breakpoint | Behavior | Status |
|---|---|---|
| >= 1024px | Full experience: hotspots, zoom transitions, consoles | Phase 1 |
| < 1024px | Reduced: a static bench framing with tappable objects that open panels directly, no camera moves. Whether that is a captured still or the live scene with transitions disabled is an open call (D20 keeps both available) | **Planned** (later polish) |

Mobile is explicitly out of Phase 1. It is a reduction of the desktop experience, never a co-equal redesign.

---

## 7. Invariant: no dark surfaces, no emoji chrome

Two prohibitions the audit enforces:

- **No dark surface anywhere.** Backgrounds, consoles, modals, and overlays are all high-key. Any near-black ground is a defect, regardless of which reference inspired it.
- **No emoji in UI chrome.** Labels, plaques, tags, and consoles use SVG marks or typographic micro-badges built from tokens, never emoji. Emoji render inconsistently across platforms and break the clinical, precise read.

---

## 8. Container and card hierarchy

A three-tier corner-radius system keeps nested surfaces concentric, plus a micro tier for small elements.

| Token | Radius (target) | Use |
|---|---|---|
| `--r-2xl` | 32px | Console shell |
| `--r-xl` | 24px | Panels inside a console |
| `--r-lg` | 18px | Specimen cards |
| `--r-sm` | 8px | Tags, plaques, badges |

A card inside a panel steps down one radius tier, so nested surfaces never share an edge radius.

---

## 9. Brand and bench identity

The bench itself is the brand: the cool-white lab, the specimen-under-glass framing, the single cold accent. If a wordmark or favicon is needed, build it in pure SVG from the same tokens (a thin cold spine or a lens-arc motif), never a raster or an emoji. The identity is the restraint, not a logo.

---

## 10. Render constraints

Sections 1 through 9 govern the interface and quietly assume the imagery beneath it. This section governs the imagery itself, because what sits behind a console is not decoration: it is the material the interface has to stay legible against.

**Amended 2026-09-03 (D20).** These constraints were written for baked stills and now govern a **live scene**. Two things change, and one gets harder:

- The luminance and quiet-zone numbers below are unchanged. They are derived from the token values and the frost alpha, and neither moved.
- They are now **scene settings the code owns** (lights and materials in `three/`, colours via `three/palette.ts`) rather than properties baked into a PNG. That makes them easier to hit and easier to correct.
- **The guarantee is harder.** A baked still is a fixed set of pixels you measure once. With a live camera, what sits under the console changes as the camera moves, so the quiet-zone rule must hold **across every camera state**, not one frame. The composite audit becomes a per-state check.

Enforcer: brand-designer (blocking), with scene-artist producing. These constraints were derived from the committed token values, not estimated.

### 10.1 The luminance law

The console is `--frost-1`, which is 66% white. The effective backdrop under console text is therefore `0.66 x 255 + 0.34 x bench`. Working backwards from the Section 2.2 ink floors gives a hard floor on the render itself.

| Where | Constraint | Why |
|---|---|---|
| Bench under a `--frost-1` console | **203 absolute floor, 215 to 245 target** | The composite must reach 237 for `--ink-1` at 7:1 and `--ink-2` at 4.5:1 |
| Bench under a `--frost-2` card | 166 absolute, 200+ target | The card is 80% white, so it forgives more |
| Bench under a focus ring drawn directly on it | **234** | `--accent` needs 3:1 and gets no help from a frost layer |
| Whole-frame black point | 90, and only in tiny contact shadows | Below this it stops being high-key |
| Whole-frame mean | 210 | High-key is a histogram fact, not a mood |
| Clipped pure white | at most 0.5% of pixels | Only on rim hairlines. Blown areas destroy the glow headroom in 10.3 |

At exactly 215 the composite lands at 241 and reproduces the same ratios as the flat `--ground-1` swatch, so nothing in the token system has to change. The binding tier is `--ink-1` at 7:1, not `--ink-0`: a legible headline does not imply a legible label.

### 10.2 The quiet zone

Whatever sits behind a console is a backdrop, not a picture. Section 2.5 forbids stacking frost on frost, which removes every CSS remedy for a bad backdrop: darkening the console violates Invariant 1.1, pushing the frost opaque destroys the material, a scrim under the text is a second frost, and lightening the ink violates Section 2.2. The fix has to be in the scene, not in CSS.

Since D20 that fix is cheap (move a light, move the camera, adjust a material) where it used to mean a re-render, but the rule must now hold **in every camera state** rather than in one baked frame.

Every object framing reserves a quiet zone:

- **Extent:** the central 76% of width by 68% of height, plus a margin of one blur radius beyond the console edge. `--frost-1-blur` is 20px, so extend the zone about 40px past the console. `backdrop-filter` samples outside the element's bounds, so detail just outside the console bleeds inward.
- **Value:** 215 to 245, per 10.1.
- **Flatness:** after a 20px blur, values across the zone vary by no more than 12 levels. This is separate from the darkness rule. A field averaging 220 that swings 190 to 250 makes one line of caption text drift from 7:1 to about 4:1 mid-sentence, which reads as a rendering bug rather than as a contrast problem.
- **No hard edges crossing it.** A table lip or shadow boundary survives the blur as a soft luminance step, and text crossing that step visibly changes weight.

Composition resolves this rather than fighting it: high-frequency geometry belongs in the outer band, and the illuminated stage field belongs in the centre, which is both the most legible backdrop and the most honest image of looking through a scope.

### 10.3 Light, colour, and glow in the render

- **Key to fill ratio at most 2:1.** High-key is a low contrast ratio, not merely a bright image. A 6:1 ratio with a bright key still yields deep shadows and fails 10.1.
- **Nothing below 5500K, and no coloured lights.** Testable rule: for every neutral pixel, blue is greater than or equal to red, targeting a `B - R` difference of +4 to +14. The ink family is hue 213 and the accent is hue 168, both cyan-side; a warm ground places a yellow-orange field under cyan-side ink, which does not read as contrast, it reads as dirty.
- **Cold rim light is a 1 to 3px hairline** tracing the silhouette, peaking at 245 to 255. If it reads as a soft aura, that is bloom, and bloom is prohibited: it produces exactly the coloured halo Section 1 rules out.
- **Broad object surfaces peak at 245** (raised from 235 by D22). A brightness increase for a hover or active state needs somewhere to go, so a near-white surface leaves it dead. 245 is the top of the 10.1 composite target range rather than a new figure invented for this purpose, so no other measured value in this document has to change to accommodate it.
- **Baked glow is a white pool on a surface**, ramping about 245 to 255 with a short falloff — the same width as the rim-light band above, starting where a broad surface now tops out. Never an emissive saturated material, never bloom, never a lens flare, and never a lit screen that is not white.
- **No mint in the render, at all.** `--accent` means "this is active or interactive". Putting hue 150 to 190 in the scenery retires that meaning and turns the accent into decoration, which Section 2.3 forbids in the same sentence that defines it.
- **No baked UI.** No text, HUD crosshairs, coordinate marks, glow rings, focus rings, or plaque type in the render. All of that is CSS driven by tokens, and baking it makes it un-tokenizable (Invariant 1.6). **Amended by D26: the word that carries this rule is BAKED. A pattern generated at runtime from tokens is not baked and is governed by 10.6 instead. Interface chrome stays forbidden in the render regardless of how it is produced.**

### 10.4 Model export

**Amended by D20: the deliverable is models, not stills.**

- **Export-ready optimised `.glb` only.** Source files stay out of this public repository (D21).
- **Origin at the object's base, Y up, and the front facing +Z.** Scale and origin drift are normalised at load from the model's own bounding box, so those are forgiving. Facing is not: code cannot infer which side is the front, so a wrongly-facing model gets a documented rotation in `BenchScene.tsx` rather than a silent one.
- **Keep materials simple.** The scene applies its own materials from the token bridge, so a baked-in colour is an Invariant 1.6 violation the moment it lands.
- **Silhouette over detail.** Hotspots and hover glow read off the silhouette, and each object must stay visually separable from its neighbours in the bench framing.

If the 1.2 fallback is ever taken and stills are captured from this scene, the old export rules reapply: sRGB always (a Display P3 tagged PNG renders more saturated in the browser and no longer matches the tokens beside it), and about 1% dither, because large near-white gradients band visibly in 8-bit and this scene is almost entirely large near-white gradients.

### 10.5 The deliberate whiteout (D25)

Added by D25 for one specific moment: the eyepiece-dive arrival in MICROSCOPE, where the camera ends inside the ocular looking at nothing but the `ms_eye_glow` disc, and the console then sits on that white field with no scene left behind it at all.

Every rule in 10.1 to 10.3 was written assuming a console sits over a *busy* render, text staying legible against varied content. None of them anticipated a frame that is deliberately, entirely white, and one of them (10.1's "clipped pure white, at most 0.5% of pixels") reads as a direct conflict with that moment if applied literally. It is not: that rule protects glow headroom on an otherwise-varied scene, and does not apply once the scene's own job *is* to be the glow. This section is the exception, scoped narrowly, so a future reader does not have to guess whether the conflict is a bug.

- **Mechanism: a real `--ground-2` DOM overlay, cross-dissolving with a neutral emissive on `ms_eye_glow`, never bloom.** Bloom is blocked outright (D16, D22): it produces exactly the coloured halo Section 1 prohibits, and that reasoning does not change just because the target is intentional here. The emissive is `--ground-2` (zero saturation), so it does not trip "never emissive saturated" (10.3): that rule protects the accent's meaning from decoration, not brightness itself.
- **The overlay is the guaranteed floor, the render is not trusted alone.** Pixel-perfect geometry alignment is not required to hold across every viewport and every future model re-export; the DOM overlay is what actually guarantees the literal white, so a small render discrepancy at the edges never becomes a visible failure.
- **Persists for the whole visit, not a momentary flash.** Once revealed, the overlay stays at full opacity until the user leaves MICROSCOPE. "No bench visible" is a property of being in the state, not just the instant of arrival.
- **Gated on a real user transition, never on load.** Reduced motion, first paint, and a direct `#microscope` link all land on the ordinary three-quarter framing (10.2's resting quiet-zone measurement, D24) and never see the whiteout. Landing cold on full white with no context for where you are would be more disorienting than the standard treatment, not less.
- **Scoped to this one moment.** This section does not relax 10.1's clipped-white ceiling, or 10.3's broad-surface ceiling, anywhere else in the render. A future full-white moment elsewhere needs its own brand-designer ruling, not an appeal to this one.

### 10.6 Runtime-generated object surfaces (D26)

Some objects cannot read as what they are without markings on them. A calendar without a month grid is a blank card; a lab notebook without ruling is a stack of paper. 10.3 forbids that outright, and the object then fails the only job it has on the bench, which is to be recognisable at a glance.

The rule 10.3 is protecting is tokenisability, stated in its own text: "baking it makes it un-tokenizable". A pattern drawn at runtime from `three/palette.ts` is not baked. `tokens.css` remains the single source of truth, the pattern restyles itself if a token changes, and the repository ships no image bytes (which D21 also wants). So this section permits the generated case and leaves the baked case exactly as prohibited as it was.

**Permitted.** Patterns and lettering that belong to the depicted object as a physical thing: a notebook's ruling, a calendar's month grid and day numbers, a printed label field. These are part of the object, the way its silhouette is.

**Still forbidden, by any means.** HUD crosshairs, coordinate marks, glow rings, focus rings, plaque type, callouts, and any label that is really interface. Those are CSS, driven by tokens, and interactive. Generating them into a texture instead of baking them would evade 10.3's letter while defeating its purpose.

The distinction is not decorative-versus-functional, it is **object-versus-interface**. If a real person looking at the real object would see the marking printed on it, it belongs to the object. If it exists to tell the *user of this site* something, it is interface and stays in the DOM.

Conditions, all binding:

- **Generated from tokens, never baked.** Colours come from `palette.ts` and type families from `readFonts()`. A hardcoded colour or font stack in a generated surface is the same defect as a raw hex in a component (Invariant 1.6).
- **Nothing meaningful may exist only in the render.** Canvas text is invisible to assistive technology, unselectable, unsearchable, and untranslatable. Generated lettering must therefore be decorative: the calendar's numerals say nothing a user needs. The moment real content has to appear on an object, it must also exist in the DOM, and Section 3 governs it there. This is the hard limit on this section, and the reason it is not an open licence.
- **The palette law is unchanged.** No accent hue in a generated surface (D16), and 10.1's luminance law still governs the surface as rendered.
- **Each surface is a decision, not a precedent.** Two exist: `ms_page` (quadrille ruling, no glyphs) and `ms_calendar_face` (month grid with numerals). A third needs its own ruling, recorded, not an appeal to this section.

**Why the geometric alternative was rejected, measured rather than assumed.** Modelling the grid as raised ribs keeps text out of the render entirely and was the original plan. At the bench camera the calendar stands about 0.7 world units tall, and ribs at a plausible thickness project to roughly 0.6px: present in the file and invisible on screen. That is the same failure the laptop keycaps and the notebook page block each demonstrated before it. A mipmapped texture survives projection at every distance; thin geometry does not.

### 10.7 The bench worktop (D27)

The bench is a real lab bench, and the single most recognisable thing about one is a dark epoxy resin worktop. The owner supplied a reference photograph and chose the dark top explicitly, knowing what it costs. This section records the cost rather than letting the model quietly contradict Section 1.

**This is a genuine exception to the high-key law, not a reinterpretation of it.** Section 1 says a surface that goes dark is a defect, and 10.1 sets a 203 floor. The worktop is `--ink-1` and clears neither. Measured on the live `BENCH` render: minimum 45, mean 178, maximum 252, with **48.8% of opaque pixels below 203**. Stating that plainly is the point of this section.

**What the floor was protecting still holds, and that was measured too.** 10.1 exists so text on a translucent console stays legible over whatever sits behind it. `tools/composite-audit.js` measures that directly, against the live canvas, reporting the worst pixel under each text element. Run against this bench it returns **PASS, 0 failures**, in both `BENCH` (9 elements) and `CALENDAR`. The consoles clear their floors because they sit over the white casework, the floor, and the page ground rather than over the worktop itself, and because `--frost-1` plus its blur lifts what little they do overlap. The blanket floor is violated; the outcome it is a proxy for is not.

Conditions:

- **Scoped to the worktop.** Consoles, cards, plaques, page grounds, and every DOM surface remain high-key absolutely. This section permits one dark object surface in the render; it does not open the door to a dark UI, and Invariant 1.1 is otherwise untouched.
- **The composite audit becomes mandatory for any new camera state.** The pass above is a property of where the current consoles happen to sit. A future state that puts a console directly over the worktop could fail, and the only way to know is to run the audit in that state. Do not infer from this section that the bench is safe behind consoles generally.
- **The casework blue is a reinterpretation, not an exception.** The reference's saturated blue drawer fronts are `--ink-2`. The ink family is already hue 213 cool blue-grey, so this introduces no second accent hue and leaves Section 2.3 and D16 fully intact. Only the worktop needed a ruling.
- **One measured value sits above the ceiling too.** The maximum of 252 is a specular sweep across the worktop, small in area rather than a broad surface, so D22's 245 broad-surface ceiling is not what it tests. Recorded here because it showed up in the same measurement and should not look like an oversight later.
