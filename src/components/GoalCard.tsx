import React from 'react';
import { Goal } from '../types';
import { formatDuration } from '../utils/time';
import { useTimer } from '../hooks/useTimer';

interface GoalCardProps {
  goal: Goal;
  onStart: () => void;
  onStop: () => void;
  onDelete: () => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onStart, onStop, onDelete }) => {
  const currentSessionTime = useTimer(goal.isActive, goal.startTime);
  const totalTime = goal.totalTimeSpent + currentSessionTime;

  return (
    <div className="goal-card">
      <h4>{goal.title}</h4>
      {goal.description && <p>{goal.description}</p>}

      <div className="time-spent">
        Total time: {formatDuration(totalTime)}
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