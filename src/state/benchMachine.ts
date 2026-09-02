/**
 * benchMachine.ts
 *
 * The single finite state machine that is this project's entire navigation
 * (CLAUDE.md Invariant 1.4). There is no router, and there must not be one.
 *
 * Two invariants meet here and pull against each other:
 *
 *   1.4 names all five states and says none may be unreachable or unexitable.
 *   1.7 says the three Phase 2 objects are "not wired to a view" until their
 *       phase, and show a "coming soon" plaque instead.
 *
 * Resolved (see CLAUDE.md Section 7, D14) by separating two different things
 * that "reachable" can mean. All five states are reachable by #hash and every
 * one of them is exitable, so 1.4 holds and there is no dead state hiding in
 * the type. What Phase 1 withholds is the wiring FROM THE BENCH: a Phase 2
 * hotspot does not navigate, and a Phase 2 state renders the plaque rather
 * than a content view. That is 1.7 exactly, not a workaround for it.
 */

export const BENCH_STATES = [
  'BENCH',
  'MICROSCOPE',
  'NOTEBOOK',
  'CALENDAR',
  'COMPUTER',
] as const

export type BenchState = (typeof BENCH_STATES)[number]

/** Every state except the bench itself: the four objects on the bench. */
export type BenchObject = Exclude<BenchState, 'BENCH'>

export const BENCH_OBJECTS: readonly BenchObject[] = [
  'MICROSCOPE',
  'NOTEBOOK',
  'CALENDAR',
  'COMPUTER',
]

/**
 * Which phase wires each object to a real view (Invariant 1.7). Phase 1 is the
 * microscope alone. This is the single place that fact is encoded: components
 * ask this rather than hardcoding a list, so Phase 2 is a one-line change here
 * and not a hunt through the scene files.
 */
export const OBJECT_PHASE: Record<BenchObject, 1 | 2> = {
  MICROSCOPE: 1,
  NOTEBOOK: 2,
  CALENDAR: 2,
  COMPUTER: 2,
}

export function isWiredThisPhase(object: BenchObject): boolean {
  return OBJECT_PHASE[object] === 1
}

/** Human label for an object, for plaques and controls. */
export const OBJECT_LABEL: Record<BenchObject, string> = {
  MICROSCOPE: 'Microscope',
  NOTEBOOK: 'Notebook',
  CALENDAR: 'Calendar',
  COMPUTER: 'Computer',
}

/**
 * The hash for a state. BENCH is home and carries no hash, so the landing URL
 * stays clean and a shared link to the bench is just the bare URL.
 */
export function hashForState(state: BenchState): string {
  return state === 'BENCH' ? '' : `#${state.toLowerCase()}`
}

/**
 * Parse a location hash into a state. Anything unrecognised resolves to BENCH
 * rather than erroring: a stale or hand-typed link should land somewhere real,
 * never on a blank screen.
 */
export function stateFromHash(hash: string): BenchState {
  const name = hash.replace(/^#/, '').trim().toLowerCase()
  if (name === '') return 'BENCH'
  const match = BENCH_OBJECTS.find((object) => object.toLowerCase() === name)
  return match ?? 'BENCH'
}

/* ------------------------------------------------------------------------ */

import { useCallback, useEffect, useState } from 'react'

export interface BenchMachine {
  state: BenchState
  /** Enter an object's state. */
  enter: (object: BenchObject) => void
  /** The one way out, available from every non-BENCH state (Invariant 1.4). */
  backToBench: () => void
}

/**
 * Hash sync, in both directions (Invariant 1.4: "synced to state on load and
 * on transition").
 *
 * Outbound, a transition pushes a history entry so the browser back button
 * walks back through the states and a link is shareable.
 *
 * Inbound, we listen for BOTH popstate and hashchange and re-derive from the
 * URL. Listening to only one is the usual bug here: pushState does not fire
 * hashchange at all, and back/forward between two entries that share a hash
 * fires popstate without hashchange. Deriving state from the URL in both
 * handlers means the URL is always the single source of truth.
 */
export function useBenchMachine(): BenchMachine {
  const [state, setState] = useState<BenchState>(() =>
    stateFromHash(window.location.hash),
  )

  useEffect(() => {
    /**
     * One handler owns the URL, and it both derives state from it and
     * canonicalises it.
     *
     * Normalising on mount alone is not enough, and the way that fails is
     * easy to miss: changing only the hash is a SAME-DOCUMENT navigation, so
     * React never remounts and a mount-only effect never runs again. A junk
     * hash arriving any way other than a cold load (an edited address bar, a
     * stale link, back or forward into a bad entry) would set state correctly
     * but leave the address bar claiming a state the app is not in.
     *
     * replaceState, not pushState: a junk hash must not become a history
     * entry the user can navigate back into. It also does not fire hashchange,
     * so this cannot loop.
     */
    const applyFromUrl = () => {
      const hash = window.location.hash
      const next = stateFromHash(hash)
      const canonical = hashForState(next)
      if (hash !== canonical) {
        window.history.replaceState(
          null,
          '',
          window.location.pathname + window.location.search + canonical,
        )
      }
      setState(next)
    }

    applyFromUrl()
    window.addEventListener('popstate', applyFromUrl)
    window.addEventListener('hashchange', applyFromUrl)
    return () => {
      window.removeEventListener('popstate', applyFromUrl)
      window.removeEventListener('hashchange', applyFromUrl)
    }
  }, [])

  const go = useCallback((next: BenchState) => {
    const target = hashForState(next)
    if (window.location.hash !== target) {
      window.history.pushState(
        null,
        '',
        window.location.pathname + window.location.search + target,
      )
    }
    setState(next)
  }, [])

  const enter = useCallback((object: BenchObject) => go(object), [go])
  const backToBench = useCallback(() => go('BENCH'), [go])

  return { state, enter, backToBench }
}
