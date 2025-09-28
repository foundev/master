import { formatDuration, formatTime, validateDailyTimeLimit } from '../utils/time';

describe('time utilities', () => {
  describe('formatDuration', () => {
    it('should format seconds only', () => {
      expect(formatDuration(5000)).toBe('5s');
      expect(formatDuration(30000)).toBe('30s');
    });

    it('should format minutes and seconds', () => {
      expect(formatDuration(65000)).toBe('1m 5s');
      expect(formatDuration(125000)).toBe('2m 5s');
    });

    it('should format hours, minutes, and seconds', () => {
      expect(formatDuration(3665000)).toBe('1h 1m 5s');
      expect(formatDuration(7265000)).toBe('2h 1m 5s');
    });

    it('should handle zero duration', () => {
      expect(formatDuration(0)).toBe('0s');
    });
  });

  describe('formatTime', () => {
    it('should format timestamp to locale string', () => {
      const timestamp = new Date('2023-01-01T12:00:00Z').getTime();
      const formatted = formatTime(timestamp);
      expect(typeof formatted).toBe('string');
      expect(formatted.length).toBeGreaterThan(0);
    });
  });

  describe('validateDailyTimeLimit', () => {
    const today = new Date('2024-01-15');
    const yesterday = new Date('2024-01-14');

    it('should allow adding time when under 24 hours', () => {
      const sessions = [
        {
          goalId: 'goal1',
          startTime: today.getTime(),
          endTime: today.getTime() + (2 * 60 * 60 * 1000), // 2 hours
          duration: 2 * 60 * 60 * 1000,
        }
      ];

      const result = validateDailyTimeLimit(sessions, 5, today);
      expect(result.isValid).toBe(true);
      expect(result.currentHours).toBe(2);
    });

    it('should reject adding time when it would exceed 24 hours', () => {
      const sessions = [
        {
          goalId: 'goal1',
          startTime: today.getTime(),
          endTime: today.getTime() + (20 * 60 * 60 * 1000), // 20 hours
          duration: 20 * 60 * 60 * 1000,
        }
      ];

      const result = validateDailyTimeLimit(sessions, 5, today);
      expect(result.isValid).toBe(false);
      expect(result.currentHours).toBe(20);
      expect(result.message).toContain('Adding 5 hours would exceed the 24-hour daily limit');
    });

    it('should only count sessions from the target date', () => {
      const sessions = [
        {
          goalId: 'goal1',
          startTime: yesterday.getTime(),
          endTime: yesterday.getTime() + (10 * 60 * 60 * 1000), // 10 hours yesterday
          duration: 10 * 60 * 60 * 1000,
        },
        {
          goalId: 'goal1',
          startTime: today.getTime(),
          endTime: today.getTime() + (5 * 60 * 60 * 1000), // 5 hours today
          duration: 5 * 60 * 60 * 1000,
        }
      ];

      const result = validateDailyTimeLimit(sessions, 10, today);
      expect(result.isValid).toBe(true);
      expect(result.currentHours).toBe(5); // Should only count today's 5 hours
    });

    it('should allow exactly 24 hours', () => {
      const sessions = [
        {
          goalId: 'goal1',
          startTime: today.getTime(),
          endTime: today.getTime() + (20 * 60 * 60 * 1000), // 20 hours
          duration: 20 * 60 * 60 * 1000,
        }
      ];

      const result = validateDailyTimeLimit(sessions, 4, today);
      expect(result.isValid).toBe(true);
      expect(result.currentHours).toBe(20);
    });

    it('should validate across multiple projects', () => {
      const sessions = [
        {
          goalId: 'goal1',
          startTime: today.getTime(),
          endTime: today.getTime() + (10 * 60 * 60 * 1000), // 10 hours on goal1
          duration: 10 * 60 * 60 * 1000,
        },
        {
          goalId: 'goal2',
          startTime: today.getTime() + (10 * 60 * 60 * 1000),
          endTime: today.getTime() + (18 * 60 * 60 * 1000), // 8 hours on goal2
          duration: 8 * 60 * 60 * 1000,
        }
      ];

      // Total is 18 hours across 2 projects, trying to add 7 more (would be 25 total)
      const result = validateDailyTimeLimit(sessions, 7, today);
      expect(result.isValid).toBe(false);
      expect(result.currentHours).toBe(18);
      expect(result.message).toContain('across 2 projects');
      expect(result.message).toContain('18.0 hours logged');
    });

    it('should show correct message for single project', () => {
      const sessions = [
        {
          goalId: 'goal1',
          startTime: today.getTime(),
          endTime: today.getTime() + (22 * 60 * 60 * 1000), // 22 hours on one goal
          duration: 22 * 60 * 60 * 1000,
        }
      ];

      const result = validateDailyTimeLimit(sessions, 3, today);
      expect(result.isValid).toBe(false);
      expect(result.currentHours).toBe(22);
      expect(result.message).toContain('for this project');
      expect(result.message).not.toContain('across');
    });

    it('should validate historical dates correctly', () => {
      const pastDate = new Date('2024-01-10');
      const sessions = [
        {
          goalId: 'goal1',
          startTime: pastDate.getTime(),
          endTime: pastDate.getTime() + (15 * 60 * 60 * 1000), // 15 hours on Jan 10
          duration: 15 * 60 * 60 * 1000,
        },
        {
          goalId: 'goal2',
          startTime: pastDate.getTime() + (15 * 60 * 60 * 1000),
          endTime: pastDate.getTime() + (18 * 60 * 60 * 1000), // 3 more hours on Jan 10
          duration: 3 * 60 * 60 * 1000,
        },
        {
          goalId: 'goal1',
          startTime: today.getTime(),
          endTime: today.getTime() + (5 * 60 * 60 * 1000), // 5 hours on today (different date)
          duration: 5 * 60 * 60 * 1000,
        }
      ];

      // Should allow adding time to today (only 5 hours used)
      const todayResult = validateDailyTimeLimit(sessions, 10, today);
      expect(todayResult.isValid).toBe(true);
      expect(todayResult.currentHours).toBe(5);

      // Should reject adding time to past date (18 hours already used, trying to add 7 = 25 total)
      const pastResult = validateDailyTimeLimit(sessions, 7, pastDate);
      expect(pastResult.isValid).toBe(false);
      expect(pastResult.currentHours).toBe(18);
      expect(pastResult.message).toContain('across 2 projects');
    });
  });
});