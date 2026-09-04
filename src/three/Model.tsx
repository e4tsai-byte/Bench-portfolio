/**
 * Model.tsx
 *
 * Loads an owner-authored .glb and makes it obey the design system.
 *
 * INVARIANT 1.3, the swap contract. Models are discovered, not imported: drop
 * `microscope.glb` into `src/assets/models/` and it replaces the primitive with
 * no code change, delete it and the primitive returns. That is the placeholder
 * swap the invariant asks for, implemented rather than merely promised.
 *
 * INVARIANT 1.6 / D21, colour. A model arrives with its own baked material
 * colours, and nothing in a .glb respects tokens.css. So the model's material
 * NAMES are treated as the contract, and their colours are replaced from the
 * token bridge. The author controls which parts differ; the design system
 * controls what colour they are. An unmapped material name is logged loudly
 * rather than silently accepted, because a quietly off-palette surface is
 * exactly the defect Invariant 1.6 exists to catch.
 *
 * NORMALISATION. The model is scaled to a target height and seated so its base
 * sits at y=0, measured from its own bounding box. This means a re-export at a
 * different scale, or a model whose origin drifted, still drops in without
 * re-tuning the camera states.
 */
import { useMemo } from 'react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import {
  Box3,
  CanvasTexture,
  Color,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  RepeatWrapping,
  SRGBColorSpace,
  Vector3,
} from 'three'
import { readFonts, readPalette, type Fonts, type Palette } from './palette'

/**
 * SURFACE PATTERNS, and why they are drawn here rather than shipped in the .glb.
 *
 * A ruled page needs a pattern, and the obvious way to get one is to bake an
 * image into the model. That fails twice over. This loader rebuilds every
 * material from tokens, so a baked map is discarded before it ever renders (the
 * same way emission was, until D25 added a field for it); and a baked line
 * colour is un-tokenisable, which is exactly the defect Invariant 1.6 exists to
 * catch. D21 adds a third reason: image bytes in a .glb are permanent in a
 * public repo's history.
 *
 * So the pattern is generated at runtime into a canvas, using palette colours.
 * `tokens.css` stays the single source of truth, the repo ships zero image
 * bytes, and the pattern restyles itself if a token ever changes.
 *
 * DESIGN.md 10.3 forbids BAKED UI on the grounds that baking makes it
 * un-tokenisable. A generated pattern satisfies that reason, and DESIGN.md 10.6
 * (D26) now governs the generated case explicitly: markings that belong to the
 * depicted object are permitted, interface chrome is not, by any means. The
 * quadrille below is the easy case - a surface pattern with no glyphs at all.
 */
type SurfaceSpec =
  | {
      kind: 'quadrille'
      /** Line colour, from the palette like every other colour in the scene. */
      line: keyof Palette
      /** Cell size in model units, i.e. before Model's normalising scale. */
      cell: number
    }
  | {
      /**
       * A month grid drawn across the whole face: header band, weekday strip,
       * 7x5 cells, and numerals.
       *
       * THIS ONE DRAWS TEXT. That is governed by DESIGN.md 10.6 (D26), which
       * permits markings belonging to the depicted object as a physical thing,
       * generated at runtime from tokens rather than baked. 10.3 still forbids
       * the baked case, and forbids interface chrome - HUD marks, focus rings,
       * plaque type - by ANY means, generated or not. The line is
       * object-versus-interface.
       *
       * 10.6's binding condition is accessibility: canvas text is invisible to
       * assistive technology, so nothing meaningful may exist only here. These
       * numerals qualify because they say nothing a user needs - a generic
       * 30-day month, no year, no real date, so also not an outward claim
       * (1.9). Real content on an object must also live in the DOM.
       *
       * A third generated surface needs its own recorded ruling, not an appeal
       * to this one.
       */
      kind: 'calendar'
      line: keyof Palette
      ink: keyof Palette
      header: keyof Palette
      headerInk: keyof Palette
    }

const tileCache = new Map<string, CanvasTexture>()

/**
 * One cell, tiled. Cheaper and crisper than drawing a whole sheet: 64x64 is
 * power-of-two so it mipmaps cleanly, which is what stops the grid aliasing
 * into noise when the object is small on screen.
 */
function quadrilleTile(background: string, line: string): CanvasTexture {
  const key = `${background}|${line}`
  const cached = tileCache.get(key)
  if (cached) return cached

  const S = 64
  const canvas = document.createElement('canvas')
  canvas.width = S
  canvas.height = S
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Model: 2D canvas context unavailable for surface pattern')
  ctx.fillStyle = background
  ctx.fillRect(0, 0, S, S)
  // Lines on two edges only; tiling supplies the other two.
  ctx.fillStyle = line
  ctx.fillRect(0, 0, S, 2)
  ctx.fillRect(0, 0, 2, S)

  const texture = new CanvasTexture(canvas)
  texture.wrapS = RepeatWrapping
  texture.wrapT = RepeatWrapping
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 8
  tileCache.set(key, texture)
  return texture
}

/**
 * Repeat count comes from the mesh's own size, so the cells are square in world
 * space rather than square in UV space (a 1.91 x 2.48 page would otherwise show
 * rectangles). Assumes the UV runs u along local X and v along local Z, which
 * is what a Blender XY-plane becomes after the glTF Y-up conversion.
 */
function quadrilleTexture(mesh: Mesh, cell: number, background: string, line: string) {
  const geometry = mesh.geometry
  if (!geometry.boundingBox) geometry.computeBoundingBox()
  const size = geometry.boundingBox!.getSize(new Vector3())
  const texture = quadrilleTile(background, line).clone()
  texture.needsUpdate = true
  texture.repeat.set(
    Math.max(1, Math.round(size.x / cell)),
    Math.max(1, Math.round((size.z || size.y) / cell)),
  )
  return texture
}

/**
 * The calendar face. Drawn whole rather than tiled, because a month grid is a
 * single composition: it has a top and a bottom, unlike a quadrille.
 *
 * Canvas Y runs downward while UV v runs upward, so the whole thing is authored
 * top-down and the geometry's v=1 edge is the header. 1024 wide keeps the
 * numerals legible in the CALENDAR close-up state without a large upload.
 */
function calendarTexture(
  background: string,
  line: string,
  ink: string,
  header: string,
  headerInk: string,
  mono: string,
): CanvasTexture {
  const W = 1024
  const H = Math.round(W / 1.4) // face is 2.06 x 1.46
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Model: 2D canvas context unavailable for calendar face')

  ctx.fillStyle = background
  ctx.fillRect(0, 0, W, H)

  const pad = W * 0.038
  const headerH = H * 0.17
  const weekH = H * 0.095
  const gridTop = headerH + weekH
  const gridH = H - gridTop - pad * 0.6
  const gridW = W - pad * 2
  const colW = gridW / 7
  const rowH = gridH / 5

  // header band: the strongest cue that this is a calendar at bench scale
  ctx.fillStyle = header
  ctx.fillRect(0, 0, W, headerH)
  ctx.fillStyle = headerInk
  ctx.font = `600 ${Math.round(headerH * 0.46)}px ${mono}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  // save/restore rather than resetting letterSpacing to a literal: the audit
  // reads a bare '0px' as a raw value in a component (Invariant 1.6), and it
  // is right to - a canvas reset and a design value are indistinguishable to it.
  ctx.save()
  ctx.letterSpacing = `${Math.round(headerH * 0.09)}px`
  ctx.fillText('MONTH', W / 2, headerH * 0.52)
  ctx.restore()

  // weekday initials
  ctx.fillStyle = ink
  ctx.font = `500 ${Math.round(weekH * 0.52)}px ${mono}`
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  days.forEach((d, i) => {
    ctx.fillText(d, pad + colW * (i + 0.5), headerH + weekH * 0.55)
  })

  // grid rules
  ctx.strokeStyle = line
  ctx.lineWidth = Math.max(1.5, W * 0.0018)
  ctx.beginPath()
  for (let c = 0; c <= 7; c++) {
    const x = pad + colW * c
    ctx.moveTo(x, gridTop)
    ctx.lineTo(x, gridTop + gridH)
  }
  for (let r = 0; r <= 5; r++) {
    const y = gridTop + rowH * r
    ctx.moveTo(pad, y)
    ctx.lineTo(pad + gridW, y)
  }
  ctx.stroke()

  // 30 numbered days, offset so the month starts mid-week like a real one
  ctx.fillStyle = ink
  ctx.font = `500 ${Math.round(rowH * 0.42)}px ${mono}`
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  const startCol = 2
  for (let d = 1; d <= 30; d++) {
    const idx = startCol + d - 1
    const r = Math.floor(idx / 7)
    const c = idx % 7
    if (r > 4) break
    ctx.fillText(
      String(d),
      pad + colW * c + colW * 0.14,
      gridTop + rowH * r + rowH * 0.13,
    )
  }

  const texture = new CanvasTexture(canvas)
  // This face is authored top-down (header first) while UV v runs upward, and
  // the default flipY lands canvas-top at v=0 - which renders the month
  // upside down. Verified against the exported UVs, which are correct:
  // u tracks +X, v tracks +Z. So the flip belongs here, not in the geometry.
  texture.flipY = false
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

/**
 * Discovered at build time by Vite. An absent model is not an error: it means
 * the primitive placeholder is still in use.
 */
const MODEL_URLS = import.meta.glob('../assets/models/*.glb', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

export function modelUrl(name: string): string | undefined {
  return MODEL_URLS[`../assets/models/${name}.glb`]
}

/**
 * Material name to token. This is the seam between the owner's Blender file and
 * the design system: renaming a material here is a design decision, renaming it
 * in Blender is an authoring decision, and both are visible.
 */
type MaterialSpec = {
  color: keyof Palette
  roughness: number
  metalness: number
  /**
   * Optional, and deliberately rare. Emissive colour comes from the SAME
   * token bridge as everything else (never a raw hex), and this field exists
   * for exactly one material today: `ms_eye_glow`, the eyepiece-transition
   * terminal disc (brand-designer ruling, CLAUDE.md D25). Reaching for this
   * for any other material is a new design decision, not a precedent this
   * one field sets automatically. Neutral-white emissive carries zero
   * saturation, so it does not trip DESIGN.md 10.3's "no emissive saturated
   * material" rule, which targets colour, not brightness.
   */
  emissive?: keyof Palette
  emissiveIntensity?: number
  /**
   * A generated surface pattern. When present the base colour moves into the
   * texture (both the paper colour and the line colour are drawn from tokens),
   * so `color` becomes the pattern's background rather than the material tint.
   */
  surface?: SurfaceSpec
}

const MATERIAL_MAP: Record<string, MaterialSpec> = {
  // Broad surfaces take --ground-1, never --ground-2. D16 (raised to 245 by
  // D22) requires broad object surfaces to peak there so a hover or active
  // state has somewhere to go, and --ground-2 is pure white: under this
  // lighting rig it measured a peak of 251 with 12.4% of pixels over the
  // limit in effect at the time (235) - still over the current one too.
  // --ground-2 is reserved here for small specular parts, where "broad" does
  // not apply.
  ms_shell: { color: 'ground1', roughness: 0.42, metalness: 0.05 },
  ms_shell_dark: { color: 'ink3', roughness: 0.5, metalness: 0.05 },
  ms_metal: { color: 'ground1', roughness: 0.3, metalness: 0.85 },
  // Small area, and the one place a brighter tier earns its keep: it separates
  // the lenses from the shell they sit in.
  ms_lens: { color: 'ground2', roughness: 0.08, metalness: 0.3 },
  // The disc at the floor of each eyepiece bore. D16's ceiling on BROAD
  // surfaces (245, since D22) does not bind here in the resting HEAD framing,
  // where this is a small area among other geometry, per D22's own text.
  //
  // Since D25, this disc is ALSO the terminal frame of the eyepiece-dive
  // transition (CameraRig's MICROSCOPE_DIVE, three/motion.ts), where the
  // camera ends close enough that it fills the entire screen. Screen-space
  // coverage at that moment is what D16's headroom concern actually measures,
  // and "small area" stops being true in that sense the instant it fills
  // frame (DESIGN.md 10.5). The emissive field below is what makes that
  // terminal frame read as "the light itself gets closer" during the last
  // stretch of the dive, not just a flatly-lit surface happening to fill the
  // screen. Neutral --ground-2 emissive, same token the base colour already
  // uses: zero saturation, so DESIGN.md 10.3's "never emissive saturated"
  // rule (which protects the accent hue's meaning) does not apply.
  ms_eye_glow: {
    color: 'ground2',
    roughness: 0.25,
    metalness: 0,
    emissive: 'ground2',
    emissiveIntensity: 0.6,
  },
  ms_knob: { color: 'ink2', roughness: 0.55, metalness: 0 },
  // The two facing leaves of the notebook's open spread. Deliberately NOT
  // ms_slide: the microscope's specimen slide shares that name, and a grid on
  // it would be a defect.
  //
  // 5mm quadrille at the notebook's authored scale (1 unit = 100mm), which is
  // the standard ruling for a bound lab notebook. --ink-3 is the hairline tier,
  // the same token every divider in the CSS uses, so the ruling reads as a
  // hairline rather than as text.
  ms_page: {
    color: 'ground2',
    roughness: 0.55,
    metalness: 0,
    surface: { kind: 'quadrille', line: 'ink3', cell: 0.05 },
  },
  // The tent calendar's printed face: the one surface that draws glyphs,
  // permitted by DESIGN.md 10.6 (D26). See the 'calendar' SurfaceSpec comment
  // for the conditions that come with it.
  ms_calendar_face: {
    color: 'ground2',
    roughness: 0.55,
    metalness: 0,
    surface: {
      kind: 'calendar',
      line: 'ink3',
      ink: 'ink1',
      header: 'ink2',
      headerInk: 'ground2',
    },
  },
  ms_slide: { color: 'ground2', roughness: 0.15, metalness: 0 },
  ms_stage: { color: 'ink1', roughness: 0.4, metalness: 0 },
}

const FALLBACK: MaterialSpec = { color: 'ground2', roughness: 0.42, metalness: 0.05 }

/**
 * Replace every baked material with one built from tokens, by material NAME.
 *
 * Exported because the bench needs it too. The bench is not a BenchObject and
 * must NOT go through Model's height normalisation - its worktop, not its base,
 * defines y=0 - but it is authored in the same Blender pipeline and must obey
 * Invariant 1.6 identically. Sharing this is what stops the bench quietly
 * becoming a second, unpoliced source of colour in the scene.
 */
export function applyTokenMaterials(
  root: Object3D,
  palette: Palette,
  fonts: Fonts,
  label: string,
): void {
  const seen = new Set<string>()

  root.traverse((child) => {
    if (!(child instanceof Mesh)) return
    child.castShadow = true
    child.receiveShadow = true

    const sourceName = Array.isArray(child.material)
      ? child.material[0]?.name
      : child.material?.name
    const key = sourceName ?? ''
    const spec = MATERIAL_MAP[key]

    if (!spec && !seen.has(key)) {
      seen.add(key)
      console.warn(
        `Model "${label}": material "${key}" is not in MATERIAL_MAP, so it is ` +
          `falling back to the shell token. Add it to Model.tsx or rename it ` +
          `in the source file (CLAUDE.md Invariant 1.6).`,
      )
    }

    const { color, roughness, metalness, emissive, emissiveIntensity, surface } =
      spec ?? FALLBACK

    // With a surface pattern the texture already carries both token colours,
    // so the material tint must be white or it would multiply them a second time.
    const map = !surface
      ? undefined
      : surface.kind === 'quadrille'
        ? quadrilleTexture(child, surface.cell, palette[color], palette[surface.line])
        : calendarTexture(
            palette[color],
            palette[surface.line],
            palette[surface.ink],
            palette[surface.header],
            palette[surface.headerInk],
            fonts.mono,
          )

    child.material = new MeshStandardMaterial({
      color: map ? 0xffffff : palette[color],
      roughness,
      metalness,
      ...(map && { map }),
      ...(emissive && {
        emissive: new Color(palette[emissive]),
        emissiveIntensity: emissiveIntensity ?? 1,
      }),
    })
  })
}

export default function Model({
  name,
  targetHeight,
}: {
  name: string
  targetHeight: number
}) {
  const url = modelUrl(name)
  if (!url) throw new Error(`Model: no ${name}.glb in src/assets/models/`)

  const gltf = useLoader(GLTFLoader, url)
  const palette = useMemo(() => readPalette(), [])
  const fonts = useMemo(() => readFonts(), [])

  const { scene, scale, offset } = useMemo(() => {
    // Clone so a second mount cannot mutate the cached original.
    const cloned = gltf.scene.clone(true)
    applyTokenMaterials(cloned, palette, fonts, name)

    // Seat it: scale to the target height, then sit its base on y=0 and centre
    // it on x and z, all measured from the model rather than assumed.
    const box = new Box3().setFromObject(cloned)
    const size = box.getSize(new Vector3())
    const s = size.y > 0 ? targetHeight / size.y : 1
    const centre = box.getCenter(new Vector3())

    return {
      scene: cloned,
      scale: s,
      offset: [-centre.x * s, -box.min.y * s, -centre.z * s] as [number, number, number],
    }
  }, [gltf, palette, fonts, name, targetHeight])

  return (
    <group position={offset} scale={scale}>
      <primitive object={scene} />
    </group>
  )
}
