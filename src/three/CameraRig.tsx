/**
 * CameraRig.tsx
 *
 * One camera state per bench state (CLAUDE.md Invariant 1.2, as amended by
 * D20). This replaces the crossfade-plus-scale fake: the transition is now an
 * actual camera move, so nothing has to be registered, scaled, or matched
 * between two exports.
 *
 * Motion obeys Invariant 1.8: fast-in slow-out, no overshoot, durations read
 * from tokens, and `prefers-reduced-motion` cuts straight to the destination
 * with no travel at all.
 */
import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import type { BenchState } from '../state/benchMachine'
import { readDurations } from './palette'

/**
 * GSAP ease names are strings and are not valid CSS, which is why they live
 * here rather than in tokens.css (DESIGN.md 2.7, the one documented exception
 * to Invariant 1.6). The CSS easing tokens mirror these curves so a hover and a
 * camera move ease identically.
 */
export const EASE = {
  move: 'power3.out',
  fast: 'power2.out',
} as const

interface CameraState {
  /** Where the camera sits. */
  position: [number, number, number]
  /** What it looks at. */
  target: [number, number, number]
}

/**
 * The bench view sits back and high enough to see all four objects separated.
 * Each object state flies to a close three-quarter framing of that object.
 * These are placeholder framings tuned against primitive geometry; they will be
 * re-tuned once real models land, which costs a number change here and nothing
 * else. That cheapness is the whole point of D20.
 */
export const CAMERA_STATES: Record<BenchState, CameraState> = {
  BENCH: { position: [0, 2.6, 7.2], target: [0, 0.5, 0] },
  MICROSCOPE: { position: [0.5, 1.55, 1.75], target: [0.2, 1.15, -0.2] },
  NOTEBOOK: { position: [-1.9, 1.25, 2.1], target: [-2.0, 0.35, 0.35] },
  CALENDAR: { position: [2.5, 1.2, 2.2], target: [2.4, 0.55, -0.2] },
  COMPUTER: { position: [-3.6, 1.5, 2.2], target: [-3.7, 0.6, -0.4] },
}

export default function CameraRig({ state }: { state: BenchState }) {
  const camera = useThree((s) => s.camera)
  // The look-at target is animated too, not just the position. Animating only
  // position and re-pointing at the end produces a visible snap at the finish.
  const target = useRef({ x: 0, y: 0.5, z: 0 })
  const isFirst = useRef(true)

  useEffect(() => {
    const next = CAMERA_STATES[state]
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Invariant 1.8: reduced motion cuts to the destination, and so does the
    // very first paint, which is an arrival rather than a transition.
    if (prefersReduced || isFirst.current) {
      isFirst.current = false
      camera.position.set(...next.position)
      target.current = { x: next.target[0], y: next.target[1], z: next.target[2] }
      return
    }

    const { move } = readDurations()
    const tweens = [
      gsap.to(camera.position, {
        x: next.position[0],
        y: next.position[1],
        z: next.position[2],
        duration: move,
        ease: EASE.move,
      }),
      gsap.to(target.current, {
        x: next.target[0],
        y: next.target[1],
        z: next.target[2],
        duration: move,
        ease: EASE.move,
      }),
    ]
    return () => tweens.forEach((t) => t.kill())
  }, [state, camera])

  useFrame(() => {
    camera.lookAt(target.current.x, target.current.y, target.current.z)
  })

  return null
}
