// Code-level meta overrides — applied before DB values in generateMetadata.
// Add an entry here whenever a DB description is in Hindi, too long, or off-brand.

export interface ExamMeta {
  title: string;
  description: string;
}

const slugMeta: Record<string, ExamMeta> = {
  'ssc-cgl-t1-2025-paper': {
    title: 'SSC CGL Tier 1 2025 Mock Test & Previous Year Papers | GridAcademy',
    description:
      'Free SSC CGL Tier 1 2025 mock tests — latest exam pattern, previous year papers, instant results and section-wise performance analysis on GridAcademy.',
  },
  'cuet-english-previous-year-question-paper': {
    title: 'CUET English Previous Year Papers 2022–2025 | Practice Free | GridAcademy',
    description:
      'Practice CUET English previous year question papers (2022–2025) on GridAcademy. Covers reading comprehension, vocabulary and grammar with instant results.',
  },
  'rrb-alp-2026-assistant-loco-pilot-recruitment-exam': {
    title: 'RRB ALP 2026 Mock Test — Assistant Loco Pilot Preparation | GridAcademy',
    description:
      'Free RRB ALP 2026 mock tests for CBT 1 & CBT 2. Practice with the latest Railway exam pattern, previous year papers and get instant results on GridAcademy.',
  },
  'cuet-mock-test-2026-ug-real-exam-practice': {
    title: 'CUET UG 2026 Mock Test — Real Exam-Level Practice | GridAcademy',
    description:
      'Practice CUET UG 2026 with real exam-level questions on GridAcademy. Latest NTA pattern, instant results and detailed section-wise performance analysis.',
  },
  'cuet-ug-2026-mock-paper': {
    title: 'CUET UG 2026 Mock Paper — Free Online Practice Test | GridAcademy',
    description:
      'Free CUET UG 2026 mock paper on GridAcademy. Practice with real NTA exam pattern questions, get instant results and detailed section-wise analysis.',
  },
  'rpf-recruitment-2026': {
    title: 'RPF Constable 2026 Mock Test — Railway Protection Force Exam | GridAcademy',
    description:
      'Free RPF Constable 2026 mock tests on GridAcademy. Practice with the latest SSC/RPF exam pattern, previous year papers and get instant results with analysis.',
  },
};

/** Returns hand-crafted meta for a slug, or undefined for unknown slugs. */
export function getStaticMeta(slug: string): ExamMeta | undefined {
  return slugMeta[slug];
}

/** True when the string contains Devanagari characters. */
export function isHindi(text: string): boolean {
  return /[ऀ-ॿ]/.test(text);
}

/**
 * Auto-generates a clean English description (≤160 chars) from exam data.
 * Used as fallback when the DB description is absent, Hindi, or too long.
 */
export function buildExamDescription(title: string, hasFree: boolean): string {
  const prefix = hasFree ? 'Free ' : '';
  const text = `${prefix}${title} mock tests — latest 2026 exam pattern, previous year papers, instant results and performance analysis on GridAcademy.`;
  return text.length <= 160 ? text : text.slice(0, 157) + '…';
}

/**
 * Auto-generates a descriptive page title from the exam title.
 * Used when neither a slug override nor a DB metaTitle is present.
 */
export function buildExamTitle(examTitle: string): string {
  const suffix = ' Mock Test 2026 | GridAcademy';
  const full = examTitle + suffix;
  // Keep under ~70 chars; trim exam title if needed
  return full.length <= 70 ? full : examTitle.slice(0, 70 - suffix.length).trimEnd() + suffix;
}
