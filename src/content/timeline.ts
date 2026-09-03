/**
 * timeline.ts
 *
 * Calendar content (Phase 2). Data, not markup (CLAUDE.md Invariant 1.5).
 *
 * SOURCE. The owner's 2026 resume. Dates are transcribed, not inferred, with
 * one documented exception marked inline below.
 *
 * ON AWARDS. PRODUCT.md Section 10 defines no content model for awards, and
 * they are real dated milestones that a chronology should carry, so they appear
 * here with `kind: 'award'` rather than being dropped or given an undeclared
 * file of their own. If a dedicated model is wanted later, that is a PRODUCT.md
 * change, not a silent one. See D18.
 */

export interface TimelineEntry {
  id: string
  title: string
  org: string
  location?: string
  /** ISO or "YYYY-MM". */
  start: string
  end?: string
  role: string
  techStack?: string[]
  description: string
  /**
   * Added beyond the PRODUCT.md Section 10 shape, optional so the shape is not
   * broken. Lets the calendar render a point-in-time award differently from a
   * spanning role instead of pretending they are the same thing.
   */
  kind?: 'role' | 'education' | 'award'
}

export const timeline: TimelineEntry[] = [
  {
    id: 'ucsd-bs-molecular-cell-biology',
    title: 'B.S. Molecular and Cell Biology',
    org: 'University of California, San Diego',
    location: 'San Diego, USA',
    // NOT SOURCED. The resume gives only the expected graduation date of
    // Jun 2029. This start is inferred from a standard four-year program and
    // needs the owner's confirmation before it goes outward (Invariant 1.9).
    start: '2025-09',
    end: '2029-06',
    role: 'Undergraduate',
    description:
      'GPA 3.902, Provost Honors. Relevant coursework: Genetics, Organic Chemistry, ' +
      'Biology Lab, Data Analysis and Design, Calculus, Cellular Neurobiology.',
    kind: 'education',
  },
  {
    id: 'hosa-founder-president',
    title: 'HOSA Future Health Professionals Club',
    org: 'HOSA',
    location: 'Taipei, Taiwan',
    start: '2024-03',
    end: '2025-06',
    role: 'Founder and President',
    description:
      "Founded Taiwan's second HOSA chapter, growing membership to 25+ active students. " +
      'Facilitated weekly lectures and organized 5+ hands-on dissection sessions (brain, ' +
      'kidney, lungs, heart, and eye). Coordinated a Stop the Bleed and Tactical ' +
      'Emergency Casualty Care (TECC) certification program in partnership with Linkou ' +
      'KCIS and certified EMTs, resulting in official emergency-care certifications for ' +
      'all participating members.',
    kind: 'role',
  },
  {
    id: 'cancerfree-biotech-2024',
    title: 'Cancerfree Biotech',
    org: 'Cancerfree Biotech',
    start: '2024-06',
    end: '2024-08',
    role: 'Lab and Technical Development Intern',
    description:
      'First internship term. Engineered and iterated a novel 3D-printed product ' +
      'component and invented two utility-model patents later approved in Taiwan and ' +
      'Japan.',
    kind: 'role',
  },
  {
    id: 'cancerfree-biotech-2025',
    title: 'Cancerfree Biotech',
    org: 'Cancerfree Biotech',
    start: '2025-08',
    end: '2025-09',
    role: 'Lab and Technical Development Intern',
    description:
      'Second internship term. Independently ran 3D MCF7/A549 and NIH3T3 co-culture ' +
      'experiments with fluorescence-microscopy analysis of tumor and fibroblast ' +
      'interactions.',
    techStack: ['Fluorescence microscopy', '3D cell culture'],
    kind: 'role',
  },
  {
    id: 'catalyst-research-journal',
    title: 'The Catalyst Undergraduate Research Journal',
    org: 'UC San Diego',
    location: 'San Diego, USA',
    start: '2025-10',
    end: '2026-06',
    role: 'Board Member',
    description:
      'Spearheading the expansion of a URH-sponsored undergraduate research journal, ' +
      'leading initiatives to broaden institutional participation beyond UC San Diego ' +
      'through inter-journal collaborations, faculty workshops, and systemwide outreach.',
    kind: 'role',
  },
  {
    id: 'academia-sinica-research-intern',
    title: 'Genomics Research Center, Hu lab',
    org: 'Academia Sinica',
    location: 'Taipei, Taiwan',
    start: '2026-07',
    end: '2026-08',
    role: 'Research Intern',
    description:
      'Characterized Schwann cell involvement in PanIN progression in KC mice via a ' +
      'full 3D volumetric imaging pipeline, and assessed fluorocitrate-mediated glial ' +
      'inhibition. See the microscope for the full abstract.',
    techStack: [
      'Confocal microscopy',
      'Optical clearing',
      'Immunofluorescence',
      'Vibratome sectioning',
    ],
    kind: 'role',
  },
  {
    id: 'award-duke-of-edinburgh',
    title: "The Duke of Edinburgh's Award, Bronze and Silver",
    org: "The Duke of Edinburgh's Award",
    start: '2022-10',
    end: '2025-01',
    role: 'Award',
    description: 'Bronze awarded Oct 2022, Silver awarded Jan 2025.',
    kind: 'award',
  },
  {
    id: 'award-uk-chemistry-olympiad',
    title: 'UK Chemistry Olympiad, Bronze',
    org: 'Royal Society of Chemistry',
    start: '2025-05',
    role: 'Award',
    description: 'Bronze award.',
    kind: 'award',
  },
  {
    id: 'award-biotechathalon-2026',
    title: 'BioTechathalon 2026, 1st place',
    org: 'UC San Diego',
    location: 'San Diego, USA',
    start: '2026-04',
    role: 'Award',
    description: 'First place.',
    kind: 'award',
  },
  {
    id: 'award-outstanding-research-pitch',
    title: 'Outstanding Research Pitch Award',
    org: 'Genomics Research Center, Academia Sinica',
    location: 'Taipei, Taiwan',
    start: '2026-08',
    role: 'Award',
    description: 'Awarded at the end of the summer research program.',
    kind: 'award',
  },
]
