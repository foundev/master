import React, { useState } from 'react';
import { Goal, TimeSession } from '../types';
import { formatDuration, calculateEstimatedCompletion } from '../utils/time';
import { useTimer } from '../hooks/useTimer';
import { ProgressModal } from './ProgressModal';
import { AddTimeModal } from './AddTimeModal';

interface GoalCardProps {
  goal: Goal;
  sessions: TimeSession[];
  onStart: () => void;
  onStop: () => void;
  onDelete: () => void;
  onAddManualTime: (hours: number, date?: Date) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, sessions, onStart, onStop, onDelete, onAddManualTime }) => {
  const [showAddTimeModal, setShowAddTimeModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const currentSessionTime = useTimer(goal.isActive, goal.startTime);
  const totalTime = goal.totalTimeSpent + currentSessionTime;
  const totalHoursSpent = totalTime / (1000 * 60 * 60);
  const remainingHours = Math.max(0, goal.totalHours - totalHoursSpent);
  const progressPercentage = Math.min(100, (totalHoursSpent / goal.totalHours) * 100);
  const estimatedCompletion = calculateEstimatedCompletion(goal, sessions);

  const handleAddTime = (hours: number, date?: Date) => {
    onAddManualTime(hours, date);
  };

  const handleDeleteConfirm = () => {
    onDelete();
    setShowDeleteConfirm(false);
  };

  return (
    <div className="goal-card">
      <h4>{goal.title}</h4>
      {goal.description && <p>{goal.description}</p>}

      <div className="progress-info">
        <div className="time-spent">
          Total time: {formatDuration(totalTime)} ({totalHoursSpent.toFixed(1)}h / {goal.totalHours}h)
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="remaining-time">
          Remaining: {remainingHours.toFixed(1)} hours
        </div>
        {estimatedCompletion && (
          <div className="estimated-completion">
            Estimated completion: {estimatedCompletion.toLocaleDateString()}
          </div>
        )}
      </div>

      {goal.isActive && (
        <div className="timer-display">
          Current session: {formatDuration(currentSessionTime)}
        </div>
      )}

      <div className="controls">
        {goal.isActive ? (
          <button onClick={onStop} className="secondary">
            Stop Timer
          </button>
        ) : (
          <button onClick={onStart}>
            Start Timer
          </button>
        )}
        <button onClick={() => setShowAddTimeModal(true)} className="outline">
          Add Time
        </button>
        <button onClick={() => setShowProgressModal(true)} className="outline">
          Show Progress
        </button>
        <button onClick={() => setShowDeleteConfirm(true)} className="outline">
          Delete
        </button>
      </div>

      <AddTimeModal
        isOpen={showAddTimeModal}
        onClose={() => setShowAddTimeModal(false)}
        goalTitle={goal.title}
        onAddTime={handleAddTime}
      />

      <ProgressModal
        isOpen={showProgressModal}
        onClose={() => setShowProgressModal(false)}
        goal={goal}
        sessions={sessions}
        currentSessionTime={currentSessionTime}
      />

      {showDeleteConfirm && (
        <div className="delete-confirmation">
          <p><strong>Are you sure you want to delete "{goal.title}"?</strong></p>
          <p>This action cannot be undone. All {totalHoursSpent.toFixed(1)} hours of tracked time will be lost.</p>
          <div className="confirmation-controls">
            <button onClick={handleDeleteConfirm} className="contrast">
              Yes, Delete Goal
            </button>
            <button onClick={() => setShowDeleteConfirm(false)} className="secondary">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};