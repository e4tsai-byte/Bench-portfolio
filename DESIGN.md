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

**The one documented exception to "everything is a token in `tokens.css`."** GSAP ease names are strings like `power3.out` and are not valid CSS, so they cannot live in a stylesheet. They live as one exported constant in `Transition.tsx` until a second consumer exists (the focus-knob and the calendar scrub, both Phase 2), at which point they earn a dedicated motion module. The durations stay in `tokens.css` and are read from there, so a duration is never stated twice.

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

The landing surface: the baked master still of the full bench, all four objects present and lit. It is an image plus an interaction layer, not a live 3D canvas. It always offers a way out (there is no way to get "stuck" on the bench, it is the home).

### 4.2 Hotspot

An invisible interactive region positioned over each object. On hover it triggers a cold rim-glow on that object (the object becomes brighter and whiter, per the law) to signal interactivity without a "click here" label. Diegetic: prefer a small brass-plaque style label on the bench over floating UI text.

### 4.3 Transition (crossfade plus scale)

The faked camera fly-through. A GSAP timeline crossfades and scales from the master still to the object's framed still, with a depth-of-field blur on the outgoing layer as the destination resolves. Fast-in, slow-out. This is the cheapest honest implementation of the doc's "macro-zoom" and is the Phase 1 default; a pre-rendered clip is a later, optional upgrade for the hero microscope move only.

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
| < 1024px | Reduced: master still with tappable hotspots that open panels directly, no cinematic transitions | **Planned** (later polish) |

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
