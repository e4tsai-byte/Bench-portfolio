# Bench Portfolio: Agent Roster

Eight specialist agents, each owning a slice of the project and, more importantly, knowing what it does not own. The roster exists because this project sits at the intersection of four genuinely different disciplines: a baked 3D scene (an art asset), a React interaction layer (engineering), timeline-based motion (a distinct craft from component engineering), and a set of factual portfolio claims (which must be true, not just well-formatted). Collapsing any two of these is how the project ships something that looks finished and is either off-brand, janky, or subtly false.

Agents are defined in `.claude/agents/`. The invariants they enforce live in `CLAUDE.md`.

---

## The roster

| Agent | Owns | Called when |
|---|---|---|
| **scene-artist** | The Spline scene, the baked stills, camera framings, and the 3D look in `DESIGN.md` Section 1 | Producing or reframing a render, judging whether a still matches the master, choosing export settings |
| **frontend-engineer** | `components/`, `scenes/`, `state/`, `App.tsx`, `main.tsx`, `index.html`, the placeholder-swap discipline | Building or refactoring UI, the state machine, hotspots, a typecheck failure |
| **motion-engineer** | GSAP timelines, the crossfade-plus-scale transition, Draggable/scrub interactions, easing and durations | Any transition, the focus-knob, the calendar scrub, a move that feels wrong |
| **brand-designer** | `styles/`, the tokens, `DESIGN.md`, the high-key law: blocking on palette | Tokens, visual treatment, visual drift, any surface that risks going dark |
| **ux-designer** | Information architecture, the navigation model, onboarding, what appears in a focused state | Designing a view, deciding what shows mid-zoom, the escape-hatch behavior |
| **content-steward** | `content/*.ts`, the accuracy of every research, publication, patent, timeline, and project claim: blocking on claim accuracy | Adding or editing portfolio content, any user-visible factual claim |
| **product-strategist** | `README.md`, `PRODUCT.md`, the phase plan, the status vocabulary: blocking on outward claims | Outward-facing docs, deciding what is next, whether a status label is honest |
| **architect** | `CLAUDE.md`, module boundaries, the invariant list, arbitration | Where code belongs, agent conflicts, structural drift, recording a waiver |

---

## The boundaries that matter most

### scene-artist ≠ frontend-engineer

The **scene-artist** owns the image: the model, the lights, the camera framing, whether the microscope close-up is consistent with the master shot. The **frontend-engineer** owns everything that happens when a user points at that image: the hotspot regions, the state change, the render loop. Collapse them and you get the classic failure of this project category: a beautiful render nobody can navigate, or a slick interaction layer wired to art that does not hold up when you zoom. The seam between them is the matching-filename placeholder contract (`CLAUDE.md` 1.3), which lets both work in parallel without waiting on each other.

### motion-engineer ≠ frontend-engineer

Building a component is not the same skill as choreographing a camera move. The **frontend-engineer** makes the microscope console exist and mount. The **motion-engineer** owns how you arrive at it: the fast-in slow-out timeline, the depth-of-field blur resolving on the destination, the reduced-motion cut. The doc's whole promise is the feel of the fly-through, and that feel is a timeline, not a render of a component appearing.

### brand-designer ≠ ux-designer

The **brand-designer** governs the aesthetic identity and the tokens (is this on-palette, is this frosted correctly, is anything drifting dark). The **ux-designer** governs whether a person can actually use the thing (can they find the way out, is the onboarding legible, does the focused state hide what it should). These roles hold productive tension; the architect arbitrates. A screen can be perfectly on-brand and still trap the user, and it can be perfectly usable and quietly off-palette.

### content-steward ≠ product-strategist

The narrow but real split at the outward edge. The **content-steward** owns whether a **fact** is true: is this the right patent number, is this publication venue correct, did this role run these dates. The **product-strategist** owns whether a **claim** is honest: does the README say "Implemented" about something that is still a placeholder, does the framing outrun what the repo can back up. A patent number can be perfectly accurate and still sit under a status label that lies about how finished the section is. Both have blocking authority, in different directions.

---

## Collaboration pipelines

### Adding a new bench object (Phase 2)

```
product-strategist  → confirms the object is in scope for this phase (Invariant 1.7)
        ↓
scene-artist        → frames and exports the object's still, consistent with the master
        ↓
ux-designer         → designs the focused view: layout, what shows, the way back
        ↓
brand-designer      → confirms tokens and the high-key law; no new accent, no dark surface
        ↓
content-steward     → supplies and verifies the content in content/<object>.ts.  BLOCKING.
        ↓
frontend-engineer   → builds the scene component and wires the hotspot to the state machine
        ↓
motion-engineer     → builds the transition into and out of the object
        ↓
product-strategist  → updates the README status table and build log.  BLOCKING on claims.
```

The chain is complete before the object is announced as done. Nothing is marked Implemented until it is built, wired, and honestly labeled.

### Changing a render or asset

```
scene-artist        → re-exports; keeps filenames identical so it is a drop-in swap
        ↓
brand-designer      → confirms the new still holds the palette and the frost reads correctly
        ↓
frontend-engineer   → verifies hotspot positions still align to the object in the new still
        ↓
product-strategist  → if this promotes a placeholder to real art, updates the status table
```

### Any outward-facing claim

```
product-strategist  → drafts the copy or status
        ↓
content-steward     → PASS, or BLOCKED with the inaccurate fact named
        ↓
product-strategist  → PASS, or the claim is softened to what the repo can back up
        ↓
architect           → records the decision if a status label is waived
```

### A transition or motion change

```
motion-engineer     → proposes, with the feel trade stated
        ↓
ux-designer         → confirms it does not hide the way out or fight reduced-motion
        ↓
brand-designer      → confirms durations and easing come from the motion tokens
        ↓
architect           → records the decision if it departs from the documented defaults
```

Blocking authority belongs to brand-designer (the palette law), content-steward (claim accuracy), and product-strategist (outward claims). They do not negotiate; they can be overruled only in writing, in `CLAUDE.md` Section 7, with a date and a reason.

---

## What this roster is currently pointed at

Phase 1, the vertical slice: the full bench render (placeholder first), the microscope wired end to end (viewfinder mask, specimen cards from `research.ts`, static HUD crosshairs), the other three objects glowing with "coming soon" plaques, and the whole thing deployed live on Vercel. Every agent's Phase 1 job is scoped to that slice. The Spline scene is the one net-new asset on the critical path (scene-artist), and the placeholder contract is what keeps everyone else unblocked while it is produced.
