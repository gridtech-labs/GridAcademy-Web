import { ExamCard } from '@/types/exam';

/**
 * The four streams that shape navigation and the home page. The API has no
 * stream field, so exams are grouped by matching their category, type and title.
 */
export type StreamKey = 'jee' | 'neet' | 'cuet' | 'gov';

export interface Stream {
  key: StreamKey;
  name: string;
  sub: string;
  searchHref: string;
}

export const STREAMS: Stream[] = [
  { key: 'jee',  name: 'IIT JEE',         sub: 'Main & Advanced',                          searchHref: '/exams?q=jee' },
  { key: 'neet', name: 'NEET',            sub: 'UG',                                       searchHref: '/exams?q=neet' },
  { key: 'cuet', name: 'CUET',            sub: 'UG',                                       searchHref: '/exams?q=cuet' },
  { key: 'gov',  name: 'Government Jobs', sub: 'SSC · Railways · Banking · UPSC · State', searchHref: '/#govt-jobs' },
];

export function streamOf(exam: ExamCard): StreamKey {
  const text = [exam.examCategoryName, exam.examSubCategoryName, exam.examTypeName, exam.category, exam.title]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  if (/\bjee\b|iit/.test(text)) return 'jee';
  if (/\bneet\b/.test(text)) return 'neet';
  if (/\bcuet\b/.test(text)) return 'cuet';
  return 'gov';
}

export function groupByStream(exams: ExamCard[]): Record<StreamKey, ExamCard[]> {
  const groups: Record<StreamKey, ExamCard[]> = { jee: [], neet: [], cuet: [], gov: [] };
  // Featured exams first, then the API's order
  // Exams without tests have nothing to take yet, so they stay off the home page
  const withTests = exams.filter(e => e.testCount > 0).map(e => ({ ...e, title: e.title.trim() }));
  const ordered = [...withTests.filter(e => e.isFeatured), ...withTests.filter(e => !e.isFeatured)];
  for (const exam of ordered) groups[streamOf(exam)].push(exam);
  return groups;
}
