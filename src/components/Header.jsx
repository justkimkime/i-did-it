import React from 'react';
import { fromKey } from '../utils/date.js';
import { CalendarDays, Check } from 'lucide-react';

export default function Header({
  todayKey,
  setMonthlyModal,
  setReportMonth,
}) {
  return (
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark"><Check size={18} strokeWidth={3} /></div>
          <span>I did it.</span>
        </div>
        <div className="topbar-actions">
          <div className="topbar-caption">나의 주간 플래너</div>
          <button className="monthly-report-button" onClick={() => { setReportMonth(new Date(fromKey(todayKey).getFullYear(), fromKey(todayKey).getMonth(), 1)); setMonthlyModal(true); }} aria-label="월간 진행률 보기" title="월간 진행률">
            <CalendarDays size={18} />
          </button>
        </div>
      </header>
  );
}
