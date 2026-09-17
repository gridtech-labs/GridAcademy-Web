/** Category chip colours for current affairs, in the Exam Hall palette. */
export const CA_CATEGORY_TONE: Record<string, string> = {
  'Polity & Governance': 'bg-primary-tint text-primary-dark',
  'Economy':             'bg-[#fef3dc] text-[#8a5200]',
  'Environment':         'bg-[#e7f6ec] text-[#0b6b31]',
  'Science & Tech':      'bg-[#f0ebfb] text-[#5b34b0]',
  'International':       'bg-[#f2f4f7] text-[#344054]',
  'Social Issues':       'bg-[#fee4e2] text-[#b42318]',
  'Sports':              'bg-[#fef3dc] text-[#8a5200]',
};

export const caTone = (category: string) => CA_CATEGORY_TONE[category] ?? 'bg-[#f2f4f7] text-[#344054]';

export const formatCaDate = (iso: string, month: 'long' | 'short' = 'long') =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month, year: month === 'long' ? 'numeric' : undefined });
