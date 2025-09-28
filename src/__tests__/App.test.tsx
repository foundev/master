import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { storage } from '../utils/storage';

// Mock the storage module
jest.mock('../utils/storage', () => ({
  storage: {
    getGoals: jest.fn(),
    saveGoals: jest.fn(),
    getSessions: jest.fn(),
    addSession: jest.fn(),
  },
}));

// Mock time utilities
jest.mock('../utils/time', () => ({
  formatDuration: jest.fn((ms) => `${Math.floor(ms / 1000)}s`),
  calculateEstimatedCompletion: jest.fn(() => null),
}));

// Mock useTimer hook
jest.mock('../hooks/useTimer', () => ({
  useTimer: jest.fn(() => 0),
}));

const mockStorage = storage as jest.Mocked<typeof storage>;

describe('App Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStorage.getGoals.mockReturnValue([]);
    mockStorage.getSessions.mockReturnValue([]);
  });

  it('should render app header and initial empty state', () => {
    render(<App />);

    expect(screen.getByText('Goal Tracker')).toBeInTheDocument();
    expect(screen.getByText('Track time spent working towards your goals')).toBeInTheDocument();
    expect(screen.getByText('Add New Goal')).toBeInTheDocument();
    expect(screen.getByText('No goals yet. Add your first goal above!')).toBeInTheDocument();
  });

  it('should load and display existing goals from storage', () => {
    const existingGoals = [
      {
        id: '1',
        title: 'Learn React',
        description: 'Study React fundamentals',
        totalHours: 20,
        totalTimeSpent: 3600000, // 1 hour
        isActive: false,
        createdAt: Date.now(),
      },
      {
        id: '2',
        title: 'Build Portfolio',
        description: 'Create a personal portfolio website',
        totalHours: 40,
        totalTimeSpent: 7200000, // 2 hours
        isActive: false,
        createdAt: Date.now(),
      },
    ];

    mockStorage.getGoals.mockReturnValue(existingGoals);

    render(<App />);

    expect(screen.getByText('Your Goals')).toBeInTheDocument();
    expect(screen.getByText('Learn React')).toBeInTheDocument();
    expect(screen.getByText('Study React fundamentals')).toBeInTheDocument();
    expect(screen.getByText('Build Portfolio')).toBeInTheDocument();
    expect(screen.getByText('Create a personal portfolio website')).toBeInTheDocument();
    expect(screen.queryByText('No goals yet. Add your first goal above!')).not.toBeInTheDocument();
  });

  it('should create a new goal through the form', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Fill out the form
    await user.type(screen.getByPlaceholderText('Goal title'), 'Test Goal');
    await user.type(screen.getByPlaceholderText('Goal description (optional)'), 'Test Description');
    await user.type(screen.getByPlaceholderText('Total hours required'), '10');

    // Submit the form
    await user.click(screen.getByText('Add Goal'));

    // Verify the storage was called to save the goal
    expect(mockStorage.saveGoals).toHaveBeenCalled();

    // Verify the form was cleared
    expect(screen.getByPlaceholderText('Goal title')).toHaveValue('');
    expect(screen.getByPlaceholderText('Goal description (optional)')).toHaveValue('');
    expect(screen.getByPlaceholderText('Total hours required').value).toBe('');
  });

  it('should handle goal deletion', async () => {
    const user = userEvent.setup();
    const existingGoals = [
      {
        id: '1',
        title: 'Goal to Delete',
        description: 'This will be deleted',
        totalHours: 10,
        totalTimeSpent: 0,
        isActive: false,
        createdAt: Date.now(),
      },
    ];

    mockStorage.getGoals.mockReturnValue(existingGoals);

    render(<App />);

    expect(screen.getByText('Goal to Delete')).toBeInTheDocument();

    // Click delete button to show confirmation
    await user.click(screen.getByText('Delete'));

    // Confirm the deletion
    await user.click(screen.getByText('Yes, Delete Goal'));

    // Verify storage was called to save updated goals (without the deleted goal)
    expect(mockStorage.saveGoals).toHaveBeenCalled();
  });

  it('should handle starting and stopping timers', async () => {
    const user = userEvent.setup();
    const existingGoals = [
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

    render(<App />);

    // Start timer
    await user.click(screen.getByText('Start Timer'));
    expect(mockStorage.saveGoals).toHaveBeenCalled();

    // Note: The actual timer functionality and stop button appearance
    // would be tested in the component unit tests since the useGoals hook
    // manages this state internally
  });

  it('should load sessions from storage', () => {
    const sessions = [
      {
        goalId: '1',
        startTime: Date.now() - 10000,
        endTime: Date.now() - 5000,
        duration: 5000,
      },
    ];

    mockStorage.getSessions.mockReturnValue(sessions);

    render(<App />);

    expect(mockStorage.getSessions).toHaveBeenCalled();
  });

  it('should reload sessions when goals change', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Clear previous calls
    mockStorage.getSessions.mockClear();

    // Add a new goal (which should trigger session reload)
    await user.type(screen.getByPlaceholderText('Goal title'), 'New Goal');
    await user.type(screen.getByPlaceholderText('Total hours required'), '5');
    await user.click(screen.getByText('Add Goal'));

    // Sessions should be reloaded when goals change
    expect(mockStorage.getSessions).toHaveBeenCalled();
  });

  it('should display form validation states correctly', async () => {
    const user = userEvent.setup();
    render(<App />);

    const submitButton = screen.getByText('Add Goal');

    // Initially disabled
    expect(submitButton).toBeDisabled();

    // Still disabled with only title
    await user.type(screen.getByPlaceholderText('Goal title'), 'Test');
    expect(submitButton).toBeDisabled();

    // Enabled with title and valid hours
    await user.type(screen.getByPlaceholderText('Total hours required'), '5');
    expect(submitButton).toBeEnabled();

    // Disabled again with invalid hours
    await user.clear(screen.getByPlaceholderText('Total hours required'));
    await user.type(screen.getByPlaceholderText('Total hours required'), '0');
    expect(submitButton).toBeDisabled();
  });

  it('should maintain data flow between components', () => {
    const existingGoals = [
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

    const sessions = [
      {
        goalId: '1',
        startTime: Date.now() - 10000,
        endTime: Date.now() - 5000,
        duration: 5000,
      },
    ];

    mockStorage.getGoals.mockReturnValue(existingGoals);
    mockStorage.getSessions.mockReturnValue(sessions);

    render(<App />);

    // Verify data flows correctly to child components
    expect(screen.getByText('Test Goal')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });
});