import React, { useState, useEffect } from 'react';
import { useGoals } from './hooks/useGoals';
import { AddGoalModal } from './components/AddGoalModal';
import { GoalList } from './components/GoalList';
import { TimeSession } from './types';
import { storage } from './utils/storage';

const App: React.FC = () => {
  const { goals, addGoal, deleteGoal, startTimer, stopTimer, addManualTime } = useGoals();
  const [sessions, setSessions] = useState<TimeSession[]>([]);
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);

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
        <GoalList
          goals={goals}
          sessions={sessions}
          onStartTimer={startTimer}
          onStopTimer={stopTimer}
          onDeleteGoal={deleteGoal}
          onAddManualTime={addManualTime}
        />
      </section>

      <AddGoalModal
        isOpen={isAddGoalModalOpen}
        onClose={() => setIsAddGoalModalOpen(false)}
        onAddGoal={addGoal}
      />

      {/* Floating Action Button */}
      <button
        onClick={() => setIsAddGoalModalOpen(true)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          fontSize: '24px',
          fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          transition: 'all 0.2s ease',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        }}
        title="Add New Goal"
        aria-label="Add New Goal"
      >
        +
      </button>
    </main>
  );
};

export default App;