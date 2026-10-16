import React from 'react';
import Header from './components/Header.jsx';
import GrowthHero from './components/GrowthHero.jsx';
import WeekToolbar from './components/WeekToolbar.jsx';
import WeeklyBoard from './components/WeeklyBoard.jsx';
import MonthlyReportModal from './components/modals/MonthlyReportModal.jsx';
import DecorateModal from './components/modals/DecorateModal.jsx';
import RoutineModal from './components/modals/RoutineModal.jsx';
import CopyTaskModal from './components/modals/CopyTaskModal.jsx';
import { Check } from 'lucide-react';
import { usePlanner } from './hooks/usePlanner.js';

export default function App() {
  const planner = usePlanner();
  return (
    <main className="app-shell">
      <Header
        todayKey={planner.todayKey}
        setMonthlyModal={planner.setMonthlyModal}
        setReportMonth={planner.setReportMonth}
      />

      <section className="workspace">
      <GrowthHero
        accessory={planner.accessory}
        completedCount={planner.completedCount}
        growthStage={planner.growthStage}
        growthMilestones={planner.growthMilestones}
        nextGrowthGoal={planner.nextGrowthGoal}
        growthProgress={planner.growthProgress}
        growthMessage={planner.growthMessage}
        isFullyGrown={planner.isFullyGrown}
        availableAccessoryChoices={planner.availableAccessoryChoices}
        nextAccessoryGoal={planner.nextAccessoryGoal}
        selectedHeadAccessory={planner.selectedHeadAccessory}
        openDecorateModal={planner.openDecorateModal}
      />

      <WeekToolbar
        weekStart={planner.weekStart}
        setWeekStart={planner.setWeekStart}
        setRoutineModal={planner.setRoutineModal}
        goToCurrentWeek={planner.goToCurrentWeek}
      />

      <WeeklyBoard
        boardRef={planner.boardRef}
        todayKey={planner.todayKey}
        expandedRoutineDate={planner.expandedRoutineDate}
        setExpandedRoutineDate={planner.setExpandedRoutineDate}
        addingDate={planner.addingDate}
        setAddingDate={planner.setAddingDate}
        newTitle={planner.newTitle}
        setNewTitle={planner.setNewTitle}
        editingId={planner.editingId}
        setEditingId={planner.setEditingId}
        editingTitle={planner.editingTitle}
        setEditingTitle={planner.setEditingTitle}
        menuId={planner.menuId}
        setMenuId={planner.setMenuId}
        dates={planner.dates}
        allTasks={planner.allTasks}
        addTask={planner.addTask}
        toggleTask={planner.toggleTask}
        removeTask={planner.removeTask}
        beginEdit={planner.beginEdit}
        saveEdit={planner.saveEdit}
        onDrop={planner.onDrop}
        openCopy={planner.openCopy}
      />
      </section>

      {planner.monthlyModal && (<MonthlyReportModal
        todayKey={planner.todayKey}
        setMonthlyModal={planner.setMonthlyModal}
        reportMonth={planner.reportMonth}
        setReportMonth={planner.setReportMonth}
        monthlyReport={planner.monthlyReport}
      />)}

      {planner.decorateModal && (<DecorateModal
        accessory={planner.accessory}
        setDecorateModal={planner.setDecorateModal}
        accessoryTab={planner.accessoryTab}
        setAccessoryTab={planner.setAccessoryTab}
        setPreviewAccessoryId={planner.setPreviewAccessoryId}
        previewPosition={planner.previewPosition}
        setPreviewPosition={planner.setPreviewPosition}
        completedCount={planner.completedCount}
        availableAccessoryChoices={planner.availableAccessoryChoices}
        nextAccessoryGoal={planner.nextAccessoryGoal}
        selectedHeadAccessory={planner.selectedHeadAccessory}
        previewHeadAccessory={planner.previewHeadAccessory}
        previewIsUnlocked={planner.previewIsUnlocked}
        previewMatchesApplied={planner.previewMatchesApplied}
        visibleAccessories={planner.visibleAccessories}
        applyPreviewAccessory={planner.applyPreviewAccessory}
      />)}

      {planner.routineModal && (<RoutineModal
        routines={planner.routines}
        setRoutineModal={planner.setRoutineModal}
        routineFormOpen={planner.routineFormOpen}
        setRoutineFormOpen={planner.setRoutineFormOpen}
        routineForm={planner.routineForm}
        setRoutineForm={planner.setRoutineForm}
        editingRoutineId={planner.editingRoutineId}
        routineRepeatLabel={planner.routineRepeatLabel}
        routineWeekProgress={planner.routineWeekProgress}
        openNewRoutine={planner.openNewRoutine}
        openRoutineEdit={planner.openRoutineEdit}
        changeRepeat={planner.changeRepeat}
        saveRoutine={planner.saveRoutine}
        toggleRoutineActive={planner.toggleRoutineActive}
        endRoutine={planner.endRoutine}
      />)}

      {planner.copyTask && (<CopyTaskModal
        copyTask={planner.copyTask}
        setCopyTask={planner.setCopyTask}
        customCopyDate={planner.customCopyDate}
        setCustomCopyDate={planner.setCustomCopyDate}
        duplicateTask={planner.duplicateTask}
        copyDateOptions={planner.copyDateOptions}
      />)}

      {planner.notice && <div className="toast"><Check size={16} /> {planner.notice}</div>}
    </main>
  );
}
