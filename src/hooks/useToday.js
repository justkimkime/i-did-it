import { useEffect, useState } from 'react';
import { toKey, startOfDay } from '../utils/date.js';

export function useToday() {
  const [todayKey, setTodayKey] = useState(() => toKey(startOfDay()));
  useEffect(() => {
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timer = window.setTimeout(() => setTodayKey(toKey(startOfDay())), nextMidnight.getTime() - now.getTime() + 100);
    return () => window.clearTimeout(timer);
  }, [todayKey]);

  return todayKey;
}
