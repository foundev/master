import { renderHook, act } from '@testing-library/react';
import { useGoals } from '../hooks/useGoals';
import { storage } from '../utils/storage';
import { Goal } from '../types';

// Mock the storage module
jest.mock('../utils/storage', () => ({
  storage: {
    getGoals: jest.fn(),
    saveGoals: jest.fn(),
    addSession: jest.fn(),
  },
}));

const mockStorage = storage as jest.Mocked<typeof storage>;

describe('useGoals', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStorage.getGoals.mockReturnValue([]);
  });

  it('should initialize with empty goals when storage is empty', () => {
    const { result } = renderHook(() => useGoals());

    expect(result.current.goals).toEqual([]);
    expect(result.current.activeTimer).toBeNull();
    expect(mockStorage.getGoals).toHaveBeenCalled();
  });

  it('should load existing goals from storage', () => {
    const existingGoals: Goal[] = [
      {
        id: '1',
        title: 'Test Goal',
        description: 'Test Description',
        totalHours: 10,
        totalTimeSpent: 5000,
        isActive: false,
        createdAt: Date.now(),
      },
    ];
    mockStorage.getGoals.mockReturnValue(existingGoals);

    const { result } = renderHook(() => useGoals());

    expect(result.current.goals).toEqual(existingGoals);
  });

  it('should set active timer when loading active goal', () => {
    const activeGoal: Goal = {
      id: '1',
      title: 'Active Goal',
      description: 'Test Description',
      totalHours: 10,
      totalTimeSpent: 0,
      isActive: true,
      createdAt: Date.now(),
    };
    mockStorage.getGoals.mockReturnValue([activeGoal]);

    const { result } = renderHook(() => useGoals());

    expect(result.current.activeTimer).toBe('1');
  });

  it('should add a new goal', () => {
    const { result } = renderHook(() => useGoals());

    act(() => {
      result.current.addGoal('New Goal', 'Description', 5);
    });

    expect(result.current.goals).toHaveLength(1);
    expect(result.current.goals[0]).toMatchObject({
      title: 'New Goal',
      description: 'Description',
      totalHours: 5,
      totalTimeSpent: 0,
      isActive: false,
    });
    expect(mockStorage.saveGoals).toHaveBeenCalled();
  });

  it('should delete a goal', () => {
    const existingGoals: Goal[] = [
      {
        id: '1',
        title: 'Goal to Delete',
        description: 'Test Description',
        totalHours: 10,
        totalTimeSpent: 0,
        isActive: false,
        createdAt: Date.now(),
      },
    ];
    mockStorage.getGoals.mockReturnValue(existingGoals);

    const { result } = renderHook(() => useGoals());

    act(() => {
      result.current.deleteGoal('1');
    });

    expect(result.current.goals).toHaveLength(0);
    expect(mockStorage.saveGoals).toHaveBeenCalled();
  });

  it('should clear active timer when deleting active goal', () => {
    const activeGoal: Goal = {
      id: '1',
      title: 'Active Goal',
      description: 'Test Description',
      totalHours: 10,
      totalTimeSpent: 0,
      isActive: true,
      createdAt: Date.now(),
    };
    mockStorage.getGoals.mockReturnValue([activeGoal]);

    const { result } = renderHook(() => useGoals());

    act(() => {
      result.current.deleteGoal('1');
    });

    expect(result.current.activeTimer).toBeNull();
  });

  it('should start timer for a goal', () => {
    const existingGoals: Goal[] = [
      {
        id: '1',
        title: 'Test Goal',
        description: 'Test Description',
        totalHours: 10,
        totalTimeSpent: 0,
        isActive: false,
        createdAt: Date.now(),
      },
    ];
    mockStorage.getGoals.mockReturnValue(existingGoals);

    const { result } = renderHook(() => useGoals());

    act(() => {
      result.current.startTimer('1');
    });

    expect(result.current.activeTimer).toBe('1');
    expect(result.current.goals[0].isActive).toBe(true);
    expect(result.current.goals[0].startTime).toBeDefined();
    expect(mockStorage.saveGoals).toHaveBeenCalled();
  });

  it('should stop previous timer when starting a new one', () => {
    const existingGoals: Goal[] = [
      {
        id: '1',
        title: 'Goal 1',
        description: 'Description 1',
        totalHours: 10,
        totalTimeSpent: 0,
        isActive: true,
        startTime: Date.now() - 5000,
        createdAt: Date.now(),
      },
      {
        id: '2',
        title: 'Goal 2',
        description: 'Description 2',
        totalHours: 10,
        totalTimeSpent: 0,
        isActive: false,
        createdAt: Date.now(),
      },
    ];
    mockStorage.getGoals.mockReturnValue(existingGoals);

    const { result } = renderHook(() => useGoals());

    act(() => {
      result.current.startTimer('2');
    });

    expect(result.current.activeTimer).toBe('2');
    expect(result.current.goals.find(g => g.id === '1')?.isActive).toBe(false);
    expect(result.current.goals.find(g => g.id === '2')?.isActive).toBe(true);
  });

  it('should stop timer and save session', () => {
    const startTime = Date.now() - 5000;
    const existingGoals: Goal[] = [
      {
        id: '1',
        title: 'Test Goal',
        description: 'Test Description',
        totalHours: 10,
        totalTimeSpent: 1000,
        isActive: true,
        startTime,
        createdAt: Date.now(),
      },
    ];
    mockStorage.getGoals.mockReturnValue(existingGoals);

    const { result } = renderHook(() => useGoals());

    act(() => {
      result.current.stopTimer();
    });

    expect(result.current.activeTimer).toBeNull();
    expect(result.current.goals[0].isActive).toBe(false);
    expect(result.current.goals[0].startTime).toBeUndefined();
    expect(result.current.goals[0].totalTimeSpent).toBeGreaterThan(1000);
    expect(mockStorage.addSession).toHaveBeenCalled();
    expect(mockStorage.saveGoals).toHaveBeenCalled();
  });

  it('should not stop timer when no active timer', () => {
    const { result } = renderHook(() => useGoals());

    act(() => {
      result.current.stopTimer();
    });

    expect(mockStorage.addSession).not.toHaveBeenCalled();
    expect(mockStorage.saveGoals).not.toHaveBeenCalled();
  });

  it('should add manual time to a goal', () => {
    const existingGoals: Goal[] = [
      {
        id: '1',
        title: 'Test Goal',
        description: 'Test Description',
        totalHours: 10,
        totalTimeSpent: 5000, // 5 seconds
        isActive: false,
        createdAt: Date.now(),
      },
    ];
    mockStorage.getGoals.mockReturnValue(existingGoals);

    const { result } = renderHook(() => useGoals());

    act(() => {
      result.current.addManualTime('1', 2); // Add 2 hours
    });

    const updatedGoal = result.current.goals[0];
    expect(updatedGoal.totalTimeSpent).toBe(5000 + (2 * 60 * 60 * 1000)); // Original + 2 hours in milliseconds
    expect(mockStorage.addSession).toHaveBeenCalledWith({
      goalId: '1',
      startTime: expect.any(Number),
      endTime: expect.any(Number),
      duration: 2 * 60 * 60 * 1000, // 2 hours in milliseconds
    });
    expect(mockStorage.saveGoals).toHaveBeenCalled();
  });

  it('should handle fractional hours in manual time entry', () => {
    const existingGoals: Goal[] = [
      {
        id: '1',
        title: 'Test Goal',
        description: 'Test Description',
        totalHours: 10,
        totalTimeSpent: 0,
        isActive: false,
        createdAt: Date.now(),
      },
    ];
    mockStorage.getGoals.mockReturnValue(existingGoals);

    const { result } = renderHook(() => useGoals());

    act(() => {
      result.current.addManualTime('1', 0.5); // Add 30 minutes
    });

    const updatedGoal = result.current.goals[0];
    expect(updatedGoal.totalTimeSpent).toBe(0.5 * 60 * 60 * 1000); // 30 minutes in milliseconds
    expect(mockStorage.addSession).toHaveBeenCalledWith({
      goalId: '1',
      startTime: expect.any(Number),
      endTime: expect.any(Number),
      duration: 0.5 * 60 * 60 * 1000,
    });
  });

  describe('Manual time with custom dates', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-15T12:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should use current date when no date is provided', () => {
      const existingGoals: Goal[] = [
        {
          id: '1',
          title: 'Test Goal',
          description: 'Test Description',
          totalHours: 10,
          totalTimeSpent: 0,
          isActive: false,
          createdAt: Date.now(),
        },
      ];
      mockStorage.getGoals.mockReturnValue(existingGoals);

      const { result } = renderHook(() => useGoals());
      const currentTime = Date.now();

      act(() => {
        result.current.addManualTime('1', 2); // 2 hours, no date
      });

      expect(mockStorage.addSession).toHaveBeenCalledWith({
        goalId: '1',
        startTime: currentTime - (2 * 60 * 60 * 1000), // 2 hours before current time
        endTime: currentTime,
        duration: 2 * 60 * 60 * 1000,
      });
    });

    it('should use custom date when date is provided', () => {
      const existingGoals: Goal[] = [
        {
          id: '1',
          title: 'Test Goal',
          description: 'Test Description',
          totalHours: 10,
          totalTimeSpent: 0,
          isActive: false,
          createdAt: Date.now(),
        },
      ];
      mockStorage.getGoals.mockReturnValue(existingGoals);

      const { result } = renderHook(() => useGoals());
      const customDate = new Date('2024-01-10T15:30:00Z'); // 5 days ago
      const customDateTime = customDate.getTime();

      act(() => {
        result.current.addManualTime('1', 1.5, customDate); // 1.5 hours on custom date
      });

      expect(mockStorage.addSession).toHaveBeenCalledWith({
        goalId: '1',
        startTime: customDateTime - (1.5 * 60 * 60 * 1000), // 1.5 hours before custom date
        endTime: customDateTime,
        duration: 1.5 * 60 * 60 * 1000,
      });
    });

    it('should handle custom date at midnight', () => {
      const existingGoals: Goal[] = [
        {
          id: '1',
          title: 'Test Goal',
          description: 'Test Description',
          totalHours: 10,
          totalTimeSpent: 0,
          isActive: false,
          createdAt: Date.now(),
        },
      ];
      mockStorage.getGoals.mockReturnValue(existingGoals);

      const { result } = renderHook(() => useGoals());
      const midnightDate = new Date('2024-01-01T00:00:00Z');
      const midnightTime = midnightDate.getTime();

      act(() => {
        result.current.addManualTime('1', 3, midnightDate);
      });

      expect(mockStorage.addSession).toHaveBeenCalledWith({
        goalId: '1',
        startTime: midnightTime - (3 * 60 * 60 * 1000),
        endTime: midnightTime,
        duration: 3 * 60 * 60 * 1000,
      });
    });

    it('should still update total time spent correctly with custom dates', () => {
      const existingGoals: Goal[] = [
        {
          id: '1',
          title: 'Test Goal',
          description: 'Test Description',
          totalHours: 10,
          totalTimeSpent: 2 * 60 * 60 * 1000, // Already has 2 hours
          isActive: false,
          createdAt: Date.now(),
        },
      ];
      mockStorage.getGoals.mockReturnValue(existingGoals);

      const { result } = renderHook(() => useGoals());
      const pastDate = new Date('2024-01-01T12:00:00Z');

      act(() => {
        result.current.addManualTime('1', 3, pastDate); // Add 3 hours on past date
      });

      const updatedGoal = result.current.goals[0];
      expect(updatedGoal.totalTimeSpent).toBe(5 * 60 * 60 * 1000); // 2 + 3 = 5 hours total
    });

    it('should handle multiple manual entries with different dates', () => {
      const existingGoals: Goal[] = [
        {
          id: '1',
          title: 'Test Goal',
          description: 'Test Description',
          totalHours: 10,
          totalTimeSpent: 0,
          isActive: false,
          createdAt: Date.now(),
        },
      ];
      mockStorage.getGoals.mockReturnValue(existingGoals);

      const { result } = renderHook(() => useGoals());
      const date1 = new Date('2024-01-01T10:00:00Z');
      const date2 = new Date('2024-01-02T14:00:00Z');

      // Add first session
      act(() => {
        result.current.addManualTime('1', 2, date1);
      });

      // Add second session
      act(() => {
        result.current.addManualTime('1', 1.5, date2);
      });

      const updatedGoal = result.current.goals[0];
      expect(updatedGoal.totalTimeSpent).toBe(3.5 * 60 * 60 * 1000); // 2 + 1.5 = 3.5 hours total
      expect(mockStorage.addSession).toHaveBeenCalledTimes(2);
    });
  });
});