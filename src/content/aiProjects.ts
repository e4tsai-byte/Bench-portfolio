/**
 * aiProjects.ts
 *
 * Computer content (Phase 2). Data, not markup (CLAUDE.md Invariant 1.5).
 *
 * SOURCE. The owner's 2026 resume, verbatim. Metrics stated here (73,000+
 * candidate objects, the validation measures) are the owner's own claims.
 */

export interface AiProject {
  id: string
  name: string
  blurb: string
  description: string
  stack: string[]
  repo?: string
  demo?: string
  highlights: string[]
}

export const aiProjects: AiProject[] = [
  {
    id: 'rehabibi',
    name: 'Rehabibi',
    blurb: 'Real-time computer-vision rehabilitation coach.',
    description:
      'A privacy-first, fully client-side web app using webcam pose estimation and 3D ' +
      'goniometric vector math to track joint angles, isometric holds, and rep cadence, ' +
      'delivering live form-correction feedback with zero video retention.',
    stack: ['React', 'TypeScript', 'MediaPipe Pose', 'WebAssembly'],
    repo: 'https://github.com/e4tsai-byte/rehab',
    highlights: [
      'Runs entirely client-side, so no video ever leaves the device',
      '3D goniometric vector math for joint angle tracking',
      'Live form-correction feedback on holds and rep cadence',
    ],
  },
  {
    id: 'panin-segment',
    name: 'PanIN-segment',
    blurb: 'ML pipeline for automated lesion segmentation.',
    description:
      'A multi-channel (CK19, aSMA, S100B, TuJ1) segmentation and morphometrics ' +
      'pipeline that extracts features from 73,000+ candidate objects, validated ' +
      'against manual annotation.',
    stack: ['Python', 'scikit-image'],
    repo: 'https://github.com/e4tsai-byte/PanIN-segment',
    highlights: [
      'Four-channel input: CK19, aSMA, S100B, TuJ1',
      'Feature extraction across 73,000+ candidate objects',
      'Validated against manual annotation with Dice, IoU, Cohen kappa, and Hausdorff distance',
    ],
  },
]
