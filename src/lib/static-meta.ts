// Code-level meta overrides — applied before DB values in generateMetadata.
// Add an entry here whenever a DB description is in Hindi, too long, or off-brand.

export interface ExamMeta {
  title: string;
  description: string;
  /** Overrides exam.conductingBody from the DB when it is wrong or missing */
  conductingBody?: string;
  /** HTML string rendered in the Overview tab when the DB overview is empty */
  overview?: string;
  /** Rows rendered in the Important Dates tab when the DB has no dates */
  importantDates?: Array<{ label: string; date: string }>;
  /** OG/social image URL */
  image?: string;
}

const slugMeta: Record<string, ExamMeta> = {
  'ssc-cgl-t1-2025-paper': {
    title: 'SSC CGL Tier 1 2025 Mock Test & Previous Year Papers',
    description:
      'Free SSC CGL Tier 1 2025 mock tests — latest exam pattern, previous year papers, instant results and section-wise performance analysis on GridAcademy.',
  },
  'cuet-english-previous-year-question-paper': {
    title: 'CUET English Previous Year Papers 2022–2025 | Practice Free',
    description:
      'Practice CUET English previous year question papers (2022–2025) on GridAcademy. Covers reading comprehension, vocabulary and grammar with instant results.',
  },
  'rrb-alp-2026-assistant-loco-pilot-recruitment-exam': {
    title: 'RRB ALP 2026 Mock Test — Assistant Loco Pilot Preparation',
    description:
      'Free RRB ALP 2026 mock tests for CBT 1 & CBT 2. Practice with the latest Railway exam pattern, previous year papers and get instant results on GridAcademy.',
  },
  'cuet-mock-test-2026-ug-real-exam-practice': {
    title: 'CUET UG 2026 Mock Test — Real Exam-Level Practice',
    description:
      'Practice CUET UG 2026 with real exam-level questions on GridAcademy. Latest NTA pattern, instant results and detailed section-wise performance analysis.',
  },
  'cuet-ug-2026-mock-paper': {
    title: 'CUET UG 2026 Mock Paper — Free Online Practice Test',
    description:
      'Free CUET UG 2026 mock paper on GridAcademy. Practice with real NTA exam pattern questions, get instant results and detailed section-wise analysis.',
  },
  'rpf-recruitment-2026': {
    title: 'RPF Constable 2026 Mock Test — Railway Protection Force Exam',
    description:
      'Free RPF Constable 2026 mock tests on GridAcademy. Practice with the latest RPF exam pattern, previous year papers and get instant results with analysis.',
    conductingBody: 'Railway Recruitment Board (RRB)',
    image: '/images/blog/rpf-recruitment-2026.jpg',
    overview: `
<h2>RPF Constable &amp; SI 2026 Recruitment</h2>
<p>The <strong>Railway Protection Force (RPF)</strong> Constable and Sub-Inspector 2026 recruitment is conducted by the <strong>Railway Recruitment Board (RRB)</strong> under the Ministry of Railways, Government of India. RPF personnel are responsible for protecting railway property, passengers, and passenger areas across India.</p>

<h2>Total Vacancies 2026</h2>
<table>
  <thead>
    <tr>
      <th>Post</th>
      <th>Expected Vacancies</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>RPF Constable</td>
      <td>~8,000+ (total)</td>
      <td>To be notified</td>
    </tr>
    <tr>
      <td>RPF Sub-Inspector (SI)</td>
      <td>~450–500</td>
      <td>To be notified</td>
    </tr>
  </tbody>
</table>
<p><em>Indicative figures based on the 2024 cycle. Exact vacancies (including category-wise and gender-wise breakdown) will be confirmed in the official notification.</em></p>

<h2>Eligibility Criteria</h2>
<ul>
  <li><strong>Age (General category):</strong> 18–25 years (Constable) | 20–25 years (SI) — with standard relaxation: OBC +3 years, SC/ST +5 years, Ex-servicemen as per Govt. norms</li>
  <li><strong>Education:</strong> 10th Pass (Matriculation) for Constable | Bachelor's Degree for Sub-Inspector</li>
  <li><strong>Nationality:</strong> Indian Citizen</li>
  <li><strong>Physical Standards:</strong> Candidates must meet height, chest, and running requirements prescribed by RPF</li>
</ul>
<p><em>Note: Age limits are subject to confirmation in the official notification. Verify the final figures at the official RRB/RPF website before applying.</em></p>

<h2>Selection Process</h2>
<ol>
  <li><strong>Computer Based Test (CBT)</strong> — objective multiple-choice</li>
  <li><strong>Physical Efficiency Test (PET)</strong> — running, long jump, high jump</li>
  <li><strong>Physical Measurement Test (PMT)</strong> — height and chest verification</li>
  <li><strong>Document Verification &amp; Medical Examination</strong></li>
</ol>

<h2>CBT Exam Pattern</h2>
<table>
  <thead>
    <tr>
      <th>Subject</th>
      <th>Questions</th>
      <th>Marks</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>General Awareness / Current Affairs</td>
      <td>50</td>
      <td>50</td>
    </tr>
    <tr>
      <td>Arithmetic</td>
      <td>35</td>
      <td>35</td>
    </tr>
    <tr>
      <td>General Intelligence &amp; Reasoning</td>
      <td>35</td>
      <td>35</td>
    </tr>
    <tr>
      <td><strong>Total</strong></td>
      <td><strong>120</strong></td>
      <td><strong>120</strong></td>
    </tr>
  </tbody>
</table>
<p><strong>Duration:</strong> 90 minutes &nbsp;|&nbsp; <strong>Negative Marking:</strong> 1/3 mark deducted per wrong answer</p>
    `.trim(),
    importantDates: [
      { label: 'Official Notification Release', date: 'Expected 2026' },
      { label: 'Online Application Start',      date: 'To be announced' },
      { label: 'Last Date to Apply Online',     date: 'To be announced' },
      { label: 'Fee Payment Deadline',          date: 'To be announced' },
      { label: 'Admit Card Download',           date: 'To be announced' },
      { label: 'CBT Exam Date',                 date: 'To be announced' },
      { label: 'PET / PMT Date',               date: 'To be announced' },
      { label: 'Final Result Declaration',      date: 'To be announced' },
    ],
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
const CURRENT_YEAR = new Date().getFullYear();

export function buildExamDescription(title: string, hasFree: boolean): string {
  const prefix = hasFree ? 'Free ' : '';
  const text = `${prefix}${title} mock tests — latest ${CURRENT_YEAR} exam pattern, previous year papers, instant results and performance analysis on GridAcademy.`;
  return text.length <= 160 ? text : text.slice(0, 157) + '…';
}

export function buildExamTitle(examTitle: string): string {
  const suffix = ` Mock Test ${CURRENT_YEAR}`;
  const full = examTitle + suffix;
  return full.length <= 70 ? full : examTitle.slice(0, 70 - suffix.length).trimEnd() + suffix;
}
