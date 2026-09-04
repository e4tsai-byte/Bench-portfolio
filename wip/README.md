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
| `computer-lowpoly-preview.jpg` | EEVEE render of the laptop, same purpose | n/a |

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
because D16's ceiling (245, since D22) governs *broad* surfaces and this is a
small disc — the same exemption the lens material already used.

Two things this model raised that promotion did not settle, both **resolved
2026-09-04 by D25** (`CLAUDE.md` Section 7), the eyepiece-dive transition:

- **No target survives a centred push.** Tested in Blender: a camera aimed
  between the two oculars passes between the tubes at close range and ends on
  the prism housing, both bores diverging out of frame. The model ships
  `Eyepoint_L`, `Eyepoint_R`, and a centred `Eyepoint_Target` as `.glb` nodes;
  the transition has to pick one side, or fire early. ~~None is wired yet.~~
  **Resolved: committed to `Eyepoint_L`**, wired in `three/CameraRig.tsx`'s
  MICROSCOPE dive timeline (`three/motion.ts` holds the measured keyframes).
  `Eyepoint_R` and `Eyepoint_Target` remain unused; nothing here rules out
  using them later, but no current code reads them.
- **`ms_eye_glow` does not glow.** `Model.tsx` rebuilds every material from
  tokens and drops whatever was baked in Blender, emission included. It
  renders as the brightest flat tier, not a light source. An emissive field on
  `MaterialSpec`, or a light seated at the bore, would be a deliberate
  decision, not something this promotion did on its own. **Resolved: the
  deliberate decision was made.** `MaterialSpec` gained an optional
  `emissive`/`emissiveIntensity` pair, and `ms_eye_glow` is the only material
  using it, neutral `--ground-2` so it carries zero saturation. See
  `DESIGN.md` Section 10.5 for the palette ruling this needed (a full-frame
  whiteout is a genuinely new case Section 10 had not anticipated) and D25
  for the transition it serves.

### 2026-09-04: the laptop, `computer.glb`

Built and promoted the same day, straight to `src/assets/models/computer.glb`,
without parking a `.glb` here first. The promotion conditions were checkable up
front this time, because the loader and its material contract already exist: it
uses five material names already in `MATERIAL_MAP` (`ms_shell`,
`ms_shell_dark`, `ms_metal`, `ms_slide`, `ms_stage`), carries no mint, was
authored facing glTF +Z so `OBJECT_FACING.COMPUTER` stays 0, and took the
filename Invariant 1.3 already declared. Only the preview render is parked here.

**Building it did not touch Invariant 1.7.** The computer is a Phase 2 object,
but this is an asset, not a view: the hotspot still does not navigate,
`#computer` still renders the coming-soon plaque, and no console exists. Same
reasoning as D18 for the Phase 2 content files. The scene already had to
contain all four objects under Invariant 1.2, so this only replaces one
placeholder primitive with the model 1.3 was written to accept.

**The keyboard needed two ink tiers, not one.** Keycaps on `ms_knob` (ink-2)
in a well floored with `ms_stage` (ink-1) rendered as a single slab with
hairline slits: one tier of separation is not enough at bench scale. Caps moved
to `ms_shell_dark` (ink-3), two tiers from the well, plus a 0.006 bevel so each
cap edge catches the key light. A real MacBook's near-black keyboard was never
available under Invariant 1.1, so the keyboard is the ink tiers inverted:
light caps in a darker well.

**Not measured, the same gap the microscope had:** its rendered luminance
against `DESIGN.md` 10.1 and 10.3. The microscope was measured at promotion
(peak 248, 1.27% over the then-235 ceiling); nothing equivalent has been run
for this model, and the ceiling has since moved to 245 under D22. The keyboard
well is the darkest large area on either object, so if anything here fails
10.1's floor when it sits under a console, that is where to look.

### 2026-09-04: the notebook, `notebook.glb`

Sewn hardcover lab notebook, exported closed, rigged to open flat. 624
triangles across 16 meshes, 43K. Built from a written spec compiled out of a
three-round requirements interview rather than from a prose description, at the
owner's instruction.

Twelve decisions were settled before any geometry existed. Two changed the
design outright: the cover title became a **blank recessed label panel**
because `DESIGN.md` 10.3 forbids text in a render, and the ruled pages became a
**runtime-generated grid** rather than a baked texture, because `Model.tsx`
discards texture maps the same way it discarded emission before D25.

**The single-hinge rig in the spec was wrong.** Covers have to swing on a wider
radius than pages, or the flattened spine has nowhere to lie. With one pivot
the spine stayed vertical through the open pose and read as a wall down the
middle of the spread. Three pivots now: `NB_Hinge_Front` (-1.085, covers),
`NB_Hinge_Pages` (-0.985, page halves), `NB_Hinge_Spine` (-1.010, spine at half
angle). Driven to -180/-180/-90 the spread lands flat, both leaves level at
z 0.0872, lowest point exactly 0.

**The page block took two attempts.** Ten leaves per half at 0.13mm gaps
rendered as a solid white band. Eight thicker leaves with irregular fore-edge
insets read as stacked sheets. Same lesson as the laptop's keycaps: at bench
scale, separation must be coarse enough to survive projection.

**`ms_page` exists so the grid has somewhere to land that is not `ms_slide`,**
which the microscope's specimen slide uses.

**Deviation, recorded:** the ribbon is static, not parented to the cover hinge
as the spec said. A bookmark is anchored at the spine and lies on the page;
riding the cover would have flipped it away with the left half.

**Not measured, same standing gap as the other two models:** rendered luminance
against `DESIGN.md` 10.1 and 10.3. The ink-2 cover is a large mid-dark area and
is the most likely thing here to matter when a console sits over it.

### 2026-09-04: the notebook's quadrille grid, generated not baked

`Model.tsx` gained an optional `surface` field on `MaterialSpec`, the third
capability added to the loader after `emissive` (D25). `ms_page` is its only
user today: a 5mm quadrille in `--ink-3` on `--ground-2`.

The pattern is a 64x64 single-cell tile drawn into a canvas from palette
colours, tiled with `RepeatWrapping`. Repeat is derived per mesh from the
geometry's own bounding box, so cells are square in WORLD space rather than in
UV space - a 1.91 x 2.48 page mapped 0-1 would otherwise show rectangles.
Measured on the real leaves: repeat 38 x 50, giving cells of 0.0503 x 0.0496.

Generated rather than baked for three reasons, in descending weight: this loader
rebuilds every material from tokens and discards baked maps, so a baked grid
would ship and render as nothing; a baked line colour is un-tokenisable, which
is the defect Invariant 1.6 exists to catch; and D21 keeps image bytes out of a
public repo's permanent history.

**On DESIGN.md 10.3.** The rule forbids baked UI because baking makes it
un-tokenisable. A generated quadrille satisfies that reason, and it is a surface
pattern rather than UI: no text, no numerals, no HUD marks. Drawing glyphs this
way would be a different question and is deliberately not settled here.

**Verified indirectly, and worth stating.** The notebook ships closed and its
rig is unwired, so the spread leaves are not visible in any current camera
state - the grid cannot be seen in the running app yet. The pipeline was
confirmed by temporarily applying the pattern to the cover material (it
rendered correctly, cells square) and then by a temporary probe logging the
computed repeat for `ms_page`. Both were removed before commit. A visual check
of the grid in place has to wait for the notebook to open.

### 2026-09-04: the calendar, `calendar.glb`

A-frame tent desk calendar matching the placeholder's silhouette: two panels
leaning at 27.5 degrees, spiral binding across the apex, and a printed face on
its own UV-mapped plane. 228 triangles across 16 meshes, 26K. The cheapest
object on the bench, because nearly everything that makes it read as a calendar
is drawn at runtime rather than modelled.

`calendar-lowpoly-preview.jpg` is a Blender render and shows the face **blank**.
That is correct, not a mistake: the printed face does not exist in the `.glb` at
all. It is generated in `Model.tsx` from tokens when the scene mounts, so the
only place to see the finished object is the running app.

**The master prompt for this model said "make the grid GEOMETRY, not texture"
and that instruction was overridden.** It was written while no texture
capability existed. Once `surface` landed, geometry ribs would have been about
0.6px at bench scale - present and invisible, the same failure mode as the
laptop keycaps and the notebook page block. The reason for the instruction
expired before the instruction was executed.

**It draws text, which DESIGN.md 10.3 forbids outright.** Runtime generation
from tokens satisfies the rule's stated reason (tokenisability) but not its
wording. Pending a recorded 10.3 amendment; scoped in code to `ms_calendar_face`
alone, with a comment saying not to copy the pattern elsewhere.

**Measured:** bbox 2.100 x 1.412 x 1.424, front at min Y (glTF +Z, facing 0),
which at the existing `OBJECT_HEIGHT.CALENDAR` of 0.7 gives a bench footprint of
1.032 x 0.694 against the placeholder's 0.78 x 0.60. Slightly wider, and it
fits: the right side of the bench has room where the left did not, so unlike the
notebook this needed no constant change.
