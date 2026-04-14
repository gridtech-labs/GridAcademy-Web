import { ExamFaq } from '@/types/exam';

const staticFaqs: Record<string, ExamFaq[]> = {
  'cuet-english-previous-year-question-paper': [
    {
      question: 'What is the CUET English exam?',
      answer:
        'CUET (Common University Entrance Test) English is a language proficiency section conducted by NTA for admission to central and participating universities. It tests reading comprehension, vocabulary, grammar, and verbal ability.',
    },
    {
      question: 'How many questions are asked in CUET English?',
      answer:
        'CUET English consists of 50 questions out of which candidates need to attempt 40. The section includes reading comprehension passages, fill in the blanks, para jumbles, and vocabulary-based questions.',
    },
    {
      question: 'What is the marking scheme for CUET English?',
      answer:
        'Each correct answer carries +5 marks. For every incorrect response, 1 mark is deducted as negative marking. Unattempted questions carry no marks.',
    },
    {
      question: 'Are previous year question papers helpful for CUET English preparation?',
      answer:
        'Yes, solving CUET English previous year question papers (2022–2025) is one of the most effective preparation strategies. They help you understand the exam pattern, difficulty level, frequently asked topics, and improve your time management.',
    },
    {
      question: 'What topics are most important for CUET English?',
      answer:
        'The most important topics include Reading Comprehension, Synonyms & Antonyms, Fill in the Blanks (grammar-based), Para Jumbles, Sentence Correction, and Idioms & Phrases.',
    },
    {
      question: 'What is the difficulty level of CUET English?',
      answer:
        'CUET English is generally rated easy to moderate in difficulty. However, reading comprehension passages can be tricky with time constraints, so regular practice with mock tests and previous year papers is recommended.',
    },
  ],

  'rrb-alp-2026-assistant-loco-pilot-recruitment-exam': [
    {
      question: 'What is the RRB ALP exam?',
      answer:
        'RRB ALP (Railway Recruitment Board – Assistant Loco Pilot) is a national-level recruitment exam conducted by various Railway Recruitment Boards to fill posts of Assistant Loco Pilot and Technician in Indian Railways.',
    },
    {
      question: 'What is the eligibility criteria for RRB ALP 2026?',
      answer:
        'Candidates must have passed 10th (Matriculation) plus ITI in the relevant trade, or a Diploma/Degree in Engineering. The age limit is generally 18–28 years with relaxation for reserved categories as per government norms.',
    },
    {
      question: 'What is the exam pattern for RRB ALP 2026?',
      answer:
        'RRB ALP 2026 consists of three stages: CBT 1 (Computer Based Test) with 75 questions in 60 minutes covering Mathematics, GI & Reasoning, GS, and General Science; CBT 2 with Part A (100 questions) and Part B (75 questions on trade syllabus); and a Computer Based Aptitude Test (CBAT) for ALP posts.',
    },
    {
      question: 'What is the salary of an RRB ALP after selection?',
      answer:
        'The pay scale for Assistant Loco Pilot is Level 2 in the 7th CPC Pay Matrix, with a basic pay of ₹19,900 per month. Including allowances like DA, HRA, and TA, the gross salary ranges from approximately ₹35,000 to ₹40,000 per month.',
    },
    {
      question: 'Is there negative marking in RRB ALP 2026?',
      answer:
        'Yes, there is negative marking in both CBT 1 and CBT 2 (Part A). For every wrong answer, 1/3 of the marks allotted to that question will be deducted. Part B of CBT 2 and CBAT have no negative marking.',
    },
    {
      question: 'How many vacancies are expected in RRB ALP 2026?',
      answer:
        'The exact vacancy count for RRB ALP 2026 will be notified in the official notification. Previous cycles (2024) had over 18,000+ vacancies across all zones. Candidates are advised to check the official RRB websites for the final vacancy details.',
    },
  ],

  'ssc-cgl-t1-2025-paper': [
    {
      question: 'What is SSC CGL Tier 1?',
      answer:
        'SSC CGL (Staff Selection Commission – Combined Graduate Level) Tier 1 is the first stage of the SSC CGL examination. It is a computer-based objective-type test that screens candidates for Tier 2. It covers General Intelligence & Reasoning, General Awareness, Quantitative Aptitude, and English Comprehension.',
    },
    {
      question: 'What is the exam pattern for SSC CGL Tier 1 2025?',
      answer:
        'SSC CGL Tier 1 consists of 100 questions (25 per section) carrying 200 marks. The total duration is 60 minutes. Each correct answer fetches +2 marks and each wrong answer results in a deduction of 0.5 marks.',
    },
    {
      question: 'What is the eligibility for SSC CGL 2025?',
      answer:
        "Candidates must be a citizen of India, hold a Bachelor's Degree from a recognized university, and be between 18–32 years of age (varies by post). Age relaxations apply for SC/ST (5 years), OBC (3 years), and PwD candidates.",
    },
    {
      question: 'What is the syllabus for SSC CGL Tier 1 2025?',
      answer:
        'The four sections are: (1) General Intelligence & Reasoning – analogies, classification, coding-decoding, series; (2) General Awareness – current affairs, history, geography, polity, economy; (3) Quantitative Aptitude – arithmetic, algebra, geometry, DI; (4) English Comprehension – error detection, fill in the blanks, reading comprehension, cloze test.',
    },
    {
      question: 'What is the salary offered under SSC CGL posts?',
      answer:
        'SSC CGL posts span Pay Level 4 to Pay Level 8 (7th CPC). Entry-level posts like LDC/JSA start at ₹25,500/month whereas Group B Gazetted posts like Assistant Section Officer in CSS start at ₹47,600/month. Final in-hand salary varies by posting location and allowances.',
    },
    {
      question: 'How many stages are there in SSC CGL 2025?',
      answer:
        'SSC CGL 2025 has two stages: Tier 1 (CBT screening) and Tier 2 (CBT, consisting of Paper I for all posts, Paper II for JSO posts, and Paper III for AAO posts). The earlier Tier 3 (descriptive) and Tier 4 (skill test) have been merged into the revised Tier 2 structure.',
    },
  ],
};

export function getStaticFaqs(slug: string): ExamFaq[] {
  return staticFaqs[slug] ?? [];
}
