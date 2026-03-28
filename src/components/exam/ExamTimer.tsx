'use client';
import { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';
import { formatTimer, cn } from '@/lib/utils';

interface Props { totalSeconds: number; onExpire: () => void; }

export default function ExamTimer({ totalSeconds, onExpire }: Props) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    if (remaining <= 0) { onExpireRef.current(); return; }
    const id = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) { clearInterval(id); onExpireRef.current(); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const isLow = remaining <= 300;   // last 5 minutes
  const isCritical = remaining <= 60; // last 1 minute

  return (
    <div className={cn(
      'flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm font-bold transition-colors',
      isCritical ? 'bg-red-100 text-red-700 animate-pulse' :
      isLow      ? 'bg-orange-100 text-orange-700' :
                   'bg-gray-100 text-gray-700'
    )}>
      <Clock className={cn('w-4 h-4', isCritical && 'animate-spin')} />
      <span>{formatTimer(remaining)}</span>
    </div>
  );
}
