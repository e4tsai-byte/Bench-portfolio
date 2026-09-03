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
import { Box3, Mesh, MeshStandardMaterial, Vector3 } from 'three'
import { readPalette, type Palette } from './palette'

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
type MaterialSpec = { color: keyof Palette; roughness: number; metalness: number }

const MATERIAL_MAP: Record<string, MaterialSpec> = {
  ms_shell: { color: 'ground2', roughness: 0.42, metalness: 0.05 },
  ms_shell_dark: { color: 'ink3', roughness: 0.5, metalness: 0.05 },
  ms_metal: { color: 'ground1', roughness: 0.3, metalness: 0.85 },
  ms_lens: { color: 'ground2', roughness: 0.08, metalness: 0.3 },
  ms_knob: { color: 'ink2', roughness: 0.55, metalness: 0 },
  ms_slide: { color: 'ground2', roughness: 0.15, metalness: 0 },
  ms_stage: { color: 'ink1', roughness: 0.4, metalness: 0 },
}

const FALLBACK: MaterialSpec = { color: 'ground2', roughness: 0.42, metalness: 0.05 }

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

  const { scene, scale, offset } = useMemo(() => {
    // Clone so a second mount cannot mutate the cached original.
    const cloned = gltf.scene.clone(true)
    const seen = new Set<string>()

    cloned.traverse((child) => {
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
          `Model "${name}": material "${key}" is not in MATERIAL_MAP, so it is ` +
            `falling back to the shell token. Add it to Model.tsx or rename it ` +
            `in the source file (CLAUDE.md Invariant 1.6).`,
        )
      }

      const { color, roughness, metalness } = spec ?? FALLBACK
      child.material = new MeshStandardMaterial({
        color: palette[color],
        roughness,
        metalness,
      })
    })

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
  }, [gltf, palette, name, targetHeight])

  return (
    <group position={offset} scale={scale}>
      <primitive object={scene} />
    </group>
  )
}
