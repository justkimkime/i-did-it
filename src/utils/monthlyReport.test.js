import test from 'node:test';
import assert from 'node:assert/strict';
import { buildMonthlyReport } from './monthlyReport.js';
import { routineOccursOn } from './routines.js';
import { startOfWeek, toKey, addDays } from './date.js';

test('일요일의 주 시작과 연도 경계를 월요일 기준으로 계산한다', () => {
  assert.equal(toKey(startOfWeek(new Date(2027, 0, 3))), '2026-12-28');
  assert.equal(toKey(addDays(new Date(2026, 11, 31), 1)), '2027-01-01');
});

test('루틴은 요일, 시작·종료일, 중지일을 따른다', () => {
  const routine = { days: [0], startDate: '2026-10-05', endDate: '2026-10-19', active: false, pausedFrom: '2026-10-19' };
  assert.equal(Boolean(routineOccursOn(routine, '2026-10-12')), true);
  for (const date of ['2026-09-28', '2026-10-13', '2026-10-19', '2026-10-26']) {
    assert.equal(Boolean(routineOccursOn(routine, date)), false);
  }
});

test('월간 집계는 오늘까지의 할 일과 루틴만 포함한다', () => {
  const report = buildMonthlyReport({
    reportMonth: new Date(2026, 9, 1), todayKey: '2026-10-17',
    tasks: [
      { date: '2026-10-16', completed: true },
      { date: '2026-10-17', completed: false },
      { date: '2026-10-18', completed: true },
      { date: '2026-09-30', completed: true },
      { date: '2026-10-16', completed: true, isGrowthTest: true },
    ],
    routines: [{ id: 'daily', days: [0,1,2,3,4,5,6], startDate: '2026-10-16', active: true }],
    routineLogs: { 'daily:2026-10-16': true },
  });
  assert.equal(report.scheduled, 4);
  assert.equal(report.done, 2);
  assert.equal(report.percentage, 50);
  assert.equal(report.perfectDays, 1);
  assert.equal(report.dayStats[17].scheduled, 2);
  assert.equal(report.dayStats[17].isFuture, true);
});

test('윤년의 빈 달은 29일이며 완료율은 0이다', () => {
  const report = buildMonthlyReport({ reportMonth: new Date(2028, 1, 1), todayKey: '2028-03-01', tasks: [], routines: [], routineLogs: {} });
  assert.equal(report.dayStats.length, 29);
  assert.equal(report.percentage, 0);
  assert.equal(report.perfectDays, 0);
});
