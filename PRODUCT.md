# Bench Portfolio: Product Description & Build Spec

**Repo:** github.com/e4tsai-byte/Bench-portfolio
**Owner:** Ethan Tsai
**Status:** Greenfield (empty repo). This document is the build brief. An implementing agent (Claude Code) should treat it as the source of truth and start with Phase 1.
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
- NOT real-time photorealistic 3D. The word "photorealistic" from the original idea doc (`IDEA.md`) is retired. Target is pre-baked stylized 3D imagery.
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

The bench is not a live 3D engine. It is a set of **pre-baked stills**:
- One **master bench still** (the full bench, all four objects present and lit).
- One **framed "zoom" still per object** (a close-up composition of that object, consistent with the master: same model, same lighting).

Transitions between stills are faked in 2D (see Section 8). This keeps load times low, avoids the real-time 3D tax, and stays fully art-directable.

**Asset ownership and unblocking**
- Ethan builds the scene in **Spline** and exports the stills. Section 9 is the precise production brief for that.
- The implementing agent builds the **entire interaction layer against labeled AI-generated placeholder images** so no code work waits on the real renders. Placeholders live in `src/assets/placeholders/` and are swapped for Spline exports when ready. Placeholder filenames must match the final asset filenames so the swap is a drop-in.

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
      Transition.tsx             (GSAP crossfade + scale wrapper)
      ViewfinderMask.tsx         (circular lens mask)
      SpecimenCard.tsx           (floating glass research card)
      HudCrosshairs.tsx          (static flavor overlay)
    content/
      research.ts                (microscope data)
      publications.ts            (notebook data)
      patents.ts                 (notebook data)
      timeline.ts                (calendar data)
      aiProjects.ts              (computer data)
    assets/
      renders/                   (final Spline exports)
      placeholders/              (AI-generated stand-ins, same filenames)
    styles/
      tokens.css                 (palette, spacing, type scale)
  public/
```

## 8. Navigation, state, and transitions

**State machine** (`benchMachine.ts`): a single-page finite state machine with states `BENCH`, `MICROSCOPE`, `NOTEBOOK`, `CALENDAR`, `COMPUTER`. No server router.
- Optional `#hash` deep links (`#microscope`) so the browser back button and shareable links work. Sync hash to state on load and on transition.
- A persistent **"Back to Bench"** control is visible in every non-BENCH state.
- **Onboarding:** on first visit only, show a dismissible hint pointing at the glowing hotspots. Persist dismissal in `localStorage` (key e.g. `bench.onboarded`). (localStorage is fine here: this is a deployed site, not an in-conversation preview.)

**Transition system** (`Transition.tsx`, GSAP):
- Mechanism: **crossfade plus scale** between the master still and the object's framed still. Chosen as the easiest to implement.
- Easing: fast-in, slow-out (e.g. `power3.out`), so the move starts quick and settles gently.
- Apply a **depth-of-field blur** to the outgoing layer as the incoming framed still resolves.
- Keep transitions short (roughly 600 to 900 ms). Provide a reduced-motion path that cuts straight to the destination for users with `prefers-reduced-motion`.
- Deferred option: a single pre-rendered MP4 clip for the hero microscope move, added later ONLY if the 2D fake-zoom feels flat when viewed live. Do not build this in Phase 1.

## 9. Spline scene production brief (owner-built asset)

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
- Full bench master still (or placeholder) renders as the landing scene.
- Four hotspots overlaid on the four objects. All four glow on hover.
- Microscope hotspot triggers the crossfade-plus-scale transition into the microscope console.
- Microscope console (high-key, luminous white): circular **viewfinder lens mask**, **floating specimen cards** for the research items, **static HUD crosshairs** in the corners.
- The other three objects glow on hover and show a small **"coming soon" plaque**; they are not yet wired to a view.
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

1. Scaffold React + Vite + TypeScript in the repo. Add GSAP (with Draggable, InertiaPlugin).
2. Create `styles/tokens.css` encoding the high-key palette, and wire a global reset.
3. Generate labeled placeholder images (master bench + microscope framed still) with the final filenames.
4. Build the bench state machine, hotspots, hover-glow, persistent Back-to-Bench, and the one-time onboarding hint.
5. Build the GSAP crossfade-plus-scale transition and the microscope console (viewfinder mask, specimen cards from `research.ts`, static HUD crosshairs).
6. Populate `research.ts` with the owner's research content (PDAC/Schwann-cell abstract plus other items).
7. Deploy to Vercel and return the live URL.
8. Leave the other three objects as glow + "coming soon" plaques for Phase 2.
