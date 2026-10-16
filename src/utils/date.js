export const WEEKDAYS = ['월', '화', '수', '목', '금', '토', '일'];
export const pad = (n) => String(n).padStart(2, '0');
export const toKey = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
export const fromKey = (key) => {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
};
export const startOfDay = (date = new Date()) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
export const addDays = (date, amount) => {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
};
export const startOfWeek = (date = new Date()) => {
  const result = startOfDay(date);
  const day = result.getDay();
  result.setDate(result.getDate() - (day === 0 ? 6 : day - 1));
  return result;
};
export const formatRangeDate = (date) => `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
export const formatShortDate = (date) => `${date.getMonth() + 1}월 ${date.getDate()}일`;
export const formatMonth = (date) => `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
export const isPast = (key) => fromKey(key) < startOfDay();
export const isEditable = (key) => !isPast(key);
