# Bench Portfolio: Product Description & Build Spec

**Repo:** github.com/e4tsai-byte/Bench-portfolio
**Owner:** Ethan Tsai
**Status:** Phase 1 in progress. Toolchain, token layer, navigation state machine, real-time bench scene, and all content files are built; the microscope console, hover glow, onboarding hint, the owner's models, and deployment remain. This document is the build brief, but where it and `CLAUDE.md` disagree, `CLAUDE.md` Section 7 (the decision record) is authoritative, because several parts of this file have been superseded in place. See `README.md` for live status.
**Style note for all generated prose in this project (READMEs, copy, comments): no em-dashes. Use commas, colons, or parentheses.**

---

## 1. One-line summary

An interactive 3D "lab bench" personal portfolio: a stylized, high-key lab scene where four objects (microscope, notebook, calendar, computer) are clickable and zoom into dedicated content views (research, publications/patents, timeline, AI projects).

## 2. Purpose and audience

This is a **personal playground built to the owner's taste**, not a lead-conversion funnel. A traditional resume carries the recruiter load, so the site does NOT need to optimize for fast skimmers, and it does NOT need a "skip to substance" escape path. If a recruiter has time, they can explore; if not, they use the resume. Design decisions should favor delight, craft, and the owner's aesthetic preferences over conversion metrics.

## 3. Goals and non-goals

**Goals**
- A memorable, tactile, "specimen under glass" experience that feels like a precision instrument.
- Every real credential (research, publications, patents, AI projects, timeline) reachable within one or two interactions.
- Ship something live and complete-looking fast, then extend.

**Non-goals (explicit)**
- NOT photorealistic. The word "photorealistic" from the original idea doc (`IDEA.md`) is retired and stays retired. Since D20 the bench *is* real-time 3D, but the target is a stylized, high-key, matte look, which is deliberately the cheapest thing to render well in real time.
- NOT mobile-first. Phase 1 is desktop only (see Section 11).
- NOT a CMS-backed or server-rendered app. It is a static single-page build.
- NOT dark mode. See the palette law below.

## 4. The visual law (governs everything)

One rule overrides all borrowed references: **the experience is high-key. There is no dark mode anywhere.**

- Palette: cool blues and sterile whites. Near-black ink on luminous white for contrast. Objects feel clinical, precise, slightly alien, like specimens under glass.
- "Glow" means an element becomes brighter and whiter with a cold rim-light, never a neon emission against black.
- Sub-interfaces (the microscope console, and later the notebook/calendar/computer views) are **luminous-white consoles** with cold rim-light and a **single cool accent** (mint or violet) for active states.
- The original idea doc (`IDEA.md`) contains contradictory "Midnight Command Center," "near-black background," and "dark-mode modal" language for the microscope and calendar. **All such references are reinterpreted to their high-key, inverted equivalent.** Do not implement any dark surface.

## 5. Fidelity and asset strategy

**Superseded 2026-09-03 by D20.** This section originally specified pre-baked stills. The bench is now a **single real-time 3D scene** (Three.js via React Three Fiber) containing all four objects, with one camera state per bench state. Transitions are real camera moves.

Still **not photorealistic**: the look is stylised, high-key, and matte, which is deliberately the cheapest thing to render well in real time. The goal D2 retired stays retired.

**Why the change.** The owner authors and iterates the 3D files. On the baked path every model tweak cost two re-exports, a registration check, a contrast re-verification, and two large binaries committed to a public repo. On this path it costs a file drop and a refresh. One scene and one lighting rig also make master-to-object consistency structural instead of verified per export.

**Baking is retained as a fallback, not deleted.** Stills can be captured from this same scene at any time and fed to a 2D crossfade. If the real camera move disappoints, that costs a capture rather than a rebuild.

**Asset ownership and unblocking**
- Ethan creates, edits, and exports the models.
- The interaction layer is built against **primitive placeholder geometry defined in code**, so nothing waits on the models. A real model drops into `src/assets/models/` under the filename the scene already expects (Invariant 1.3), and the object's transform, camera state, and hotspot do not move.
- **Only export-ready optimised `.glb` is committed.** Source files stay out of this public repository.

## 6. Tech stack

- **React + Vite + TypeScript** (static SPA).
- **GSAP** for motion, including the `Draggable` and `InertiaPlugin` plugins (chosen over Framer Motion because the design leans on timeline-based choreography: eased zoom moves, a scrubbable calendar, a focus-knob scroll, all of which GSAP timelines and Draggable handle better than component enter/exit animation).
- No UI framework required. Hand-rolled components with CSS Modules or a lightweight styling approach. Keep the bundle light.
- Static build output, deployed to **Vercel** (Section 12).

## 7. Project structure (proposed)

```
Bench-portfolio/
  index.html
  package.json
  vite.config.ts
  tsconfig.json
  PRODUCT.md                     (this file)
  src/
    main.tsx
    App.tsx                      (mounts the state machine)
    state/
      benchMachine.ts            (single-page finite state machine)
    scenes/
      Bench.tsx                  (master still + hotspots + onboarding)
      Microscope.tsx             (Phase 1 console)
      Notebook.tsx               (Phase 2)
      Calendar.tsx               (Phase 2)
      Computer.tsx               (Phase 2)
    components/
      Hotspot.tsx                (interactive region over the bench still)
      BackToBench.tsx            (persistent escape control)
      OnboardingHint.tsx         (one-time, localStorage-gated)
      ViewfinderMask.tsx         (circular lens mask)
      SpecimenCard.tsx           (floating glass research card)
      HudCrosshairs.tsx          (static flavor overlay)
    content/
      research.ts                (microscope data)
      publications.ts            (notebook data)
      patents.ts                 (notebook data)
      timeline.ts                (calendar data)
      aiProjects.ts              (computer data)
    three/
      BenchScene.tsx             (the R3F scene: lights, objects, materials)
      CameraRig.tsx              (camera state per bench state, GSAP moves)
      Model.tsx                  (.glb loader, token material mapping, seating)
      palette.ts                 (token bridge: tokens.css into the scene)
      motion.ts                  (EASE + the eyepiece-dive keyframes, D25)
    assets/
      models/                    (export-ready .glb only; filenames are the 1.3 contract)
      renders/                   (baked stills, only if the 1.2 fallback is taken)
    styles/
      tokens.css                 (palette, spacing, type scale)
  public/
```

## 8. Navigation, state, and transitions

**State machine** (`benchMachine.ts`): a single-page finite state machine with states `BENCH`, `MICROSCOPE`, `NOTEBOOK`, `CALENDAR`, `COMPUTER`. No server router.
- Optional `#hash` deep links (`#microscope`) so the browser back button and shareable links work. Sync hash to state on load and on transition.
- A persistent **"Back to Bench"** control is visible in every non-BENCH state.
- **Onboarding:** on first visit only, show a dismissible hint pointing at the glowing hotspots. Persist dismissal in `localStorage` (key e.g. `bench.onboarded`). (localStorage is fine here: this is a deployed site, not an in-conversation preview.)

**Transition system** (`three/CameraRig.tsx`, GSAP). **Superseded 2026-09-03 by D20**: this was a crossfade plus scale between two stills, and is now a real camera move.
- Mechanism: **one camera state per bench state** for every state's resting destination, animated with GSAP. Both the camera position and its look-at target are animated; animating position alone and re-pointing at the end produces a visible snap at the finish. **Amended 2026-09-04 by D25** for MICROSCOPE specifically: a genuine, user-initiated bench-to-microscope transition plays a three-leg timeline (the eyepiece dive) rather than a single tween, ending in a deliberate whiteout (`DESIGN.md` 10.5). The single-camera-state model still governs every other transition, and still governs MICROSCOPE's own resting state (used by reduced motion, first paint, and a direct `#microscope` link, none of which ever see the dive).
- Easing: fast-in, slow-out (`power3.out`), no overshoot.
- Duration read from the motion tokens, so a camera move and a CSS hover cannot drift apart.
- `prefers-reduced-motion` cuts straight to the destination with no travel, and so does the first paint, which is an arrival rather than a transition. Verified in-browser, not assumed.
- Retained fallback: stills can be captured from this same scene and fed to the old 2D crossfade if the real move disappoints. That path is kept in the docs deliberately (Invariant 1.2 as amended).

## 9. Model production brief (owner-built asset)

**Superseded 2026-09-03 by D20.** This section was a brief for baking stills out of Spline. The bench is now one real-time scene, so what the owner delivers is **models, not renders**.

What is needed, in priority order:

1. `bench.glb` and `microscope.glb` unblock Phase 1. The other three are Phase 2.
2. Export-ready optimised `.glb` only. Source files stay out of this public repo (D21).
3. Filenames are the swap contract (Invariant 1.3): `bench.glb`, `microscope.glb`, `notebook.glb`, `calendar.glb`, `computer.glb`. Never versioned, always overwritten in place.
4. Model with the origin at the object's base, **Y up, and the object's front facing +Z**. The scene normalises scale and seats the base at y=0 from the model's own bounding box, so size and origin drift are handled automatically, but facing is not something code can infer. A model authored facing the wrong way is corrected by a documented rotation in `BenchScene.tsx` rather than silently, which is what `microscope.glb` currently needs.
5. Keep materials simple. The scene applies its own materials from the token bridge, and any baked-in colour is an Invariant 1.6 violation the moment it lands.
6. Silhouette matters more than detail: hotspots and hover glow read off the silhouette, and each object needs to stay visually separable from its neighbours in the bench view.

The palette, lighting, and legibility constraints in `DESIGN.md` Section 10 still apply, but they are now scene settings the code owns rather than render settings baked into a PNG.

### Historical: the original Spline still-baking brief

Deliver these exports from one Spline scene so all stills stay consistent:

1. **Master bench still.** The full bench, straight-on or slight three-quarter angle, all four objects (microscope, notebook, calendar, computer) present, lit, and legibly separated so each can carry a hotspot. Cool-blue/white palette, soft cold rim-light, shallow depth of field acceptable. Export at 2x the largest display size intended (target long edge ~3000 px), PNG.
2. **Microscope framed still.** A close, centered composition of the microscope as if the camera flew in. Same scene, same lights. This is the backdrop for the viewfinder console.
3. **Notebook framed still** (Phase 2). Top-down-ish, book closed or just opening.
4. **Calendar framed still** (Phase 2).
5. **Computer framed still** (Phase 2).

Guidance: keep object placement identical between the master and each framed shot (the framed shot is a closer camera on the same layout, not a re-composition), so the crossfade reads as a zoom rather than a cut. Export lighting baked in. Provide a version with transparent background if any object needs to float over the console.

Until these exist, the implementing agent proceeds on labeled placeholders with matching filenames.

## 10. Content model

All content already exists (owner-confirmed) and drops into typed data files. Define and export these shapes. Fill `research.ts` in Phase 1; the rest in Phase 2.

```ts
// content/research.ts  (Microscope, Phase 1)
export interface ResearchItem {
  id: string;
  title: string;
  role: string;            // e.g. "Author", "Research intern"
  org: string;
  period: string;          // e.g. "2024 to present"
  field: ("AI" | "Biotech" | "Wet-lab")[];
  abstract: string;        // full text, e.g. the PDAC/Schwann-cell abstract
  summary: string;         // one to two sentence card blurb
  links?: { label: string; url: string }[];
  figure?: string;         // optional image path
}
export const research: ResearchItem[];

// content/publications.ts  (Notebook, Phase 2)
export interface Publication {
  id: string; title: string; authors: string; venue: string;
  year: number; doi?: string; url?: string; tags: string[];
  contribution?: string;               // what the owner actually did (D19)
}

// content/patents.ts  (Notebook, Phase 2)
export interface Patent {
  id: string; title: string; number: string;   // "" when none issued yet
  status: "Granted" | "Provisional" | "Pending";
  year: number; url?: string;
  jurisdictions?: string[];            // where it is granted (D19)
  summary?: string;                    // what it actually does (D19)
}

// content/timeline.ts  (Calendar, Phase 2)
export interface TimelineEntry {
  id: string; title: string; org: string; location?: string;
  start: string; end?: string;         // ISO or "YYYY-MM"
  role: string; techStack?: string[]; description: string;
  kind?: "role" | "education" | "award";  // awards have no model of their own (D19)
}

// content/aiProjects.ts  (Computer, Phase 2)
export interface AiProject {
  id: string; name: string; blurb: string; description: string;
  stack: string[]; repo?: string; demo?: string; highlights: string[];
}
```

Phase 1 research content includes the PDAC/Schwann-cell whole-organ 3D histology work plus the owner's other research items as additional specimen cards.

**Correction (2026-08-31):** an earlier version of this section stated the abstract was available in the owner's idea doc. That is not true. `IDEA.md` is a design and UX plan and carries no portfolio content: no abstract, no publication list, no patent numbers. The research content is not anywhere in this repo yet. The owner must supply it before `research.ts` can hold anything verified, and until then the microscope console has no true content to render (Invariant 1.5, content-steward blocking).

## 11. Phasing and acceptance criteria

**Phase 1: the vertical slice (build first, ship live)**
- Full bench scene (models, or placeholder primitives) renders as the landing scene.
- All four objects are hoverable and glow on hover.
- Selecting the microscope triggers the camera move into the microscope console.
- Microscope console (high-key, luminous white): circular **viewfinder lens mask**, **floating specimen cards** for the research items, **static HUD crosshairs** in the corners.
- The calendar and computer glow on hover and show a small **"coming soon" plaque**; they are not wired to a view. The **notebook is an exception since D28/D29**: its hotspot navigates, it plays an opening flip on arrival, and it has a real content view.
- Persistent "Back to Bench" control. One-time onboarding hint. `#microscope` deep link works.
- Deployed to Vercel and reachable at a live URL.
- Acceptance: from the live URL, a user can land on the bench, hover to see all four objects glow, click the microscope, read the research cards inside the viewfinder, and return to the bench, on desktop, with the high-key palette throughout and no dark surfaces.

**Deferred within the microscope (not Phase 1):** the draggable focus-knob scroll (ship plain scroll first, it is a feel-dependent gimmick), and the animated research-metric bars (decorative, and pending which metrics to show).

**Phase 2: replicate the pattern**
- Notebook (publications and patents): top-down spread, editorial archival grid, table-of-contents left / document viewer right. High-key, monochrome UI so figures provide the only color.
- Calendar (timeline): scrubbable horizontal axis (GSAP Draggable), milestone blocks, a glowing "today" marker, pop-out deep-dive cards. High-key glass-morphism, not dark.
- Computer (AI projects): a "sub-interface" locked to the screen, terminal-inspired but high-key (luminous console, mint or violet accent), presenting Rehabibi, PanIN-segment, and other AI work.

**Later polish (backlog)**
- Focus-knob interaction and metric-bar data-viz in the microscope.
- Subtle mechanical transition sounds (whir/click) with a persistent mute toggle, off until first interaction.
- Mobile pass: serve the master still with tappable hotspots that open each object's panel directly, skipping the cinematic transitions.
- Optional pre-rendered hero clip for the microscope move.
- Custom domain.

## 12. Deployment

- Static Vite build. Deploy to **Vercel**, auto-building from the `Bench-portfolio` repo on every push to the main branch. Free tier.
- Use the Vercel subdomain initially. Custom domain is a later, optional step (add DNS records when a domain is chosen).

## 13. Open, deliberately deferred, "look at it first" questions

These cannot be answered by planning; they need a running build to react to. Do not block on them.
- Exact feel of the zoom transition (settle after seeing Phase 1 live; upgrade to a pre-rendered clip only if needed).
- Whether the focus-knob is worth building versus plain scroll.
- Which research metrics (if any) deserve the animated bars.

## 14. First actions for the implementing agent

Kept as the original plan of record. Items 1, 2, 4, and 6 are **done**; 3 and 5 were **superseded by D20**; 7 and 8 remain.

1. ~~Scaffold React + Vite + TypeScript. Add GSAP (with Draggable, InertiaPlugin).~~ Done, Stage A.
2. ~~Create `styles/tokens.css` and wire a global reset.~~ Done, Stage B.
3. ~~Generate labeled placeholder images with the final filenames.~~ **Superseded by D20:** placeholders are primitive geometry in code at the final transforms, and the owner delivers `.glb` models rather than stills.
4. ~~Build the bench state machine, persistent Back-to-Bench, and the deep links.~~ Done, Stage C. The one-time onboarding hint is still outstanding.
5. ~~Build the GSAP crossfade-plus-scale transition.~~ **Superseded by D20:** the transition is a real camera move in `three/CameraRig.tsx`. The microscope console (viewfinder mask, specimen cards, HUD crosshairs) is still outstanding.
6. ~~Populate `research.ts`.~~ Done, with the real abstract.
7. Deploy to Vercel and return the live URL. **Outstanding.**
8. Leave the other three objects inert with "coming soon" plaques for Phase 2. **Partly superseded (D28/D29):** the notebook now has a navigating hotspot, an opening-flip arrival, and a content view. Calendar and computer: Holding.
