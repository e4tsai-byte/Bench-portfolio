/**
 * research.ts
 *
 * Microscope content (Phase 1). Data, not markup: components render this, they
 * never contain it (CLAUDE.md Invariant 1.5).
 *
 * SOURCE AND ACCURACY. Every item below is transcribed from the owner's own
 * 2026 resume, which is the authoritative statement of these claims. Nothing
 * here is inferred, expanded, or embellished. Invariant 1.5 makes claim
 * accuracy blocking, so if a detail is not in the source it is not here.
 *
 * One exception, in the strict direction: the systematic review's citation was
 * verified against Crossref via its DOI, which supplied the volume, issue,
 * pages, and publication date that the resume did not carry. That check also
 * corrected this file's `org` for that item, which had been inferred from
 * context rather than sourced. Publisher metadata outranks both the resume and
 * any inference of mine for a published citation.
 *
 * DELIBERATELY ABSENT: no phone number, no postal address, no contact details
 * of any kind. This repository is public.
 *
 * KNOWN GAP: `abstract` currently holds an expanded description drawn from the
 * resume, not a real scientific abstract. PRODUCT.md Section 10 specifies this
 * field as full abstract text. The genuine PDAC/Schwann-cell abstract has never
 * been supplied to this repo, so the field is honest about what it holds rather
 * than being padded out to look complete.
 */

export interface ResearchItem {
  id: string
  title: string
  role: string
  org: string
  period: string
  field: ('AI' | 'Biotech' | 'Wet-lab')[]
  /** Long form. See the KNOWN GAP note above. */
  abstract: string
  /** One or two sentences, for the specimen card face. */
  summary: string
  links?: { label: string; url: string }[]
  figure?: string
}

export const research: ResearchItem[] = [
  {
    id: 'schwann-panin-3d-histology',
    title: 'Schwann cell involvement in PanIN progression',
    role: 'Research intern (Hu lab)',
    org: 'Academia Sinica, Genomics Research Center',
    period: 'Jul 2026 to Aug 2026',
    field: ['Wet-lab', 'Biotech'],
    abstract:
      'Characterized Schwann cell involvement in PanIN (pancreatic intraepithelial ' +
      'neoplasia) progression in KC (Kras G12D) mice. Executed and optimized a full 3D ' +
      'volumetric imaging pipeline: perfusion, embedding, vibratome sectioning, ' +
      'multi-channel immunofluorescence, optical clearing, and confocal z-stack ' +
      'acquisition. Assessed fluorocitrate-mediated glial inhibition through in vitro ' +
      'drug treatment and quantitative confocal analysis. Produced and presented an ' +
      'end-of-program poster.',
    summary:
      'Built a full 3D volumetric imaging pipeline to characterize Schwann cell ' +
      'involvement in pancreatic pre-cancerous lesion progression, then tested glial ' +
      'inhibition against it.',
  },
  {
    id: 'cancerfree-biotech-coculture',
    title: 'Tumor and fibroblast interaction in 3D co-culture',
    role: 'Lab and technical development intern',
    org: 'Cancerfree Biotech',
    period: 'Jun 2024 to Aug 2024, and Aug 2025 to Sep 2025',
    field: ['Wet-lab', 'Biotech'],
    abstract:
      'Engineered and iterated a novel 3D-printed product component, entered in the ' +
      'Qualcomm Innovate in Taiwan Challenge 2025 and CES 2026 and filed as a U.S. ' +
      'provisional patent. Invented two approved utility-model patents (Taiwan and ' +
      'Japan). Independently ran 3D MCF7/A549 and NIH3T3 co-culture experiments with ' +
      'fluorescence-microscopy analysis of tumor and fibroblast interactions.',
    summary:
      'Ran 3D tumor and fibroblast co-culture experiments with fluorescence-microscopy ' +
      'analysis, alongside hardware design work that produced two granted utility-model ' +
      'patents.',
  },
  {
    id: 'genital-psoriasis-systematic-review',
    title: 'Systematic review: biologics and small-molecule inhibitors in genital psoriasis',
    role: 'Co-author (third author)',
    org: 'Chang Gung Memorial Hospital, Department of Dermatology, Linkou',
    period: '2024',
    field: ['Wet-lab'],
    abstract:
      'Screened research papers and conducted comprehensive literature searches. ' +
      'Collaborated with co-authors to assess risk of bias across selected studies, ' +
      'ensuring methodological rigor and reproducibility of findings. ' +
      'Published as Lai, C.-C., Shao, S.-C., Tsai, E.T.K., and Chi, C.-C. (2024), ' +
      '"Efficacy and safety of biologics and small-molecule inhibitors in treating ' +
      'genital psoriasis: a systematic review of randomized controlled trials", ' +
      'British Journal of Dermatology 192(2), 357 to 359.',
    summary:
      'Screened the literature and assessed risk of bias for a systematic review of ' +
      'randomized controlled trials in genital psoriasis, published in the British ' +
      'Journal of Dermatology.',
    links: [
      { label: 'DOI: 10.1093/bjd/ljae370', url: 'https://doi.org/10.1093/bjd/ljae370' },
    ],
  },
]
