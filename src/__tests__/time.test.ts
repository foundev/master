import { formatDuration, formatTime } from '../utils/time';

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
});