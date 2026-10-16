import React from 'react';
import { WEEKDAYS, fromKey, formatShortDate } from '../../utils/date.js';
import { ArrowLeft, Plus, Play, Repeat2, Settings2, SquarePen, Trash2, X } from 'lucide-react';

export default function RoutineModal({
  routines,
  setRoutineModal,
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
}) {
  return (
        <div className="modal-backdrop" onMouseDown={() => setRoutineModal(false)}>
          <div className="routine-modal" role="dialog" aria-modal="true" aria-labelledby="routine-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="routine-modal-header">
              <div>
                <p className="eyebrow">DAILY RHYTHM</p>
                <h2 id="routine-title">루틴 관리</h2>
                <p>반복되는 일을 한곳에서 관리하세요.</p>
              </div>
              <button className="modal-close" onClick={() => setRoutineModal(false)} aria-label="닫기"><X size={19} /></button>
            </div>

            {routineFormOpen ? (
              <div className="routine-form">
                <button className="form-back" onClick={() => setRoutineFormOpen(false)}><ArrowLeft size={15} /> 목록으로</button>
                <h3>{editingRoutineId ? '루틴 수정' : '새 루틴 만들기'}</h3>
                <label>
                  <span>루틴 이름</span>
                  <input
                    value={routineForm.title}
                    onChange={(event) => setRoutineForm((current) => ({ ...current, title: event.target.value }))}
                    placeholder="예: 아침 스트레칭"
                    autoFocus
                  />
                </label>
                <fieldset>
                  <legend>반복 방식</legend>
                  <div className="repeat-presets">
                    {[
                      ['daily', '매일'],
                      ['weekdays', '평일'],
                      ['weekends', '주말'],
                      ['custom', '요일 선택'],
                    ].map(([value, label]) => (
                      <button
                        type="button"
                        className={routineForm.repeat === value ? 'is-selected' : ''}
                        key={value}
                        onClick={() => changeRepeat(value)}
                      >{label}</button>
                    ))}
                  </div>
                </fieldset>
                {routineForm.repeat === 'custom' && (
                  <fieldset>
                    <legend>반복 요일</legend>
                    <div className="weekday-picker">
                      {WEEKDAYS.map((day, index) => (
                        <button
                          type="button"
                          className={routineForm.days.includes(index) ? 'is-selected' : ''}
                          key={day}
                          onClick={() => setRoutineForm((current) => ({
                            ...current,
                            days: current.days.includes(index)
                              ? current.days.filter((item) => item !== index)
                              : [...current.days, index].sort(),
                          }))}
                        >{day}</button>
                      ))}
                    </div>
                  </fieldset>
                )}
                <div className="date-fields">
                  <label>
                    <span>시작일</span>
                    <input type="date" value={routineForm.startDate} onChange={(event) => setRoutineForm((current) => ({ ...current, startDate: event.target.value }))} />
                  </label>
                  <label>
                    <span>종료일 <small>선택</small></span>
                    <input type="date" min={routineForm.startDate} value={routineForm.endDate} onChange={(event) => setRoutineForm((current) => ({ ...current, endDate: event.target.value }))} />
                  </label>
                </div>
                <div className="routine-form-actions">
                  <button className="cancel-add" onClick={() => setRoutineFormOpen(false)}>취소</button>
                  <button className="save-routine" disabled={!routineForm.title.trim() || routineForm.days.length === 0} onClick={saveRoutine}>
                    {editingRoutineId ? '변경 저장' : '루틴 추가'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button className="new-routine-button" onClick={openNewRoutine}><Plus size={17} /> 새 루틴</button>
                <div className="routine-list">
                  {routines.length === 0 ? (
                    <div className="routine-empty">
                      <div><Repeat2 size={24} /></div>
                      <strong>아직 등록된 루틴이 없어요</strong>
                      <span>매일 반복할 일을 루틴으로 만들어보세요.</span>
                    </div>
                  ) : routines.map((routine) => (
                    <article className={`routine-item ${!routine.active ? 'is-paused' : ''}`} key={routine.id}>
                      <div className="routine-item-icon"><Repeat2 size={17} /></div>
                      <div className="routine-item-content">
                        <div className="routine-item-title">
                          <h3>{routine.title}</h3>
                          <span className={routine.active ? 'active-status' : 'paused-status'}>{routine.ended ? '종료됨' : routine.active ? '활성' : '중지됨'}</span>
                        </div>
                        <p>{routineRepeatLabel(routine)} · {formatShortDate(fromKey(routine.startDate))}부터{routine.endDate ? ` · ${formatShortDate(fromKey(routine.endDate))}까지` : ''}</p>
                        <div className="routine-progress-row">
                          <span>표시 중인 주</span>
                          <strong>{routineWeekProgress(routine)} 완료</strong>
                        </div>
                      </div>
                      <div className="routine-item-actions">
                        {!routine.ended && <button onClick={() => openRoutineEdit(routine)} aria-label="루틴 수정"><SquarePen size={15} /></button>}
                        {!routine.ended && <button onClick={() => toggleRoutineActive(routine)} aria-label={routine.active ? '루틴 중지' : '루틴 다시 시작'}>{routine.active ? <Settings2 size={15} /> : <Play size={15} />}</button>}
                        {!routine.ended && <button className="danger" onClick={() => endRoutine(routine)} aria-label="루틴 종료"><Trash2 size={15} /></button>}
                      </div>
                    </article>
                  ))}
                </div>
                {routines.length > 0 && <p className="routine-footer-note">루틴 카드는 다른 날짜로 복사하거나 이동할 수 없습니다.</p>}
              </>
            )}
          </div>
        </div>
  );
}
