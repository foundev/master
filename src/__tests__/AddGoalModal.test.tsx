import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddGoalModal } from '../components/AddGoalModal';

describe('AddGoalModal', () => {
  const mockOnClose = jest.fn();
  const mockOnAddGoal = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when closed', () => {
    render(
      <AddGoalModal
        isOpen={false}
        onClose={mockOnClose}
        onAddGoal={mockOnAddGoal}
      />
    );

    expect(screen.queryByText('Add New Goal')).not.toBeInTheDocument();
  });

  it('should render when open', () => {
    render(
      <AddGoalModal
        isOpen={true}
        onClose={mockOnClose}
        onAddGoal={mockOnAddGoal}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Goal title')).toBeInTheDocument();
  });

  it('should call onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <AddGoalModal
        isOpen={true}
        onClose={mockOnClose}
        onAddGoal={mockOnAddGoal}
      />
    );

    await user.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call onAddGoal and onClose when form is submitted', async () => {
    const user = userEvent.setup();
    render(
      <AddGoalModal
        isOpen={true}
        onClose={mockOnClose}
        onAddGoal={mockOnAddGoal}
      />
    );

    await user.type(screen.getByPlaceholderText('Goal title'), 'Test Goal');
    await user.type(screen.getByPlaceholderText('Goal description (optional)'), 'Test Description');
    await user.type(screen.getByPlaceholderText('Total hours required'), '10');

    await user.click(screen.getByText('Add Goal'));

    expect(mockOnAddGoal).toHaveBeenCalledWith('Test Goal', 'Test Description', 10);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should handle escape key to close modal', async () => {
    render(
      <AddGoalModal
        isOpen={true}
        onClose={mockOnClose}
        onAddGoal={mockOnAddGoal}
      />
    );

    // Simulate escape key press on the dialog element
    const dialog = screen.getByRole('dialog');
    fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape' });

    expect(mockOnClose).toHaveBeenCalled();
  });
});
