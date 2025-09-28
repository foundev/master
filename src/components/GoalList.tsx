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
      <div>
        <p>No goals yet. Add your first goal above!</p>
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