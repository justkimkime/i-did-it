import { toKey } from '../utils/date.js';
import { routineOccursOn } from '../utils/routines.js';

export function buildMonthlyReport({ reportMonth, tasks, routines, routineLogs, todayKey }) {
    const year = reportMonth.getFullYear();
    const month = reportMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
    const dayStats = Array.from({ length: daysInMonth }, (_, index) => {
      const date = new Date(year, month, index + 1);
      const dateKey = toKey(date);
      const normalTasks = tasks.filter((task) => task.date === dateKey && !task.isGrowthTest);
      const routineInstances = routines
        .filter((routine) => routineOccursOn(routine, dateKey))
        .map((routine) => ({ completed: Boolean(routineLogs[`${routine.id}:${dateKey}`]) }));
      const scheduled = normalTasks.length + routineInstances.length;
      const taskDone = normalTasks.filter((task) => task.completed).length;
      const routineDone = routineInstances.filter((item) => item.completed).length;
      const done = taskDone + routineDone;
      const isFuture = dateKey > todayKey;
      return { date, dateKey, scheduled, done, taskDone, routineDone, isFuture, perfect: !isFuture && scheduled > 0 && done === scheduled };
    });
    const countableDays = dayStats.filter((day) => !day.isFuture);
    const scheduled = countableDays.reduce((sum, day) => sum + day.scheduled, 0);
    const done = countableDays.reduce((sum, day) => sum + day.done, 0);
    const taskDone = countableDays.reduce((sum, day) => sum + day.taskDone, 0);
    const routineDone = countableDays.reduce((sum, day) => sum + day.routineDone, 0);
    const perfectDays = countableDays.filter((day) => day.perfect).length;
    const percentage = scheduled ? Math.round((done / scheduled) * 100) : 0;
    let streak = 0;
    const eligible = countableDays.filter((day) => day.scheduled > 0).reverse();
    for (const day of eligible) {
      if (!day.perfect) break;
      streak += 1;
    }
    return { dayStats, firstWeekday, scheduled, done, taskDone, routineDone, perfectDays, percentage, streak };
}
