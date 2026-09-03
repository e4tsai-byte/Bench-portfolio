/**
 * ViewfinderMask.tsx
 *
 * The circular lens-shaped mask (DESIGN.md 4.4), decomposed into two tiers
 * per the ux-designer review that planned this console:
 *
 *   - A clear core with NO frost, so the live 3D scene shows through crisp
 *     and undimmed. This is "looking through glass," not through gauze.
 *   - An outer ring at --frost-1, carrying the HUD chrome (HudCrosshairs).
 *
 * It does not crop the WebGL canvas. It is a DOM overlay in the existing
 * .scene__ui layer; the canvas keeps rendering underneath at full size, and
 * this component only shapes what the DOM draws on top of it. Touching
 * three/ internals for a purely cosmetic mask would be unnecessary and out
 * of this layer's job.
 *
 * SIZE AND POSITION are relative units (vh/vw/px clamp), never literal pixel
 * offsets from one measurement. A live camera means the composite is
 * camera-state-dependent, and CSS position must scale with the viewport the
 * way every other surface in this design system does.
 */
import type { ReactNode } from 'react'

export default function ViewfinderMask({ children }: { children: ReactNode }) {
  return (
    <div className="viewfinder">
      <div className="viewfinder__ring" />
      <div className="viewfinder__core">{children}</div>
    </div>
  )
}
