# Bench Portfolio

**An interactive 3D lab bench as a personal portfolio.** A stylized, high-key lab scene where four objects are alive: click the **microscope** to zoom into research, the **notebook** for publications and patents, the **calendar** for an interactive timeline, and the **computer** for AI projects. It is built to be explored, not skimmed. A traditional resume carries the fast-read load; this is the playground.

> This README is **live**. It is updated as development proceeds. The status table and build log below are the current truth of what is built, in progress, or planned. If a section here claims more than the repo can back up, that is a bug (see `CLAUDE.md` Invariant 1.9).

---

## Status

**Current phase: Phase 1 (vertical slice) — not yet started.**
**Last updated: 2026-08-31.**

Status vocabulary: **Planned** (designed, not built) · **In progress** (being built now) · **Implemented** (built and works) · **Live** (deployed and reachable) · **Placeholder** (stand-in art or data, not final).

| Component | Status |
|---|---|
| Product spec, design system, engineering contract, agent roster | **Implemented** (this repo's `.md` files) |
| Project scaffold (React + Vite + TypeScript, GSAP) | **Planned** |
| Design tokens (`styles/tokens.css`) | **Planned** |
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

### 2026-08-31

- Authored the founding docs: `PRODUCT.md` (spec and phase plan), `DESIGN.md` (visual law and tokens), `CLAUDE.md` (invariants and decision record), `AGENTS.md` (roster), and this README.
- Locked the founding decisions via a grilling session (see `CLAUDE.md` Section 7): personal-playground purpose, pre-baked stylized assets, high-key palette law, React + Vite + TS + GSAP, owner-built Spline scene with placeholder-first building, crossfade-plus-scale transitions, and a microscope-first Phase 1.
- Code not yet scaffolded. Next: scaffold the project and build the Phase 1 slice.
