import React from 'react';
import { addDays, formatRangeDate } from '../utils/date.js';
import { ArrowLeft, ArrowRight, CalendarDays, Repeat2 } from 'lucide-react';

export default function WeekToolbar({
  weekStart,
  setWeekStart,
  setRoutineModal,
  goToCurrentWeek,
}) {
  return (
        <div className="week-toolbar">
          <div className="week-navigation">
            <button className="icon-button" onClick={() => setWeekStart(addDays(weekStart, -7))} aria-label="이전 주">
              <ArrowLeft size={18} />
            </button>
            <button className="date-range" onClick={goToCurrentWeek} title="이번 주로 이동">
              <CalendarDays size={18} />
              <span>{formatRangeDate(weekStart)} – {formatRangeDate(addDays(weekStart, 6))}</span>
            </button>
            <button className="icon-button" onClick={() => setWeekStart(addDays(weekStart, 7))} aria-label="다음 주">
              <ArrowRight size={18} />
            </button>
          </div>
          <div className="toolbar-actions">
            <button className="routine-button" onClick={() => setRoutineModal(true)}>
              <Repeat2 size={16} /> 루틴 관리
            </button>
            <button className="today-button" onClick={goToCurrentWeek}>이번 주</button>
          </div>
        </div>
  );
}
