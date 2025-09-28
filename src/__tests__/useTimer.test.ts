import { renderHook, act } from '@testing-library/react';
import { useTimer } from '../hooks/useTimer';

describe('useTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return 0 when timer is not active', () => {
    const { result } = renderHook(() => useTimer(false));

    expect(result.current).toBe(0);
  });

  it('should return 0 when active but no start time provided', () => {
    const { result } = renderHook(() => useTimer(true));

    expect(result.current).toBe(0);
  });

  it('should calculate elapsed time when active', () => {
    const startTime = Date.now() - 5000; // 5 seconds ago
    const { result } = renderHook(() => useTimer(true, startTime));

    expect(result.current).toBeGreaterThanOrEqual(5000);
  });

  it('should update elapsed time when timer is active', () => {
    const startTime = Date.now();
    const { result } = renderHook(() => useTimer(true, startTime));

    const initialElapsed = result.current;

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(result.current).toBeGreaterThan(initialElapsed);
    expect(result.current).toBeGreaterThanOrEqual(3000);
  });

  it('should not update when timer becomes inactive', () => {
    const startTime = Date.now();
    const { result, rerender } = renderHook(
      ({ isActive, startTime }) => useTimer(isActive, startTime),
      { initialProps: { isActive: true, startTime } }
    );

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    const elapsedWhenActive = result.current;

    rerender({ isActive: false, startTime });

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(result.current).toBe(0);
  });

  it('should restart timing when timer becomes active again', () => {
    const { result, rerender } = renderHook(
      ({ isActive, startTime }) => useTimer(isActive, startTime),
      { initialProps: { isActive: false, startTime: undefined } }
    );

    expect(result.current).toBe(0);

    const newStartTime = Date.now();
    rerender({ isActive: true, startTime: newStartTime });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current).toBeGreaterThanOrEqual(1000);
  });

  it('should clean up interval when component unmounts', () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    const startTime = Date.now();

    const { unmount } = renderHook(() => useTimer(true, startTime));

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();

    clearIntervalSpy.mockRestore();
  });
});