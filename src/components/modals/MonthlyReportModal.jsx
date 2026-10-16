import React from 'react';
import { WEEKDAYS, formatMonth } from '../../utils/date.js';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';

export default function MonthlyReportModal({
  todayKey,
  setMonthlyModal,
  reportMonth,
  setReportMonth,
  monthlyReport,
}) {
  return (
        <div className="modal-backdrop" onMouseDown={() => setMonthlyModal(false)}>
          <div className="monthly-modal" role="dialog" aria-modal="true" aria-labelledby="monthly-report-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setMonthlyModal(false)} aria-label="닫기"><X size={19} /></button>
            <div className="monthly-header">
              <div>
                <p className="eyebrow">MONTHLY RECORD</p>
                <h2 id="monthly-report-title">이번 달, 얼마나 해냈을까요?</h2>
                <p>미래 일정과 성장 확인용 테스트 일정은 진행률에서 제외해요.</p>
              </div>
              <div className="month-picker" aria-label="조회할 달 선택">
                <button onClick={() => setReportMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))} aria-label="이전 달"><ArrowLeft size={17} /></button>
                <strong>{formatMonth(reportMonth)}</strong>
                <button onClick={() => setReportMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))} aria-label="다음 달"><ArrowRight size={17} /></button>
              </div>
            </div>

            <div className="monthly-summary">
              <div className="monthly-score" style={{ '--monthly-progress': `${monthlyReport.percentage * 3.6}deg` }}>
                <div><strong>{monthlyReport.percentage}%</strong><span>완료율</span></div>
              </div>
              <div className="monthly-copy">
                <strong>{monthlyReport.done} / {monthlyReport.scheduled}개의 일을 완료했어요</strong>
                <span>{monthlyReport.scheduled ? '오늘까지 계획한 일을 기준으로 계산했어요.' : '오늘까지 등록된 일정이 없어요.'}</span>
              </div>
            </div>

            <div className="monthly-stats">
              <div><span>완벽한 날</span><strong>{monthlyReport.perfectDays}<small>일</small></strong></div>
              <div><span>일반 할 일</span><strong>{monthlyReport.taskDone}<small>개 완료</small></strong></div>
              <div><span>루틴</span><strong>{monthlyReport.routineDone}<small>개 완료</small></strong></div>
              <div><span>연속 달성</span><strong>{monthlyReport.streak}<small>일</small></strong></div>
            </div>

            <div className="month-calendar">
              <div className="month-weekdays">{WEEKDAYS.map((day) => <span key={day}>{day}</span>)}</div>
              <div className="month-grid">
                {Array.from({ length: monthlyReport.firstWeekday }, (_, index) => <span className="month-day is-empty" key={`empty-${index}`} />)}
                {monthlyReport.dayStats.map((day) => {
                  const ratio = day.scheduled ? Math.round((day.done / day.scheduled) * 100) : 0;
                  return (
                    <div className={`month-day ${day.perfect ? 'is-perfect' : ''} ${day.isFuture ? 'is-future' : ''} ${day.dateKey === todayKey ? 'is-today' : ''}`} key={day.dateKey}>
                      <span className="month-day-number">{day.date.getDate()}</span>
                      {day.scheduled > 0 ? (
                        <>
                          <div className="month-day-bar"><i style={{ width: `${ratio}%` }} /></div>
                          <small>{day.isFuture ? `${day.scheduled}개 예정` : `${day.done}/${day.scheduled}`}</small>
                          {day.perfect && <Check size={12} strokeWidth={3} />}
                        </>
                      ) : <small className="no-plan">—</small>}
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="monthly-footnote">완벽한 날은 할 일이 1개 이상 있고, 그날의 일반 할 일과 루틴을 모두 완료한 날이에요.</p>
          </div>
        </div>
  );
}
