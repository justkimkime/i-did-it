import React from 'react';
import { WEEKDAYS, toKey, startOfDay, formatShortDate, isPast } from '../../utils/date.js';
import { ChevronDown, CirclePlus, X } from 'lucide-react';

export default function CopyTaskModal({
  copyTask,
  setCopyTask,
  customCopyDate,
  setCustomCopyDate,
  duplicateTask,
  copyDateOptions,
}) {
  return (
        <div className="modal-backdrop" onMouseDown={() => setCopyTask(null)}>
          <div className="copy-modal" role="dialog" aria-modal="true" aria-labelledby="copy-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-icon"><CirclePlus size={22} /></div>
            <button className="modal-close" onClick={() => setCopyTask(null)} aria-label="닫기"><X size={19} /></button>
            <p className="eyebrow">MOVE FORWARD</p>
            <h2 id="copy-title">7일 안에서 다시 계획해보세요</h2>
            <p className="modal-task-title">“{copyTask.title}”</p>
            <div className="date-options">
              {copyDateOptions.map((date) => (
                <button key={toKey(date)} onClick={() => duplicateTask(copyTask, toKey(date))}>
                  <span>{WEEKDAYS[(date.getDay() + 6) % 7]}요일</span>
                  <strong>{formatShortDate(date)}</strong>
                  <ChevronDown size={15} className="option-arrow" />
                </button>
              ))}
            </div>
            <div className="custom-copy-date">
              <div>
                <strong>다른 날짜를 찾고 있나요?</strong>
                <span>원하는 날짜를 직접 선택할 수 있어요.</span>
              </div>
              <div className="custom-copy-controls">
                <input
                  type="date"
                  min={toKey(startOfDay())}
                  value={customCopyDate}
                  onChange={(event) => setCustomCopyDate(event.target.value)}
                  aria-label="복사할 날짜 직접 선택"
                />
                <button
                  disabled={!customCopyDate || customCopyDate === copyTask.date}
                  onClick={() => duplicateTask(copyTask, customCopyDate)}
                >선택</button>
              </div>
            </div>
            <p className="modal-help">
              {isPast(copyTask.date) && !copyTask.completed
                ? '원래 기록은 그대로 남고, 새 카드에는 최초 계획일이 표시됩니다.'
                : '선택한 날짜에 동일한 일정이 복사됩니다.'}
            </p>
          </div>
        </div>
  );
}
