# Bench Portfolio

**An interactive 3D lab bench as a personal portfolio.** A stylized, high-key lab scene where four objects are alive: click the **microscope** to zoom into research, the **notebook** for publications and patents, the **calendar** for an interactive timeline, and the **computer** for AI projects. It is built to be explored, not skimmed. A traditional resume carries the fast-read load; this is the playground.

> This README is **live**. It is updated as development proceeds. The status table and build log below are the current truth of what is built, in progress, or planned. If a section here claims more than the repo can back up, that is a bug (see `CLAUDE.md` Invariant 1.9).

---

## Status

**Current phase: Phase 1 (vertical slice), in progress. Stages A (toolchain) and B (token layer) are done; the state machine is next.**
**Last updated: 2026-08-31.**

Status vocabulary: **Planned** (designed, not built) · **In progress** (being built now) · **Implemented** (built and works) · **Live** (deployed and reachable) · **Placeholder** (stand-in art or data, not final).

| Component | Status |
|---|---|
| Product spec, design system, engineering contract, agent roster | **Implemented** (this repo's `.md` files) |
| Project scaffold (React + Vite + TypeScript, GSAP) | **Implemented** (toolchain only, no UI) |
| Design tokens (`styles/tokens.css`) | **Implemented** (verified in-browser) |
| Bench scene: master still + hotspots + hover-glow | **Planned** |
| State machine + `#hash` deep links + Back-to-Bench + onboarding | **Planned** |
| Crossfade-plus-scale transition (GSAP) | **Planned** |
| Microscope console (viewfinder, specimen cards, HUD crosshairs) | **Planned** |
| Research content (`content/research.ts`) | **Planned** |
| Spline master + microscope stills | **Planned** (Placeholder art used until produced) |
| Notebook / Calendar / Computer objects | **Planned** (Phase 2) |
| Deployment to Vercel | **Planned** |
| Mobile pass, sound, focus-knob, metric bars | **Planned** (later polish) |

---

## The concept

A pristine, near-monochrome lab bench in cool blues and sterile whites, objects like specimens under glass. Four interactive objects:

- **Microscope → research.** Zoom into a viewfinder console where research items float as glass specimen cards. Phase 1 content: the PDAC / Schwann-cell whole-organ 3D histology work, plus other research.
- **Notebook → publications and patents.** A top-down archival spread, editorial and monochrome so the figures provide the only color.
- **Calendar → timeline.** A scrubbable chronology of experiences with a glowing "today" marker and pop-out deep dives.
- **Computer → AI projects.** A high-key terminal-style console presenting the code projects.

## What this is not

- **Not a real-time 3D engine.** The bench is pre-baked stylized imagery with faked 2D transitions, for speed and craft over raw fidelity. "Photorealistic" is not a goal.
- **Not a resume replacement.** It is a playground; the resume does the fast-read work.
- **Not dark mode.** The whole experience is high-key by law (`DESIGN.md`).
- **Not mobile-first.** Desktop-first by decision; a reduced mobile pass is later polish.

## Tech stack

- **React + Vite + TypeScript**, static build.
- **GSAP** (with Draggable and InertiaPlugin) for timeline-based motion: the zoom transitions, and later the focus-knob and calendar scrub.
- **No backend.** No server, no accounts, no secrets in the client.
- **Deploy:** Vercel, auto-building from `main`.

## Quickstart

```bash
npm install
npm run dev         # local dev server
npm run typecheck   # the real gate
npm run build       # production build (runs typecheck first)
npm run preview     # serve the production build
```

## Documentation

| File | What it holds |
|---|---|
| [PRODUCT.md](PRODUCT.md) | What the project is, who it is for, the phase plan, and content models |
| [DESIGN.md](DESIGN.md) | The visual law (high-key), the token system, and every component's rationale |
| [CLAUDE.md](CLAUDE.md) | Engineering invariants: the contract the code holds itself to, plus the decision record |
| [AGENTS.md](AGENTS.md) | The specialist-review roster used to develop this project |
| [IDEA.md](IDEA.md) | The original idea doc. Archival and superseded: read it for history, never implement from it |

## Scope and honest limitations

Stated here rather than buried.

1. **Greenfield.** As of 2026-08-31 the code does not exist yet; only the spec and docs do. The status table above is the source of truth.
2. **The Spline scene is net-new work** and the one asset on the critical path. Until it exists, the build runs on labeled placeholder images, and any placeholder in production is marked Placeholder above.
3. **Phase 1 wires only the microscope.** The other three objects are intentionally inert (glow plus a "coming soon" plaque) until Phase 2.
4. **Desktop-only for now.** Mobile is a planned reduction, not a Phase 1 deliverable.
5. **Some decisions can only be settled by looking** (does the fake zoom convince, is the focus-knob worth building). Those are tracked as open questions in `CLAUDE.md` Section 7 and are deliberately not pre-decided.

---

## Build log

Newest first. Add a dated entry at the end of every phase or meaningful change, and update the status table above to match. This is the "live" part of the README.

### 2026-08-31 (Stage B)

- Built the token layer: `styles/tokens.css`, `base.css`, and `console.css`, wired in `main.tsx` in the fixed, load-bearing order.
- **Amended `DESIGN.md` before writing any CSS.** Writing the file exposed that the design system could not fully specify it: Invariant 1.6 requires spacing and type values to come from `tokens.css`, but `DESIGN.md` defined no spacing scale and no type scale, and left `--frost-edge` and the promised shadows valueless. Four amendments recorded as D10 to D13. The design system stays the source of truth; the stylesheet did not quietly become it.
- Committed the font stacks as system stacks (D10), deliberately reversible.
- Resolved the CSS Modules versus global CSS conflict between `PRODUCT.md` Section 6 and `CLAUDE.md` Section 2 in favour of global CSS, since Section 2's load order is binding.
- **Verified in a live browser, not asserted.** All 15 ink-on-ground pairs were measured from rendered pixels via `getComputedStyle`, and every tier clears its floor: `--ink-0` 12.62 to 14.19, `--ink-1` 7.32 to 8.24, `--ink-2` 4.70 to 5.29, `--accent-deep` 5.66 to 6.37. Measured values match the derivation exactly. A sweep of every element confirmed no dark surface anywhere (Invariant 1.1).
- The focus ring was verified by pressing Tab, not by reading the CSS. Two earlier readings were discarded as meaningless: `getComputedStyle` on an unfocused button returns the default outline, and a programmatic `.focus()` does not trigger `:focus-visible`. Under real keyboard focus the ring resolves to `rgb(27, 151, 127)`, exactly `--accent`, at 3px with a 2px offset.
- Audited Invariant 1.6 mechanically: no raw hex outside `tokens.css`, no hex or raw px in any component, no emoji in chrome.
- This satisfies the `CLAUDE.md` Section 3 requirement for a live-browser check on any change to `tokens.css` or a console surface. The KNOWN GAP itself is unchanged: the check was manual, and `tools/audit.mjs` still does not exist.
- `App.tsx` currently renders a temporary token-proof surface so the above could be measured. It is labelled as temporary and Stage C deletes it.

### 2026-08-31 (Stage A)

- Scaffolded the toolchain: React 19.2 + Vite 8.2 + TypeScript 5.9, with GSAP 3.15. No UI, no tokens, no state machine. `App.tsx` renders a labelled placeholder on purpose.
- The four `npm` scripts now exist exactly as `CLAUDE.md` Section 3 specifies, and `build` runs `typecheck` first.
- **Verified the gate rather than assuming it.** With a deliberate type error introduced, `npm run typecheck` exits 2 and `npm run build` exits 2 without ever reaching Vite, so typecheck genuinely blocks the build. Reverting returns both to exit 0.
- **Verified the GSAP plugins named in D4.** `Draggable` and `InertiaPlugin` both resolve from the public `gsap` package with type definitions, and register cleanly. Worth recording because both were historically Club GreenSock only, which would have made D4 unbuildable on the free tier.
- Declared `<meta name="color-scheme" content="light">` in `index.html`. Without it a visitor whose OS is in dark mode gets the browser's dark UA defaults before any of our CSS loads, which is a dark surface and therefore a defect under Invariant 1.1. The explicit ground still arrives with `base.css` in Stage B.
- Set Vite's dev and preview port from `PORT`. Vite does not read it on its own, so tooling that assigns a port was being silently ignored and the server landed elsewhere.
- Pinned TypeScript to 5.9 rather than the current 7.0. TypeScript 7 is the new native compiler and this project's build gate depends on `tsc` being dependable, so that move is worth making deliberately later, not by default now.
- The `CLAUDE.md` Section 3 KNOWN GAP is unchanged: there is still no automated visual or contrast audit, and typecheck is not a substitute for one.

### 2026-08-31 (later)

- Cleared the two blockers standing in front of Phase 1. No application code yet; the status table above is unchanged and still correct.
- **Runtime.** Node was not installed on the development machine, so the mandatory `npm run typecheck` gate could not run at all. Installed Node v26.8.1 / npm 11.19.0. Recorded as D8 in `CLAUDE.md` Section 7, which also closes the package-manager gap left open by D4.
- **Palette.** Committed the accent hue (cold mint, hue 168) and derived the full ink and accent hex values against the contrast floors in `DESIGN.md` Section 2.2, verified against all three grounds rather than chosen by eye. Values and measured ratios now recorded in `DESIGN.md` Sections 2.2 and 2.3, decision recorded as D9. These are flat-swatch numbers and do not discharge the requirement to re-verify against the blurred-bench composite once that render exists.
- Fixed structural drift in the `CLAUDE.md` Section 2 tree, which did not list `.claude/agents/` or `.gitignore`.
- Added the original idea doc to the repo as `IDEA.md` (renamed from `3D personal profolio idea.md`, correcting the filename typo), with its text preserved verbatim under an archival header that maps each of its six contradictions to the governing decision that resolved it. It is history, not a spec.
- **Corrected a false claim in `PRODUCT.md` Section 10.** That section stated the PDAC/Schwann-cell abstract was available in the owner's idea doc. It is not: `IDEA.md` is a design and UX plan and contains no portfolio content at all. The research content is still not in this repo.
- Added `.gitignore`, which the `CLAUDE.md` Section 2 tree listed but which did not exist.
- Still blocked on the owner: the research content itself (abstract, publication list, patent numbers) has no source in this repo, so `content/research.ts` cannot be populated with anything verified. The type-family tokens (`--font-sans`, `--font-mono`) are also still unset.

### 2026-08-31

- Authored the founding docs: `PRODUCT.md` (spec and phase plan), `DESIGN.md` (visual law and tokens), `CLAUDE.md` (invariants and decision record), `AGENTS.md` (roster), and this README.
- Locked the founding decisions via a grilling session (see `CLAUDE.md` Section 7): personal-playground purpose, pre-baked stylized assets, high-key palette law, React + Vite + TS + GSAP, owner-built Spline scene with placeholder-first building, crossfade-plus-scale transitions, and a microscope-first Phase 1.
- Code not yet scaffolded. Next: scaffold the project and build the Phase 1 slice.
