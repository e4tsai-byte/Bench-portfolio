/**
 * patents.ts
 *
 * Notebook content (Phase 2). Data, not markup (CLAUDE.md Invariant 1.5).
 *
 * SOURCE. The owner's 2026 resume, verbatim. Patent numbers are factual claims
 * that Invariant 1.5 makes blocking, so nothing here is inferred: where the
 * resume gives no number, the field is empty rather than guessed.
 */

export interface Patent {
  id: string
  title: string
  /** Empty when no number has been issued or supplied yet. Never invented. */
  number: string
  status: 'Granted' | 'Provisional' | 'Pending'
  year: number
  url?: string
  /**
   * Two additions beyond the PRODUCT.md Section 10 shape, both optional so the
   * shape is not broken. The declared shape could express neither where a
   * patent is granted nor what it actually does, which loses most of what makes
   * a patent worth showing. See D18.
   */
  jurisdictions?: string[]
  summary?: string
}

export const patents: Patent[] = [
  {
    id: 'automated-positioning-cover-well-plates',
    title: 'Automated Positioning Cover for Well Plates',
    number: 'TWM670697U',
    status: 'Granted',
    year: 2025,
    jurisdictions: ['Taiwan', 'Japan'],
    summary:
      'A cover with embedded topological positioning structures (grooves and ' +
      'protrusions) enabling automated machines to precisely locate and interface with ' +
      'well plates, facilitating robotic liquid handling by guiding suction and ' +
      'discharge mechanisms.',
  },
  {
    id: 'drawing-device-dual-baffles-carrier-slot',
    title: 'Drawing Device with Dual Baffles and Carrier Slot',
    number: 'TWM669333U',
    status: 'Granted',
    year: 2025,
    jurisdictions: ['Taiwan', 'Japan'],
    summary:
      'A precision device with integrated baffles and a sealing slot that creates ' +
      'waterproof barriers on microscope slides, eliminating manual sealing errors and ' +
      'accelerating slide preparation for live-cell imaging.',
  },
  {
    // The resume states a U.S. provisional was filed but gives no application
    // number, so `number` is deliberately empty. Renderers must handle that.
    id: 'us-provisional-3d-printed-component',
    title: '3D-printed product component (U.S. provisional)',
    number: '',
    status: 'Provisional',
    year: 2025,
    jurisdictions: ['United States'],
    summary:
      'A novel 3D-printed product component engineered and iterated at Cancerfree ' +
      'Biotech, entered in the Qualcomm Innovate in Taiwan Challenge 2025 and CES 2026.',
  },
]
