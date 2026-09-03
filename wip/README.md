# wip/ — scratch work, not part of the build

Nothing in this directory is imported by `src/`, served by Vite, or shipped to
production. It exists so exploratory artefacts have a home that is not
`src/assets/`, where a filename is a contract under Invariant 1.3.

Treat everything here as **Exploratory** in the `README.md` status vocabulary:
it is not a candidate asset until it is deliberately promoted.

## models/

| File | What it is | Status |
| --- | --- | --- |
| `microscope-lowpoly.glb` | Low-poly microscope, 27 objects, 784 triangles, flat-shaded, 7 materials | Exploratory |
| `microscope-lowpoly-preview.jpg` | EEVEE render of the above, for looking at without opening a 3D tool | — |

Generated procedurally in Blender 5.2 through the Blender MCP server as a test
of that toolchain, not as a bid to become the bench microscope. Blender is not
a committed part of the pipeline; no decision record adopts it.

Per **D21**, the `.blend` source is deliberately not committed and is excluded
by `.gitignore`. The `.glb` here is committed because it is small and because
`.glb` is the format D20's real-time scene consumes.

### What would have to be true before this could be promoted

Being the right file format is not the same as being a usable asset. This model
has not been checked against any of the law that governs the render:

- **`DESIGN.md` Section 10 luminance.** Its greys were picked by eye against a
  white viewport, never measured. Broad object surfaces must peak at 235 (D16)
  and hold the floor of 203 under a console.
- **No mint anywhere in the scenery** (D16). It currently carries a cold blue
  tint on the lens parts, which is off-palette and would have to go.
- **Invariant 1.6, tokens only.** Its materials are baked into the file rather
  than driven by `three/palette.ts`, which D21 makes the scene's only source of
  colour. A `.glb` with its own materials bypasses the token bridge entirely.
- **Invariant 1.3 filenames.** Promotion means agreeing a name in
  `src/assets/models/`, not copying this one across.

Until those are settled, this is a shape to look at, nothing more.
