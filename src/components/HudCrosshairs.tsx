/**
 * HudCrosshairs.tsx
 *
 * Static corner crosshairs and coordinate markers (DESIGN.md 4.6). Pure
 * flavor: they never react to which specimen is focused. DESIGN.md's own
 * word "flavor" is doing real work here: a crosshair that changed when a
 * card was selected would imply it is reporting something (a position, a
 * measurement) tied to that specimen, and this system has no such data. A
 * reactive HUD would read as broken instrumentation the first time someone
 * notices the numbers correspond to nothing. Static costs nothing and keeps
 * the "research instrument" read honest rather than decorative-pretending-
 * to-be-functional.
 *
 * Coordinates are invented but internally consistent (they do not move or
 * change), which is the same convention a static prop uses: it looks real
 * without claiming to measure anything.
 */
export default function HudCrosshairs() {
  return (
    <div className="viewfinder__hud" aria-hidden="true">
      <span className="viewfinder__crosshair viewfinder__crosshair--tl" />
      <span className="viewfinder__crosshair viewfinder__crosshair--tr" />
      <span className="viewfinder__crosshair viewfinder__crosshair--bl" />
      <span className="viewfinder__crosshair viewfinder__crosshair--br" />
      <span className="viewfinder__hud-mark viewfinder__hud-mark--tl">X:0412</span>
      <span className="viewfinder__hud-mark viewfinder__hud-mark--tr">Y:0887</span>
      <span className="viewfinder__hud-mark viewfinder__hud-mark--bl">10X</span>
      <span className="viewfinder__hud-mark viewfinder__hud-mark--br">F/2.8</span>
    </div>
  )
}
