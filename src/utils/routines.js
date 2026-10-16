import { fromKey } from './date.js';

export const routineOccursOn = (routine, dateKey) => {
  const date = fromKey(dateKey);
  const weekdayIndex = (date.getDay() + 6) % 7;
  if (!routine.days.includes(weekdayIndex) || dateKey < routine.startDate) return false;
  if (routine.endDate && dateKey > routine.endDate) return false;
  return routine.active || (routine.pausedFrom && dateKey < routine.pausedFrom);
};
