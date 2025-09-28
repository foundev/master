import React, { useState, useEffect } from 'react';
import { useGoals } from './hooks/useGoals';
import { GoalForm } from './components/GoalForm';
import { GoalList } from './components/GoalList';
import { TimeSession } from './types';
import { storage } from './utils/storage';

const App: React.FC = () => {
  const { goals, addGoal, deleteGoal, startTimer, stopTimer, addManualTime } = useGoals();
  const [sessions, setSessions] = useState<TimeSession[]>([]);

  useEffect(() => {
    const loadedSessions = storage.getSessions();
    setSessions(loadedSessions);
  }, [goals]);

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
          sessions={sessions}
          onStartTimer={startTimer}
          onStopTimer={stopTimer}
          onDeleteGoal={deleteGoal}
          onAddManualTime={addManualTime}
        />
      </section>
    </main>
  );
};

export default App;