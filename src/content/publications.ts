/**
 * publications.ts
 *
 * Notebook content (Phase 2). Data, not markup (CLAUDE.md Invariant 1.5).
 *
 * SOURCE. The owner's 2026 resume, with the citation itself verified against
 * Crossref by DOI. Volume, issue, pages, and publication date come from the
 * publisher, which outranks both the resume and any inference for a published
 * work. No contact details: this repository is public.
 */

export interface Publication {
  id: string
  title: string
  authors: string
  venue: string
  year: number
  doi?: string
  url?: string
  tags: string[]
  /**
   * Added beyond the PRODUCT.md Section 10 shape, optional so the shape is not
   * broken. Without it there is nowhere to say what the owner actually did on a
   * paper, which is the thing a portfolio reader wants to know. See D18.
   */
  contribution?: string
}

export const publications: Publication[] = [
  {
    id: 'genital-psoriasis-systematic-review-2024',
    title:
      'Efficacy and safety of biologics and small-molecule inhibitors in treating ' +
      'genital psoriasis: a systematic review of randomized controlled trials',
    authors: 'Lai, C.-C., Shao, S.-C., Tsai, E.T.K., & Chi, C.-C.',
    venue: 'British Journal of Dermatology, 192(2), 357 to 359',
    year: 2024,
    doi: '10.1093/bjd/ljae370',
    url: 'https://doi.org/10.1093/bjd/ljae370',
    tags: ['Dermatology', 'Systematic review', 'Randomized controlled trials'],
    contribution:
      'Third author. Screened research papers and conducted comprehensive literature ' +
      'searches, and worked with co-authors to assess risk of bias across the selected ' +
      'studies.',
  },
]
