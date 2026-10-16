import { HEAD_ACCESSORIES, FREE_HEAD_ACCESSORY_IDS, HEAD_ACCESSORY_GROUP, DEFAULT_ACCESSORY } from '../constants/accessories.js';
import { STORAGE_KEY, COMPLETION_LEDGER_KEY, ACCESSORY_KEY } from '../constants/storage.js';

export function readTasks() {
  try {
    const savedValue = localStorage.getItem(STORAGE_KEY);
    if (savedValue === null) return [];
    const value = JSON.parse(savedValue);
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function readStoredValue(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeStoredValue(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`브라우저 저장소에 ${key} 데이터를 저장하지 못했습니다.`, error);
  }
}

export function readCompletionLedger(tasks, routineLogs) {
  const savedLedger = readStoredValue(COMPLETION_LEDGER_KEY, []);
  const ledger = new Set(Array.isArray(savedLedger) ? savedLedger : []);
  tasks.filter((task) => task.completed).forEach((task) => ledger.add(`task:${task.id}`));
  Object.entries(routineLogs)
    .filter(([, completed]) => completed)
    .forEach(([logKey]) => ledger.add(`routine:${logKey}`));
  return [...ledger];
}

export function readAccessorySettings() {
  const saved = readStoredValue(ACCESSORY_KEY, DEFAULT_ACCESSORY);
  // Older ribbon-only settings are migrated into the shared head-slot structure.
  const legacyUnlockedIds = saved.unlockedItemIds || saved.unlockedRibbonIds;
  const validSavedIds = Array.isArray(legacyUnlockedIds)
    ? legacyUnlockedIds.filter((id) => HEAD_ACCESSORIES.some((item) => item.id === id))
    : [];
  // v1 briefly provided bird-1 for free. In v2 only ribbon-1 is free and every
  // other ribbon or bird must be chosen with a completion reward.
  const migratedSavedIds = saved.version === 2
    ? validSavedIds
    : validSavedIds.filter((id) => id !== 'bird-1');
  const unlockedItemIds = Array.isArray(legacyUnlockedIds)
    ? [...new Set([...FREE_HEAD_ACCESSORY_IDS, ...migratedSavedIds])]
    : FREE_HEAD_ACCESSORY_IDS;
  const selectedHeadItemId = saved.selectedItems?.head || saved.selectedItems?.ribbon || saved.selectedRibbonId;
  const headPosition = saved.positions?.head || saved.positions?.ribbon || saved.side;
  return {
    version: 2,
    unlockedItemIds,
    selectedItems: {
      head: unlockedItemIds.includes(selectedHeadItemId) ? selectedHeadItemId : HEAD_ACCESSORY_GROUP.defaultItemId,
    },
    positions: {
      head: HEAD_ACCESSORY_GROUP.positions.includes(headPosition) ? headPosition : HEAD_ACCESSORY_GROUP.defaultPosition,
    },
  };
}
