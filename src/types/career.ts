export type CategorySlug =
  | 'makers'
  | 'connectors'
  | 'explorers'
  | 'screen-workers'
  | 'thinkers'
  | 'performers'
  | 'healers'
  | 'builders';

export interface Career {
  id: number;
  name: string;
  category: CategorySlug;
  /** What this person does — 1–2 original sentences */
  what: string;
  /** Concrete first action the student can take this week */
  firstStep: string;
  /** Startup cost in INR; 0 = free */
  costInr: number;
}

export interface CareerCategory {
  slug: CategorySlug;
  label: string;
  icon: string;
  tagline: string;
  color: string;   // tailwind bg class (light)
  border: string;  // tailwind border class
  text: string;    // tailwind text class
  accent: string;  // tailwind bg class (bold, for badge)
}

export interface QuizOption {
  id: number;
  optionText: string;
  careerCategory: CategorySlug;
  sortOrder: number;
}

export interface QuizQuestion {
  id: number;
  questionText: string;
  sortOrder: number;
  isActive: boolean;
  options: QuizOption[];
}
