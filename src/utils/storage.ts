import { Goal, TimeSession } from '../types';

const GOALS_STORAGE_KEY = 'goal-tracker-goals';
const SESSIONS_STORAGE_KEY = 'goal-tracker-sessions';
const ACTIVE_SESSION_KEY = 'goal-tracker-active-session';

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
  },

  saveActiveSession(session: { goalId: string; startTime: number; lastUpdated?: number } | null) {
    try {
      if (session) {
        localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(session));
      } else {
        localStorage.removeItem(ACTIVE_SESSION_KEY);
      }
    } catch (error) {
      console.error('Error saving active session:', error);
    }
  },

  getActiveSession(): { goalId: string; startTime: number; lastUpdated?: number } | null {
    try {
      const s = localStorage.getItem(ACTIVE_SESSION_KEY);
      return s ? JSON.parse(s) : null;
    } catch (error) {
      console.error('Error loading active session:', error);
      return null;
    }
  },
};