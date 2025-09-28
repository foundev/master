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

    expect(screen.getByTestId('goal-title-input')).toBeInTheDocument();
    expect(screen.getByTestId('goal-description-input')).toBeInTheDocument();
    expect(screen.getByTestId('goal-hours-input')).toBeInTheDocument();
    expect(screen.getByText('Add Goal')).toBeInTheDocument();
  });

  it('should have submit button disabled initially', () => {
    render(<GoalForm onSubmit={mockOnSubmit} />);

    expect(screen.getByText('Add Goal')).toBeDisabled();
  });

  it('should enable submit button when valid data is entered', async () => {
    const user = userEvent.setup();
    render(<GoalForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByTestId('goal-title-input'), 'Test Goal');
    await user.type(screen.getByTestId('goal-hours-input'), '10');

    expect(screen.getByText('Add Goal')).toBeEnabled();
  });

  it('should keep submit button disabled with empty title', async () => {
    const user = userEvent.setup();
    render(<GoalForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByTestId('goal-hours-input'), '10');

    expect(screen.getByText('Add Goal')).toBeDisabled();
  });

  it('should keep submit button disabled with invalid hours', async () => {
    const user = userEvent.setup();
    render(<GoalForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByTestId('goal-title-input'), 'Test Goal');
    await user.type(screen.getByTestId('goal-hours-input'), '0');

    expect(screen.getByText('Add Goal')).toBeDisabled();
  });

  it('should keep submit button disabled with negative hours', async () => {
    const user = userEvent.setup();
    render(<GoalForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByTestId('goal-title-input'), 'Test Goal');
    await user.type(screen.getByTestId('goal-hours-input'), '-5');

    expect(screen.getByText('Add Goal')).toBeDisabled();
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    render(<GoalForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByTestId('goal-title-input'), 'Test Goal');
    await user.type(screen.getByTestId('goal-description-input'), 'Test Description');
    await user.type(screen.getByTestId('goal-hours-input'), '10.5');

    await user.click(screen.getByText('Add Goal'));

    expect(mockOnSubmit).toHaveBeenCalledWith('Test Goal', 'Test Description', 10.5);
  });

  it('should submit form with empty description', async () => {
    const user = userEvent.setup();
    render(<GoalForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByTestId('goal-title-input'), 'Test Goal');
    await user.type(screen.getByTestId('goal-hours-input'), '5');

    await user.click(screen.getByText('Add Goal'));

    expect(mockOnSubmit).toHaveBeenCalledWith('Test Goal', '', 5);
  });

  it('should trim whitespace from title and description', async () => {
    const user = userEvent.setup();
    render(<GoalForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByTestId('goal-title-input'), '  Test Goal  ');
    await user.type(screen.getByTestId('goal-description-input'), '  Test Description  ');
    await user.type(screen.getByTestId('goal-hours-input'), '5');

    await user.click(screen.getByText('Add Goal'));

    expect(mockOnSubmit).toHaveBeenCalledWith('Test Goal', 'Test Description', 5);
  });

  it('should not submit form with only whitespace title', async () => {
    const user = userEvent.setup();
    render(<GoalForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByTestId('goal-title-input'), '   ');
    await user.type(screen.getByTestId('goal-hours-input'), '5');

    expect(screen.getByText('Add Goal')).toBeDisabled();
  });

  it('should clear form after successful submission', async () => {
    const user = userEvent.setup();
    render(<GoalForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByTestId('goal-title-input');
    const descriptionInput = screen.getByTestId('goal-description-input');
    const hoursInput = screen.getByTestId('goal-hours-input');

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

    await user.type(screen.getByTestId('goal-title-input'), 'Test Goal');
    await user.type(screen.getByTestId('goal-hours-input'), '5');
    await user.keyboard('{Enter}');

    expect(mockOnSubmit).toHaveBeenCalledWith('Test Goal', '', 5);
  });

  it('should not submit when form is invalid and enter is pressed', async () => {
    const user = userEvent.setup();
    render(<GoalForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByTestId('goal-title-input'), 'Test Goal');
    await user.keyboard('{Enter}');

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should accept decimal hours', async () => {
    const user = userEvent.setup();
    render(<GoalForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByTestId('goal-title-input'), 'Test Goal');
    await user.type(screen.getByTestId('goal-hours-input'), '2.5');

    await user.click(screen.getByText('Add Goal'));

    expect(mockOnSubmit).toHaveBeenCalledWith('Test Goal', '', 2.5);
  });

  it('should not submit with non-numeric hours', async () => {
    const user = userEvent.setup();
    render(<GoalForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByTestId('goal-title-input'), 'Test Goal');
    await user.type(screen.getByTestId('goal-hours-input'), 'abc');

    expect(screen.getByText('Add Goal')).toBeDisabled();
  });

  describe('Goal template autocomplete', () => {
    it('should show suggestions when typing', async () => {
      const user = userEvent.setup();
      render(<GoalForm onSubmit={mockOnSubmit} />);

      await user.type(screen.getByTestId('goal-title-input'), 'french');

      await waitFor(() => {
        expect(screen.getByTestId('goal-suggestions')).toBeInTheDocument();
        expect(screen.getByTestId('suggestion-lang-french')).toBeInTheDocument();
      });
    });

    it('should auto-fill form when selecting a language template', async () => {
      const user = userEvent.setup();
      render(<GoalForm onSubmit={mockOnSubmit} />);

      await user.type(screen.getByTestId('goal-title-input'), 'french');

      await waitFor(() => {
        expect(screen.getByTestId('suggestion-lang-french')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('suggestion-lang-french'));

      expect(screen.getByTestId('goal-title-input')).toHaveValue('Learn French');
      expect(screen.getByTestId('goal-description-input')).toHaveValue('Achieve conversational fluency in French');
      expect(screen.getByTestId('goal-hours-input')).toHaveValue(1200);
    });

    it('should auto-fill form when selecting a programming template', async () => {
      const user = userEvent.setup();
      render(<GoalForm onSubmit={mockOnSubmit} />);

      await user.type(screen.getByTestId('goal-title-input'), 'react');

      await waitFor(() => {
        expect(screen.getByTestId('suggestion-prog-react')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('suggestion-prog-react'));

      expect(screen.getByTestId('goal-title-input')).toHaveValue('Master React Development');
      expect(screen.getByTestId('goal-description-input')).toHaveValue('Become proficient in React and modern frontend development');
      expect(screen.getByTestId('goal-hours-input')).toHaveValue(200);
    });

    it('should hide suggestions when clicking outside', async () => {
      const user = userEvent.setup();
      render(<GoalForm onSubmit={mockOnSubmit} />);

      await user.type(screen.getByTestId('goal-title-input'), 'french');

      await waitFor(() => {
        expect(screen.getByTestId('goal-suggestions')).toBeInTheDocument();
      });

      await user.click(document.body);

      await waitFor(() => {
        expect(screen.queryByTestId('goal-suggestions')).not.toBeInTheDocument();
      });
    });

    it('should navigate suggestions with keyboard', async () => {
      const user = userEvent.setup();
      render(<GoalForm onSubmit={mockOnSubmit} />);

      await user.type(screen.getByTestId('goal-title-input'), 'learn');

      await waitFor(() => {
        expect(screen.getByTestId('goal-suggestions')).toBeInTheDocument();
      });

      // Press arrow down to select first suggestion
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      // Should auto-fill with the first suggestion
      expect(screen.getByTestId('goal-title-input')).not.toHaveValue('learn');
      expect(screen.getByTestId('goal-hours-input')).not.toHaveValue('');
    });

    it('should not show suggestions for short input', async () => {
      const user = userEvent.setup();
      render(<GoalForm onSubmit={mockOnSubmit} />);

      await user.type(screen.getByTestId('goal-title-input'), 'a');

      expect(screen.queryByTestId('goal-suggestions')).not.toBeInTheDocument();
    });

    it('should filter suggestions based on keywords', async () => {
      const user = userEvent.setup();
      render(<GoalForm onSubmit={mockOnSubmit} />);

      await user.type(screen.getByTestId('goal-title-input'), 'programming');

      await waitFor(() => {
        expect(screen.getByTestId('goal-suggestions')).toBeInTheDocument();
        expect(screen.getByTestId('suggestion-prog-react')).toBeInTheDocument();
        expect(screen.getByTestId('suggestion-prog-python')).toBeInTheDocument();
      });
    });
  });
});