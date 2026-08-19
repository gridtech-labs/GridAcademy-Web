export interface CAStory {
  slug: string;
  date: string; // ISO 'YYYY-MM-DD'
  title: string;
  category: 'Polity & Governance' | 'Economy' | 'Environment' | 'Science & Tech' | 'International' | 'Social Issues' | 'Sports';
  examRelevance: string[];
  summary: string;
  whyItMatters: string;
  keyFacts: string[];
  tags: string[];
  imageEmoji: string;
  source: string;
}

const stories: CAStory[] = [

  // ── 2026-08-20 ────────────────────────────────────────────────────────────────

  {
    slug: 'ssc-cgl-2026-revised-exam-pattern',
    date: '2026-08-20',
    title: 'SSC CGL 2026 Revised Exam Pattern: Tier-II Now Single Day, GK Weight Increased',
    category: 'Polity & Governance',
    examRelevance: ['SSC', 'UPSC'],
    summary: 'The Staff Selection Commission has revised the Combined Graduate Level (CGL) 2026 exam pattern. Tier-II will now be conducted on a single day instead of two, and the General Knowledge & Current Affairs section weight has been increased from 25 to 40 marks in Paper-I.',
    whyItMatters: 'SSC CGL aspirants must realign their preparation strategy — more focus on GK and current affairs is now essential. The single-day Tier-II format reduces examination fatigue and changes time management strategy significantly.',
    keyFacts: [
      'SSC CGL Tier-II 2026 will be a single-session exam of 3 hours covering all papers.',
      'Paper-I (Mathematical Abilities + Reasoning) will now carry 200 marks instead of 180.',
      'General Awareness section weight increased from 25 to 40 marks in Paper-I.',
      'English Language & Comprehension paper remains unchanged at 200 marks.',
      'SSC CGL 2026 notification is expected in September 2026 with 17,000+ vacancies.',
      'Negative marking of 0.50 marks per wrong answer continues across all papers.',
    ],
    tags: ['SSC CGL', 'CGL 2026', 'Exam Pattern', 'Staff Selection Commission', 'GK'],
    imageEmoji: '👮',
    source: 'Staff Selection Commission (SSC)',
  },

  {
    slug: 'ibps-po-2026-prelims-dates-announced',
    date: '2026-08-20',
    title: 'IBPS PO CRP-XVI 2026 Prelims Dates Announced: 22–23 August — Key Cut-off Trends',
    category: 'Economy',
    examRelevance: ['Banking', 'SSC'],
    summary: 'The Institute of Banking Personnel Selection (IBPS) has confirmed that the PO CRP-XVI Preliminary Examination will be held on 22 and 23 August 2026. Based on trend analysis, the expected overall cut-off for General category is projected at 53–57 marks out of 100.',
    whyItMatters: 'Banking aspirants appearing for IBPS PO Prelims 2026 must know the section-wise cut-off targets: English (8–10), Quantitative Aptitude (10–13), Reasoning (11–14). Sectional clearing is mandatory in addition to the overall cut-off.',
    keyFacts: [
      'IBPS PO CRP-XVI Prelims will be conducted on 22 & 23 August 2026 across 5,000+ centres.',
      'Total vacancies this cycle are 4,455 posts across 11 participating public sector banks.',
      'Exam has 100 questions in 60 minutes with 3 sections: English (30), Reasoning (35), QA (35).',
      'Negative marking of 0.25 per wrong answer; unattempted questions carry no penalty.',
      'Mains examination is scheduled for 4 October 2026.',
      'IBPS PO 2025 (CRP-XV) general category overall cut-off was 55.75 marks.',
    ],
    tags: ['IBPS PO', 'Banking Exam', 'CRP-XVI', 'Prelims 2026', 'Cut-off'],
    imageEmoji: '🏦',
    source: 'Institute of Banking Personnel Selection (IBPS)',
  },

  {
    slug: 'rrb-ntpc-cbt2-september-2026-schedule',
    date: '2026-08-20',
    title: 'RRB NTPC CBT-2 2026 Schedule Released: 17 September — Zone-wise Exam City Slip',
    category: 'Polity & Governance',
    examRelevance: ['Railway', 'SSC'],
    summary: 'Railway Recruitment Boards have officially released the schedule for NTPC CBT-2 2026. The Computer-Based Test will commence on 17 September 2026. Exam city intimation slips for the first phase (non-technical popular categories) are available for download on the RRB regional websites.',
    whyItMatters: 'RRB NTPC CBT-2 covers 120 questions in 90 minutes with 1/3 negative marking. General Awareness (50 Qs) carries the highest weight — aspirants must prioritise Railway GK, current affairs, and science for last-minute revision.',
    keyFacts: [
      'RRB NTPC CBT-2 2026 begins 17 September 2026 across all zones simultaneously.',
      'Exam duration: 90 minutes for 120 questions (General Awareness: 50, Math: 35, Reasoning: 35).',
      'Normalisation will be applied across multiple shifts; safe score target is 85+ out of 120.',
      'Admit cards will be released 4 days before the exam on respective RRB regional portals.',
      'The exam is for NTPC Graduate-level posts: Junior Clerk, Account Clerk, Commercial Apprentice, etc.',
      'Total vacancy for CBT-2 level posts is 3,445 across Indian Railways.',
    ],
    tags: ['RRB NTPC', 'CBT-2', 'Railway Exam', 'September 2026', 'Exam Schedule'],
    imageEmoji: '🚂',
    source: 'Railway Recruitment Board (RRB)',
  },

  {
    slug: 'cuet-ug-2026-results-nta-scorecard',
    date: '2026-08-20',
    title: 'CUET UG 2026 Results Declared: NTA Releases Scorecards — What Score Gets You DU, JNU?',
    category: 'Social Issues',
    examRelevance: ['CUET', 'SSC'],
    summary: 'The National Testing Agency (NTA) has declared the CUET UG 2026 results and released individual scorecards on the official portal. Based on college-wise cutoff data from the CSAS portal, top Delhi University colleges require a minimum CUET score of 310–340 (out of 400) for popular BA (Hons) programmes.',
    whyItMatters: 'CUET UG 2026 scores determine admissions to 260+ central and participating universities. The marking scheme (+5 for correct, -1 for incorrect) means accuracy is more critical than attempt count — a lesson for future aspirants.',
    keyFacts: [
      'NTA declared CUET UG 2026 results on the official cuet.nta.nic.in portal.',
      'CUET UG 2026 was conducted between 15–30 May 2026 in CBT mode at 500+ centres.',
      'Delhi University\'s top colleges (SRCC, Miranda, LSR) require 310–340 for BA/B.Com Hons.',
      'JNU\'s School of International Studies requires 280+ in any humanities domain subject.',
      'Over 14.9 lakh students registered; 13.1 lakh appeared this year.',
      'CUET scores are valid only for the 2026–27 academic admission cycle.',
    ],
    tags: ['CUET UG', 'NTA', 'Delhi University', 'Scorecard', 'Admissions 2026'],
    imageEmoji: '📚',
    source: 'National Testing Agency (NTA)',
  },

  {
    slug: 'neet-ug-2026-exam-date-new-syllabus',
    date: '2026-08-20',
    title: 'NEET UG 2026 Exam Date Confirmed: 3 May — NMC Finalises Rationalised Syllabus',
    category: 'Social Issues',
    examRelevance: ['NEET', 'SSC'],
    summary: 'The National Medical Commission (NMC) has confirmed NEET UG 2026 will be held on 3 May 2026. The rationalised syllabus — based on the NCERT review committee\'s recommendations — has been finalised, removing 9 topics from Physics, 6 from Chemistry, and 3 from Biology compared to the 2024 syllabus.',
    whyItMatters: 'NEET UG aspirants must strictly follow the NMC-notified 2026 syllabus. The reduction in topics does NOT reduce competition — it means remaining topics will be tested more deeply. Section B (optional questions) format continues with 10 questions, 5 to be attempted per subject.',
    keyFacts: [
      'NEET UG 2026 exam date: 3 May 2026 (Sunday), pen-and-paper mode, 3 hours 20 minutes.',
      'Total marks: 720 (Physics: 180, Chemistry: 180, Biology: 360).',
      'Marking: +4 for correct, -1 for incorrect. Section B: 10 Qs, attempt any 5.',
      'Removed topics include: Electromagnetic Waves (detailed), p-Block elements (some), Communication Systems.',
      'OMR sheet will be scanned on-site; no option to carry question paper home.',
      'Expected NEET UG 2026 general category cut-off: 130–145 (720 scale).',
    ],
    tags: ['NEET UG', 'NMC', '2026 Syllabus', 'Medical Entrance', 'NTA'],
    imageEmoji: '🩺',
    source: 'National Medical Commission (NMC)',
  },

  {
    slug: 'rrb-alp-technician-2026-vacancy',
    date: '2026-08-20',
    title: 'RRB ALP & Technician 2026 Notification: 9,000+ Vacancies — Eligibility & Stage Pattern',
    category: 'Polity & Governance',
    examRelevance: ['Railway', 'SSC'],
    summary: 'Railway Recruitment Boards have released the official notification for Assistant Loco Pilot (ALP) and Technician recruitment 2026 with 9,144 vacancies. The exam will follow a three-stage selection process: CBT-1, CBT-2 (Part A + Part B), and Computer-Based Aptitude Test (CBAT) for ALP posts.',
    whyItMatters: 'RRB ALP is one of the largest Railway recruitment drives. CBT-1 covers Mathematics, General Intelligence, Basic Science & Engineering (BSE), and General Awareness. BSE (50 marks) is unique to ALP — covering heat, electrical, levers, mechanics — and is the highest-weight section.',
    keyFacts: [
      'Total vacancies: 9,144 (ALP: 5,696; Technician Grade-III: 3,448) across all RRB zones.',
      'Eligibility: 10+2 with Physics & Maths or ITI in relevant trade for ALP posts.',
      'CBT-1: 75 questions in 60 minutes — Math (20), GI & Reasoning (25), Basic Science & Engineering (30).',
      'CBT-2 Part A (100 Qs/90 min) + Part B (75 Qs/60 min) trade-specific.',
      'CBAT is mandatory for ALP posts and is qualifying in nature (minimum 42% required).',
      'Online application window: September 10 – October 10, 2026.',
    ],
    tags: ['RRB ALP', 'Technician 2026', 'Railway Recruitment', 'Vacancy', 'CBT'],
    imageEmoji: '⚙️',
    source: 'Railway Recruitment Board (RRB)',
  },

  // ── 2026-08-19 ────────────────────────────────────────────────────────────────

  {
    slug: 'sbi-po-2026-mains-pattern-change',
    date: '2026-08-19',
    title: 'SBI PO 2026 Mains Pattern Change: Data Analysis & Interpretation Now 60 Marks',
    category: 'Economy',
    examRelevance: ['Banking', 'SSC'],
    summary: 'State Bank of India has revised the SBI PO Mains 2026 examination pattern. The Data Analysis & Interpretation section now carries 60 marks (up from 35), making it the highest-weighted objective section. The Descriptive Paper (English) remains unchanged at 50 marks, 30 minutes.',
    whyItMatters: 'SBI PO aspirants must significantly ramp up DI preparation. The focus has shifted to table-based and caselet DI, which now constitutes approximately 12–15 questions in the expanded section. This brings SBI PO Mains closer to the pattern of management entrance exams like CAT.',
    keyFacts: [
      'SBI PO Mains 2026 revised: Data Analysis & Interpretation — 60 marks (35 Qs, 45 min).',
      'Reasoning & Computer Aptitude section: 45 marks (45 Qs, 60 min) — unchanged.',
      'General/Economy/Banking Awareness: 40 marks (40 Qs, 35 min) — unchanged.',
      'English Language: 35 marks (35 Qs, 40 min) — unchanged.',
      'Total objective: 200 marks in 3 hours. Descriptive: 50 marks, 30 minutes.',
      'SBI PO 2026 Prelims result will be declared in September 2026; Mains in November 2026.',
    ],
    tags: ['SBI PO', 'Banking', 'Mains 2026', 'Data Interpretation', 'Exam Pattern'],
    imageEmoji: '🏦',
    source: 'State Bank of India (SBI)',
  },

  {
    slug: 'upsc-csat-2026-cutoff-analysis',
    date: '2026-08-19',
    title: 'UPSC CSAT 2026 Paper Analysis: Cutoff Expected at 88–92 — RC & Maths Tips',
    category: 'Polity & Governance',
    examRelevance: ['UPSC', 'SSC'],
    summary: 'UPSC Prelims 2026 CSAT (Paper-II) was conducted on 1 June 2026. Coaching institute estimates suggest the qualifying cut-off will fall between 88–92 marks out of 200 (minimum 33% required = 66.67 marks). Reading Comprehension passages were longer and more analytical than previous years.',
    whyItMatters: 'CSAT Paper-II is qualifying but over 12,000 candidates failed to clear it in 2025. The 2026 paper included 5 RC passages (up from 4), covering Environment, Technology, and Governance themes — all relevant to UPSC GS Paper-I as well.',
    keyFacts: [
      'CSAT cutoff is fixed at 33% = 66.67 marks out of 200; estimated actual paper difficulty requires 88–92 to be safe.',
      'Reading Comprehension had 5 passages this year — Environment policy, AI governance, Urban infrastructure.',
      'Quantitative Aptitude focused on Ratio, Work, and Basic Algebra — 30% of the paper.',
      'Logical & Analytical Reasoning (Syllogisms, Directions, Arrangements) formed 35% of questions.',
      'No question from Data Interpretation appeared in CSAT 2026 — break from 2023–2025 trend.',
      'Total 80 questions, 2.5 marks each, negative marking -0.83 per wrong answer.',
    ],
    tags: ['UPSC CSAT', 'Prelims 2026', 'Paper Analysis', 'Cut-off', 'Civil Services'],
    imageEmoji: '🏛️',
    source: 'UPSC (Union Public Service Commission)',
  },

  {
    slug: 'rpf-constable-2026-notification',
    date: '2026-08-19',
    title: 'RPF Constable 2026 Notification Released: 4,208 Vacancies — Syllabus & Physical Standards',
    category: 'Polity & Governance',
    examRelevance: ['Railway', 'SSC'],
    summary: 'The Railway Protection Force (RPF) has released the notification for Constable recruitment 2026 with 4,208 vacancies (Male: 3,376, Female: 832). The Computer-Based Test will cover General Awareness, Arithmetic, and General Intelligence & Reasoning — 120 questions in 90 minutes.',
    whyItMatters: 'RPF Constable is a popular entry-level government job requiring no prior technical skills. The physical efficiency test (PET) includes running, long jump, and high jump — aspirants should begin physical training 3 months before the CBT result.',
    keyFacts: [
      'Total vacancies: 4,208 (Male: 3,376; Female: 832) across all Railway zones.',
      'Eligibility: Class 10 pass from recognised board. Age: 18–28 years (relaxation for OBC/SC/ST).',
      'CBT: 120 Qs, 90 minutes — GA (50), Arithmetic (35), General Intelligence & Reasoning (35).',
      'Negative marking: -1/3 per wrong answer.',
      'Physical Standards: Male — Height 165 cm, Weight 57 kg; Female — Height 157 cm, Weight 48 kg.',
      'Pay scale: ₹21,700–69,100 (Level-3) + Railway allowances.',
    ],
    tags: ['RPF', 'Constable 2026', 'Railway Police', 'Vacancy', 'Recruitment'],
    imageEmoji: '🚔',
    source: 'Railway Protection Force (RPF)',
  },

  {
    slug: 'ssc-chsl-2026-tier1-result-expected-cutoff',
    date: '2026-08-19',
    title: 'SSC CHSL 2026 Tier-1 Result Expected This Week: Category-wise Cutoff Predictions',
    category: 'Polity & Governance',
    examRelevance: ['SSC', 'Banking'],
    summary: 'SSC CHSL Tier-1 2026 results are expected to be declared this week on the official ssc.gov.in portal. Based on candidate responses and difficulty-level analysis across 9 shifts, the expected cutoff for General category is 130–138 marks out of 200.',
    whyItMatters: 'SSC CHSL 2026 Tier-1 result unlocks Tier-2 preparation — candidates must now focus on the skill test (DEST/CPT) and the English Comprehension + Math paper at Tier-2. Knowing the expected cutoff helps assess your candidature before the result.',
    keyFacts: [
      'SSC CHSL Tier-1 2026 was conducted from 10–23 July 2026 across 9 shifts nationwide.',
      'Expected cutoff: General: 130–138, OBC: 124–130, SC: 110–116, ST: 100–107.',
      'Total vacancies: 3,712 posts (LDC, JSA, PA, SA, DEO) across central government departments.',
      'Tier-1 is qualifying; final merit is based on Tier-2 marks only.',
      'Tier-2 will be conducted in November 2026 — 2 papers: English & Math (100 Qs each).',
      'DEST (Data Entry Skill Test) requires 8,000 key depressions per hour for DEO posts.',
    ],
    tags: ['SSC CHSL', 'CHSL 2026', 'Tier-1 Result', 'Cutoff', 'Staff Selection Commission'],
    imageEmoji: '📋',
    source: 'Staff Selection Commission (SSC)',
  },

  {
    slug: 'ibps-clerk-2026-application-begins',
    date: '2026-08-19',
    title: 'IBPS Clerk CRP-XVI 2026 Application Opens: 6,128 Vacancies — State-wise Breakdown',
    category: 'Economy',
    examRelevance: ['Banking', 'SSC'],
    summary: 'The online application for IBPS Clerk CRP-XVI 2026 has opened on ibps.in with 6,128 vacancies across 11 participating public sector banks. Candidates can apply until 28 August 2026. The application fee is ₹175 for SC/ST/PwBD and ₹850 for all other categories.',
    whyItMatters: 'IBPS Clerk is the gateway to a banking career for graduates. The exam has 3-section Prelims (English, Reasoning, Numerical) and Mains covering 5 sections. There is NO interview for Clerk posts — Mains marks directly determine final selection.',
    keyFacts: [
      'IBPS Clerk CRP-XVI 2026: 6,128 vacancies across SBI\'s partner banks (excluding SBI).',
      'Application dates: 5 August – 28 August 2026 at ibps.in.',
      'Application fee: ₹850 (General/OBC/EWS); ₹175 (SC/ST/PwBD).',
      'Prelims: 100 Qs, 60 min (English: 30, Numerical: 35, Reasoning: 35).',
      'Mains: 190 Qs, 160 min — 5 sections including Computer Knowledge (40 marks).',
      'Minimum age: 20 years; Maximum: 28 years (as on 1 August 2026).',
    ],
    tags: ['IBPS Clerk', 'CRP-XVI', 'Banking Vacancy', 'Application 2026', 'Clerical'],
    imageEmoji: '🏦',
    source: 'Institute of Banking Personnel Selection (IBPS)',
  },

  {
    slug: 'neet-ug-2026-biology-expected-questions',
    date: '2026-08-19',
    title: 'NEET UG 2026 Biology High-Weightage Chapters: Genetics & Ecology Dominate Past Papers',
    category: 'Science & Tech',
    examRelevance: ['NEET'],
    summary: 'Analysis of NEET UG 2019–2025 question papers reveals that Genetics & Evolution and Ecology & Environment together contribute 25–30% of Biology questions. For 2026, NMC\'s rationalised syllabus retains these chapters fully — making them the highest-priority topics for NEET aspirants.',
    whyItMatters: 'Biology accounts for 360 out of 720 marks in NEET UG. With the section B optional format, strategic chapter selection is critical. Genetics alone (Mendelian + Molecular) has contributed 8–12 questions per year over the past 5 years.',
    keyFacts: [
      'Genetics & Evolution: Contributes 12–14% of Biology NEET marks — Mendelian genetics, DNA replication, Mutations.',
      'Ecology: Contributes 10–12% — Ecosystems, Biodiversity, Environmental issues are guaranteed questions.',
      'Human Physiology: 20+ marks every year — Digestion, Circulation, Excretion, Neural control.',
      'Plant Kingdom & Plant Physiology: 6–8 marks — Photosynthesis, Respiration, Plant growth.',
      'Reproduction (Plants & Humans): 8–10 marks — Guaranteed questions from NCERT diagrams.',
      'Section B strategy: Attempt questions from your strongest chapter first for accuracy.',
    ],
    tags: ['NEET UG', 'Biology', 'Chapter Weightage', 'Genetics', 'Ecology', '2026 Prep'],
    imageEmoji: '🧬',
    source: 'GridAcademy Education Team',
  },

  {
    slug: 'cuet-ug-2026-domain-subject-strategy',
    date: '2026-08-19',
    title: 'CUET UG 2026 Domain Subject Strategy: How to Score 180+ in Any Subject Section',
    category: 'Social Issues',
    examRelevance: ['CUET'],
    summary: 'With CUET UG 2026 results out, toppers reveal the common strategy: 85%+ questions in domain subjects (History, Economics, Political Science, Physics, etc.) are directly from NCERT textbooks. The remaining 15% test application and current affairs relevance of the domain topic.',
    whyItMatters: 'CUET UG uses +5/-1 marking. Each domain subject has 50 questions to attempt 40 — knowing which 10 to skip matters as much as knowing the right answers. NCERT mastery is the single biggest predictor of CUET domain scores.',
    keyFacts: [
      'CUET UG domain sections: 50 Qs, attempt 40, duration 45 minutes per subject.',
      'Marking: +5 for correct, -1 for incorrect; unattempted questions = 0 marks.',
      'Top scores (190–195) are possible only if you avoid more than 2 wrong answers.',
      'NCERT chapters from Class 11 & 12 (both years) are equally tested — don\'t skip Class 11.',
      'Current Affairs integration: 10–15% of History/PoliSci CUET questions reference recent events.',
      'Mock test practice improves time management — 45 minutes for 40 Qs = 67.5 sec per question.',
    ],
    tags: ['CUET UG', 'Domain Subject', 'Strategy', 'Scoring', 'NCERT', 'NTA'],
    imageEmoji: '📖',
    source: 'GridAcademy Education Team',
  },
];

export function getAllStories(): CAStory[] {
  return stories;
}

export function getStoriesByDate(date: string): CAStory[] {
  return stories.filter(s => s.date === date);
}

export function getStory(slug: string): CAStory | undefined {
  return stories.find(s => s.slug === slug);
}

export function getAllDates(): string[] {
  const dates = Array.from(new Set(stories.map(s => s.date)));
  return dates.sort((a, b) => b.localeCompare(a)); // newest first
}
