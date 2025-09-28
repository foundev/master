import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GoalCard } from '../components/GoalCard';
import { Goal, TimeSession } from '../types';

// Mock the useTimer hook
jest.mock('../hooks/useTimer', () => ({
  useTimer: jest.fn(),
}));

// Mock the time utilities
jest.mock('../utils/time', () => ({
  formatDuration: jest.fn((ms) => `${Math.floor(ms / 1000)}s`),
  calculateEstimatedCompletion: jest.fn(),
}));

const mockUseTimer = require('../hooks/useTimer').useTimer as jest.MockedFunction<typeof import('../hooks/useTimer').useTimer>;
const mockCalculateEstimatedCompletion = require('../utils/time').calculateEstimatedCompletion as jest.MockedFunction<typeof import('../utils/time').calculateEstimatedCompletion>;

describe('GoalCard', () => {
  const mockGoal: Goal = {
    id: '1',
    title: 'Test Goal',
    description: 'Test Description',
    totalHours: 10,
    totalTimeSpent: 5000, // 5 seconds
    isActive: false,
    createdAt: Date.now(),
  };

  const mockSessions: TimeSession[] = [
    {
      goalId: '1',
      startTime: Date.now() - 10000,
      endTime: Date.now() - 5000,
      duration: 5000,
    },
  ];

  const mockProps = {
    goal: mockGoal,
    sessions: mockSessions,
    onStart: jest.fn(),
    onStop: jest.fn(),
    onDelete: jest.fn(),
    onAddManualTime: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTimer.mockReturnValue(0);
    mockCalculateEstimatedCompletion.mockReturnValue(null);
  });

  it('should render goal title and description', () => {
    render(<GoalCard {...mockProps} />);

    expect(screen.getByText('Test Goal')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should not render description when not provided', () => {
    const goalWithoutDescription = { ...mockGoal, description: '' };
    render(<GoalCard {...mockProps} goal={goalWithoutDescription} />);

    expect(screen.getByText('Test Goal')).toBeInTheDocument();
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });

  it('should display total time and progress', () => {
    render(<GoalCard {...mockProps} />);

    expect(screen.getByText(/Total time: 5s \(0\.0h \/ 10h\)/)).toBeInTheDocument();
    expect(screen.getByText(/Remaining: 10\.0 hours/)).toBeInTheDocument();
  });

  it('should show start button when goal is not active', () => {
    render(<GoalCard {...mockProps} />);

    expect(screen.getByText('Start Timer')).toBeInTheDocument();
    expect(screen.queryByText('Stop Timer')).not.toBeInTheDocument();
  });

  it('should show stop button when goal is active', () => {
    const activeGoal = { ...mockGoal, isActive: true };
    render(<GoalCard {...mockProps} goal={activeGoal} />);

    expect(screen.getByText('Stop Timer')).toBeInTheDocument();
    expect(screen.queryByText('Start Timer')).not.toBeInTheDocument();
  });

  it('should display current session timer when active', () => {
    mockUseTimer.mockReturnValue(3000); // 3 seconds
    const activeGoal = { ...mockGoal, isActive: true, startTime: Date.now() - 3000 };
    render(<GoalCard {...mockProps} goal={activeGoal} />);

    expect(screen.getByText('Current session: 3s')).toBeInTheDocument();
  });

  it('should not display current session timer when inactive', () => {
    render(<GoalCard {...mockProps} />);

    expect(screen.queryByText(/Current session:/)).not.toBeInTheDocument();
  });

  it('should call onStart when start button is clicked', () => {
    render(<GoalCard {...mockProps} />);

    fireEvent.click(screen.getByText('Start Timer'));

    expect(mockProps.onStart).toHaveBeenCalledTimes(1);
  });

  it('should call onStop when stop button is clicked', () => {
    const activeGoal = { ...mockGoal, isActive: true };
    render(<GoalCard {...mockProps} goal={activeGoal} />);

    fireEvent.click(screen.getByText('Stop Timer'));

    expect(mockProps.onStop).toHaveBeenCalledTimes(1);
  });

  it('should call onDelete when delete button is clicked and confirmed', () => {
    render(<GoalCard {...mockProps} />);

    // Click delete button to show confirmation
    fireEvent.click(screen.getByText('Delete'));

    // Confirm the deletion
    fireEvent.click(screen.getByText('Yes, Delete Goal'));

    expect(mockProps.onDelete).toHaveBeenCalledTimes(1);
  });

  it('should calculate and display progress percentage', () => {
    const goalWithProgress = { ...mockGoal, totalTimeSpent: 18000000 }; // 5 hours in ms
    render(<GoalCard {...mockProps} goal={goalWithProgress} />);

    const progressBar = document.querySelector('.progress-fill');
    expect(progressBar).toHaveStyle('width: 50%'); // 5h / 10h = 50%
  });

  it('should cap progress at 100%', () => {
    const completedGoal = { ...mockGoal, totalTimeSpent: 72000000 }; // 20 hours in ms (more than goal)
    render(<GoalCard {...mockProps} goal={completedGoal} />);

    const progressBar = document.querySelector('.progress-fill');
    expect(progressBar).toHaveStyle('width: 100%');
  });

  it('should display estimated completion when available', () => {
    const estimatedDate = new Date('2024-12-31');
    mockCalculateEstimatedCompletion.mockReturnValue(estimatedDate);

    render(<GoalCard {...mockProps} />);

    expect(screen.getByText(/Estimated completion:/)).toBeInTheDocument();
  });

  it('should not display estimated completion when not available', () => {
    mockCalculateEstimatedCompletion.mockReturnValue(null);

    render(<GoalCard {...mockProps} />);

    expect(screen.queryByText(/Estimated completion:/)).not.toBeInTheDocument();
  });

  it('should include current session time in total time calculation', () => {
    mockUseTimer.mockReturnValue(2000); // 2 seconds current session
    const activeGoal = { ...mockGoal, isActive: true, startTime: Date.now() - 2000 };
    render(<GoalCard {...mockProps} goal={activeGoal} />);

    // Total should be 5000ms (existing) + 2000ms (current session) = 7000ms = 7s
    expect(screen.getByText(/Total time: 7s/)).toBeInTheDocument();
  });

  it('should show Add Time button', () => {
    render(<GoalCard {...mockProps} />);

    expect(screen.getByText('Add Time')).toBeInTheDocument();
  });

  it('should show manual time entry form when Add Time is clicked', () => {
    render(<GoalCard {...mockProps} />);

    fireEvent.click(screen.getByText('Add Time'));

    expect(screen.getByPlaceholderText('Hours to add')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should hide manual time entry form when Cancel is clicked', () => {
    render(<GoalCard {...mockProps} />);

    fireEvent.click(screen.getByText('Add Time'));
    expect(screen.getByPlaceholderText('Hours to add')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByPlaceholderText('Hours to add')).not.toBeInTheDocument();
  });

  it('should call onAddManualTime when manual time form is submitted', () => {
    render(<GoalCard {...mockProps} />);

    fireEvent.click(screen.getByText('Add Time'));

    const input = screen.getByPlaceholderText('Hours to add');
    fireEvent.change(input, { target: { value: '2.5' } });

    const submitButton = screen.getByText('Add Time');
    fireEvent.click(submitButton);

    expect(mockProps.onAddManualTime).toHaveBeenCalledWith(2.5, undefined);
  });

  it('should clear form and hide it after successful submission', () => {
    render(<GoalCard {...mockProps} />);

    fireEvent.click(screen.getByText('Add Time'));

    const input = screen.getByPlaceholderText('Hours to add');
    fireEvent.change(input, { target: { value: '1' } });

    const submitButton = screen.getByText('Add Time');
    fireEvent.click(submitButton);

    expect(screen.queryByPlaceholderText('Hours to add')).not.toBeInTheDocument();
  });

  it('should disable submit button when no hours entered', () => {
    render(<GoalCard {...mockProps} />);

    fireEvent.click(screen.getByText('Add Time'));

    const submitButton = screen.getByText('Add Time');
    expect(submitButton).toBeDisabled();
  });

  it('should disable submit button when invalid hours entered', () => {
    render(<GoalCard {...mockProps} />);

    fireEvent.click(screen.getByText('Add Time'));

    const input = screen.getByPlaceholderText('Hours to add');
    fireEvent.change(input, { target: { value: '0' } });

    const submitButton = screen.getByText('Add Time');
    expect(submitButton).toBeDisabled();
  });

  describe('Manual time with custom dates', () => {
    it('should show date input when manual entry form is open', () => {
      render(<GoalCard {...mockProps} />);

      fireEvent.click(screen.getByText('Add Time'));

      expect(screen.getByPlaceholderText('Date (optional)')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Hours to add')).toBeInTheDocument();
    });

    it('should call onAddManualTime with custom date when provided', () => {
      render(<GoalCard {...mockProps} />);

      fireEvent.click(screen.getByText('Add Time'));

      const hoursInput = screen.getByPlaceholderText('Hours to add');
      const dateInput = screen.getByPlaceholderText('Date (optional)');

      fireEvent.change(hoursInput, { target: { value: '1.5' } });
      fireEvent.change(dateInput, { target: { value: '2024-01-15' } });

      const submitButton = screen.getByText('Add Time');
      fireEvent.click(submitButton);

      expect(mockProps.onAddManualTime).toHaveBeenCalledWith(1.5, new Date('2024-01-15'));
    });

    it('should call onAddManualTime with undefined date when no date provided', () => {
      render(<GoalCard {...mockProps} />);

      fireEvent.click(screen.getByText('Add Time'));

      const hoursInput = screen.getByPlaceholderText('Hours to add');
      fireEvent.change(hoursInput, { target: { value: '2' } });

      const submitButton = screen.getByText('Add Time');
      fireEvent.click(submitButton);

      expect(mockProps.onAddManualTime).toHaveBeenCalledWith(2, undefined);
    });

    it('should clear both hours and date inputs after successful submission', () => {
      render(<GoalCard {...mockProps} />);

      fireEvent.click(screen.getByText('Add Time'));

      const hoursInput = screen.getByPlaceholderText('Hours to add');
      const dateInput = screen.getByPlaceholderText('Date (optional)');

      fireEvent.change(hoursInput, { target: { value: '3' } });
      fireEvent.change(dateInput, { target: { value: '2024-01-10' } });

      const submitButton = screen.getByText('Add Time');
      fireEvent.click(submitButton);

      // Form should be hidden after submission
      expect(screen.queryByPlaceholderText('Hours to add')).not.toBeInTheDocument();
      expect(screen.queryByPlaceholderText('Date (optional)')).not.toBeInTheDocument();
    });

    it('should have max date set to today', () => {
      const today = new Date().toISOString().split('T')[0];
      render(<GoalCard {...mockProps} />);

      fireEvent.click(screen.getByText('Add Time'));

      const dateInput = screen.getByPlaceholderText('Date (optional)');
      expect(dateInput).toHaveAttribute('max', today);
    });

    it('should handle empty date input as undefined', () => {
      render(<GoalCard {...mockProps} />);

      fireEvent.click(screen.getByText('Add Time'));

      const hoursInput = screen.getByPlaceholderText('Hours to add');
      const dateInput = screen.getByPlaceholderText('Date (optional)');

      fireEvent.change(hoursInput, { target: { value: '1' } });
      fireEvent.change(dateInput, { target: { value: '2024-01-15' } });
      fireEvent.change(dateInput, { target: { value: '' } }); // Clear date

      const submitButton = screen.getByText('Add Time');
      fireEvent.click(submitButton);

      expect(mockProps.onAddManualTime).toHaveBeenCalledWith(1, undefined);
    });
  });
});