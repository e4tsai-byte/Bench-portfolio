/**
 * TEMPORARY: Stage B token proof.
 *
 * This exists to be looked at and measured, not to be shipped. DESIGN.md
 * Section 3 item 1 requires contrast to be verified in a live browser against
 * the real composite rather than asserted from hex values, and this surface is
 * what makes that possible before any scene art exists.
 *
 * Stage C deletes this entirely and mounts the state machine here instead.
 */

const INKS = ['--ink-0', '--ink-1', '--ink-2', '--ink-3'] as const
const GROUNDS = ['--ground-0', '--ground-1', '--ground-2'] as const

export default function App() {
  return (
    <main style={{ padding: 'var(--sp-8)' }} data-token-proof="stage-b">
      <p className="hud-label">Stage B / token proof / temporary</p>
      <h1>Bench Portfolio</h1>

      <section style={{ marginTop: 'var(--sp-6)' }}>
        {GROUNDS.map((ground) => (
          <div
            key={ground}
            data-ground={ground}
            style={{
              background: `var(${ground})`,
              padding: 'var(--sp-5)',
              borderRadius: 'var(--r-lg)',
              marginBottom: 'var(--sp-3)',
            }}
          >
            <p className="hud-label">{ground}</p>
            {INKS.map((ink) => (
              <p
                key={ink}
                data-ink={ink}
                data-on={ground}
                style={{ color: `var(${ink})` }}
              >
                {ink} on {ground}: the quick brown fox jumps over the lazy dog 0123456789
              </p>
            ))}
            <p data-ink="--accent-deep" data-on={ground} style={{ color: 'var(--accent-deep)' }}>
              --accent-deep on {ground}: text-safe accent tier
            </p>
          </div>
        ))}
      </section>

      <section className="console" style={{ marginTop: 'var(--sp-6)' }}>
        <p className="hud-label">console / frost-1</p>
        <h2>Console shell</h2>
        <div className="panel" style={{ marginTop: 'var(--sp-5)' }}>
          <p className="hud-label">panel / opaque, breaks the frost chain</p>
          <div className="card card--opaque" style={{ marginTop: 'var(--sp-4)' }}>
            <span className="tag">Biotech</span>
            <h3 style={{ marginTop: 'var(--sp-3)' }}>Specimen card</h3>
            <p style={{ color: 'var(--ink-1)' }}>
              A card sits on an opaque ground, never on another frosted surface.
            </p>
            <p className="mono" style={{ color: 'var(--ink-2)' }}>
              X:0412 Y:0887 / 2024 TO PRESENT
            </p>
          </div>
        </div>
        <button type="button" style={{ marginTop: 'var(--sp-5)' }}>
          Focusable control, tab to it to see the ring
        </button>
      </section>
    </main>
  )
}
