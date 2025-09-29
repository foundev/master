import React from 'react';
import { Goal, TimeSession } from '../types';
import { GoalCard } from './GoalCard';

interface GoalListProps {
  goals: Goal[];
  sessions: TimeSession[];
  onStartTimer: (goalId: string) => void;
  onStopTimer: () => void;
  onDeleteGoal: (goalId: string) => void;
  onAddManualTime: (goalId: string, hours: number, date?: Date) => void;
}

export const GoalList: React.FC<GoalListProps> = ({
  goals,
  sessions,
  onStartTimer,
  onStopTimer,
  onDeleteGoal,
  onAddManualTime,
}) => {
  if (goals.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted-color)' }}>
        <p>No goals yet. Click the "Add New Goal" button to get started!</p>
      </div>
    );
  }

  return (
    <div>
      <h3>Your Goals</h3>
      {goals.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          sessions={sessions}
          onStart={() => onStartTimer(goal.id)}
          onStop={onStopTimer}
          onDelete={() => onDeleteGoal(goal.id)}
          onAddManualTime={(hours, date) => onAddManualTime(goal.id, hours, date)}
        />
      ))}
    </div>
  );
};