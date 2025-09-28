import { useState, useEffect, useCallback } from 'react';
import { Goal, TimeSession } from '../types';
import { storage } from '../utils/storage';

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activeTimer, setActiveTimer] = useState<string | null>(null);

  useEffect(() => {
    const loadedGoals = storage.getGoals();
    setGoals(loadedGoals);

    const activeGoal = loadedGoals.find(goal => goal.isActive);
    if (activeGoal) {
      setActiveTimer(activeGoal.id);
    }
  }, []);

  const saveGoals = useCallback((updatedGoals: Goal[]) => {
    setGoals(updatedGoals);
    storage.saveGoals(updatedGoals);
  }, []);

  const addGoal = useCallback((title: string, description: string, totalHours: number) => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      title,
      description,
      totalHours,
      totalTimeSpent: 0,
      isActive: false,
      createdAt: Date.now(),
    };

    const updatedGoals = [...goals, newGoal];
    saveGoals(updatedGoals);
  }, [goals, saveGoals]);

  const deleteGoal = useCallback((goalId: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    saveGoals(updatedGoals);

    if (activeTimer === goalId) {
      setActiveTimer(null);
    }
  }, [goals, saveGoals, activeTimer]);

  const startTimer = useCallback((goalId: string) => {
    if (activeTimer && activeTimer !== goalId) {
      stopTimer();
    }

    const updatedGoals = goals.map(goal => ({
      ...goal,
      isActive: goal.id === goalId,
      startTime: goal.id === goalId ? Date.now() : undefined,
    }));

    saveGoals(updatedGoals);
    setActiveTimer(goalId);
  }, [goals, saveGoals, activeTimer]);

  const stopTimer = useCallback(() => {
    if (!activeTimer) return;

    const now = Date.now();
    const updatedGoals = goals.map(goal => {
      if (goal.id === activeTimer && goal.startTime) {
        const sessionDuration = now - goal.startTime;

        const session: TimeSession = {
          goalId: goal.id,
          startTime: goal.startTime,
          endTime: now,
          duration: sessionDuration,
        };

        storage.addSession(session);

        return {
          ...goal,
          isActive: false,
          totalTimeSpent: goal.totalTimeSpent + sessionDuration,
          startTime: undefined,
        };
      }
      return goal;
    });

    saveGoals(updatedGoals);
    setActiveTimer(null);
  }, [goals, saveGoals, activeTimer]);

  const addManualTime = useCallback((goalId: string, hours: number) => {
    const duration = hours * 60 * 60 * 1000;
    const now = Date.now();

    const session: TimeSession = {
      goalId,
      startTime: now - duration,
      endTime: now,
      duration,
    };

    storage.addSession(session);

    const updatedGoals = goals.map(goal =>
      goal.id === goalId
        ? { ...goal, totalTimeSpent: goal.totalTimeSpent + duration }
        : goal
    );

    saveGoals(updatedGoals);
  }, [goals, saveGoals]);

  return {
    goals,
    activeTimer,
    addGoal,
    deleteGoal,
    startTimer,
    stopTimer,
    addManualTime,
  };
};