import { Goal, TimeSession } from '../types';

const GOALS_STORAGE_KEY = 'goal-tracker-goals';
const SESSIONS_STORAGE_KEY = 'goal-tracker-sessions';

export const storage = {
  getGoals(): Goal[] {
    try {
      const stored = localStorage.getItem(GOALS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading goals from localStorage:', error);
      return [];
    }
  },

  saveGoals(goals: Goal[]): void {
    try {
      localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
    } catch (error) {
      console.error('Error saving goals to localStorage:', error);
    }
  },

  getSessions(): TimeSession[] {
    try {
      const stored = localStorage.getItem(SESSIONS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading sessions from localStorage:', error);
      return [];
    }
  },

  saveSessions(sessions: TimeSession[]): void {
    try {
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving sessions to localStorage:', error);
    }
  },

  addSession(session: TimeSession): void {
    const sessions = this.getSessions();
    sessions.push(session);
    this.saveSessions(sessions);
  }
};