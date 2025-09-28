import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GoalForm } from '../components/GoalForm';

describe('GoalForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render form fields', () => {
    render(<GoalForm onSubmit={mockOnSubmit} />);

    expect(screen.getByPlaceholderText('Goal title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Goal description (optional)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Total hours required')).toBeInTheDocument();
    expect(screen.getByText('Add Goal')).toBeInTheDocument();
  });

  it('should have submit button disabled initially', () => {
    render(<GoalForm onSubmit={mockOnSubmit} />);

    expect(screen.getByText('Add Goal')).toBeDisabled();
  });

  it('should enable submit button when valid data is entered', async () => {
    const user = userEvent.setup();
    render(<GoalForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByPlaceholderText('Goal title'), 'Test Goal');
    await user.type(screen.getByPlaceholderText('Total hours required'), '10');

    expect(screen.getByText('Add Goal')).toBeEnabled();
  });

  it('should keep submit button disabled with empty title', async () => {
    const user = userEvent.setup();
    render(<GoalForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByPlaceholderText('Total hours required'), '10');

    expect(screen.getByText('Add Goal')).toBeDisabled();
  });

  it('should keep submit button disabled with invalid hours', async () => {
    const user = userEvent.setup();
    render(<GoalForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByPlaceholderText('Goal title'), 'Test Goal');
    await user.type(screen.getByPlaceholderText('Total hours required'), '0');

    expect(screen.getByText('Add Goal')).toBeDisabled();
  });

  it('should keep submit button disabled with negative hours', async () => {
    const user = userEvent.setup();
    render(<GoalForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByPlaceholderText('Goal title'), 'Test Goal');
    await user.type(screen.getByPlaceholderText('Total hours required'), '-5');

    expect(screen.getByText('Add Goal')).toBeDisabled();
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    render(<GoalForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByPlaceholderText('Goal title'), 'Test Goal');
    await user.type(screen.getByPlaceholderText('Goal description (optional)'), 'Test Description');
    await user.type(screen.getByPlaceholderText('Total hours required'), '10.5');

    await user.click(screen.getByText('Add Goal'));

    expect(mockOnSubmit).toHaveBeenCalledWith('Test Goal', 'Test Description', 10.5);
  });

  it('should submit form with empty description', async () => {
    const user = userEvent.setup();
    render(<GoalForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByPlaceholderText('Goal title'), 'Test Goal');
    await user.type(screen.getByPlaceholderText('Total hours required'), '5');

    await user.click(screen.getByText('Add Goal'));

    expect(mockOnSubmit).toHaveBeenCalledWith('Test Goal', '', 5);
  });

  it('should trim whitespace from title and description', async () => {
    const user = userEvent.setup();
    render(<GoalForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByPlaceholderText('Goal title'), '  Test Goal  ');
    await user.type(screen.getByPlaceholderText('Goal description (optional)'), '  Test Description  ');
    await user.type(screen.getByPlaceholderText('Total hours required'), '5');

    await user.click(screen.getByText('Add Goal'));

    expect(mockOnSubmit).toHaveBeenCalledWith('Test Goal', 'Test Description', 5);
  });

  it('should not submit form with only whitespace title', async () => {
    const user = userEvent.setup();
    render(<GoalForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByPlaceholderText('Goal title'), '   ');
    await user.type(screen.getByPlaceholderText('Total hours required'), '5');

    expect(screen.getByText('Add Goal')).toBeDisabled();
  });

  it('should clear form after successful submission', async () => {
    const user = userEvent.setup();
    render(<GoalForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByPlaceholderText('Goal title');
    const descriptionInput = screen.getByPlaceholderText('Goal description (optional)');
    const hoursInput = screen.getByPlaceholderText('Total hours required');

    await user.type(titleInput, 'Test Goal');
    await user.type(descriptionInput, 'Test Description');
    await user.type(hoursInput, '10');

    await user.click(screen.getByText('Add Goal'));

    expect(titleInput).toHaveValue('');
    expect(descriptionInput).toHaveValue('');
    expect(hoursInput.value).toBe('');
  });

  it('should handle form submission via enter key', async () => {
    const user = userEvent.setup();
    render(<GoalForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByPlaceholderText('Goal title'), 'Test Goal');
    await user.type(screen.getByPlaceholderText('Total hours required'), '5');
    await user.keyboard('{Enter}');

    expect(mockOnSubmit).toHaveBeenCalledWith('Test Goal', '', 5);
  });

  it('should not submit when form is invalid and enter is pressed', async () => {
    const user = userEvent.setup();
    render(<GoalForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByPlaceholderText('Goal title'), 'Test Goal');
    await user.keyboard('{Enter}');

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should accept decimal hours', async () => {
    const user = userEvent.setup();
    render(<GoalForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByPlaceholderText('Goal title'), 'Test Goal');
    await user.type(screen.getByPlaceholderText('Total hours required'), '2.5');

    await user.click(screen.getByText('Add Goal'));

    expect(mockOnSubmit).toHaveBeenCalledWith('Test Goal', '', 2.5);
  });

  it('should not submit with non-numeric hours', async () => {
    const user = userEvent.setup();
    render(<GoalForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByPlaceholderText('Goal title'), 'Test Goal');
    await user.type(screen.getByPlaceholderText('Total hours required'), 'abc');

    expect(screen.getByText('Add Goal')).toBeDisabled();
  });
});