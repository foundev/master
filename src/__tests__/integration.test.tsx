import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from '../App';
import { storage } from '../utils/storage';

// Mock the storage module
jest.mock('../utils/storage', () => ({
  storage: {
    getGoals: jest.fn(),
    saveGoals: jest.fn(),
    addSession: jest.fn(),
    getSessions: jest.fn(),
  },
}));

const mockStorage = storage as jest.Mocked<typeof storage>;

describe('Integration: Manual time with custom dates', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStorage.getGoals.mockReturnValue([]);
    mockStorage.getSessions.mockReturnValue([]);
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should correctly calculate progress with sessions from different dates', async () => {
    // Setup a goal with existing time sessions from different dates
    const goalId = '1';
    const existingGoals = [{
      id: goalId,
      title: 'Learn React',
      description: 'Master React concepts',
      totalHours: 10,
      totalTimeSpent: 5 * 60 * 60 * 1000, // 5 hours already logged
      isActive: false,
      createdAt: Date.now(),
    }];

    const existingSessions = [
      {
        goalId,
        startTime: new Date('2024-01-10T09:00:00Z').getTime(),
        endTime: new Date('2024-01-10T12:00:00Z').getTime(),
        duration: 3 * 60 * 60 * 1000, // 3 hours on Jan 10
      },
      {
        goalId,
        startTime: new Date('2024-01-12T14:00:00Z').getTime(),
        endTime: new Date('2024-01-12T16:00:00Z').getTime(),
        duration: 2 * 60 * 60 * 1000, // 2 hours on Jan 12
      },
    ];

    mockStorage.getGoals.mockReturnValue(existingGoals);
    mockStorage.getSessions.mockReturnValue(existingSessions);

    render(<App />);

    // Verify initial progress shows correctly (5 hours out of 10)
    expect(screen.getByText(/5\.0h \/ 10h/)).toBeInTheDocument();
    expect(screen.getByText(/Remaining: 5\.0 hours/)).toBeInTheDocument();

    // Add manual time with a custom date
    fireEvent.click(document.getElementById('add-time-button')!);

    const hoursInput = screen.getByPlaceholderText('Hours to add');
    const dateInput = screen.getByPlaceholderText('Date (optional)');

    fireEvent.change(hoursInput, { target: { value: '2.5' } });
    fireEvent.change(dateInput, { target: { value: '2024-01-08' } }); // Even older date

    act(() => {
      fireEvent.click(document.getElementById('submit-time-button')!);
    });

    // Verify the session was added with correct date
    expect(mockStorage.addSession).toHaveBeenCalledWith({
      goalId,
      startTime: new Date('2024-01-08T00:00:00Z').getTime() - (2.5 * 60 * 60 * 1000),
      endTime: new Date('2024-01-08T00:00:00Z').getTime(),
      duration: 2.5 * 60 * 60 * 1000,
    });

    // Verify progress is updated correctly (now 7.5 hours total)
    expect(screen.getByText(/7\.5h \/ 10h/)).toBeInTheDocument();
    expect(screen.getByText(/Remaining: 2\.5 hours/)).toBeInTheDocument();
  });

  it('should handle adding time without date (current time)', async () => {
    const goalId = '1';
    const existingGoals = [{
      id: goalId,
      title: 'Learn TypeScript',
      description: 'Master TypeScript',
      totalHours: 8,
      totalTimeSpent: 3 * 60 * 60 * 1000, // 3 hours already
      isActive: false,
      createdAt: Date.now(),
    }];

    mockStorage.getGoals.mockReturnValue(existingGoals);
    mockStorage.getSessions.mockReturnValue([]);

    render(<App />);

    // Add manual time without specifying a date
    fireEvent.click(document.getElementById('add-time-button')!);

    const hoursInput = screen.getByPlaceholderText('Hours to add');
    fireEvent.change(hoursInput, { target: { value: '1.5' } });

    const currentTime = Date.now();

    act(() => {
      fireEvent.click(document.getElementById('submit-time-button')!);
    });

    // Should use current time when no date is specified
    expect(mockStorage.addSession).toHaveBeenCalledWith({
      goalId,
      startTime: currentTime - (1.5 * 60 * 60 * 1000),
      endTime: currentTime,
      duration: 1.5 * 60 * 60 * 1000,
    });

    // Progress should update to 4.5 hours
    expect(screen.getByText(/4\.5h \/ 8h/)).toBeInTheDocument();
    expect(screen.getByText(/Remaining: 3\.5 hours/)).toBeInTheDocument();
  });

  it('should maintain correct progress calculation with mixed timer and manual entries', async () => {
    const goalId = '1';
    const existingGoals = [{
      id: goalId,
      title: 'Learn Node.js',
      description: 'Backend development',
      totalHours: 15,
      totalTimeSpent: 0,
      isActive: false,
      createdAt: Date.now(),
    }];

    mockStorage.getGoals.mockReturnValue(existingGoals);
    mockStorage.getSessions.mockReturnValue([]);

    render(<App />);

    // Start a timer
    act(() => {
      fireEvent.click(screen.getByTitle('Start Timer'));
    });

    // Simulate some time passing (1 hour)
    act(() => {
      jest.advanceTimersByTime(60 * 60 * 1000);
    });

    // Stop the timer
    act(() => {
      fireEvent.click(screen.getByTitle('Stop Timer'));
    });

    // Add manual time for a past date
    fireEvent.click(document.getElementById('add-time-button')!);

    const hoursInput = screen.getByPlaceholderText('Hours to add');
    const dateInput = screen.getByPlaceholderText('Date (optional)');

    fireEvent.change(hoursInput, { target: { value: '3' } });
    fireEvent.change(dateInput, { target: { value: '2024-01-05' } });

    act(() => {
      fireEvent.click(document.getElementById('submit-time-button')!);
    });

    // Should show total of 4 hours (1 from timer + 3 manual)
    expect(screen.getByText(/4\.0h \/ 15h/)).toBeInTheDocument();
    expect(screen.getByText(/Remaining: 11\.0 hours/)).toBeInTheDocument();

    // Verify two sessions were created
    expect(mockStorage.addSession).toHaveBeenCalledTimes(2);
  });

  it('should handle edge case: adding time for today using date picker', async () => {
    const goalId = '1';
    const existingGoals = [{
      id: goalId,
      title: 'Debug Application',
      description: 'Fix critical bugs',
      totalHours: 5,
      totalTimeSpent: 0,
      isActive: false,
      createdAt: Date.now(),
    }];

    mockStorage.getGoals.mockReturnValue(existingGoals);
    mockStorage.getSessions.mockReturnValue([]);

    render(<App />);

    // Add time using today's date explicitly
    fireEvent.click(document.getElementById('add-time-button')!);

    const hoursInput = screen.getByPlaceholderText('Hours to add');
    const dateInput = screen.getByPlaceholderText('Date (optional)');

    fireEvent.change(hoursInput, { target: { value: '2' } });
    fireEvent.change(dateInput, { target: { value: '2024-01-15' } }); // Today's date

    act(() => {
      fireEvent.click(document.getElementById('submit-time-button')!);
    });

    // Should create session for today
    expect(mockStorage.addSession).toHaveBeenCalledWith({
      goalId,
      startTime: new Date('2024-01-15T00:00:00Z').getTime() - (2 * 60 * 60 * 1000),
      endTime: new Date('2024-01-15T00:00:00Z').getTime(),
      duration: 2 * 60 * 60 * 1000,
    });

    expect(screen.getByText(/2\.0h \/ 5h/)).toBeInTheDocument();
  });

  it('should prevent adding time for future dates', () => {
    const goalId = '1';
    const existingGoals = [{
      id: goalId,
      title: 'Test Goal',
      description: 'Test',
      totalHours: 5,
      totalTimeSpent: 0,
      isActive: false,
      createdAt: Date.now(),
    }];

    mockStorage.getGoals.mockReturnValue(existingGoals);
    mockStorage.getSessions.mockReturnValue([]);

    render(<App />);

    fireEvent.click(document.getElementById('add-time-button')!);

    const dateInput = screen.getByPlaceholderText('Date (optional)');

    // Verify the max attribute prevents future dates
    expect(dateInput).toHaveAttribute('max', '2024-01-15'); // Today's date
  });
});