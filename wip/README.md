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
