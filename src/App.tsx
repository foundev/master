import React from 'react';
import { useGoals } from './hooks/useGoals';
import { GoalForm } from './components/GoalForm';
import { GoalList } from './components/GoalList';

const App: React.FC = () => {
  const { goals, addGoal, deleteGoal, startTimer, stopTimer } = useGoals();

  return (
    <main className="container">
      <hgroup>
        <h1>Goal Tracker</h1>
        <h2>Track time spent working towards your goals</h2>
      </hgroup>

      <section>
        <GoalForm onSubmit={addGoal} />
      </section>

      <section>
        <GoalList
          goals={goals}
          onStartTimer={startTimer}
          onStopTimer={stopTimer}
          onDeleteGoal={deleteGoal}
        />
      </section>
    </main>
  );
};

export default App;