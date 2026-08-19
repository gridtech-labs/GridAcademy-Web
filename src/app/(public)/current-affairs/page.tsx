import { redirect } from 'next/navigation';
import { getAllDates } from '@/lib/current-affairs';

export default function CurrentAffairsIndex() {
  const dates = getAllDates();
  const latestDate = dates.length > 0 ? dates[0] : '2026-08-20';
  
  redirect(`/current-affairs/daily/${latestDate}`);
}
