# Bench Portfolio Design System

The interface is governed by one law, stated once here and inherited everywhere: **the experience is high-key. There is no dark mode anywhere in this project.** Every token, component, and console below is a consequence of that law. A surface that goes dark is not a style choice, it is a defect.

A raw hex or px value living in a component is also a defect. Everything is a token, defined once in `styles/tokens.css`, verified in a live browser against the actual baked bench imagery.

---

## 1. Design philosophy: specimen under glass, in daylight

The bench is a pristine, near-monochrome lab in cool blues and sterile whites. Objects are sharp, precise, and slightly alien, like specimens under glass. The reason the ground stays luminous rather than dark is not fashion, it is legibility and mood: contrast comes from near-black ink on luminous white, never from inverting the ground. "Glow" means an element becomes brighter and whiter with a cold rim-light, never a neon emission against black.

The original idea doc borrows several references that describe dark "command center" aesthetics for the microscope and calendar. Those are reinterpreted, not implemented: every dark reference becomes its inverted high-key equivalent (a luminous white console with cold rim-light and a single cool accent). The doc itself instructs this in its Theme paragraph, and this file makes it binding.

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

| Token | Role | Min contrast |
|---|---|---|
| `--ink-0` | Primary text, data readouts | 12:1 |
| `--ink-1` | Secondary text, labels | 7:1 |
| `--ink-2` | Tertiary, captions, HUD flavor | 4.5:1 |
| `--ink-3` | Hairlines, dividers | non-text |

### 2.3 Accent

A single cool accent, in two tiers. Never introduce a second accent hue without retiring this one. The accent marks active and interactive state only, never decoration.

| Token | Role |
|---|---|
| `--accent` | Graphical use: glow rims, active hotspot, focus marker |
| `--accent-deep` | Text-safe use: accent text and small icons on light ground |

Choose the hue once (mint or violet) and commit. Default recommendation: cold mint. It reads as instrument light against cool white without warming the palette.

### 2.4 Materials

Translucent white "frost" tiers for consoles and floating cards. Each material is an ambient field plus a specular sheen plus a bright cold edge and a soft shadow. There is no dark material in this project (the bench is never a camera feed, so nothing needs to sit over video).

| Token | Alpha / blur (target) | Role |
|---|---|---|
| `--frost-1` | `rgba(255,255,255,0.66)`, blur 20 | Console ground over the blurred bench |
| `--frost-2` | `rgba(255,255,255,0.80)`, blur 12 | Floating specimen card |
| `--frost-edge` | cold white 1px inner rim | The bright edge on every frosted surface |

### 2.5 The stacking rule

Never stack one light translucent surface directly on another: two frosts in a row turn to milk and lose their edges. A frosted card sits on the blurred bench render or on an opaque ground, never on another frost. Violations should be caught by a token/style audit, not by eye.

### 2.6 Type

A clean, compact sans-serif for headlines and navigation, paired with a monospace for data points (publication dates, patent numbers, coordinates, timeline years). The monospace is what sells the "research instrument" read. Telemetry-style numerals are always tabular so they do not jitter as they change.

| Token | Use |
|---|---|
| `--font-sans` | Headlines, labels, body |
| `--font-mono` | Dates, IDs, coordinates, metrics |

### 2.7 Motion

Motion is timeline-based (GSAP), not spring-based. Every transition uses fast-in, slow-out easing so a move starts quickly (a sense of travel) and settles gently (details resolve). There is no overshoot or bounce curve in this system, deliberately: instruments do not wobble.

| Token | Duration | Curve |
|---|---|---|
| `--dur-fast` | 180ms | `power2.out` |
| `--dur-move` | 700ms | `power3.out` (the object zoom) |
| `--dur-settle` | 900ms | `power3.out` (with DoF blur resolve) |

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
