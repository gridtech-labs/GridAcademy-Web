// ── Exam Page / Browse Exams ──────────────────────────────────────────────────

export interface ExamLevel {
  id: number;
  name: string;
  examCount: number;
}

export interface ExamTypeFilter {
  id: number;
  name: string;
  examCount: number;
}

export interface ExamCard {
  id: string;
  slug: string;
  title: string;
  shortDescription: string | null;
  thumbnailUrl: string | null;
  bannerUrl: string | null;
  examLevelName: string | null;
  examTypeName: string | null;
  conductingBody: string | null;
  category: string | null;
  testCount: number;
  isFeatured: boolean;
  priceInr: number;
  status: number; // 0=Draft, 1=Published
  createdAt: string;
}

export interface ExamTest {
  testId: string;
  title: string;
  durationMinutes: number;
  totalQuestions: number;
  isFree: boolean;
  sortOrder: number;
}

export interface ImportantDate {
  label: string;
  date: string;
}

export interface ExamDetail extends ExamCard {
  overview: string | null;
  eligibility: string | null;
  syllabus: string | null;
  examPattern: string | null;
  importantDates: string | null; // JSON string: ImportantDate[]
  admitCard: string | null;
  resultInfo: string | null;
  cutOff: string | null;
  howToApply: string | null;
  officialWebsite: string | null;
  notificationUrl: string | null;
  bannerUrl: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  viewCount: number;
  tests: ExamTest[];
}

// ── Assessment Attempt ────────────────────────────────────────────────────────

export interface AttemptOption {
  id: number;
  label: string;
  text: string;
}

// Used in result/answer key — includes isCorrect revealed by backend
export interface ResultOption {
  id: number;
  label: string;
  text: string;
  isCorrect: boolean;
}

export interface AttemptQuestion {
  attemptQuestionId: number; // use as key
  questionId: string;
  sectionIndex: number;
  sectionName: string;
  displayOrder: number;
  displayOrderInSection: number;
  text: string;
  questionType: number; // 1=MCQ, 2=MSQ, 3=NAT (matches backend QuestionType enum)
  options: AttemptOption[];
  isVisited: boolean;
  isMarkedForReview: boolean;
  marksForCorrect: number;
  negativeMarks: number;
}

export interface SavedAnswer {
  questionId: string;
  selectedOptionIds: number[];
  numericalValue?: number;
  isClear: boolean;
}

export interface AttemptStart {
  attemptId: string;
  testTitle: string;
  instructions: string | null;
  durationSeconds: number;
  secondsElapsed: number;
  totalQuestions: number;
  negativeMarkingEnabled: boolean;
  questions: AttemptQuestion[];
  savedAnswers: SavedAnswer[];
}

export interface AttemptState extends AttemptStart {
  status: number; // 1=InProgress, 2=Submitted, 3=TimedOut, 4=Abandoned
}

export interface AnswerState {
  questionId: string;
  selectedOptionIds: number[];
  numericalValue?: number;
  isClear: boolean;
  isMarkedForReview: boolean;
}

// ── Attempt Result ────────────────────────────────────────────────────────────

export interface SectionResult {
  sectionName: string;
  sectionIndex: number;
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;    // wrong answers
  unattempted: number;  // skipped / not attempted
  marksObtained: number;
  maxMarks: number;
  // accuracy is computed on the fly: correct / attempted * 100
}

export interface QuestionResult {
  displayOrder: number;
  sectionName: string;
  questionText: string;
  questionType: number; // 1=MCQ, 2=MSQ, 3=NAT
  studentSelectedOptionIds: number[];
  studentNumericalValue?: number;
  correctOptionIds: number[];
  correctNumericalAnswer?: number;
  isCorrect: boolean;
  isAttempted: boolean; // false = skipped/not attempted
  marksAwarded: number;
  maxMarks: number;
  solution?: string | null;
  options: ResultOption[]; // includes isCorrect flag, revealed in result view
}

export interface AttemptResult {
  attemptId: string;
  testTitle: string;
  studentName: string;
  startedAt: string;
  submittedAt: string;
  durationSecondsUsed: number;
  totalMarksObtained: number;
  totalMarksPossible: number;
  percentage: number;
  isPassed: boolean;
  passingPercent: number;
  negativeMarkingEnabled: boolean;
  violationCount: number;
  sections: SectionResult[];
  questions: QuestionResult[];
}

// ── Free Access Response ──────────────────────────────────────────────────────

export interface FreeAccessResponse {
  assignmentId: string;
  attemptId?: string;
}
