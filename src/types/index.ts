// ── Auth ──────────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'Student' | 'Provider' | 'Admin' | 'Instructor';
  token: string;
  refreshToken?: string;
}

// ── Exam / Masters ─────────────────────────────────────────────────────────────
export interface ExamCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
  testCount?: number;
}

// ── Test Series ────────────────────────────────────────────────────────────────
export type SeriesStatus = 'Draft' | 'PendingReview' | 'Published' | 'Rejected';
export type SeriesType = 'FullMock' | 'Sectional' | 'PreviousYear' | 'MiniMock';

export interface TestSeries {
  id: string;
  title: string;
  slug: string;
  examType: string;
  examTypeId: number;
  seriesType: SeriesType;
  providerName: string;
  providerCity?: string;
  thumbnailUrl?: string;
  description?: string;
  priceInr: number;
  isFirstTestFree: boolean;
  testCount: number;
  totalQuestions: number;
  durationMinutes: number;
  language: string;
  avgRating: number;
  reviewCount: number;
  purchaseCount: number;
  status: SeriesStatus;
  publishedAt?: string;
}

export interface TestSeriesDetail extends TestSeries {
  fullDescription: string;
  whatIncluded: string[];
  examPattern: ExamPatternRow[];
  reviews: TestReview[];
  relatedSeries: TestSeries[];
}

export interface ExamPatternRow {
  section: string;
  questions: number;
  marks: number;
  duration?: string;
}

export interface TestReview {
  id: string;
  studentName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// ── Test / Exam Engine ─────────────────────────────────────────────────────────
export type QuestionType = 'SingleCorrect' | 'MultipleCorrect' | 'Numerical';
export type QuestionStatus = 'NotVisited' | 'NotAnswered' | 'Answered' | 'MarkedForReview' | 'AnsweredAndMarked';

export interface ExamSection {
  id: number;
  name: string;
  questions: ExamQuestion[];
  durationSeconds?: number;
}

export interface ExamQuestion {
  id: number;
  sequenceNumber: number;
  sectionId: number;
  questionText: string;
  questionType: QuestionType;
  options?: ExamOption[];
  marks: number;
  negativeMarks: number;
}

export interface ExamOption {
  id: number;
  label: string; // A, B, C, D
  text: string;
}

export interface ExamConfig {
  testId: string;
  title: string;
  totalDurationSeconds: number;
  sections: ExamSection[];
  totalQuestions: number;
  totalMarks: number;
}

export interface StudentAnswer {
  questionId: number;
  selectedOptionIds: number[];
  numericalAnswer?: number;
  status: QuestionStatus;
  timeSpentSeconds: number;
}

// ── Result ─────────────────────────────────────────────────────────────────────
export interface TestResult {
  testId: string;
  title: string;
  score: number;
  maxScore: number;
  percentage: number;
  percentile: number;
  allIndiaRank: number;
  totalTestTakers: number;
  timeTakenSeconds: number;
  sectionResults: SectionResult[];
  questionResults: QuestionResult[];
  badges: string[];
}

export interface SectionResult {
  sectionName: string;
  attempted: number;
  correct: number;
  wrong: number;
  skipped: number;
  score: number;
  maxScore: number;
  accuracy: number;
}

export interface QuestionResult {
  questionId: number;
  questionText: string;
  yourAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  isSkipped: boolean;
  marks: number;
  solution?: string;
}

// ── Orders / Payments ──────────────────────────────────────────────────────────
export type OrderStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface Order {
  id: string;
  seriesId: string;
  seriesTitle: string;
  amountInr: number;
  gstAmount: number;
  bookingFee: number;
  grandTotal: number;
  status: OrderStatus;
  bookingRef: string;
  createdAt: string;
  razorpayOrderId?: string;
}

export interface CreateOrderResponse {
  orderId: string;
  razorpayOrderId: string;
  amount: number; // in paise
  currency: string;
  keyId: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
}

// ── Student Dashboard ──────────────────────────────────────────────────────────
export interface PurchasedSeries {
  seriesId: string;
  title: string;
  examType: string;
  thumbnailUrl?: string;
  purchasedAt: string;
  testsTaken: number;
  totalTests: number;
  bestScore?: number;
  lastAttemptAt?: string;
}

// ── Provider ───────────────────────────────────────────────────────────────────
export interface ProviderStats {
  totalSeries: number;
  publishedSeries: number;
  pendingReview: number;
  totalSales: number;
  grossRevenue: number;
  providerEarnings: number;
  pendingPayout: number;
}
