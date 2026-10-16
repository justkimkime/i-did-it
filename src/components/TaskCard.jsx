import React from 'react';
import { toKey, fromKey, startOfDay, formatShortDate } from '../utils/date.js';
import { Check, Clock3, Copy, GripVertical, MoreHorizontal, Pencil, Repeat2, RotateCcw, Trash2 } from 'lucide-react';

export default function TaskCard({
  editingId,
  setEditingId,
  editingTitle,
  setEditingTitle,
  menuId,
  setMenuId,
  toggleTask,
  removeTask,
  beginEdit,
  saveEdit,
  openCopy,
  task,
  locked,
}) {
 return (
                    <article
                      className={`task-card ${task.isRoutine ? 'is-routine' : ''} ${task.completed ? 'is-completed' : ''}`}
                      key={task.id}
                      draggable={!task.isRoutine && (!task.completed || !locked)}
                      onDragStart={(event) => {
                        if (task.isRoutine) {
                          event.preventDefault();
                          return;
                        }
                        event.dataTransfer.effectAllowed = locked ? 'copy' : 'move';
                        event.dataTransfer.setData('text/task-id', task.id);
                      }}
                    >
                      <div className="task-card-top">
                        <button
                          className="check-button"
                          disabled={locked || (task.isRoutine && task.date > toKey(startOfDay()))}
                          onClick={() => toggleTask(task)}
                          aria-label={task.isRoutine && task.date > toKey(startOfDay())
                            ? '미래 루틴은 완료할 수 없음'
                            : task.completed ? '미완료로 변경' : '완료로 변경'}
                          title={task.isRoutine && task.date > toKey(startOfDay()) ? '루틴은 해당 날짜에 완료할 수 있어요' : undefined}
                        >
                          {task.completed && <Check size={14} strokeWidth={3} />}
                        </button>

                        {editingId === task.id ? (
                          <input
                            className="edit-input"
                            value={editingTitle}
                            onChange={(event) => setEditingTitle(event.target.value)}
                            onBlur={() => saveEdit(task)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter') saveEdit(task);
                              if (event.key === 'Escape') setEditingId(null);
                            }}
                            autoFocus
                          />
                        ) : (
                          <h3>{task.title}</h3>
                        )}

                        {!locked && !task.isRoutine && (
                          <div className="task-menu-wrap">
                            <button className="menu-button" onClick={() => setMenuId(menuId === task.id ? null : task.id)} aria-label="할 일 메뉴">
                              <MoreHorizontal size={17} />
                            </button>
                            {menuId === task.id && (
                              <div className="task-menu">
                                <button onClick={() => beginEdit(task)}><Pencil size={14} /> 수정</button>
                                <button onClick={() => openCopy(task)}><Copy size={14} /> 다른 날로 복사</button>
                                <button className="danger" onClick={() => removeTask(task)}><Trash2 size={14} /> 삭제</button>
                              </div>
                            )}
                          </div>
                        )}
                        {!locked && !task.isRoutine && <GripVertical className="drag-handle" size={16} />}
                      </div>

                      {task.isRoutine && (
                        <div className="routine-label"><Repeat2 size={12} /> 루틴</div>
                      )}

                      {(task.isCarryOver === true || (locked && !task.completed)) && (
                        <div className="task-meta">
                          {task.isCarryOver === true ? (
                            <span className="carry-label"><RotateCcw size={12} /> {formatShortDate(fromKey(task.originDate))}에서 이월</span>
                          ) : (
                            <span className="overdue-label"><Clock3 size={12} /> 미완료</span>
                          )}
                        </div>
                      )}

                      {task.copiedTo && locked && !task.completed && (
                        <div className="copied-note">{formatShortDate(fromKey(task.copiedTo))}로 이월됨</div>
                      )}

                      {locked && !task.completed && !task.isRoutine && (
                        <button className="carry-button" onClick={() => openCopy(task)}>
                          <Copy size={13} /> 다른 날짜로 이월
                        </button>
                      )}
                    </article>
 );
}
