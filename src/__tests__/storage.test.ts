import { storage } from '../utils/storage';
import { Goal, TimeSession } from '../types';

const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('storage', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  describe('goals', () => {
    it('should return empty array when no goals stored', () => {
      const goals = storage.getGoals();
      expect(goals).toEqual([]);
    });

    it('should save and retrieve goals', () => {
      const testGoals: Goal[] = [
        {
          id: '1',
          title: 'Test Goal',
          description: 'Test Description',
          totalTimeSpent: 0,
          isActive: false,
          createdAt: Date.now(),
        },
      ];

      storage.saveGoals(testGoals);
      const retrievedGoals = storage.getGoals();

      expect(retrievedGoals).toEqual(testGoals);
    });
  });

  describe('sessions', () => {
    it('should return empty array when no sessions stored', () => {
      const sessions = storage.getSessions();
      expect(sessions).toEqual([]);
    });

    it('should save and retrieve sessions', () => {
      const testSessions: TimeSession[] = [
        {
          goalId: '1',
          startTime: Date.now(),
          endTime: Date.now() + 1000,
          duration: 1000,
        },
      ];

      storage.saveSessions(testSessions);
      const retrievedSessions = storage.getSessions();

      expect(retrievedSessions).toEqual(testSessions);
    });

    it('should add individual sessions', () => {
      const session: TimeSession = {
        goalId: '1',
        startTime: Date.now(),
        endTime: Date.now() + 1000,
        duration: 1000,
      };

      storage.addSession(session);
      const sessions = storage.getSessions();

      expect(sessions).toHaveLength(1);
      expect(sessions[0]).toEqual(session);
    });
  });
});