import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLocalStorage } from './useLocalStorage.js';
import { useToday } from './useToday.js';
import { readTasks, readStoredValue, readCompletionLedger, readAccessorySettings } from '../utils/storage.js';
import { buildMonthlyReport } from '../utils/monthlyReport.js';
import { WEEKDAYS, toKey, fromKey, startOfDay, addDays, startOfWeek, formatShortDate, isPast, isEditable } from '../utils/date.js';
import { RIBBONS, BIRDS, HEAD_ACCESSORIES, FREE_HEAD_ACCESSORY_IDS } from '../constants/accessories.js';
import { STORAGE_KEY, ROUTINES_KEY, ROUTINE_LOGS_KEY, COMPLETION_LEDGER_KEY, ACCESSORY_KEY } from '../constants/storage.js';
import { routineOccursOn } from '../utils/routines.js';

const emptyRoutineForm = () => ({
  title: '',
  repeat: 'daily',
  days: [0, 1, 2, 3, 4, 5, 6],
  startDate: toKey(startOfDay()),
  endDate: '',
});

export function usePlanner() {
  const boardRef = useRef(null);
  const [weekStart, setWeekStart] = useState(() => startOfWeek());
  const todayKey = useToday();
  const [tasks, setTasks] = useLocalStorage(STORAGE_KEY, readTasks);
  const [routines, setRoutines] = useLocalStorage(ROUTINES_KEY, () => readStoredValue(ROUTINES_KEY, []));
  const [routineLogs, setRoutineLogs] = useLocalStorage(ROUTINE_LOGS_KEY, () => readStoredValue(ROUTINE_LOGS_KEY, {}));
  const [completionLedger, setCompletionLedger] = useLocalStorage(COMPLETION_LEDGER_KEY, () => readCompletionLedger(tasks, routineLogs));
  const [accessory, setAccessory] = useLocalStorage(ACCESSORY_KEY, readAccessorySettings);
  const [decorateModal, setDecorateModal] = useState(false);
  const [accessoryTab, setAccessoryTab] = useState('ribbon');
  const [previewAccessoryId, setPreviewAccessoryId] = useState(null);
  const [previewPosition, setPreviewPosition] = useState('right');
  const [routineModal, setRoutineModal] = useState(false);
  const [monthlyModal, setMonthlyModal] = useState(false);
  const [reportMonth, setReportMonth] = useState(() => new Date(startOfDay().getFullYear(), startOfDay().getMonth(), 1));
  const [routineFormOpen, setRoutineFormOpen] = useState(false);
  const [routineForm, setRoutineForm] = useState(emptyRoutineForm);
  const [editingRoutineId, setEditingRoutineId] = useState(null);
  const [expandedRoutineDate, setExpandedRoutineDate] = useState(null);
  const [addingDate, setAddingDate] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [menuId, setMenuId] = useState(null);
  const [copyTask, setCopyTask] = useState(null);
  const [customCopyDate, setCustomCopyDate] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(''), 2600);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const dates = useMemo(() => Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)), [weekStart]);

  const centerDateInBoard = (dateKey, behavior = 'smooth') => {
    const board = boardRef.current;
    const target = board?.querySelector(`[data-date="${dateKey}"]`);
    if (!board || !target) return;

    const boardRect = board.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const targetLeft = board.scrollLeft + targetRect.left - boardRect.left;
    const centeredLeft = targetLeft - (board.clientWidth - targetRect.width) / 2;
    board.scrollTo({ left: Math.max(0, centeredLeft), behavior });
  };

  useLayoutEffect(() => {
    const todayKey = toKey(startOfDay());
    const isCurrentWeek = dates.some((date) => toKey(date) === todayKey);
    if (!isCurrentWeek) return undefined;

    const frame = window.requestAnimationFrame(() => centerDateInBoard(todayKey, 'auto'));
    return () => window.cancelAnimationFrame(frame);
  }, [weekStart]);

  const goToCurrentWeek = () => {
    const currentWeekStart = startOfWeek();
    if (toKey(currentWeekStart) === toKey(weekStart)) {
      centerDateInBoard(toKey(startOfDay()));
      return;
    }
    setWeekStart(currentWeekStart);
  };
  const routineTasks = useMemo(() => dates.flatMap((date) => {
    const dateKey = toKey(date);
    return routines
      .filter((routine) => routineOccursOn(routine, dateKey))
      .map((routine) => ({
        id: `routine:${routine.id}:${dateKey}`,
        routineId: routine.id,
        title: routine.title,
        date: dateKey,
        originDate: dateKey,
        completed: Boolean(routineLogs[`${routine.id}:${dateKey}`]),
        createdAt: routine.createdAt,
        isRoutine: true,
      }));
  }), [dates, routines, routineLogs]);
  const allTasks = [...tasks, ...routineTasks];
  const completedCount = completionLedger.length;
  const growthStage = completedCount >= 30 ? 4 : completedCount >= 20 ? 3 : completedCount >= 10 ? 2 : completedCount >= 5 ? 1 : 0;
  const growthMilestones = [3, 5, 10, 20, 30];
  const nextGrowthGoal = growthMilestones.find((goal) => completedCount < goal);
  const growthProgress = Math.min(100, Math.round((completedCount / 30) * 100));
  const growthMessages = [
    '아주 작은 먼지가 태어났어요',
    '먼지가 포근하게 자랐어요',
    '드디어 눈이 생겼어요!',
    '작은 팔이 쏙 자랐어요!',
    '다리까지 생겨 완전히 자랐어요!',
  ];
  const growthMessage = completedCount < 3 ? '아주 작은 먼지가 태어나려 해요' : growthMessages[growthStage];
  const isFullyGrown = completedCount >= 30;
  const earnedAccessoryChoices = Math.min(HEAD_ACCESSORIES.length - FREE_HEAD_ACCESSORY_IDS.length, Math.max(0, Math.floor((completedCount - 30) / 10)));
  const usedAccessoryChoices = Math.max(0, accessory.unlockedItemIds.length - FREE_HEAD_ACCESSORY_IDS.length);
  const availableAccessoryChoices = Math.max(0, earnedAccessoryChoices - usedAccessoryChoices);
  const nextAccessoryGoal = accessory.unlockedItemIds.length < HEAD_ACCESSORIES.length
    ? 30 + (earnedAccessoryChoices + 1) * 10
    : null;
  const selectedHeadAccessory = HEAD_ACCESSORIES.find((item) => item.id === accessory.selectedItems.head) || RIBBONS[0];
  const previewHeadAccessory = HEAD_ACCESSORIES.find((item) => item.id === previewAccessoryId) || selectedHeadAccessory;
  const previewIsUnlocked = accessory.unlockedItemIds.includes(previewHeadAccessory.id);
  const previewMatchesApplied = previewHeadAccessory.id === selectedHeadAccessory.id
    && previewPosition === accessory.positions.head;
  const visibleAccessories = accessoryTab === 'bird' ? BIRDS : RIBBONS;

  const monthlyReport = useMemo(() => buildMonthlyReport({ reportMonth, tasks, routines, routineLogs, todayKey }), [reportMonth, tasks, routines, routineLogs, todayKey]);

  const recordCompletion = (completionId) => {
    setCompletionLedger((current) => current.includes(completionId) ? current : [...current, completionId]);
  };

  const openDecorateModal = () => {
    setPreviewAccessoryId(accessory.selectedItems.head);
    setPreviewPosition(accessory.positions.head);
    setAccessoryTab(selectedHeadAccessory.type);
    setDecorateModal(true);
  };

  const applyPreviewAccessory = () => {
    if (!previewIsUnlocked && availableAccessoryChoices === 0) return;
    setAccessory((current) => ({
      ...current,
      unlockedItemIds: previewIsUnlocked
        ? current.unlockedItemIds
        : [...current.unlockedItemIds, previewHeadAccessory.id],
      selectedItems: { ...current.selectedItems, head: previewHeadAccessory.id },
      positions: { ...current.positions, head: previewPosition },
    }));
    setNotice(previewIsUnlocked ? '선택한 장식을 적용했어요.' : '새 머리 장식을 해금하고 적용했어요!');
  };

  const addTask = (dateKey) => {
    const title = newTitle.trim();
    if (!title || !isEditable(dateKey)) return;
    setTasks((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        title,
        date: dateKey,
        originDate: dateKey,
        completed: false,
        carriedCount: 0,
        createdAt: Date.now(),
      },
    ]);
    setNewTitle('');
    setAddingDate(null);
  };

  const updateTask = (id, changes) => {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, ...changes } : task)));
  };

  const toggleTask = (task) => {
    if (task.isRoutine) {
      const logKey = `${task.routineId}:${task.date}`;
      if (!task.completed) recordCompletion(`routine:${logKey}`);
      setRoutineLogs((current) => ({ ...current, [logKey]: !task.completed }));
      return;
    }
    if (!task.completed) recordCompletion(`task:${task.id}`);
    updateTask(task.id, { completed: !task.completed });
  };

  const routineRepeatLabel = (routine) => {
    if (routine.days.length === 7) return '매일';
    if (routine.days.join(',') === '0,1,2,3,4') return '평일';
    if (routine.days.join(',') === '5,6') return '주말';
    return routine.days.map((day) => WEEKDAYS[day]).join('·');
  };

  const routineWeekProgress = (routine) => {
    const instances = routineTasks.filter((task) => task.routineId === routine.id);
    return `${instances.filter((task) => task.completed).length} / ${instances.length}`;
  };

  const openNewRoutine = () => {
    setEditingRoutineId(null);
    setRoutineForm(emptyRoutineForm());
    setRoutineFormOpen(true);
  };

  const openRoutineEdit = (routine) => {
    setEditingRoutineId(routine.id);
    setRoutineForm({
      title: routine.title,
      repeat: routine.repeat,
      days: routine.days,
      startDate: routine.startDate,
      endDate: routine.endDate || '',
    });
    setRoutineFormOpen(true);
  };

  const changeRepeat = (repeat) => {
    const presets = {
      daily: [0, 1, 2, 3, 4, 5, 6],
      weekdays: [0, 1, 2, 3, 4],
      weekends: [5, 6],
      custom: routineForm.repeat === 'custom' ? routineForm.days : [],
    };
    setRoutineForm((current) => ({ ...current, repeat, days: presets[repeat] }));
  };

  const saveRoutine = () => {
    const title = routineForm.title.trim();
    if (!title || routineForm.days.length === 0) return;
    if (editingRoutineId) {
      setRoutines((current) => current.map((routine) => routine.id === editingRoutineId
        ? { ...routine, ...routineForm, title }
        : routine));
      setNotice('루틴을 수정했어요.');
    } else {
      setRoutines((current) => [...current, {
        id: crypto.randomUUID(),
        ...routineForm,
        title,
        active: true,
        pausedFrom: null,
        createdAt: Date.now(),
      }]);
      setNotice('새 루틴을 추가했어요.');
    }
    setRoutineFormOpen(false);
    setEditingRoutineId(null);
  };

  const toggleRoutineActive = (routine) => {
    setRoutines((current) => current.map((item) => item.id === routine.id
      ? { ...item, active: !item.active, pausedFrom: item.active ? toKey(startOfDay()) : null }
      : item));
  };

  const endRoutine = (routine) => {
    setRoutines((current) => current.map((item) => item.id === routine.id
      ? { ...item, active: false, pausedFrom: toKey(startOfDay()), ended: true }
      : item));
    setNotice('루틴을 종료했어요. 과거 기록은 유지됩니다.');
  };

  const removeTask = (task) => {
    if (!isEditable(task.date)) return;
    setTasks((current) => current.filter((item) => item.id !== task.id));
    setMenuId(null);
  };

  const beginEdit = (task) => {
    if (!isEditable(task.date)) return;
    setEditingId(task.id);
    setEditingTitle(task.title);
    setMenuId(null);
  };

  const saveEdit = (task) => {
    const title = editingTitle.trim();
    if (title && isEditable(task.date)) updateTask(task.id, { title });
    setEditingId(null);
  };

  const duplicateTask = (task, destination) => {
    if (!destination || isPast(destination) || task.date === destination) return;
    const isCarryOver = isPast(task.date) && !task.completed;
    const alreadyExists = tasks.some(
      (item) => item.sourceId === (task.sourceId || task.id) && item.date === destination,
    );
    if (alreadyExists) {
      setNotice('이미 이 날짜로 이월한 할 일이에요.');
      setCopyTask(null);
      return;
    }
    const sourceId = task.sourceId || task.id;
    // Only an unfinished task copied from a past date is an actual carry-over.
    // Copies made from today or a future date are ordinary schedule adjustments.
    const originDate = isCarryOver ? (task.originDate || task.date) : destination;
    const copied = {
      ...task,
      id: crypto.randomUUID(),
      date: destination,
      originDate,
      sourceId,
      isCarryOver,
      completed: false,
      carriedCount: isCarryOver ? (task.carriedCount || 0) + 1 : 0,
      createdAt: Date.now(),
    };
    setTasks((current) => [
      ...current.map((item) =>
        item.id === task.id && isCarryOver ? { ...item, copiedTo: destination } : item,
      ),
      copied,
    ]);
    setCopyTask(null);
    setMenuId(null);
    setNotice(
      isCarryOver
        ? `${formatShortDate(fromKey(destination))}로 이월했어요.`
        : `${formatShortDate(fromKey(destination))}에 복사했어요.`,
    );
  };

  const moveTask = (task, destination) => {
    if (task.isRoutine) return;
    if (!destination || isPast(destination) || task.date === destination) return;
    if (isPast(task.date)) {
      if (!task.completed) duplicateTask(task, destination);
      return;
    }
    updateTask(task.id, { date: destination });
    setNotice(`${formatShortDate(fromKey(destination))}로 옮겼어요.`);
  };

  const onDrop = (event, dateKey) => {
    event.preventDefault();
    const id = event.dataTransfer.getData('text/task-id');
    const task = tasks.find((item) => item.id === id);
    event.currentTarget.classList.remove('is-drag-over');
    if (task) moveTask(task, dateKey);
  };

  const openCopy = (task) => {
    if (task.isRoutine) return;
    setCopyTask(task);
    setCustomCopyDate('');
    setMenuId(null);
  };

  const copyDateOptions = useMemo(() => {
    if (!copyTask) return [];
    const taskDate = fromKey(copyTask.date);
    const firstDate = isPast(copyTask.date) ? startOfDay() : addDays(taskDate, 1);
    return Array.from({ length: 7 }, (_, index) => addDays(firstDate, index));
  }, [copyTask]);

  return {
    todayKey,
    setMonthlyModal,
    setReportMonth,
    accessory,
    completedCount,
    growthStage,
    growthMilestones,
    nextGrowthGoal,
    growthProgress,
    growthMessage,
    isFullyGrown,
    availableAccessoryChoices,
    nextAccessoryGoal,
    selectedHeadAccessory,
    openDecorateModal,
    weekStart,
    setWeekStart,
    setRoutineModal,
    goToCurrentWeek,
    boardRef,
    expandedRoutineDate,
    setExpandedRoutineDate,
    addingDate,
    setAddingDate,
    newTitle,
    setNewTitle,
    editingId,
    setEditingId,
    editingTitle,
    setEditingTitle,
    menuId,
    setMenuId,
    dates,
    allTasks,
    addTask,
    toggleTask,
    removeTask,
    beginEdit,
    saveEdit,
    onDrop,
    openCopy,
    reportMonth,
    monthlyReport,
    monthlyModal,
    setDecorateModal,
    accessoryTab,
    setAccessoryTab,
    setPreviewAccessoryId,
    previewPosition,
    setPreviewPosition,
    previewHeadAccessory,
    previewIsUnlocked,
    previewMatchesApplied,
    visibleAccessories,
    applyPreviewAccessory,
    decorateModal,
    routines,
    routineFormOpen,
    setRoutineFormOpen,
    routineForm,
    setRoutineForm,
    editingRoutineId,
    routineRepeatLabel,
    routineWeekProgress,
    openNewRoutine,
    openRoutineEdit,
    changeRepeat,
    saveRoutine,
    toggleRoutineActive,
    endRoutine,
    routineModal,
    copyTask,
    setCopyTask,
    customCopyDate,
    setCustomCopyDate,
    duplicateTask,
    copyDateOptions,
    notice,
  };
}
