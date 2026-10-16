import React from 'react';
import DayColumn from './DayColumn.jsx';

export default function WeeklyBoard({
  boardRef,
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
  dates,
  allTasks,
  addTask,
  toggleTask,
  removeTask,
  beginEdit,
  saveEdit,
  onDrop,
  openCopy,
}) {
 return (
 <div className="board" ref={boardRef} aria-label="주간 투두 보드">
 {dates.map((date,index) => <DayColumn key={date.toISOString()} todayKey={todayKey} expandedRoutineDate={expandedRoutineDate} setExpandedRoutineDate={setExpandedRoutineDate} addingDate={addingDate} setAddingDate={setAddingDate} newTitle={newTitle} setNewTitle={setNewTitle} editingId={editingId} setEditingId={setEditingId} editingTitle={editingTitle} setEditingTitle={setEditingTitle} menuId={menuId} setMenuId={setMenuId} allTasks={allTasks} addTask={addTask} toggleTask={toggleTask} removeTask={removeTask} beginEdit={beginEdit} saveEdit={saveEdit} onDrop={onDrop} openCopy={openCopy} date={date} index={index} />)}
 </div>
 );
}
