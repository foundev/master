import React from 'react';
import { Goal, TimeSession } from '../types';
import { formatDuration, calculateEstimatedCompletion } from '../utils/time';
import { useTimer } from '../hooks/useTimer';

interface GoalCardProps {
  goal: Goal;
  sessions: TimeSession[];
  onStart: () => void;
  onStop: () => void;
  onDelete: () => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, sessions, onStart, onStop, onDelete }) => {
  const currentSessionTime = useTimer(goal.isActive, goal.startTime);
  const totalTime = goal.totalTimeSpent + currentSessionTime;
  const totalHoursSpent = totalTime / (1000 * 60 * 60);
  const remainingHours = Math.max(0, goal.totalHours - totalHoursSpent);
  const progressPercentage = Math.min(100, (totalHoursSpent / goal.totalHours) * 100);
  const estimatedCompletion = calculateEstimatedCompletion(goal, sessions);

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
        <button onClick={onDelete} className="outline">
          Delete
        </button>
      </div>
    </div>
  );
};