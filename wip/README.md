# wip/ — scratch work, not part of the build

Nothing in this directory is imported by `src/`, served by Vite, or shipped to
production. It exists so exploratory artefacts have a home that is not
`src/assets/`, where a filename is a contract under Invariant 1.3.

Treat everything here as **Exploratory** in the `README.md` status vocabulary:
it is not a candidate asset until it is deliberately promoted.

## models/

| File | What it is | Status |
| --- | --- | --- |
| `microscope-lowpoly-preview.jpg` | EEVEE render, for looking at without opening a 3D tool | n/a |

`microscope-lowpoly.glb` **was promoted on 2026-09-03** and now lives at
`src/assets/models/microscope.glb`. It is in the build. The checklist below is
kept, with each item answered, because the bar it set was the right one.

Generated procedurally in Blender 5.2 through the Blender MCP server as a test
of that toolchain, not as a bid to become the bench microscope. Blender is not
a committed part of the pipeline; no decision record adopts it.

Per **D21**, the `.blend` source is deliberately not committed and is excluded
by `.gitignore`. The `.glb` here is committed because it is small and because
`.glb` is the format D20's real-time scene consumes.

### The promotion checklist, and how each item was answered

Being the right file format is not the same as being a usable asset. Each
condition below was set before promotion and is now resolved:

- **`DESIGN.md` Section 10 luminance.** *Measured, and it failed first time.*
  With the shell mapped to `--ground-2` the rendered peak was 251 with 12.42%
  of object pixels over the D16 ceiling of 235. Broad surfaces were moved to
  `--ground-1` and the lighting rig trimmed, giving a peak of 248 with 1.27%
  over 235, all of it small specular and lens area rather than broad surface,
  and zero clipped pixels. This warning was correct and worth having written.
- **No mint anywhere in the scenery** (D16). *Resolved by the token mapping.*
  The lens parts' baked cold blue no longer reaches the renderer at all,
  because material colours are replaced from the token bridge.
- **Invariant 1.6, tokens only.** *Resolved.* `three/Model.tsx` treats the
  model's material **names** as the contract and takes their colours from
  `three/palette.ts`. The `.glb` no longer bypasses the token bridge: the
  author decides which parts differ, the design system decides what colour they
  are, and an unmapped material name logs a loud warning.
- **Invariant 1.3 filenames.** *Resolved.* Promoted to the name the contract
  already specified in `PRODUCT.md` Section 9, `microscope.glb`, rather than
  carrying the exploratory name across.

One thing this checklist did **not** anticipate, found during promotion: the
model was authored facing -Z, so the bench view showed the back of the
instrument. Facing is now a documented convention (front faces +Z) with a
compensating rotation in the scene, because it is the one property the loader
cannot infer from the file.

**Still not measured:** the whole-frame mean in `DESIGN.md` 10.1. The figures
above cover rendered geometry only, not the composite with the page ground
behind it, and the console legibility check in 10.2 needs the microscope
console to exist first.

### 2026-09-03 addendum: rebuilt as a binocular head

The promoted model above was superseded the same day. `microscope.glb` on
`main` is now a dual eyepiece: a prism housing with two tubes splayed 11
degrees, each a lathed eyecup with a real bored aperture and a bright disc at
the bore floor, built because the eyepiece-zoom transition needs something a
camera can enter. The single ocular this checklist describes was a solid
cylinder with a lens disc on top — nothing to fly into.

The four promotion conditions above still hold for the new geometry: same
material names, same token mapping, same facing convention, no new mint. One
addition to `MATERIAL_MAP`, `ms_eye_glow`, took `--ground-2` without a waiver,
because D16's 235 ceiling governs *broad* surfaces and this is a small disc —
the same exemption the lens material already used.

Two things this model raises that promotion did not settle:

- **No target survives a centred push.** Tested in Blender: a camera aimed
  between the two oculars passes between the tubes at close range and ends on
  the prism housing, both bores diverging out of frame. The model ships
  `Eyepoint_L`, `Eyepoint_R`, and a centred `Eyepoint_Target` as `.glb` nodes;
  the transition has to pick one side, or fire early. None is wired yet.
- **`ms_eye_glow` does not glow.** `Model.tsx` rebuilds every material from
  tokens and drops whatever was baked in Blender, emission included. It
  renders as the brightest flat tier, not a light source. An emissive field on
  `MaterialSpec`, or a light seated at the bore, would be a deliberate
  decision — not something this promotion did on its own.
