/**
 * BenchScene.tsx
 *
 * The single real-time scene (CLAUDE.md Invariant 1.2, as amended by D20). One
 * scene, one lighting rig, all four objects, so the bench view and every object
 * view are consistent by construction rather than by verification.
 *
 * PLACEHOLDER GEOMETRY. Every object below is primitives standing in for the
 * owner's models (Invariant 1.3, as amended). Swapping a real model in is a
 * one-line change from a primitive to a loaded mesh at the same transform: the
 * position, the camera state in CameraRig, and the hotspot all stay put.
 *
 * COLOUR. Nothing here holds a literal colour. Everything comes through
 * palette.ts from tokens.css (Invariant 1.6, extended by D21).
 *
 * LIGHTING. High-key by law (Invariant 1.1): a low key-to-fill ratio, cool
 * white throughout, nothing below 5500K equivalent, and no dark ground
 * anywhere. See DESIGN.md Section 10.
 */
import { useMemo, type ReactElement } from 'react'
import type { BenchObject, BenchState } from '../state/benchMachine'
import { BENCH_OBJECTS, isWiredThisPhase } from '../state/benchMachine'
import { readPalette } from './palette'
import CameraRig from './CameraRig'
import Model, { modelUrl } from './Model'

/**
 * Target height per object, in world units. A model is scaled to this from its
 * own bounding box, so the camera states stay valid across a re-export at a
 * different scale (Invariant 1.3).
 */
const OBJECT_HEIGHT: Record<BenchObject, number> = {
  MICROSCOPE: 1.45,
  NOTEBOOK: 0.12,
  CALENDAR: 0.7,
  COMPUTER: 0.78,
}

/**
 * Facing correction, in radians about Y.
 *
 * The scene convention is that a model's FRONT faces +Z, toward the camera's
 * resting side. `microscope.glb` was authored facing -Z (its column sits at
 * +z and its stage, nosepiece, and eyepiece at -z), so it is turned here
 * rather than in the source file: a rotation is a placement decision and
 * belongs in the scene, and correcting it here costs nothing if the model is
 * later re-exported the other way round.
 */
const OBJECT_FACING: Record<BenchObject, number> = {
  MICROSCOPE: Math.PI,
  NOTEBOOK: 0,
  CALENDAR: 0,
  COMPUTER: 0,
}

/** Model filename per object. Absent file means the primitive is still in use. */
const MODEL_NAME: Record<BenchObject, string> = {
  MICROSCOPE: 'microscope',
  NOTEBOOK: 'notebook',
  CALENDAR: 'calendar',
  COMPUTER: 'computer',
}

/**
 * Object transforms. A real model drops in at the same transform.
 *
 * COMPUTER sits at -3.05 rather than the -3.7 the primitive used. The real
 * `computer.glb` normalises to 1.106 wide against the placeholder's ~1.1, but
 * the placeholder was a closed wedge and the model is an open laptop, so it
 * reads much wider; at -3.7 its left edge landed within 0.3 units of the
 * frustum edge at 16:10 and clipped on anything narrower. Moving it in is the
 * fix; its camera state below moves by the same delta so the COMPUTER view is
 * unchanged. See the build log for what this does NOT fix (aspects below 16:10).
 */
const OBJECT_TRANSFORM: Record<BenchObject, [number, number, number]> = {
  COMPUTER: [-3.05, 0, -0.4],
  NOTEBOOK: [-2.0, 0, 0.35],
  MICROSCOPE: [0.2, 0, -0.2],
  CALENDAR: [2.4, 0, -0.2],
}

function Microscope({ color, accent }: { color: string; accent: string }) {
  return (
    <group>
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.34, 0.36, 0.1, 48]} />
        <meshStandardMaterial color={color} roughness={0.42} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.55, -0.16]} rotation={[0.14, 0, 0]} castShadow>
        <boxGeometry args={[0.22, 0.95, 0.26]} />
        <meshStandardMaterial color={color} roughness={0.42} metalness={0.05} />
      </mesh>
      <mesh position={[0, 1.02, 0.12]} rotation={[0.26, 0, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.78, 40]} />
        <meshStandardMaterial color={color} roughness={0.38} metalness={0.06} />
      </mesh>
      <mesh position={[0, 0.5, 0.12]} castShadow>
        <boxGeometry args={[0.66, 0.045, 0.5]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      {/* The one accent in the scene: the specimen on the slide. */}
      <mesh position={[0, 0.53, 0.12]}>
        <cylinderGeometry args={[0.045, 0.045, 0.012, 24]} />
        <meshStandardMaterial color={accent} roughness={0.3} />
      </mesh>
      {[-0.2, 0.2].map((x) => (
        <mesh key={x} position={[x, 0.62, -0.16]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <torusGeometry args={[0.1, 0.038, 16, 32]} />
          <meshStandardMaterial color={color} roughness={0.45} />
        </mesh>
      ))}
    </group>
  )
}

function Notebook({ color }: { color: string }) {
  return (
    <mesh position={[0, 0.05, 0]} rotation={[0, 0.1, 0]} castShadow receiveShadow>
      <boxGeometry args={[0.78, 0.09, 1.05]} />
      <meshStandardMaterial color={color} roughness={0.55} />
    </mesh>
  )
}

function Calendar({ color }: { color: string }) {
  return (
    <group position={[0, 0, 0]}>
      {[-0.28, 0.28].map((z, i) => (
        <mesh
          key={z}
          position={[0, 0.34, z]}
          rotation={[i === 0 ? 0.48 : -0.48, 0, 0]}
          castShadow
        >
          <boxGeometry args={[0.78, 0.62, 0.02]} />
          <meshStandardMaterial color={color} roughness={0.5} />
        </mesh>
      ))}
    </group>
  )
}

function Computer({ color, screen }: { color: string; screen: string }) {
  return (
    <group rotation={[0, 0.26, 0]}>
      <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.05, 0.78]} />
        <meshStandardMaterial color={color} roughness={0.45} metalness={0.08} />
      </mesh>
      <mesh position={[0, 0.4, -0.36]} rotation={[-0.32, 0, 0]} castShadow>
        <boxGeometry args={[1.1, 0.72, 0.035]} />
        <meshStandardMaterial color={color} roughness={0.45} metalness={0.08} />
      </mesh>
      {/* Unlit white, never a glowing blue screen: that would be a palette
          violation (DESIGN.md 10.3). */}
      <mesh position={[0, 0.4, -0.34]} rotation={[-0.32, 0, 0]}>
        <planeGeometry args={[1.0, 0.62]} />
        <meshBasicMaterial color={screen} />
      </mesh>
    </group>
  )
}

const OBJECT_MESH: Record<BenchObject, (p: ReturnType<typeof readPalette>) => ReactElement> = {
  MICROSCOPE: (p) => <Microscope color={p.ground2} accent={p.accent} />,
  NOTEBOOK: (p) => <Notebook color={p.ground2} />,
  CALENDAR: (p) => <Calendar color={p.ground2} />,
  COMPUTER: (p) => <Computer color={p.ground2} screen={p.ground2} />,
}

export default function BenchScene({
  state,
  onSelect,
  onDiveReveal,
  isUserInitiated,
}: {
  state: BenchState
  onSelect: (object: BenchObject) => void
  /** See CameraRig.tsx: fired partway through the eyepiece dive (D25). */
  onDiveReveal?: () => void
  /** See CameraRig.tsx's isUserInitiated: whether MICROSCOPE, if that is the
   * current state, was reached by an actual click (D25). */
  isUserInitiated?: boolean
}) {
  const palette = useMemo(() => readPalette(), [])

  return (
    <>
      <CameraRig state={state} onDiveReveal={onDiveReveal} isUserInitiated={isUserInitiated} />

      {/* High-key rig. Key to fill is roughly 1.8:1 per DESIGN.md 10.3: high-key
          is a low contrast ratio, not merely a bright image. */}
      <ambientLight intensity={1.15} color={palette.ground1} />
      <directionalLight
        position={[-4, 6, 5]}
        intensity={1.55}
        color={palette.ground2}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={[5, 4, 3]} intensity={0.85} color={palette.ground1} />
      {/* Rim, from behind, carving the cold silhouette edge. */}
      <directionalLight position={[0, 4, -7]} intensity={1.25} color={palette.ground2} />
      {/* Fake bounce off the white bench: the rasteriser gives us none. */}
      <pointLight position={[0, 0.4, 3]} intensity={1.5} color={palette.ground1} />

      {/* Bench slab. */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[14, 0.1, 5]} />
        <meshStandardMaterial color={palette.ground1} roughness={0.62} />
      </mesh>

      {BENCH_OBJECTS.map((object) => (
        <group
          key={object}
          position={OBJECT_TRANSFORM[object]}
          // Phase discipline (Invariant 1.7): an object that is not wired this
          // phase is not clickable. It is present and lit, but inert.
          onClick={
            isWiredThisPhase(object)
              ? (e) => {
                  e.stopPropagation()
                  onSelect(object)
                }
              : undefined
          }
        >
          {/* Invariant 1.3: the real model wins the moment the file exists, and
              the primitive returns if it is removed. No code change either way. */}
          {modelUrl(MODEL_NAME[object]) ? (
            <group rotation={[0, OBJECT_FACING[object], 0]}>
              <Model name={MODEL_NAME[object]} targetHeight={OBJECT_HEIGHT[object]} />
            </group>
          ) : (
            OBJECT_MESH[object](palette)
          )}
        </group>
      ))}
    </>
  )
}
