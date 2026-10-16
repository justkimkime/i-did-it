import React from 'react';
import { WEEKDAYS, pad, toKey } from '../utils/date.js';
import { ChevronDown, LockKeyhole, Plus, Repeat2 } from 'lucide-react';

import TaskCard from './TaskCard.jsx';
export default function DayColumn({
  todayKey,
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
  allTasks,
  addTask,
  toggleTask,
  removeTask,
  beginEdit,
  saveEdit,
  onDrop,
  openCopy,
  date,
  index,
}) {
            const dateKey = toKey(date);
            const dayTasks = allTasks
              .filter((task) => task.date === dateKey)
              .sort((a, b) => Number(b.isRoutine) - Number(a.isRoutine) || Number(a.completed) - Number(b.completed) || a.createdAt - b.createdAt);
            const dayRoutines = dayTasks.filter((task) => task.isRoutine);
            const routinesExpanded = expandedRoutineDate === dateKey;
            const visibleDayTasks = routinesExpanded
              ? dayTasks
              : dayTasks.filter((task) => !task.isRoutine);
            const done = dayTasks.filter((task) => task.completed).length;
            const locked = dateKey < todayKey;
            const completedDay = locked && dayTasks.length > 0 && done === dayTasks.length;
            return (
              <section
                className={`day-column ${locked ? 'is-locked' : ''}`}
                key={dateKey}
                data-date={dateKey}
                onDragOver={(event) => {
                  if (!locked) {
                    event.preventDefault();
                    event.currentTarget.classList.add('is-drag-over');
                  }
                }}
                onDragLeave={(event) => event.currentTarget.classList.remove('is-drag-over')}
                onDrop={(event) => onDrop(event, dateKey)}
              >
                <div className="day-header">
                  <div className="day-date-group">
                    <div className="day-date-block">
                      <span className="weekday">{WEEKDAYS[index]}요일</span>
                      <strong>{pad(date.getMonth() + 1)}.{pad(date.getDate())}</strong>
                    </div>
                    {completedDay && (
                      <div className="day-stamp" aria-label="하루의 모든 할 일을 해냄">
                        <strong>내가</strong>
                        <strong>해냄</strong>
                      </div>
                    )}
                  </div>
                  {locked && (
                    <LockKeyhole className="lock-icon" size={15} aria-label="수정할 수 없는 날짜" />
                  )}
                </div>
                <div className="day-progress">
                  <span>해야 하는 일</span>
                  <strong>{done} / {dayTasks.length}</strong>
                </div>

                <div className="task-list">
                  {dayTasks.length === 0 && (
                    <div className="empty-state">
                      <span>{locked ? '기록이 없어요' : '가벼운 계획부터\n시작해보세요'}</span>
                    </div>
                  )}
                  {dayRoutines.length > 0 && (
                    <button
                      className="routine-collapse"
                      onClick={() => setExpandedRoutineDate((current) => current === dateKey ? null : dateKey)}
                      aria-expanded={routinesExpanded}
                    >
                      <span><Repeat2 size={13} /> 루틴 {dayRoutines.length}</span>
                      <span>{dayRoutines.filter((task) => task.completed).length}/{dayRoutines.length} <ChevronDown size={14} /></span>
                    </button>
                  )}
                  {visibleDayTasks.map((task) => (
<TaskCard key={task.id} editingId={editingId} setEditingId={setEditingId} editingTitle={editingTitle} setEditingTitle={setEditingTitle} menuId={menuId} setMenuId={setMenuId} toggleTask={toggleTask} removeTask={removeTask} beginEdit={beginEdit} saveEdit={saveEdit} openCopy={openCopy} task={task} locked={locked} />
                  ))}
                </div>

                {!locked && (
                  addingDate === dateKey ? (
                    <div className="add-form">
                      <input
                        value={newTitle}
                        onChange={(event) => setNewTitle(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') addTask(dateKey);
                          if (event.key === 'Escape') setAddingDate(null);
                        }}
                        placeholder="할 일을 입력하세요"
                        autoFocus
                      />
                      <div>
                        <button className="cancel-add" onClick={() => setAddingDate(null)}>취소</button>
                        <button className="save-add" onClick={() => addTask(dateKey)}>추가</button>
                      </div>
                    </div>
                  ) : (
                    <button className="add-task" onClick={() => { setAddingDate(dateKey); setNewTitle(''); }}>
                      <Plus size={17} /> Add task
                    </button>
                  )
                )}
              </section>
            );
}
