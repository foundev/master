import React, { useEffect } from 'react';
import { Goal, TimeSession } from '../types';
import { GoalProgressChart } from './GoalProgressChart';
import { Modal } from './Modal';
import { formatDuration, calculateEstimatedCompletion } from '../utils/time';

interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal;
  sessions: TimeSession[];
  currentSessionTime: number;
}

export const ProgressModal: React.FC<ProgressModalProps> = ({
  isOpen,
  onClose,
  goal,
  sessions,
  currentSessionTime
}) => {
  const totalTime = goal.totalTimeSpent + currentSessionTime;
  const totalHoursSpent = totalTime / (1000 * 60 * 60);
  const remainingHours = Math.max(0, goal.totalHours - totalHoursSpent);
  const progressPercentage = Math.min(100, (totalHoursSpent / goal.totalHours) * 100);
  const estimatedCompletion = calculateEstimatedCompletion(goal, sessions);

  useEffect(() => {
    if (isOpen) {
      // Trigger window resize event after modal opens to help charts resize
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Progress: ${goal.title}`}
      className="progress-modal"
    >
      <div className="progress-details">
        <div className="progress-stats">
          <p><strong>Total time spent:</strong> {formatDuration(totalTime)} ({totalHoursSpent.toFixed(1)}h / {goal.totalHours}h)</p>
          <p><strong>Progress:</strong> {progressPercentage.toFixed(1)}%</p>
          <p><strong>Remaining:</strong> {remainingHours.toFixed(1)} hours</p>
          {estimatedCompletion && (
            <p><strong>Estimated completion:</strong> {estimatedCompletion.toLocaleDateString()}</p>
          )}
          {goal.isActive && (
            <p><strong>Current session:</strong> {formatDuration(currentSessionTime)}</p>
          )}
        </div>

        <div className="chart-section">
          <GoalProgressChart
            sessions={sessions.filter(s => s.goalId === goal.id)}
            goalTitle={goal.title}
            totalHours={goal.totalHours}
          />
        </div>
      </div>

      <footer>
        <button onClick={onClose}>Close</button>
      </footer>
    </Modal>
  );
};