import { useEffect, useState } from 'react';
import { writeStoredValue } from '../utils/storage.js';

export function useLocalStorage(key, initializer) {
  const [value, setValue] = useState(initializer);
  useEffect(() => { writeStoredValue(key, value); }, [key, value]);
  return [value, setValue];
}
