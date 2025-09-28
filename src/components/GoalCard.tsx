import React, { useState } from 'react';
import { Goal, TimeSession } from '../types';
import { formatDuration, calculateEstimatedCompletion } from '../utils/time';
import { useTimer } from '../hooks/useTimer';

interface GoalCardProps {
  goal: Goal;
  sessions: TimeSession[];
  onStart: () => void;
  onStop: () => void;
  onDelete: () => void;
  onAddManualTime: (hours: number) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, sessions, onStart, onStop, onDelete, onAddManualTime }) => {
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualHours, setManualHours] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const currentSessionTime = useTimer(goal.isActive, goal.startTime);
  const totalTime = goal.totalTimeSpent + currentSessionTime;
  const totalHoursSpent = totalTime / (1000 * 60 * 60);
  const remainingHours = Math.max(0, goal.totalHours - totalHoursSpent);
  const progressPercentage = Math.min(100, (totalHoursSpent / goal.totalHours) * 100);
  const estimatedCompletion = calculateEstimatedCompletion(goal, sessions);

  const handleManualTimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hours = parseFloat(manualHours);
    if (!isNaN(hours) && hours > 0) {
      onAddManualTime(hours);
      setManualHours('');
      setShowManualEntry(false);
    }
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
        <button onClick={() => setShowManualEntry(!showManualEntry)} className="outline">
          {showManualEntry ? 'Cancel' : 'Add Time'}
        </button>
        <button onClick={() => setShowDeleteConfirm(true)} className="outline">
          Delete
        </button>
      </div>

      {showManualEntry && (
        <form onSubmit={handleManualTimeSubmit} className="manual-time-form">
          <div>
            <input
              type="number"
              placeholder="Hours to add"
              value={manualHours}
              onChange={(e) => setManualHours(e.target.value)}
              min="0.1"
              step="0.1"
              required
            />
            <button type="submit" disabled={!manualHours || parseFloat(manualHours) <= 0}>
              Add Time
            </button>
          </div>
        </form>
      )}

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